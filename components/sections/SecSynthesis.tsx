"use client";
import { T, TY } from "@/lib/tokens";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import type { SynthesisData } from "@/lib/types";

interface Props { d: SynthesisData; raw: string; }

const PRIO_COL: Record<string, string> = { high: "#1A0050", medium: "#5B21B6", low: "#A855F7" };

export function SecSynthesis({ d, raw }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card style={{ background: `linear-gradient(135deg,${T.p1},${T.p2})` }}>
        <div style={{ ...TY.cardLabel, color: "rgba(255,255,255,.4)", marginBottom: 8 }}>Executive Summary</div>
        <div style={{ ...TY.bodyLg, color: "rgba(255,255,255,.82)" }}>{d.summary}</div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card>
          <SectionTitle a="Strategic" b="core" />
          {d.strategic_core?.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: T.p6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: T.pa, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ ...TY.bodyMd, paddingTop: 3 }}>{s}</div>
            </div>
          ))}
        </Card>
        <Card>
          <SectionTitle a="Risks" b="& assumptions" />
          {d.risks?.map((r, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${T.p4}`, padding: "9px 12px", background: T.s2, borderRadius: "0 9px 9px 0", marginBottom: 9 }}>
              <div style={{ ...TY.bodyMd, fontWeight: 600, color: T.t1, marginBottom: 3 }}>{r.risk}</div>
              <div style={{ ...TY.bodySm, color: T.t3 }}>{r.mitigation}</div>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <SectionTitle a="Recommendations" />
        {d.recommendations?.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < (d.recommendations?.length || 0) - 1 ? `1px solid ${T.s2}` : "none", alignItems: "flex-start" }}>
            <div style={{ width: 4, height: 32, borderRadius: 2, background: PRIO_COL[r.priority] || T.p3, flexShrink: 0, marginTop: 3 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>{r.title}</div>
                <Pill label={(r.priority || "").toUpperCase()} color={PRIO_COL[r.priority] || T.p3} />
              </div>
              <div style={{ ...TY.bodyMd }}>{r.description}</div>
            </div>
          </div>
        ))}
      </Card>

      <Card>
        <SectionTitle a="Next" b="steps" />
        {d.next_steps?.map((s, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr auto auto", gap: 12, alignItems: "center", padding: "11px 0", borderBottom: i < (d.next_steps?.length || 0) - 1 ? `1px solid ${T.s2}` : "none" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.pa }}>{String(i + 1).padStart(2, "0")}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.t1 }}>{s.action}</div>
            <div style={{ ...TY.bodyMd, color: T.t3 }}>{s.owner}</div>
            <div style={{ ...TY.bodySm, fontWeight: 700, color: T.pa, whiteSpace: "nowrap" }}>{s.timing}</div>
          </div>
        ))}
      </Card>

      <FeedbackBar phase="synthesis" outputRaw={raw} />
    </div>
  );
}
