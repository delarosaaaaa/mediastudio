"use client";
import { useState } from "react";
import { C, FS } from "@/lib/tokens";
import { Card, KpiCard, FeedbackBar, Pair, SectionLabel, BulletItem, Divider } from "@/components/ui/primitives";
import { fmtK } from "@/lib/format";
import type { BudgetData, PacingWeek, OptimisationRule, TestItem } from "@/lib/types";

const PHASE_COLS = [C.p900, C.p700, C.p600, C.p300];

// ─── Budget bar row ───────────────────────────────────────────
function BudgetBar({ label, amount, pct, color, lightText = false }: {
  label: string; amount: string; pct: number; color: string; lightText?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
      <div style={{ fontSize: FS.bodySm, color: C.body, width: 100, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 24, borderRadius: 7, overflow: "hidden" }}>
        <div style={{ width: `${Math.max(pct, 5)}%`, height: "100%", background: color, borderRadius: 7, display: "flex", alignItems: "center", paddingLeft: 10 }}>
          <span style={{ fontSize: FS.bodySm, fontWeight: 500, color: lightText ? C.p900 : "#fff", whiteSpace: "nowrap" }}>{amount}</span>
        </div>
      </div>
      <div style={{ fontSize: FS.bodySm, color: C.muted, width: 28, textAlign: "right", flexShrink: 0 }}>{pct}%</div>
    </div>
  );
}

// ─── 2. Budget allocation ─────────────────────────────────────
function BudgetAllocation({ d }: { d: BudgetData }) {
  const byFunnel  = d.by_funnel  || [];
  const byChannel = d.by_channel || [];
  const rationale = d.budget_rationale || [];

  return (
    <Pair
      left={
        <>
          <SectionLabel>2a — By funnel stage</SectionLabel>
          <Card>
            {byFunnel.map((f, i) => (
              <BudgetBar
                key={i}
                label={f.stage}
                amount={fmtK(f.budget)}
                pct={f.pct}
                color={PHASE_COLS[i % 4]}
                lightText={i === 3}
              />
            ))}
            {rationale.length > 0 && (
              <>
                <Divider />
                <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>Budget rationale</div>
                {rationale.map((r, i) => <BulletItem key={i} text={r} />)}
              </>
            )}
          </Card>
        </>
      }
      right={
        <>
          <SectionLabel>2b — By channel</SectionLabel>
          <Card>
            {byChannel.map((ch, i) => (
              <BudgetBar
                key={i}
                label={ch.channel}
                amount={fmtK(ch.budget)}
                pct={ch.pct}
                color={PHASE_COLS[i % 4]}
                lightText={PHASE_COLS[i % 4] === C.p300}
              />
            ))}
          </Card>
        </>
      }
    />
  );
}

// ─── 3. Pacing strategy ───────────────────────────────────────
function PacingStrategy({ d }: { d: BudgetData }) {
  const [selWeek, setSelWeek] = useState<number | null>(null);
  const weeks  = d.pacing?.weeks || [];
  const phases = d.pacing?.phases || [];
  const maxW   = Math.max(...weeks.map(w => w.budget || 0), 1);
  const BAR_H  = 80;
  const selW   = selWeek !== null ? weeks[selWeek] : null;

  // Determine bar colour from week phase
  function barColor(w: PacingWeek, idx: number): string {
    const p = (w.phase || "").toLowerCase();
    if (p.includes("burst") || p.includes("awareness")) return C.p900;
    if (p.includes("peak") || p.includes("performance")) return C.p700;
    return C.p600;
  }

  return (
    <div style={{ marginBottom: 10 }}>
      <SectionLabel>3 — Pacing strategy</SectionLabel>
      <Card>
        {/* Chart */}
        {weeks.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: BAR_H, marginBottom: 6 }}>
              {weeks.map((w, i) => {
                const h       = Math.max(Math.round(((w.budget || 0) / maxW) * BAR_H), 4);
                const col     = barColor(w, i);
                const isSel   = selWeek === i;
                const dimmed  = selWeek !== null && !isSel;
                return (
                  <div
                    key={i}
                    onClick={() => setSelWeek(isSel ? null : i)}
                    style={{
                      flex: 1, height: `${h}px`, background: col,
                      borderRadius: "3px 3px 0 0", cursor: "pointer",
                      outline: isSel ? `2px solid ${C.ink}` : "none",
                      opacity: dimmed ? 0.35 : 1, transition: "opacity .15s",
                    }}
                  />
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: FS.bodyXs, color: C.muted, marginBottom: selW ? 10 : 0 }}>
              <span>Week 1</span><span>Week {weeks.length}</span>
            </div>
            {selW && (
              <div style={{ background: C.p100, borderRadius: 9, padding: "10px 14px", borderLeft: `3px solid ${C.p700}`, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: FS.bodySm, fontWeight: 700, color: C.p700 }}>Week {selW.week}</span>
                  <span style={{ fontSize: FS.bodySm, color: C.p600 }}>{selW.phase}</span>
                  <span style={{ fontSize: FS.bodyLg, fontWeight: 500, color: C.ink, marginLeft: "auto" }}>{fmtK(selW.budget)}</span>
                </div>
                <div style={{ fontSize: FS.bodySm, color: C.body }}>{selW.focus}</div>
              </div>
            )}
          </>
        )}

        {/* Legend */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: phases.length > 0 ? 12 : 0 }}>
          {[[C.p900, "Awareness burst"], [C.p700, "Peak performance"], [C.p600, "Always-on"]].map(([col, lbl]) => (
            <div key={lbl as string} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: col as string }} />
              <span style={{ fontSize: FS.bodyXs, color: C.muted }}>{lbl as string}</span>
            </div>
          ))}
        </div>

        {/* Phase descriptions */}
        {phases.length > 0 && (
          <>
            <Divider />
            {phases.map((ph, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: i < phases.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
                <span style={{ padding: "3px 9px", background: C.p100, color: ph.color || C.p700, borderRadius: 20, fontSize: FS.bodyXs, fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {ph.weeks}
                </span>
                <div style={{ fontSize: FS.bodySm, color: C.muted, lineHeight: 1.55 }}>{ph.description}</div>
              </div>
            ))}
          </>
        )}
      </Card>
    </div>
  );
}

