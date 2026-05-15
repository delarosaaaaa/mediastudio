"use client";
import { useEffect, useRef, useState } from "react";
import { C, FS } from "@/lib/tokens";
import { KpiCard, Card, CardLabel, FeedbackBar, Pair, SectionLabel } from "@/components/ui/primitives";
import type { MarketData, MarketSegment, MarketTrend, MarketGap } from "@/lib/types";

// Animated donut chart
function DonutChart({ segments }: { segments: MarketSegment[] }) {
  const [animated, setAnimated] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const ref = useRef<SVGCircleElement[]>([]);
  const cols = [C.p900, C.p700, C.p600, C.p400];
  const C_VAL = 176; // 2πr for r=28

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(timer);
  }, []);

  let offset = 0;
  const arcs = segments.map((s, i) => {
    const dash = animated ? (s.pct / 100) * C_VAL : 0;
    const gap = C_VAL - dash;
    const o = -offset;
    offset += (s.pct / 100) * C_VAL;
    return { dash, gap, offset: -o, col: cols[i % 4], ...s };
  });

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <svg width="90" height="90" viewBox="0 0 90 90" style={{ flexShrink: 0 }}>
        <circle cx="45" cy="45" r="28" fill="none" stroke={C.inset} strokeWidth="12" />
        {arcs.map((a, i) => (
          <circle
            key={i} cx="45" cy="45" r="28" fill="none"
            stroke={a.col} strokeWidth={hovered === i ? 15 : 12}
            strokeDasharray={`${a.dash} ${a.gap}`}
            strokeDashoffset={a.offset}
            transform="rotate(-90 45 45)"
            style={{ transition: "stroke-dasharray 1s cubic-bezier(.4,0,.2,1), stroke-width .2s" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        <text x="45" y="49" textAnchor="middle" fontSize={10} fontWeight="700" fill={C.ink} fontFamily="sans-serif">
          {hovered !== null ? segments[hovered].pct + "%" : "100%"}
        </text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        {segments.map((s, i) => (
          <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 6px", borderRadius: 6, background: hovered === i ? C.inset : "transparent", cursor: "pointer", transition: "background .15s" }}>
            <div style={{ width: 9, height: 9, borderRadius: 3, background: cols[i % 4], flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: FS.bodySm, color: C.ink }}>{s.name}</span>
            <span style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Trend sparkline
function TrendRow({ t, delay }: { t: MarketTrend; delay: number }) {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const tm = setTimeout(() => setDrawn(true), delay); return () => clearTimeout(tm); }, [delay]);
  const col = t.direction === "up" ? C.p700 : t.direction === "down" ? "#A32D2D" : C.muted;

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `.5px solid ${C.border}`, transition: "background .15s", cursor: "pointer" }}
      onMouseEnter={e => (e.currentTarget.style.background = C.inset)}
      onMouseLeave={e => (e.currentTarget.style.background = "")}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: `${col}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 700, color: col, transition: "background .2s" }}>
        {t.direction === "up" ? "↑" : t.direction === "down" ? "↓" : "→"}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{t.title}</div>
        <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{t.description}</div>
      </div>
      <svg width="60" height="24" viewBox="0 0 60 24" style={{ flexShrink: 0, marginTop: 4 }}>
        <polyline
          points={t.direction === "up" ? "0,20 12,16 24,14 36,10 48,7 60,3" : t.direction === "down" ? "0,4 12,8 24,10 36,14 48,17 60,20" : "0,12 15,11 30,13 45,12 60,12"}
          fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="200" strokeDashoffset={drawn ? "0" : "200"}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
    </div>
  );
}

// Quote typewriter
function QuoteTypewriter({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, ++i)); }
      else clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [text]);
  return (
    <div style={{ background: C.white, borderRadius: "0 14px 14px 0", border: `.5px solid ${C.border}`, borderLeft: `3px solid ${C.border}`, padding: "14px 16px", flex: 1, display: "flex", alignItems: "center" }}>
      <div style={{ fontSize: FS.bodyLg, color: C.ink, lineHeight: 1.8, fontStyle: "italic" }}>
        "{displayed}"
        <span style={{ display: "inline-block", width: 2, height: 14, background: C.p700, marginLeft: 2, verticalAlign: "middle", animation: "typing .6s infinite" }} />
      </div>
    </div>
  );
}

export function SecMarket({ d, raw }: { d: MarketData; raw: string }) {
  const segments = (d.segments || []) as MarketSegment[];
  const trends = (d.trends || []) as MarketTrend[];
  const opportunities = (d.opportunities || []) as MarketGap[];
  const whyNow = (d.why_now || []) as string[];
  const implications = (d.strategic_implications || []) as string[];
  const risks = (d.risks || []) as string[];

  return (
    <div>
      {/* KPI strip */}
      {(d.tam || d.sam || d.target_size || d.growth) && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 10 }}>
          {[["Total addressable", d.tam], ["Serviceable", d.sam], ["Target segment", d.target_size], ["Growth", d.growth]].filter(([, v]) => v).map(([l, v], i) => (
            <div key={l as string} style={{ background: C.white, borderRadius: 11, boxShadow: C.shadowSm, padding: "12px 14px", borderTop: `.5px solid ${C.border}`, animation: `slideInUp .4s ease ${i * .07}s both` }}>
              <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 }}>{l as string}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{v as string}</div>
            </div>
          ))}
        </div>
      )}

      {/* Donut + Trends */}
      <Pair
        left={<><SectionLabel>2 — Market segments</SectionLabel><Card>{segments.length > 0 ? <DonutChart segments={segments} /> : <div style={{ color: C.muted, fontSize: FS.bodySm }}>No segment data</div>}</Card></>}
        right={<><SectionLabel>3 — Key trends</SectionLabel><Card style={{ padding: "0 16px" }}>{trends.map((t, i) => <TrendRow key={i} t={t} delay={200 + i * 150} />)}</Card></>}
      />

      {/* Consumer behaviour */}
      {d.consumer_behaviour && (
        <div style={{ marginBottom: 10 }}>
          <SectionLabel>4 — Consumer behaviour shift</SectionLabel>
          <QuoteTypewriter text={d.consumer_behaviour} />
        </div>
      )}

      {/* Opportunities + Why now */}
      {(opportunities.length > 0 || whyNow.length > 0) && (
        <Pair
          left={<><SectionLabel>5 — Market opportunities</SectionLabel>
            <Card>{opportunities.map((g, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start", animation: `slideInUp .35s ease ${i * .08}s both` }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: FS.bodyXs, fontWeight: 700, color: C.p700, flexShrink: 0 }}>{i + 1}</div>
                <div><div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{g.title}</div><div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.55 }}>{g.description}</div></div>
              </div>
            ))}</Card></>}
          right={<><SectionLabel>6 — Why now</SectionLabel>
            <Card>{whyNow.map((w, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, animation: `slideInUp .3s ease ${i * .07}s both` }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.p700, marginTop: 6, flexShrink: 0 }} />
                <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.55 }}>{w}</div>
              </div>
            ))}</Card></>}
        />
      )}

      {/* Implications + Risks */}
      {(implications.length > 0 || risks.length > 0) && (
        <Pair
          left={<><SectionLabel>7 — Strategic implications</SectionLabel>
            <Card>{implications.map((imp, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.p700, marginTop: 6, flexShrink: 0 }} />
                <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.55 }}>{imp}</div>
              </div>
            ))}</Card></>}
          right={<><SectionLabel>8 — Key risks</SectionLabel>
            <Card><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {risks.map((r, i) => (
                <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", background: C.inset, borderRadius: 20, fontSize: FS.bodySm, color: C.muted }}>
                  <span style={{ fontSize: 12, color: "#BA7517" }}>⚠</span>{r}
                </div>
              ))}
            </div></Card></>}
        />
      )}

      {/* Positioning */}
      {d.positioning_space && (
        <div>
          <SectionLabel>9 — Positioning space</SectionLabel>
          <div style={{ background: C.p100, borderRadius: "0 14px 14px 0", borderLeft: `3px solid ${C.p700}`, padding: "16px 18px" }}>
            <div style={{ fontSize: FS.bodyLg, fontWeight: 700, color: C.p900, lineHeight: 1.75 }}>{d.positioning_space}</div>
          </div>
        </div>
      )}

      <FeedbackBar phase="market" outputRaw={raw} />
    </div>
  );
}
