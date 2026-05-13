"use client";
import { T, TY } from "@/lib/tokens";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import type { ChannelData, Channel } from "@/lib/types";

interface Props { d: ChannelData; raw: string; }

const ROLE_COLS: Record<string, string> = {
  awareness:     T.p1,
  consideration: T.p3,
  conversion:    T.p4,
  retention:     T.p5,
};

const PHASE_ORDER = ["awareness", "consideration", "conversion", "retention"] as const;
type PhaseRole = typeof PHASE_ORDER[number];

// Build per-phase channel groups from channel list
function groupByRole(channels: Channel[]): Record<string, Channel[]> {
  const groups: Record<string, Channel[]> = {};
  channels.forEach(ch => {
    const role = (ch.role || "awareness").toLowerCase().replace(/[^a-z]/g, "");
    const key = PHASE_ORDER.includes(role as PhaseRole) ? role : "awareness";
    if (!groups[key]) groups[key] = [];
    groups[key].push(ch);
  });
  return groups;
}

// Venn diagram SVG for a group of channels
function VennDiagram({ channels, overlap, color }: { channels: Channel[]; overlap: number; color: string }) {
  const n = Math.min(channels.length, 4);
  if (n === 0) return null;

  // Positions for up to 4 circles
  const positions: [number, number][] = [
    [32, 34], [54, 24], [56, 48], [38, 52],
  ];
  const radii = [22, 18, 16, 14];
  const hexOpacity = ["bb", "99", "88", "77"];

  return (
    <svg width={90} height={72} viewBox="0 0 90 72" style={{ flexShrink: 0 }}>
      {channels.slice(0, n).map((ch, i) => (
        <circle
          key={i}
          cx={positions[i][0]}
          cy={positions[i][1]}
          r={radii[i]}
          fill={color + hexOpacity[i]}
          stroke="#fff"
          strokeWidth={1}
        />
      ))}
      {channels.slice(0, n).map((ch, i) => (
        <text
          key={`t${i}`}
          x={positions[i][0]}
          y={positions[i][1] + 3}
          fontSize={7}
          fill="#fff"
          fontFamily="sans-serif"
          textAnchor="middle"
          style={{ pointerEvents: "none" }}
        >
          {(ch.name || "").split(" ")[0]}
        </text>
      ))}
      <text
        x={44}
        y={38}
        fontSize={11}
        fontWeight="bold"
        fill="#fff"
        fontFamily="sans-serif"
        textAnchor="middle"
        style={{ pointerEvents: "none" }}
      >
        {overlap}%
      </text>
    </svg>
  );
}

// Per-phase overlap insight from channel_overlap data
function getOverlapForRole(
  role: string,
  d: ChannelData,
  channels: Channel[]
): { pct: number; insight: string } {
  if (!channels.length) return { pct: 0, insight: "" };

  // Try to find from channel_overlap array
  const names = channels.map(c => c.name || "");
  const found = d.channel_overlap?.find(ov =>
    ov.channels?.some(n => names.some(nm => nm.includes(n) || n.includes(nm)))
  );

  if (found) return { pct: found.overlap_pct, insight: found.insight };

  // Fallback estimates per phase
  const defaults: Record<string, { pct: number; insight: string }> = {
    awareness:     { pct: 44, insight: "Coordinate creative across awareness channels for consistent brand messaging." },
    consideration: { pct: 28, insight: "Low overlap — channels reach complementary audience segments." },
    conversion:    { pct: 62, insight: "High overlap is intentional — both channels reinforce conversion at the purchase moment." },
    retention:     { pct: 85, insight: "Same user across all channels — coordinate timing to prevent message fatigue." },
  };
  return defaults[role] || { pct: 35, insight: "" };
}

export function SecChannel({ d, raw }: Props) {
  const channels = d.channels || [];
  if (!channels.length) return <Card><div style={{ ...TY.bodyMd, color: T.t3, textAlign: "center", padding: 28 }}>No channel data available.</div></Card>;

  const groups = groupByRole(channels);
  const activePhases = PHASE_ORDER.filter(p => (groups[p]?.length ?? 0) > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Overlap per funnel phase with Venn circles */}
      <Card>
        <SectionTitle a="Channel" b="overlap by funnel phase" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {activePhases.map(role => {
            const chs = groups[role] || [];
            const col = ROLE_COLS[role] || T.p3;
            const { pct, insight } = getOverlapForRole(role, d, chs);
            return (
              <div key={role} style={{ background: T.s2, borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ ...TY.cardLabel, color: col, marginBottom: 10 }}>{role.toUpperCase()}</div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                  <VennDiagram channels={chs} overlap={pct} color={col} />
                  <div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                      {chs.map((ch, i) => (
                        <span key={i} style={{ padding: "2px 7px", background: col + "18", color: col, borderRadius: 20, fontSize: 10, fontWeight: 600 }}>
                          {ch.name}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: col, lineHeight: 1 }}>
                      {pct}%
                      <span style={{ fontSize: 11, fontWeight: 400, color: T.t3, marginLeft: 4 }}>overlap</span>
                    </div>
                  </div>
                </div>
                <div style={{ ...TY.bodySm, color: T.t3, lineHeight: 1.55 }}>{insight}</div>
              </div>
            );
          })}
        </div>

        {/* Synergy score */}
        {d.synergy_score && (
          <div style={{ background: T.p6, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.t1, marginBottom: 3 }}>Overall channel synergy score</div>
              <div style={{ ...TY.bodyMd, color: T.t3 }}>{d.synergy_notes}</div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: T.pa, flexShrink: 0, marginLeft: 16 }}>{d.synergy_score}%</div>
          </div>
        )}
      </Card>

      {/* Channel detail */}
      <Card>
        <SectionTitle a="Channel" b="detail" />
        {channels.map((ch, i) => {
          const role = (ch.role || "awareness").toLowerCase().replace(/[^a-z]/g, "");
          const rk   = (PHASE_ORDER.includes(role as PhaseRole) ? role : "awareness") as PhaseRole;
          return (
            <div key={i} style={{ padding: "13px 0", borderBottom: i < channels.length - 1 ? `1px solid ${T.s2}` : "none" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 4, height: 32, borderRadius: 2, background: ROLE_COLS[rk], flexShrink: 0, marginTop: 3 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.t1 }}>{ch.name || `Channel ${i + 1}`}</div>
                    <Pill label={rk.toUpperCase()} color={ROLE_COLS[rk]} />
                    {ch.always_on && <Pill label="ALWAYS-ON" color={T.p1} />}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "4px 12px" }}>
                    <span style={{ ...TY.label, fontWeight: 500 }}>Targeting</span>
                    <span style={{ ...TY.bodyMd }}>{ch.targeting}</span>
                    <span style={{ ...TY.label, fontWeight: 500 }}>Formats</span>
                    <span style={{ ...TY.bodyMd }}>{ch.formats?.join(", ")}</span>
                    <span style={{ ...TY.label, fontWeight: 500 }}>Rationale</span>
                    <span style={{ ...TY.bodyMd, lineHeight: 1.55 }}>{ch.motivation}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Card>

      <FeedbackBar phase="channel" outputRaw={raw} />
    </div>
  );
}
