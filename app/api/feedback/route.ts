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

// Temporary GET handler for Gemini diagnostics — remove after debugging
export async function GET() {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return Response.json({ status: "NO_KEY", message: "GEMINI_API_KEY is not set in Vercel environment variables" });
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ contents: [{ parts: [{ text: "Say hello" }] }] }),
      }
    );
    const body = await res.json();
    return Response.json({
      status:     res.ok ? "OK" : "ERROR",
      http_code:  res.status,
      key_prefix: key.slice(0, 8) + "...",
      response:   body,
    });
  } catch (e) {
    return Response.json({
      status:     "EXCEPTION",
      error:      String(e),
      key_prefix: key.slice(0, 8) + "...",
    });
  }
}
