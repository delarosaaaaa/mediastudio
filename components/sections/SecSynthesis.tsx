"use client";
import { C, FS } from "@/lib/tokens";
import { Card, FeedbackBar, SectionCard, Pair, SectionLabel } from "@/components/ui/primitives";
import { ExportPDF } from "@/components/ui/ExportPDF";
import type { SynthesisData, SynthesisRisk, SynthesisRecommendation, SynthesisNextStep, SynthesisOutcome } from "@/lib/types";

const PRIO_COL: Record<string, string> = {
  high:   C.p900,
  medium: C.p700,
  low:    C.p400,
};

// ─── 1. Executive summary ─────────────────────────────────────
function ExecutiveSummary({ d }: { d: SynthesisData }) {
  const paragraphs = d.summary_paragraphs?.length
    ? d.summary_paragraphs
    : d.summary
      ? d.summary.split(/\n\n+/).filter(Boolean)
      : [];

  return (
    <div style={{ background: C.p900, borderRadius: 14, padding: "22px 24px", marginBottom: 10 }}>
      <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>
        {d.campaign_name || "Executive Summary"}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {paragraphs.length > 0
          ? paragraphs.map((p, i) => (
              <div key={i} style={{ fontSize: FS.bodyLg, color: "rgba(255,255,255,.82)", lineHeight: 1.8 }}>{p}</div>
            ))
          : <div style={{ fontSize: FS.bodyLg, color: "rgba(255,255,255,.82)", lineHeight: 1.8 }}>{d.summary}</div>
        }
      </div>
    </div>
  );
}

// ─── 2. Strategic core ────────────────────────────────────────
function StrategicCore({ items }: { items: { title: string; description: string }[] }) {
  return (
    <SectionCard>
      {items.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: i < items.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
          <div style={{ width: 22, height: 22, borderRadius: 7, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: FS.bodySm, fontWeight: 500, color: C.p900, flexShrink: 0, marginTop: 1 }}>
            {i + 1}
          </div>
          <div>
            <div style={{ fontSize: FS.body, fontWeight: 500, color: C.ink, marginBottom: s.description ? 3 : 0 }}>{s.title}</div>
            {s.description && <div style={{ fontSize: FS.bodySm, color: C.muted, lineHeight: 1.5 }}>{s.description}</div>}
          </div>
        </div>
      ))}
    </SectionCard>
  );
}

