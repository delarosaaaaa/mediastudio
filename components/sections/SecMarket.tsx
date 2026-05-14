"use client";
import { C, FS } from "@/lib/tokens";
import { KpiCard, FeedbackBar, SectionCard, Pair, SectionLabel, BulletItem, Divider } from "@/components/ui/primitives";
import type { MarketData, MarketSegment, MarketTrend, MarketGap } from "@/lib/types";

// ─── Shared layout primitives ────────────────────────────────
const SEG_COLORS = [C.p900, C.p700, C.p600, C.p300];

function SecTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>
      {children}
    </div>
  );
}

// ─── Section sub-components ───────────────────────────────────

function Segments({ items }: { items: MarketSegment[] }) {
  return (
    <Card>
      {items.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < items.length - 1 ? 9 : 0 }}>
          <div style={{ fontSize: FS.bodySm, color: C.body, width: 130, flexShrink: 0 }}>{s.name}</div>
          <div style={{ flex: 1, height: 6, background: C.inset, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${s.pct}%`, height: "100%", background: SEG_COLORS[i % 4], borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: FS.bodySm, fontWeight: 500, color: C.ink, width: 30, textAlign: "right" }}>{s.pct}%</div>
        </div>
      ))}
    </Card>
  );
}

function Trends({ items }: { items: MarketTrend[] }) {
  return (
    <Card style={{ padding: "0 16px" }}>
      {items.map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 0", borderBottom: i < items.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 500, color: C.p900 }}>
            {t.direction === "up" ? "↑" : t.direction === "down" ? "↓" : "→"}
          </div>
          <div>
            <div style={{ fontSize: FS.body, fontWeight: 500, color: C.ink, marginBottom: 3 }}>{t.title}</div>
            <div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.55 }}>{t.description}</div>
          </div>
        </div>
      ))}
    </Card>
  );
}

function Opportunities({ items }: { items: MarketGap[] }) {
  return (
    <Card>
      {items.map((g, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < items.length - 1 ? 11 : 0, alignItems: "flex-start" }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: FS.bodyXs, fontWeight: 500, color: C.p900, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
          <div>
            <div style={{ fontSize: FS.body, fontWeight: 500, color: C.ink, marginBottom: 3 }}>{g.title}</div>
            <div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.55 }}>{g.description}</div>
          </div>
        </div>
      ))}
    </Card>
  );
}

function BulletCard({ items }: { items: string[] }) {
  return (
    <Card>
      {items.map((item, i) => (
        <BulletItem key={i} text={item} color={i === items.length - 1 ? C.p700 : C.p700} />
      ))}
    </Card>
  );
}

function RiskCard({ items }: { items: string[] }) {
  return (
    <Card>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {items.map((r, i) => (
          <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", background: C.inset, borderRadius: 20, fontSize: FS.bodySm, color: C.muted }}>
            <span style={{ fontSize: 12, color: "#BA7517" }}>⚠</span>{r}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export function SecMarket({ d, raw }: { d: MarketData; raw: string }) {
  const segments      = (d.segments      || []) as MarketSegment[];
  const trends        = (d.trends        || []) as MarketTrend[];
  const opportunities = (d.opportunities || []) as MarketGap[];
  const whyNow        = (d.why_now       || []) as string[];
  const implications  = (d.strategic_implications || []) as string[];
  const risks         = (d.risks         || []) as string[];

  return (
    <div>

      {/* 1. Market size */}
      {(d.tam || d.sam || d.target_size || d.growth) && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 10 }}>
          {d.tam         && <KpiCard label="Total addressable"  value={d.tam} />}
          {d.sam         && <KpiCard label="Serviceable market" value={d.sam} />}
          {d.target_size && <KpiCard label="Target segment"     value={d.target_size} />}
          {d.growth      && <KpiCard label="Market growth"      value={d.growth} />}
        </div>
      )}

      {/* 2 + 3 — equal height pair */}
      {(segments.length > 0 || trends.length > 0) && (
        <Pair
          left={<><SecTitle>2 — Market segments</SecTitle><Segments items={segments} /></>}
          right={<><SecTitle>3 — Key trends</SecTitle><Trends items={trends} /></>}
        />
      )}

      {/* 4. Consumer behaviour shift */}
      {d.consumer_behaviour && (
        <div style={{ marginBottom: 10 }}>
          <SecTitle>4 — Consumer behaviour shift</SecTitle>
          <div style={{ background: C.white, borderRadius: "0 14px 14px 0", border: `0.5px solid ${C.border}`, borderLeft: `3px solid ${C.border}`, padding: "16px 18px" }}>
            <div style={{ fontSize: FS.bodyLg, color: C.ink, lineHeight: 1.8, fontStyle: "italic" }}>"{d.consumer_behaviour}"</div>
          </div>
        </div>
      )}

      {/* 5 + 6 — equal height pair */}
      {(opportunities.length > 0 || whyNow.length > 0) && (
        <Pair
          left={<><SecTitle>5 — Market opportunities</SecTitle><Opportunities items={opportunities} /></>}
          right={<><SecTitle>6 — Why now</SecTitle><BulletCard items={whyNow} /></>}
        />
      )}

      {/* 7 + 8 — equal height pair */}
      {(implications.length > 0 || risks.length > 0) && (
        <Pair
          left={<><SecTitle>7 — Strategic implications</SecTitle><BulletCard items={implications} /></>}
          right={<><SecTitle>8 — Key risks</SecTitle><RiskCard items={risks} /></>}
        />
      )}

      {/* 9. Positioning space */}
      {d.positioning_space && (
        <div style={{ marginBottom: 10 }}>
          <SecTitle>9 — Positioning space</SecTitle>
          <div style={{ background: C.p100, borderRadius: "0 14px 14px 0", borderLeft: `3px solid ${C.p700}`, padding: "16px 18px" }}>
            <div style={{ fontSize: FS.bodyLg, fontWeight: 500, color: C.p900, lineHeight: 1.75 }}>{d.positioning_space}</div>
          </div>
        </div>
      )}

      <FeedbackBar phase="market" outputRaw={raw} />
    </div>
  );
}
