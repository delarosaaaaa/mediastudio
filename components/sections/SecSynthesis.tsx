"use client";
import { useEffect, useRef, useState } from "react";
import { C, FS } from "@/lib/tokens";
import { Card, CardLabel, FeedbackBar, Pair, SectionLabel } from "@/components/ui/primitives";
import { ExportPDF } from "@/components/ui/ExportPDF";
import type { SynthesisData, SynthesisRisk, SynthesisRecommendation, SynthesisNextStep, SynthesisOutcome } from "@/lib/types";

// Animated counter
function AnimCounter({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) { el.textContent = value; return; }
    const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
    const suffix = value.match(/[^0-9.]*$/)?.[0] ?? "";
    const timer = setTimeout(() => {
      const dur = 1400; const steps = dur / 16; let cur = 0; const inc = num / steps;
      const t = setInterval(() => {
        cur = Math.min(cur + inc, num);
        el.textContent = prefix + (Number.isInteger(num) ? Math.round(cur).toLocaleString() : cur.toFixed(1)) + suffix;
        if (cur >= num) clearInterval(t);
      }, 16);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return <div ref={ref}>{value}</div>;
}

// Summary typewriter
function SummaryTypewriter({ paragraphs }: { paragraphs: string[] }) {
  const [text, setText] = useState("");
  const full = paragraphs.join("\n\n");
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i < full.length) setText(full.slice(0, ++i));
      else clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [full]);
  return (
    <div style={{ background: C.p900, borderRadius: 14, padding: "18px 22px", marginBottom: 10 }}>
      <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Executive Summary</div>
      <div style={{ fontSize: FS.bodyLg, color: "rgba(255,255,255,.85)", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
        {text}
        <span style={{ display: "inline-block", width: 2, height: 14, background: "rgba(255,255,255,.5)", marginLeft: 2, verticalAlign: "middle", animation: "typing .6s infinite" }} />
      </div>
    </div>
  );
}

// Interactive checklist
function Checklist({ steps }: { steps: SynthesisNextStep[] }) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  return (
    <Card>
      {steps.map((s, i) => {
        const isDone = done[i];
        return (
          <div key={i} onClick={() => setDone(d => ({ ...d, [i]: !d[i] }))}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < steps.length - 1 ? `.5px solid ${C.border}` : "none", cursor: "pointer", opacity: isDone ? .55 : 1, transition: "opacity .2s" }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${isDone ? C.p700 : C.faint}`, background: isDone ? C.p700 : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s" }}>
              {isDone && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <div style={{ flex: 1, fontSize: FS.bodySm, color: C.ink, textDecoration: isDone ? "line-through" : "none" }}>{s.action}</div>
            <div style={{ fontSize: FS.bodyXs, color: C.muted, whiteSpace: "nowrap" }}>{s.owner}</div>
            <div style={{ fontSize: FS.bodyXs, fontWeight: 700, color: C.p700, whiteSpace: "nowrap" }}>{s.timing}</div>
          </div>
        );
      })}
    </Card>
  );
}

// Risk radar (spider chart)
function RiskRadar({ risks }: { risks: SynthesisRisk[] }) {
  const n = Math.min(risks.length, 6);
  const r = 60, cx = 80, cy = 80;
  const pts = risks.slice(0, n).map((_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  });
  const levelVal: Record<string, number> = { high: 90, medium: 55, low: 30 };
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <svg width="160" height="160" viewBox="0 0 160 160" style={{ flexShrink: 0 }}>
        <g transform="translate(80,80)">
          {[r, r * .66, r * .33].map((rr, i) => (
            <polygon key={i} points={Array.from({ length: n }).map((_, j) => { const a = (j / n) * Math.PI * 2 - Math.PI / 2; return `${Math.cos(a) * rr},${Math.sin(a) * rr}`; }).join(" ")} fill="none" stroke={C.border} strokeWidth=".5" />
          ))}
          {Array.from({ length: n }).map((_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return <line key={i} x1="0" y1="0" x2={Math.cos(a) * r} y2={Math.sin(a) * r} stroke={C.border} strokeWidth=".5" />; })}
          <polygon
            points={risks.slice(0, n).map((rs, i) => {
              const a = (i / n) * Math.PI * 2 - Math.PI / 2;
              const rr = ((levelVal[rs.level] ?? 50) / 100) * r;
              return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
            }).join(" ")}
            fill={`${C.p700}25`} stroke={C.p700} strokeWidth="1.5"
          />
          {risks.slice(0, n).map((rs, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            const rr = ((levelVal[rs.level] ?? 50) / 100) * r;
            return (
              <circle key={i} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr} r="5"
                fill={rs.level === "high" ? "#A32D2D" : rs.level === "medium" ? "#BA7517" : C.p600}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }} />
            );
          })}
        </g>
      </svg>
      <div style={{ flex: 1 }}>
        {risks.slice(0, n).map((rs, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, opacity: hovered !== null && hovered !== i ? .4 : 1, transition: "opacity .2s" }}>
            <div style={{ padding: "2px 7px", borderRadius: 20, fontSize: 9, fontWeight: 700, background: rs.level === "high" ? "rgba(186,0,0,.1)" : rs.level === "medium" ? "rgba(186,119,23,.1)" : C.p100, color: rs.level === "high" ? "#A32D2D" : rs.level === "medium" ? "#854F0B" : C.p700, flexShrink: 0, height: "fit-content" }}>{rs.level}</div>
            <div><div style={{ fontSize: FS.bodySm, fontWeight: 500, color: C.ink, marginBottom: 2 }}>{rs.risk}</div><div style={{ fontSize: FS.bodyXs, color: C.muted, fontStyle: "italic" }}>→ {rs.mitigation}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SEC_SYN_TABS = [
  { key: "summary",   label: "Summary"    },
  { key: "outcomes",  label: "Outcomes"   },
  { key: "nextsteps", label: "Next steps" },
] as const;
type SynTab = typeof SEC_SYN_TABS[number]["key"];

export function SecSynthesis({ d, raw, outputs, parsed }: {
  d: SynthesisData; raw: string;
  outputs?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsed?:  Record<string, any>;
}) {
  const [sub, setSub] = useState<SynTab>("summary");
  const paragraphs: string[] = (d.summary_paragraphs && d.summary_paragraphs.length > 0)
    ? d.summary_paragraphs
    : d.summary ? d.summary.split(/\n\n+/).filter(Boolean) : [];

  const outcomes = (d.outcomes || []) as SynthesisOutcome[];
  const risks = (d.risks || []) as SynthesisRisk[];
  const recommendations = (d.recommendations || []) as SynthesisRecommendation[];
  const nextSteps = (d.next_steps || []) as SynthesisNextStep[];

  const outcomeColors = [C.p900, C.p700, C.p600, "#1D9E75", "#BA7517", "#A32D2D"];

  return (
    <div>
      {/* Subtab nav */}
      <div style={{ display: "flex", gap: 2, marginBottom: 18, borderBottom: `.5px solid ${C.border}` }}>
        {SEC_SYN_TABS.map(t => (
          <button key={t.key} onClick={() => setSub(t.key)} style={{
            padding: "6px 14px", border: "none", background: "transparent",
            fontSize: FS.bodySm, fontWeight: sub === t.key ? 700 : 500,
            color: sub === t.key ? C.p700 : C.muted, cursor: "pointer",
            borderBottom: `2px solid ${sub === t.key ? C.p700 : "transparent"}`,
            marginBottom: -1, transition: "color .2s",
          }}>{t.label}</button>
        ))}
      </div>
      <div key={sub} style={{ animation: "slideInRight .3s ease" }}>

      {paragraphs.length > 0 && <SummaryTypewriter paragraphs={paragraphs} />}

      {/* Strategic core */}
      {(d.strategic_core?.length ?? 0)>0 && (
        <div style={{ marginBottom: 10 }}>
          <SectionLabel>Strategic core</SectionLabel>
          <Card>
            {d.strategic_core.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < d.strategic_core.length - 1 ? `.5px solid ${C.border}` : "none", animation: `slideInUp .35s ease ${i * .08}s both` }}>
                <div style={{ width: 22, height: 22, borderRadius: 7, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: FS.bodyXs, fontWeight: 700, color: C.p700, flexShrink: 0 }}>{i + 1}</div>
                <div><div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 3 }}>{s.title}</div><div style={{ fontSize: FS.bodySm, color: C.muted, lineHeight: 1.55 }}>{s.description}</div></div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Outcomes — animated counters */}
      {outcomes.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <SectionLabel>Expected outcomes</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8 }}>
            {outcomes.map((o, i) => (
              <div key={i} style={{ background: C.white, borderRadius: 12, border: `.5px solid ${C.border}`, borderTop: `2px solid ${outcomeColors[i % 6]}`, padding: "12px 14px", animation: `countUp .5s ease ${i * .1}s both` }}>
                <div style={{ fontSize: FS.bodyXs, color: C.muted, marginBottom: 5 }}>{o.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, letterSpacing: "-.5px", lineHeight: 1, marginBottom: 3 }}>
                  <AnimCounter value={o.value} delay={i * 150} />
                </div>
                {o.sub && <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{o.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risks + Recommendations */}
      <Pair
        left={<><SectionLabel>Key risks</SectionLabel>
          <Card><RiskRadar risks={risks} /></Card></>}
        right={<><SectionLabel>Recommendations</SectionLabel>
          <Card style={{ padding: "0 14px" }}>
            {recommendations.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < recommendations.length - 1 ? `.5px solid ${C.border}` : "none" }}>
                <div style={{ width: 3, background: r.priority === "high" ? C.p900 : C.p700, borderRadius: 2, flexShrink: 0, alignSelf: "stretch" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                    <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{r.title}</div>
                    <span style={{ padding: "1px 7px", background: r.priority === "high" ? C.p900 : C.p100, color: r.priority === "high" ? "#fff" : C.p700, borderRadius: 20, fontSize: 9, fontWeight: 700 }}>{r.priority.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.5 }}>{r.description}</div>
                </div>
              </div>
            ))}
          </Card></>}
      />

      {/* Next steps checklist */}
      {nextSteps.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <SectionLabel>Next steps — klik om af te vinken</SectionLabel>
          <Checklist steps={nextSteps} />
        </div>
      )}

      </div>
      {outputs && parsed && <ExportPDF outputs={outputs} parsed={parsed} />}
      <FeedbackBar phase="synthesis" outputRaw={raw} />
    </div>
  );
}
