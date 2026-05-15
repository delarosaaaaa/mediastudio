"use client";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { C, FS } from "@/lib/tokens";
import { Card, CardLabel, FeedbackBar, Pair, SectionLabel } from "@/components/ui/primitives";
import type {
  StrategyData, FunnelStage, Channel, ChannelOverlap,
  MessagingPillar, AudiencePriority, RetargetingRule, SuccessMetric,
} from "@/lib/types";

const PHASE_COLS = [C.p900, C.p700, C.p600, C.p300];

// ─── Animated funnel ──────────────────────────────────────────
function AnimatedFunnel({ stages }: { stages: FunnelStage[] }) {
  const [on, setOn] = useState(false);
  const [hov, setHov] = useState<number | null>(null);
  useEffect(() => { const t = setTimeout(() => setOn(true), 200); return () => clearTimeout(t); }, []);
  const maxPct = stages.reduce((a, s) => Math.max(a, s.budget_pct ?? 25), 0);
  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      {stages.map((s, i) => {
        const col = PHASE_COLS[i % 4];
        const pct = s.budget_pct ?? (100 - i * 20);
        const light = i === stages.length - 1 && pct < 20;
        const tc = light ? C.p900 : "#fff";
        return (
          <div key={i}>
            <div onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
              style={{ background: col, padding: "13px 15px", cursor: "pointer", transform: hov === i ? "translateX(5px)" : "none", transition: "transform .2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: FS.body, fontWeight: 700, color: tc }}>{s.name}</span>
                <span style={{ fontSize: FS.bodyXs, color: light ? `${C.p900}80` : "rgba(255,255,255,.6)" }}>{s.budget_pct ? `${s.budget_pct}%` : ""} · {s.channels?.slice(0, 2).join(", ")}</span>
              </div>
              <div style={{ height: 3, background: light ? "rgba(26,0,80,.12)" : "rgba(255,255,255,.18)", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 2, background: light ? "rgba(26,0,80,.3)" : "rgba(255,255,255,.45)", width: on ? `${(pct / maxPct) * 100}%` : "0%", transition: `width 1.1s cubic-bezier(.4,0,.2,1) ${i * .12}s` }} />
              </div>
            </div>
            {i < stages.length - 1 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "3px 0", background: C.white, fontSize: FS.bodyXs }}>
                <span style={{ color: C.p300 }}>↓</span>
                <span style={{ color: C.p700, fontWeight: 500 }}>{s.conversion_rate ?? ""}</span>
              </div>
            )}
          </div>
        );
      })}
    </Card>
  );
}

// ─── Channel network graph ────────────────────────────────────
function ChannelNetwork({ channels, overlaps }: { channels: Channel[]; overlaps: ChannelOverlap[] }) {
  const [hov, setHov] = useState<string | null>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 300); return () => clearTimeout(t); }, []);
  const n = Math.min(channels.length, 5);
  const cx = 220, cy = 90, r = 65;
  const pos = channels.slice(0, n).map((_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  });
  const stageCols: Record<string, string> = { awareness: C.p900, consideration: C.p700, conversion: C.p600, retention: C.p300 };
  return (
    <Card style={{ padding: 10 }}>
      <svg width="100%" height="180" viewBox="0 0 440 180">
        {overlaps.slice(0, 6).map((ov, i) => {
          const ai = channels.findIndex(c => c.name === ov.channels?.[0]);
          const bi = channels.findIndex(c => c.name === ov.channels?.[1]);
          if (ai < 0 || bi < 0 || ai >= n || bi >= n) return null;
          const a = pos[ai], b = pos[bi];
          const thick = Math.max(1.5, (ov.overlap_pct ?? 50) / 100 * 8);
          const isH = ov.channels?.includes(hov ?? "") ?? false;
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={isH ? C.p700 : C.border} strokeWidth={isH ? thick + 3 : thick} strokeLinecap="round" style={{ transition: "stroke .2s" }} />;
        })}
        {channels.slice(0, n).map((ch, i) => {
          const p = pos[i];
          const col = stageCols[ch.role?.toLowerCase()?.split(" ")[0] ?? ""] ?? C.p600;
          return (
            <g key={i} style={{ cursor: "pointer" }} onMouseEnter={() => setHov(ch.name)} onMouseLeave={() => setHov(null)}>
              <circle cx={p.x} cy={p.y} r={hov === ch.name ? 29 : 26} fill={col}
                style={{ transform: `scale(${vis ? 1 : 0})`, transformOrigin: `${p.x}px ${p.y}px`, transition: `transform .45s cubic-bezier(.34,1.56,.64,1) ${i * .1}s, r .2s` }} />
              <text x={p.x} y={p.y - 4} textAnchor="middle" fontSize={8} fontWeight="700" fill="rgba(255,255,255,.9)" fontFamily="sans-serif">{ch.name.split(" ")[0]}</text>
              <text x={p.x} y={p.y + 7} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,.55)" fontFamily="sans-serif">{ch.role ?? ""}</text>
            </g>
          );
        })}
      </svg>
      {hov && (
        <div style={{ padding: "7px 10px", background: C.inset, borderRadius: 8, fontSize: FS.bodyXs, color: C.body }}>
          {overlaps.find(o => o.channels?.includes(hov ?? ""))?.insight ?? hov}
        </div>
      )}
    </Card>
  );
}

