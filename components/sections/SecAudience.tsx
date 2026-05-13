"use client";
import { useState } from "react";
import { T, TY } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import type { AudienceData, PersonaData, TotalAudienceData, PlatformPresence } from "@/lib/types";

interface Props { d: AudienceData; raw: string; }

const CARD = { background: T.sur, borderRadius: 12, padding: "16px 18px", boxShadow: T.shad };

export function SecAudience({ d, raw }: Props) {
  const [sel, setSel] = useState(-1);
  const personas = d.personas || [];
  const total    = d.total || null;
  const isTotal  = sel === -1;
  const active   = isTotal ? total : personas[sel];
  const ta = active as TotalAudienceData;
  const pa = active as PersonaData;
  const platData = active?.platform_presence || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      {/* Tab selector */}
      <div style={{ background: T.sur, borderRadius: 12, overflow: "hidden", boxShadow: T.shad }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${T.s3}` }}>
          {[{ key: -1, label: "Total audience", icon: "👥" }, ...personas.map((p, i) => ({ key: i, label: p.name, icon: "👤", sub: p.age }))].map(t => {
            const isAct = t.key === sel;
            return (
              <button
                key={t.key}
                onClick={() => setSel(t.key)}
                style={{
                  flex: 1, padding: "11px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  background: isAct ? T.p6 : "transparent", borderWidth: 0,
                  borderBottom: `2px solid ${isAct ? T.pa : "transparent"}`,
                  cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                }}
              >
                <span style={{ fontSize: 16 }}>{t.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: isAct ? T.pa : T.t2 }}>{t.label}</span>
                {"sub" in t && t.sub && <span style={{ fontSize: 9, color: T.t3 }}>{t.sub as string}</span>}
              </button>
            );
          })}
        </div>

        {/* Profile detail */}
        {active && (
          <div style={{ padding: "16px 18px" }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.t1, marginBottom: 2 }}>{active.name || "Total Audience"}</div>
              <div style={{ fontSize: 11, color: T.t3 }}>
                {isTotal ? ta.age_range : pa.age}
                {(isTotal ? ta.jobs : pa.job) ? ` · ${isTotal ? ta.jobs : pa.job}` : ""}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 14 }}>
              {[
                ["Income",    active.income],
                ["Education", active.education],
                ["Living",    active.living_situation],
                ["Media/day", active.daily_media_hours],
                ["Prime time",active.media_prime_time],
                isTotal ? ["Est. size", ta.size_estimate] : ["Buy trigger", pa.purchase_trigger],
              ].filter(([, v]) => v).map(([l, v]) => (
                <div key={l as string} style={{ background: T.s2, borderRadius: 7, padding: "7px 9px" }}>
                  <div style={{ ...TY.cardLabel, marginBottom: 2 }}>{l as string}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.t1, lineHeight: 1.3 }}>{v as string}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: isTotal && ta.purchase_trigger ? 12 : 0 }}>
              <div>
                <div style={{ ...TY.cardLabel, color: T.pa, marginBottom: 7 }}>Motivations</div>
                {active.motivations?.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5, alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.pa, flexShrink: 0, marginTop: 5 }} />
                    <div style={{ fontSize: 11, color: T.t2, lineHeight: 1.5 }}>{m}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ ...TY.cardLabel, marginBottom: 7 }}>Pain points</div>
                {active.pain_points?.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5, alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.t4, flexShrink: 0, marginTop: 5 }} />
                    <div style={{ fontSize: 11, color: T.t2, lineHeight: 1.5 }}>{m}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Platforms */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: isTotal && ta.purchase_trigger ? 10 : 0 }}>
              {active.platforms?.map((pl, i) => (
                <span key={i} style={{ padding: "2px 9px", background: T.p6, color: T.p2, borderRadius: 20, fontSize: 10, fontWeight: 600 }}>{pl}</span>
              ))}
            </div>
            {isTotal && ta.purchase_trigger && (
              <div style={{ background: T.p6, borderRadius: 8, padding: "9px 12px", borderLeft: `3px solid ${T.pa}` }}>
                <div style={{ ...TY.cardLabel, color: T.pa, marginBottom: 3 }}>Buy trigger</div>
                <div style={{ fontSize: 11, color: T.t2 }}>{ta.purchase_trigger}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Platform presence */}
      {platData.length > 0 && (
        <div style={{ ...CARD }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ ...TY.cardLabel }}>Platform presence</div>
            <div style={{ fontSize: 10, color: T.t3, background: T.s2, padding: "3px 9px", borderRadius: 20 }}>
              {isTotal ? "Total audience" : (active as PersonaData)?.name}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 55px 55px 55px", gap: 4, alignItems: "center" }}>
            <div style={{ ...TY.cardLabel }}>Platform</div>
            <div style={{ ...TY.cardLabel, color: T.p2, textAlign: "right" }}>Reach</div>
            <div style={{ ...TY.cardLabel, textAlign: "right" }}>Select.</div>
            <div style={{ ...TY.cardLabel, color: T.pa, textAlign: "center" }}>Score</div>
            {platData.map((pl, i) => (
              <>
                <div key={`n${i}`} style={{ fontSize: 12, fontWeight: 600, color: T.t1, padding: "6px 0", borderTop: i > 0 ? `1px solid ${T.s2}` : "none" }}>{pl.platform}</div>
                <div key={`r${i}`} style={{ fontSize: 12, fontWeight: 700, color: T.p2, textAlign: "right", borderTop: i > 0 ? `1px solid ${T.s2}` : "none", padding: "6px 0" }}>{pl.reach_index}</div>
                <div key={`s${i}`} style={{ fontSize: 12, color: T.t2, textAlign: "right", borderTop: i > 0 ? `1px solid ${T.s2}` : "none", padding: "6px 0" }}>{pl.selectivity_index}</div>
                <div key={`sc${i}`} style={{ fontSize: 10, color: T.pa, textAlign: "center", letterSpacing: "1px", borderTop: i > 0 ? `1px solid ${T.s2}` : "none", padding: "6px 0" }}>{pl.score_label}</div>
              </>
            ))}
          </div>
        </div>
      )}

      {/* Barriers */}
      {(d.barriers?.length ?? 0) > 0 && (
        <div style={{ ...CARD }}>
          <div style={{ ...TY.cardLabel, marginBottom: 12 }}>Barriers & solutions</div>
          {d.barriers.map((b, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 20px 1fr", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <div style={{ background: T.s2, borderRadius: 8, padding: "9px 11px", fontSize: 11, color: T.t2, lineHeight: 1.5 }}>{b.barrier}</div>
              <div style={{ textAlign: "center", fontSize: 12, color: T.t4 }}>→</div>
              <div style={{ background: T.p6, borderRadius: 8, padding: "9px 11px", fontSize: 11, color: T.p2, lineHeight: 1.5, borderLeft: `3px solid ${T.pa}` }}>{b.solution}</div>
            </div>
          ))}
        </div>
      )}

      <FeedbackBar phase="audience" outputRaw={raw} />
    </div>
  );
}
