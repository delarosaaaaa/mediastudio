"use client";
import { useEffect, useRef } from "react";
import { C, FS } from "@/lib/tokens";
import { AGENTS } from "@/lib/constants";
import type { Message } from "@/lib/types";

interface Props {
  messages:  Message[];
  questions: string[];
  answer:    string;
  setAnswer: (v: string) => void;
  onAnswer:  () => void;
  done:      boolean;
  running:   boolean;
}

export function RightPanel({ messages, questions, answer, setAnswer, onAnswer, done, running }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [messages]);

  return (
    <div style={{ background: "#FAFAF8", borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "12px 15px", borderBottom: `1px solid ${C.border}`, fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".08em", flexShrink: 0 }}>
        Agent feed
      </div>

      <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: "10px 13px", display: "flex", flexDirection: "column", gap: 7 }}>
        {messages.length === 0 && (
          <div style={{ fontSize: FS.bodySm, color: C.faint, textAlign: "center", padding: "20px 0", lineHeight: 2 }}>Agent messages<br />appear here</div>
        )}
        {messages.map(m => {
          const fa = AGENTS[m.from];
          const ta = m.to ? AGENTS[m.to] : null;
          return (
            <div key={m.id}>
              <div style={{ fontSize: FS.cardLabel, color: "rgba(0,0,0,.3)", marginBottom: 2, display: "flex", gap: 4, alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: C.p600 }}>{fa?.label || m.from}</span>
                {ta && <><span>→</span><span style={{ fontWeight: 700, color: C.p700 }}>{ta.label}</span></>}
                <span style={{ marginLeft: "auto" }}>{m.ts}</span>
              </div>
              <div style={{
                background: "rgba(255,255,255,.85)",
                border: `0.5px solid ${m.type === "handoff" ? C.p300 : "rgba(0,0,0,.07)"}`,
                borderRadius: "9px 9px 9px 2px", padding: "7px 10px",
                fontSize: FS.bodySm, color: C.body, lineHeight: 1.5,
                boxShadow: C.shadowSm,
              }}>
                {m.type === "handoff" && <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.p600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>Handoff</div>}
                {m.text}
              </div>
            </div>
          );
        })}
      </div>

      {questions.length > 0 ? (
        <div style={{ padding: "10px 13px", borderTop: `1px solid ${C.border}`, background: "rgba(255,255,255,.6)", flexShrink: 0 }}>
          <div style={{ fontSize: FS.bodyXs, fontWeight: 700, color: C.p700, marginBottom: 7 }}>Input required</div>
          {questions.map((q, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${C.p700}`, padding: "7px 10px", background: C.white, borderRadius: "0 8px 8px 0", marginBottom: 6, fontSize: FS.bodySm, color: C.body }}>{q}</div>
          ))}
          <textarea
            value={answer} onChange={e => setAnswer(e.target.value)}
            placeholder="Your answer..."
            style={{ width: "100%", minHeight: 52, padding: "7px 10px", border: `1.5px solid ${C.p300}`, borderRadius: 8, fontSize: FS.bodySm, color: C.ink, background: C.white, marginBottom: 7, display: "block" }}
          />
          <button onClick={onAnswer} disabled={!answer.trim()} style={{
            width: "100%", padding: "7px", background: answer.trim() ? C.p700 : C.faint,
            border: "none", borderRadius: 7, color: "#fff", fontSize: FS.bodySm, fontWeight: 600,
          }}>Send →</button>
        </div>
      ) : (
        <div style={{ padding: "8px 13px", borderTop: `1px solid ${C.border}`, background: "rgba(255,255,255,.35)", flexShrink: 0, textAlign: "center", fontSize: FS.bodyXs, color: C.muted }}>
          {done ? "✓ Strategy complete" : running ? "Analysis in progress..." : "Waiting for briefing"}
        </div>
      )}
    </div>
  );
}
