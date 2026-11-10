import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { sql, FREE_AI_LIMIT } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const maxDuration = 60;

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

const CATEGORIES = ["Seating", "Tables & Desks", "Beds & Mattresses", "Storage", "Lighting", "Rugs & Textiles", "Wall Decor", "Kitchen", "Electronics", "Other"];
const CONDITIONS = ["Like new", "Good", "Fair", "Well loved"];

const SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string", description: "Short listing title, under 60 characters" },
    description: { type: "string", description: "2-4 sentence listing description written in the seller's voice" },
    category: { type: "string", enum: CATEGORIES },
    condition: { type: "string", enum: CONDITIONS },
    suggested_price: { type: "number", description: "Suggested asking price in US dollars" },
    price_low: { type: "number" },
    price_high: { type: "number" },
    price_reasoning: { type: "string", description: "One or two sentences explaining the price" },
    tips: { type: "array", items: { type: "string" }, description: "Up to 3 short tips to help it sell faster" },
  },
  required: ["title", "description", "category", "condition", "suggested_price", "price_low", "price_high", "price_reasoning", "tips"],
  additionalProperties: false,
};

const SYSTEM = `You help college students write listings on Reduce, Reuse, CampusSupplies, a marketplace where students buy and sell used furniture and decor from their dorms, apartments and houses.

Write listings that are honest, specific and friendly. Mention brand, size, color, wear and anything a buyer needs to know to carry it home (weight, whether it comes apart, fits in a car). Do not invent defects or features you can't see or weren't told about.

Price for a student-to-student resale market: well below retail, usually 20-50% of the new price depending on condition, and lower for bulky items during move-out season when supply is high. Give a single suggested price plus a realistic low-high range in whole dollars.`;

export async function POST(req) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Log in to use the listing helper." }, { status: 401 });

  if (user.plan !== "pro" && user.ai_uses >= FREE_AI_LIMIT) {
    return NextResponse.json(
      { error: `You've used your ${FREE_AI_LIMIT} free AI listings. Upgrade to Seller Pro for unlimited.`, upgrade: true },
      { status: 402 }
    );
  }

  const { notes = "", image } = await req.json();
  if (!notes.trim() && !image) {
    return NextResponse.json({ error: "Add a photo or a few words about the item." }, { status: 400 });
  }

  const content = [];
  if (image?.data && image?.mediaType) {
    content.push({ type: "image", source: { type: "base64", media_type: image.mediaType, data: image.data } });
  }
  content.push({
    type: "text",
    text: `Seller's notes: ${notes.trim() || "(none - work from the photo)"}\n\nWrite the listing.`,
  });

  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM,
      output_config: { effort: "medium", format: { type: "json_schema", schema: SCHEMA } },
      messages: [{ role: "user", content }],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({ error: "The assistant couldn't help with this item. Try describing it differently." }, { status: 422 });
    }
    const text = response.content.find((b) => b.type === "text")?.text;
    if (!text) throw new Error("No text in response");
    const listing = JSON.parse(text);

    await sql`UPDATE users SET ai_uses = ai_uses + 1 WHERE id = ${user.id}`;
    return NextResponse.json({ listing });
  } catch (err) {
    console.error("AI listing error:", err);
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: "The AI key is missing or wrong. Check ANTHROPIC_API_KEY." }, { status: 500 });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "The AI is busy right now. Try again in a minute." }, { status: 429 });
    }
    return NextResponse.json({ error: "Something went wrong writing the listing. Try again." }, { status: 500 });
  }
}
