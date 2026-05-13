"use client";
import { useState } from "react";
import { T, TY } from "@/lib/tokens";
import { KpiCard } from "@/components/ui/KpiCard";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import { fmtK } from "@/lib/format";
import type { BudgetData } from "@/lib/types";

interface Props { d: BudgetData; raw: string; }

function getStageSplit(week: { stage_split?: Record<string, number>; phase?: string }): Record<string, number> {
  if (week.stage_split) {
    const total = Object.values(week.stage_split).reduce((a, b) => a + b, 0);
    if (total > 0.9 && total < 1.1) return week.stage_split;
  }
  const p = (week.phase || "").toLowerCase();
  if (p.includes("burst") || p.includes("launch")) return { awareness: 0.65, consideration: 0.20, conversion: 0.10, retention: 0.05 };
  if (p.includes("peak") || p.includes("piek"))    return { awareness: 0.30, consideration: 0.35, conversion: 0.25, retention: 0.10 };
  return { awareness: 0.15, consideration: 0.25, conversion: 0.40, retention: 0.20 };
}

const STAGE_COLS: Record<string, string> = {
  awareness:     T.p1,
  consideration: T.p2,
  conversion:    T.p3,
  retention:     T.p5,
};

const CARD = { background: T.sur, borderRadius: 12, padding: "16px 18px", boxShadow: T.shad };

