"use client";
import type { ReactNode } from "react";
import { useState } from "react";
import { C, FS } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/primitives";
import type { AudienceData, PersonaData, TotalAudienceData } from "@/lib/types";

const COLS = [C.p900, C.p700, C.p600];

function SCard({ children, accent, delay = 0 }: { children: ReactNode; accent?: string; delay?: number }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, overflow: "hidden", animation: `slideInUp .4s ease ${delay}s both` }}>
      {accent && <div style={{ height: 3, background: accent, borderRadius: "14px 14px 0 0" }} />}
      {children}
    </div>
  );
}

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

function radarPts(vals: number[], r: number, n: number) {
  return vals.map((v, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; const rr = (v / 100) * r; return `${Math.cos(a) * rr},${Math.sin(a) * rr}`; }).join(" ");
}

function RadarMini({ dims, color }: { dims: number[]; color: string }) {
  const n = dims.length; const r = 32;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72"><g transform="translate(36,36)">
      {[r, r*.75, r*.5, r*.25].map((rr, i) => <polygon key={i} points={Array.from({length:n}).map((_,j)=>{const a=(j/n)*Math.PI*2-Math.PI/2;return `${Math.cos(a)*rr},${Math.sin(a)*rr}`;}).join(" ")} fill="none" stroke={C.border} strokeWidth=".5"/>)}
      {Array.from({length:n}).map((_,i)=>{const a=(i/n)*Math.PI*2-Math.PI/2;return <line key={i} x1="0" y1="0" x2={Math.cos(a)*r} y2={Math.sin(a)*r} stroke={C.border} strokeWidth=".5"/>;})}
      <polygon points={radarPts(dims,r,n)} fill={color} opacity=".25" stroke={color} strokeWidth="1.5"/>
      {dims.map((d,i)=>{const a=(i/n)*Math.PI*2-Math.PI/2;const rr=(d/100)*r;return <circle key={i} cx={Math.cos(a)*rr} cy={Math.sin(a)*rr} r="3" fill={color}/>;})}
    </g></svg>
  );
}

function PersonaFlip({ p, index }: { p: PersonaData; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const col = COLS[index % 3];
  const dims = [
    Math.min(100, 55 + (p.pain_points?.length ?? 0) * 8),
    Math.min(100, 50 + (p.motivations?.length ?? 0) * 7),
    Math.min(100, 65 + index * 5),
    Math.min(100, 60 + index * 4),
    Math.min(100, 55 + (p.platforms?.length ?? 0) * 6),
  ];
  const initials = p.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() ?? "??";
  return (
    <div onClick={() => setFlipped(f => !f)} style={{ perspective: 900, cursor: "pointer", animation: `slideInUp .4s ease ${index * .1}s both` }}>
      <div style={{ position: "relative", height: 280, transition: "transform .52s cubic-bezier(.4,0,.2,1)", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "none" }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: C.white, borderRadius: 14, boxShadow: C.shadow, display: "flex", flexDirection: "column", padding: 18 }}>
          {p.recommended && <div style={{ fontSize: FS.bodyXs, fontWeight: 700, color: col, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 8 }}>★ Recommended</div>}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.inset, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: col, flexShrink: 0 }}>{initials}</div>
            <div><div style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{p.name}</div><div style={{ fontSize: FS.bodySm, color: C.muted }}>{p.age}{p.job ? ` · ${p.job}` : ""}</div></div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", flex: 1 }}><RadarMini dims={dims} color={col} /></div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 10 }}>
            {p.platforms?.slice(0, 3).map((pl, i) => <span key={i} style={{ padding: "2px 8px", background: C.inset, borderRadius: 20, fontSize: FS.bodyXs, color: C.muted }}>{pl}</span>)}
          </div>
          <div style={{ marginTop: 8, fontSize: FS.bodyXs, color: C.faint, textAlign: "center" }}>Klik voor pain points →</div>
        </div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: col, borderRadius: 14, padding: 18, transform: "rotateY(180deg)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 12 }}>Pain points</div>
          {p.pain_points?.slice(0, 3).map((pp, i) => <div key={i} style={{ display: "flex", gap: 8, marginBottom: 9, alignItems: "flex-start" }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,.4)", marginTop: 6, flexShrink: 0 }} /><div style={{ fontSize: FS.bodySm, color: "rgba(255,255,255,.85)", lineHeight: 1.55 }}>{pp}</div></div>)}
          {p.trigger_moments?.[0] && <div style={{ marginTop: 10, padding: "8px 10px", background: "rgba(255,255,255,.1)", borderRadius: 8 }}><div style={{ fontSize: FS.bodyXs, color: "rgba(255,255,255,.5)", marginBottom: 3 }}>Trigger moment</div><div style={{ fontSize: FS.bodySm, color: "rgba(255,255,255,.8)" }}>{p.trigger_moments[0]}</div></div>}
          <div style={{ marginTop: "auto", fontSize: FS.bodyXs, color: "rgba(255,255,255,.35)", textAlign: "center" }}>↩ Klik om terug te draaien</div>
        </div>
      </div>
    </div>
  );
}


