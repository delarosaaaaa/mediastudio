"use client";
import { C, FS } from "@/lib/tokens";
import { Card, FeedbackBar, SectionCard, Pair, SectionLabel, BulletItem, Divider } from "@/components/ui/primitives";
import type { StrategyData, FunnelStage, Channel, ChannelOverlap, MessagingPillar, ChannelRole, RetargetingRule, BudgetStage, SuccessMetric } from "@/lib/types";

const PHASE_COLS = [C.p900, C.p700, C.p600, C.p300];
const PHASE_KEYS = ["awareness", "consideration", "conversion", "retention"] as const;

// ─── 1. Strategic idea ────────────────────────────────────────
function StrategicIdea({ idea }: { idea: string }) {
  return (
    <div style={{ background: C.p900, borderRadius: 14, padding: "20px 22px", marginBottom: 10 }}>
      <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>
        How do we win this market?
      </div>
      <div style={{ fontSize: 17, fontWeight: 500, color: "#fff", lineHeight: 1.55, letterSpacing: "-.1px" }}>{idea}</div>
    </div>
  );
}

// ─── 2. Audience priority ─────────────────────────────────────
function AudiencePriority({ items }: { items: { segment: string; why: string; priority: string }[] }) {
  const priColor = (p: string) => p.toLowerCase() === "primary" ? C.p900 : C.p600;
  return (
    <Card>
      {items.map((a, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < items.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
          <div style={{ padding: "3px 9px", background: C.p100, color: priColor(a.priority), borderRadius: 20, fontSize: FS.bodyXs, fontWeight: 500, width: 150, flexShrink: 0 }}>{a.segment}</div>
          <div style={{ fontSize: FS.bodySm, color: C.muted, flex: 1, lineHeight: 1.4 }}>{a.why}</div>
          <div style={{ fontSize: FS.bodyXs, fontWeight: 500, color: priColor(a.priority), textTransform: "uppercase", letterSpacing: ".06em", width: 55, textAlign: "right", flexShrink: 0 }}>{a.priority}</div>
        </div>
      ))}
    </Card>
  );
}

// ─── 3. Messaging pillars ─────────────────────────────────────
function MessagingPillars({ items }: { items: MessagingPillar[] }) {
  const bgs = [C.p100, "#F0EEF8", "#F5F3FF"];
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((p, i) => (
        <div key={i} style={{ background: bgs[i % 3], borderRadius: 10, padding: "11px 13px" }}>
          <div style={{ fontSize: FS.bodyXs, fontWeight: 500, color: C.p700, marginBottom: 5 }}>
            {String(i + 1).padStart(2, "0")}
          </div>
          <div style={{ fontSize: FS.bodyLg, fontWeight: 500, color: C.p900, marginBottom: 3, lineHeight: 1.3 }}>{p.title}</div>
          <div style={{ fontSize: FS.bodySm, color: C.p700, lineHeight: 1.5 }}>{p.description}</div>
        </div>
      ))}
    </Card>
  );
}

