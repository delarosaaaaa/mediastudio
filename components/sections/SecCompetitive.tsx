"use client";
import { useState } from "react";
import { T, TY } from "@/lib/tokens";
import { Card } from "@/components/ui/Card";
import { TabBar } from "@/components/ui/TabBar";
import { Pill } from "@/components/ui/Pill";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import type { CompetitiveData } from "@/lib/types";

interface Props { d: CompetitiveData; raw: string; }

export function SecCompetitive({ d, raw }: Props) {
  const [tab, setTab] = useState("overview");
  const competitors = d.competitors || [];
  const comp = competitors.find(c => c.name === tab) ?? null;
  const cols = [T.p1, T.p3, T.p4, T.p5] as const;

  const tabs = [
    { key: "overview", label: "Overview" },
    ...competitors.map(c => ({ key: c.name, label: c.name })),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <TabBar tabs={tabs} active={tab} onSelect={k => setTab(String(k))} />
        <div style={{ padding: "20px 22px" }}>
          {tab === "overview" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* SOV + Market share */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <div style={{ ...TY.cardLabel, marginBottom: 10 }}>Share of Voice</div>
                  {d.sov?.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: cols[i % 4], flexShrink: 0 }} />
                      <div style={{ ...TY.bodyMd, width: 90, flexShrink: 0 }}>{s.brand || s.name}</div>
                      <div style={{ flex: 1, height: 7, background: T.s2, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ width: `${s.pct}%`, height: "100%", background: cols[i % 4], borderRadius: 4 }} />
                      </div>
                      <div style={{ ...TY.bodyMd, fontWeight: 700, color: T.t1, width: 28, textAlign: "right" }}>{s.pct}%</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ ...TY.cardLabel, marginBottom: 10 }}>Market Share</div>
                  {(d.market_share || d.sov || []).map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: cols[i % 4], flexShrink: 0 }} />
                      <div style={{ ...TY.bodyMd, width: 90, flexShrink: 0 }}>{s.brand || s.name}</div>
                      <div style={{ flex: 1, height: 7, background: T.s2, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ width: `${s.pct}%`, height: "100%", background: cols[i % 4], borderRadius: 4 }} />
                      </div>
                      <div style={{ ...TY.bodyMd, fontWeight: 700, color: T.t1, width: 28, textAlign: "right" }}>{s.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent ads — all competitors, shown on overview */}
              {competitors.some(c => (c.recent_ads?.length ?? 0) > 0) && (
                <div>
                  <div style={{ ...TY.cardLabel, color: T.pa, marginBottom: 10 }}>Recent ads — last 30 days</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {competitors.flatMap(c =>
                      (c.recent_ads || []).map((ad, j) => (
                        <div key={`${c.name}-${j}`} style={{ display: "flex", gap: 12, padding: "10px 12px", background: T.s2, borderRadius: 10, alignItems: "flex-start" }}>
                          <div style={{ width: 34, height: 34, borderRadius: 8, background: T.p6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>📱</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                              <span style={{ padding: "2px 8px", background: T.p6, color: T.pa, borderRadius: 6, fontSize: 10, fontWeight: 600 }}>{c.name}</span>
                              <Pill label={ad.platform || "—"} />
                              <Pill label={ad.format || "—"} color={T.p2} />
                            </div>
                            <div style={{ ...TY.bodyMd, marginBottom: 2 }}>{ad.description}</div>
                            <div style={{ ...TY.label, fontStyle: "italic" }}>{ad.angle}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : comp ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.t1 }}>{comp.name}</div>
                <div style={{ ...TY.bodyMd, fontWeight: 700, color: T.pa }}>{comp.est_budget}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: T.s2, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ ...TY.cardLabel, marginBottom: 3 }}>SOV</div>
                  <div style={{ ...TY.numLg, color: T.p1 }}>{comp.sov_pct || "—"}%</div>
                </div>
                <div style={{ background: T.s2, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ ...TY.cardLabel, marginBottom: 3 }}>Market Share</div>
                  <div style={{ ...TY.numLg, color: T.p1 }}>{comp.market_share_pct || "—"}%</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {comp.channels?.map((c, j) => <Pill key={j} label={c} />)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <div style={{ ...TY.cardLabel, color: T.pa, marginBottom: 6 }}>Strengths</div>
                  {comp.strengths?.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5, alignItems: "flex-start" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.pa, marginTop: 5, flexShrink: 0 }} />
                      <div style={{ ...TY.bodyMd }}>{s}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ ...TY.cardLabel, marginBottom: 6 }}>Weaknesses</div>
                  {comp.weaknesses?.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5, alignItems: "flex-start" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.t4, marginTop: 5, flexShrink: 0 }} />
                      <div style={{ ...TY.bodyMd }}>{s}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: T.s2, borderRadius: 9, padding: "11px 13px" }}>
                <div style={{ ...TY.cardLabel, marginBottom: 4 }}>Positioning</div>
                <div style={{ ...TY.bodyMd }}>{comp.positioning}</div>
              </div>
              {(comp.recent_ads?.length ?? 0) > 0 && (
                <div>
                  <div style={{ ...TY.cardLabel, color: T.pa, marginBottom: 8 }}>Recent ads — last 30 days</div>
                  {comp.recent_ads.map((ad, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: T.s2, borderRadius: 9, alignItems: "flex-start", marginBottom: 7 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 7, background: T.p6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>📱</div>
                      <div>
                        <div style={{ display: "flex", gap: 5, marginBottom: 4 }}>
                          <Pill label={ad.platform || "—"} />
                          <Pill label={ad.format || "—"} color={T.p2} />
                        </div>
                        <div style={{ ...TY.bodyMd, marginBottom: 2 }}>{ad.description}</div>
                        <div style={{ ...TY.label, fontStyle: "italic" }}>{ad.angle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ ...TY.bodyMd, color: T.t3, textAlign: "center", padding: 20 }}>Select a competitor from the tabs.</div>
          )}
        </div>
      </Card>

      {(d.market_gaps?.length ?? 0) > 0 && (
        <Card>
          <SectionTitle a="Market" b="opportunities" />
          {d.market_gaps.map((g, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 11, alignItems: "flex-start" }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: T.p6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: T.pa, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ ...TY.bodyMd, fontWeight: 600, color: T.t1, marginBottom: 2 }}>{g.title}</div>
                <div style={{ ...TY.bodySm, color: T.t3 }}>{g.description}</div>
              </div>
            </div>
          ))}
        </Card>
      )}

      <FeedbackBar phase="competitive" outputRaw={raw} />
    </div>
  );
}
