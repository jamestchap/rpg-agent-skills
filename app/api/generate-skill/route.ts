import { NextResponse } from "next/server";
import { z } from "zod";
import { buildPrompt } from "../../../lib/promptBuilder";
import { CharacterSheet, ProviderName } from "../../../lib/types";

const requestSchema = z.object({
  characterSheet: z.custom<CharacterSheet>(),
  providerConfig: z.object({
    provider: z.custom<ProviderName>(),
    model: z.string().min(1),
    apiKey: z.string().optional(),
    temperature: z.number().min(0).max(1)
  })
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = requestSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { characterSheet, providerConfig } = parsed.data;
    const prompt = buildPrompt(characterSheet);

    if (providerConfig.provider === "ollama") {
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: providerConfig.model,
          messages: [{ role: "user", content: prompt }],
          temperature: providerConfig.temperature
        })
      });
      if (!response.ok) {
        return NextResponse.json(
          { error: "Ollama request failed. Check that Ollama is running." },
          { status: 502 }
        );
      }
      const data = await response.json();
      const content = data.message?.content ?? "";
      return NextResponse.json({
        skillMarkdown: content,
        meta: {
          temperatureUsed: providerConfig.temperature,
          modelUsed: providerConfig.model
        }
      });
    }

    if (!providerConfig.apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key is required." },
        { status: 400 }
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
          messages: [{ role: "user", content: prompt }]
        })
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "OpenRouter request failed. Check your API key and model." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({
      skillMarkdown: content,
      meta: {
        temperatureUsed: providerConfig.temperature,
        modelUsed: providerConfig.model
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
