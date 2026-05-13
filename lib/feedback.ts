import type { FeedbackEntry, FeedbackRating, PhaseKey } from "./types";
import { PROMPT_VERSIONS } from "./prompts";

export function createFeedbackEntry(
  phase: PhaseKey,
  rating: FeedbackRating,
  comment: string,
  outputRaw: string
): FeedbackEntry {
  return {
    id:            `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp:     new Date().toISOString(),
    phase,
    rating,
    comment:       comment.slice(0, 500),
    outputSnippet: outputRaw.slice(0, 500),
    promptVersion: PROMPT_VERSIONS[phase],
  };
}

export function getRatingColor(rating: FeedbackRating): string {
  return rating === "good" ? "#16a34a" : rating === "improve" ? "#d97706" : "#dc2626";
}

export function getRatingEmoji(rating: FeedbackRating): string {
  return rating === "good" ? "👍" : rating === "improve" ? "✏️" : "👎";
}
