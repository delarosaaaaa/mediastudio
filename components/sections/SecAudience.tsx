"use client";
import { useState } from "react";
import { C, FS, SP, HERO, BULLET, SERIES, cardStyle, kpiCardStyle, heroCardStyle, heroLineStyle, labelStyle } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/primitives";
import type { AudienceData, PersonaData, TotalAudienceData } from "@/lib/types";

const PERSONA_LINES = [C.p900, C.p700, C.p600] as const;
const RADAR_LABELS = ["Fee-pijn", "Switch-intent", "Digital-first", "Prijs-sensitief", "App-kwaliteit"];

function SubNav({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 2, marginBottom: 20, borderBottom: `.5px solid ${C.border}` }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{ padding: "6px 16px", border: "none", background: "transparent", fontSize: 11, fontWeight: active === t ? 700 : 500, color: active === t ? C.p700 : C.muted, cursor: "pointer", borderBottom: `2px solid ${active === t ? C.p700 : "transparent"}`, marginBottom: -1, transition: "color .2s" }}>
          {t}
        </button>
      ))}
    </div>
  );
}

function Bullet({ color }: { color: string }) {
  return <div style={{ width: 5, height: 5, borderRadius: "50%", background: color, marginTop: 5, flexShrink: 0 }} />;
}

function RadarChart({ dims, color, size = 110 }: { dims: number[]; color: string; size?: number }) {
  const n = RADAR_LABELS.length;
  const r = size * 0.38;
  const cx = size / 2;
  const cy = size / 2;
  const rings = [r, r * .75, r * .5, r * .25];

  function ptAt(val: number, i: number) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const rr = (val / 100) * r;
    return { x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr };
  }
  function outerPt(i: number, rr = r) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr };
  }
  function labelPt(i: number) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(a) * (r + 16), y: cy + Math.sin(a) * (r + 16) };
  }

  const dataPts = dims.map((d, i) => ptAt(d, i));
  const polygon = dataPts.map(p => `${p.x},${p.y}`).join(" ");
  const vbSize = size + 36;

  return (
    <svg width={vbSize} height={vbSize} viewBox={`-18 -18 ${vbSize} ${vbSize}`}>
      {rings.map((rr, ri) => (
        <polygon key={ri}
          points={Array.from({ length: n }).map((_, i) => { const p = outerPt(i, rr); return `${p.x},${p.y}`; }).join(" ")}
          fill="none" stroke={C.border} strokeWidth=".5"
        />
      ))}
      {Array.from({ length: n }).map((_, i) => {
        const o = outerPt(i); return <line key={i} x1={cx} y1={cy} x2={o.x} y2={o.y} stroke={C.border} strokeWidth=".5" />;
      })}
      <polygon points={polygon} fill={color} opacity=".18" stroke={color} strokeWidth="1.5" />
      {dataPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} />)}
      {RADAR_LABELS.map((lbl, i) => {
        const lp = labelPt(i);
        return <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill={C.muted} fontFamily="-apple-system,sans-serif">{lbl}</text>;
      })}
    </svg>
  );
}

