"use client";
import { useEffect, useState } from "react";
import { C, FS, SP, HERO, BULLET, SERIES, cardStyle, kpiCardStyle, heroCardStyle, heroLineStyle, labelStyle } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/primitives";
import type { MarketData, MarketSegment, MarketTrend, MarketGap } from "@/lib/types";

function SubNav({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 2, marginBottom: 20, borderBottom: `.5px solid ${C.border}` }}>
      {tabs.map(t => <button key={t} onClick={() => onChange(t)} style={{ padding: "6px 16px", border: "none", background: "transparent", fontSize: 11, fontWeight: active === t ? 700 : 500, color: active === t ? C.p700 : C.muted, cursor: "pointer", borderBottom: `2px solid ${active === t ? C.p700 : "transparent"}`, marginBottom: -1 }}>{t}</button>)}
    </div>
  );
}

function TrendRow({ t, delay }: { t: MarketTrend; delay: number }) {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const tm = setTimeout(() => setDrawn(true), delay); return () => clearTimeout(tm); }, [delay]);
  const col = t.direction === "up" ? C.p700 : t.direction === "down" ? C.danger : C.muted;
  const arrow = t.direction === "up" ? "↑" : t.direction === "down" ? "↓" : "→";
  const pts = t.direction === "up" ? "0,20 16,16 32,11 48,7 64,3" : t.direction === "down" ? "0,3 16,7 32,11 48,16 64,20" : "0,11 20,10 40,12 64,11";
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 18px", borderTop: `.5px solid ${C.border}` }}>
      <div style={{ width: 28, height: 28, borderRadius: SP.radiusXs, background: `${col}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: col, flexShrink: 0 }}>{arrow}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: FS.body, fontWeight: 500, color: C.ink, marginBottom: 2 }}>{t.title}</div>
        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.55 }}>{t.description}</div>
      </div>
      <svg width="68" height="24" viewBox="0 0 68 24" style={{ flexShrink: 0, marginTop: 3 }}>
        <polyline points={pts} fill="none" stroke={col} strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray="100" strokeDashoffset={drawn ? "0" : "100"} style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
    </div>
  );
}

function DonutChart({ segments }: { segments: MarketSegment[] }) {
  const [anim, setAnim] = useState(false);
  const [hov, setHov] = useState<number | null>(null);
  useEffect(() => { const t = setTimeout(() => setAnim(true), 200); return () => clearTimeout(t); }, []);
  const CV = 188; let offset = 0;
  const arcs = segments.map((s, i) => { const dash = anim ? (s.pct / 100) * CV : 0; const o = offset; offset += (s.pct / 100) * CV; return { dash, gap: CV - dash, offset: -o, col: SERIES[i % 4] }; });
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "16px 18px" }}>
      <svg width="100" height="100" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
        <circle cx="50" cy="50" r="30" fill="none" stroke={C.inset} strokeWidth="14"/>
        {arcs.map((a, i) => <circle key={i} cx="50" cy="50" r="30" fill="none" stroke={a.col} strokeWidth={hov === i ? 17 : 14} strokeDasharray={`${a.dash} ${a.gap}`} strokeDashoffset={a.offset} transform="rotate(-90 50 50)" style={{ transition: "stroke-dasharray 1s ease, stroke-width .2s" }} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}/>)}
        <text x="50" y="54" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.ink} fontFamily="sans-serif">{hov !== null ? segments[hov].pct + "%" : "100%"}</text>
      </svg>
      <div style={{ flex: 1 }}>
        {segments.map((s, i) => (
          <div key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
            style={{ display: "flex", alignItems: "center", gap: 9, padding: "4px 8px", borderRadius: 7, background: hov === i ? C.inset : "transparent", cursor: "pointer", transition: "background .15s" }}>
            <div style={{ width: 9, height: 9, borderRadius: 3, background: arcs[i].col, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: FS.body, color: C.ink }}>{s.name}</span>
            <span style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SecMarket({ d, raw }: { d: MarketData; raw: string }) {
  const [sub, setSub] = useState("① Marktlandschap");
  const tabs = ["① Marktlandschap", "② Trends & kansen", "③ Strategische positie"];
  const segs = (d.segments || []) as MarketSegment[];
  const trends = (d.trends || []) as MarketTrend[];
  const opps = (d.opportunities || []) as MarketGap[];
  const whyNow = d.why_now || [];
  const implications = d.strategic_implications || [];
  const risks = d.risks || [];

  return (
    <div>
      <SubNav tabs={tabs} active={sub} onChange={setSub} />
      <div key={sub} style={{ animation: "slideInRight .3s ease" }}>

        {sub === tabs[0] && (
          <div>
            {/* KPI strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: SP.gap, marginBottom: SP.gap }}>
              {[["Total addressable", d.tam], ["Serviceable", d.sam], ["Target segment", d.target_size], ["Marktgroei", d.growth]].filter(([, v]) => v).map(([l, v], i) => (
                <div key={l as string} style={{ ...kpiCardStyle(), animation: `slideInUp .4s ease ${i * .07}s both` }}>
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ ...labelStyle, marginBottom: 6 }}>{l as string}</div>
                    <div style={{ fontSize: FS.title, fontWeight: 500, color: C.ink }}>{v as string}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Donut + Consumer behaviour */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: SP.gap, marginBottom: SP.gap }}>
              {segs.length > 0 && (
                <div style={{ ...cardStyle() }}>
                  <div style={{ padding: "16px 18px 0" }}><div style={{ ...labelStyle }}>Marktsegmenten</div></div>
                  <DonutChart segments={segs} />
                  <div style={{ margin: "0 18px 14px", padding: "10px 14px", background: C.inset, borderRadius: SP.radiusXs }}>
                    <div style={{ ...labelStyle, marginBottom: 5 }}>Segment → Persona mapping</div>
                    <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.65 }}>
                      {segs[0]?.name} → primaire persona's. {segs[1]?.name ? `${segs[1].name} → hoogste strategische prioriteit.` : ""}
                    </div>
                  </div>
                </div>
              )}
              {d.consumer_behaviour && (
                <div style={{ ...cardStyle() }}>
                  <div style={{ padding: "16px 18px 0" }}><div style={{ ...labelStyle }}>Consumer behaviour shift</div></div>
                  <div style={{ padding: "14px 18px" }}>
                    <div style={{ fontSize: FS.body, color: C.ink, lineHeight: 1.85, fontStyle: "italic", borderLeft: `3px solid ${C.p700}`, paddingLeft: 14 }}>"{d.consumer_behaviour}"</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {sub === tabs[1] && (
          <div>
            {/* Column headers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 28px 1fr 28px 1fr", gap: 0, marginBottom: 10, padding: "0 2px" }}>
              <div style={{ ...labelStyle, textAlign: "center", marginBottom: 0 }}>Trend</div>
              <div/>
              <div style={{ ...labelStyle, textAlign: "center", color: C.p700, marginBottom: 0 }}>Kans</div>
              <div/>
              <div style={{ ...labelStyle, textAlign: "center", marginBottom: 0 }}>Why now</div>
            </div>
            {trends.map((t, i) => {
              const opp = opps[i];
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 28px 1fr 28px 1fr", gap: 0, marginBottom: 10, alignItems: "center" }}>
                  {/* Trend — Variant A */}
                  <div style={{ ...cardStyle() }}>
                    <TrendRow t={t} delay={150 + i * 100} />
                  </div>
                  <div style={{ textAlign: "center", fontSize: 14, color: C.p300 }}>→</div>
                  {/* Kans — Variant B kansCard */}
                  {opp ? (
                    <div style={{ ...heroCardStyle("kansCard"), animation: `slideInUp .35s ease ${i * .07 + .05}s both` }}>
                      <div style={{ ...heroLineStyle("kansCard") }} />
                      <div style={{ padding: "12px 14px" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: HERO.kansCard.label, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 6 }}>Kans {String(i + 1).padStart(2, "0")}</div>
                        <div style={{ fontSize: FS.body, fontWeight: 500, color: HERO.kansCard.heroText, lineHeight: 1.45 }}>{opp.title}</div>
                        {opp.description && <div style={{ fontSize: 11, color: HERO.kansCard.bodyText, marginTop: 4, lineHeight: 1.5 }}>{opp.description}</div>}
                      </div>
                    </div>
                  ) : <div />}
                  <div style={{ textAlign: "center", fontSize: 14, color: C.p300 }}>→</div>
                  {/* Why now — inset bg, no shadow */}
                  <div style={{ background: C.inset, borderRadius: SP.radius, padding: "12px 14px", animation: `slideInUp .35s ease ${i * .07 + .1}s both` }}>
                    <div style={{ ...labelStyle, marginBottom: 6 }}>Why now</div>
                    <div style={{ fontSize: 11, color: C.ink, lineHeight: 1.55 }}>{whyNow[i] ?? "Timing is cruciaal"}</div>
                  </div>
                </div>
              );
            })}
            {/* Extra opps without trend */}
            {opps.slice(trends.length).map((g, i) => (
              <div key={`extra-${i}`} style={{ ...heroCardStyle("kansCard"), marginBottom: 10, animation: `slideInUp .35s ease ${(trends.length + i) * .07}s both` }}>
                <div style={{ ...heroLineStyle("kansCard") }} />
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: HERO.kansCard.label, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 5 }}>Kans {String(trends.length + i + 1).padStart(2, "0")}</div>
                  <div style={{ fontSize: FS.body, fontWeight: 500, color: HERO.kansCard.heroText }}>{g.title}</div>
                  {g.description && <div style={{ fontSize: 11, color: HERO.kansCard.bodyText, marginTop: 3 }}>{g.description}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {sub === tabs[2] && (
          <div>
            {d.positioning_space && (
              <div style={{ background: C.p100, borderLeft: `3px solid ${C.p700}`, borderRadius: `0 ${SP.radius}px ${SP.radius}px 0`, padding: "16px 20px", marginBottom: SP.gap }}>
                <div style={{ ...labelStyle, color: C.p700, marginBottom: 8 }}>Positioning space</div>
                <div style={{ fontSize: FS.title, fontWeight: 500, color: C.p900, lineHeight: 1.65 }}>{d.positioning_space}</div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: SP.gap }}>
              {implications.length > 0 && (
                <div style={{ ...cardStyle() }}>
                  <div style={{ padding: "16px 18px 0" }}><div style={{ ...labelStyle }}>Strategic implications</div></div>
                  {implications.map((imp, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "10px 18px", borderTop: `.5px solid ${C.border}` }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: BULLET.implication, marginTop: 5, flexShrink: 0 }} />
                      <div style={{ fontSize: FS.body, color: C.ink, lineHeight: 1.6 }}>{imp}</div>
                    </div>
                  ))}
                </div>
              )}
              {risks.length > 0 && (
                <div style={{ ...cardStyle() }}>
                  <div style={{ padding: "16px 18px 0" }}><div style={{ ...labelStyle }}>Key risks</div></div>
                  {risks.map((r, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "10px 18px", borderTop: `.5px solid ${C.border}` }}>
                      <span style={{ fontSize: 12, color: C.warning, flexShrink: 0, marginTop: 1 }}>⚠</span>
                      <div style={{ fontSize: FS.body, color: C.ink, lineHeight: 1.6 }}>{r}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <FeedbackBar phase="market" outputRaw={raw} />
    </div>
  );
}
