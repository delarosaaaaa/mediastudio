"use client";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { C, FS } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/primitives";
import type {
  StrategyData, FunnelStage, Channel, ChannelOverlap,
  MessagingPillar, AudiencePriority, RetargetingRule, SuccessMetric,
} from "@/lib/types";

// ─── Design tokens ────────────────────────────────────────────
const COLS = [C.p900, C.p700, C.p600, C.p300];

// ─── Shared flip card wrapper ─────────────────────────────────
function FlipCard({
  height = 220,
  face,
  back,
  delay = 0,
}: {
  height?: number;
  face: ReactNode;
  back: ReactNode;
  delay?: number;
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped(f => !f)}
      style={{ perspective: 900, height, cursor: "pointer", animation: `slideInUp .4s ease ${delay}s both` }}
    >
      <div style={{
        position: "relative", width: "100%", height: "100%",
        transition: "transform .52s cubic-bezier(.4,0,.2,1)",
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "none",
      }}>
        {/* Face */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          background: C.white, borderRadius: 14, border: `.5px solid ${C.border}`,
          padding: 18, display: "flex", flexDirection: "column",
          transition: "box-shadow .2s, transform .2s",
          boxShadow: "none",
        }}
          onMouseEnter={e => {
            if (!flipped) {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 10px 28px rgba(91,33,182,.11)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            (e.currentTarget as HTMLDivElement).style.transform = "none";
          }}
        >
          {face}
          {/* Flip indicator */}
          <div style={{
            position: "absolute", bottom: 14, right: 14,
            width: 22, height: 22, borderRadius: 7,
            background: C.p100, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 11, color: C.p700,
            transition: "background .2s",
          }}>⟳</div>
        </div>
        {/* Back */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          background: C.p900, borderRadius: 14, border: `.5px solid ${C.p700}`,
          padding: 16, display: "flex", flexDirection: "column",
          transform: "rotateY(180deg)",
        }}>
          {back}
          <div
            onClick={e => { e.stopPropagation(); setFlipped(false); }}
            style={{ marginTop: "auto", paddingTop: 8, borderTop: ".5px solid rgba(255,255,255,.1)", fontSize: 10, color: "rgba(255,255,255,.35)", textAlign: "center", cursor: "pointer" }}
          >↩ Terug</div>
        </div>
      </div>
    </div>
  );
}

// Back content helper
function BackBlock({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: "8px 10px", background: "rgba(255,255,255,.06)", borderRadius: 8, border: ".5px solid rgba(255,255,255,.1)", marginBottom: 6 }}>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)", marginBottom: 3, textTransform: "uppercase" as const, letterSpacing: ".07em" }}>{label}</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,.85)", lineHeight: 1.55 }}>{value}</div>
    </div>
  );
}

// Face hero number
function FaceHero({ label, hero, title, sub }: { label: string; hero: string; title: string; sub: string }) {
  return (
    <>
      <div style={{ fontSize: 9, fontWeight: 700, color: C.p400, textTransform: "uppercase" as const, letterSpacing: ".1em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 34, fontWeight: 500, color: C.ink, letterSpacing: "-1.5px", lineHeight: 1, marginBottom: 6 }}>{hero}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: C.ink, marginBottom: 5, lineHeight: 1.35 }}>{title}</div>
      <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, flex: 1 }}>{sub}</div>
    </>
  );
}

