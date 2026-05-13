"use client";
import { T, TY } from "@/lib/tokens";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import type { FunnelData } from "@/lib/types";

interface Props { d: FunnelData; raw: string; }

const COLS = [T.p1, T.p2, T.p3, T.p4] as const;

export function SecFunnel({ d, raw }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card>
        <SectionTitle a="Customer" b="journey" />
        <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 90px 70px", gap: 8, padding: "6px 10px", background: T.s2, borderRadius: "8px 8px 0 0", marginBottom: 2 }}>
          <div style={{ ...TY.cardLabel }}>Phase</div>
          <div style={{ ...TY.cardLabel }}>Channels & message</div>
          <div style={{ ...TY.cardLabel }}>KPI</div>
          <div style={{ ...TY.cardLabel, textAlign: "right" }}>Budget</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {d.stages?.map((s, i) => (
            <div key={i}>
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 90px 70px", gap: 8, padding: "12px 10px", borderLeft: `4px solid ${COLS[i % 4]}`, background: T.sur, borderRadius: "0 8px 8px 0" }}>
                <div>
                  <div style={{ ...TY.bodyMd, fontWeight: 700, color: COLS[i % 4], marginBottom: 2 }}>{s.name}</div>
                  <div style={{ ...TY.label }}>{s.goal}</div>
                </div>
                <div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 4 }}>
                    {s.channels?.map((c, j) => (
                      <span key={j} style={{ padding: "1px 7px", background: COLS[i % 4] + "18", color: COLS[i % 4], borderRadius: 8, fontSize: 10, fontWeight: 600 }}>{c}</span>
                    ))}
                  </div>
                  {s.message_type && <div style={{ ...TY.label, fontStyle: "italic" }}>{s.message_type}</div>}
                </div>
                <div>
                  <div style={{ ...TY.bodyMd, fontWeight: 700, color: T.t1 }}>{s.target}</div>
                  <div style={{ ...TY.label }}>{s.kpi}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ ...TY.bodyMd, fontWeight: 700, color: COLS[i % 4] }}>{s.budget_pct || 0}%</div>
                </div>
              </div>
              {i < (d.stages?.length || 0) - 1 && s.conversion_rate && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 14px" }}>
                  <div style={{ fontSize: 10, color: T.t4 }}>↓</div>
                  <div style={{ ...TY.label }}>{s.conversion_rate} conversion rate</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {d.retargeting?.filter(r => r).length > 0 && (
        <Card>
          <SectionTitle a="Retargeting" b="logic" />
          {d.retargeting.filter(r => r).map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: T.p6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: T.pa, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ ...TY.bodyMd }}>{r}</div>
            </div>
          ))}
        </Card>
      )}

      <FeedbackBar phase="funnel" outputRaw={raw} />
    </div>
  );
}
