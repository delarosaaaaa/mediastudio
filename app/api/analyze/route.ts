import { z } from "zod";
import { buildPrompt } from "@/lib/prompts";
import { DEMO_DATA } from "@/lib/demo-data";
import type { PhaseKey } from "@/lib/types";

const PHASE_KEYS: PhaseKey[] = [
  "briefing", "audience", "competitive", "funnel",
  "channel",  "budget",   "mediaplan",   "synthesis",
];

const AnalyzeSchema = z.object({
  phase:    z.enum(PHASE_KEYS as [PhaseKey, ...PhaseKey[]]),
  briefing: z.string().min(1).max(10_000),
  outputs:  z.record(z.string()).default({}),
  extra:    z.string().max(2_000).default(""),
});

// Simulate a stream by sending text in small chunks with a delay
async function streamText(text: string): Promise<Response> {
  const encoder = new TextEncoder();
  const chunkSize = 40;
  const readable = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < text.length; i += chunkSize) {
        controller.enqueue(encoder.encode(text.slice(i, i + chunkSize)));
        await new Promise(r => setTimeout(r, 12)); // ~30ms delay per chunk
      }
      controller.close();
    },
  });
  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
  });
}

export async function POST(req: Request) {
  let body: z.infer<typeof AnalyzeSchema>;
  try {
    body = AnalyzeSchema.parse(await req.json());
  } catch {
    return new Response("Invalid request", { status: 400 });
  }

  // ── DEMO MODE: no API key set ────────────────────────────────
  if (!process.env.ANTHROPIC_API_KEY) {
    const demo = DEMO_DATA[body.phase];
    if (demo) {
      // Small artificial delay so the UI feels realistic
      await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
      return streamText(demo);
    }
    return new Response("Demo data not available for this phase", { status: 500 });
  }

  // ── LIVE MODE: API key present ───────────────────────────────
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt = buildPrompt(body.phase, body.briefing, body.outputs, body.extra);

  try {
    const stream = client.messages.stream({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 6000,
      messages:   [{ role: "user", content: prompt }],
    });

    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(new TextEncoder().encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(msg, { status: 502 });
  }
}
