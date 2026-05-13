"use client";
import { useEffect, useRef } from "react";
import { T, TY } from "@/lib/tokens";
import { AGENTS } from "@/lib/constants";
import type { PhaseKey, Message } from "@/lib/types";

interface RightPanelProps {
  outputs:     Record<string, string>;
  activePhase: PhaseKey | null;
  messages:    Message[];
  questions:   string[];
  answer:      string;
  setAnswer:   (v: string) => void;
  onAnswer:    () => void;
  done:        boolean;
  running:     boolean;
}

export function RightPanel({ messages, questions, answer, setAnswer, onAnswer, done, running }: RightPanelProps) {
  const feedRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [messages, questions]);

  return (
    <div style={{ background: "#F5F4F8", display: "flex", flexDirection: "column", overflow: "hidden", borderLeft: `1px solid rgba(0,0,0,.07)` }}>

      {/* Header */}
      <div style={{ padding: "12px 14px 10px", borderBottom: `1px solid rgba(0,0,0,.06)`, flexShrink: 0, background: "rgba(255,255,255,.5)" }}>
        <div style={{ ...TY.cardLabel }}>Agent feed</div>
      </div>

      {/* Messages */}
      <div ref={feedRef} style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
        {messages.length === 0 && (
          <div style={{ ...TY.bodySm, textAlign: "center", color: "rgba(0,0,0,.2)", padding: "20px 0", lineHeight: 2 }}>
            Agent messages<br />appear here
          </div>
        )}
        {messages.map(m => {
          const fa = AGENTS[m.from];
          const ta = m.to ? AGENTS[m.to] : null;
          return (
            <div key={m.id}>
              <div style={{ fontSize: 9, color: "rgba(0,0,0,.3)", marginBottom: 2, display: "flex", gap: 4, alignItems: "center" }}>
                <span style={{ fontWeight: 600, color: T.pa }}>{fa?.label || m.from}</span>
                {ta && <><span>→</span><span style={{ fontWeight: 600, color: T.p2 }}>{ta.label}</span></>}
                <span style={{ marginLeft: "auto" }}>{m.ts}</span>
              </div>
              <div style={{
                background: "rgba(255,255,255,.85)",
                border: `0.5px solid ${m.type === "handoff" ? T.p5 : "rgba(0,0,0,.07)"}`,
                borderRadius: "9px 9px 9px 2px",
                padding: "7px 10px", fontSize: 11, color: T.t2, lineHeight: 1.55,
              }}>
                {m.type === "handoff" && (
                  <div style={{ fontSize: 8, fontWeight: 700, color: T.pa, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 2 }}>Handoff</div>
                )}
                {m.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Question input */}
      {questions.length > 0 ? (
        <div style={{ padding: "10px 12px", borderTop: `1px solid rgba(0,0,0,.06)`, background: "rgba(255,255,255,.6)", flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: T.pa, marginBottom: 7 }}>Input required</div>
          {questions.map((q, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${T.pa}`, padding: "7px 10px", background: T.sur, borderRadius: "0 8px 8px 0", marginBottom: 6, fontSize: 11, color: T.t2 }}>{q}</div>
          ))}
          <textarea
            value={answer} onChange={e => setAnswer(e.target.value)}
            placeholder="Your answer..."
            style={{ width: "100%", minHeight: 52, padding: "7px 10px", borderWidth: "1.5px", borderStyle: "solid", borderColor: T.p5, borderRadius: 8, fontFamily: "inherit", fontSize: 11, color: T.t1, background: "#fff", resize: "none", outline: "none", marginBottom: 7, display: "block" }}
          />
          <button onClick={onAnswer} disabled={!answer.trim()}
            style={{ width: "100%", padding: "7px", background: answer.trim() ? T.pa : "#DDD", borderWidth: 0, borderRadius: 7, color: "#fff", fontFamily: "inherit", fontSize: 11, fontWeight: 600, cursor: answer.trim() ? "pointer" : "default" }}>
            Send →
          </button>
        </div>
      ) : (
        <div style={{ padding: "8px 12px", borderTop: `1px solid rgba(0,0,0,.05)`, background: "rgba(255,255,255,.35)", flexShrink: 0, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: T.t3 }}>
            {done ? "✓ Strategy complete" : running ? "Analysis in progress..." : "Waiting for briefing"}
          </div>
        </div>
      )}
    </div>
  );
}
