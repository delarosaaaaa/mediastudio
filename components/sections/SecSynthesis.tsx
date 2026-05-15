"use client";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { C, FS } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/primitives";
import { ExportPDF } from "@/components/ui/ExportPDF";
import type { SynthesisData, SynthesisRisk, SynthesisRecommendation, SynthesisNextStep, SynthesisOutcome } from "@/lib/types";

function SubNav({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 2, marginBottom: 20, borderBottom: `.5px solid ${C.border}` }}>
      {tabs.map(t => (<button key={t} onClick={() => onChange(t)} style={{ padding: "6px 16px", border: "none", background: "transparent", fontSize: FS.bodySm, fontWeight: active === t ? 700 : 500, color: active === t ? C.p700 : C.muted, cursor: "pointer", borderBottom: `2px solid ${active === t ? C.p700 : "transparent"}`, marginBottom: -1, transition: "color .2s" }}>{t}</button>))}
    </div>
  );
}
function SCard({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, overflow: "hidden", marginBottom: 10, animation: `slideInUp .4s ease ${delay}s both` }}>{children}</div>;
}
function AnimCounter({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) { el.textContent = value; return; }
    const pfx = value.match(/^[^0-9]*/)?.[0] ?? ""; const sfx = value.match(/[^0-9.]*$/)?.[0] ?? "";
    const tm = setTimeout(() => { let cur = 0; const inc = num / 60; const t = setInterval(() => { cur = Math.min(cur + inc, num); el.textContent = pfx + (Number.isInteger(num) ? Math.round(cur).toLocaleString() : cur.toFixed(1)) + sfx; if (cur >= num) clearInterval(t); }, 16); }, delay);
    return () => clearTimeout(tm);
  }, [value, delay]);
  return <div ref={ref}>{value}</div>;
}
function Typewriter({ paragraphs }: { paragraphs: string[] }) {
  const [text, setText] = useState("");
  const full = paragraphs.join("\n\n");
  useEffect(() => { let i = 0; const t = setInterval(() => { if (i < full.length) setText(full.slice(0, ++i)); else clearInterval(t); }, 16); return () => clearInterval(t); }, [full]);
  return (
    <div style={{ background: C.p900, borderRadius: 14, padding: "18px 22px", marginBottom: 12 }}>
      <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 8 }}>Executive Summary</div>
      <div style={{ fontSize: FS.bodyLg, color: "rgba(255,255,255,.85)", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
        {text}<span style={{ display: "inline-block", width: 2, height: 13, background: "rgba(255,255,255,.5)", marginLeft: 2, verticalAlign: "middle", animation: "typing .6s infinite" }}/>
      </div>
    </div>
  );
}
function RiskRadar({ risks }: { risks: SynthesisRisk[] }) {
  const n = Math.min(risks.length, 6); const r = 56; const cx = 72, cy = 72;
  const lv: Record<string, number> = { high: 90, medium: 55, low: 30 };
  const [hov, setHov] = useState<number|null>(null);
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "16px 18px" }}>
      <svg width="144" height="144" viewBox="0 0 144 144" style={{ flexShrink: 0 }}>
        <g transform="translate(72,72)">
          {[r, r*.66, r*.33].map((rr,i) => <polygon key={i} points={Array.from({length:n}).map((_,j)=>{const a=(j/n)*Math.PI*2-Math.PI/2;return `${Math.cos(a)*rr},${Math.sin(a)*rr}`;}).join(" ")} fill="none" stroke={C.border} strokeWidth=".5"/>)}
          {Array.from({length:n}).map((_,i)=>{const a=(i/n)*Math.PI*2-Math.PI/2;return <line key={i} x1="0" y1="0" x2={Math.cos(a)*r} y2={Math.sin(a)*r} stroke={C.border} strokeWidth=".5"/>;})}
          <polygon points={risks.slice(0,n).map((rs,i)=>{const a=(i/n)*Math.PI*2-Math.PI/2;const rr=((lv[rs.level]??50)/100)*r;return `${Math.cos(a)*rr},${Math.sin(a)*rr}`;}).join(" ")} fill={`${C.p700}25`} stroke={C.p700} strokeWidth="1.5"/>
          {risks.slice(0,n).map((rs,i)=>{const a=(i/n)*Math.PI*2-Math.PI/2;const rr=((lv[rs.level]??50)/100)*r;return <circle key={i} cx={Math.cos(a)*rr} cy={Math.sin(a)*rr} r="5" fill={rs.level==="high"?"#A32D2D":rs.level==="medium"?"#BA7517":C.p600} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} style={{ cursor: "pointer" }}/>;})}
        </g>
      </svg>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {risks.slice(0, n).map((rs, i) => (
          <div key={i} style={{ display: "flex", gap: 8, opacity: hov !== null && hov !== i ? .4 : 1, transition: "opacity .2s" }}>
            <span style={{ padding: "2px 7px", borderRadius: 20, fontSize: 9, fontWeight: 700, background: rs.level === "high" ? "rgba(163,45,45,.12)" : rs.level === "medium" ? "rgba(186,117,23,.1)" : C.p100, color: rs.level === "high" ? "#A32D2D" : rs.level === "medium" ? "#854F0B" : C.p700, flexShrink: 0, height: "fit-content" }}>{rs.level}</span>
            <div><div style={{ fontSize: FS.bodySm, fontWeight: 500, color: C.ink, marginBottom: 2 }}>{rs.risk}</div><div style={{ fontSize: FS.bodyXs, color: C.muted, fontStyle: "italic" }}>→ {rs.mitigation}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
function Checklist({ steps }: { steps: SynthesisNextStep[] }) {
  const [done, setDone] = useState<Record<number,boolean>>({});
  return (
    <div style={{ padding: "0 16px" }}>
      {steps.map((s, i) => {
        const isDone = done[i];
        return (
          <div key={i} onClick={() => setDone(d => ({ ...d, [i]: !d[i] }))}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < steps.length - 1 ? `.5px solid ${C.border}` : "none", cursor: "pointer", opacity: isDone ? .55 : 1, transition: "opacity .2s" }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${isDone ? C.p700 : C.faint}`, background: isDone ? C.p700 : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s" }}>
              {isDone && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <div style={{ flex: 1, fontSize: FS.bodySm, color: C.ink, textDecoration: isDone ? "line-through" : "none" }}>{s.action}</div>
            <div style={{ fontSize: FS.bodyXs, color: C.muted, whiteSpace: "nowrap" }}>{s.owner}</div>
            <div style={{ fontSize: FS.bodyXs, fontWeight: 700, color: C.p700, whiteSpace: "nowrap" }}>{s.timing}</div>
          </div>
        );
      })}
    </div>
  );
}
export function SecSynthesis({ d, raw, outputs, parsed }: {
  d: SynthesisData; raw: string;
  outputs?: Record<string, string>;
  parsed?: Record<string, unknown>;
}) {
  const [sub, setSub] = useState("① Executive summary");
  const tabs = ["① Executive summary", "② Outcomes & risks", "③ Next steps"];
  const paragraphs = d.summary_paragraphs?.length ? d.summary_paragraphs : d.summary ? d.summary.split(/\n\n+/).filter(Boolean) : [];
  const outcomes = (d.outcomes || []) as SynthesisOutcome[];
  const risks = (d.risks || []) as SynthesisRisk[];
  const recs = (d.recommendations || []) as SynthesisRecommendation[];
  const nextSteps = (d.next_steps || []) as SynthesisNextStep[];
  const OCOLS = [C.p900, C.p700, C.p600, "#1D9E75", "#BA7517", "#A32D2D"];

  return (
    <div>
      <SubNav tabs={tabs} active={sub} onChange={setSub} />
      <div key={sub} style={{ animation: "slideInRight .3s ease" }}>

        {sub === tabs[0] && (
          <div>
            {paragraphs.length > 0 && <Typewriter paragraphs={paragraphs} />}
            {(d.strategic_core?.length ?? 0)>0 && (
              <SCard delay={0.1}>
                <div style={{ padding: "14px 16px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>Strategic core</div></div>
                {d.strategic_core.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "11px 16px", borderTop: `.5px solid ${C.border}` }}>
                    <div style={{ width: 22, height: 22, borderRadius: 7, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: FS.bodyXs, fontWeight: 700, color: C.p700, flexShrink: 0 }}>{i+1}</div>
                    <div><div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 3 }}>{s.title}</div><div style={{ fontSize: FS.bodySm, color: C.muted, lineHeight: 1.55 }}>{s.description}</div></div>
                  </div>
                ))}
              </SCard>
            )}
            {recs.length > 0 && (
              <SCard delay={0.15}>
                <div style={{ padding: "14px 16px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>Recommendations</div></div>
                {recs.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 16px", borderTop: `.5px solid ${C.border}` }}>
                    <div style={{ width: 3, background: r.priority === "high" ? C.p900 : C.p700, borderRadius: 2, flexShrink: 0, alignSelf: "stretch" }}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                        <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{r.title}</div>
                        <span style={{ padding: "1px 7px", background: r.priority === "high" ? C.p900 : C.p100, color: r.priority === "high" ? "#fff" : C.p700, borderRadius: 20, fontSize: 9, fontWeight: 700 }}>{r.priority.toUpperCase()}</span>
                      </div>
                      <div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.5 }}>{r.description}</div>
                    </div>
                  </div>
                ))}
              </SCard>
            )}
            {outputs && parsed && <div style={{ marginTop: 10 }}><ExportPDF outputs={outputs} parsed={parsed} /></div>}
          </div>
        )}

        {sub === tabs[1] && (
          <div>
            {outcomes.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 9, marginBottom: 12 }}>
                {outcomes.map((o, i) => (
                  <div key={i} style={{ background: C.white, borderRadius: 12, boxShadow: C.shadow, overflow: "hidden", animation: `slideInUp .35s ease ${i*.08}s both` }}>
                    <div style={{ height: 3, background: OCOLS[i % 6], borderRadius: "12px 12px 0 0" }} />
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ fontSize: FS.bodyXs, color: C.muted, marginBottom: 5 }}>{o.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, letterSpacing: "-.5px", lineHeight: 1, marginBottom: 3 }}><AnimCounter value={o.value} delay={i * 150}/></div>
                      {o.sub && <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{o.sub}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {risks.length > 0 && (
              <SCard delay={0.1}>
                <div style={{ padding: "14px 16px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em" }}>Key risks</div></div>
                <RiskRadar risks={risks} />
              </SCard>
            )}
          </div>
        )}

        {sub === tabs[2] && (
          <div>
            {nextSteps.length > 0 && (
              <SCard delay={0}>
                <div style={{ padding: "14px 16px 0" }}><div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 0 }}>Next steps — klik om af te vinken</div></div>
                <div style={{ padding: "4px 0 10px" }}><Checklist steps={nextSteps} /></div>
              </SCard>
            )}
          </div>
        )}
      </div>
      <FeedbackBar phase="synthesis" outputRaw={raw} />
    </div>
  );
}
