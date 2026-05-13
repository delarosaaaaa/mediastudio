"use client";
import { T, TY } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import type { SynthesisData } from "@/lib/types";

interface Props { d: SynthesisData; raw: string; }

const PRIO_COL: Record<string, string> = { high: T.p1, medium: T.p2, low: T.p4 };
const CARD = { background: T.sur, borderRadius: 12, padding: "16px 18px", boxShadow: T.shad };

export function SecSynthesis({ d, raw }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      {/* Executive summary */}
      <div style={{ background: `linear-gradient(135deg,${T.p1},${T.p2})`, borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ ...TY.cardLabel, color: "rgba(255,255,255,.4)", marginBottom: 8 }}>Executive Summary</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.82)", lineHeight: 1.7, maxWidth: 640 }}>{d.summary}</div>
      </div>

      {/* Strategic core + Risks */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ ...CARD }}>
          <div style={{ ...TY.cardLabel, marginBottom: 12 }}>Strategic core</div>
          {d.strategic_core?.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 9, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: T.p6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: T.pa, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 11, color: T.t2, lineHeight: 1.6, paddingTop: 2 }}>{s}</div>
            </div>
          ))}
        </div>
        <div style={{ ...CARD }}>
          <div style={{ ...TY.cardLabel, marginBottom: 12 }}>Risks & assumptions</div>
          {d.risks?.map((r, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${T.p4}`, padding: "8px 11px", background: T.s2, borderRadius: "0 8px 8px 0", marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.t1, marginBottom: 3 }}>{r.risk}</div>
              <div style={{ fontSize: 10, color: T.t3, lineHeight: 1.55 }}>{r.mitigation}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div style={{ ...CARD }}>
        <div style={{ ...TY.cardLabel, marginBottom: 12 }}>Recommendations</div>
        {d.recommendations?.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < (d.recommendations?.length || 0) - 1 ? `1px solid ${T.s2}` : "none", alignItems: "flex-start" }}>
            <div style={{ width: 3, height: 30, borderRadius: 2, background: PRIO_COL[r.priority] || T.p3, flexShrink: 0, marginTop: 3 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.t1 }}>{r.title}</div>
                <span style={{ padding: "2px 8px", background: (PRIO_COL[r.priority] || T.p3) + "18", color: PRIO_COL[r.priority] || T.p3, borderRadius: 20, fontSize: 9, fontWeight: 600 }}>{(r.priority || "").toUpperCase()}</span>
              </div>
              <div style={{ fontSize: 11, color: T.t2, lineHeight: 1.6 }}>{r.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Next steps */}
      {(d.next_steps?.length ?? 0) > 0 && (
        <div style={{ ...CARD }}>
          <div style={{ ...TY.cardLabel, marginBottom: 12 }}>Next steps</div>
          {d.next_steps.map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "22px 1fr auto auto", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: i < (d.next_steps?.length || 0) - 1 ? `1px solid ${T.s2}` : "none" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.pa }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.t1 }}>{s.action}</div>
              <div style={{ fontSize: 11, color: T.t3 }}>{s.owner}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.pa, whiteSpace: "nowrap" }}>{s.timing}</div>
            </div>
          ))}
        </div>
      )}

      <FeedbackBar phase="synthesis" outputRaw={raw} />
    </div>
  );
}
