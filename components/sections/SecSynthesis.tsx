"use client";
import { C, FS } from "@/lib/tokens";
import { Card, CardLabel, FeedbackBar } from "@/components/ui/primitives";
import type { SynthesisData } from "@/lib/types";

const PRIO: Record<string, string> = { high: C.p900, medium: C.p700, low: C.p400 };

export function SecSynthesis({ d, raw }: { d: SynthesisData; raw: string }) {
  return (
    <div>
      {/* Executive summary */}
      <div style={{ background: `linear-gradient(135deg,${C.p900},${C.p700})`, borderRadius: 14, padding: "20px 24px", marginBottom: 9 }}>
        <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 7 }}>Executive Summary</div>
        <div style={{ fontSize: FS.bodyLg, color: "rgba(255,255,255,.82)", lineHeight: 1.7 }}>{d.summary}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 0 }}>
        <Card>
          <CardLabel>Strategic core</CardLabel>
          {d.strategic_core?.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 9, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: FS.bodyXs, fontWeight: 700, color: C.p700, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.6, paddingTop: 2 }}>{s}</div>
            </div>
          ))}
        </Card>
        <Card>
          <CardLabel>Risks & assumptions</CardLabel>
          {d.risks?.map((r, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${C.p400}`, padding: "8px 11px", background: C.inset, borderRadius: "0 8px 8px 0", marginBottom: 8 }}>
              <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, marginBottom: 3 }}>{r.risk}</div>
              <div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.55 }}>{r.mitigation}</div>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <CardLabel>Recommendations</CardLabel>
        {d.recommendations?.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "11px 0", borderBottom: i < (d.recommendations?.length || 0) - 1 ? `1px solid ${C.inset}` : "none", alignItems: "flex-start" }}>
            <div style={{ width: 3, height: 28, borderRadius: 2, background: PRIO[r.priority] || C.p600, flexShrink: 0, marginTop: 3 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{r.title}</div>
                <span style={{ padding: "2px 8px", background: (PRIO[r.priority] || C.p600) + "18", color: PRIO[r.priority] || C.p600, borderRadius: 20, fontSize: FS.cardLabel, fontWeight: 700 }}>
                  {(r.priority || "").toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.6 }}>{r.description}</div>
            </div>
          </div>
        ))}
      </Card>

      {d.next_steps?.length > 0 && (
        <Card>
          <CardLabel>Next steps</CardLabel>
          {d.next_steps.map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "22px 1fr auto auto", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: i < d.next_steps.length - 1 ? `1px solid ${C.inset}` : "none" }}>
              <div style={{ fontSize: FS.bodySm, fontWeight: 700, color: C.p700 }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{s.action}</div>
              <div style={{ fontSize: FS.bodySm, color: C.muted }}>{s.owner}</div>
              <div style={{ fontSize: FS.bodyXs, fontWeight: 700, color: C.p700, whiteSpace: "nowrap" }}>{s.timing}</div>
            </div>
          ))}
        </Card>
      )}

      <FeedbackBar phase="synthesis" outputRaw={raw} />
    </div>
  );
}
