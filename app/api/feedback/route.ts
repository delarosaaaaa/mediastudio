import { z } from "zod";
import { createFeedbackEntry } from "@/lib/feedback";
import type { PhaseKey, FeedbackRating } from "@/lib/types";

const PHASE_KEYS = ["briefing","audience","competitive","funnel","channel","budget","mediaplan","synthesis"] as const;

const FeedbackSchema = z.object({
  phase:        z.enum(PHASE_KEYS),
  rating:       z.enum(["good", "improve", "bad"]),
  comment:      z.string().max(500).default(""),
  outputRaw:    z.string().max(500).default(""),
});

export async function POST(req: Request) {
  let body: z.infer<typeof FeedbackSchema>;
  try {
    body = FeedbackSchema.parse(await req.json());
  } catch {
    return new Response("Invalid request", { status: 400 });
  }

  const entry = createFeedbackEntry(
    body.phase as PhaseKey,
    body.rating as FeedbackRating,
    body.comment,
    body.outputRaw
  );

  // Save to Vercel KV if configured, otherwise log
  try {
    const { kv } = await import("@vercel/kv");
    await kv.lpush("feedback", JSON.stringify(entry));
    await kv.ltrim("feedback", 0, 999); // Keep last 1000 entries
  } catch {
    // KV not configured (local dev) — just log
    console.log("[Feedback]", entry);
  }

  return new Response("OK", { status: 200 });
}

// Temporary GET handler for Gemini diagnostics
export async function GET() {
  const key   = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  if (!key) return Response.json({ error: "GEMINI_API_KEY not set" });

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ contents: [{ parts: [{ text: "Say hello" }] }] }),
    }
  );
  const data = await res.json();
  return Response.json({
    model,
    key_prefix: key.slice(0, 8) + "...",
    http_status: res.status,
    ok: res.ok,
    response: data,
  });
}
