"use client";
import { C, FS, FUNNEL_COLORS } from "@/lib/tokens";
import { Card, CardLabel, Tag, FeedbackBar } from "@/components/ui/primitives";
import type { StrategyData, FunnelStage, Channel, ChannelOverlap } from "@/lib/types";

const PHASE_COLS = [C.p900, C.p700, C.p600, C.p300];

function VennSVG({ n, overlap, color }: { n: number; overlap: number; color: string }) {
  const cx = [[22, 26], [40, 18], [42, 36], [30, 42]];
  const r  = [18, 14, 12, 10];
  return (
    <svg width="72" height="60" viewBox="0 0 72 60" style={{ flexShrink: 0 }}>
      {Array.from({ length: Math.min(n, 4) }).map((_, i) => (
        <circle key={i} cx={cx[i][0]} cy={cx[i][1]} r={r[i]} fill={color} opacity={0.7 - i * 0.12} stroke="#fff" strokeWidth={1} />
      ))}
      <text x="32" y="31" fontSize={10} fontWeight="800" fill="#fff" fontFamily="sans-serif" textAnchor="middle">{overlap}%</text>
    </svg>
  );
}

export function SecStrategy({ d, raw }: { d: StrategyData; raw: string }) {
  const stages   = (d.stages   || []) as FunnelStage[];
  const channels = (d.channels || []) as Channel[];
  const overlaps = (d.channel_overlap || []) as ChannelOverlap[];

  // Group channels by role for the overlap section
  const byRole: Record<string, Channel[]> = {};
  channels.forEach(ch => {
    const r = (ch.role || "awareness").toLowerCase();
    if (!byRole[r]) byRole[r] = [];
    byRole[r].push(ch);
  });

  const phaseOrder = ["awareness", "consideration", "conversion", "retention"];
  const activePhases = phaseOrder.filter(p => byRole[p]?.length > 0);

  function getOverlap(role: string): ChannelOverlap {
    const found = overlaps.find(ov =>
      byRole[role]?.some(ch => ov.channels?.some(n => ch.name?.includes(n) || n.includes(ch.name || "")))
    );
    if (found) return found;
    const defaults: Record<string, ChannelOverlap> = {
      awareness:     { channels: [], overlap_pct: 44, insight: "Align creative across channels for consistent brand messaging." },
      consideration: { channels: [], overlap_pct: 28, insight: "Low overlap — channels reach complementary audience segments." },
      conversion:    { channels: [], overlap_pct: 62, insight: "High overlap reinforces conversion at the purchase moment." },
      retention:     { channels: [], overlap_pct: 85, insight: "Same user across channels — coordinate timing to prevent fatigue." },
    };
    return defaults[role] || { channels: [], overlap_pct: 35, insight: "" };
  }

  return (
    <div>
      {/* Customer Journey */}
      {stages.length > 0 && (
        <Card>
          <CardLabel>Customer journey</CardLabel>
          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 120px", background: C.inset, borderRadius: "7px 7px 0 0", overflow: "hidden", margin: "-16px -18px 8px" }}>
            {["Phase", "Channels & message", "Target"].map(h => (
              <div key={h} style={{ padding: "7px 12px", fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em" }}>{h}</div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {stages.map((s, i) => {
              const col = PHASE_COLS[i % 4];
              return (
                <div key={i}>
                  <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 120px", borderRadius: 9, overflow: "hidden", border: `0.5px solid ${col}30` }}>
                    <div style={{ background: col, padding: "12px 13px" }}>
                      <div style={{ fontSize: FS.body, fontWeight: 800, color: "#fff", marginBottom: 3 }}>{s.name}</div>
                      <div style={{ fontSize: FS.bodyXs, color: "rgba(255,255,255,.6)", marginBottom: 7, lineHeight: 1.4 }}>{s.goal}</div>
                      {s.budget_pct > 0 && (
                        <div style={{ display: "inline-block", padding: "2px 8px", background: "rgba(255,255,255,.18)", borderRadius: 20, fontSize: FS.cardLabel, fontWeight: 600, color: "#fff" }}>
                          {s.budget_pct}% budget
                        </div>
                      )}
                    </div>
                    <div style={{ background: C.white, padding: "12px 14px", borderLeft: `0.5px solid ${C.border}` }}>
                      <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: col, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>Channels</div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: s.message_type ? 7 : 0 }}>
                        {s.channels?.map((ch, j) => (
                          <span key={j} style={{ padding: "2px 8px", background: col + "18", color: col, borderRadius: 20, fontSize: FS.bodyXs, fontWeight: 600 }}>{ch}</span>
                        ))}
                      </div>
                      {s.message_type && (
                        <div style={{ paddingTop: 6, borderTop: `1px solid ${C.inset}`, fontSize: FS.bodyXs, color: C.muted, fontStyle: "italic" }}>
                          "{s.message_type}"
                        </div>
                      )}
                    </div>
                    <div style={{ background: C.inset, padding: "12px 13px", borderLeft: `0.5px solid ${C.border}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 4 }}>Target</div>
                      <div style={{ fontSize: FS.body, fontWeight: 800, color: col, lineHeight: 1.3, marginBottom: 3 }}>{s.target}</div>
                      <div style={{ fontSize: FS.cardLabel, color: C.muted }}>{s.kpi}</div>
                    </div>
                  </div>
                  {i < stages.length - 1 && s.conversion_rate && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 13px" }}>
                      <span style={{ fontSize: FS.bodyXs, color: C.faint }}>↓</span>
                      <span style={{ fontSize: FS.bodyXs, color: C.muted }}>{s.conversion_rate}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Channel overlap */}
      {activePhases.length > 0 && (
        <Card>
          <CardLabel>Channel overlap by funnel phase</CardLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: d.synergy_score ? 12 : 0 }}>
            {activePhases.map((role, i) => {
              const chs = byRole[role] || [];
              const col = PHASE_COLS[i % 4];
              const ov  = getOverlap(role);
              return (
                <div key={role} style={{ background: C.inset, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: col, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>{role}</div>
                  <div style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 7 }}>
                    <VennSVG n={chs.length || 2} overlap={ov.overlap_pct} color={col} />
                    <div>
                      <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 5 }}>
                        {chs.map((ch, j) => (
                          <span key={j} style={{ padding: "2px 7px", background: col + "18", color: col, borderRadius: 20, fontSize: FS.cardLabel, fontWeight: 600 }}>{ch.name}</span>
                        ))}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: col, lineHeight: 1 }}>
                        {ov.overlap_pct}%<span style={{ fontSize: FS.bodyXs, fontWeight: 400, color: C.muted, marginLeft: 3 }}>overlap</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.55 }}>{ov.insight}</div>
                </div>
              );
            })}
          </div>
          {d.synergy_score && (
            <div style={{ background: C.p100, borderRadius: 10, padding: "12px 15px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 3 }}>Overall channel synergy score</div>
                <div style={{ fontSize: FS.bodySm, color: C.muted }}>{d.synergy_notes}</div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: C.p700, flexShrink: 0, marginLeft: 14 }}>{d.synergy_score}%</div>
            </div>
          )}
        </Card>
      )}

      {/* Retargeting */}
      {d.retargeting?.filter(r => r).length > 0 && (
        <Card>
          <CardLabel>Retargeting logic</CardLabel>
          {d.retargeting.filter(r => r).map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: FS.cardLabel, fontWeight: 700, color: C.p700, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.55 }}>{r}</div>
            </div>
          ))}
        </Card>
      )}

      <FeedbackBar phase="strategy" outputRaw={raw} />
    </div>
  );
}
