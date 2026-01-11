import { NextResponse } from "next/server";
import { z } from "zod";
import { buildPrompt } from "../../../lib/promptBuilder";

const domainKeys = [
  "frontend",
  "backend",
  "testing",
  "devops",
  "databases",
  "accessibility",
  "performance",
  "documentation"
] as const;

const domainKeySchema = z.enum(domainKeys);
const domainLevelSchema = z.number().min(0).max(5);

const characterSheetSchema = z.object({
  className: z.string().min(1),
  pointsTotal: z.number().min(0).max(30),
  levels: z.object({
    frontend: domainLevelSchema,
    backend: domainLevelSchema,
    testing: domainLevelSchema,
    devops: domainLevelSchema,
    databases: domainLevelSchema,
    accessibility: domainLevelSchema,
    performance: domainLevelSchema,
    documentation: domainLevelSchema
  }),
  topDomains: z.array(domainKeySchema),
  temperature: z.number().min(0).max(1),
  style: z.object({
    tone: z.string().min(1),
    format: z.literal("markdown")
  })
});

const requestSchema = z.object({
  characterSheet: characterSheetSchema,
  providerConfig: z.object({
    provider: z.enum(["ollama", "openrouter"]),
    model: z.string().min(1).max(200),
    apiKey: z.string().max(200).optional(),
    temperature: z.number().min(0).max(1)
  })
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = requestSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Invalid request payload. Provide a valid provider and character sheet details."
        },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const { characterSheet, providerConfig } = parsed.data;
    const prompt = buildPrompt(characterSheet);

    if (providerConfig.provider === "ollama") {
      let response: Response;
      try {
        response = await fetch("http://127.0.0.1:11434/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: providerConfig.model,
            messages: [{ role: "user", content: prompt }],
            temperature: providerConfig.temperature,
            stream: true
          })
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Ollama fetch failed.";
        return NextResponse.json(
          { error: message },
          { status: 502, headers: { "Cache-Control": "no-store" } }
        );
      }

      if (!response.ok || !response.body) {
        return NextResponse.json(
          { error: "Ollama request failed. Check that Ollama is running." },
          { status: 502, headers: { "Cache-Control": "no-store" } }
        );
      }

      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      let buffer = "";

      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          const reader = response.body!.getReader();
          try {
            while (true) {
              const { value, done } = await reader.read();
              if (done) {
                break;
              }
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() ?? "";
              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) {
                  continue;
                }
                try {
                  const json = JSON.parse(trimmed) as {
                    message?: { content?: string };
                  };
                  const content = json.message?.content;
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }
                } catch {
                  // Ignore malformed chunks.
                }
              }
            }
            const finalLine = buffer.trim();
            if (finalLine) {
              try {
                const json = JSON.parse(finalLine) as {
                  message?: { content?: string };
                };
                const content = json.message?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // Ignore malformed final chunk.
              }
            }
          } finally {
            controller.close();
          }
        }
      });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }

  if (!providerConfig.apiKey) {
    return NextResponse.json(
      { error: "OpenRouter API key is required." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${providerConfig.apiKey}`
        },
        body: JSON.stringify({
          model: providerConfig.model,
          temperature: providerConfig.temperature,
          messages: [{ role: "user", content: prompt }],
          stream: true
        })
      }
    );

    if (!response.ok || !response.body) {
      return NextResponse.json(
        { error: "OpenRouter request failed. Check your API key and model." },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let buffer = "";

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = response.body!.getReader();
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              break;
            }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) {
                continue;
              }
              const data = trimmed.slice(5).trim();
              if (!data || data === "[DONE]") {
                continue;
              }
              try {
                const json = JSON.parse(data) as {
                  choices?: Array<{
                    delta?: { content?: string };
                  }>;
                };
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // Ignore malformed chunks.
              }
            }
          }
          const finalLine = buffer.trim();
          if (finalLine.startsWith("data:")) {
            const data = finalLine.slice(5).trim();
            if (data && data !== "[DONE]") {
              try {
                const json = JSON.parse(data) as {
                  choices?: Array<{
                    delta?: { content?: string };
                  }>;
                };
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // Ignore malformed final chunk.
              }
            }
          }
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json(
      { error: message },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
