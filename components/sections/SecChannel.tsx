"use client";
import { T, TY } from "@/lib/tokens";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import type { ChannelData } from "@/lib/types";

interface Props { d: ChannelData; raw: string; }

const ROLE_COLS: Record<string, string> = {
  awareness:     "#1A0050",
  consideration: "#7C3AED",
  conversion:    "#A855F7",
};

export function SecChannel({ d, raw }: Props) {
  const channels = d.channels || [];
  if (!channels.length) return <Card><div style={{ ...TY.bodyMd, color: T.t3, textAlign: "center", padding: 28 }}>No channel data available.</div></Card>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Effectiveness table */}
      <Card>
        <SectionTitle a="Channel" b="Effectiveness" />
        <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr 68px", gap: 6, alignItems: "center", marginBottom: 6, padding: "0 4px" }}>
          <div />
          <div style={{ ...TY.cardLabel, color: T.p2, textAlign: "center" }}>Reach ↑</div>
          <div style={{ ...TY.cardLabel, textAlign: "center" }}>Selectivity ↑</div>
          <div style={{ ...TY.cardLabel, color: T.pa, textAlign: "center" }}>Score</div>
        </div>
        {channels.map((ch, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr 68px", gap: 6, alignItems: "center", marginBottom: 9, padding: "0 4px" }}>
            <div style={{ ...TY.bodySm, fontWeight: 500 }}>{ch.name || `Channel ${i + 1}`}</div>
            <div>
              <div style={{ height: 7, borderRadius: 3, background: "#EBEBED", overflow: "hidden", marginBottom: 2 }}>
                <div style={{ width: `${Math.min(ch.reach_index || 0, 100)}%`, height: "100%", background: T.p2, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, color: T.p2 }}>{ch.reach_index || "—"}</div>
            </div>
            <div>
              <div style={{ height: 7, borderRadius: 3, background: "#EBEBED", overflow: "hidden", marginBottom: 2 }}>
                <div style={{ width: `${Math.min(ch.selectivity_index || 0, 100)}%`, height: "100%", background: T.t4, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 9, color: T.t3 }}>{ch.selectivity_index || "—"}</div>
            </div>
            <div style={{ ...TY.bodySm, color: T.pa, textAlign: "center", letterSpacing: "1px" }}>{ch.score_label || "●●●○○"}</div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 14, marginTop: 4, padding: "0 4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: T.p2 }} /><span style={{ fontSize: 10, color: T.t3 }}>Reach index</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: T.t4 }} /><span style={{ fontSize: 10, color: T.t3 }}>Selectivity index</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontSize: 10, color: T.pa }}>●●●</span><span style={{ fontSize: 10, color: T.t3 }}>Effectiveness score</span></div>
        </div>
      </Card>

      {/* Overlap analysis */}
      {(d.channel_overlap?.length ?? 0) > 0 && (
        <Card>
          <SectionTitle a="Channel" b="overlap & synergy" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {d.channel_overlap.map((ov, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "10px 14px", background: T.s2, borderRadius: 10 }}>
                <div style={{ display: "flex", flexShrink: 0 }}>
                  {ov.channels?.map((c, j) => (
                    <div key={j} style={{ width: 28, height: 28, borderRadius: "50%", background: [T.p1, T.p3, T.p4][j % 3], border: "2px solid #fff", marginLeft: j > 0 ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", fontWeight: 700 }}>
                      {c.substring(0, 2)}
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...TY.bodyMd, fontWeight: 600, color: T.t1, marginBottom: 2 }}>{ov.channels?.join(" + ")}</div>
                  <div style={{ ...TY.bodySm, color: T.t3 }}>{ov.insight}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: T.pa }}>{ov.overlap_pct}%</div>
                  <div style={{ ...TY.label }}>overlap</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", position: "relative", height: 110, marginBottom: 8 }}>
            {[{ l: 24, t: 15, c: T.p1 + "66" }, { l: 68, t: 15, c: T.p3 + "66" }, { l: 46, t: 46, c: T.p4 + "66" }].map((ci, idx) => (
              <div key={idx} style={{ position: "absolute", width: 70, height: 70, borderRadius: "50%", background: ci.c, left: `${ci.l}px`, top: `${ci.t}px` }} />
            ))}
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", fontSize: 14, fontWeight: 700, color: T.t1, textShadow: "0 0 8px #fff" }}>{d.synergy_score || 78}%</div>
          </div>
          <div style={{ ...TY.bodyMd, textAlign: "center" }}>{d.synergy_notes}</div>
        </Card>
      )}

      {/* Channel detail */}
      <Card>
        <SectionTitle a="Channel" b="detail" />
        {channels.map((ch, i) => {
          const role = (ch.role || "awareness").toLowerCase().replace(/[^a-z]/g, "");
          const rk   = (["awareness", "consideration", "conversion"].includes(role) ? role : "awareness") as keyof typeof ROLE_COLS;
          return (
            <div key={i} style={{ padding: "13px 0", borderBottom: i < channels.length - 1 ? `1px solid ${T.s2}` : "none" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 4, height: 32, borderRadius: 2, background: ROLE_COLS[rk], flexShrink: 0, marginTop: 3 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.t1 }}>{ch.name || `Channel ${i + 1}`}</div>
                    <Pill label={rk.toUpperCase()} color={ROLE_COLS[rk]} />
                    {ch.always_on && <Pill label="ALWAYS-ON" color={T.p1} />}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "3px 12px", fontSize: 12 }}>
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
