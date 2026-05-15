"use client";
import { useEffect, useRef } from "react";
import { C, FS } from "@/lib/tokens";
import { Card, KpiCard, CardLabel, FeedbackBar } from "@/components/ui/primitives";
import type { BriefingData } from "@/lib/types";

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: string; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) { el.textContent = value; return; }
    const dur = 1200; const step = 16; const steps = dur / step;
    let cur = 0; const inc = num / steps;
    const t = setInterval(() => {
      cur = Math.min(cur + inc, num);
      el.textContent = prefix + (Number.isInteger(num) ? Math.round(cur).toLocaleString() : cur.toFixed(1)) + suffix;
      if (cur >= num) clearInterval(t);
    }, step);
    return () => clearInterval(t);
  }, [value, prefix, suffix]);
  return <div ref={ref} style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{value}</div>;
}

export function SecBriefing({ d, raw }: { d: BriefingData; raw: string }) {
  return (
    <div>
      {/* Hero — animated gradient */}
      <div style={{ background: `linear-gradient(135deg,${C.p900},${C.p700})`, borderRadius: 14, padding: "22px 26px", marginBottom: 10, animation: "slideInUp .4s ease" }}>
        <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 }}>Campaign</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-.5px", marginBottom: 8 }}>{d.brand || "—"}</div>
        <div style={{ fontSize: FS.bodyLg, color: "rgba(255,255,255,.75)", lineHeight: 1.7, maxWidth: 640 }}>{d.intro}</div>
      </div>

      {/* KPI strip — staggered with counters */}
      {d.params?.budget && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 10 }}>
          {([["Budget", d.params.budget], ["Duration", d.params.duration], ["Geography", d.params.geo], ["Timing", d.params.timing]] as [string, string][]).map(([l, v], i) => (
            <div key={l} style={{ background: C.white, borderRadius: 11, boxShadow: C.shadowSm, padding: "12px 14px", borderTop: `2px solid ${C.p700}`, animation: `slideInUp .4s ease ${i * .07}s both` }}>
              <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 }}>{l}</div>
              <AnimatedCounter value={v || "—"} />
            </div>
          ))}
        </div>
      )}

      {/* 2-col */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, alignItems: "stretch" }}>
        <Card fill>
          <CardLabel>Business objectives</CardLabel>
          {d.business_goals?.map((g, i) => (
            <div key={i} style={{ display: "flex", gap: 9, marginBottom: 10, alignItems: "flex-start", animation: `slideInUp .35s ease ${i * .08}s both` }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: FS.bodyXs, fontWeight: 700, color: C.p700, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{g.goal}</div>
                <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{g.target} · {g.metric}</div>
              </div>
            </div>
          ))}
        </Card>
        <Card fill>
          <CardLabel>Marketing KPIs</CardLabel>
          {d.marketing_goals?.map((g, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${C.inset}`, animation: `slideInUp .35s ease ${i * .07}s both` }}>
              <div style={{ fontSize: FS.body, color: C.body }}>{g.kpi}</div>
              <div style={{ fontSize: FS.body, fontWeight: 800, color: C.ink }}>{g.target}</div>
            </div>
          ))}
        </Card>
      </div>
      <FeedbackBar phase="briefing" outputRaw={raw} />
    </div>
  );
}
