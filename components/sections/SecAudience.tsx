"use client";
import { useState } from "react";
import { T, TY } from "@/lib/tokens";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import type { AudienceData, PersonaData, TotalAudienceData, PlatformPresence } from "@/lib/types";

interface Props { d: AudienceData; raw: string; }

export function SecAudience({ d, raw }: Props) {
  const [sel, setSel] = useState(-1); // -1 = total
  const personas = d.personas || [];
  const total    = d.total || null;
  const active   = sel === -1 ? total : personas[sel];
  const isTotal  = sel === -1;
  const platData = active?.platform_presence || [];
  const barriers = d.barriers || [];

  const ta = active as TotalAudienceData;
  const pa = active as PersonaData;

  // Selector tabs
  const tabs = [
    { key: -1, label: "Total audience", icon: "👥" },
    ...personas.map((p, i) => ({ key: i, label: p.name, icon: "👤", sub: p.age })),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Horizontal tab selector */}
      <div style={{ display: "flex", gap: 0, background: T.sur, borderRadius: 14, boxShadow: T.shad, overflow: "hidden" }}>
        {tabs.map(t => {
          const isActive = t.key === sel;
          return (
            <button
              key={t.key}
              onClick={() => setSel(t.key)}
              style={{
                flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                background: isActive ? T.p6 : "transparent",
                borderWidth: 0,
                borderBottom: `2px solid ${isActive ? T.pa : "transparent"}`,
                borderRight: t.key < personas.length - 1 ? `0.5px solid ${T.s3}` : "none",
                cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
              }}
            >
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? T.pa : T.t2, lineHeight: 1.2 }}>{t.label}</span>
              {"sub" in t && t.sub && <span style={{ fontSize: 10, color: T.t3 }}>{t.sub}</span>}
            </button>
          );
        })}
      </div>

      {/* Profile detail card */}
      {active && (
        <Card>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.t1, marginBottom: 3 }}>{active.name || "Total Audience"}</div>
            <div style={{ ...TY.label }}>
              {isTotal ? ta.age_range : pa.age}
              {(isTotal ? ta.jobs : pa.job) ? ` · ${isTotal ? ta.jobs : pa.job}` : ""}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            {[
              ["Income",     active.income],
              ["Education",  active.education],
              ["Living",     active.living_situation],
              ["Media/day",  active.daily_media_hours],
              ["Prime time", active.media_prime_time],
              isTotal ? ["Est. size", ta.size_estimate] : ["Buy trigger", pa.purchase_trigger],
            ].filter(([, v]) => v).map(([l, v]) => (
              <div key={l as string} style={{ background: T.s2, borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ ...TY.cardLabel, marginBottom: 2 }}>{l as string}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.t1, lineHeight: 1.35 }}>{v as string}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
            <div>
              <div style={{ ...TY.cardLabel, color: T.pa, marginBottom: 7 }}>Motivations</div>
              {active.motivations?.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5, alignItems: "flex-start" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.pa, flexShrink: 0, marginTop: 5 }} />
                  <div style={{ ...TY.bodyMd }}>{m}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ ...TY.cardLabel, marginBottom: 7 }}>Pain points</div>
              {active.pain_points?.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5, alignItems: "flex-start" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.t4, flexShrink: 0, marginTop: 5 }} />
                  <div style={{ ...TY.bodyMd }}>{m}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: isTotal && ta.purchase_trigger ? 12 : 0 }}>
            {active.platforms?.map((pl, i) => <Pill key={i} label={pl} />)}
          </div>
          {isTotal && ta.purchase_trigger && (
            <div style={{ marginTop: 10, background: T.p6, borderRadius: 8, padding: "10px 12px", borderLeft: `3px solid ${T.pa}` }}>
              <div style={{ ...TY.cardLabel, color: T.pa, marginBottom: 3 }}>Buy trigger</div>
              <div style={{ ...TY.bodyMd }}>{ta.purchase_trigger}</div>
            </div>
          )}
        </Card>
      )}

      {/* Platform presence — moves with selection */}
      {platData.length > 0 && (
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <SectionTitle a="Platform" b="presence" />
            <div style={{ ...TY.label, background: T.s2, padding: "4px 10px", borderRadius: 20 }}>
              {isTotal ? "Total audience" : (active as PersonaData)?.name}
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${T.s2}` }}>
                <th style={{ ...TY.cardLabel, padding: "7px 10px", textAlign: "left" }}>Platform</th>
                <th style={{ ...TY.cardLabel, padding: "7px 10px", textAlign: "right", color: T.p2 }}>Reach ↑</th>
                <th style={{ ...TY.cardLabel, padding: "7px 10px", textAlign: "right" }}>Selectivity ↑</th>
                <th style={{ ...TY.cardLabel, padding: "7px 10px", textAlign: "center", color: T.pa }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {platData.map((pl, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${T.s2}` }}>
                  <td style={{ padding: "9px 10px", fontWeight: 600, color: T.t1, fontSize: 13 }}>{pl.platform}</td>
                  <td style={{ padding: "9px 10px", textAlign: "right", fontWeight: 700, color: T.p2, fontSize: 13 }}>{pl.reach_index}</td>
                  <td style={{ padding: "9px 10px", textAlign: "right", color: T.t2, fontSize: 13 }}>{pl.selectivity_index}</td>
                  <td style={{ padding: "9px 10px", textAlign: "center", color: T.pa, letterSpacing: "1px", fontSize: 11 }}>{pl.score_label}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 9, padding: "7px 10px", background: T.s2, borderRadius: 7, ...TY.label, lineHeight: 1.6 }}>
            Index 0–100. <strong style={{ color: T.p2 }}>Reach</strong> = platform size within audience. <strong style={{ color: T.t2 }}>Selectivity</strong> = precision for this audience.
          </div>
        </Card>
      )}

      {/* Barriers — moves with selection */}
      {barriers.length > 0 && (
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <SectionTitle a="Barriers" b="& solutions" />
            <div style={{ ...TY.label, background: T.s2, padding: "4px 10px", borderRadius: 20 }}>
              {isTotal ? "Total audience" : (active as PersonaData)?.name}
            </div>
          </div>
          {barriers.map((b, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 24px 1fr", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <div style={{ background: T.s2, borderRadius: 9, padding: "10px 12px", ...TY.bodyMd }}>{b.barrier}</div>
              <div style={{ textAlign: "center", fontSize: 14, color: T.t4 }}>→</div>
              <div style={{ background: T.p6, borderRadius: 9, padding: "10px 12px", ...TY.bodyMd, color: T.p2, borderLeft: `3px solid ${T.pa}` }}>{b.solution}</div>
            </div>
          ))}
        </Card>
      )}

      <FeedbackBar phase="audience" outputRaw={raw} />
    </div>
  );
}
