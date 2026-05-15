"use client";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { C, FS, SP, HERO, BULLET, SERIES, cardStyle, kpiCardStyle, heroCardStyle, heroLineStyle, labelStyle } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/primitives";
import type { StrategyData, FunnelStage, Channel, ChannelOverlap, MessagingPillar, AudiencePriority, RetargetingRule, SuccessMetric } from "@/lib/types";

const PHASE_COLS = [C.p900, C.p700, C.p600, C.p300];

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

function AnimFunnel({ stages }: { stages: FunnelStage[] }) {
  const [on, setOn] = useState(false);
  const [hov, setHov] = useState<number | null>(null);
  useEffect(() => { const t = setTimeout(() => setOn(true), 200); return () => clearTimeout(t); }, []);
  const max = stages.reduce((a, s) => Math.max(a, s.budget_pct ?? 25), 0);
  return (
    <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, overflow: "hidden" }}>
      {stages.map((s, i) => {
        const col = PHASE_COLS[i % 4]; const pct = s.budget_pct ?? (100 - i * 20);
        const light = i === stages.length - 1 && pct < 20;
        const tc = light ? C.p900 : "#fff";
        return (
          <div key={i}>
            <div onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
              style={{ background: col, padding: "13px 16px", cursor: "pointer", transform: hov === i ? "translateX(5px)" : "none", transition: "transform .2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: FS.body, fontWeight: 700, color: tc }}>{s.name}</span>
                <span style={{ fontSize: FS.bodyXs, color: light ? `${C.p900}80` : "rgba(255,255,255,.6)" }}>{s.budget_pct ? `${s.budget_pct}%` : ""} · {s.channels?.slice(0, 2).join(", ")}</span>
              </div>
              <div style={{ height: 3, background: light ? "rgba(26,0,80,.1)" : "rgba(255,255,255,.18)", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 2, background: light ? "rgba(26,0,80,.3)" : "rgba(255,255,255,.4)", width: on ? `${(pct / max) * 100}%` : "0%", transition: `width 1.1s cubic-bezier(.4,0,.2,1) ${i * .12}s` }} />
              </div>
            </div>
            {i < stages.length - 1 && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "3px 0", background: C.white, fontSize: FS.bodyXs }}><span style={{ color: C.p300 }}>↓</span><span style={{ color: C.p700, fontWeight: 500 }}>{s.conversion_rate ?? ""}</span></div>}
          </div>
        );
      })}
    </div>
  );
}

function ChannelNet({ channels, overlaps }: { channels: Channel[]; overlaps: ChannelOverlap[] }) {
  const [hov, setHov] = useState<string | null>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 300); return () => clearTimeout(t); }, []);
  const n = Math.min(channels.length, 5);
  const cx = 200, cy = 80, r = 60;
  const pos = channels.slice(0, n).map((_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r }; });
  return (
    <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, overflow: "hidden" }}>
      <svg width="100%" height="160" viewBox="0 0 400 160">
        {overlaps.slice(0, 6).map((ov, i) => { const ai = channels.findIndex(c => c.name === ov.channels?.[0]); const bi = channels.findIndex(c => c.name === ov.channels?.[1]); if (ai < 0 || bi < 0 || ai >= n || bi >= n) return null; const a = pos[ai], b = pos[bi]; const thick = Math.max(1.5, (ov.overlap_pct ?? 50) / 100 * 8); const isH = ov.channels?.includes(hov ?? "") ?? false; return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={isH ? C.p700 : C.border} strokeWidth={isH ? thick + 3 : thick} strokeLinecap="round" style={{ transition: "stroke .2s" }}/>; })}
        {channels.slice(0, n).map((ch, i) => { const p = pos[i]; const col = PHASE_COLS[i % 4]; return (<g key={i} style={{ cursor: "pointer" }} onMouseEnter={() => setHov(ch.name)} onMouseLeave={() => setHov(null)}><circle cx={p.x} cy={p.y} r={hov === ch.name ? 29 : 25} fill={col} style={{ transform: `scale(${vis ? 1 : 0})`, transformOrigin: `${p.x}px ${p.y}px`, transition: `transform .45s cubic-bezier(.34,1.56,.64,1) ${i*.1}s` }}/><text x={p.x} y={p.y - 3} textAnchor="middle" fontSize={8} fontWeight="700" fill="rgba(255,255,255,.9)" fontFamily="sans-serif">{ch.name.split(" ")[0]}</text><text x={p.x} y={p.y + 8} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,.55)" fontFamily="sans-serif">{ch.role ?? ""}</text></g>); })}
      </svg>
      {hov && <div style={{ padding: "7px 14px", background: C.inset, fontSize: FS.bodyXs, color: C.body, borderTop: `.5px solid ${C.border}` }}>{overlaps.find(o => o.channels?.includes(hov ?? ""))?.insight ?? hov}</div>}
    </div>
  );
}

function AnimCounter({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) { el.textContent = value; return; }
    const pfx = value.match(/^[^0-9]*/)?.[0] ?? ""; const sfx = value.match(/[^0-9.]*$/)?.[0] ?? "";
    const tm = setTimeout(() => { let cur = 0; const inc = num / 60; const t = setInterval(() => { cur = Math.min(cur + inc, num); el.textContent = pfx + (Number.isInteger(num) ? Math.round(cur).toLocaleString() : cur.toFixed(1)) + sfx; if (cur >= num) clearInterval(t); }, 16); }, delay);
    return () => clearTimeout(tm);
  }, [value, delay]);
  return <div ref={ref}>{value}</div>;
}

