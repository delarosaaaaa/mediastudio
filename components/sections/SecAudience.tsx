"use client";
import { useState } from "react";
import { C, FS } from "@/lib/tokens";
import { Card, CardLabel, Tag, FeedbackBar } from "@/components/ui/primitives";
import type { AudienceData, PersonaData, TotalAudienceData } from "@/lib/types";

export function SecAudience({ d, raw }: { d: AudienceData; raw: string }) {
  const [sel, setSel] = useState(-1);
  const personas = d.personas || [];
  const isTotal  = sel === -1;
  const active   = isTotal ? d.total : personas[sel];
  const ta = active as TotalAudienceData;
  const pa = active as PersonaData;

  const tabs = [
    { key: -1, label: "Total audience", icon: "👥" },
    ...personas.map((p, i) => ({ key: i, label: p.name, icon: "👤" })),
  ];

  return (
    <div>
      {/* Tab selector */}
      <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, overflow: "hidden", marginBottom: 9 }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
          {tabs.map(t => {
            const act = t.key === sel;
            return (
              <button key={t.key} onClick={() => setSel(t.key)} style={{
                flex: 1, padding: "11px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                background: act ? C.p100 : "transparent", border: "none",
                borderBottom: `2px solid ${act ? C.p700 : "transparent"}`,
                color: act ? C.p700 : C.body, fontWeight: act ? 700 : 400,
              }}>
                <span style={{ fontSize: 15 }}>{t.icon}</span>
                <span style={{ fontSize: FS.bodySm }}>{t.label}</span>
              </button>
            );
          })}
        </div>

        {active && (
          <div style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, marginBottom: 2 }}>
              {active.name || "Total Audience"}
            </div>
            <div style={{ fontSize: FS.bodySm, color: C.muted, marginBottom: 12 }}>
              {isTotal ? ta.age_range : pa.age}{(isTotal ? ta.jobs : pa.job) ? ` · ${isTotal ? ta.jobs : pa.job}` : ""}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 12 }}>
              {[["Income", active.income], ["Est. size", isTotal ? ta.size_estimate : ""], ["Media/day", active.daily_media_hours]]
                .filter(([, v]) => v)
                .map(([l, v]) => (
                  <div key={l as string} style={{ background: C.inset, borderRadius: 8, padding: "7px 9px" }}>
                    <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 3 }}>{l as string}</div>
                    <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{v as string}</div>
                  </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.p600, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 7 }}>Motivations</div>
                {active.motivations?.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5, alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.p600, marginTop: 5, flexShrink: 0 }} />
                    <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.5 }}>{m}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 7 }}>Pain points</div>
                {active.pain_points?.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5, alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.faint, marginTop: 5, flexShrink: 0 }} />
                    <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.5 }}>{m}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {active.platforms?.map((pl, i) => <Tag key={i} label={pl} />)}
            </div>
          </div>
        )}
      </div>

      {/* Barriers */}
      {d.barriers?.length > 0 && (
        <Card>
          <CardLabel>Barriers & solutions</CardLabel>
          {d.barriers.map((b, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 18px 1fr", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <div style={{ background: C.inset, borderRadius: 8, padding: "8px 10px", fontSize: FS.bodySm, color: C.body, lineHeight: 1.5 }}>{b.barrier}</div>
              <div style={{ textAlign: "center", fontSize: FS.body, color: C.faint }}>→</div>
              <div style={{ background: C.p100, borderRadius: 8, padding: "8px 10px", fontSize: FS.bodySm, color: C.p700, lineHeight: 1.5, borderLeft: `2px solid ${C.p700}` }}>{b.solution}</div>
            </div>
          ))}
        </Card>
      )}

      <FeedbackBar phase="audience" outputRaw={raw} />
    </div>
  );
}
