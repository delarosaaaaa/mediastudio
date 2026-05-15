"use client";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { C, FS } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/primitives";
import type { MediaplanData, MediaChannel, ExecutionInsight } from "@/lib/types";

const COLS = [C.p900, C.p700, C.p600, C.p300];
function fmtM(n: number) { return n > 1e6 ? `${(n/1e6).toFixed(1)}M` : n > 1000 ? `${(n/1000).toFixed(0)}K` : String(n); }
function fmtE(n: number) { return `€${n.toFixed(0)}`; }
function fmtP(n: number) { return `${(n*100).toFixed(1)}%`; }

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
function KpiStrip({ items }: { items: [string,string][] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length},1fr)`, gap: 10, marginBottom: 12 }}>
      {items.map(([l,v],i) => <div key={l} style={{ background: C.white, borderRadius: 12, boxShadow: C.shadow, overflow: "hidden", animation: `slideInUp .4s ease ${i*.07}s both` }}><div style={{ padding: "12px 14px" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 5 }}>{l}</div><div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{v}</div></div></div>)}
    </div>
  );
}
function BubbleChart({ channels }: { channels: MediaChannel[] }) {
  const [vis, setVis] = useState(false);
  const [hov, setHov] = useState<string|null>(null);
  useEffect(() => { const t = setTimeout(() => setVis(true), 100); return () => clearTimeout(t); }, []);
  const stageR: Record<string,number> = { awareness: 88, consideration: 70, conversion: 52, retention: 45 };
  const stageS: Record<string,number> = { awareness: 40, consideration: 65, conversion: 92, retention: 80 };
  const max = Math.max(...channels.map(c => c.budget));
  return (
    <div style={{ position: "relative", height: 180 }}>
      <div style={{ position: "absolute", bottom: 30, left: 44, right: 10, height: 1, background: C.border }}/>
      <div style={{ position: "absolute", left: 44, top: 10, bottom: 30, width: 1, background: C.border }}/>
      <div style={{ position: "absolute", top: 10, left: 4, fontSize: 9, color: C.muted }}>Bereik ↑</div>
      <div style={{ position: "absolute", bottom: 10, left: 44, fontSize: 9, color: C.muted }}>Breed ←</div>
      <div style={{ position: "absolute", bottom: 10, right: 10, fontSize: 9, color: C.muted }}>→ Selectief</div>
      {channels.map((ch, i) => {
        const reach = stageR[ch.funnel_stage?.toLowerCase() ?? "awareness"] ?? 65;
        const sel   = stageS[ch.funnel_stage?.toLowerCase() ?? "awareness"] ?? 55;
        const size  = Math.max(28, Math.sqrt(ch.budget / max) * 54);
        const col   = COLS[i % 4];
        const x = 44 + (sel / 100) * (100 - 44 - 10);
        const y = 30 + ((100 - reach) / 100) * (100 - 30 - 10) + 10;
        const isH = hov === ch.name;
        return (
          <div key={i} onMouseEnter={() => setHov(ch.name)} onMouseLeave={() => setHov(null)}
            style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: size, height: size, borderRadius: "50%", background: col, display: "flex", alignItems: "center", justifyContent: "center", transform: `translate(-50%,-50%) scale(${vis ? 1 : 0})`, transition: `transform .5s cubic-bezier(.34,1.3,.64,1) ${i*.1}s`, cursor: "pointer", zIndex: isH ? 10 : 1, boxShadow: isH ? `0 0 0 6px ${col}30` : "none" }}>
            {size > 34 && <span style={{ fontSize: size > 44 ? 9 : 7, fontWeight: 700, color: "#fff", textAlign: "center", lineHeight: 1.2 }}>{ch.name.split(" ")[0]}</span>}
            {isH && <div style={{ position: "absolute", bottom: "110%", left: "50%", transform: "translateX(-50%)", background: C.p900, color: "#fff", fontSize: 9, padding: "4px 8px", borderRadius: 6, whiteSpace: "nowrap" }}>{ch.name} · {fmtE(ch.budget)} · CPA {fmtE(ch.cpa)}</div>}
          </div>
        );
      })}
    </div>
  );
}
export function SecMediaplan({ d, raw }: { d: MediaplanData; raw: string }) {
  const [sub, setSub] = useState("① Kanaalplan");
  const [filter, setFilter] = useState("all");
  const tabs = ["① Kanaalplan", "② Inzichten"];
  const channels = (d.channels || []) as MediaChannel[];
  const insights = (d.execution_insights || []) as ExecutionInsight[];
  const notes = d.optimisation_notes || [];
  const t = d.totals;
  const stages = ["all", ...Array.from(new Set(channels.map(c => c.funnel_stage)))];
  const filtered = filter === "all" ? channels : channels.filter(c => c.funnel_stage === filter);

  return (
    <div>
      <SubNav tabs={tabs} active={sub} onChange={setSub} />
      <div key={sub} style={{ animation: "slideInRight .3s ease" }}>

        {/* ── TAB 1: KANAALPLAN ── */}
        {sub === tabs[0] && (
          <div>
            <KpiStrip items={[["Budget", t?.budget ? `€${(t.budget/1e6).toFixed(1)}M` : "—"], ["Impressions", t?.impressions ? fmtM(t.impressions) : "—"], ["Clicks", t?.clicks ? fmtM(t.clicks) : "—"], ["Conversions", t?.conversions ? fmtM(t.conversions) : "—"], ["Blended CPA", t?.blended_cpa ? fmtE(t.blended_cpa) : "—"]]} />
            <SCard delay={0.05}>
              <div style={{ padding: "14px 16px 10px" }}>
                <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 4 }}>Media mix — bereik vs selectiviteit</div>
                <div style={{ fontSize: FS.bodyXs, color: C.muted, marginBottom: 10 }}>Grootte = budget · Positie = reach vs selectiviteit</div>
                <BubbleChart channels={channels} />
              </div>
            </SCard>
            <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
              {stages.map(s => (
                <button key={s} onClick={() => setFilter(s)} style={{ padding: "4px 12px", borderRadius: 20, border: `.5px solid ${filter === s ? C.p700 : C.border}`, background: filter === s ? C.p100 : C.white, color: filter === s ? C.p700 : C.muted, fontSize: FS.bodyXs, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}>
                  {s === "all" ? "Alle kanalen" : s}
                </button>
              ))}
            </div>
            {filtered.map((ch, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "130px 1fr 110px", borderRadius: 12, overflow: "hidden", boxShadow: C.shadowSm, marginBottom: 7, animation: `slideInUp .35s ease ${i*.06}s both` }}>
                <div style={{ background: COLS[channels.indexOf(ch) % 4], padding: "12px 14px" }}>
                  <div style={{ fontSize: FS.body, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{ch.name}</div>
                  <div style={{ fontSize: FS.bodyXs, color: "rgba(255,255,255,.5)", marginBottom: 8 }}>{ch.funnel_stage}</div>
                  <div style={{ display: "inline-block", padding: "2px 8px", background: "rgba(255,255,255,.18)", borderRadius: 20, fontSize: FS.bodyXs, color: "#fff" }}>€{(ch.budget/1000).toFixed(0)}K</div>
                </div>
                <div style={{ padding: "12px 13px", background: C.white, borderLeft: `.5px solid ${C.border}` }}>
                  <div style={{ fontSize: FS.bodyXs, fontWeight: 700, color: COLS[channels.indexOf(ch)%4], textTransform: "uppercase" as const, letterSpacing: ".06em", marginBottom: 5 }}>Formats & targeting</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 5 }}>
                    {ch.formats?.slice(0,3).map((f,j) => <span key={j} style={{ padding: "2px 7px", background: `${COLS[channels.indexOf(ch)%4]}15`, color: COLS[channels.indexOf(ch)%4], borderRadius: 20, fontSize: FS.bodyXs }}>{f}</span>)}
                  </div>
                  <div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.45 }}>{ch.targeting}</div>
                </div>
                <div style={{ background: C.inset, padding: "12px 13px", borderLeft: `.5px solid ${C.border}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, alignContent: "start" }}>
                  {[["CPM", `€${ch.cpm?.toFixed(2)}`],["CTR", fmtP(ch.ctr)],["Conv.", fmtM(ch.conversions)],["CPA", fmtE(ch.cpa)]].map(([k,v]) => (
                    <div key={k as string}>
                      <div style={{ fontSize: 8, fontWeight: 700, color: C.muted, marginBottom: 2 }}>{k as string}</div>
                      <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{v as string}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 2: INZICHTEN ── */}
        {sub === tabs[1] && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {insights.length > 0 && (
              <SCard delay={0}>
                <div style={{ padding: "14px 16px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>Key insights</div></div>
                {insights.map((ins,i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 16px", borderTop: `.5px solid ${C.border}` }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{ins.icon}</div>
                    <div><div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{ins.title}</div><div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.45 }}>{ins.desc}</div></div>
                  </div>
                ))}
              </SCard>
            )}
            {notes.length > 0 && (
              <SCard delay={0.07}>
                <div style={{ padding: "14px 16px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>Optimisation approach</div></div>
                {notes.map((n,i) => (
                  <div key={i} style={{ display: "flex", gap: 8, padding: "9px 16px", borderTop: `.5px solid ${C.border}` }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.p700, marginTop: 5, flexShrink: 0 }}/>
                    <div style={{ fontSize: FS.bodySm, color: C.muted, lineHeight: 1.55 }}>{n}</div>
                  </div>
                ))}
              </SCard>
            )}
          </div>
        )}
      </div>
      <FeedbackBar phase="mediaplan" outputRaw={raw} />
    </div>
  );
}