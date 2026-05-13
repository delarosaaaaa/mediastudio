import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { buildPrompt } from "@/lib/prompts";
import type { PhaseKey } from "@/lib/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

export async function POST(req: Request) {
  // Parse & validate
  let body: z.infer<typeof AnalyzeSchema>;
  try {
    body = AnalyzeSchema.parse(await req.json());
  } catch (e) {
    return new Response("Invalid request", { status: 400 });
  }

  const prompt = buildPrompt(body.phase, body.briefing, body.outputs, body.extra);

  // Stream response from Anthropic → browser
  try {
    const stream = client.messages.stream({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages:   [{ role: "user", content: prompt }],
    });

    // Collect full text (streaming to browser via readable stream)
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
      headers: {
        "Content-Type":  "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(msg, { status: 502 });
  }
}
