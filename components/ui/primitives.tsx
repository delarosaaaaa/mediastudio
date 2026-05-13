// ─────────────────────────────────────────────────────────────
// Shared UI primitives
// Every section imports from here — never write inline card styles
// ─────────────────────────────────────────────────────────────
import type { CSSProperties, ReactNode } from "react";
import { C, FS } from "@/lib/tokens";

// ─── Card ─────────────────────────────────────────────────────
interface CardProps { children: ReactNode; style?: CSSProperties; }
export function Card({ children, style }: CardProps) {
  return (
    <div style={{
      background:   C.white,
      borderRadius: 14,
      boxShadow:    C.shadow,
      padding:      "16px 18px",
      marginBottom: 9,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── KpiCard ──────────────────────────────────────────────────
interface KpiCardProps { label: string; value?: string | number | null; sub?: string; }
export function KpiCard({ label, value, sub }: KpiCardProps) {
  const str = String(value ?? "—");
  const fs  = str.length > 26 ? 11 : str.length > 14 ? 13 : 15;
  return (
    <div style={{
      background:   C.white,
      borderRadius: 11,
      boxShadow:    C.shadowSm,
      padding:      "12px 14px",
      borderTop:    `2px solid ${C.p700}`,
    }}>
      <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 }}>
        {label}
      </div>
      <div style={{ fontSize: fs, fontWeight: 800, color: C.ink, letterSpacing: "-.02em", lineHeight: 1 }}>
        {str}
      </div>
      {sub && <div style={{ fontSize: FS.bodyXs, color: C.muted, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

// ─── Tag / Pill ───────────────────────────────────────────────
interface TagProps { label: string; color?: string; bg?: string; }
export function Tag({ label, color = C.p700, bg = C.p100 }: TagProps) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 20,
      fontSize: FS.bodyXs, fontWeight: 600, color, background: bg, margin: "2px 2px 2px 0",
    }}>
      {label}
    </span>
  );
}

// ─── CardLabel ────────────────────────────────────────────────
export function CardLabel({ children, color = C.muted }: { children: ReactNode; color?: string }) {
  return (
    <div style={{
      fontSize: FS.cardLabel, fontWeight: 700, color,
      textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

// ─── Bar ─────────────────────────────────────────────────────
interface BarProps { label: string; pct: number; color: string; }
export function Bar({ label, pct, color }: BarProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
      <div style={{ fontSize: FS.body, color: C.body, width: 90, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 6, background: C.inset, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
      <div style={{ fontSize: FS.body, fontWeight: 800, color: C.ink, width: 28, textAlign: "right" }}>{pct}%</div>
    </div>
  );
}

// ─── FeedbackBar ──────────────────────────────────────────────
import { useState } from "react";
import type { PhaseKey } from "@/lib/types";
type FeedbackRating = "good" | "improve" | "bad";

export function FeedbackBar({ phase, outputRaw }: { phase: PhaseKey; outputRaw: string }) {
  const [rating,    setRating]    = useState<FeedbackRating | null>(null);
  const [comment,   setComment]   = useState("");
  const [open,      setOpen]      = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function send(r: FeedbackRating, c: string) {
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phase, rating: r, comment: c, outputRaw: outputRaw.slice(0, 500) }),
    });
  }

  async function submit(r: FeedbackRating) {
    setRating(r);
    if (r === "good") { await send(r, ""); setSubmitted(true); }
    else setOpen(true);
  }

  async function submitComment() {
    if (!rating) return;
    await send(rating, comment);
    setSubmitted(true); setOpen(false);
  }

  if (submitted) return (
    <div style={{ paddingTop: 12, marginTop: 12, borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
      <span style={{ fontSize: FS.bodyXs, color: C.muted }}>✓ Thanks for your feedback</span>
    </div>
  );

  return (
    <div style={{ paddingTop: 12, marginTop: 12, borderTop: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: FS.bodyXs, color: C.muted }}>Was this useful?</span>
        {(["good", "improve", "bad"] as FeedbackRating[]).map(r => (
          <button key={r} onClick={() => submit(r)} style={{
            padding: "4px 11px", borderRadius: 20, border: "none",
            background: rating === r ? C.p700 : C.inset,
            color: rating === r ? "#fff" : C.body,
            fontSize: FS.bodyXs, fontWeight: 500,
          }}>
            {r === "good" ? "👍 Good" : r === "improve" ? "✏️ Can improve" : "👎 Not good"}
          </button>
        ))}
      </div>
      {open && (
        <div style={{ marginTop: 10 }}>
          <textarea
            value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Optional: what could be better?"
            style={{ width: "100%", minHeight: 52, padding: "8px 10px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: FS.bodySm, color: C.ink, background: C.white, display: "block" }}
          />
          <button onClick={submitComment} style={{ marginTop: 6, padding: "6px 16px", background: C.p700, border: "none", borderRadius: 7, color: "#fff", fontSize: FS.bodySm, fontWeight: 600 }}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
