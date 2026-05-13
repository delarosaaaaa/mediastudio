"use client";
import { useState } from "react";
import { T, TY } from "@/lib/tokens";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import { fmtK } from "@/lib/format";
import type { BudgetData } from "@/lib/types";

interface Props { d: BudgetData; raw: string; }

function phColor(ph: string): string {
  const s = (ph || "").toLowerCase();
  if (s.includes("burst") || s.includes("launch")) return T.p1;
  if (s.includes("peak") || s.includes("piek") || s.includes("transitie") || s.includes("seizoen")) return T.p2;
  if (s.includes("wind") || s.includes("afbouw") || s.includes("final") || s.includes("eind")) return T.p4;
  return T.p3;
}

export function SecBudget({ d, raw }: Props) {
  const [selWeek, setSelWeek] = useState<number | null>(null);
  const byChannel = d.by_channel || [];
  const byFunnel  = d.by_funnel  || [];
  const weeks     = d.pacing?.weeks || [];

  if (!byChannel.length && !weeks.length) return (
    <Card><div style={{ ...TY.bodyMd, color: T.t3, textAlign: "center", padding: 28 }}>No budget data — please retry.</div></Card>
  );

  const maxW = Math.max(...weeks.map(w => w.budget || 0), 1);
  const selW = selWeek !== null ? weeks[selWeek] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        <KpiCard label="Total budget"  value={fmtK(d.total_budget)} />
        <KpiCard label="Net budget"    value={fmtK(d.net_budget)} />
        <KpiCard label="Test budget"   value={fmtK(d.test_budget?.amount)} sub={`${d.test_budget?.pct || 10}%`} />
        <KpiCard label="Channels"      value={byChannel.length || "—"} />
      </div>

      {byFunnel.length > 0 && (
        <Card>
          <SectionTitle a="Budget" b="by funnel stage" />
          {byFunnel.map((f, i) => {
            const maxB = Math.max(...byFunnel.map(x => x.budget || 0), 1);
            const w    = Math.round(((f.budget || 0) / maxB) * 100);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ ...TY.bodyMd, width: 100, flexShrink: 0 }}>{f.stage}</div>
                <div style={{ flex: 1, height: 26 }}>
                  <div style={{ height: "100%", borderRadius: 7, background: [T.p1, T.p2, T.p3, T.p4][i % 4], width: `${w}%`, minWidth: 40, display: "flex", alignItems: "center", padding: "0 10px" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>{fmtK(f.budget || 0)}</span>
                  </div>
                </div>
                <span style={{ ...TY.label, width: 30, textAlign: "right", flexShrink: 0 }}>{f.pct || 0}%</span>
              </div>
            );
          })}
        </Card>
      )}

      {byChannel.length > 0 && (
        <Card>
          <SectionTitle a="Budget" b="by channel" />
          <div style={{ display: "flex", height: 32, borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
            {byChannel.map((c, i) => {
              const cols = [T.p1, T.p2, T.p3, T.p5, "#D8B4FE"] as const;
              return (
                <div key={i} style={{ width: `${c.pct || 0}%`, background: cols[i % cols.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: i < 3 ? "#fff" : T.p1, overflow: "hidden" }}>
                  {(c.pct || 0) > 8 ? `${c.pct}%` : ""}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {byChannel.map((c, i) => {
              const cols = [T.p1, T.p2, T.p3, T.p5, "#D8B4FE"] as const;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 2, background: cols[i % cols.length] }} />
                  <span style={{ ...TY.bodySm }}>{c.channel}</span>
                  <span style={{ ...TY.bodySm, fontWeight: 600, color: T.t1 }}>{fmtK(c.budget)}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {weeks.length > 0 && (
        <Card>
          <SectionTitle a="Pacing" b={`— ${d.pacing?.strategy || ""}`} sub={d.pacing?.motivation} />
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 90, marginBottom: 8 }}>
            {weeks.map((w, i) => {
              const barH     = Math.max(Math.round((w.budget / maxW) * 90), 4);
              const isSelected = selWeek === i;
              return (
                <div
                  key={i}
                  onClick={() => setSelWeek(selWeek === i ? null : i)}
                  style={{ flex: 1, height: `${barH}px`, borderRadius: "4px 4px 0 0", background: phColor(w.phase || ""), cursor: "pointer", boxShadow: isSelected ? `0 0 0 2px ${T.t1}` : "none", transition: "opacity .15s, box-shadow .1s", opacity: selWeek !== null && !isSelected ? 0.4 : 1 }}
                />
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", ...TY.label, marginBottom: 10 }}>
            <span>Week 1</span><span>Week {weeks.length}</span>
          </div>
          {selW ? (
            <div style={{ background: T.p6, borderRadius: 10, padding: "12px 16px", borderLeft: `3px solid ${T.pa}`, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                <div style={{ ...TY.bodySm, fontWeight: 700, color: T.pa }}>Week {selW.week}</div>
                <div style={{ ...TY.bodySm, fontWeight: 600, color: T.p2 }}>{selW.phase}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: T.t1, marginLeft: "auto" }}>{fmtK(selW.budget)}</div>
              </div>
              <div style={{ ...TY.bodyMd }}>{selW.focus}</div>
            </div>
          ) : (
            <div style={{ ...TY.label, textAlign: "center", padding: "6px 0" }}>Click a week for details</div>
          )}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[...new Set(weeks.map(w => w.phase || ""))].filter(Boolean).map((ph, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: phColor(ph) }} />
                <span style={{ ...TY.bodySm }}>{ph}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {byChannel.length > 0 && (
        <Card>
          <SectionTitle a="Channel" b="budget detail" />
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${T.s2}` }}>
                {["Channel", "Budget", "Share", "Rationale"].map(h => (
                  <th key={h} style={{ ...TY.cardLabel, padding: "7px 10px", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {byChannel.map((c, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${T.s2}` }}>
                  <td style={{ padding: "10px", fontWeight: 600, color: T.t1, fontSize: 13 }}>{c.channel || "—"}</td>
                  <td style={{ padding: "10px", fontWeight: 700, color: T.pa, fontSize: 13 }}>{fmtK(c.budget)}</td>
                  <td style={{ padding: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 52, height: 5, background: T.s2, borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: `${Math.min(c.pct || 0, 100)}%`, height: "100%", background: `linear-gradient(90deg,${T.p1},${T.p3})` }} />
                      </div>
                      <span style={{ ...TY.bodySm }}>{c.pct || 0}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px", ...TY.bodySm, color: T.t3 }}>{c.motivation || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <FeedbackBar phase="budget" outputRaw={raw} />
    </div>
  );
}
