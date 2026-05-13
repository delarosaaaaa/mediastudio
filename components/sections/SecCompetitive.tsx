"use client";
import { useState } from "react";
import { C, FS } from "@/lib/tokens";
import { Card, CardLabel, Tag, Bar, FeedbackBar } from "@/components/ui/primitives";
import type { CompetitiveData, Competitor } from "@/lib/types";

const COLS = [C.p900, C.p700, C.p600, C.p300];

function CompetitorDetail({ comp }: { comp: Competitor }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{comp.name}</div>
        <div style={{ fontSize: FS.body, fontWeight: 700, color: C.p700 }}>{comp.est_budget}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <div style={{ background: C.inset, borderRadius: 9, padding: "10px 12px" }}>
          <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 3 }}>SOV</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.p900, lineHeight: 1 }}>{comp.sov_pct || "—"}%</div>
        </div>
        <div style={{ background: C.inset, borderRadius: 9, padding: "10px 12px" }}>
          <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 3 }}>Market share</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.p900, lineHeight: 1 }}>{comp.market_share_pct || "—"}%</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
        {comp.channels?.map((ch, i) => <Tag key={i} label={ch} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 12 }}>
        <div>
          <CardLabel color={C.p600}>Strengths</CardLabel>
          {comp.strengths?.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5, alignItems: "flex-start" }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.p600, marginTop: 5, flexShrink: 0 }} />
              <div style={{ fontSize: FS.bodySm, color: C.body }}>{s}</div>
            </div>
          ))}
        </div>
        <div>
          <CardLabel>Weaknesses</CardLabel>
          {comp.weaknesses?.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5, alignItems: "flex-start" }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.faint, marginTop: 5, flexShrink: 0 }} />
              <div style={{ fontSize: FS.bodySm, color: C.body }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      {comp.positioning && (
        <div style={{ background: C.inset, borderRadius: 8, padding: "9px 11px" }}>
          <CardLabel>Positioning</CardLabel>
          <div style={{ fontSize: FS.body, color: C.body }}>{comp.positioning}</div>
        </div>
      )}
      {comp.recent_ads?.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <CardLabel color={C.p600}>Recent ads</CardLabel>
          {comp.recent_ads.map((ad, i) => (
            <div key={i} style={{ display: "flex", gap: 9, padding: "9px 11px", background: C.inset, borderRadius: 9, alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>📱</div>
              <div>
                <div style={{ display: "flex", gap: 5, marginBottom: 3 }}>
                  <Tag label={ad.platform} /><Tag label={ad.format} />
                </div>
                <div style={{ fontSize: FS.bodySm, color: C.body, marginBottom: 2 }}>{ad.description}</div>
                <div style={{ fontSize: FS.bodyXs, color: C.muted, fontStyle: "italic" }}>{ad.angle}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SecCompetitive({ d, raw }: { d: CompetitiveData; raw: string }) {
  const [tab, setTab] = useState("overview");
  const competitors = d.competitors || [];
  const comp = competitors.find(c => c.name === tab) ?? null;
  const tabs = [{ key: "overview", label: "Overview" }, ...competitors.map(c => ({ key: c.name, label: c.name }))];

  return (
    <div>
      <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, overflow: "hidden", marginBottom: 9 }}>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "12px 16px", fontSize: FS.body, fontWeight: 600,
              color: tab === t.key ? C.p700 : C.muted, background: "transparent", border: "none",
              borderBottom: `2px solid ${tab === t.key ? C.p700 : "transparent"}`, whiteSpace: "nowrap",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "16px 18px" }}>
          {tab === "overview" ? (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16 }}>
                <div>
                  <CardLabel>Share of Voice</CardLabel>
                  {d.sov?.map((s, i) => <Bar key={i} label={s.brand || s.name || ""} pct={s.pct} color={COLS[i % 4]} />)}
                </div>
                <div>
                  <CardLabel>Market Share</CardLabel>
                  {(d.market_share || d.sov || []).map((s, i) => <Bar key={i} label={s.brand || s.name || ""} pct={s.pct} color={COLS[i % 4]} />)}
                </div>
              </div>
              {competitors.some(c => c.recent_ads?.length > 0) && (
                <div>
                  <CardLabel color={C.p600}>Recent ads — all competitors</CardLabel>
                  {competitors.flatMap(c => (c.recent_ads || []).map((ad, j) => (
                    <div key={`${c.name}-${j}`} style={{ display: "flex", gap: 9, padding: "9px 11px", background: C.inset, borderRadius: 9, alignItems: "flex-start", marginBottom: 6 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>📱</div>
                      <div>
                        <div style={{ display: "flex", gap: 5, marginBottom: 3 }}>
                          <Tag label={c.name} /><Tag label={ad.platform} /><Tag label={ad.format} />
                        </div>
                        <div style={{ fontSize: FS.bodySm, color: C.body, marginBottom: 2 }}>{ad.description}</div>
                        <div style={{ fontSize: FS.bodyXs, color: C.muted, fontStyle: "italic" }}>{ad.angle}</div>
                      </div>
                    </div>
                  )))}
                </div>
              )}
            </div>
          ) : comp ? (
            <CompetitorDetail comp={comp} />
          ) : null}
        </div>
      </div>

      {d.market_gaps?.length > 0 && (
        <Card>
          <CardLabel>Market gaps</CardLabel>
          {d.market_gaps.map((g, i) => (
            <div key={i} style={{ display: "flex", gap: 9, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: FS.bodyXs, fontWeight: 700, color: C.p700, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{g.title}</div>
                <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{g.description}</div>
              </div>
            </div>
          ))}
        </Card>
      )}

      <FeedbackBar phase="competitive" outputRaw={raw} />
    </div>
  );
}
