"use client";
import { T, TY } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import type { FunnelData } from "@/lib/types";

interface Props { d: FunnelData; raw: string; }

const PHASE_COLS = [T.p1, T.p2, T.p3, T.p4] as const;

export function SecFunnel({ d, raw }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ background: T.sur, borderRadius: 12, padding: "16px 18px", boxShadow: T.shad }}>
        {/* Column header */}
        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 130px", gap: 1, background: T.s2, borderRadius: "8px 8px 0 0", overflow: "hidden", marginBottom: 6 }}>
          <div style={{ ...TY.cardLabel, padding: "7px 12px", background: T.s2 }}>Phase</div>
          <div style={{ ...TY.cardLabel, padding: "7px 12px", background: T.s2 }}>Channels & message</div>
          <div style={{ ...TY.cardLabel, padding: "7px 12px", background: T.s2 }}>Target</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {d.stages?.map((s, i) => {
            const col = PHASE_COLS[i % 4];
            return (
              <div key={i}>
                <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 130px", borderRadius: 9, overflow: "hidden", border: `0.5px solid ${col}30` }}>
                  {/* Phase */}
                  <div style={{ background: col, padding: "13px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", lineHeight: 1.4, marginBottom: 8 }}>{s.goal}</div>
                    {s.budget_pct > 0 && (
                      <div style={{ display: "inline-block", padding: "2px 8px", background: "rgba(255,255,255,.18)", borderRadius: 20, fontSize: 9, fontWeight: 600, color: "#fff" }}>
                        {s.budget_pct}% budget
                      </div>
                    )}
                  </div>
                  {/* Channels + message */}
                  <div style={{ background: T.sur, padding: "13px 16px", borderLeft: `0.5px solid ${T.s3}` }}>
                    <div style={{ ...TY.cardLabel, color: col, marginBottom: 6 }}>Channels</div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: s.message_type ? 8 : 0 }}>
                      {s.channels?.map((c, j) => (
                        <span key={j} style={{ padding: "2px 8px", background: col + "14", color: col, borderRadius: 20, fontSize: 10, fontWeight: 600 }}>{c}</span>
                      ))}
                    </div>
                    {s.message_type && (
                      <div style={{ paddingTop: 7, borderTop: `1px solid ${T.s2}` }}>
                        <div style={{ ...TY.cardLabel, marginBottom: 3 }}>Message</div>
                        <div style={{ fontSize: 11, color: T.t3, fontStyle: "italic", lineHeight: 1.5 }}>"{s.message_type}"</div>
                      </div>
                    )}
                  </div>
                  {/* Target */}
                  <div style={{ background: T.s2, padding: "13px 14px", borderLeft: `0.5px solid ${T.s3}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ ...TY.cardLabel, marginBottom: 4 }}>Target</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: col, lineHeight: 1.3, marginBottom: 4 }}>{s.target}</div>
                    <div style={{ fontSize: 10, color: T.t3, lineHeight: 1.4 }}>{s.kpi}</div>
                  </div>
                </div>
                {i < (d.stages?.length || 0) - 1 && s.conversion_rate && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 16px" }}>
                    <div style={{ fontSize: 10, color: T.t4 }}>↓</div>
                    <div style={{ fontSize: 10, color: T.t3 }}>{s.conversion_rate} conversion rate</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {(d.retargeting?.filter(r => r).length ?? 0) > 0 && (
        <div style={{ background: T.sur, borderRadius: 12, padding: "16px 18px", boxShadow: T.shad }}>
          <div style={{ ...TY.cardLabel, marginBottom: 10 }}>Retargeting logic</div>
          {d.retargeting.filter(r => r).map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: T.p6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: T.pa, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 11, color: T.t2, lineHeight: 1.55 }}>{r}</div>
            </div>
          ))}
        </div>
      )}

      <FeedbackBar phase="funnel" outputRaw={raw} />
    </div>
  );
}
