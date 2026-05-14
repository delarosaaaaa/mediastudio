"use client";
import { C, FS } from "@/lib/tokens";
import { Card, KpiCard, CardLabel, FeedbackBar } from "@/components/ui/primitives";
import type { BriefingData } from "@/lib/types";

export function SecBriefing({ d, raw }: { d: BriefingData; raw: string }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg,${C.p900},${C.p700})`, borderRadius: 14, padding: "22px 26px", marginBottom: 9 }}>
        <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 }}>Campaign</div>
        <div style={{ fontSize: FS.heroTitle, fontWeight: 800, color: "#fff", letterSpacing: "-.5px", marginBottom: 8 }}>{d.brand || "—"}</div>
        <div style={{ fontSize: FS.bodyLg, color: "rgba(255,255,255,.75)", lineHeight: 1.7, maxWidth: 640 }}>{d.intro}</div>
      </div>

      {/* Params */}
      {d.params?.budget && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 9 }}>
          {([["Budget", d.params.budget], ["Duration", d.params.duration], ["Geography", d.params.geo], ["Timing", d.params.timing]] as [string,string][])
            .map(([l, v]) => <KpiCard key={l} label={l} value={v || "—"} />)}
        </div>
      )}

      {/* 2-col */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
        <Card>
          <CardLabel>Business objectives</CardLabel>
          {d.business_goals?.map((g, i) => (
            <div key={i} style={{ display: "flex", gap: 9, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: FS.bodyXs, fontWeight: 700, color: C.p700, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{g.goal}</div>
                <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{g.target} · {g.metric}</div>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <CardLabel>Marketing KPIs</CardLabel>
          {d.marketing_goals?.map((g, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${C.inset}` }}>
              <div style={{ fontSize: FS.body, color: C.body }}>{g.kpi}</div>
              <div style={{ fontSize: FS.body, fontWeight: 800, color: C.ink }}>{g.target}</div>
            </div>
          ))}
        </Card>
      </div>
      <FeedbackBar phase="briefing" outputRaw={raw} />
    </div>
  );
}
