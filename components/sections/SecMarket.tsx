"use client";
import { C, FS, FUNNEL_COLORS } from "@/lib/tokens";
import { Card, KpiCard, CardLabel, Bar, FeedbackBar } from "@/components/ui/primitives";
import type { MarketData, MarketSegment, MarketTrend, MarketGap } from "@/lib/types";

const SEG_COLORS = [C.p900, C.p700, C.p600, C.p300];

export function SecMarket({ d, raw }: { d: MarketData; raw: string }) {
  const segments      = (d.segments      || []) as MarketSegment[];
  const trends        = (d.trends        || []) as MarketTrend[];
  const opportunities = (d.opportunities || []) as MarketGap[];

  return (
    <div>
      {/* Size KPIs */}
      {(d.tam || d.sam || d.target_size || d.growth) && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 9 }}>
          {d.tam         && <KpiCard label="Total addressable"  value={d.tam} />}
          {d.sam         && <KpiCard label="Serviceable market" value={d.sam} />}
          {d.target_size && <KpiCard label="Target segment"     value={d.target_size} />}
          {d.growth      && <KpiCard label="Market growth"      value={d.growth} />}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
        {segments.length > 0 && (
          <Card>
            <CardLabel>Market segments</CardLabel>
            {segments.map((s, i) => (
              <Bar key={i} label={s.name} pct={s.pct} color={SEG_COLORS[i % 4]} />
            ))}
          </Card>
        )}

        {trends.length > 0 && (
          <Card>
            <CardLabel>Key trends</CardLabel>
            {trends.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 9, marginBottom: 10, alignItems: "flex-start" }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: FS.body, fontWeight: 700, color: C.p700, flexShrink: 0 }}>
                  {t.direction === "up" ? "↑" : t.direction === "down" ? "↓" : "→"}
                </div>
                <div>
                  <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{t.title}</div>
                  <div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.5 }}>{t.description}</div>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>

      {opportunities.length > 0 && (
        <Card>
          <CardLabel color={C.p600}>Market opportunities — unmet needs</CardLabel>
          {opportunities.map((g, i) => (
            <div key={i} style={{ display: "flex", gap: 9, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: FS.bodyXs, fontWeight: 700, color: C.p700, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{g.title}</div>
                <div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.55 }}>{g.description}</div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {d.positioning_space && (
        <div style={{ background: C.p100, borderRadius: 12, padding: "14px 16px", borderLeft: `3px solid ${C.p700}` }}>
          <CardLabel color={C.p700}>Positioning space</CardLabel>
          <div style={{ fontSize: FS.body, color: C.p900, lineHeight: 1.65 }}>{d.positioning_space}</div>
        </div>
      )}

      <FeedbackBar phase="market" outputRaw={raw} />
    </div>
  );
}
