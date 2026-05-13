"use client";
import { T, TY } from "@/lib/tokens";
import { KpiCard } from "@/components/ui/KpiCard";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import type { BriefingData } from "@/lib/types";

interface Props { d: BriefingData; raw: string; }

export function SecBriefing({ d, raw }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      {/* Campaign hero */}
      <div style={{ background: `linear-gradient(135deg,${T.p1},${T.p2})`, borderRadius: 14, padding: "22px 26px" }}>
        <div style={{ ...TY.cardLabel, color: "rgba(255,255,255,.4)", marginBottom: 5 }}>Campaign</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-.5px", marginBottom: 10 }}>{d.brand || "Campaign"}</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.72)", lineHeight: 1.65, maxWidth: 620 }}>{d.intro}</div>
      </div>

      {/* Params strip */}
      {d.params?.budget && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {([["Budget", d.params.budget], ["Duration", d.params.duration || "—"], ["Geography", d.params.geo || "—"], ["Timing", d.params.timing || "—"]] as [string,string][]).map(([l, v]) => (
            <KpiCard key={l} label={l} value={v} />
          ))}
        </div>
      )}

      {/* Objectives + KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: T.sur, borderRadius: 12, padding: "16px 18px", boxShadow: T.shad }}>
          <div style={{ ...TY.cardLabel, marginBottom: 12 }}>Business objectives</div>
          {d.business_goals?.map((g, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: T.p6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: T.pa, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.t1, marginBottom: 2 }}>{g.goal}</div>
                <div style={{ fontSize: 10, color: T.t3 }}>{g.target} · {g.metric}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: T.sur, borderRadius: 12, padding: "16px 18px", boxShadow: T.shad }}>
          <div style={{ ...TY.cardLabel, marginBottom: 12 }}>Marketing KPIs</div>
          {d.marketing_goals?.map((g, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${T.s2}` }}>
              <div style={{ fontSize: 12, color: T.t2 }}>{g.kpi}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.t1 }}>{g.target}</div>
            </div>
          ))}
        </div>
      </div>

      <FeedbackBar phase="briefing" outputRaw={raw} />
    </div>
  );
}
