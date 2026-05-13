"use client";
import { useState } from "react";
import { T, TY } from "@/lib/tokens";
import type { PhaseKey, FeedbackRating } from "@/lib/types";

interface FeedbackBarProps {
  phase:     PhaseKey;
  outputRaw: string;
}

export function FeedbackBar({ phase, outputRaw }: FeedbackBarProps) {
  const [rating,    setRating]    = useState<FeedbackRating | null>(null);
  const [comment,   setComment]   = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [open,      setOpen]      = useState(false);

  async function submit(r: FeedbackRating) {
    setRating(r);
    if (r === "good") {
      await send(r, "");
      setSubmitted(true);
    } else {
      setOpen(true);
    }
  }

  async function send(r: FeedbackRating, c: string) {
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phase, rating: r, comment: c, outputRaw: outputRaw.slice(0, 500) }),
    });
  }

  async function submitComment() {
    if (!rating) return;
    await send(rating, comment);
    setSubmitted(true);
    setOpen(false);
  }

  if (submitted) return (
    <div style={{ marginTop: 16, padding: "8px 12px", background: T.s2, borderRadius: 8, ...TY.label, textAlign: "center" }}>
      ✓ Thanks for your feedback
    </div>
  );

  return (
    <div style={{ marginTop: 16, borderTop: `1px solid ${T.s2}`, paddingTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ ...TY.label }}>Was this analysis useful?</div>
        {(["good", "improve", "bad"] as FeedbackRating[]).map(r => (
          <button
            key={r}
            onClick={() => submit(r)}
            style={{
              padding: "4px 10px",
              background: rating === r ? T.pa : T.s2,
              color: rating === r ? "#fff" : T.t2,
              borderWidth: 0,
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {r === "good" ? "👍 Good" : r === "improve" ? "✏️ Can improve" : "👎 Not good"}
          </button>
        ))}
      </div>
      {open && (
        <div style={{ marginTop: 10 }}>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Optional: what could be better?"
            style={{
              width: "100%",
              minHeight: 60,
              padding: "8px 10px",
              borderWidth: "1.5px",
              borderStyle: "solid",
              borderColor: T.p5,
              borderRadius: 8,
              fontFamily: "inherit",
              fontSize: 11,
              color: T.t1,
              background: "#fff",
              resize: "vertical",
              display: "block",
            }}
          />
          <button
            onClick={submitComment}
            style={{ marginTop: 6, padding: "6px 16px", background: T.pa, borderWidth: 0, borderRadius: 7, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