// ─── Venn 2x2 ─────────────────────────────────────────────────
function VennGrid({ overlaps }: { overlaps: ChannelOverlap[] }) {
  const phases = ["Awareness", "Consideration", "Conversion", "Retention"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
      {phases.map((phase, i) => {
        const rel = overlaps.slice(i, i + 1)[0];
        const pct = rel?.overlap_pct ?? (40 + i * 15);
        return (
          <div key={i} style={{ background: C.inset, borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: FS.bodyXs, fontWeight: 700, color: PHASE_COLS[i], textTransform: "uppercase" as const, letterSpacing: ".06em", marginBottom: 6 }}>{phase}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
              <svg width="50" height="36" viewBox="0 0 50 36">
                <circle cx="16" cy="18" r="14" fill={PHASE_COLS[i]} opacity=".75" />
                <circle cx="30" cy="12" r="11" fill={PHASE_COLS[i]} opacity=".55" />
                <text x="23" y="19" fontSize="8" fontWeight="700" fill="white" textAnchor="middle" fontFamily="sans-serif">{pct}%</text>
              </svg>
              <div style={{ fontSize: 16, fontWeight: 800, color: PHASE_COLS[i] }}>{pct}%<span style={{ fontSize: 9, fontWeight: 400, color: C.muted }}> overlap</span></div>
            </div>
            <div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.45 }}>{rel?.insight ?? "Channel synergy actief"}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Animated counter ─────────────────────────────────────────
function AnimCounter({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) { el.textContent = value; return; }
    const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
    const suffix = value.match(/[^0-9.]*$/)?.[0] ?? "";
    const tm = setTimeout(() => {
      let cur = 0; const inc = num / 60;
      const t = setInterval(() => {
        cur = Math.min(cur + inc, num);
        el.textContent = prefix + (Number.isInteger(num) ? Math.round(cur).toLocaleString() : cur.toFixed(1)) + suffix;
        if (cur >= num) clearInterval(t);
      }, 16);
    }, delay);
    return () => clearTimeout(tm);
  }, [value, delay]);
  return <div ref={ref}>{value}</div>;
}

// ─── SUBTAB: Funnel ───────────────────────────────────────────
function TabFunnel({ d }: { d: StrategyData }) {
  const stages = d.stages || [];
  const audiencePriority = (d.audience_priority || []) as AudiencePriority[];
  const messagingPillars = (d.messaging_pillars || []) as MessagingPillar[];
  return (
    <div>
      {d.strategic_idea && (
        <div style={{ background: C.p900, borderRadius: 14, padding: "18px 22px", marginBottom: 10, animation: "slideInUp .35s ease" }}>
          <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>Strategisch idee</div>
          <div style={{ fontSize: FS.bodyLg, fontWeight: 700, color: "#fff", lineHeight: 1.65, maxWidth: 640 }}>{d.strategic_idea}</div>
        </div>
      )}
      <Pair
        left={<><SectionLabel>Audience priority</SectionLabel>
          <Card>{audiencePriority.map((ap, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", borderBottom: `.5px solid ${C.border}` }}>
              <div style={{ padding: "2px 9px", background: `${PHASE_COLS[i % 4]}22`, color: PHASE_COLS[i % 4], borderRadius: 20, fontSize: FS.bodyXs, fontWeight: 700, minWidth: 110, textAlign: "center" }}>{ap.segment}</div>
              <div style={{ flex: 1, fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.4 }}>{ap.why}</div>
              <div style={{ fontSize: FS.bodyXs, fontWeight: 700, color: PHASE_COLS[i % 4] }}>{ap.priority}</div>
            </div>
          ))}</Card></>}
        right={<><SectionLabel>Messaging pillars</SectionLabel>
          <Card>{messagingPillars.map((p, i) => (
            <div key={i} style={{ background: [C.p100, C.inset, C.inset][i % 3], borderRadius: 9, padding: "10px 12px", marginBottom: i < messagingPillars.length - 1 ? 7 : 0 }}>
              <div style={{ fontSize: FS.bodyXs, color: C.p700, marginBottom: 3 }}>0{i + 1}</div>
              <div style={{ fontSize: FS.body, fontWeight: 700, color: C.p900, marginBottom: 2 }}>{p.title}</div>
              <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{p.description}</div>
            </div>
          ))}</Card></>}
      />
      {stages.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <SectionLabel>Funnel</SectionLabel>
          <AnimatedFunnel stages={stages} />
        </div>
      )}
    </div>
  );
}

// ─── SUBTAB: Channels ─────────────────────────────────────────
function TabChannels({ d }: { d: StrategyData }) {
  const channels = (d.channels || []) as Channel[];
  const channelOverlap = (d.channel_overlap || []) as ChannelOverlap[];
  return (
    <div>
      <Pair
        left={<><SectionLabel>Channel synergy network</SectionLabel>
          {channels.length > 0
            ? <ChannelNetwork channels={channels} overlaps={channelOverlap} />
            : <Card><div style={{ color: C.muted, fontSize: FS.bodySm }}>Geen kanaaldata</div></Card>
          }</>}
        right={<><SectionLabel>Funnel overlap</SectionLabel>
          <Card><VennGrid overlaps={channelOverlap} /></Card></>}
      />
      {channels.length > 0 && (
        <div>
          <SectionLabel>Channel details</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 8 }}>
            {channels.map((ch, i) => (
              <div key={i} style={{ background: C.white, borderRadius: 12, border: `.5px solid ${C.border}`, boxShadow: C.shadowSm, padding: "13px 14px", animation: `slideInUp .35s ease ${i * .06}s both` }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: PHASE_COLS[i % 4], marginBottom: 9 }} />
                <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{ch.name}</div>
                <div style={{ fontSize: FS.bodyXs, color: C.muted, marginBottom: 6 }}>{ch.role}</div>
                <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.5 }}>{ch.motivation}</div>
                {ch.targeting && <div style={{ marginTop: 6, padding: "4px 8px", background: C.inset, borderRadius: 6, fontSize: FS.bodyXs, color: C.muted }}>{ch.targeting}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SUBTAB: Retargeting ──────────────────────────────────────
function TabRetargeting({ d }: { d: StrategyData }) {
  const rules = (d.retargeting_rules || []) as RetargetingRule[];
  const generic = d.retargeting || [];
  return (
    <div>
      {rules.length > 0 ? (
        <Card>
          {rules.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 20px 1fr", gap: 8, alignItems: "center", marginBottom: 8, animation: `slideInUp .3s ease ${i * .07}s both` }}>
              <div style={{ background: C.inset, borderRadius: 8, padding: "8px 11px", fontSize: FS.bodyXs, color: C.body, lineHeight: 1.5 }}>{r.trigger}</div>
              <div style={{ textAlign: "center", color: C.faint }}>→</div>
              <div style={{ background: C.p100, borderLeft: `2px solid ${C.p700}`, borderRadius: "0 8px 8px 0", padding: "8px 11px", fontSize: FS.bodyXs, color: C.p700, lineHeight: 1.5 }}>{r.action}</div>
            </div>
          ))}
        </Card>
      ) : (
        <Card>
          {generic.slice(0, 6).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.p700, marginTop: 6, flexShrink: 0 }} />
              <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.55 }}>{item}</div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ─── SUBTAB: Metrics ──────────────────────────────────────────
function TabMetrics({ d }: { d: StrategyData }) {
  const metrics = (d.success_metrics || []) as SuccessMetric[];
  const budgetStages = (d.budget_stages || []) as import("@/lib/types").BudgetStage[];
  return (
    <div>
      {d.north_star_kpi && (
        <div style={{ background: C.p900, borderRadius: 12, padding: "14px 18px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", animation: "slideInUp .35s ease" }}>
          <div>
            <div style={{ fontSize: FS.bodyXs, color: "rgba(255,255,255,.35)", marginBottom: 3 }}>North-star KPI</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{d.north_star_kpi}</div>
            {d.north_star_desc && <div style={{ fontSize: FS.bodyXs, color: "rgba(255,255,255,.45)", marginTop: 3 }}>{d.north_star_desc}</div>}
          </div>
          <div style={{ fontSize: 36, color: "rgba(255,255,255,.07)" }}>★</div>
        </div>
      )}
      {metrics.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8, marginBottom: 10 }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ background: C.white, borderRadius: 11, boxShadow: C.shadowSm, padding: "12px 14px", borderTop: `.5px solid ${C.border}`, animation: `slideInUp .3s ease ${i * .07}s both` }}>
              <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, letterSpacing: "-.5px" }}>
                <AnimCounter value={m.value} delay={i * 150} />
              </div>
            </div>
          ))}
        </div>
      )}
      {budgetStages.length > 0 && (
        <div>
          <SectionLabel>Budget per fase</SectionLabel>
          <Card>
            {budgetStages.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: `.5px solid ${C.border}` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: PHASE_COLS[i % 4], flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: FS.bodySm, color: C.ink }}>{s.stage}</div>
                <div style={{ fontSize: FS.bodySm, fontWeight: 700, color: C.ink }}>{s.amount}</div>
                <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{s.pct}%</div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Subtab nav ───────────────────────────────────────────────
const SUBTABS = [
  { key: "funnel",      label: "Funnel"      },
  { key: "channels",    label: "Channels"    },
  { key: "retargeting", label: "Retargeting" },
  { key: "metrics",     label: "Metrics"     },
] as const;
type SubTab = typeof SUBTABS[number]["key"];

// ─── MAIN ─────────────────────────────────────────────────────
export function SecStrategy({ d, raw }: { d: StrategyData; raw: string }) {
  const [sub, setSub] = useState<SubTab>("funnel");
  return (
    <div>
      {/* Subtab nav */}
      <div style={{ display: "flex", gap: 2, marginBottom: 18, borderBottom: `.5px solid ${C.border}` }}>
        {SUBTABS.map(t => (
          <button key={t.key} onClick={() => setSub(t.key)} style={{
            padding: "6px 14px", border: "none", background: "transparent",
            fontSize: FS.bodySm, fontWeight: sub === t.key ? 700 : 500,
            color: sub === t.key ? C.p700 : C.muted, cursor: "pointer",
            borderBottom: `2px solid ${sub === t.key ? C.p700 : "transparent"}`,
            marginBottom: -1, transition: "color .2s, border-color .2s",
          }}>
            {t.label}
          </button>
        ))}
      </div>
      <div key={sub} style={{ animation: "slideInRight .3s ease" }}>
        {sub === "funnel"      && <TabFunnel d={d} />}
        {sub === "channels"    && <TabChannels d={d} />}
        {sub === "retargeting" && <TabRetargeting d={d} />}
        {sub === "metrics"     && <TabMetrics d={d} />}
      </div>
      <FeedbackBar phase="strategy" outputRaw={raw} />
    </div>
  );
}
