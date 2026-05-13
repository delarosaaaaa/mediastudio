"use client";
import { useState } from "react";
import { T, TY } from "@/lib/tokens";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import type { AudienceData, PersonaData, TotalAudienceData, PlatformPresence } from "@/lib/types";

interface Props { d: AudienceData; raw: string; }

function ProfileDetail({ item, isTotal }: { item: PersonaData | TotalAudienceData | null; isTotal: boolean }) {
  if (!item) return <div style={{ padding: 20, ...TY.bodyMd, color: T.t3 }}>No data available.</div>;
  const total = item as TotalAudienceData;
  return (
    <div style={{ padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.t1, marginBottom: 2 }}>{item.name || "Total Audience"}</div>
          <div style={{ ...TY.label }}>
            {isTotal ? total.age_range : (item as PersonaData).age}
            {(isTotal ? total.jobs : (item as PersonaData).job) ? ` · ${isTotal ? total.jobs : (item as PersonaData).job}` : ""}
          </div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${T.p5},${T.p6})`, border: `2px solid ${T.pa}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isTotal ? 22 : 18, flexShrink: 0 }}>
          {isTotal ? "👥" : "👤"}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 12 }}>
        {[
          ["Income",         item.income],
          ["Education",      item.education],
          ["Living",         item.living_situation],
          ["Media/day",      item.daily_media_hours],
          ["Prime time",     item.media_prime_time],
          isTotal ? ["Size", total.size_estimate] : ["Buy trigger", (item as PersonaData).purchase_trigger],
        ].filter(([, v]) => v).map(([l, v]) => (
          <div key={l} style={{ background: T.s2, borderRadius: 7, padding: "5px 9px" }}>
            <div style={{ ...TY.cardLabel, marginBottom: 1 }}>{l}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.t1 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 9 }}>
        <div>
          <div style={{ ...TY.cardLabel, color: T.pa, marginBottom: 5 }}>Motivations</div>
          {item.motivations?.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 5, marginBottom: 4, alignItems: "flex-start" }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.pa, flexShrink: 0, marginTop: 5 }} />
              <div style={{ ...TY.bodySm }}>{m}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ ...TY.cardLabel, marginBottom: 5 }}>Pain points</div>
          {item.pain_points?.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 5, marginBottom: 4, alignItems: "flex-start" }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.t4, flexShrink: 0, marginTop: 5 }} />
              <div style={{ ...TY.bodySm }}>{m}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {item.platforms?.map((pl, i) => <Pill key={i} label={pl} />)}
      </div>
      {isTotal && total.purchase_trigger && (
        <div style={{ marginTop: 10, background: T.p6, borderRadius: 8, padding: "8px 10px", borderLeft: `3px solid ${T.pa}` }}>
          <div style={{ ...TY.cardLabel, color: T.pa, marginBottom: 3 }}>Buy trigger</div>
          <div style={{ ...TY.bodySm }}>{total.purchase_trigger}</div>
        </div>
      )}
    </div>
  );
}

function PlatformTable({ data, label }: { data: PlatformPresence[]; label: string }) {
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <SectionTitle a="Platform" b="presence" />
        <div style={{ ...TY.label, background: T.s2, padding: "4px 10px", borderRadius: 20 }}>{label}</div>
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
          {data.map((pl, i) => (
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
  );
}

export function SecAudience({ d, raw }: Props) {
  const [sel, setSel] = useState(-1);
  const personas = d.personas || [];
  const total    = d.total || null;
  const active   = sel === -1 ? total : personas[sel];
  const platData = active?.platform_presence || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "108px 1fr" }}>
          <div style={{ background: T.s2, borderRight: `1px solid ${T.s3}`, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 5 }}>
            <div onClick={() => setSel(-1)} style={{ borderLeft: `3px solid ${sel === -1 ? T.pa : "transparent"}`, padding: "7px 7px", background: sel === -1 ? T.p6 : "transparent", borderRadius: "0 8px 8px 0", cursor: "pointer", transition: "all .15s", textAlign: "center" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: sel === -1 ? T.p6 : "rgba(0,0,0,.06)", border: `2px solid ${sel === -1 ? T.pa : T.t4}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, margin: "0 auto 4px" }}>👥</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: sel === -1 ? T.pa : T.t2, lineHeight: 1.3 }}>Total<br />audience</div>
            </div>
            <div style={{ height: 1, background: T.s3, margin: "2px 4px" }} />
            {personas.map((pe, i) => (
              <div key={i} onClick={() => setSel(i)} style={{ borderLeft: `3px solid ${i === sel ? T.pa : "transparent"}`, padding: "7px 7px", background: i === sel ? T.p6 : "transparent", borderRadius: "0 8px 8px 0", cursor: "pointer", transition: "all .15s", textAlign: "center" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: i === sel ? T.p6 : "rgba(0,0,0,.06)", border: `2px solid ${i === sel ? T.pa : T.t4}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, margin: "0 auto 4px" }}>👤</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: i === sel ? T.pa : T.t2 }}>{pe.name}</div>
                <div style={{ fontSize: 9, color: T.t3 }}>{pe.age}</div>
              </div>
            ))}
          </div>
          <ProfileDetail item={active} isTotal={sel === -1} />
        </div>
      </Card>

      {platData.length > 0 && (
        <PlatformTable data={platData} label={sel === -1 ? "Total audience" : personas[sel]?.name} />
      )}

      {d.barriers?.length > 0 && (
        <Card>
          <SectionTitle a="Barriers" b="& solutions" />
          {d.barriers.map((b, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 24px 1fr", gap: 10, alignItems: "center", marginBottom: 8 }}>
              <div style={{ background: T.s2, borderRadius: 9, padding: "9px 11px", ...TY.bodyMd }}>{b.barrier}</div>
              <div style={{ textAlign: "center", fontSize: 14, color: T.t4 }}>→</div>
              <div style={{ background: T.p6, borderRadius: 9, padding: "9px 11px", ...TY.bodyMd, color: T.p2, borderLeft: `3px solid ${T.pa}` }}>{b.solution}</div>
            </div>
          ))}
        </Card>
      )}

      <FeedbackBar phase="audience" outputRaw={raw} />
    </div>
  );
}
