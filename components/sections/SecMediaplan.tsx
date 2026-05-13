"use client";
import { useState } from "react";
import { T, TY } from "@/lib/tokens";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { TabBar } from "@/components/ui/TabBar";
import { Pill } from "@/components/ui/Pill";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import { fmtN, fmtE, fmtP, fmtK } from "@/lib/format";
import type { MediaplanData } from "@/lib/types";

interface Props { d: MediaplanData; raw: string; }

export function SecMediaplan({ d, raw }: Props) {
  const [ac, setAc] = useState(0);
  const channels = d.channels || [];
  if (!channels.length) return <Card><div style={{ ...TY.bodyMd, color: T.t3, textAlign: "center", padding: 28 }}>No media plan data.</div></Card>;

  const totals = d.totals || { budget: 0, impressions: 0, clicks: 0, conversions: 0 };
  const ch     = channels[Math.min(ac, channels.length - 1)];

  const metrics: [string, string][][] = [
    [
      ["Frequency",  ch.frequency ? `${ch.frequency}×` : "—"],
      ["Clicks",     fmtN(ch.clicks)],
      ["CTR",        fmtP(ch.ctr)],
      ["CPC",        fmtE(ch.cpc)],
    ],
    [
      ["Website visits", fmtN(ch.visits)],
      ["CPA visit",      fmtE(ch.cpa_visit)],
      ["Conversions",    fmtN(ch.conversions)],
      ["Cost/conversion", fmtE(ch.cpa)],
    ],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        <KpiCard label="Total budget"  value={fmtK(totals.budget)} />
        <KpiCard label="Impressions"   value={fmtN(totals.impressions)} />
        <KpiCard label="Clicks"        value={fmtN(totals.clicks)} />
        <KpiCard label="Conversions"   value={fmtN(totals.conversions)} />
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <TabBar
          tabs={channels.map((c, i) => ({ key: i, label: c.name || `Channel ${i + 1}` }))}
          active={ac}
          onSelect={k => setAc(Number(k))}
        />
        {ch && (
          <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {ch.funnel_stage && <Pill label={ch.funnel_stage.toUpperCase()} color={T.pa} />}
              <div style={{ ...TY.bodyMd, color: T.t3 }}>{[ch.platform, ch.buy_type].filter(Boolean).join(" · ")}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
              <KpiCard label="Budget"      value={fmtK(ch.budget)} />
              <KpiCard label="Impressions" value={fmtN(ch.impressions)} />
              <KpiCard label="Reach"       value={fmtN(ch.reach)} />
              <KpiCard label="CPM"         value={fmtE(ch.cpm)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {metrics.map((col, ci) => (
                <div key={ci}>
                  {col.map(([k, v]) => (
                    <div key={k} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "9px 0", borderBottom: `1px solid ${T.s2}` }}>
                      <div style={{ ...TY.label }}>{k}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.t1, textAlign: "right" }}>{v}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {ch.targeting && (
              <div style={{ background: T.p6, borderRadius: 9, padding: "11px 13px", borderLeft: `3px solid ${T.pa}` }}>
                <div style={{ ...TY.cardLabel, color: T.pa, marginBottom: 4 }}>Targeting</div>
                <div style={{ ...TY.bodyMd }}>{ch.targeting}</div>
              </div>
            )}
          </div>
        )}
      </Card>

      <FeedbackBar phase="mediaplan" outputRaw={raw} />
    </div>
  );
}
