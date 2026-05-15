"use client";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { C, FS } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/primitives";
import type { MarketData, MarketSegment, MarketTrend, MarketGap } from "@/lib/types";

const SCOLS = [C.p900, C.p700, C.p600, C.p300];

function SubNav({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 2, marginBottom: 20, borderBottom: `.5px solid ${C.border}` }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{ padding: "6px 16px", border: "none", background: "transparent", fontSize: FS.bodySm, fontWeight: active === t ? 700 : 500, color: active === t ? C.p700 : C.muted, cursor: "pointer", borderBottom: `2px solid ${active === t ? C.p700 : "transparent"}`, marginBottom: -1, transition: "color .2s" }}>
          {t}
        </button>
      ))}
    </div>
  );
}

function SCard({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, overflow: "hidden", marginBottom: 10, animation: `slideInUp .4s ease ${delay}s both` }}>
      {children}
    </div>
  );
}

// ─── Donut chart ──────────────────────────────────────────────
function DonutChart({ segments }: { segments: MarketSegment[] }) {
  const [animated, setAnimated] = useState(false);
  const [hov, setHov] = useState<number | null>(null);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t); }, []);
  const CV = 176;
  let offset = 0;
  const arcs = segments.map((s, i) => {
    const dash = animated ? (s.pct / 100) * CV : 0;
    const o = offset;
    offset += (s.pct / 100) * CV;
    return { dash, gap: CV - dash, offset: -o, col: SCOLS[i % 4], ...s };
  });
  return (
    <div style={{ display: "flex", gap: 18, alignItems: "center", padding: "18px 20px" }}>
      <svg width="100" height="100" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
        <circle cx="50" cy="50" r="32" fill="none" stroke={C.inset} strokeWidth="14" />
        {arcs.map((a, i) => (
          <circle key={i} cx="50" cy="50" r="32" fill="none" stroke={a.col}
            strokeWidth={hov === i ? 17 : 14}
            strokeDasharray={`${a.dash} ${a.gap}`}
            strokeDashoffset={a.offset}
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dasharray 1s ease, stroke-width .2s" }}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} />
        ))}
        <text x="50" y="54" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.ink} fontFamily="sans-serif">
          {hov !== null ? segments[hov].pct + "%" : "100%"}
        </text>
      </svg>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {segments.map((s, i) => (
          <div key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px", borderRadius: 8, background: hov === i ? C.inset : "transparent", cursor: "pointer", transition: "background .15s" }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: arcs[i].col, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, color: C.ink }}>{s.name}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Trend row with sparkline ─────────────────────────────────
function TrendRow({ t, delay }: { t: MarketTrend; delay: number }) {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const tm = setTimeout(() => setDrawn(true), delay); return () => clearTimeout(tm); }, [delay]);
  const col = t.direction === "up" ? C.p700 : t.direction === "down" ? "#A32D2D" : C.muted;
  const arrow = t.direction === "up" ? "↑" : t.direction === "down" ? "↓" : "→";
  const pts = t.direction === "up" ? "0,20 15,16 30,12 45,8 60,3" : t.direction === "down" ? "0,3 15,8 30,12 45,16 60,20" : "0,12 20,11 40,13 60,12";
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 20px", borderTop: `.5px solid ${C.border}` }}>
      <div style={{ width: 30, height: 30, borderRadius: 9, background: `${col}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: col, flexShrink: 0 }}>{arrow}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 3 }}>{t.title}</div>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.55 }}>{t.description}</div>
      </div>
      <svg width="64" height="24" viewBox="0 0 64 24" style={{ flexShrink: 0, marginTop: 4 }}>
        <polyline points={pts} fill="none" stroke={col} strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray="120" strokeDashoffset={drawn ? "0" : "120"}
          style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
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

        {/* ── TAB 1: MARKTLANDSCHAP ── */}
        {sub === tabs[0] && (
          <div>
            {/* KPI strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 12 }}>
              {[["Total addressable", d.tam], ["Serviceable", d.sam], ["Target segment", d.target_size], ["Marktgroei", d.growth]].filter(([, v]) => v).map(([l, v], i) => (
                <div key={l as string} style={{ background: C.white, borderRadius: 12, boxShadow: C.shadow, overflow: "hidden", animation: `slideInUp .4s ease ${i * .07}s both` }}>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 6 }}>{l as string}</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: C.ink }}>{v as string}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Segmenten + personas link */}
            {segs.length > 0 && (
              <SCard delay={0.05}>
                <div style={{ padding: "16px 20px 0" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 0 }}>Marktsegmenten</div>
                </div>
                <DonutChart segments={segs} />
                {/* Persona mapping */}
                <div style={{ padding: "0 20px 16px" }}>
                  <div style={{ padding: "12px 14px", background: C.inset, borderRadius: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 8 }}>Segment → Persona mapping</div>
                    <div style={{ fontSize: 12, color: C.body, lineHeight: 1.65 }}>
                      De segmenten komen overeen met de geïdentificeerde persona's. Urban professionals (segment 1) → primaire persona's Daan/Sven. Freelancers/ZZP (segment 2) → hoogste strategische prioriteit. Starters (segment 3) → secundaire doelgroep.
                    </div>
                  </div>
                </div>
              </SCard>
            )}

            {/* Consumer behaviour — plain text, no typewriter */}
            {d.consumer_behaviour && (
              <SCard delay={0.1}>
                <div style={{ padding: "16px 20px 14px", borderBottom: `.5px solid ${C.border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>Consumer behaviour shift</div>
                </div>
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.8, fontStyle: "italic", borderLeft: `3px solid ${C.border}`, paddingLeft: 16 }}>"{d.consumer_behaviour}"</div>
                </div>
              </SCard>
            )}
          </div>
        )}

        {/* ── TAB 2: TRENDS & KANSEN ── */}
        {sub === tabs[1] && (
          <div>
            {/* Intro */}
            <div style={{ padding: "13px 17px", background: C.inset, borderRadius: 12, borderLeft: `3px solid ${C.p700}`, marginBottom: 14, fontSize: 13, color: C.muted, lineHeight: 1.65 }}>
              Elke trend creëert een marktopening. De kansen hieronder sluiten direct aan op de trends.
            </div>

            {/* Trends + linked opportunities as one flow */}
            {trends.map((t, i) => {
              const opp = opps[i];
              return (
                <div key={i} style={{ marginBottom: 10 }}>
                  {/* Trend */}
                  <SCard delay={i * 0.07}>
                    <div style={{ padding: "14px 20px 0" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>Trend {i + 1}</div>
                    </div>
                    <TrendRow t={t} delay={150 + i * 100} />
                  </SCard>

                  {/* Arrow connector */}
                  {opp && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 20px" }}>
                      <div style={{ width: 1, height: 20, background: C.p300, margin: "0 14px" }} />
                      <div style={{ fontSize: 10, color: C.p700, fontWeight: 500 }}>↳ opent deze kans</div>
                    </div>
                  )}

                  {/* Linked opportunity */}
                  {opp && (
                    <div style={{ background: C.p100, borderRadius: 12, overflow: "hidden", marginLeft: 30, animation: `slideInUp .35s ease ${i * .07 + .05}s both` }}>
                      <div style={{ height: 3, background: C.p900, borderRadius: "12px 12px 0 0" }} />
                      <div style={{ padding: "13px 16px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.p700, marginBottom: 5 }}>Kans 0{i + 1}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.p900, marginBottom: 5 }}>{opp.title}</div>
                        <div style={{ fontSize: 12, color: C.p700, lineHeight: 1.55 }}>{opp.description}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Extra opportunities without linked trend */}
            {opps.slice(trends.length).map((g, i) => (
              <div key={`extra-${i}`} style={{ background: C.p100, borderRadius: 12, overflow: "hidden", marginBottom: 10, animation: `slideInUp .35s ease ${(trends.length + i) * .07}s both` }}>
                <div style={{ height: 3, background: C.p900, borderRadius: "12px 12px 0 0" }} />
                <div style={{ padding: "13px 16px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.p700, marginBottom: 5 }}>Kans 0{trends.length + i + 1}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.p900, marginBottom: 5 }}>{g.title}</div>
                  <div style={{ fontSize: 12, color: C.p700, lineHeight: 1.55 }}>{g.description}</div>
                </div>
              </div>
            ))}

            {/* Why now — separate, below */}
            {whyNow.length > 0 && (
              <SCard delay={0.2}>
                <div style={{ padding: "16px 20px 0" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 0 }}>Why now — timing is cruciaal</div>
                </div>
                {whyNow.map((w, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "11px 20px", borderTop: `.5px solid ${C.border}` }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.p700, marginTop: 7, flexShrink: 0 }} />
                    <div style={{ fontSize: 13, color: C.body, lineHeight: 1.6 }}>{w}</div>
                  </div>
                ))}
              </SCard>
            )}
          </div>
        )}

        {/* ── TAB 3: STRATEGISCHE POSITIE ── */}
        {sub === tabs[2] && (
          <div>
            {d.positioning_space && (
              <div style={{ background: C.p100, borderLeft: `3px solid ${C.p700}`, borderRadius: "0 14px 14px 0", padding: "18px 20px", marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.p700, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 8 }}>Positioning space</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.p900, lineHeight: 1.75 }}>{d.positioning_space}</div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {implications.length > 0 && (
                <SCard delay={0.05}>
                  <div style={{ padding: "16px 18px 0" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 0 }}>Strategic implications</div>
                  </div>
                  {implications.map((imp, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "11px 18px", borderTop: `.5px solid ${C.border}` }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.p700, marginTop: 6, flexShrink: 0 }} />
                      <div style={{ fontSize: 13, color: C.body, lineHeight: 1.6 }}>{imp}</div>
                    </div>
                  ))}
                </SCard>
              )}
              {risks.length > 0 && (
                <SCard delay={0.1}>
                  <div style={{ padding: "16px 18px 0" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 0 }}>Key risks</div>
                  </div>
                  {risks.map((r, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "11px 18px", borderTop: `.5px solid ${C.border}` }}>
                      <span style={{ fontSize: 13, color: "#BA7517", flexShrink: 0 }}>⚠</span>
                      <div style={{ fontSize: 13, color: C.body, lineHeight: 1.6 }}>{r}</div>
                    </div>
                  ))}
                </SCard>
              )}
            </div>
          </div>
        )}
      </div>
      <FeedbackBar phase="market" outputRaw={raw} />
    </div>
  );
}
