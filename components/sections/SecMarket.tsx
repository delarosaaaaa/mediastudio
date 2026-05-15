"use client";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { C, FS } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/primitives";
import type { MarketData, MarketSegment, MarketTrend, MarketGap } from "@/lib/types";

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

function SCard({ children, accent, delay = 0 }: { children: ReactNode; accent?: string; delay?: number }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, overflow: "hidden", marginBottom: 10, animation: `slideInUp .4s ease ${delay}s both` }}>
      {accent && <div style={{ height: 3, background: accent, borderRadius: "14px 14px 0 0" }} />}
      {children}
    </div>
  );
}

function DonutChart({ segments }: { segments: MarketSegment[] }) {
  const [animated, setAnimated] = useState(false);
  const [hov, setHov] = useState<number | null>(null);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t); }, []);
  const COLS = [C.p900, C.p700, C.p600, C.p300];
  const CV = 176;
  let offset = 0;
  const arcs = segments.map((s, i) => {
    const dash = animated ? (s.pct / 100) * CV : 0;
    const o = offset;
    offset += (s.pct / 100) * CV;
    return { dash, gap: CV - dash, offset: -o, col: COLS[i % 4], ...s };
  });
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "16px 18px" }}>
      <svg width="90" height="90" viewBox="0 0 90 90" style={{ flexShrink: 0 }}>
        <circle cx="45" cy="45" r="28" fill="none" stroke={C.inset} strokeWidth="12"/>
        {arcs.map((a, i) => (
          <circle key={i} cx="45" cy="45" r="28" fill="none" stroke={a.col} strokeWidth={hov === i ? 15 : 12}
            strokeDasharray={`${a.dash} ${a.gap}`} strokeDashoffset={a.offset}
            transform="rotate(-90 45 45)" style={{ transition: "stroke-dasharray 1s ease, stroke-width .2s" }}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}/>
        ))}
        <text x="45" y="49" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.ink} fontFamily="sans-serif">
          {hov !== null ? segments[hov].pct + "%" : "100%"}
        </text>
      </svg>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        {segments.map((s, i) => (
          <div key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 7px", borderRadius: 7, background: hov === i ? C.inset : "transparent", cursor: "pointer", transition: "background .15s" }}>
            <div style={{ width: 9, height: 9, borderRadius: 3, background: arcs[i].col, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: FS.bodySm, color: C.ink }}>{s.name}</span>
            <span style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypewriterQuote({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0; const t = setInterval(() => { if (i < text.length) setDisplayed(text.slice(0, ++i)); else clearInterval(t); }, 20);
    return () => clearInterval(t);
  }, [text]);
  return (
    <div style={{ padding: "14px 18px", fontSize: FS.bodyLg, color: C.ink, lineHeight: 1.8, fontStyle: "italic" }}>
      "{displayed}<span style={{ display: "inline-block", width: 2, height: 13, background: C.p700, marginLeft: 2, verticalAlign: "middle", animation: "typing .6s infinite" }}/>"
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 12 }}>
              {[["Total addressable", d.tam], ["Serviceable", d.sam], ["Target segment", d.target_size], ["Marktgroei", d.growth]].filter(([,v]) => v).map(([l, v], i) => (
                <div key={l as string} style={{ background: C.white, borderRadius: 12, boxShadow: C.shadow, overflow: "hidden", animation: `slideInUp .4s ease ${i*.07}s both` }}>
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 5 }}>{l as string}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{v as string}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {segs.length > 0 && (
                <SCard delay={0.05}>
                  <div style={{ padding: "14px 18px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>Segmenten</div></div>
                  <DonutChart segments={segs} />
                </SCard>
              )}
              {d.consumer_behaviour && (
                <SCard delay={0.1}>
                  <div style={{ padding: "14px 18px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>Consumer behaviour shift</div></div>
                  <TypewriterQuote text={d.consumer_behaviour} />
                </SCard>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: TRENDS & KANSEN ── */}
        {sub === tabs[1] && (
          <div>
            {trends.length > 0 && (
              <SCard delay={0}>
                <div style={{ padding: "14px 18px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 0 }}>Key trends</div></div>
                {trends.map((t, i) => {
                  const col = t.direction === "up" ? C.p700 : t.direction === "down" ? "#A32D2D" : C.muted;
                  const arrow = t.direction === "up" ? "↑" : t.direction === "down" ? "↓" : "→";
                  const [drawn, setDrawn] = useState(false);
                  useEffect(() => { const tm = setTimeout(() => setDrawn(true), 200 + i * 150); return () => clearTimeout(tm); }, []);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 18px", borderTop: `.5px solid ${C.border}` }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: `${col}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: col, flexShrink: 0 }}>{arrow}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{t.title}</div>
                        <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{t.description}</div>
                      </div>
                      <svg width="60" height="24" viewBox="0 0 60 24" style={{ flexShrink: 0, marginTop: 4 }}>
                        <polyline points={t.direction==="up"?"0,20 15,16 30,13 45,9 60,4":t.direction==="down"?"0,4 15,8 30,12 45,16 60,20":"0,12 20,11 40,13 60,12"}
                          fill="none" stroke={col} strokeWidth="2" strokeLinecap="round"
                          strokeDasharray="120" strokeDashoffset={drawn ? "0" : "120"} style={{ transition: "stroke-dashoffset 1s ease" }}/>
                      </svg>
                    </div>
                  );
                })}
              </SCard>
            )}
            {opps.length > 0 && (
              <div>
                <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 10 }}>Market opportunities</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
                  {opps.map((g, i) => (
                    <div key={i} style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, overflow: "hidden", animation: `slideInUp .35s ease ${i*.07}s both` }}>
                      <div style={{ height: 3, background: C.p900, borderRadius: "14px 14px 0 0" }} />
                      <div style={{ padding: "14px 16px" }}>
                        <div style={{ fontSize: FS.bodyXs, fontWeight: 700, color: C.p700, marginBottom: 5 }}>0{i + 1}</div>
                        <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{g.title}</div>
                        <div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.55 }}>{g.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {whyNow.length > 0 && (
              <SCard delay={0.1}>
                <div style={{ padding: "14px 18px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 0 }}>Why now</div></div>
                {whyNow.map((w, i) => <div key={i} style={{ display: "flex", gap: 8, padding: "9px 18px", borderTop: `.5px solid ${C.border}` }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: C.p700, marginTop: 5, flexShrink: 0 }} /><div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.55 }}>{w}</div></div>)}
              </SCard>
            )}
          </div>
        )}

        {/* ── TAB 3: STRATEGISCHE POSITIE ── */}
        {sub === tabs[2] && (
          <div>
            {d.positioning_space && (
              <div style={{ background: C.p100, borderLeft: `3px solid ${C.p700}`, borderRadius: "0 14px 14px 0", padding: "16px 18px", marginBottom: 12 }}>
                <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.p700, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 8 }}>Positioning space</div>
                <div style={{ fontSize: FS.bodyLg, fontWeight: 700, color: C.p900, lineHeight: 1.75 }}>{d.positioning_space}</div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {implications.length > 0 && (
                <SCard delay={0.05}>
                  <div style={{ padding: "14px 18px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 0 }}>Strategic implications</div></div>
                  {implications.map((imp, i) => <div key={i} style={{ display: "flex", gap: 8, padding: "9px 18px", borderTop: `.5px solid ${C.border}` }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: C.p700, marginTop: 5, flexShrink: 0 }} /><div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.55 }}>{imp}</div></div>)}
                </SCard>
              )}
              {risks.length > 0 && (
                <SCard delay={0.1}>
                  <div style={{ padding: "14px 18px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 0 }}>Key risks</div></div>
                  {risks.map((r, i) => <div key={i} style={{ display: "flex", gap: 7, padding: "9px 18px", borderTop: `.5px solid ${C.border}` }}><span style={{ fontSize: 11, color: "#BA7517", flexShrink: 0 }}>⚠</span><div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.55 }}>{r}</div></div>)}
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
