"use client";
import { T, TY } from "@/lib/tokens";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import type { BriefingData } from "@/lib/types";

interface Props { d: BriefingData; raw: string; }

export function SecBriefing({ d, raw }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card style={{ background: `linear-gradient(135deg,${T.p1},${T.p2})`, padding: "26px 30px" }}>
        <div style={{ ...TY.cardLabel, color: "rgba(255,255,255,.4)", marginBottom: 7 }}>Campaign</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-.5px", marginBottom: 11 }}>{d.brand || "Campaign"}</div>
        <div style={{ ...TY.bodyLg, color: "rgba(255,255,255,.72)" }}>{d.intro}</div>
      </Card>

      {d.params?.budget && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {[["Budget", d.params.budget], ["Duration", d.params.duration || "—"], ["Geography", d.params.geo || "—"], ["Timing", d.params.timing || "—"]].map(([l, v]) => (
            <KpiCard key={l} label={l} value={v} />
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card>
          <SectionTitle a="Business" b="objectives" />
          {d.business_goals?.map((g, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: T.p6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: T.pa, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ ...TY.bodyMd, fontWeight: 600, color: T.t1, marginBottom: 2 }}>{g.goal}</div>
                <div style={{ ...TY.label }}>{g.target} · {g.metric}</div>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <SectionTitle a="Marketing" b="KPIs" />
          {d.marketing_goals?.map((g, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${T.s2}` }}>
              <div style={{ ...TY.bodyMd }}>{g.kpi}</div>
              <div style={{ ...TY.num }}>{g.target}</div>
            </div>
          ))}
        </Card>
      </div>

      <FeedbackBar phase="briefing" outputRaw={raw} />
    </div>
  );
}
