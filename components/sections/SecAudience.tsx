"use client";
import type { ReactNode } from "react";
import { useState } from "react";
import { C, FS } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/primitives";
import type { AudienceData, PersonaData, TotalAudienceData } from "@/lib/types";

const COLS = [C.p900, C.p700, C.p600];
const RADAR_LABELS = ["Fee-pijn", "Switch-intent", "Digital-first", "Prijs-sensitief", "App-kwaliteit"];

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

// ─── Radar with labels ────────────────────────────────────────
function RadarChart({ dims, color }: { dims: number[]; color: string }) {
  const n = dims.length; const r = 52; const cx = 80; const cy = 70;
  function pt(val: number, i: number) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const rr = (val / 100) * r;
    return { x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr };
  }
  function ptOuter(i: number) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  }
  function ptLabel(i: number) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(a) * (r + 18), y: cy + Math.sin(a) * (r + 18) };
  }
  const dataPts = dims.map((d, i) => pt(d, i));
  const polygon = dataPts.map(p => `${p.x},${p.y}`).join(" ");
  return (
    <svg width="160" height="140" viewBox="0 0 160 140">
      {/* Grid rings */}
      {[r, r * .75, r * .5, r * .25].map((rr, ri) => (
        <polygon key={ri}
          points={Array.from({ length: n }).map((_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`; }).join(" ")}
          fill="none" stroke={C.border} strokeWidth=".5"
        />
      ))}
      {/* Axis lines */}
      {Array.from({ length: n }).map((_, i) => {
        const o = ptOuter(i);
        return <line key={i} x1={cx} y1={cy} x2={o.x} y2={o.y} stroke={C.border} strokeWidth=".5" />;
      })}
      {/* Data polygon */}
      <polygon points={polygon} fill={color} opacity=".2" stroke={color} strokeWidth="1.5" />
      {/* Data points */}
      {dataPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} />)}
      {/* Labels */}
      {RADAR_LABELS.slice(0, n).map((lbl, i) => {
        const lp = ptLabel(i);
        return (
          <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
            fontSize="8" fill={C.muted} fontFamily="-apple-system,sans-serif">
            {lbl}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Persona flip card ────────────────────────────────────────
function PersonaFlip({ p, index }: { p: PersonaData; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const col = COLS[index % 3];
  const dims = [
    Math.min(100, 50 + (p.pain_points?.length ?? 0) * 9),
    Math.min(100, 55 + (p.motivations?.length ?? 0) * 7),
    Math.min(100, 60 + index * 8),
    Math.min(100, 55 + index * 6),
    Math.min(100, 50 + (p.platforms?.length ?? 0) * 7),
  ];
  const initials = p.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() ?? "??";

  return (
    <div
      onClick={() => setFlipped(f => !f)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ perspective: 1000, cursor: "pointer", animation: `slideInUp .4s ease ${index * .1}s both` }}
    >
      <div style={{
        position: "relative", height: 460,
        transition: "transform .55s cubic-bezier(.4,0,.2,1)",
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : hovered ? "rotateY(-4deg) scale(1.01)" : "none",
      }}>
        {/* ── FRONT ── */}
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: C.white, borderRadius: 16, boxShadow: C.shadow, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Color bar */}
          <div style={{ height: 4, background: col, flexShrink: 0 }} />
          <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Header */}
            {p.recommended && (
              <div style={{ fontSize: 9, fontWeight: 700, color: col, textTransform: "uppercase" as const, letterSpacing: ".1em", marginBottom: 8 }}>★ Aanbevolen segment</div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${col}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: col, flexShrink: 0 }}>
                {initials}
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 3 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{p.age}{p.job ? ` · ${p.job}` : ""}</div>
                {p.income && <div style={{ fontSize: 11, color: C.muted }}>{p.income}</div>}
              </div>
            </div>

            {/* Radar */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
              <RadarChart dims={dims} color={col} />
            </div>

            {/* Platforms */}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
              {p.platforms?.slice(0, 4).map((pl, i) => (
                <span key={i} style={{ padding: "3px 9px", background: C.inset, borderRadius: 20, fontSize: 11, color: C.muted }}>{pl}</span>
              ))}
            </div>

            {/* Mindset */}
            {p.mindset && (
              <div style={{ fontSize: 12, color: C.body, lineHeight: 1.55, fontStyle: "italic", marginBottom: 10 }}>"{p.mindset}"</div>
            )}

            {/* Flip cue */}
            <div style={{
              marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "8px 0", borderTop: `.5px solid ${C.border}`,
              fontSize: 11, color: col, fontWeight: 500,
              opacity: hovered ? 1 : 0.5, transition: "opacity .2s",
            }}>
              <span style={{ fontSize: 14, display: "inline-block", transform: hovered ? "rotate(15deg)" : "none", transition: "transform .3s" }}>⟳</span>
              Klik voor pain points & motivaties
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: col, borderRadius: 16, transform: "rotateY(180deg)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ height: 4, background: "rgba(255,255,255,.2)", flexShrink: 0 }} />
          <div style={{ padding: "16px 18px", flex: 1, overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{initials}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{p.name}</div>
            </div>

            {/* Pain points */}
            {(p.pain_points?.length ?? 0) > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.45)", textTransform: "uppercase" as const, letterSpacing: ".1em", marginBottom: 8 }}>Pain points</div>
                {p.pain_points.map((pp, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,.4)", marginTop: 6, flexShrink: 0 }} />
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.85)", lineHeight: 1.55 }}>{pp}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Motivations */}
            {(p.motivations?.length ?? 0) > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.45)", textTransform: "uppercase" as const, letterSpacing: ".1em", marginBottom: 8 }}>Motivaties</div>
                {p.motivations.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,.4)", marginTop: 6, flexShrink: 0 }} />
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.85)", lineHeight: 1.55 }}>{m}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Trigger */}
            {p.trigger_moments?.[0] && (
              <div style={{ marginBottom: 12, padding: "10px 12px", background: "rgba(255,255,255,.12)", borderRadius: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.45)", textTransform: "uppercase" as const, letterSpacing: ".1em", marginBottom: 5 }}>Trigger moment</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.85)", lineHeight: 1.55 }}>{p.trigger_moments[0]}</div>
              </div>
            )}

            {/* Trust builders */}
            {(p.trust_builders?.length ?? 0) > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.45)", textTransform: "uppercase" as const, letterSpacing: ".1em", marginBottom: 8 }}>Trust builders</div>
                {p.trust_builders!.map((tb, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,.4)", marginTop: 5, flexShrink: 0 }} />
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.8)", lineHeight: 1.5 }}>{tb}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Purchase trigger */}
            {p.purchase_trigger && (
              <div style={{ padding: "10px 12px", background: "rgba(255,255,255,.12)", borderRadius: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.45)", textTransform: "uppercase" as const, letterSpacing: ".1em", marginBottom: 5 }}>Purchase trigger</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.85)", lineHeight: 1.55 }}>{p.purchase_trigger}</div>
              </div>
            )}
          </div>
          <div style={{ padding: "10px 18px", borderTop: ".5px solid rgba(255,255,255,.15)", fontSize: 11, color: "rgba(255,255,255,.35)", textAlign: "center" }}>
            ↩ Klik om terug te draaien
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Barrier card — always visible ───────────────────────────
function BarrierCard({ barrier, solution, index }: { barrier: string; solution: string; index: number }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, overflow: "hidden", animation: `slideInUp .35s ease ${index * .07}s both` }}>
      <div style={{ padding: "16px 18px", borderBottom: `.5px solid ${C.border}` }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".1em", marginBottom: 8 }}>Barrier</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: C.ink, lineHeight: 1.5 }}>{barrier}</div>
      </div>
      <div style={{ padding: "14px 18px", background: C.p100 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.p700, textTransform: "uppercase" as const, letterSpacing: ".1em", marginBottom: 8 }}>Vault's antwoord</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.p900, lineHeight: 1.55 }}>{solution}</div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────
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
            {/* Hero */}
            <SCard delay={0}>
              <div style={{ padding: "20px 22px", borderBottom: `.5px solid ${C.border}`, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: C.p700, flexShrink: 0 }}>
                  {personas.length}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Total Audience</div>
                  <div style={{ fontSize: 13, color: C.muted }}>{t.age_range}{t.jobs ? ` · ${t.jobs}` : ""}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
                {[["Geschatte omvang", t.size_estimate], ["Inkomen", t.income], ["Media per dag", t.daily_media_hours]].filter(([, v]) => v).map(([l, v], i, arr) => (
                  <div key={l as string} style={{ padding: "16px 20px", borderRight: i < arr.length - 1 ? `.5px solid ${C.border}` : "none" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".07em", marginBottom: 6 }}>{l as string}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{v as string}</div>
                  </div>
                ))}
              </div>
            </SCard>

            {/* Personas link */}
            {personas.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 10 }}>Persona's binnen dit segment</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {personas.map((p, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: C.white, borderRadius: 12, boxShadow: C.shadowSm, flex: 1, animation: `slideInUp .35s ease ${i * .07}s both` }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${COLS[i % 3]}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: COLS[i % 3], flexShrink: 0 }}>
                        {p.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{p.age}{p.job ? ` · ${p.job}` : ""}</div>
                      </div>
                      {p.recommended && <div style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, color: COLS[i % 3], textTransform: "uppercase" as const, letterSpacing: ".08em" }}>★ Primary</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Motivations + Pain points */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <SCard delay={0.08}>
                <div style={{ padding: "16px 18px 0" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 12 }}>Motivaties</div>
                </div>
                {(t.motivations || []).map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 18px", borderTop: `.5px solid ${C.border}` }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.p700, marginTop: 6, flexShrink: 0 }} />
                    <div style={{ fontSize: 13, color: C.body, lineHeight: 1.6 }}>{m}</div>
                  </div>
                ))}
              </SCard>
              <SCard delay={0.12}>
                <div style={{ padding: "16px 18px 0" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 12 }}>Pain points</div>
                </div>
                {(t.pain_points || []).map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 18px", borderTop: `.5px solid ${C.border}` }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.muted, marginTop: 6, flexShrink: 0 }} />
                    <div style={{ fontSize: 13, color: C.body, lineHeight: 1.6 }}>{m}</div>
                  </div>
                ))}
              </SCard>
            </div>
          </div>
        )}

        {/* ── TAB 2: PERSONAS ── */}
        {sub === tabs[1] && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(personas.length, 3)}, 1fr)`, gap: 14 }}>
            {personas.map((p, i) => <PersonaFlip key={i} p={p} index={i} />)}
          </div>
        )}

        {/* ── TAB 3: BARRIERS ── */}
        {sub === tabs[2] && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {(d.barriers || []).map((b, i) => (
              <BarrierCard key={i} barrier={b.barrier} solution={b.solution} index={i} />
            ))}
          </div>
        )}
      </div>
      <FeedbackBar phase="audience" outputRaw={raw} />
    </div>
  );
}