// ─── SUB-TAB: Funnel ──────────────────────────────────────────
function TabFunnel({ d }: { d: StrategyData }) {
  const stages = (d.stages || []) as FunnelStage[];
  const [hintDone, setHintDone] = useState(false);

  const funnelCards = [
    {
      label: "Awareness",
      hero: `${stages[0]?.budget_pct ?? 40}%`,
      title: stages[0]?.name ?? "Brand building",
      sub: stages[0] ? `${stages[0].channels?.slice(0, 2).join(" · ")} · ${stages[0].kpi}` : "YouTube + Meta + Spotify",
      back: [
        ["Budget", `${stages[0]?.budget_pct ?? 40}% van netto mediabudget`],
        ["Kanalen", stages[0]?.channels?.join(" · ") ?? "YouTube · Meta · Spotify"],
        ["KPI", stages[0]?.kpi ?? "Impressions + aided awareness"],
        ["Boodschap", stages[0]?.message_type ?? "Trust-first storytelling"],
      ],
    },
    {
      label: "Consideration",
      hero: `${stages[1]?.budget_pct ?? 30}%`,
      title: stages[1]?.name ?? "Retargeting & vergelijking",
      sub: stages[1] ? `${stages[1].channels?.slice(0, 2).join(" · ")} · ${stages[1].kpi}` : "Search + Meta Carousel",
      back: [
        ["Budget", `${stages[1]?.budget_pct ?? 30}% van netto mediabudget`],
        ["Kanalen", stages[1]?.channels?.join(" · ") ?? "Google Search · Meta Carousel"],
        ["KPI", stages[1]?.kpi ?? "Website visits · savings calc completions"],
        ["Conversieratio", stages[1]?.conversion_rate ?? "4.2% doorklik vanuit awareness"],
      ],
    },
    {
      label: "Conversion",
      hero: `${stages[2]?.budget_pct ?? 22}%`,
      title: stages[2]?.name ?? "Search vangt switching intent",
      sub: stages[2] ? `${stages[2].channels?.slice(0, 2).join(" · ")} · ${stages[2].kpi}` : "Search · Retargeting",
      back: [
        ["Budget", `${stages[2]?.budget_pct ?? 22}% van netto mediabudget`],
        ["Kanalen", stages[2]?.channels?.join(" · ") ?? "Google Search · Meta retargeting"],
        ["KPI", stages[2]?.kpi ?? "New accounts · CPA ≤ €45"],
        ["Synergie", stages[2]?.conversion_rate ?? "2.3× hogere CTR na YouTube exposure"],
      ],
    },
    {
      label: "Retention",
      hero: `${stages[3]?.budget_pct ?? 8}%`,
      title: stages[3]?.name ?? "Push, email + referral",
      sub: stages[3] ? `${stages[3].channels?.slice(0, 2).join(" · ")} · ${stages[3].kpi}` : "Push · Email · Referral",
      back: [
        ["Budget", `${stages[3]?.budget_pct ?? 8}% van netto mediabudget`],
        ["Kanalen", stages[3]?.channels?.join(" · ") ?? "Push · Email · Meta retargeting"],
        ["KPI", stages[3]?.kpi ?? "30-day retention · activatiegraad"],
        ["Referral live", stages[3]?.conversion_rate ?? "Week 6 · €20 CPA organisch"],
      ],
    },
  ];

  return (
    <div>
      {/* Strategic idea — hero flip */}
      {d.strategic_idea && (
        <div style={{ perspective: 900, height: 82, marginBottom: 12, cursor: "pointer" }} onClick={() => {}}>
          <HeroFlip idea={d.strategic_idea} />
        </div>
      )}

      {/* Hint */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: C.muted, marginBottom: 14, opacity: hintDone ? 0 : 1, transition: "opacity .4s", pointerEvents: "none" }}>
        <HintDot />
        Klik een kaart om te draaien voor detail
      </div>

      {/* 4 flip cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {funnelCards.map((fc, i) => (
          <FlipCard
            key={i}
            delay={i * 0.06}
            face={<FaceHero label={fc.label} hero={fc.hero} title={fc.title} sub={fc.sub} />}
            back={<><div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 10 }}>{fc.label} — detail</div>{fc.back.map(([l, v]) => <BackBlock key={l} label={l} value={v} />)}</>}
          />
        ))}
      </div>
    </div>
  );
}

// Hero flip (strategic idea)
function HeroFlip({ idea }: { idea: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", transition: "transform .52s cubic-bezier(.4,0,.2,1)", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "none" }}
      onClick={() => setFlipped(f => !f)}>
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: C.p900, borderRadius: 14, padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase" as const, letterSpacing: ".1em", marginBottom: 5 }}>Strategisch idee — klik voor toelichting</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", lineHeight: 1.5, maxWidth: 600 }}>{idea}</div>
      </div>
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: C.p700, borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", transform: "rotateY(180deg)" }}>
        <div style={{ fontSize: 12, color: "#fff", lineHeight: 1.7 }}>Trust-first omdat 62% van NL switchers vertrouwen als primaire barrière noemt. Vault combineert als enige: Dutch-first communicatie, DNB-licentie, zero-fee én moderne UX. Geen concurrent ownt dit.</div>
      </div>
    </div>
  );
}

// Hint dot — one subtle pulse, no repeat
function HintDot() {
  return (
    <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.p700, position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.p700, animation: "pulseRing 2s ease 0.5s 3" }} />
    </div>
  );
}

// ─── SUB-TAB: Channels ────────────────────────────────────────
function TabChannels({ d }: { d: StrategyData }) {
  const channels = (d.channels || []) as Channel[];
  const overlaps = (d.channel_overlap || []) as ChannelOverlap[];
  const pillars = (d.messaging_pillars || []) as MessagingPillar[];
  const priority = (d.audience_priority || []) as AudiencePriority[];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: C.muted, marginBottom: 14, pointerEvents: "none" }}>
        <HintDot />
        Klik een kaart voor targeting, rol en synergie
      </div>

      {/* Channel flip cards */}
      {channels.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10, marginBottom: 12 }}>
          {channels.map((ch, i) => (
            <FlipCard key={i} height={200} delay={i * 0.05}
              face={
                <>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: COLS[i % 4], marginBottom: 10 }} />
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.ink, marginBottom: 3 }}>{ch.name}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 7 }}>{ch.role}</div>
                  <div style={{ fontSize: 11, color: C.body, lineHeight: 1.5, flex: 1 }}>{ch.motivation}</div>
                </>
              }
              back={
                <>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 8 }}>{ch.name}</div>
                  <BackBlock label="Targeting" value={ch.targeting} />
                  <BackBlock label="Formats" value={ch.formats?.join(" · ") ?? "—"} />
                  <BackBlock label="Always-on" value={ch.always_on ? "Ja — loopt heel de campagne" : "Nee — burst/peak alleen"} />
                  {overlaps.find(o => o.channels?.includes(ch.name)) && (
                    <BackBlock label="Synergie" value={overlaps.find(o => o.channels?.includes(ch.name))?.insight ?? ""} />
                  )}
                </>
              }
            />
          ))}
        </div>
      ) : (
        <div style={{ color: C.muted, fontSize: FS.bodySm, marginBottom: 12 }}>Geen kanaaldata beschikbaar.</div>
      )}

      {/* Messaging pillars */}
      {pillars.length > 0 && (
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".07em", marginBottom: 8 }}>Messaging pillars</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
            {pillars.map((p, i) => (
              <div key={i} style={{ background: [C.p100, C.inset, C.inset][i % 3], borderRadius: 10, padding: "11px 13px", animation: `slideInUp .35s ease ${i * .07}s both` }}>
                <div style={{ fontSize: 9, color: C.p700, marginBottom: 4 }}>0{i + 1}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.p900, marginBottom: 3 }}>{p.title}</div>
                <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.5 }}>{p.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SUB-TAB: Retargeting ─────────────────────────────────────
function TabRetargeting({ d }: { d: StrategyData }) {
  const rules = (d.retargeting_rules || []) as RetargetingRule[];
  const generic = d.retargeting || [];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: C.muted, marginBottom: 14, pointerEvents: "none" }}>
        <HintDot />
        Klik een regel voor timing en budgetdetail
      </div>
      {rules.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {rules.map((r, i) => (
            <FlipCard key={i} height={180} delay={i * 0.06}
              face={
                <div style={{ display: "grid", gridTemplateColumns: "1fr 18px 1fr", gap: 8, alignItems: "center", height: "100%", paddingBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".07em", marginBottom: 5 }}>Trigger</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.ink, lineHeight: 1.4 }}>{r.trigger}</div>
                  </div>
                  <div style={{ textAlign: "center", color: C.p700, fontSize: 16 }}>›</div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: C.p700, textTransform: "uppercase" as const, letterSpacing: ".07em", marginBottom: 5 }}>Actie</div>
                    <div style={{ fontSize: 11, color: C.ink, lineHeight: 1.4 }}>{r.action}</div>
                  </div>
                </div>
              }
              back={
                <>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 8 }}>Uitvoering</div>
                  <BackBlock label="Trigger" value={r.trigger} />
                  <BackBlock label="Actie" value={r.action} />
                </>
              }
            />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {generic.slice(0, 6).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 9, alignItems: "center", padding: "10px 14px", background: C.white, borderRadius: 10, border: `.5px solid ${C.border}`, animation: `slideInUp .3s ease ${i * .06}s both` }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.p700, flexShrink: 0 }} />
              <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.55 }}>{item}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SUB-TAB: Metrics ─────────────────────────────────────────
