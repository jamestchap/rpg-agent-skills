import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  apiKey: z.string().min(1).max(200)
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = requestSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "OpenRouter API key is required." },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${parsed.data.apiKey}`
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "OpenRouter models request failed." },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    const data = await response.json();
    const models = Array.isArray(data?.data)
      ? data.data.map((model: { id?: string; name?: string }) => ({
          id: model.id ?? "",
          name: model.name ?? model.id ?? ""
        }))
      : [];

    return NextResponse.json(
      { models },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json(
      { error: message },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