// ─── 4. Optimisation logic ────────────────────────────────────
function OptimisationLogic({ rules }: { rules: OptimisationRule[] }) {
  return (
    <Card style={{ padding: "0 16px" }}>
      {rules.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: i < rules.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
            {r.icon}
          </div>
          <div>
            <div style={{ fontSize: FS.body, fontWeight: 500, color: C.ink, marginBottom: 2 }}>{r.title}</div>
            <div style={{ fontSize: FS.bodySm, color: C.muted, lineHeight: 1.5 }}>{r.desc}</div>
          </div>
        </div>
      ))}
    </Card>
  );
}

// ─── 5. Test & learning agenda ────────────────────────────────
function TestAgenda({ items, testBudget, refreshWeek }: {
  items: TestItem[]; testBudget?: string; refreshWeek?: number;
}) {
  return (
    <Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 10 }}>
        {items.map((t, i) => (
          <div key={i} style={{ background: C.inset, borderRadius: 9, padding: "11px 13px" }}>
            <div style={{ fontSize: FS.bodyXs, fontWeight: 500, color: C.p700, marginBottom: 5 }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div style={{ fontSize: FS.body, fontWeight: 500, color: C.ink, marginBottom: 6 }}>{t.title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
              <span style={{ padding: "2px 8px", background: C.white, border: `0.5px solid ${C.border}`, borderRadius: 20, fontSize: FS.bodyXs, color: C.body }}>{t.option_a}</span>
              <span style={{ fontSize: FS.bodyXs, color: C.muted }}>vs</span>
              <span style={{ padding: "2px 8px", background: C.white, border: `0.5px solid ${C.border}`, borderRadius: 20, fontSize: FS.bodyXs, color: C.body }}>{t.option_b}</span>
            </div>
          </div>
        ))}
      </div>
      {testBudget && (
        <div style={{ paddingTop: 10, borderTop: `0.5px solid ${C.border}`, fontSize: FS.bodySm, color: C.muted, lineHeight: 1.6 }}>
          Test budget: <span style={{ fontWeight: 500, color: C.ink }}>{testBudget}</span>
          {refreshWeek && ` — results inform week ${refreshWeek} creative and targeting refresh across all active channels.`}
        </div>
      )}
    </Card>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export function SecBudget({ d, raw }: { d: BudgetData; raw: string }) {
  const optRules  = (d.optimisation_rules || []) as OptimisationRule[];
  const testItems = (d.test_items         || []) as TestItem[];

  return (
    <div>

      {/* 1. Budget overview */}
      <div style={{ marginBottom: 10 }}>
        <SectionLabel>1 — Budget overview</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          <KpiCard label="Total budget"       value={fmtK(d.total_budget)} />
          <KpiCard label="Net media budget"   value={fmtK(d.net_budget)} />
          <KpiCard label="Test & optimisation" value={fmtK(d.test_budget?.amount)} sub={`${d.test_budget?.pct || 10}% of total`} />
          <KpiCard label="Active channels"    value={d.by_channel?.length || "—"} />
        </div>
      </div>

      {/* 2. Budget allocation — pair */}
      <div style={{ marginBottom: 10 }}>
        <BudgetAllocation d={d} />
      </div>

      {/* 3. Pacing strategy — full width */}
      <PacingStrategy d={d} />

      {/* 4 + 5 — pair */}
      {(optRules.length > 0 || testItems.length > 0) && (
        <Pair
          left={<>{optRules.length > 0 && <><SectionLabel>4 — Optimisation logic</SectionLabel><OptimisationLogic rules={optRules} /></>}</>}
          right={<>{testItems.length > 0 && <><SectionLabel>5 — Test & learning agenda</SectionLabel><TestAgenda items={testItems} testBudget={fmtK(d.test_budget?.amount)} refreshWeek={d.test_budget?.refresh_week} /></>}</>}
        />
      )}

      <FeedbackBar phase="budget" outputRaw={raw} />
    </div>
  );
}
