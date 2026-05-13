"use client";
import { useState } from "react";
import { C, FS, FUNNEL_COLORS } from "@/lib/tokens";
import { Card, KpiCard, CardLabel, Tag, FeedbackBar } from "@/components/ui/primitives";
import { fmtK, fmtN, fmtE, fmtP } from "@/lib/format";
import type { BudgetData, PacingWeek } from "@/lib/types";

const PHASE_COLS = [C.p900, C.p700, C.p600, C.p300];

function getSplit(w: PacingWeek) {
  if (w.stage_split) {
    const total = Object.values(w.stage_split).reduce((a, b) => (a as number) + (b as number), 0) as number;
    if (total > 0.9 && total < 1.1) return w.stage_split;
  }
  const p = (w.phase || "").toLowerCase();
  if (p.includes("burst")) return { awareness: 0.65, consideration: 0.20, conversion: 0.10, retention: 0.05 };
  if (p.includes("peak"))  return { awareness: 0.30, consideration: 0.35, conversion: 0.25, retention: 0.10 };
  return { awareness: 0.15, consideration: 0.25, conversion: 0.40, retention: 0.20 };
}

export function SecBudget({ d, raw }: { d: BudgetData; raw: string }) {
  const [tab, setTab] = useState<"funnel" | "channel">("funnel");
  const [selWeek, setSelWeek] = useState<number | null>(null);
  const weeks  = d.pacing?.weeks || [];
  const maxW   = Math.max(...weeks.map(w => w.budget || 0), 1);
  const BAR_H  = 80;
  const selW   = selWeek !== null ? weeks[selWeek] : null;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 9 }}>
        <KpiCard label="Total budget" value={fmtK(d.total_budget)} />
        <KpiCard label="Net budget"   value={fmtK(d.net_budget)} />
        <KpiCard label="Test budget"  value={fmtK(d.test_budget?.amount)} sub={`${d.test_budget?.pct || 10}% of total`} />
        <KpiCard label="Channels"     value={d.by_channel?.length || "—"} />
      </div>

      {/* Tabbed allocation */}
      <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, overflow: "hidden", marginBottom: 9 }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
          {([["funnel", "By funnel stage"], ["channel", "By channel"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: "11px 18px", fontSize: FS.body, fontWeight: 600,
              color: tab === k ? C.p700 : C.muted, background: "transparent", border: "none",
              borderBottom: `2px solid ${tab === k ? C.p700 : "transparent"}`,
            }}>{l}</button>
          ))}
        </div>
        <div style={{ padding: "14px 18px" }}>
          {tab === "funnel" && d.by_funnel?.map((f, i) => {
            const max = Math.max(...(d.by_funnel || []).map(x => x.budget || 0), 1);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                <div style={{ fontSize: FS.body, color: C.body, width: 110, flexShrink: 0 }}>{f.stage}</div>
                <div style={{ flex: 1, height: 26, borderRadius: 7, background: PHASE_COLS[i % 4], width: `${Math.round((f.budget / max) * 100)}%`, minWidth: 60, display: "flex", alignItems: "center", padding: "0 10px" }}>
                  <span style={{ fontSize: FS.bodySm, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>{fmtK(f.budget)}</span>
                </div>
                <span style={{ fontSize: FS.bodyXs, color: C.muted, width: 28, textAlign: "right" }}>{f.pct}%</span>
              </div>
            );
          })}
          {tab === "channel" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 70px 1fr", gap: 8, paddingBottom: 6, borderBottom: `2px solid ${C.inset}`, marginBottom: 2 }}>
                <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em" }}>Channel</div>
                <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", textAlign: "right" }}>Budget</div>
                <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", paddingLeft: 8 }}>Share</div>
              </div>
              {d.by_channel?.map((ch, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 70px 1fr", gap: 8, alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.inset}` }}>
                  <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{ch.channel}</div>
                  <div style={{ fontSize: FS.body, fontWeight: 800, color: C.p700, textAlign: "right" }}>{fmtK(ch.budget)}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, paddingLeft: 8 }}>
                    <div style={{ flex: 1, height: 5, background: C.inset, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(ch.pct || 0, 100)}%`, height: "100%", background: C.p700, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: FS.bodyXs, color: C.muted, width: 28, textAlign: "right" }}>{ch.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pacing chart */}
      {weeks.length > 0 && (
        <Card>
          <div style={{ fontSize: FS.bodyLg, fontWeight: 800, color: C.ink, marginBottom: 2 }}>Pacing — {d.pacing?.strategy}</div>
          <div style={{ fontSize: FS.bodySm, color: C.muted, marginBottom: 12 }}>{d.pacing?.motivation}</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: BAR_H, marginBottom: 6 }}>
            {weeks.map((w, i) => {
              const split = getSplit(w);
              const totalH = Math.max(Math.round(((w.budget || 0) / maxW) * BAR_H), 4);
              const segs = [
                { key: "awareness",     h: Math.round((split.awareness     || 0) * totalH), col: C.p900 },
                { key: "consideration", h: Math.round((split.consideration || 0) * totalH), col: C.p700 },
                { key: "conversion",    h: Math.round((split.conversion    || 0) * totalH), col: C.p600 },
                { key: "retention",     h: Math.round((split.retention     || 0) * totalH), col: C.p300 },
              ].filter(s => s.h > 0);
              // Fix rounding
              const diff = totalH - segs.reduce((a, s) => a + s.h, 0);
              if (segs.length > 0) segs[0].h += diff;
              return (
                <div key={i} onClick={() => setSelWeek(selWeek === i ? null : i)} style={{
                  flex: 1, height: `${totalH}px`, display: "flex", flexDirection: "column-reverse",
                  cursor: "pointer", borderRadius: "3px 3px 0 0", overflow: "hidden",
                  outline: selWeek === i ? `2px solid ${C.ink}` : "none",
                  opacity: selWeek !== null && selWeek !== i ? 0.4 : 1, transition: "opacity .15s",
                }}>
                  {segs.map(s => <div key={s.key} style={{ height: `${s.h}px`, background: s.col, flexShrink: 0 }} />)}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: FS.bodyXs, color: C.muted, marginBottom: selW ? 8 : 0 }}>
            <span>Week 1</span><span>Week {weeks.length}</span>
          </div>
          {selW && (
            <div style={{ background: C.p100, borderRadius: 9, padding: "10px 14px", borderLeft: `3px solid ${C.p700}`, marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: FS.bodySm, fontWeight: 700, color: C.p700 }}>Week {selW.week}</span>
                <span style={{ fontSize: FS.bodySm, color: C.p600 }}>{selW.phase}</span>
                <span style={{ fontSize: FS.bodyLg, fontWeight: 800, color: C.ink, marginLeft: "auto" }}>{fmtK(selW.budget)}</span>
              </div>
              <div style={{ fontSize: FS.bodySm, color: C.body }}>{selW.focus}</div>
            </div>
          )}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 10 }}>
            {[["Awareness", C.p900], ["Consideration", C.p700], ["Conversion", C.p600], ["Retention", C.p300]].map(([l, col]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: col as string }} />
                <span style={{ fontSize: FS.bodyXs, color: C.muted }}>{l}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <FeedbackBar phase="budget" outputRaw={raw} />
    </div>
  );
}
