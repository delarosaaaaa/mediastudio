"use client";
import { useEffect, useState } from "react";
import { C, FS } from "@/lib/tokens";
import { Card, CardLabel, FeedbackBar, Pair, SectionLabel } from "@/components/ui/primitives";
import type { StrategyData, FunnelStage, Channel, ChannelOverlap } from "@/lib/types";

const PHASE_COLS = [C.p900, C.p700, C.p600, C.p300];
const PHASE_KEYS = ["awareness", "consideration", "conversion", "retention"] as const;

// Animated funnel
function AnimatedFunnel({ stages }: { stages: FunnelStage[] }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t); }, []);
  const [hovered, setHovered] = useState<number | null>(null);
  const cols = PHASE_COLS;
  const maxPct = stages.reduce((a, s) => Math.max(a, s.budget_pct ?? 25), 0);

  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      {stages.map((s, i) => {
        const col = cols[i % 4];
        const pct = s.budget_pct ?? (100 - i * 20);
        const lightBg = i === stages.length - 1 && pct < 20;
        const tc = lightBg ? C.p900 : "#fff";
        const tc2 = lightBg ? `${C.p900}80` : "rgba(255,255,255,.6)";
        return (
          <div key={i}>
            <div
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ background: col, padding: "13px 15px", cursor: "pointer", transform: hovered === i ? "translateX(5px)" : "none", transition: "transform .2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: FS.body, fontWeight: 700, color: tc }}>{s.name}</span>
                <span style={{ fontSize: FS.bodyXs, color: tc2 }}>{s.budget_pct ? `${s.budget_pct}%` : ""} · {s.channels?.slice(0, 2).join(", ")}</span>
              </div>
              <div style={{ height: 3, background: lightBg ? "rgba(26,0,80,.12)" : "rgba(255,255,255,.18)", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 2, background: lightBg ? "rgba(26,0,80,.3)" : "rgba(255,255,255,.45)", width: animated ? `${(pct / maxPct) * 100}%` : "0%", transition: `width 1.1s cubic-bezier(.4,0,.2,1) ${i * .12}s` }} />
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

// Channel network graph (SVG)
function ChannelNetwork({ channels, overlaps }: { channels: Channel[]; overlaps: ChannelOverlap[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 300); return () => clearTimeout(t); }, []);

  const n = Math.min(channels.length, 5);
  const cx = 220, cy = 90, r = 65;
  const positions = channels.slice(0, n).map((_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  });
  const nodeR = 26;
  const stageCols: Record<string, string> = { awareness: C.p900, consideration: C.p700, conversion: C.p600, retention: C.p300 };

  return (
    <Card style={{ padding: 10 }}>
      <svg width="100%" height="180" viewBox="0 0 440 180">
        {/* connections */}
        {overlaps.slice(0, 6).map((ov, i) => {
          const aIdx = channels.findIndex(c => c.name === ov.channels?.[0]);
          const bIdx = channels.findIndex(c => c.name === ov.channels?.[1]);
          if (aIdx < 0 || bIdx < 0 || aIdx >= n || bIdx >= n) return null;
          const a = positions[aIdx], b = positions[bIdx];
          const thick = Math.max(1.5, (ov.overlap_pct ?? 50) / 100 * 8);
          const isHov = ov.channels?.includes(hovered ?? "") ?? false;
          return (
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={isHov ? C.p700 : C.border}
              strokeWidth={isHov ? thick + 3 : thick}
              strokeLinecap="round"
              style={{ transition: "stroke .2s, stroke-width .2s" }}
            />
          );
        })}
        {/* nodes */}
        {channels.slice(0, n).map((ch, i) => {
          const pos = positions[i];
          const col = stageCols[ch.role?.toLowerCase()?.split(" ")[0] ?? ""] ?? C.p600;
          const isHov = hovered === ch.name;
          return (
            <g key={i} style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered(ch.name)}
              onMouseLeave={() => setHovered(null)}>
              <circle cx={pos.x} cy={pos.y} r={isHov ? nodeR + 3 : nodeR}
                fill={col} style={{ transform: `scale(${visible ? 1 : 0})`, transformOrigin: `${pos.x}px ${pos.y}px`, transition: `transform .45s cubic-bezier(.34,1.56,.64,1) ${i * .1}s, r .2s` }} />
              <text x={pos.x} y={pos.y - 4} textAnchor="middle" fontSize={8} fontWeight="700" fill="rgba(255,255,255,.9)" fontFamily="sans-serif">{ch.name.split(" ")[0]}</text>
              <text x={pos.x} y={pos.y + 7} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,.55)" fontFamily="sans-serif">{ch.role ?? ""}</text>
            </g>
          );
        })}
      </svg>
      {hovered && (
        <div style={{ padding: "7px 10px", background: C.inset, borderRadius: 8, fontSize: FS.bodyXs, color: C.body }}>
          {overlaps.find(o => o.channels?.includes(hovered ?? ""))?.insight ?? hovered}
        </div>
      )}
    </Card>
  );
}

// Venn 2x2 grid
function VennGrid({ overlaps }: { overlaps: ChannelOverlap[] }) {
  const phases = ["Awareness", "Consideration", "Conversion", "Retention"];
  const phaseCols = PHASE_COLS;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
      {phases.map((phase, i) => {
        const rel = overlaps.slice(i, i + 1)[0];
        const pct = rel?.overlap_pct ?? (40 + i * 15);
        return (
          <div key={i} style={{ background: C.inset, borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: FS.bodyXs, fontWeight: 700, color: phaseCols[i], textTransform: "uppercase" as const, letterSpacing: ".06em", marginBottom: 6 }}>{phase}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
              <svg width="50" height="36" viewBox="0 0 50 36">
                <circle cx="16" cy="18" r="14" fill={phaseCols[i]} opacity=".75" />
                <circle cx="30" cy="12" r="11" fill={phaseCols[i]} opacity=".55" />
                <text x="23" y="19" fontSize="8" fontWeight="700" fill="white" textAnchor="middle" fontFamily="sans-serif">{pct}%</text>
              </svg>
              <div style={{ fontSize: 16, fontWeight: 800, color: phaseCols[i] }}>{pct}%<span style={{ fontSize: 9, fontWeight: 400, color: C.muted }}> overlap</span></div>
            </div>
            <div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.45 }}>{rel?.insight ?? "Channel synergy actief"}</div>
          </div>
        );
      })}
    </div>
  );
}

