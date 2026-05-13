"use client";
import { useState } from "react";
import { T, TY } from "@/lib/tokens";
import { TabBar } from "@/components/ui/TabBar";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import type { CompetitiveData } from "@/lib/types";

interface Props { d: CompetitiveData; raw: string; }

const CARD = { background: T.sur, borderRadius: 12, padding: "16px 18px", boxShadow: T.shad };
const COLS = ["#1A0050", "#7C3AED", "#A855F7", "#C4B5FD"] as const;

function Bar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <div style={{ fontSize: 11, color: T.t2, width: 88, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 6, background: T.s2, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.t1, width: 28, textAlign: "right" }}>{pct}%</div>
    </div>
  );
}

export function SecCompetitive({ d, raw }: Props) {
  const [tab, setTab] = useState("overview");
  const competitors = d.competitors || [];
  const comp = competitors.find(c => c.name === tab) ?? null;
  const tabs = [{ key: "overview", label: "Overview" }, ...competitors.map(c => ({ key: c.name, label: c.name }))];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ background: T.sur, borderRadius: 12, overflow: "hidden", boxShadow: T.shad }}>
        <TabBar tabs={tabs} active={tab} onSelect={k => setTab(String(k))} />
        <div style={{ padding: "16px 18px" }}>
          {tab === "overview" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* SOV + Market share */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <div style={{ ...TY.cardLabel, marginBottom: 10 }}>Share of Voice</div>
                  {d.sov?.map((s, i) => <Bar key={i} label={s.brand || s.name || ""} pct={s.pct} color={COLS[i % 4]} />)}
                </div>
                <div>
                  <div style={{ ...TY.cardLabel, marginBottom: 10 }}>Market Share</div>
                  {(d.market_share || d.sov || []).map((s, i) => <Bar key={i} label={s.brand || s.name || ""} pct={s.pct} color={COLS[i % 4]} />)}
                </div>
              </div>
              {/* All recent ads */}
              {competitors.some(c => (c.recent_ads?.length ?? 0) > 0) && (
                <div>
                  <div style={{ ...TY.cardLabel, color: T.pa, marginBottom: 10 }}>Recent ads — last 30 days</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {competitors.flatMap(c => (c.recent_ads || []).map((ad, j) => (
                      <div key={`${c.name}-${j}`} style={{ display: "flex", gap: 10, padding: "9px 11px", background: T.s2, borderRadius: 9, alignItems: "flex-start" }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: T.p6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>📱</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: 5, marginBottom: 3, flexWrap: "wrap" }}>
                            <span style={{ padding: "2px 7px", background: T.p6, color: T.pa, borderRadius: 5, fontSize: 9, fontWeight: 600 }}>{c.name}</span>
                            <span style={{ padding: "2px 7px", background: T.s3, color: T.t2, borderRadius: 5, fontSize: 9, fontWeight: 500 }}>{ad.platform}</span>
                            <span style={{ padding: "2px 7px", background: T.s3, color: T.t2, borderRadius: 5, fontSize: 9, fontWeight: 500 }}>{ad.format}</span>
                          </div>
                          <div style={{ fontSize: 11, color: T.t2, marginBottom: 2 }}>{ad.description}</div>
                          <div style={{ fontSize: 10, color: T.t3, fontStyle: "italic" }}>{ad.angle}</div>
                        </div>
                      </div>
                    )))}
                  </div>
                </div>
              )}
            </div>
          ) : comp ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.t1 }}>{comp.name}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.pa }}>{comp.est_budget}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div style={{ background: T.s2, borderRadius: 9, padding: "10px 12px" }}>
                  <div style={{ ...TY.cardLabel, marginBottom: 3 }}>SOV</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: T.p1, lineHeight: 1 }}>{comp.sov_pct || "—"}%</div>
                </div>
                <div style={{ background: T.s2, borderRadius: 9, padding: "10px 12px" }}>
                  <div style={{ ...TY.cardLabel, marginBottom: 3 }}>Market share</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: T.p1, lineHeight: 1 }}>{comp.market_share_pct || "—"}%</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {comp.channels?.map((c, j) => <span key={j} style={{ padding: "2px 9px", background: T.p6, color: T.p2, borderRadius: 20, fontSize: 10, fontWeight: 600 }}>{c}</span>)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <div style={{ ...TY.cardLabel, color: T.pa, marginBottom: 7 }}>Strengths</div>
                  {comp.strengths?.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5, alignItems: "flex-start" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.pa, marginTop: 5, flexShrink: 0 }} />
                      <div style={{ fontSize: 11, color: T.t2 }}>{s}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ ...TY.cardLabel, marginBottom: 7 }}>Weaknesses</div>
                  {comp.weaknesses?.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5, alignItems: "flex-start" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.t4, marginTop: 5, flexShrink: 0 }} />
                      <div style={{ fontSize: 11, color: T.t2 }}>{s}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: T.s2, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ ...TY.cardLabel, marginBottom: 4 }}>Positioning</div>
                <div style={{ fontSize: 12, color: T.t2 }}>{comp.positioning}</div>
              </div>
              {(comp.recent_ads?.length ?? 0) > 0 && (
                <div>
                  <div style={{ ...TY.cardLabel, color: T.pa, marginBottom: 8 }}>Recent ads</div>
                  {comp.recent_ads.map((ad, i) => (
                    <div key={i} style={{ display: "flex", gap: 9, padding: "9px 11px", background: T.s2, borderRadius: 9, alignItems: "flex-start", marginBottom: 6 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: T.p6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>📱</div>
                      <div>
                        <div style={{ display: "flex", gap: 5, marginBottom: 3 }}>
                          <span style={{ padding: "2px 7px", background: T.s3, color: T.t2, borderRadius: 5, fontSize: 9, fontWeight: 500 }}>{ad.platform}</span>
                          <span style={{ padding: "2px 7px", background: T.s3, color: T.t2, borderRadius: 5, fontSize: 9, fontWeight: 500 }}>{ad.format}</span>
                        </div>
                        <div style={{ fontSize: 11, color: T.t2, marginBottom: 2 }}>{ad.description}</div>
                        <div style={{ fontSize: 10, color: T.t3, fontStyle: "italic" }}>{ad.angle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : <div style={{ fontSize: 12, color: T.t3, textAlign: "center", padding: 20 }}>Select a competitor from the tabs.</div>}
        </div>
      </div>

      {(d.market_gaps?.length ?? 0) > 0 && (
        <div style={{ ...CARD }}>
          <div style={{ ...TY.cardLabel, marginBottom: 12 }}>Market opportunities</div>
          {d.market_gaps.map((g, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: T.p6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: T.pa, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.t1, marginBottom: 2 }}>{g.title}</div>
                <div style={{ fontSize: 11, color: T.t3 }}>{g.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <FeedbackBar phase="competitive" outputRaw={raw} />
    </div>
  );
}