function TabMetrics({ d }: { d: StrategyData }) {
  const metrics = (d.success_metrics || []) as SuccessMetric[];
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t); }, []);

  const counterRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!animated) return;
    metrics.forEach((m, i) => {
      const el = counterRef.current[i];
      if (!el) return;
      const num = parseFloat(m.value.replace(/[^0-9.]/g, ""));
      if (isNaN(num)) return;
      const prefix = m.value.match(/^[^0-9]*/)?.[0] ?? "";
      const suffix = m.value.match(/[^0-9.]*$/)?.[0] ?? "";
      let cur = 0; const inc = num / 60;
      const t = setInterval(() => {
        cur = Math.min(cur + inc, num);
        el.textContent = prefix + (Number.isInteger(num) ? Math.round(cur).toLocaleString() : cur.toFixed(1)) + suffix;
        if (cur >= num) clearInterval(t);
      }, 16);
    });
  }, [animated, metrics]);

  return (
    <div>
      {/* North-star */}
      {d.north_star_kpi && (
        <div style={{ background: C.p900, borderRadius: 14, padding: "16px 20px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between", animation: "slideInUp .35s ease" }}>
          <div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.35)", textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 5 }}>North-star KPI</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: "#fff", letterSpacing: "-.5px" }}>{d.north_star_kpi}</div>
            {d.north_star_desc && <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", marginTop: 3 }}>{d.north_star_desc}</div>}
          </div>
          <div style={{ fontSize: 40, color: "rgba(255,255,255,.06)" }}>★</div>
        </div>
      )}

      {/* Metric flip cards */}
      {metrics.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {metrics.map((m, i) => (
            <FlipCard key={i} height={180} delay={i * 0.07}
              face={
                <>
                  <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".07em", marginBottom: 8 }}>{m.label}</div>
                  <div ref={el => { if (el) counterRef.current[i] = el; }}
                    style={{ fontSize: 28, fontWeight: 500, color: C.ink, letterSpacing: "-1px", lineHeight: 1, marginBottom: 5 }}>{m.value}</div>
                </>
              }
              back={
                <>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 10 }}>{m.label}</div>
                  <BackBlock label="Target" value={m.value} />
                  <BackBlock label="Meetmethode" value="Wekelijkse rapportage via dashboard" />
                  <BackBlock label="Actie bij miss" value="Shift budget naar best-performing kanaal" />
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SUB-TAB NAVIGATION ───────────────────────────────────────
const SUBTABS = [
  { key: "funnel",      label: "Funnel" },
  { key: "channels",    label: "Channels" },
  { key: "retargeting", label: "Retargeting" },
  { key: "metrics",     label: "Metrics" },
] as const;
type SubTab = typeof SUBTABS[number]["key"];

// ─── MAIN EXPORT ──────────────────────────────────────────────
export function SecStrategy({ d, raw }: { d: StrategyData; raw: string }) {
  const [sub, setSub] = useState<SubTab>("funnel");

  return (
    <div>
      {/* Sub-tab navigation */}
      <div style={{
        display: "flex", gap: 2, marginBottom: 18,
        borderBottom: `.5px solid ${C.border}`, paddingBottom: 0,
      }}>
        {SUBTABS.map(t => (
          <button key={t.key} onClick={() => setSub(t.key)} style={{
            padding: "6px 14px", border: "none", background: "transparent",
            fontSize: FS.bodySm, fontWeight: sub === t.key ? 700 : 500,
            color: sub === t.key ? C.p700 : C.muted,
            cursor: "pointer", position: "relative", transition: "color .2s",
            borderBottom: sub === t.key ? `2px solid ${C.p700}` : "2px solid transparent",
            marginBottom: -1,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content per sub-tab */}
      <div key={sub} style={{ animation: "slideInRight .3s ease" }}>
        {sub === "funnel"      && <TabFunnel d={d} />}
        {sub === "channels"    && <TabChannels d={d} />}
        {sub === "retargeting" && <TabRetargeting d={d} />}
        {sub === "metrics"     && <TabMetrics d={d} />}
      </div>

      <FeedbackBar phase="strategy" outputRaw={raw} />
    </div>
  );
}