export function SecStrategy({ d, raw }: { d: StrategyData; raw: string }) {
  const stages = (d.stages || []) as FunnelStage[];
  const channels = (d.channels || []) as Channel[];
  const channelOverlap = (d.channel_overlap || []) as ChannelOverlap[];
  const budgetStages = (d.budget_stages || []) as import("@/lib/types").BudgetStage[];
  const messagingPillars = (d.messaging_pillars || []) as import("@/lib/types").MessagingPillar[];
  const audiencePriority = (d.audience_priority || []) as import("@/lib/types").AudiencePriority[];
  const retargetingRules = (d.retargeting_rules || []) as import("@/lib/types").RetargetingRule[];
  const successMetrics = (d.success_metrics || []) as import("@/lib/types").SuccessMetric[];
  const channelRoles = (d.channel_roles || []) as import("@/lib/types").ChannelRole[];

  return (
    <div>
      {/* Strategic idea hero */}
      {d.strategic_idea && (
        <div style={{ background: C.p900, borderRadius: 14, padding: "18px 22px", marginBottom: 10, animation: "slideInUp .35s ease" }}>
          <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>Strategisch idee</div>
          <div style={{ fontSize: FS.bodyLg, fontWeight: 700, color: "#fff", lineHeight: 1.65, maxWidth: 640 }}>{d.strategic_idea}</div>
        </div>
      )}

      <Pair
        left={<><SectionLabel>Audience priority</SectionLabel>
          <Card>
            {audiencePriority.map((ap, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", borderBottom: `.5px solid ${C.border}` }}>
                <div style={{ padding: "2px 9px", background: PHASE_COLS[i % 4] + "22", color: PHASE_COLS[i % 4], borderRadius: 20, fontSize: FS.bodyXs, fontWeight: 700, minWidth: 110, textAlign: "center" }}>{ap.segment}</div>
                <div style={{ flex: 1, fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.4 }}>{ap.why}</div>
                <div style={{ fontSize: FS.bodyXs, fontWeight: 700, color: PHASE_COLS[i % 4] }}>{ap.priority}</div>
              </div>
            ))}
          </Card></>}
        right={<><SectionLabel>Messaging pillars</SectionLabel>
          <Card>
            {messagingPillars.map((p, i) => (
              <div key={i} style={{ background: [C.p100, C.inset, C.inset][i] ?? C.inset, borderRadius: 9, padding: "10px 12px", marginBottom: i < messagingPillars.length - 1 ? 7 : 0 }}>
                <div style={{ fontSize: FS.bodyXs, color: C.p700, marginBottom: 3 }}>0{i + 1}</div>
                <div style={{ fontSize: FS.body, fontWeight: 700, color: C.p900, marginBottom: 2 }}>{p.title}</div>
                <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{p.description}</div>
              </div>
            ))}
          </Card></>}
      />

      {/* Funnel */}
      {stages.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <SectionLabel>Funnel strategy</SectionLabel>
          <AnimatedFunnel stages={stages} />
        </div>
      )}

      {/* Network + Venn */}
      <Pair
        left={<><SectionLabel>Channel synergy network</SectionLabel>
          {channels.length > 0
            ? <ChannelNetwork channels={channels} overlaps={channelOverlap} />
            : <Card><div style={{ fontSize: FS.bodySm, color: C.muted }}>No channel data</div></Card>
          }</>}
        right={<><SectionLabel>Funnel overlap</SectionLabel>
          <Card><VennGrid overlaps={channelOverlap} /></Card></>}
      />

      {/* Retargeting */}
      {retargetingRules.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <SectionLabel>Retargeting rules</SectionLabel>
          <Card>
            {retargetingRules.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 20px 1fr", gap: 8, alignItems: "center", marginBottom: 7, animation: `slideInUp .3s ease ${i * .07}s both` }}>
                <div style={{ background: C.inset, borderRadius: 8, padding: "7px 10px", fontSize: FS.bodyXs, color: C.body, lineHeight: 1.5 }}>{r.trigger}</div>
                <div style={{ textAlign: "center", color: C.faint }}>→</div>
                <div style={{ background: C.p100, borderLeft: `2px solid ${C.p700}`, borderRadius: "0 8px 8px 0", padding: "7px 10px", fontSize: FS.bodyXs, color: C.p700, lineHeight: 1.5 }}>{r.action}</div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Success metrics */}
      {(d.north_star_kpi || successMetrics.length > 0) && (
        <div>
          <SectionLabel>Success metrics</SectionLabel>
          {d.north_star_kpi && (
            <div style={{ background: C.p900, borderRadius: 12, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: FS.bodyXs, color: "rgba(255,255,255,.35)", marginBottom: 3 }}>North-star KPI</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{d.north_star_kpi}</div>
              </div>
              <div style={{ fontSize: 28, color: "rgba(255,255,255,.08)" }}>★</div>
            </div>
          )}
          {successMetrics.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))", gap: 7 }}>
              {successMetrics.map((m, i) => (
                <div key={i} style={{ background: C.white, border: `.5px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", animation: `slideInUp .3s ease ${i * .07}s both` }}>
                  <div style={{ fontSize: FS.bodyXs, color: C.muted, marginBottom: 3 }}>{m.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.p700 }}>{m.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <FeedbackBar phase="strategy" outputRaw={raw} />
    </div>
  );
}
