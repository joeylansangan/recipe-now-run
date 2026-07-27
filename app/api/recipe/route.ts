import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const MODEL = "claude-sonnet-5";

const RECIPE_SCHEMA = {
  type: "object",
  properties: {
    dish: { type: "string", description: "The dish name, cleaned up." },
    summary: {
      type: "string",
      description: "One or two sentences on what the dish is.",
    },
    servings: { type: "string", description: "e.g. '4 servings'" },
    prepTime: { type: "string", description: "e.g. '15 minutes'" },
    cookTime: { type: "string", description: "e.g. '40 minutes'" },
    ingredients: {
      type: "array",
      items: { type: "string" },
      description: "Each ingredient with its quantity, e.g. '2 tbsp olive oil'.",
    },
    steps: {
      type: "array",
      items: { type: "string" },
      description: "Numbered-in-order steps. One action per step.",
    },
    tips: {
      type: "array",
      items: { type: "string" },
      description: "Up to 3 short tips. Empty array if there are none.",
    },
  },
  required: [
    "dish",
    "summary",
    "servings",
    "prepTime",
    "cookTime",
    "ingredients",
    "steps",
    "tips",
  ],
  additionalProperties: false,
} as const;

const SYSTEM = `You are a working cook writing a recipe for someone who is hungry now.
Give real quantities and real times. Keep steps short and physical — what to do, not why.
If the dish name is vague, pick the most common version and say which one in the summary.`;

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not set on the server." },
      { status: 500 },
    );
  }

  let dish: string;
  try {
    const body = await request.json();
    dish = String(body?.dish ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Bad request body." }, { status: 400 });
  }

  if (!dish) {
    return NextResponse.json({ error: "Tell me a dish first." }, { status: 400 });
  }
  if (dish.length > 120) {
    return NextResponse.json({ error: "That dish name is too long." }, { status: 400 });
  }

  const client = new Anthropic();

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 4000,
      thinking: { type: "disabled" },
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: RECIPE_SCHEMA },
      },
      system: SYSTEM,
      messages: [{ role: "user", content: `Write the recipe for: ${dish}` }],
    });

    const text = message.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") {
      return NextResponse.json(
        { error: "The model returned no recipe." },
        { status: 502 },
      );
    }

    const recipe = JSON.parse(text.text);

    // Real token counts, logged so cost can be measured rather than guessed.
    const usage = {
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
    };
    console.log(
      `[recipe] "${dish}" in=${usage.inputTokens} out=${usage.outputTokens}`,
    );

    return NextResponse.json({ recipe, usage });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Rate limited — try again in a moment." },
        { status: 429 },
      );
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "The Anthropic API key was rejected." },
        { status: 500 },
      );
    }
    console.error("[recipe] failed", error);
    return NextResponse.json(
      { error: "Could not get that recipe." },
      { status: 500 },
    );
  }
}
