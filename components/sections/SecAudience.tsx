"use client";
import { useState } from "react";
import { C, FS } from "@/lib/tokens";
import { Card, CardLabel, FeedbackBar } from "@/components/ui/primitives";
import type { AudienceData, PersonaData, TotalAudienceData } from "@/lib/types";

// Initials-based avatar — replaces emoji icons
function Avatar({ name, size = 52 }: { name: string; size?: number }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `hsl(${hue},30%,88%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.34, fontWeight: 700, color: `hsl(${hue},45%,28%)`,
      flexShrink: 0, letterSpacing: "-.02em",
      border: `1.5px solid hsl(${hue},25%,78%)`,
    }}>{initials}</div>
  );
}

// Stacked group avatar for "total audience"
function GroupAvatar() {
  return (
    <div style={{ display: "flex", marginRight: 4 }}>
      {[C.p900, C.p700, C.p600].map((col, i) => (
        <div key={i} style={{
          width: 32, height: 32, borderRadius: "50%", background: col,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: "#fff",
          marginLeft: i > 0 ? -9 : 0, border: `2px solid ${C.white}`, flexShrink: 0,
        }}>
          {["A","B","C"][i]}
        </div>
      ))}
    </div>
  );
}

function BulletList({ items, color }: { items: string[]; color: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: color, marginTop: 6, flexShrink: 0 }} />
          <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.55 }}>{item}</div>
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".07em", marginBottom: 8, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
      {label}
    </div>
  );
}

function PersonaCard({ p, index }: { p: PersonaData; index: number }) {
  return (
    <div style={{ background: C.white, borderRadius: 16, boxShadow: C.shadow, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".08em" }}>
            {String(index + 1).padStart(2, "0")}
          </div>
          {p.recommended && (
            <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.p700, textTransform: "uppercase", letterSpacing: ".08em" }}>
              Recommended
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <Avatar name={p.name} size={50} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 3, letterSpacing: "-.2px" }}>{p.name}</div>
            <div style={{ fontSize: FS.body, color: C.muted }}>{p.age}{p.job ? ` · ${p.job}` : ""}</div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      {(p.income || p.daily_media_hours) && (
        <div style={{ display: "grid", gridTemplateColumns: p.income && p.daily_media_hours ? "1fr 1fr" : "1fr", borderBottom: `1px solid ${C.border}` }}>
          {p.income && (
            <div style={{ padding: "10px 16px", borderRight: p.daily_media_hours ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 3 }}>Income</div>
              <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{p.income}</div>
            </div>
          )}
          {p.daily_media_hours && (
            <div style={{ padding: "10px 16px" }}>
              <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 3 }}>Media/day</div>
              <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{p.daily_media_hours}</div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "0 18px 16px", flex: 1 }}>
        {p.mindset && (
          <>
            <SectionTitle label="Mindset" />
            <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.6 }}>{p.mindset}</div>
          </>
        )}

        {(p.motivations?.length ?? 0)> 0 && (
          <>
            <SectionTitle label="Motivations" />
            <BulletList items={p.motivations} color={C.p600} />
          </>
        )}

        {(p.pain_points?.length ?? 0)> 0 && (
          <>
            <SectionTitle label="Pain points" />
            <BulletList items={p.pain_points} color={C.faint} />
          </>
        )}

        {(p.trigger_moments?.length ?? 0)> 0 && (
          <>
            <SectionTitle label="Trigger moments" />
            <BulletList items={p.trigger_moments} color={C.faint} />
          </>
        )}

        {(p.platforms?.length ?? 0)> 0 && (
          <>
            <SectionTitle label="Media habits" />
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {p.platforms.map((pl, i) => (
                <span key={i} style={{ padding: "3px 10px", background: C.inset, borderRadius: 20, fontSize: FS.bodySm, color: C.body, fontWeight: 500 }}>{pl}</span>
              ))}
            </div>
          </>
        )}

        {(p.trust_builders?.length ?? 0)> 0 && (
          <>
            <SectionTitle label="Trust builders" />
            <BulletList items={p.trust_builders} color={C.faint} />
          </>
        )}
      </div>
    </div>
  );
}

function TotalCard({ t }: { t: TotalAudienceData }) {
  return (
    <div style={{ background: C.white, borderRadius: 16, boxShadow: C.shadow, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 14 }}>
      <div style={{ padding: "16px 20px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 14 }}>
        <GroupAvatar />
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 2, letterSpacing: "-.2px" }}>Total Audience</div>
          <div style={{ fontSize: FS.body, color: C.muted }}>{t.age_range}{t.jobs ? ` · ${t.jobs}` : ""}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderBottom: `1px solid ${C.border}` }}>
        {[["Est. size", t.size_estimate], ["Income", t.income], ["Media/day", t.daily_media_hours]].filter(([, v]) => v).map(([l, v], i, arr) => (
          <div key={l as string} style={{ padding: "11px 16px", borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 3 }}>{l as string}</div>
            <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{v as string}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.p600, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>Motivations</div>
          <BulletList items={t.motivations || []} color={C.p600} />
        </div>
        <div>
          <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>Pain points</div>
          <BulletList items={t.pain_points || []} color={C.faint} />
        </div>
      </div>
    </div>
  );
}

export function SecAudience({ d, raw }: { d: AudienceData; raw: string }) {
  const [view, setView] = useState<"overview" | "personas">("overview");
  const personas = d.personas || [];

  return (
    <div>
      {/* Toggle */}
      <div style={{ display: "inline-flex", gap: 2, background: C.inset, borderRadius: 9, padding: 3, marginBottom: 16 }}>
        {(["overview", "personas"] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "6px 16px", borderRadius: 7, border: "none", fontSize: FS.bodySm, fontWeight: 600,
            background: view === v ? C.white : "transparent",
            color: view === v ? C.ink : C.muted,
            boxShadow: view === v ? C.shadowSm : "none",
          }}>
            {v === "overview" ? "Total audience" : `Personas (${personas.length})`}
          </button>
        ))}
      </div>

      {view === "overview" && d.total && <TotalCard t={d.total as TotalAudienceData} />}

      {view === "personas" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14, marginBottom: 14 }}>
          {personas.map((p, i) => <PersonaCard key={i} p={p} index={i} />)}
        </div>
      )}

      {(d.barriers?.length ?? 0)> 0 && (
        <Card>
          <CardLabel>Barriers & responses</CardLabel>
          {d.barriers.map((b, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 20px 1fr", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <div style={{ background: C.inset, borderRadius: 8, padding: "8px 11px", fontSize: FS.bodySm, color: C.body, lineHeight: 1.55 }}>{b.barrier}</div>
              <div style={{ textAlign: "center", fontSize: FS.body, color: C.faint }}>→</div>
              <div style={{ background: C.p100, borderRadius: 8, padding: "8px 11px", fontSize: FS.bodySm, color: C.p700, lineHeight: 1.55, borderLeft: `2px solid ${C.p700}` }}>{b.solution}</div>
            </div>
          ))}
        </Card>
      )}

      <FeedbackBar phase="audience" outputRaw={raw} />
    </div>
  );
}
