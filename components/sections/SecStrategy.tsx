"use client";
import { T, TY } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import type { FunnelData, ChannelData, Channel } from "@/lib/types";

// Strategy combines funnel + channel data
interface StrategyData {
  stages?:         FunnelData["stages"];
  retargeting?:    FunnelData["retargeting"];
  channels?:       ChannelData["channels"];
  channel_overlap?: ChannelData["channel_overlap"];
  synergy_score?:  ChannelData["synergy_score"];
  synergy_notes?:  ChannelData["synergy_notes"];
  [key: string]: unknown;
}

interface Props { d: StrategyData; raw: string; }

const PHASE_COLS = [T.p1, T.p2, T.p3, T.p5] as const;
const ROLE_COLS: Record<string, string> = {
  awareness:     T.p1,
  consideration: T.p2,
  conversion:    T.p3,
  retention:     T.p5,
};
const PHASE_ORDER = ["awareness", "consideration", "conversion", "retention"] as const;
type PhaseRole = typeof PHASE_ORDER[number];

const CARD = { background: T.sur, borderRadius: 14, boxShadow: T.shad, padding: "16px 18px", marginBottom: 9 };

function groupByRole(channels: Channel[]): Record<string, Channel[]> {
  const g: Record<string, Channel[]> = {};
  channels.forEach(ch => {
    const r = (ch.role || "awareness").toLowerCase().replace(/[^a-z]/g, "");
    const k = PHASE_ORDER.includes(r as PhaseRole) ? r : "awareness";
    if (!g[k]) g[k] = [];
    g[k].push(ch);
  });
  return g;
}

function VennSVG({ channels, overlap, color }: { channels: Channel[]; overlap: number; color: string }) {
  const n   = Math.min(channels.length, 4);
  const cx  = [[22,26],[40,18],[42,36],[30,42]];
  const r   = [18,14,12,10];
  const op  = ["bb","88","77","66"];
  return (
    <svg width={72} height={60} viewBox="0 0 72 60" style={{ flexShrink: 0 }}>
      {channels.slice(0, n).map((_, i) => (
        <circle key={i} cx={cx[i][0]} cy={cx[i][1]} r={r[i]} fill={color + op[i]} stroke="#fff" strokeWidth={1} />
      ))}
      <text x="32" y="31" fontSize={10} fontWeight="800" fill="#fff" fontFamily="sans-serif" textAnchor="middle">{overlap}%</text>
    </svg>
  );
}

function getOverlap(role: string, d: StrategyData, channels: Channel[]): { pct: number; insight: string } {
  const names = channels.map(c => c.name || "");
  const found = d.channel_overlap?.find(ov =>
    ov.channels?.some(n => names.some(nm => nm.includes(n) || n.includes(nm)))
  );
  if (found) return { pct: found.overlap_pct, insight: found.insight };
  const defaults: Record<string, { pct: number; insight: string }> = {
    awareness:     { pct: 44, insight: "Align creative across channels for consistent brand messaging." },
    consideration: { pct: 28, insight: "Low overlap — channels reach complementary audience segments." },
    conversion:    { pct: 62, insight: "High overlap is intentional — reinforces conversion at purchase moment." },
    retention:     { pct: 85, insight: "Same user across channels — coordinate timing to prevent fatigue." },
  };
  return defaults[role] || { pct: 35, insight: "" };
}

