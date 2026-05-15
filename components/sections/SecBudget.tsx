"use client";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { C, FS } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/primitives";
import { fmtK } from "@/lib/format";
import type { BudgetData, PacingWeek, OptimisationRule, TestItem } from "@/lib/types";

const PHASE_COLS = [C.p900, C.p700, C.p600, C.p300];
function SubNav({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 2, marginBottom: 20, borderBottom: `.5px solid ${C.border}` }}>
      {tabs.map(t => (<button key={t} onClick={() => onChange(t)} style={{ padding: "6px 16px", border: "none", background: "transparent", fontSize: FS.bodySm, fontWeight: active === t ? 700 : 500, color: active === t ? C.p700 : C.muted, cursor: "pointer", borderBottom: `2px solid ${active === t ? C.p700 : "transparent"}`, marginBottom: -1, transition: "color .2s" }}>{t}</button>))}
    </div>
  );
}
function SCard({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, overflow: "hidden", marginBottom: 10, animation: `slideInUp .4s ease ${delay}s both` }}>{children}</div>;
}
function KpiStrip({ items }: { items: [string, string][] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length},1fr)`, gap: 10, marginBottom: 12 }}>
      {items.map(([l, v], i) => (
        <div key={l} style={{ background: C.white, borderRadius: 12, boxShadow: C.shadow, overflow: "hidden", animation: `slideInUp .4s ease ${i * .07}s both` }}>
          <div style={{ padding: "12px 14px" }}>
            <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 5 }}>{l}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{v}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
function Treemap({ channels }: { channels: BudgetData["by_channel"] }) {
  const [hov, setHov] = useState<string | null>(null);
  const total = channels.reduce((s, c) => s + c.budget, 0);
  return (
    <div>
      <div style={{ display: "flex", gap: 4, height: 90, borderRadius: 12, overflow: "hidden" }}>
        {[...channels].sort((a, b) => b.budget - a.budget).map((ch, i) => {
          const flex = (ch.budget / total) * 100; const col = PHASE_COLS[i % 4]; const light = i >= 4;
          return (
            <div key={i} onMouseEnter={() => setHov(ch.channel)} onMouseLeave={() => setHov(null)}
              style={{ flex, background: col, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, cursor: "pointer", filter: hov === ch.channel ? "brightness(1.15)" : "none", transition: "filter .2s" }}>
              {flex > 10 && <span style={{ fontSize: 9, fontWeight: 700, color: light ? "#3C3489" : "rgba(255,255,255,.85)", textAlign: "center" }}>{ch.channel.split(" ")[0]}</span>}
              {flex > 14 && <span style={{ fontSize: 10, fontWeight: 700, color: light ? "#3C3489" : "#fff" }}>{fmtK(ch.budget)}</span>}
            </div>
          );
        })}
      </div>
      {hov && <div style={{ marginTop: 7, padding: "6px 12px", background: C.inset, borderRadius: 8, fontSize: FS.bodyXs, color: C.body }}>{channels.find(c => c.channel === hov)?.channel} — {fmtK(channels.find(c => c.channel === hov)?.budget ?? 0)} · {channels.find(c => c.channel === hov)?.pct}%</div>}
    </div>
  );
}
function WavePacing({ weeks }: { weeks: PacingWeek[] }) {
  const [tip, setTip] = useState<{text:string;x:number;y:number}|null>(null);
  const phaseC: Record<string, string> = { burst: C.p900, peak: C.p700, "always-on": C.p600, retentie: C.p600 };
  const W = 500, H = 70, pad = 10;
  const max = Math.max(...weeks.map(w => w.budget));
  const pts = weeks.map((w, i) => [pad + i * ((W - pad * 2) / (weeks.length - 1)), H - pad - ((w.budget / max) * (H - pad * 2))]);
  return (
    <div style={{ position: "relative" }}>
      <svg width="100%" height="70" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <path d={`M${pts[0][0]},${H} ${pts.map(p => `L${p[0]},${p[1]}`).join(" ")} L${pts[pts.length-1][0]},${H} Z`} fill={`${C.p700}08`}/>
        {pts.slice(0,-1).map((p,i) => <line key={i} x1={p[0]} y1={p[1]} x2={pts[i+1][0]} y2={pts[i+1][1]} stroke={phaseC[weeks[i].phase?.toLowerCase()] ?? C.p700} strokeWidth="2.5" strokeLinecap="round"/>)}
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="5" fill={phaseC[weeks[i].phase?.toLowerCase()] ?? C.p700} stroke={C.white} strokeWidth="2" style={{ cursor: "pointer" }} onMouseEnter={() => setTip({ text: `W${weeks[i].week} · ${weeks[i].phase} · ${fmtK(weeks[i].budget)} · ${weeks[i].focus}`, x: (p[0]/W)*100, y: (p[1]/H)*100 })} onMouseLeave={() => setTip(null)}/>)}
      </svg>
      {tip && <div style={{ position: "absolute", left: `${tip.x}%`, top: `${tip.y}%`, transform: "translate(-50%,-120%)", background: C.p900, color: "#fff", fontSize: 9, padding: "5px 9px", borderRadius: 7, whiteSpace: "nowrap", pointerEvents: "none", zIndex: 10 }}>{tip.text}</div>}
    </div>
  );
}
function BudgetBar({ label, amount, pct, color }: { label: string; amount: string; pct: number; color: string }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 200); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderTop: `.5px solid ${C.border}` }}>
      <div style={{ fontSize: FS.bodySm, color: C.body, width: 130, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 5, background: C.inset, borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${w}%`, background: color, borderRadius: 3, transition: "width 1s cubic-bezier(.4,0,.2,1)" }}/></div>
      <div style={{ fontSize: FS.bodySm, fontWeight: 700, color: C.ink, width: 52, textAlign: "right" }}>{amount}</div>
      <div style={{ fontSize: FS.bodyXs, color: C.muted, width: 28, textAlign: "right" }}>{pct}%</div>
    </div>
  );
}
export function SecBudget({ d, raw }: { d: BudgetData; raw: string }) {
  const [sub, setSub] = useState("① Allocatie");
  const tabs = ["① Allocatie", "② Pacing", "③ Optimisation"];
  const byFunnel = d.by_funnel || [];
  const byChannel = d.by_channel || [];
  const weeks = d.pacing?.weeks || [];
  const phases = d.pacing?.phases || [];
  const optRules = (d.optimisation_rules || []) as OptimisationRule[];
  const testItems = (d.test_items || []) as TestItem[];
  return (
    <div>
      <SubNav tabs={tabs} active={sub} onChange={setSub} />
      <div key={sub} style={{ animation: "slideInRight .3s ease" }}>

        {sub === tabs[0] && (
          <div>
            <KpiStrip items={[["Totaal budget", fmtK(d.total_budget)], ["Netto media", fmtK(d.net_budget)], ["Test budget", `${fmtK(d.test_budget?.amount ?? 0)} (${d.test_budget?.pct ?? 0}%)`], ["Kanalen", String(byChannel.length)]]} />
            {byChannel.length > 0 && (
              <SCard delay={0.05}>
                <div style={{ padding: "14px 16px 10px" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 10 }}>Budget allocatie</div><Treemap channels={byChannel} /></div>
              </SCard>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {byFunnel.length > 0 && (
                <SCard delay={0.1}>
                  <div style={{ padding: "14px 16px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>By funnel stage</div></div>
                  {byFunnel.map((s, i) => <BudgetBar key={i} label={s.stage} amount={fmtK(s.budget)} pct={s.pct} color={PHASE_COLS[i%4]}/>)}
                </SCard>
              )}
              {byChannel.length > 0 && (
                <SCard delay={0.14}>
                  <div style={{ padding: "14px 16px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>By channel</div></div>
                  {byChannel.slice(0, 6).map((c, i) => <BudgetBar key={i} label={c.channel} amount={fmtK(c.budget)} pct={c.pct} color={PHASE_COLS[i%4]}/>)}
                </SCard>
              )}
            </div>
          </div>
        )}

        {sub === tabs[1] && (
          <div>
            {weeks.length > 0 && (
              <SCard delay={0}>
                <div style={{ padding: "14px 16px 10px" }}>
                  <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 12 }}>Pacing wave — hover voor weekdetail</div>
                  <WavePacing weeks={weeks} />
                  <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
                    {[["#1A0050","Burst"],[C.p700,"Peak"],[C.p600,"Always-on"]].map(([col,lbl]) => <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: col }}/><span style={{ fontSize: FS.bodyXs, color: C.muted }}>{lbl}</span></div>)}
                  </div>
                </div>
              </SCard>
            )}
            {phases.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 9 }}>
                {phases.map((ph, i) => (
                  <div key={i} style={{ background: C.white, borderRadius: 12, boxShadow: C.shadow, overflow: "hidden", animation: `slideInUp .35s ease ${i*.07}s both` }}>
                    <div style={{ height: 3, background: ph.color || C.p700, borderRadius: "12px 12px 0 0" }} />
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".07em", marginBottom: 4 }}>{ph.weeks}</div>
                      <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 3 }}>{ph.label}</div>
                      <div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.5 }}>{ph.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {sub === tabs[2] && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {optRules.length > 0 && (
              <SCard delay={0}>
                <div style={{ padding: "14px 16px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>Optimisation rules</div></div>
                {optRules.map((r, i) => <div key={i} style={{ display: "flex", gap: 10, padding: "10px 16px", borderTop: `.5px solid ${C.border}` }}><div style={{ width: 26, height: 26, borderRadius: 7, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{r.icon}</div><div><div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{r.title}</div><div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.45 }}>{r.desc}</div></div></div>)}
              </SCard>
            )}
            {testItems.length > 0 && (
              <SCard delay={0.07}>
                <div style={{ padding: "14px 16px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>Test agenda</div></div>
                <div style={{ padding: "10px 16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                    {testItems.map((t, i) => <div key={i} style={{ background: C.inset, borderRadius: 9, padding: "10px 12px" }}><div style={{ fontSize: FS.bodyXs, color: C.p700, marginBottom: 4 }}>A/B test</div><div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{t.title}</div><div style={{ fontSize: FS.bodyXs, color: C.muted }}>{t.option_a} vs {t.option_b}</div></div>)}
                  </div>
                </div>
              </SCard>
            )}
          </div>
        )}
      </div>
      <FeedbackBar phase="budget" outputRaw={raw} />
    </div>
  );
}
