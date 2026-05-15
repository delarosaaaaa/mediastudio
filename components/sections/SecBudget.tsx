"use client";
import { useEffect, useRef, useState } from "react";
import { C, FS } from "@/lib/tokens";
import { KpiCard, Card, CardLabel, FeedbackBar, Pair, SectionLabel } from "@/components/ui/primitives";
import { fmtK } from "@/lib/format";
import type { BudgetData, PacingWeek, OptimisationRule, TestItem } from "@/lib/types";

const PHASE_COLS = [C.p900, C.p700, C.p600, C.p300];

function fmtE(n: number) { return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(n); }

// Treemap budget allocation
function Treemap({ channels }: { channels: BudgetData["by_channel"] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const sorted = [...channels].sort((a, b) => b.budget - a.budget);
  const total = sorted.reduce((s, c) => s + c.budget, 0);

  return (
    <div style={{ display: "flex", gap: 4, height: 90, borderRadius: 10, overflow: "hidden" }}>
      {sorted.map((ch, i) => {
        const flex = (ch.budget / total) * 100;
        const isHov = hovered === ch.channel;
        const col = PHASE_COLS[i % 4];
        const lightText = i >= 3;
        return (
          <div key={i}
            onMouseEnter={() => setHovered(ch.channel)}
            onMouseLeave={() => setHovered(null)}
            style={{ flex, background: col, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, cursor: "pointer", borderRadius: 6, filter: isHov ? "brightness(1.15)" : "none", transform: isHov ? "scaleY(1.05)" : "none", transition: "filter .2s, transform .2s" }}>
            {flex > 8 && <span style={{ fontSize: 9, fontWeight: 700, color: lightText ? "#3C3489" : "rgba(255,255,255,.85)", textAlign: "center" }}>{ch.channel.split(" ")[0]}</span>}
            {flex > 12 && <span style={{ fontSize: 10, fontWeight: 700, color: lightText ? "#3C3489" : "#fff" }}>{fmtK(ch.budget)}</span>}
          </div>
        );
      })}
    </div>
  );
}

// Wave pacing chart
function WavePacing({ weeks }: { weeks: PacingWeek[] }) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const phaseColors: Record<string, string> = { burst: C.p900, peak: C.p700, "always-on": C.p600, retentie: C.p600 };
  const W = 500, H = 70, pad = 10;
  const maxBudget = Math.max(...weeks.map(w => w.budget));
  const pts = weeks.map((w, i) => [pad + i * ((W - pad * 2) / (weeks.length - 1)), H - pad - ((w.budget / maxBudget) * (H - pad * 2))]);

  return (
    <div style={{ position: "relative" }}>
      <svg ref={svgRef} width="100%" height="70" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        {/* Area fill */}
        <path d={`M${pts[0][0]},${H} ${pts.map(p => `L${p[0]},${p[1]}`).join(" ")} L${pts[pts.length - 1][0]},${H} Z`}
          fill={`${C.p700}09`} />
        {/* Line segments colored by phase */}
        {pts.slice(0, -1).map((p, i) => {
          const col = phaseColors[weeks[i].phase?.toLowerCase()] ?? C.p700;
          return <line key={i} x1={p[0]} y1={p[1]} x2={pts[i + 1][0]} y2={pts[i + 1][1]} stroke={col} strokeWidth="2.5" strokeLinecap="round" />;
        })}
        {/* Dots */}
        {pts.map((p, i) => {
          const col = phaseColors[weeks[i].phase?.toLowerCase()] ?? C.p700;
          return (
            <circle key={i} cx={p[0]} cy={p[1]} r="5" fill={col} stroke={C.white} strokeWidth="2"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setTooltip({ text: `W${weeks[i].week} — ${weeks[i].phase} · ${fmtK(weeks[i].budget)} · ${weeks[i].focus}`, x: (p[0] / W) * 100, y: (p[1] / H) * 100 })}
              onMouseLeave={() => setTooltip(null)} />
          );
        })}
      </svg>
      {tooltip && (
        <div style={{ position: "absolute", left: `${tooltip.x}%`, top: `${tooltip.y}%`, transform: "translate(-50%,-120%)", background: C.p900, color: "#fff", fontSize: 9, padding: "5px 9px", borderRadius: 7, whiteSpace: "nowrap", pointerEvents: "none", zIndex: 10 }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
}

// Budget bar
function BudgetBar({ label, amount, pct, color, lightText = false }: { label: string; amount: string; pct: number; color: string; lightText?: boolean }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 150); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", borderBottom: `.5px solid ${C.border}` }}>
      <div style={{ width: 120, fontSize: FS.bodySm, color: C.body, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 6, background: C.inset, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${w}%`, background: color, borderRadius: 3, transition: "width 1s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      <div style={{ fontSize: FS.bodySm, fontWeight: 700, color: C.ink, width: 50, textAlign: "right" }}>{amount}</div>
      <div style={{ fontSize: FS.bodyXs, color: C.muted, width: 30, textAlign: "right" }}>{pct}%</div>
    </div>
  );
}

const SEC_BUDGET_TABS = [
  { key: "allocatie",   label: "Allocatie"    },
  { key: "pacing",      label: "Pacing"       },
  { key: "optimisation",label: "Optimisation" },
] as const;
type BudgetTab = typeof SEC_BUDGET_TABS[number]["key"];

export function SecBudget({ d, raw }: { d: BudgetData; raw: string }) {
  const [sub, setSub] = useState<BudgetTab>("allocatie");
  const byFunnel = d.by_funnel || [];
  const byChannel = d.by_channel || [];
  const weeks = d.pacing?.weeks || [];
  const phases = d.pacing?.phases || [];
  const rationale = d.budget_rationale || [];
  const optRules = (d.optimisation_rules || []) as OptimisationRule[];
  const testItems = (d.test_items || []) as TestItem[];

  return (
    <div>
      {/* Subtab nav */}
      <div style={{ display: "flex", gap: 2, marginBottom: 18, borderBottom: `.5px solid ${C.border}` }}>
        {SEC_BUDGET_TABS.map(t => (
          <button key={t.key} onClick={() => setSub(t.key)} style={{
            padding: "6px 14px", border: "none", background: "transparent",
            fontSize: FS.bodySm, fontWeight: sub === t.key ? 700 : 500,
            color: sub === t.key ? C.p700 : C.muted, cursor: "pointer",
            borderBottom: `2px solid ${sub === t.key ? C.p700 : "transparent"}`,
            marginBottom: -1, transition: "color .2s",
          }}>{t.label}</button>
        ))}
      </div>

      {sub === "allocatie" && (
        <div key="allocatie" style={{ animation: "slideInRight .3s ease" }}>
          {/* KPI strip + treemap + by funnel/channel bars */}
      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 10 }}>
        {[
          ["Total budget", fmtK(d.total_budget)],
          ["Net media", fmtK(d.net_budget)],
          ["Test budget", `${fmtK(d.test_budget?.amount ?? 0)} (${d.test_budget?.pct ?? 0}%)`],
          ["Active channels", String((d.by_channel?.length ?? 0))],
        ].map(([l, v], i) => (
          <div key={l} style={{ background: C.white, borderRadius: 11, boxShadow: C.shadowSm, padding: "12px 14px", borderTop: `2px solid ${C.p700}`, animation: `slideInUp .4s ease ${i * .07}s both` }}>
            <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 }}>{l}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Treemap */}
      {byChannel.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <SectionLabel>Budget allocatie — klik kanaal</SectionLabel>
          <Treemap channels={byChannel} />
        </div>
      )}

      {/* By funnel + by channel bars */}
      <Pair
        left={<><SectionLabel>By funnel stage</SectionLabel>
          <Card>{byFunnel.map((s, i) => (
            <BudgetBar key={i} label={s.stage} amount={fmtK(s.budget)} pct={s.pct} color={PHASE_COLS[i % 4]} />
          ))}</Card></>}
        right={<><SectionLabel>By channel</SectionLabel>
          <Card>{byChannel.slice(0, 5).map((c, i) => (
            <BudgetBar key={i} label={c.channel} amount={fmtK(c.budget)} pct={c.pct} color={PHASE_COLS[i % 4]} />
          ))}</Card></>}
      />

      {/* Wave pacing */}
      {weeks.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <SectionLabel>Pacing wave — hover voor weekdetail</SectionLabel>
          <Card>
            <WavePacing weeks={weeks} />
            <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
              {[["#1A0050", "Burst"], [C.p700, "Peak"], [C.p600, "Always-on"]].map(([col, lbl]) => (
                <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: col }} />
                  <span style={{ fontSize: FS.bodyXs, color: C.muted }}>{lbl}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Optimisation + Test */}
      <Pair
        left={<><SectionLabel>Optimisation rules</SectionLabel>
          <Card style={{ padding: "0 14px" }}>
            {optRules.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < optRules.length - 1 ? `.5px solid ${C.border}` : "none" }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{r.icon}</div>
                <div><div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{r.title}</div><div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.45 }}>{r.desc}</div></div>
              </div>
            ))}
          </Card></>}
        right={<><SectionLabel>Test agenda</SectionLabel>
          <Card>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
              {testItems.map((t, i) => (
                <div key={i} style={{ background: C.inset, borderRadius: 8, padding: "9px 11px" }}>
                  <div style={{ fontSize: FS.bodyXs, color: C.p700, marginBottom: 4 }}>A/B test</div>
                  <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{t.title}</div>
                  <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{t.option_a} vs {t.option_b}</div>
                </div>
              ))}
            </div>
          </Card></>}
      />

              </div>
      )}

      {sub === "pacing" && weeks.length > 0 && (
        <div key="pacing" style={{ animation: "slideInRight .3s ease" }}>
          <SectionLabel>Pacing wave — hover voor weekdetail</SectionLabel>
          <Card style={{ marginBottom: 8 }}>
            <WavePacing weeks={weeks} />
            <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
              {[["#1A0050","Burst"],[C.p700,"Peak"],[C.p600,"Always-on"]].map(([col,lbl]) => (
                <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: col }} />
                  <span style={{ fontSize: FS.bodyXs, color: C.muted }}>{lbl}</span>
                </div>
              ))}
            </div>
          </Card>
          {phases.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 8 }}>
              {phases.map((ph, i) => (
                <div key={i} style={{ background: C.white, borderRadius: 10, boxShadow: C.shadowSm, padding: "12px 14px", borderLeft: `3px solid ${ph.color || C.p700}` }}>
                  <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".07em", marginBottom: 4 }}>{ph.weeks}</div>
                  <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 3 }}>{ph.label}</div>
                  <div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.5 }}>{ph.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {sub === "optimisation" && (
        <div key="optimisation" style={{ animation: "slideInRight .3s ease" }}>
          <Pair
            left={<><SectionLabel>Optimisation rules</SectionLabel>
              <Card style={{ padding: "0 14px" }}>
                {optRules.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < optRules.length - 1 ? `.5px solid ${C.border}` : "none" }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{r.icon}</div>
                    <div><div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{r.title}</div><div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.45 }}>{r.desc}</div></div>
                  </div>
                ))}
              </Card></>}
            right={<><SectionLabel>Test agenda</SectionLabel>
              <Card>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                  {testItems.map((t, i) => (
                    <div key={i} style={{ background: C.inset, borderRadius: 8, padding: "9px 11px" }}>
                      <div style={{ fontSize: FS.bodyXs, color: C.p700, marginBottom: 4 }}>A/B test</div>
                      <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{t.title}</div>
                      <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{t.option_a} vs {t.option_b}</div>
                    </div>
                  ))}
                </div>
              </Card></>}
          />
        </div>
      )}

      <FeedbackBar phase="budget" outputRaw={raw} />
    </div>
  );
}
