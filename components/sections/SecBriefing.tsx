"use client";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { C, FS } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/primitives";
import type { BriefingData } from "@/lib/types";

function AnimCounter({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) { el.textContent = value; return; }
    const pfx = value.match(/^[^0-9]*/)?.[0] ?? "";
    const sfx = value.match(/[^0-9.]*$/)?.[0] ?? "";
    let cur = 0; const inc = num / 60;
    const t = setInterval(() => {
      cur = Math.min(cur + inc, num);
      el.textContent = pfx + (Number.isInteger(num) ? Math.round(cur).toLocaleString() : cur.toFixed(1)) + sfx;
      if (cur >= num) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [value]);
  return <div ref={ref}>{value}</div>;
}

function SCard({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, overflow: "hidden", animation: `slideInUp .4s ease ${delay}s both` }}>
      {children}
    </div>
  );
}

function KpiStrip({ items }: { items: [string, string][] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length},1fr)`, gap: 10, marginBottom: 12 }}>
      {items.map(([l, v], i) => (
        <div key={l} style={{ background: C.white, borderRadius: 12, boxShadow: C.shadow, overflow: "hidden", animation: `slideInUp .4s ease ${i * .07}s both` }}>
          <div style={{ padding: "12px 14px" }}>
            <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 5 }}>{l}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}><AnimCounter value={v || "—"} /></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SecBriefing({ d, raw }: { d: BriefingData; raw: string }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: C.p900, borderRadius: 14, padding: "22px 26px", marginBottom: 12, animation: "slideInUp .35s ease" }}>
        <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 6 }}>Campaign</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "-.5px", marginBottom: 8 }}>{d.brand || "—"}</div>
        <div style={{ fontSize: FS.bodyLg, color: "rgba(255,255,255,.7)", lineHeight: 1.75 }}>{d.intro}</div>
      </div>

      {/* KPI strip */}
      {d.params?.budget && (
        <KpiStrip items={[["Budget", d.params.budget], ["Looptijd", d.params.duration], ["Geografie", d.params.geo], ["Timing", d.params.timing]]} />
      )}

      {/* Goals + KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <SCard delay={0.1}>
          <div style={{ padding: "14px 16px 0" }}>
            <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 12 }}>Business doelen</div>
          </div>
          {(d.business_goals || []).map((g, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "12px 16px", borderTop: i > 0 ? `.5px solid ${C.border}` : "none", alignItems: "flex-start" }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: FS.bodyXs, fontWeight: 700, color: C.p700, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{g.goal}</div>
                <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{g.target} · {g.metric}</div>
              </div>
            </div>
          ))}
        </SCard>
        <SCard delay={0.15}>
          <div style={{ padding: "14px 16px 0" }}>
            <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 0 }}>Marketing KPIs</div>
          </div>
          {(d.marketing_goals || []).map((g, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px", borderTop: `.5px solid ${C.border}` }}>
              <div style={{ fontSize: FS.bodySm, color: C.body }}>{g.kpi}</div>
              <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{g.target}</div>
            </div>
          ))}
        </SCard>
      </div>
      <FeedbackBar phase="briefing" outputRaw={raw} />
    </div>
  );
}