export function SecBudget({ d, raw }: Props) {
  const [selWeek,   setSelWeek]   = useState<number | null>(null);
  const [budgetTab, setBudgetTab] = useState<"channel" | "funnel">("channel");

  const byChannel = d.by_channel || [];
  const byFunnel  = d.by_funnel  || [];
  const weeks     = d.pacing?.weeks || [];

  if (!byChannel.length && !weeks.length) return (
    <div style={{ ...CARD, textAlign: "center", fontSize: 12, color: T.t3, padding: 28 }}>No budget data — please retry.</div>
  );

  const maxW      = Math.max(...weeks.map(w => w.budget || 0), 1);
  const BAR_H     = 96;
  const selW      = selWeek !== null ? weeks[selWeek] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        <KpiCard label="Total budget" value={fmtK(d.total_budget)} />
        <KpiCard label="Net budget"   value={fmtK(d.net_budget)} />
        <KpiCard label="Test budget"  value={fmtK(d.test_budget?.amount)} sub={`${d.test_budget?.pct || 10}% of total`} />
        <KpiCard label="Channels"     value={byChannel.length || "—"} />
      </div>

      {/* Tabbed breakdown */}
      <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${T.s3}` }}>
          {(["channel", "funnel"] as const).map(tab => (
            <button key={tab} onClick={() => setBudgetTab(tab)} style={{
              padding: "11px 18px", fontSize: 12, fontWeight: 600,
              color: budgetTab === tab ? T.pa : T.t3,
              background: "transparent", borderWidth: 0,
              borderBottom: `2px solid ${budgetTab === tab ? T.pa : "transparent"}`,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              {tab === "channel" ? "By channel" : "By funnel stage"}
            </button>
          ))}
        </div>
        <div style={{ padding: "14px 18px" }}>
          {budgetTab === "channel" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 70px 1fr", gap: 8, paddingBottom: 7, borderBottom: `2px solid ${T.s2}`, marginBottom: 2 }}>
                <div style={{ ...TY.cardLabel }}>Channel</div>
                <div style={{ ...TY.cardLabel, textAlign: "right" }}>Budget</div>
                <div style={{ ...TY.cardLabel, paddingLeft: 8 }}>Share</div>
              </div>
              {byChannel.map((c, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 70px 1fr", gap: 8, alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${T.s2}` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.t1 }}>{c.channel || "—"}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.pa, textAlign: "right" }}>{fmtK(c.budget)}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, paddingLeft: 8 }}>
                    <div style={{ flex: 1, height: 5, background: T.s2, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(c.pct || 0, 100)}%`, height: "100%", background: T.p2, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 10, color: T.t3, width: 28, textAlign: "right" }}>{c.pct || 0}%</span>
                  </div>
                </div>
              ))}
            </>
          )}
          {budgetTab === "funnel" && (
            <>
              {byFunnel.map((f, i) => {
                const maxB = Math.max(...byFunnel.map(x => x.budget || 0), 1);
                const w    = Math.round(((f.budget || 0) / maxB) * 100);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                    <div style={{ fontSize: 12, color: T.t2, width: 110, flexShrink: 0 }}>{f.stage}</div>
                    <div style={{ flex: 1, height: 26 }}>
                      <div style={{ height: "100%", borderRadius: 7, background: [T.p1, T.p2, T.p3, T.p4][i % 4], width: `${w}%`, minWidth: 40, display: "flex", alignItems: "center", padding: "0 10px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>{fmtK(f.budget || 0)}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 10, color: T.t3, width: 28, textAlign: "right" }}>{f.pct || 0}%</span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* Pacing */}
      {weeks.length > 0 && (
        <div style={{ ...CARD }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.t1, marginBottom: 2 }}>
            Pacing — {d.pacing?.strategy || ""}
          </div>
          <div style={{ fontSize: 11, color: T.t3, marginBottom: 12 }}>{d.pacing?.motivation}</div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: BAR_H, marginBottom: 7 }}>
            {weeks.map((w, i) => {
              const weights    = getStageSplit(w);
              const totalH     = Math.max(Math.round(((w.budget || 0) / maxW) * BAR_H), 4);
              const isSelected = selWeek === i;
              const segments   = [
                { key: "awareness",     h: Math.round(weights.awareness     * totalH) },
                { key: "consideration", h: Math.round(weights.consideration * totalH) },
                { key: "conversion",    h: Math.round(weights.conversion    * totalH) },
                { key: "retention",     h: Math.round(weights.retention     * totalH) },
              ].filter(s => s.h > 0);
              const diff = totalH - segments.reduce((a, s) => a + s.h, 0);
              if (segments.length > 0) segments[0].h += diff;
              return (
                <div key={i} onClick={() => setSelWeek(selWeek === i ? null : i)} style={{
                  flex: 1, height: `${totalH}px`, display: "flex", flexDirection: "column-reverse",
                  cursor: "pointer", borderRadius: "3px 3px 0 0", overflow: "hidden",
                  outline: isSelected ? `2px solid ${T.t1}` : "none",
                  opacity: selWeek !== null && !isSelected ? 0.4 : 1,
                  transition: "opacity .15s",
                }}>
                  {segments.map(seg => (
                    <div key={seg.key} style={{ height: `${seg.h}px`, background: STAGE_COLS[seg.key], flexShrink: 0 }} />
                  ))}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.t3, marginBottom: 8 }}>
            <span>Week 1</span><span>Week {weeks.length}</span>
          </div>

          {selW ? (
            <div style={{ background: T.p6, borderRadius: 9, padding: "11px 14px", borderLeft: `3px solid ${T.pa}`, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.pa }}>Week {selW.week}</div>
                <div style={{ fontSize: 11, color: T.p2 }}>{selW.phase}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.t1, marginLeft: "auto" }}>{fmtK(selW.budget)}</div>
              </div>
              <div style={{ fontSize: 11, color: T.t2 }}>{selW.focus}</div>
            </div>
          ) : (
            <div style={{ fontSize: 10, color: T.t3, textAlign: "center", marginBottom: 10 }}>Click a week for details</div>
          )}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {Object.entries(STAGE_COLS).map(([stage, col]) => (
              <div key={stage} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: col }} />
                <span style={{ fontSize: 10, color: T.t3, textTransform: "capitalize" }}>{stage}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <FeedbackBar phase="budget" outputRaw={raw} />
    </div>
  );
}
