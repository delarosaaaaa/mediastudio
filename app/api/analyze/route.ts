import { z } from "zod";
import { buildPrompt } from "@/lib/prompts";
import { DEMO_DATA } from "@/lib/demo-data";
import type { PhaseKey } from "@/lib/types";

const PHASE_KEYS: PhaseKey[] = [
  "briefing", "audience", "market",    "competitive",
  "strategy", "budget",   "mediaplan", "synthesis",
];

const BodySchema = z.object({
  phase:    z.enum(PHASE_KEYS as [PhaseKey, ...PhaseKey[]]),
  briefing: z.string().min(1).max(10_000),
  outputs:  z.record(z.string()).default({}),
  extra:    z.string().max(2_000).default(""),
});

function textStream(text: string): Response {
  const enc  = new TextEncoder();
  const body = new ReadableStream({
    async start(ctrl) {
      for (let i = 0; i < text.length; i += 40) {
        ctrl.enqueue(enc.encode(text.slice(i, i + 40)));
        await new Promise(r => setTimeout(r, 12));
      }
      ctrl.close();
    },
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" } });
}

export async function POST(req: Request) {
  let body: z.infer<typeof BodySchema>;
  try { body = BodySchema.parse(await req.json()); }
  catch { return new Response("Invalid request", { status: 400 }); }

  // ── Demo mode ──────────────────────────────────────────────
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const hasGeminiKey    = !!process.env.GEMINI_API_KEY;

  if (!hasAnthropicKey && !hasGeminiKey) {
    const demo = DEMO_DATA[body.phase];
    if (!demo) return new Response("Demo data not found", { status: 500 });
    await new Promise(r => setTimeout(r, 600 + Math.random() * 600));
    return textStream(demo);
  }

  const prompt = buildPrompt(body.phase, body.briefing, body.outputs, body.extra);

  // ── Anthropic ──────────────────────────────────────────────
  if (hasAnthropicKey) {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    try {
      const stream = client.messages.stream({
        model:      "claude-sonnet-4-20250514",
        max_tokens: 6000,
        messages:   [{ role: "user", content: prompt }],
      });
      const readable = new ReadableStream({
        async start(ctrl) {
          for await (const ev of stream) {
            if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
              ctrl.enqueue(new TextEncoder().encode(ev.delta.text));
            }
          }
          ctrl.close();
        },
      });
      return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" } });
    } catch (e) {
      return new Response(e instanceof Error ? e.message : "Anthropic error", { status: 502 });
    }
  }

  // ── Gemini ─────────────────────────────────────────────────
  if (hasGeminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      if (!res.ok) return new Response("Gemini error", { status: 502 });
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return textStream(text);
    } catch (e) {
      return new Response(e instanceof Error ? e.message : "Gemini error", { status: 502 });
    }
  }

  return new Response("No AI provider configured", { status: 500 });
}
