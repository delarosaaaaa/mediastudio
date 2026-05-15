"use client";
import { useEffect, useRef } from "react";
import { C, FS, SP, HERO, cardStyle, kpiCardStyle, heroCardStyle, heroLineStyle, labelStyle } from "@/lib/tokens";
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
      el.textContent = pfx + (Number.isInteger(num) ? Math.round(cur).toLocaleString("nl-NL") : cur.toFixed(1)) + sfx;
      if (cur >= num) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [value]);
  return <div ref={ref}>{value}</div>;
}

export function SecBriefing({ d, raw }: { d: BriefingData; raw: string }) {
  const params = d.params ?? {};
  const kpis: [string, string][] = [
    ["Budget",    params.budget   ?? "—"],
    ["Looptijd",  params.duration ?? "—"],
    ["Geografie", params.geo      ?? "—"],
    ["CPA doel",  params.timing   ?? "—"],
  ];

  return (
    <div>
      {/* Variant C — dark hero */}
      <div style={{ background: C.p900, borderRadius: SP.radius, padding: "22px 24px", marginBottom: SP.gap, animation: "slideInUp .35s ease both" }}>
        <div style={{ fontSize: FS.label, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Campaign</div>
        <div style={{ fontSize: FS.hero, fontWeight: 500, color: "#fff", letterSpacing: "-.4px", marginBottom: 8 }}>{d.brand || "—"}</div>
        <div style={{ fontSize: FS.body, color: "rgba(255,255,255,.65)", lineHeight: 1.75 }}>{d.intro}</div>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: SP.gap, marginBottom: SP.gap }}>
        {kpis.map(([l, v], i) => (
          <div key={l} style={{ ...kpiCardStyle(), animation: `slideInUp .4s ease ${i * .07}s both` }}>
            <div style={{ padding: "12px 16px" }}>
              <div style={{ ...labelStyle, marginBottom: 6 }}>{l}</div>
              <div style={{ fontSize: FS.title, fontWeight: 500, color: C.ink }}><AnimCounter value={v} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* 2-col: goals + KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: SP.gap }}>
        {/* Business doelen */}
        <div style={{ ...cardStyle(), animation: "slideInUp .4s ease .1s both" }}>
          <div style={{ padding: "16px 18px 0" }}>
            <div style={{ ...labelStyle }}>Business doelen</div>
          </div>
          {(d.business_goals || []).map((g, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "12px 18px", borderTop: `.5px solid ${C.border}` }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: FS.label, fontWeight: 700, color: C.p700, flexShrink: 0 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div style={{ fontSize: FS.body, fontWeight: 500, color: C.ink, marginBottom: 2 }}>{g.goal}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{g.target}{g.metric ? ` · ${g.metric}` : ""}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Marketing KPIs */}
        <div style={{ ...cardStyle(), animation: "slideInUp .4s ease .14s both" }}>
          <div style={{ padding: "16px 18px 0" }}>
            <div style={{ ...labelStyle }}>Marketing KPIs</div>
          </div>
          {(d.marketing_goals || []).map((g, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 18px", borderTop: `.5px solid ${C.border}` }}>
              <div style={{ fontSize: FS.body, color: C.ink }}>{g.kpi}</div>
              <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{g.target}</div>
            </div>
          ))}
        </div>
      </div>

      <FeedbackBar phase="briefing" outputRaw={raw} />
    </div>
  );
}