function PersonaCard({ p, index }: { p: PersonaData; index: number }) {
  const lineCol = PERSONA_LINES[index % 3];
  const dims = [
    Math.min(100, 50 + (p.pain_points?.length ?? 0) * 9),
    Math.min(100, 55 + (p.motivations?.length ?? 0) * 8),
    Math.min(100, 60 + index * 9),
    Math.min(100, 55 + index * 7),
    Math.min(100, 48 + (p.platforms?.length ?? 0) * 8),
  ];
  const initials = p.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() ?? "??";

  return (
    <div style={{ ...cardStyle(), animation: `slideInUp .4s ease ${index * .1}s both` }}>
      {/* coloured top-line */}
      <div style={{ height: 4, background: lineCol, borderRadius: "14px 14px 0 0" }} />
      <div style={{ padding: "14px 16px" }}>
        {p.recommended && <div style={{ fontSize: FS.label, fontWeight: 700, color: lineCol, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>★ Aanbevolen</div>}
        {/* avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${lineCol}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: lineCol, flexShrink: 0 }}>{initials}</div>
          <div>
            <div style={{ fontSize: FS.title, fontWeight: 500, color: C.ink, marginBottom: 2 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{p.age}{p.job ? ` · ${p.job}` : ""}</div>
            {p.income && <div style={{ fontSize: 11, color: C.muted }}>{p.income}</div>}
          </div>
        </div>
        {/* platforms */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
          {p.platforms?.slice(0, 4).map((pl, i) => <span key={i} style={{ padding: "2px 9px", background: C.inset, borderRadius: 20, fontSize: 9, color: C.muted }}>{pl}</span>)}
        </div>
        {/* radar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <RadarChart dims={dims} color={lineCol} size={110} />
        </div>
        {/* pain points */}
        <div style={{ borderTop: `.5px solid ${C.border}`, paddingTop: 10, marginBottom: 10 }}>
          <div style={{ ...labelStyle, marginBottom: 8 }}>Pain points</div>
          {(p.pain_points || []).slice(0, 3).map((pp, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7 }}>
              <Bullet color={BULLET.pain} />
              <div style={{ fontSize: 11, color: C.ink, lineHeight: 1.55 }}>{pp}</div>
            </div>
          ))}
        </div>
        {/* motivations */}
        <div style={{ borderTop: `.5px solid ${C.border}`, paddingTop: 10, marginBottom: 10 }}>
          <div style={{ ...labelStyle, marginBottom: 8 }}>Motivaties</div>
          {(p.motivations || []).slice(0, 3).map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7 }}>
              <Bullet color={BULLET.motivation} />
              <div style={{ fontSize: 11, color: C.ink, lineHeight: 1.55 }}>{m}</div>
            </div>
          ))}
        </div>
        {/* trigger */}
        {p.trigger_moments?.[0] && (
          <div style={{ background: C.inset, borderRadius: SP.radiusXs, padding: "9px 12px", marginBottom: 8 }}>
            <div style={{ ...labelStyle, marginBottom: 4 }}>Trigger moment</div>
            <div style={{ fontSize: 11, color: C.ink, lineHeight: 1.5 }}>{p.trigger_moments[0]}</div>
          </div>
        )}
        {/* trust builders */}
        {(p.trust_builders?.length ?? 0) > 0 && (
          <div style={{ background: C.inset, borderRadius: SP.radiusXs, padding: "9px 12px" }}>
            <div style={{ ...labelStyle, marginBottom: 4 }}>Trust builders</div>
            {p.trust_builders!.slice(0, 2).map((tb, i) => (
              <div key={i} style={{ display: "flex", gap: 7, marginBottom: 4 }}>
                <Bullet color={BULLET.motivation} />
                <div style={{ fontSize: 11, color: C.ink }}>{tb}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BarrierCard({ barrier, solution, index }: { barrier: string; solution: string; index: number }) {
  return (
    <div style={{ ...cardStyle(), animation: `slideInUp .35s ease ${index * .07}s both` }}>
      <div style={{ padding: "14px 18px", borderBottom: `.5px solid ${C.border}` }}>
        <div style={{ ...labelStyle, marginBottom: 8 }}>Barrier</div>
        <div style={{ fontSize: FS.body, fontWeight: 500, color: C.ink, lineHeight: 1.5 }}>{barrier}</div>
      </div>
      <div style={{ padding: "12px 18px", background: C.p100 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.p700, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 6 }}>Vault's antwoord</div>
        <div style={{ fontSize: 11, color: "#3C1591", lineHeight: 1.55 }}>{solution}</div>
      </div>
    </div>
  );
}

export function SecAudience({ d, raw }: { d: AudienceData; raw: string }) {
  const [sub, setSub] = useState("① Totaalbeeld");
  const tabs = ["① Totaalbeeld", "② Personas", "③ Barriers & responses"];
  const t = d.total as TotalAudienceData;
  const personas = d.personas || [];

  return (
    <div>
      <SubNav tabs={tabs} active={sub} onChange={setSub} />
      <div key={sub} style={{ animation: "slideInRight .3s ease" }}>

        {/* ── TAB 1: TOTAALBEELD ── */}
        {sub === tabs[0] && t && (
          <div>
            {/* Audience hero */}
            <div style={{ ...cardStyle(), marginBottom: SP.gap, animation: "slideInUp .35s ease both" }}>
              <div style={{ padding: "18px 20px", borderBottom: `.5px solid ${C.border}`, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: C.p700, flexShrink: 0 }}>{personas.length}</div>
                <div>
                  <div style={{ fontSize: FS.title, fontWeight: 500, color: C.ink, marginBottom: 3 }}>Total Audience</div>
                  <div style={{ fontSize: FS.body, color: C.muted }}>{t.age_range}{t.jobs ? ` · ${t.jobs}` : ""}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
                {[["Geschatte omvang", t.size_estimate], ["Inkomen", t.income], ["Media per dag", t.daily_media_hours]].filter(([, v]) => v).map(([l, v], i, arr) => (
                  <div key={l as string} style={{ padding: "14px 20px", borderRight: i < arr.length - 1 ? `.5px solid ${C.border}` : "none" }}>
                    <div style={{ ...labelStyle, marginBottom: 6 }}>{l as string}</div>
                    <div style={{ fontSize: FS.title, fontWeight: 500, color: C.ink }}>{v as string}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Persona preview row */}
            {personas.length > 0 && (
              <div style={{ marginBottom: SP.gap }}>
                <div style={{ ...labelStyle, marginBottom: 10 }}>Persona's binnen dit segment</div>
                <div style={{ display: "flex", gap: SP.gap }}>
                  {personas.map((p, i) => (
                    <div key={i} style={{ ...cardStyle(), flex: 1, animation: `slideInUp .35s ease ${i * .07}s both` }}>
                      <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${PERSONA_LINES[i % 3]}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: PERSONA_LINES[i % 3], flexShrink: 0 }}>
                          {p.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: FS.body, fontWeight: 500, color: C.ink }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{p.age}{p.job ? ` · ${p.job}` : ""}</div>
                        </div>
                        {p.recommended && <div style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, color: PERSONA_LINES[i % 3], textTransform: "uppercase" as const, letterSpacing: ".08em" }}>★ Primary</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Motivations + Pain points — same card style, different bullet colour */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: SP.gap }}>
              <div style={{ ...cardStyle(), animation: "slideInUp .4s ease .08s both" }}>
                <div style={{ padding: "16px 18px 0" }}>
                  <div style={{ ...labelStyle }}>Motivaties</div>
                </div>
                {(t.motivations || []).map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 18px", borderTop: `.5px solid ${C.border}` }}>
                    <Bullet color={BULLET.motivation} />
                    <div style={{ fontSize: FS.body, color: C.ink, lineHeight: 1.6 }}>{m}</div>
                  </div>
                ))}
              </div>
              <div style={{ ...cardStyle(), animation: "slideInUp .4s ease .12s both" }}>
                <div style={{ padding: "16px 18px 0" }}>
                  <div style={{ ...labelStyle }}>Pain points</div>
                </div>
                {(t.pain_points || []).map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 18px", borderTop: `.5px solid ${C.border}` }}>
                    <Bullet color={BULLET.pain} />
                    <div style={{ fontSize: FS.body, color: C.ink, lineHeight: 1.6 }}>{m}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: PERSONAS ── */}
        {sub === tabs[1] && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {personas.map((p, i) => <PersonaCard key={i} p={p} index={i} />)}
          </div>
        )}

        {/* ── TAB 3: BARRIERS ── */}
        {sub === tabs[2] && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {(d.barriers || []).map((b, i) => <BarrierCard key={i} barrier={b.barrier} solution={b.solution} index={i} />)}
          </div>
        )}
      </div>
      <FeedbackBar phase="audience" outputRaw={raw} />
    </div>
  );
}
