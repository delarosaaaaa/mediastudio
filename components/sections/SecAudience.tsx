"use client";
import { useState } from "react";
import { C, FS } from "@/lib/tokens";
import { Card, CardLabel, FeedbackBar } from "@/components/ui/primitives";
import type { AudienceData, PersonaData, TotalAudienceData } from "@/lib/types";

function radarPoints(vals: number[], r: number, n: number) {
  return vals.map((v, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const rr = (v / 100) * r;
    return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
  }).join(" ");
}

function RadarMini({ dims, color }: { dims: number[]; color: string }) {
  const n = dims.length; const r = 32;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <g transform="translate(36,36)">
        {[r, r * .75, r * .5, r * .25].map((rr, i) => (
          <polygon key={i} points={Array.from({ length: n }).map((_, j) => { const a = (j / n) * Math.PI * 2 - Math.PI / 2; return `${Math.cos(a) * rr},${Math.sin(a) * rr}`; }).join(" ")} fill="none" stroke={C.border} strokeWidth=".5" />
        ))}
        {Array.from({ length: n }).map((_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return <line key={i} x1="0" y1="0" x2={Math.cos(a) * r} y2={Math.sin(a) * r} stroke={C.border} strokeWidth=".5" />; })}
        <polygon points={radarPoints(dims, r, n)} fill={color} opacity=".25" stroke={color} strokeWidth="1.5" />
        {dims.map((d, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; const rr = (d / 100) * r; return <circle key={i} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr} r="3" fill={color} />; })}
      </g>
    </svg>
  );
}

