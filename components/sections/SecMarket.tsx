"use client";
import { T, TY } from "@/lib/tokens";
import { KpiCard } from "@/components/ui/KpiCard";
import { FeedbackBar } from "@/components/ui/FeedbackBar";

// Market data interface - flexible since this is a new AI section
interface MarketSegment { name: string; pct: number; }
interface MarketTrend   { direction: "up" | "down" | "neutral"; title: string; description: string; }
interface MarketGap     { title: string; description: string; }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MarketData = Record<string, any>;

interface Props { d: MarketData; raw: string; }

const CARD = { background: T.sur, borderRadius: 14, boxShadow: T.shad, padding: "16px 18px", marginBottom: 9 };
const SEG_COLS = [T.p1, T.p2, T.p3, T.p5];

export function SecMarket({ d, raw }: Props) {
  const segments      = (d.segments      || []) as Array<{ name: string; pct: number }>;
  const trends        = (d.trends        || []) as Array<{ direction: string; title: string; description: string }>;
  const opportunities = (d.opportunities || []) as Array<{ title: string; description: string }>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

      {/* Market size KPIs */}
      {(d.tam || d.sam || d.target_size || d.growth) && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 9 }}>
          {d.tam         && <KpiCard label="Total addressable"  value={d.tam} />}
          {d.sam         && <KpiCard label="Serviceable market" value={d.sam} />}
          {d.target_size && <KpiCard label="Target segment"     value={d.target_size} />}
          {d.growth      && <KpiCard label="Market growth"      value={d.growth} />}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 0 }}>
        {/* Segments */}
        {segments.length > 0 && (
          <div style={{ ...CARD, marginBottom: 0 }}>
            <div style={{ ...TY.cardLabel }}>Market segments</div>
            {segments.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: T.t2, width: 130, flexShrink: 0 }}>{s.name}</div>
                <div style={{ flex: 1, height: 6, background: T.s2, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${s.pct}%`, height: "100%", background: SEG_COLS[i % 4], borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: T.t1, width: 28, textAlign: "right" }}>{s.pct}%</div>
              </div>
            ))}
          </div>
        )}

        {/* Trends */}
        {trends.length > 0 && (
          <div style={{ ...CARD, marginBottom: 0 }}>
            <div style={{ ...TY.cardLabel }}>Key market trends</div>
            {trends.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 9, marginBottom: 10, alignItems: "flex-start" }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6, background: T.p6,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: T.p2, flexShrink: 0,
                }}>
                  {t.direction === "up" ? "↑" : t.direction === "down" ? "↓" : "→"}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.t1, marginBottom: 2 }}>{t.title}</div>
                  <div style={{ fontSize: 10, color: T.t3, lineHeight: 1.5 }}>{t.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <div style={{ ...CARD, marginTop: 9 }}>
          <div style={{ ...TY.cardLabel, color: T.p3 }}>Market opportunities — unmet needs</div>
          {opportunities.map((g, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6, background: T.p6,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: T.p2, flexShrink: 0,
              }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.t1, marginBottom: 2 }}>{g.title}</div>
                <div style={{ fontSize: 10, color: T.t3, lineHeight: 1.55 }}>{g.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Positioning space */}
      {d.positioning_space && (
        <div style={{ background: T.p6, borderRadius: 12, padding: "14px 16px", borderLeft: `3px solid ${T.p2}`, marginTop: 9 }}>
          <div style={{ ...TY.cardLabel, color: T.p2, marginBottom: 6 }}>Positioning space for Vault</div>
          <div style={{ fontSize: 12, color: T.p1, lineHeight: 1.65 }}>{d.positioning_space}</div>
        </div>
      )}

      <FeedbackBar phase="market" outputRaw={raw} />
    </div>
  );
}