function BarrierFlip({ barrier, solution, index }: { barrier: string; solution: string; index: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div onClick={() => setFlipped(f => !f)} style={{ perspective: 900, height: 100, cursor: "pointer", animation: `slideInUp .35s ease ${index * .07}s both` }}>
      <div style={{ position: "relative", width: "100%", height: "100%", transition: "transform .48s cubic-bezier(.4,0,.2,1)", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "none" }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: C.white, borderRadius: 14, boxShadow: C.shadow, overflow: "hidden" }}>
          <div style={{ height: 3, background: C.inset, borderRadius: "14px 14px 0 0" }} />
          <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: FS.bodyXs, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 5 }}>Barrier</div>
              <div style={{ fontSize: FS.bodyLg, fontWeight: 500, color: C.ink }}>{barrier}</div>
            </div>
            <div style={{ fontSize: FS.bodyXs, color: C.faint }}>→ klik voor antwoord</div>
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: C.p900, borderRadius: 14, transform: "rotateY(180deg)", overflow: "hidden" }}>
          <div style={{ height: 3, background: C.p700, borderRadius: "14px 14px 0 0" }} />
          <div style={{ padding: "14px 18px" }}>
            <div style={{ fontSize: FS.bodyXs, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 5 }}>Vault's antwoord</div>
            <div style={{ fontSize: FS.bodyLg, fontWeight: 500, color: "#fff" }}>{solution}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SecAudience({ d, raw }: { d: AudienceData; raw: string }) {
  const [sub, setSub] = useState("① Totaalbeeld");
  const tabs = ["① Totaalbeeld", "② Personas", "③ Barriers & responses"];
  const t = d.total as TotalAudienceData;

  return (
    <div>
      <SubNav tabs={tabs} active={sub} onChange={setSub} />

      <div key={sub} style={{ animation: "slideInRight .3s ease" }}>

        {/* ── TAB 1: TOTAALBEELD ── */}
        {sub === tabs[0] && (
          <div>
            {t && (
              <>
                {/* Hero */}
                <SCard delay={0}>
                  <div style={{ padding: "18px 20px", borderBottom: `.5px solid ${C.border}`, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: C.p700, flexShrink: 0 }}>
                      {String(d.personas?.length ?? 0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 2 }}>Total Audience</div>
                      <div style={{ fontSize: FS.bodySm, color: C.muted }}>{t.age_range}{t.jobs ? ` · ${t.jobs}` : ""}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
                    {[["Geschatte omvang", t.size_estimate], ["Inkomen", t.income], ["Media/dag", t.daily_media_hours]].filter(([,v]) => v).map(([l, v], i, arr) => (
                      <div key={l as string} style={{ padding: "12px 16px", borderRight: i < arr.length - 1 ? `.5px solid ${C.border}` : "none" }}>
                        <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".07em", marginBottom: 4 }}>{l as string}</div>
                        <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{v as string}</div>
                      </div>
                    ))}
                  </div>
                </SCard>
                {/* Motivations + Pain points */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                  <SCard delay={0.08}>
                    <div style={{ padding: "14px 16px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 10 }}>Motivaties</div></div>
                    {(t.motivations || []).map((m, i) => <div key={i} style={{ display: "flex", gap: 8, padding: "8px 16px", borderTop: `.5px solid ${C.border}` }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: C.p700, marginTop: 5, flexShrink: 0 }} /><div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.55 }}>{m}</div></div>)}
                  </SCard>
                  <SCard delay={0.12}>
                    <div style={{ padding: "14px 16px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 10 }}>Pain points</div></div>
                    {(t.pain_points || []).map((m, i) => <div key={i} style={{ display: "flex", gap: 8, padding: "8px 16px", borderTop: `.5px solid ${C.border}` }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: C.muted, marginTop: 5, flexShrink: 0 }} /><div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.55 }}>{m}</div></div>)}
                  </SCard>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── TAB 2: PERSONAS ── */}
        {sub === tabs[1] && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(d.personas?.length ?? 1, 3)},1fr)`, gap: 12 }}>
            {(d.personas || []).map((p, i) => <PersonaFlip key={i} p={p} index={i} />)}
          </div>
        )}

        {/* ── TAB 3: BARRIERS ── */}
        {sub === tabs[2] && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(d.barriers || []).map((b, i) => <BarrierFlip key={i} barrier={b.barrier} solution={b.solution} index={i} />)}
          </div>
        )}
      </div>
      <FeedbackBar phase="audience" outputRaw={raw} />
    </div>
  );
}