function Avatar({ name, size = 48 }: { name: string; size?: number }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `hsl(${hue},30%,88%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * .34, fontWeight: 700, color: `hsl(${hue},45%,28%)`, flexShrink: 0, border: `1.5px solid hsl(${hue},25%,78%)` }}>
      {initials}
    </div>
  );
}

const DIMS = ["Fee-pijn", "Switch", "Digital", "Prijs", "App"];
const PERSONA_COLS = [C.p900, C.p700, C.p600];

function PersonaCard({ p, index }: { p: PersonaData; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const col = PERSONA_COLS[index % 3];
  const dims = [
    Math.min(100, Math.max(40, 60 + (p.pain_points?.length ?? 0) * 8)),
    Math.min(100, Math.max(40, 55 + (p.motivations?.length ?? 0) * 7)),
    Math.min(100, Math.max(50, 70 + index * 5)),
    Math.min(100, Math.max(45, 65 + index * 4)),
    Math.min(100, Math.max(50, 60 + (p.platforms?.length ?? 0) * 5)),
  ];

  return (
    <div
      onClick={() => setFlipped(f => !f)}
      style={{ perspective: 800, height: 240, cursor: "pointer", animation: `flipIn .4s ease ${index * .1}s both` }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", transition: "transform .5s cubic-bezier(.4,0,.2,1)", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "none" }}>
        {/* Front */}
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: C.white, borderRadius: 16, border: `.5px solid ${C.border}`, padding: 16, display: "flex", flexDirection: "column" }}>
          {p.recommended && <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: col, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>★ Recommended</div>}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <Avatar name={p.name} size={44} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, marginBottom: 2 }}>{p.name}</div>
              <div style={{ fontSize: FS.bodySm, color: C.muted }}>{p.age}{p.job ? ` · ${p.job}` : ""}</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
            <RadarMini dims={dims} color={col} />
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
            {p.platforms?.slice(0, 3).map((pl, i) => (
              <span key={i} style={{ padding: "2px 8px", background: C.inset, borderRadius: 20, fontSize: FS.bodyXs, color: C.body }}>{pl}</span>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: FS.bodyXs, color: C.faint, textAlign: "center" }}>Klik voor pain points →</div>
        </div>
        {/* Back */}
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: col, borderRadius: 16, padding: 16, transform: "rotateY(180deg)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Pain points</div>
          {p.pain_points?.slice(0, 3).map((pp, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,.4)", marginTop: 6, flexShrink: 0 }} />
              <div style={{ fontSize: FS.bodySm, color: "rgba(255,255,255,.85)", lineHeight: 1.5 }}>{pp}</div>
            </div>
          ))}
          {p.trigger_moments && p.trigger_moments.length > 0 && (
            <div style={{ marginTop: 10, padding: "8px 10px", background: "rgba(255,255,255,.1)", borderRadius: 8 }}>
              <div style={{ fontSize: FS.bodyXs, color: "rgba(255,255,255,.5)", marginBottom: 3 }}>Trigger moment</div>
              <div style={{ fontSize: FS.bodySm, color: "rgba(255,255,255,.8)" }}>{p.trigger_moments[0]}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GroupAvatar() {
  return (
    <div style={{ display: "flex" }}>
      {[C.p900, C.p700, C.p600].map((col, i) => (
        <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: col, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", marginLeft: i > 0 ? -9 : 0, border: `2px solid ${C.white}` }}>
          {["A", "B", "C"][i]}
        </div>
      ))}
    </div>
  );
}

export function SecAudience({ d, raw }: { d: AudienceData; raw: string }) {
  const [view, setView] = useState<"overview" | "personas">("overview");
  const personas = d.personas || [];
  const t = d.total as TotalAudienceData;

  return (
    <div>
      {/* Toggle */}
      <div style={{ display: "inline-flex", gap: 2, background: C.inset, borderRadius: 9, padding: 3, marginBottom: 16 }}>
        {(["overview", "personas"] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{ padding: "6px 16px", borderRadius: 7, border: "none", fontSize: FS.bodySm, fontWeight: 600, background: view === v ? C.white : "transparent", color: view === v ? C.ink : C.muted, boxShadow: view === v ? C.shadowSm : "none", transition: "all .2s" }}>
            {v === "overview" ? "Total audience" : `Personas (${personas.length})`}
          </button>
        ))}
      </div>

      {/* Overview */}
      {view === "overview" && t && (
        <div>
          <div style={{ background: C.white, borderRadius: 16, boxShadow: C.shadow, border: `.5px solid ${C.border}`, overflow: "hidden", marginBottom: 10, animation: "slideInUp .35s ease" }}>
            <div style={{ padding: "16px 20px 14px", borderBottom: `.5px solid ${C.border}`, display: "flex", alignItems: "center", gap: 14 }}>
              <GroupAvatar />
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 2 }}>Total Audience</div>
                <div style={{ fontSize: FS.body, color: C.muted }}>{t.age_range}{t.jobs ? ` · ${t.jobs}` : ""}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderBottom: `.5px solid ${C.border}` }}>
              {[["Est. size", t.size_estimate], ["Income", t.income], ["Media/day", t.daily_media_hours]].filter(([, v]) => v).map(([l, v], i, arr) => (
                <div key={l as string} style={{ padding: "11px 16px", borderRight: i < arr.length - 1 ? `.5px solid ${C.border}` : "none" }}>
                  <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 3 }}>{l as string}</div>
                  <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink }}>{v as string}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.p600, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>Motivations</div>
                {(t.motivations || []).map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.p600, marginTop: 6, flexShrink: 0 }} />
                    <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.55 }}>{m}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>Pain points</div>
                {(t.pain_points || []).map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.faint, marginTop: 6, flexShrink: 0 }} />
                    <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.55 }}>{m}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personas — flip cards */}
      {view === "personas" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 12 }}>
          {personas.map((p, i) => <PersonaCard key={i} p={p} index={i} />)}
        </div>
      )}

      {/* Barriers */}
      {(d.barriers?.length ?? 0) > 0 && (
        <Card>
          <CardLabel>Barriers & responses</CardLabel>
          {d.barriers.map((b, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 20px 1fr", gap: 8, alignItems: "center", marginBottom: 8, animation: `slideInUp .35s ease ${i * .07}s both` }}>
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
