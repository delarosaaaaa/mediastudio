"use client";
import { T, TY } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import type { ChannelData, Channel } from "@/lib/types";

interface Props { d: ChannelData; raw: string; }

const ROLE_COLS: Record<string, string> = {
  awareness:     T.p1,
  consideration: T.p2,
  conversion:    T.p3,
  retention:     T.p5,
};
const PHASE_ORDER = ["awareness", "consideration", "conversion", "retention"] as const;
type PhaseRole = typeof PHASE_ORDER[number];

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
  const n = Math.min(channels.length, 4);
  const cx = [[28,30],[48,22],[50,42],[36,48]];
  const r  = [20,16,14,12];
  const op = ["bb","88","77","66"];
  return (
    <svg width={80} height={68} viewBox="0 0 80 68" style={{ flexShrink: 0 }}>
      {channels.slice(0, n).map((_, i) => (
        <circle key={i} cx={cx[i][0]} cy={cx[i][1]} r={r[i]} fill={color + op[i]} stroke="#fff" strokeWidth={1} />
      ))}
      <text x="38" y="34" fontSize={10} fontWeight="bold" fill="#fff" fontFamily="sans-serif" textAnchor="middle">{overlap}%</text>
    </svg>
  );
}

function getOverlap(role: string, d: ChannelData, channels: Channel[]): { pct: number; insight: string } {
  const names = channels.map(c => c.name || "");
  const found = d.channel_overlap?.find(ov =>
    ov.channels?.some(n => names.some(nm => nm.includes(n) || n.includes(nm)))
  );
  if (found) return { pct: found.overlap_pct, insight: found.insight };
  const defaults: Record<string, { pct: number; insight: string }> = {
    awareness:     { pct: 44, insight: "Align creative across channels for consistent brand messaging." },
    consideration: { pct: 28, insight: "Low overlap — channels reach complementary audience segments." },
    conversion:    { pct: 62, insight: "High overlap is intentional — reinforces conversion at the purchase moment." },
    retention:     { pct: 85, insight: "Same user across channels — coordinate timing to prevent fatigue." },
  };
  return defaults[role] || { pct: 35, insight: "" };
}

export function SecChannel({ d, raw }: Props) {
  const channels = d.channels || [];
  if (!channels.length) return <div style={{ background: T.sur, borderRadius: 12, padding: "28px", textAlign: "center", fontSize: 12, color: T.t3 }}>No channel data available.</div>;

  const groups      = groupByRole(channels);
  const activePhases = PHASE_ORDER.filter(p => (groups[p]?.length ?? 0) > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      {/* Overlap per funnel phase */}
      <div style={{ background: T.sur, borderRadius: 12, padding: "16px 18px", boxShadow: T.shad }}>
        <div style={{ ...TY.cardLabel, marginBottom: 14 }}>Channel overlap by funnel phase</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {activePhases.map(role => {
            const chs = groups[role] || [];
            const col = ROLE_COLS[role] || T.p3;
            const { pct, insight } = getOverlap(role, d, chs);
            return (
              <div key={role} style={{ background: T.s2, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ ...TY.cardLabel, color: col, marginBottom: 8 }}>{role.toUpperCase()}</div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                  <VennSVG channels={chs} overlap={pct} color={col} />
                  <div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 5 }}>
                      {chs.map((ch, i) => <span key={i} style={{ padding: "2px 7px", background: col + "18", color: col, borderRadius: 20, fontSize: 9, fontWeight: 600 }}>{ch.name}</span>)}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: col, lineHeight: 1 }}>{pct}%<span style={{ fontSize: 10, fontWeight: 400, color: T.t3, marginLeft: 4 }}>overlap</span></div>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: T.t3, lineHeight: 1.55 }}>{insight}</div>
              </div>
            );
          })}
        </div>
        {d.synergy_score && (
          <div style={{ background: T.p6, borderRadius: 9, padding: "11px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.t1, marginBottom: 2 }}>Overall channel synergy score</div>
              <div style={{ fontSize: 11, color: T.t3 }}>{d.synergy_notes}</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.pa, flexShrink: 0, marginLeft: 14 }}>{d.synergy_score}%</div>
          </div>
        )}
      </div>

      {/* Channel detail */}
      <div style={{ background: T.sur, borderRadius: 12, padding: "16px 18px", boxShadow: T.shad }}>
        <div style={{ ...TY.cardLabel, marginBottom: 12 }}>Channel detail</div>
        {channels.map((ch, i) => {
          const role = (ch.role || "awareness").toLowerCase().replace(/[^a-z]/g, "");
          const rk   = (PHASE_ORDER.includes(role as PhaseRole) ? role : "awareness") as PhaseRole;
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 0", borderBottom: i < channels.length - 1 ? `1px solid ${T.s2}` : "none" }}>
              <div style={{ width: 3, height: 30, borderRadius: 2, background: ROLE_COLS[rk], flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.t1 }}>{ch.name}</div>
                  <span style={{ padding: "2px 7px", background: ROLE_COLS[rk] + "18", color: ROLE_COLS[rk], borderRadius: 20, fontSize: 9, fontWeight: 600 }}>{rk.toUpperCase()}</span>
                  {ch.always_on && <span style={{ padding: "2px 7px", background: T.p6, color: T.p1, borderRadius: 20, fontSize: 9, fontWeight: 600 }}>ALWAYS-ON</span>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "75px 1fr", gap: "3px 10px", fontSize: 11 }}>
                  <span style={{ fontSize: 10, color: T.t3 }}>Targeting</span><span style={{ color: T.t2 }}>{ch.targeting}</span>
                  <span style={{ fontSize: 10, color: T.t3 }}>Formats</span><span style={{ color: T.t2 }}>{ch.formats?.join(", ")}</span>
                  <span style={{ fontSize: 10, color: T.t3 }}>Rationale</span><span style={{ color: T.t2, lineHeight: 1.5 }}>{ch.motivation}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <FeedbackBar phase="channel" outputRaw={raw} />
    </div>
  );
}
