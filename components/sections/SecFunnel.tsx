"use client";
import { T, TY } from "@/lib/tokens";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import type { FunnelData } from "@/lib/types";

interface Props { d: FunnelData; raw: string; }

const PHASE_COLS = [T.p1, T.p2, T.p3, T.p4] as const;

export function SecFunnel({ d, raw }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card>
        <SectionTitle a="Customer" b="journey" />
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {d.stages?.map((s, i) => {
            const col = PHASE_COLS[i % 4];
            return (
              <div key={i}>
                {/* Phase row */}
                <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 100px", borderRadius: 10, overflow: "hidden", border: `1px solid ${col}22` }}>
                  {/* Phase + goal */}
                  <div style={{ background: col, padding: "14px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)", lineHeight: 1.4 }}>{s.goal}</div>
                    {s.budget_pct > 0 && (
                      <div style={{ marginTop: 8, display: "inline-block", padding: "2px 8px", background: "rgba(255,255,255,.18)", borderRadius: 20, fontSize: 10, fontWeight: 600, color: "#fff" }}>
                        {s.budget_pct}% budget
                      </div>
                    )}
                  </div>

                  {/* Channels + message */}
                  <div style={{ background: T.sur, padding: "14px 16px", borderLeft: `1px solid ${col}22` }}>
                    <div style={{ ...TY.cardLabel, color: col, marginBottom: 7 }}>Channels</div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: s.message_type ? 10 : 0 }}>
                      {s.channels?.map((c, j) => (
                        <span key={j} style={{ padding: "3px 9px", background: col + "15", color: col, borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{c}</span>
                      ))}
                    </div>
                    {s.message_type && (
                      <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.s2}` }}>
                        <div style={{ ...TY.cardLabel, marginBottom: 4 }}>Message</div>
                        <div style={{ fontSize: 12, color: T.t2, fontStyle: "italic", lineHeight: 1.5 }}>"{s.message_type}"</div>
                      </div>
                    )}
                  </div>

                  {/* KPI + target */}
                  <div style={{ background: T.s2, padding: "14px 14px", borderLeft: `1px solid ${col}22`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ ...TY.cardLabel, marginBottom: 4 }}>Target</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: col, lineHeight: 1.3, marginBottom: 4 }}>{s.target}</div>
                    <div style={{ fontSize: 10, color: T.t3, lineHeight: 1.4 }}>{s.kpi}</div>
                  </div>
                </div>

                {/* Conversion rate between stages */}
                {i < (d.stages?.length || 0) - 1 && s.conversion_rate && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 16px" }}>
                    <div style={{ fontSize: 11, color: T.t4 }}>↓</div>
                    <div style={{ ...TY.label }}>{s.conversion_rate} conversion rate</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {d.retargeting?.filter(r => r).length > 0 && (
        <Card>
          <SectionTitle a="Retargeting" b="logic" />
          {d.retargeting.filter(r => r).map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: T.p6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: T.pa, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ ...TY.bodyMd, paddingTop: 1 }}>{r}</div>
            </div>
          ))}
        </Card>
      )}

      <FeedbackBar phase="funnel" outputRaw={raw} />
    </div>
  );
}
