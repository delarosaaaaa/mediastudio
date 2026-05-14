import { z }            from "zod";
import { buildPrompt }  from "@/lib/prompts";
import { DEMO_DATA }    from "@/lib/demo-data";
import type { PhaseKey } from "@/lib/types";

// ─── Constants ────────────────────────────────────────────────

const PHASE_KEYS: PhaseKey[] = [
  "briefing", "audience", "market",    "competitive",
  "strategy", "budget",   "mediaplan", "synthesis",
];

const REQUEST_TIMEOUT_MS = 55_000; // 55 seconds — Gemini can be slow on large prompts

// ─── Validation schema ────────────────────────────────────────

const BodySchema = z.object({
  phase:    z.enum(PHASE_KEYS as [PhaseKey, ...PhaseKey[]]),
  briefing: z.string().min(1).max(10_000),
  outputs:  z.record(z.string()).default({}),
  extra:    z.string().max(2_000).default(""),
});

// ─── Helpers ──────────────────────────────────────────────────

function textStream(text: string): Response {
  const enc  = new TextEncoder();
  const body = new ReadableStream({
    async start(ctrl) {
      for (let i = 0; i < text.length; i += 400) {
        ctrl.enqueue(enc.encode(text.slice(i, i + 400)));
        await new Promise(r => setTimeout(r, 20));
      }
      ctrl.close();
    },
  });
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
  });
}

// Sanitised error — never echo raw SDK errors to the client
function aiErrorResponse(context: string, err: unknown): Response {
  console.error(`[analyze] ${context} error:`, err);
  return new Response("AI service temporarily unavailable. Please try again.", { status: 502 });
}

// ─── Route handler ────────────────────────────────────────────

export async function POST(req: Request) {
  // Validate body
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return new Response("Invalid request body.", { status: 400 });
  }

  // ── Demo mode (no API keys configured) ──────────────────────
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const hasGeminiKey    = !!process.env.GEMINI_API_KEY;

  if (!hasAnthropicKey && !hasGeminiKey) {
    const demo = DEMO_DATA[body.phase];
    if (!demo) return new Response("Demo data not found.", { status: 500 });
    await new Promise(r => setTimeout(r, 600 + Math.random() * 600));
    return textStream(demo);
  }

  const prompt = buildPrompt(body.phase, body.briefing, body.outputs, body.extra);

  // ── Anthropic ────────────────────────────────────────────────
  if (process.env.ANTHROPIC_API_KEY) {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const stream = anthropic.messages.stream({
        model:      "claude-sonnet-4-20250514",
        max_tokens: 6000,
        messages:   [{ role: "user", content: prompt }],
      });
      const readable = new ReadableStream({
        async start(ctrl) {
          try {
            for await (const ev of stream) {
              if (controller.signal.aborted) { ctrl.close(); return; }
              if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
                ctrl.enqueue(new TextEncoder().encode(ev.delta.text));
              }
            }
            ctrl.close();
          } catch (e) {
            ctrl.error(e);
          } finally {
            clearTimeout(timeout);
          }
        },
        cancel() { clearTimeout(timeout); },
      });
      return new Response(readable, {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
      });
    } catch (e) {
      clearTimeout(timeout);
      return aiErrorResponse("Anthropic", e);
    }
  }

  // ── Gemini ───────────────────────────────────────────────────
  if (hasGeminiKey) {
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL ?? "gemini-2.0-flash"}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method:  "POST",
          signal:  controller.signal,
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      clearTimeout(timeout);
      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        console.error(`[analyze] Gemini HTTP ${res.status}:`, errBody);
        return aiErrorResponse("Gemini HTTP", `status ${res.status}: ${errBody.slice(0, 200)}`);
      }
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (!text) {
        console.error("[analyze] Gemini returned empty text:", JSON.stringify(data).slice(0, 500));
        return aiErrorResponse("Gemini empty response", data);
      }
      return textStream(text);
    } catch (e) {
      clearTimeout(timeout);
      return aiErrorResponse("Gemini", e);
    }
  }

  return new Response("No AI provider configured.", { status: 500 });
}