// ─── 3. Expected outcomes ─────────────────────────────────────
function ExpectedOutcomes({ outcomes }: { outcomes: SynthesisOutcome[] }) {
  return (
    <Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {outcomes.map((o, i) => (
          <div key={i} style={{ background: C.inset, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: FS.bodyXs, fontWeight: 500, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>{o.label}</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: C.ink, lineHeight: 1.1, marginBottom: o.sub ? 3 : 0 }}>{o.value}</div>
            {o.sub && <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{o.sub}</div>}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── 4. Key risks ─────────────────────────────────────────────
function KeyRisks({ risks }: { risks: SynthesisRisk[] }) {
  const levelLabel: Record<string, string> = { high: "High", medium: "Medium", low: "Low" };
  const levelBg:    Record<string, string> = {
    high:   "rgba(186,119,23,.12)",
    medium: C.p100,
    low:    C.inset,
  };
  const levelColor: Record<string, string> = {
    high:   "#854F0B",
    medium: C.p700,
    low:    C.muted,
  };

  return (
    <Card>
      {risks.map((r, i) => {
        const lvl = (r.level || "medium").toLowerCase();
        return (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: i < risks.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
            <span style={{ padding: "2px 8px", background: levelBg[lvl] || C.p100, color: levelColor[lvl] || C.p700, borderRadius: 20, fontSize: FS.bodyXs, fontWeight: 500, flexShrink: 0, whiteSpace: "nowrap" }}>
              {levelLabel[lvl] || "Medium"}
            </span>
            <div>
              <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.5, marginBottom: r.mitigation ? 3 : 0 }}>{r.risk}</div>
              {r.mitigation && (
                <div style={{ fontSize: FS.bodyXs, color: C.muted, fontStyle: "italic" }}>→ {r.mitigation}</div>
              )}
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// ─── 5. Recommendations ───────────────────────────────────────
function Recommendations({ items }: { items: SynthesisRecommendation[] }) {
  return (
    <Card>
      {items.map((r, i) => {
        const col = PRIO_COL[r.priority] || C.p600;
        return (
          <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "10px 0", borderBottom: i < items.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
            <div style={{ width: 3, height: 28, borderRadius: 2, background: col, flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <div style={{ fontSize: FS.body, fontWeight: 500, color: C.ink }}>{r.title}</div>
                <span style={{ padding: "2px 8px", background: col + "18", color: col, borderRadius: 20, fontSize: FS.cardLabel, fontWeight: 700 }}>
                  {(r.priority || "").toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: FS.bodySm, color: C.muted, lineHeight: 1.55 }}>{r.description}</div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// ─── 6. Next steps ────────────────────────────────────────────
function NextSteps({ steps }: { steps: SynthesisNextStep[] }) {
  return (
    <Card>
      {/* Column headers */}
      <div style={{ display: "grid", gridTemplateColumns: "22px 1fr 90px 70px", gap: 12, paddingBottom: 8, borderBottom: `0.5px solid ${C.border}`, marginBottom: 2 }}>
        {["#", "Action", "Owner", "Timing"].map((h, i) => (
          <div key={h} style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", textAlign: i === 3 ? "right" : "left" }}>{h}</div>
        ))}
      </div>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "22px 1fr 90px 70px", gap: 12, alignItems: "center", padding: "9px 0", borderBottom: i < steps.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
          <div style={{ fontSize: FS.bodySm, fontWeight: 500, color: C.p700 }}>{String(i + 1).padStart(2, "0")}</div>
          <div style={{ fontSize: FS.body, fontWeight: 500, color: C.ink }}>{s.action}</div>
          <div style={{ fontSize: FS.bodySm, color: C.muted }}>{s.owner}</div>
          <div style={{ fontSize: FS.bodyXs, fontWeight: 500, color: C.p700, whiteSpace: "nowrap", textAlign: "right" }}>{s.timing}</div>
        </div>
      ))}
    </Card>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export function SecSynthesis({ d, raw, outputs, parsed }: {
  d:        SynthesisData;
  raw:      string;
  outputs?: Record<string, string>;
  parsed?:  Record<string, unknown>;
}) {
  const strategicCore  = (d.strategic_core  || []) as { title: string; description: string }[];
  const outcomes       = (d.outcomes        || []) as SynthesisOutcome[];
  const risks          = (d.risks           || []) as SynthesisRisk[];
  const recommendations = (d.recommendations || []) as SynthesisRecommendation[];
  const nextSteps      = (d.next_steps      || []) as SynthesisNextStep[];

  return (
    <div>

      {/* 1. Executive summary */}
      <div style={{ marginBottom: 10 }}>
        <SectionLabel>1 — Executive summary</SectionLabel>
        <ExecutiveSummary d={d} />
      </div>

      {/* 2 + 3 pair */}
      <Pair
        left={<><SectionLabel>2 — Strategic core</SectionLabel><StrategicCore items={strategicCore} /></>}
        right={<>{outcomes.length > 0 && <><SectionLabel>3 — Expected outcomes</SectionLabel><ExpectedOutcomes outcomes={outcomes} /></>}</>}
      />

      {/* 4 + 5 pair */}
      <Pair
        left={<>{risks.length > 0 && <><SectionLabel>4 — Key risks & assumptions</SectionLabel><KeyRisks risks={risks} /></>}</>}
        right={<>{recommendations.length > 0 && <><SectionLabel>5 — Recommendations</SectionLabel><Recommendations items={recommendations} /></>}</>}
      />

      {/* 6. Next steps — full width */}
      {nextSteps.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <SectionLabel>6 — Next steps</SectionLabel>
          <NextSteps steps={nextSteps} />
        </div>
      )}

      {/* PDF export + feedback */}
      {outputs && parsed && (
        <div style={{ marginBottom: 10 }}>
          <ExportPDF outputs={outputs} parsed={parsed as Record<string, unknown>} />
        </div>
      )}

      <FeedbackBar phase="synthesis" outputRaw={raw} />
    </div>
  );
}