export function SecStrategy({ d, raw }: { d: StrategyData; raw: string }) {
  const [sub, setSub] = useState("① Funnel & audience");
  const tabs = ["① Funnel & audience", "② Channels & synergy", "③ Retargeting & metrics"];
  const stages = d.stages || [];
  const channels = (d.channels || []) as Channel[];
  const overlaps = (d.channel_overlap || []) as ChannelOverlap[];
  const pillars = (d.messaging_pillars || []) as MessagingPillar[];
  const priority = (d.audience_priority || []) as AudiencePriority[];
  const rules = (d.retargeting_rules || []) as RetargetingRule[];
  const generic = d.retargeting || [];
  const metrics = (d.success_metrics || []) as SuccessMetric[];

  return (
    <div>
      <SubNav tabs={tabs} active={sub} onChange={setSub} />
      <div key={sub} style={{ animation: "slideInRight .3s ease" }}>

        {/* ── TAB 1: FUNNEL & AUDIENCE ── */}
        {sub === tabs[0] && (
          <div>
            {d.strategic_idea && (
              <div style={{ background: C.p900, borderRadius: 14, padding: "18px 22px", marginBottom: 12 }}>
                <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 6 }}>Strategisch idee</div>
                <div style={{ fontSize: FS.bodyLg, fontWeight: 700, color: "#fff", lineHeight: 1.65 }}>{d.strategic_idea}</div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              {priority.length > 0 && (
                <SCard delay={0.05}>
                  <div style={{ padding: "14px 16px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>Audience priority</div></div>
                  {priority.map((ap, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 16px", borderTop: `.5px solid ${C.border}` }}>
                      <div style={{ padding: "2px 9px", background: `${PHASE_COLS[i%4]}22`, color: PHASE_COLS[i%4], borderRadius: 20, fontSize: FS.bodyXs, fontWeight: 700, minWidth: 100, textAlign: "center" }}>{ap.segment}</div>
                      <div style={{ flex: 1, fontSize: FS.bodyXs, color: C.muted }}>{ap.why}</div>
                      <div style={{ fontSize: FS.bodyXs, fontWeight: 700, color: PHASE_COLS[i%4] }}>{ap.priority}</div>
                    </div>
                  ))}
                </SCard>
              )}
              {pillars.length > 0 && (
                <SCard delay={0.1}>
                  <div style={{ padding: "14px 16px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>Messaging pillars</div></div>
                  {pillars.map((p, i) => (
                    <div key={i} style={{ padding: "10px 16px", borderTop: `.5px solid ${C.border}`, background: i === 0 ? C.p100 : "transparent" }}>
                      <div style={{ fontSize: FS.bodyXs, color: C.p700, marginBottom: 3 }}>0{i+1}</div>
                      <div style={{ fontSize: FS.body, fontWeight: 700, color: C.p900, marginBottom: 2 }}>{p.title}</div>
                      <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{p.description}</div>
                    </div>
                  ))}
                </SCard>
              )}
            </div>
            {stages.length > 0 && (
              <div>
                <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 10 }}>Funnel strategy</div>
                <AnimFunnel stages={stages} />
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: CHANNELS & SYNERGY ── */}
        {sub === tabs[1] && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              {channels.length > 0 && (
                <div>
                  <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 10 }}>Channel synergy</div>
                  <ChannelNet channels={channels} overlaps={overlaps} />
                </div>
              )}
              <div>
                <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 10 }}>Funnel overlap</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                  {["Awareness", "Consideration", "Conversion", "Retention"].map((phase, i) => {
                    const rel = overlaps.slice(i, i+1)[0];
                    const pct = rel?.overlap_pct ?? (40 + i * 15);
                    return (
                      <div key={i} style={{ background: C.white, borderRadius: 10, boxShadow: C.shadowSm, padding: "10px 12px" }}>
                        <div style={{ fontSize: FS.bodyXs, fontWeight: 700, color: PHASE_COLS[i], textTransform: "uppercase" as const, letterSpacing: ".06em", marginBottom: 6 }}>{phase}</div>
                        <div style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 4 }}>
                          <svg width="44" height="32" viewBox="0 0 44 32">
                            <circle cx="14" cy="16" r="13" fill={PHASE_COLS[i]} opacity=".75"/>
                            <circle cx="26" cy="10" r="11" fill={PHASE_COLS[i]} opacity=".5"/>
                            <text x="21" y="17" fontSize="8" fontWeight="700" fill="white" textAnchor="middle" fontFamily="sans-serif">{pct}%</text>
                          </svg>
                          <div style={{ fontSize: 15, fontWeight: 800, color: PHASE_COLS[i] }}>{pct}%</div>
                        </div>
                        <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{rel?.insight ?? "Synergy actief"}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {channels.length > 0 && (
              <SCard delay={0.1}>
                <div style={{ padding: "14px 16px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>Channel details</div></div>
                {channels.map((ch, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderTop: `.5px solid ${C.border}` }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: PHASE_COLS[i%4], flexShrink: 0 }}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{ch.name}</div>
                      <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{ch.role}</div>
                    </div>
                    <div style={{ fontSize: FS.bodyXs, color: C.muted, maxWidth: 200, textAlign: "right" }}>{ch.motivation}</div>
                  </div>
                ))}
              </SCard>
            )}
          </div>
        )}

        {/* ── TAB 3: RETARGETING & METRICS ── */}
        {sub === tabs[2] && (
          <div>
            {rules.length > 0 ? (
              <SCard delay={0}>
                <div style={{ padding: "14px 16px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>Retargeting rules</div></div>
                {rules.map((r, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 20px 1fr", gap: 8, alignItems: "center", padding: "10px 16px", borderTop: `.5px solid ${C.border}` }}>
                    <div style={{ background: C.inset, borderRadius: 8, padding: "8px 10px", fontSize: FS.bodyXs, color: C.body, lineHeight: 1.5 }}>{r.trigger}</div>
                    <div style={{ textAlign: "center", color: C.faint }}>→</div>
                    <div style={{ background: C.p100, borderLeft: `2px solid ${C.p700}`, borderRadius: "0 8px 8px 0", padding: "8px 10px", fontSize: FS.bodyXs, color: C.p700, lineHeight: 1.5 }}>{r.action}</div>
                  </div>
                ))}
              </SCard>
            ) : generic.length > 0 && (
              <SCard delay={0}>
                <div style={{ padding: "14px 16px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>Retargeting aanpak</div></div>
                {generic.slice(0, 6).map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, padding: "9px 16px", borderTop: `.5px solid ${C.border}` }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.p700, marginTop: 5, flexShrink: 0 }}/>
                    <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.55 }}>{item}</div>
                  </div>
                ))}
              </SCard>
            )}
            {d.north_star_kpi && (
              <div style={{ background: C.p900, borderRadius: 14, padding: "16px 20px", marginBottom: 12, marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: FS.bodyXs, color: "rgba(255,255,255,.35)", textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 5 }}>North-star KPI</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{d.north_star_kpi}</div>
                  {d.north_star_desc && <div style={{ fontSize: FS.bodyXs, color: "rgba(255,255,255,.45)", marginTop: 3 }}>{d.north_star_desc}</div>}
                </div>
                <div style={{ fontSize: 36, color: "rgba(255,255,255,.07)" }}>★</div>
              </div>
            )}
            {metrics.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 9 }}>
                {metrics.map((m, i) => (
                  <div key={i} style={{ background: C.white, borderRadius: 12, boxShadow: C.shadow, overflow: "hidden", animation: `slideInUp .3s ease ${i*.07}s both` }}>
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 5 }}>{m.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, letterSpacing: "-.5px" }}>
                        <AnimCounter value={m.value} delay={i * 150} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <FeedbackBar phase="strategy" outputRaw={raw} />
    </div>
  );
}