// ─── 4. Funnel strategy ───────────────────────────────────────
function FunnelStrategy({ stages }: { stages: FunnelStage[] }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, border: `0.5px solid ${C.border}`, overflow: "hidden", marginBottom: 10 }}>
      {/* Column headers */}
      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 120px", background: C.inset, borderBottom: `0.5px solid ${C.border}` }}>
        {["Phase", "Channels & message", "KPI / target"].map((h, i) => (
          <div key={h} style={{ padding: "7px 13px", fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", borderLeft: i > 0 ? `0.5px solid ${C.border}` : "none" }}>{h}</div>
        ))}
      </div>
      <div style={{ padding: "8px 8px 4px" }}>
        {stages.map((s, i) => {
          const col = PHASE_COLS[i % 4];
          const isLight = i === 3; // retention uses light color
          return (
            <div key={i}>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 120px", borderRadius: 9, overflow: "hidden", border: `0.5px solid ${col}30`, marginBottom: 5 }}>
                <div style={{ background: col, padding: "12px 13px" }}>
                  <div style={{ fontSize: FS.body, fontWeight: 500, color: isLight ? C.p900 : "#fff", marginBottom: 3 }}>{s.name}</div>
                  <div style={{ fontSize: FS.bodyXs, color: isLight ? "rgba(26,0,80,.6)" : "rgba(255,255,255,.6)", marginBottom: 7, lineHeight: 1.4 }}>{s.goal}</div>
                  {s.budget_pct > 0 && (
                    <div style={{ display: "inline-block", padding: "2px 8px", background: isLight ? "rgba(26,0,80,.12)" : "rgba(255,255,255,.18)", borderRadius: 20, fontSize: FS.cardLabel, fontWeight: 500, color: isLight ? C.p900 : "#fff" }}>
                      {s.budget_pct}% budget
                    </div>
                  )}
                </div>
                <div style={{ background: C.white, padding: "12px 14px", borderLeft: `0.5px solid ${C.border}` }}>
                  <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: col, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>Channels</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: s.message_type ? 7 : 0 }}>
                    {s.channels?.map((ch, j) => (
                      <span key={j} style={{ padding: "2px 7px", background: col + "18", color: col, borderRadius: 20, fontSize: FS.bodyXs, fontWeight: 500 }}>{ch}</span>
                    ))}
                  </div>
                  {s.message_type && (
                    <div style={{ paddingTop: 6, borderTop: `1px solid ${C.inset}`, fontSize: FS.bodyXs, color: C.muted, fontStyle: "italic" }}>"{s.message_type}"</div>
                  )}
                </div>
                <div style={{ background: C.inset, padding: "12px 13px", borderLeft: `0.5px solid ${C.border}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 4 }}>Target</div>
                  <div style={{ fontSize: FS.body, fontWeight: 500, color: col, lineHeight: 1.3, marginBottom: 3 }}>{s.target}</div>
                  <div style={{ fontSize: FS.cardLabel, color: C.muted }}>{s.kpi}</div>
                </div>
              </div>
              {i < stages.length - 1 && s.conversion_rate && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 13px", marginBottom: 5 }}>
                  <span style={{ fontSize: FS.bodyXs, color: C.faint }}>↓</span>
                  <span style={{ fontSize: FS.bodyXs, color: C.muted }}>{s.conversion_rate}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 5. Channel roles ─────────────────────────────────────────
function ChannelRoles({ items }: { items: ChannelRole[] }) {
  return (
    <Card style={{ padding: "0 16px" }}>
      {items.map((c, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 75px 1fr", gap: 10, padding: "9px 0", borderBottom: i < items.length - 1 ? `0.5px solid ${C.border}` : "none", alignItems: "center" }}>
          <div style={{ fontSize: FS.body, fontWeight: 500, color: C.ink }}>{c.channel}</div>
          <span style={{ padding: "3px 8px", background: C.p100, borderRadius: 20, fontSize: FS.bodyXs, fontWeight: 500, color: C.p900, display: "inline-block" }}>{c.role}</span>
          <div style={{ fontSize: FS.bodySm, color: C.muted, lineHeight: 1.4 }}>{c.why}</div>
        </div>
      ))}
    </Card>
  );
}

// ─── 6. Retargeting logic ─────────────────────────────────────
function RetargetingLogic({ items }: { items: RetargetingRule[] }) {
  return (
    <Card>
      {items.map((r, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 16px 1fr", gap: 8, alignItems: "center", marginBottom: i < items.length - 1 ? 8 : 0 }}>
          <div style={{ background: C.inset, borderRadius: 8, padding: "8px 10px", fontSize: FS.bodySm, color: C.body, lineHeight: 1.5 }}>{r.trigger}</div>
          <div style={{ textAlign: "center", fontSize: FS.body, color: C.faint }}>→</div>
          <div style={{ background: C.p100, borderRadius: "0 8px 8px 0", borderLeft: `2px solid ${C.p700}`, padding: "8px 10px", fontSize: FS.bodySm, color: C.p900, lineHeight: 1.5 }}>{r.action}</div>
        </div>
      ))}
    </Card>
  );
}

// ─── 7. Channel synergy with Venn ────────────────────────────
function VennSVG({ channels, overlap, color }: { channels: Channel[]; overlap: number; color: string }) {
  const n  = Math.min(channels.length || 2, 4);
  const cx = [[20, 25], [36, 18], [38, 34], [28, 42]];
  const r  = [16, 13, 11, 9];
  return (
    <svg width="64" height="50" viewBox="0 0 64 50" style={{ flexShrink: 0 }}>
      {Array.from({ length: n }).map((_, i) => (
        <circle key={i} cx={cx[i][0]} cy={cx[i][1]} r={r[i]} fill={color} opacity={0.75 - i * 0.12} />
      ))}
      <text x="28" y="27" fontSize={9} fontWeight="600" fill="#fff" fontFamily="sans-serif" textAnchor="middle">{overlap}%</text>
    </svg>
  );
}

function ChannelSynergy({ channels, overlaps, score, notes }: {
  channels:  Channel[];
  overlaps:  ChannelOverlap[];
  score?:    number;
  notes?:    string;
}) {
  const byRole: Record<string, Channel[]> = {};
  channels.forEach(ch => {
    const r = (ch.role || "awareness").toLowerCase();
    if (!byRole[r]) byRole[r] = [];
    byRole[r].push(ch);
  });

  const defaults: Record<string, { pct: number; insight: string }> = {
    awareness:     { pct: 44, insight: "Align creative for consistent brand story across all touchpoints." },
    consideration: { pct: 28, insight: "Low overlap — channels reach complementary audience segments." },
    conversion:    { pct: 62, insight: "High overlap intentional — reinforces purchase decision at the critical moment." },
    retention:     { pct: 85, insight: "Same user across all channels — coordinate timing to prevent fatigue." },
  };

  function getOv(role: string): { pct: number; insight: string } {
    const chs = byRole[role] || [];
    const found = overlaps.find(ov =>
      ov.channels?.some(n => chs.some(ch => ch.name?.includes(n) || n.includes(ch.name || "")))
    );
    return found ? { pct: found.overlap_pct, insight: found.insight } : defaults[role] || { pct: 35, insight: "" };
  }

  return (
    <Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: score ? 10 : 0 }}>
        {PHASE_KEYS.map((role, i) => {
          const col = PHASE_COLS[i];
          const chs = byRole[role] || [];
          const ov  = getOv(role);
          return (
            <div key={role} style={{ background: C.inset, borderRadius: 10, padding: "11px 13px" }}>
              <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: col, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>{role}</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 7 }}>
                <VennSVG channels={chs} overlap={ov.pct} color={col} />
                <div>
                  <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 5 }}>
                    {chs.map((ch, j) => (
                      <span key={j} style={{ padding: "2px 7px", background: col + "18", color: col, borderRadius: 20, fontSize: FS.cardLabel, fontWeight: 500 }}>{ch.name}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: col, lineHeight: 1 }}>
                    {ov.pct}% <span style={{ fontSize: FS.bodyXs, fontWeight: 400, color: C.muted }}>overlap</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.5 }}>{ov.insight}</div>
            </div>
          );
        })}
      </div>
      {score && (
        <div style={{ background: C.p100, borderRadius: 10, padding: "11px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: FS.body, fontWeight: 500, color: C.ink, marginBottom: 3 }}>Overall channel synergy score</div>
            <div style={{ fontSize: FS.bodySm, color: C.p700, lineHeight: 1.5 }}>{notes}</div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 500, color: C.p700, flexShrink: 0, marginLeft: 14 }}>{score}%</div>
        </div>
      )}
    </Card>
  );
}

// ─── 8. Budget rationale ──────────────────────────────────────
function BudgetRationale({ stages, rationale }: { stages: BudgetStage[]; rationale?: string }) {
  return (
    <Card>
      {stages.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
          <div style={{ fontSize: FS.bodySm, color: C.body, width: 100, flexShrink: 0 }}>{s.stage}</div>
          <div style={{ flex: 1, height: 22, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ width: `${s.pct}%`, minWidth: 52, height: "100%", background: PHASE_COLS[i % 4], borderRadius: 6, display: "flex", alignItems: "center", paddingLeft: 10 }}>
              <span style={{ fontSize: FS.bodySm, fontWeight: 500, color: i === 3 ? C.p900 : "#fff", whiteSpace: "nowrap" }}>{s.amount}</span>
            </div>
          </div>
          <div style={{ fontSize: FS.bodySm, color: C.muted, width: 28, textAlign: "right" }}>{s.pct}%</div>
        </div>
      ))}
      {rationale && (
        <div style={{ paddingTop: 12, marginTop: 4, borderTop: `0.5px solid ${C.border}` }}>
          <div style={{ fontSize: FS.bodySm, color: C.muted, lineHeight: 1.6 }}>{rationale}</div>
        </div>
      )}
    </Card>
  );
}

// ─── 9. Success metrics ───────────────────────────────────────
function SuccessMetrics({ northStar, desc, metrics }: { northStar?: string; desc?: string; metrics?: SuccessMetric[] }) {
  return (
    <div>
      {northStar && (
        <div style={{ background: C.p900, borderRadius: 10, padding: "14px 16px", marginBottom: 9, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>North-star KPI</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: "#fff", marginBottom: desc ? 4 : 0 }}>{northStar}</div>
            {desc && <div style={{ fontSize: FS.bodySm, color: "rgba(255,255,255,.5)", lineHeight: 1.5 }}>{desc}</div>}
          </div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,.12)", flexShrink: 0, marginLeft: 14 }}>★</div>
        </div>
      )}
      {metrics && metrics.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ background: C.white, border: `0.5px solid ${C.border}`, borderRadius: 9, padding: "10px 13px", display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{m.label}</div>
              <div style={{ fontSize: FS.bodyLg, fontWeight: 500, color: C.ink }}>{m.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export function SecStrategy({ d, raw }: { d: StrategyData; raw: string }) {
  const stages         = (d.stages            || []) as FunnelStage[];
  const channels       = (d.channels          || []) as Channel[];
  const overlaps       = (d.channel_overlap   || []) as ChannelOverlap[];
  const audiencePri    = (d.audience_priority  || []) as { segment: string; why: string; priority: string }[];
  const pillars        = (d.messaging_pillars  || []) as MessagingPillar[];
  const channelRoles   = (d.channel_roles      || []) as ChannelRole[];
  const retargetRules  = (d.retargeting_rules  || []) as RetargetingRule[];
  const budgetStages   = (d.budget_stages      || []) as BudgetStage[];
  const successMetrics = (d.success_metrics    || []) as SuccessMetric[];

  return (
    <div>

      {/* 1. Strategic idea */}
      {d.strategic_idea && <StrategicIdea idea={d.strategic_idea} />}

      {/* 2 + 3: Audience priority + Messaging pillars */}
      {(audiencePri.length > 0 || pillars.length > 0) && (
        <Pair
          left={<><SectionLabel>2 — Audience priority</SectionLabel><AudiencePriority items={audiencePri} /></>}
          right={<><SectionLabel>3 — Messaging pillars</SectionLabel><MessagingPillars items={pillars} /></>}
        />
      )}

      {/* 4. Funnel strategy — full width */}
      {stages.length > 0 && (
        <div>
          <SectionLabel>4 — Funnel strategy</SectionLabel>
          <FunnelStrategy stages={stages} />
        </div>
      )}

      {/* 5 + 6: Channel roles + Retargeting */}
      {(channelRoles.length > 0 || retargetRules.length > 0) && (
        <Pair
          left={<><SectionLabel>5 — Channel roles</SectionLabel><ChannelRoles items={channelRoles} /></>}
          right={<><SectionLabel>6 — Retargeting logic</SectionLabel><RetargetingLogic items={retargetRules} /></>}
        />
      )}

      {/* 7 + 8: Channel synergy + Budget rationale */}
      <Pair
        left={<><SectionLabel>7 — Channel synergy</SectionLabel><ChannelSynergy channels={channels} overlaps={overlaps} score={d.synergy_score} notes={d.synergy_notes} /></>}
        right={<>{budgetStages.length > 0 && <><SectionLabel>8 — Budget rationale</SectionLabel><BudgetRationale stages={budgetStages} rationale={d.budget_rationale} /></>}</>}
      />

      {/* 9. Success metrics */}
      {(d.north_star_kpi || successMetrics.length > 0) && (
        <div style={{ marginBottom: 10 }}>
          <SectionLabel>9 — Success metrics</SectionLabel>
          <SuccessMetrics northStar={d.north_star_kpi} desc={d.north_star_desc} metrics={successMetrics} />
        </div>
      )}

      <FeedbackBar phase="strategy" outputRaw={raw} />
    </div>
  );
}
