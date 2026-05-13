import type { SectionData } from "./types";

export function parseJSON(raw: string): SectionData | null {
  if (!raw) return null;
  try {
    const clean = raw
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const start = clean.indexOf("{");
    const end   = clean.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    return JSON.parse(clean.slice(start, end + 1)) as SectionData;
  } catch {
    return null;
  }
}

export function extractClientQuestions(raw: string): string[] {
  return [...raw.matchAll(/CLIENT_QUESTION:\s*(.+?)(?=\n|$)/g)]
    .map(m => m[1].trim());
}

export function stripClientQuestions(raw: string): string {
  return raw.replace(/CLIENT_QUESTION:\s*.+(\n|$)/g, "").trim();
}