export function SecStrategy({ d, raw }: Props) {
  const stages   = d.stages   || [];
  const channels = d.channels || [];
  const groups   = groupByRole(channels);
  const activePhases = PHASE_ORDER.filter(p => (groups[p]?.length ?? 0) > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

      {/* Customer journey */}
      {stages.length > 0 && (
        <div style={{ ...CARD }}>
          <div style={{ ...TY.cardLabel }}>Customer journey</div>
          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 120px", background: T.s2, borderRadius: "7px 7px 0 0", overflow: "hidden", margin: "-16px -18px 8px" }}>
            <div style={{ ...TY.cardLabel, padding: "7px 12px", marginBottom: 0 }}>Phase</div>
            <div style={{ ...TY.cardLabel, padding: "7px 12px", marginBottom: 0 }}>Channels & message</div>
            <div style={{ ...TY.cardLabel, padding: "7px 12px", marginBottom: 0 }}>Target</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {stages.map((s, i) => {
              const col = PHASE_COLS[i % 4];
              return (
                <div key={i}>
                  <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 120px", borderRadius: 9, overflow: "hidden", border: `0.5px solid ${col}28` }}>
                    <div style={{ background: col, padding: "12px 13px" }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 3 }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,.55)", marginBottom: 7, lineHeight: 1.4 }}>{s.goal}</div>
                      {s.budget_pct > 0 && (
                        <div style={{ display: "inline-block", padding: "2px 8px", background: "rgba(255,255,255,.18)", borderRadius: 20, fontSize: 9, fontWeight: 600, color: "#fff" }}>
                          {s.budget_pct}% budget
                        </div>
                      )}
                    </div>
                    <div style={{ background: T.sur, padding: "12px 14px", borderLeft: `0.5px solid ${T.s3}` }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: col, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Channels</div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: s.message_type ? 7 : 0 }}>
                        {s.channels?.map((c, j) => (
                          <span key={j} style={{ padding: "2px 8px", background: col + "14", color: col, borderRadius: 20, fontSize: 10, fontWeight: 600 }}>{c}</span>
                        ))}
                      </div>
                      {s.message_type && (
                        <div style={{ paddingTop: 6, borderTop: `1px solid ${T.s3}` }}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: T.t3, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>Message</div>
                          <div style={{ fontSize: 10, color: T.t3, fontStyle: "italic", lineHeight: 1.5 }}>"{s.message_type}"</div>
                        </div>
                      )}
                    </div>
                    <div style={{ background: T.s2, padding: "12px 13px", borderLeft: `0.5px solid ${T.s3}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: T.t3, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Target</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: col, lineHeight: 1.3, marginBottom: 3 }}>{s.target}</div>
                      <div style={{ fontSize: 9, color: T.t3, lineHeight: 1.4 }}>{s.kpi}</div>
                    </div>
                  </div>
                  {i < stages.length - 1 && s.conversion_rate && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 13px" }}>
                      <span style={{ fontSize: 10, color: T.t4 }}>↓</span>
                      <span style={{ fontSize: 10, color: T.t3 }}>{s.conversion_rate} conversion rate</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Channel overlap per phase */}
      {activePhases.length > 0 && (
        <div style={{ ...CARD }}>
          <div style={{ ...TY.cardLabel }}>Channel overlap by phase</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: d.synergy_score ? 12 : 0 }}>
            {activePhases.map(role => {
              const chs = groups[role] || [];
              const col = ROLE_COLS[role] || T.p3;
              const { pct, insight } = getOverlap(role, d, chs);
              return (
                <div key={role} style={{ background: T.s2, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: col, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>{role.toUpperCase()}</div>
                  <div style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 7 }}>
                    <VennSVG channels={chs} overlap={pct} color={col} />
                    <div>
                      <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 5 }}>
                        {chs.map((ch, i) => (
                          <span key={i} style={{ padding: "2px 7px", background: col + "18", color: col, borderRadius: 20, fontSize: 9, fontWeight: 600 }}>{ch.name}</span>
                        ))}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: col, lineHeight: 1 }}>
                        {pct}%<span style={{ fontSize: 10, fontWeight: 400, color: T.t3, marginLeft: 3 }}>overlap</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: T.t3, lineHeight: 1.55 }}>{insight}</div>
                </div>
              );
            })}
          </div>
          {d.synergy_score && (
            <div style={{ background: T.p6, borderRadius: 10, padding: "12px 15px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.t1, marginBottom: 3 }}>Overall channel synergy score</div>
                <div style={{ fontSize: 11, color: T.t3 }}>{d.synergy_notes}</div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: T.p2, flexShrink: 0, marginLeft: 14 }}>{d.synergy_score}%</div>
            </div>
          )}
        </div>
      )}

      {/* Retargeting */}
      {(d.retargeting?.filter((r: string) => r).length ?? 0) > 0 && (
        <div style={{ ...CARD }}>
          <div style={{ ...TY.cardLabel }}>Retargeting logic</div>
          {(d.retargeting as string[]).filter(r => r).map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: T.p6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: T.p2, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 11, color: T.t2, lineHeight: 1.55 }}>{r}</div>
            </div>
          ))}
        </div>
      )}

      <FeedbackBar phase="strategy" outputRaw={raw} />
    </div>
  );
}
