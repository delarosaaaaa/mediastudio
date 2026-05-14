"use client";
import { C, FS } from "@/lib/tokens";
import { KpiCard, FeedbackBar, SectionCard, Pair, SectionLabel, BulletItem, Divider } from "@/components/ui/primitives";
import { fmtK, fmtN, fmtE, fmtP } from "@/lib/format";
import type { MediaplanData, MediaChannel, ExecutionInsight } from "@/lib/types";

const PHASE_COLS: Record<string, string> = {
  awareness:     C.p900,
  consideration: C.p700,
  conversion:    C.p600,
  retention:     C.p300,
};
const FALLBACK_COLS = [C.p900, C.p700, C.p600, C.p300];

function stageColor(stage: string, i: number): string {
  const s = (stage || "").toLowerCase();
  for (const [key, col] of Object.entries(PHASE_COLS)) {
    if (s.includes(key)) return col;
  }
  return FALLBACK_COLS[i % 4];
}

// ─── Channel row ──────────────────────────────────────────────
function ChannelRow({ ch, i }: { ch: MediaChannel; i: number }) {
  const col     = stageColor(ch.funnel_stage, i);
  const isLight = col === C.p300;
  const meta    = [ch.funnel_stage, ch.platform, ch.buy_type].filter(Boolean).join(" · ");

  // Pick the right rate metric label — CPC for Search, CPM otherwise
  const rateLabel = (ch.buy_type || "").toLowerCase().includes("cpc") || (ch.platform || "").toLowerCase().includes("search") ? "CPC" : "CPM";
  const rateValue = rateLabel === "CPC" ? fmtE(ch.cpm) : fmtE(ch.cpm); // both stored as cpm field

  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 130px", borderRadius: 9, overflow: "hidden", border: `0.5px solid ${col}28`, marginBottom: 6 }}>
      {/* Left: name + meta + budget */}
      <div style={{ background: col, padding: "12px 13px" }}>
        <div style={{ fontSize: FS.body, fontWeight: 500, color: isLight ? C.p900 : "#fff", marginBottom: 2 }}>{ch.name}</div>
        <div style={{ fontSize: FS.cardLabel, color: isLight ? "rgba(26,0,80,.5)" : "rgba(255,255,255,.5)", marginBottom: 7, lineHeight: 1.4 }}>{meta}</div>
        <div style={{ display: "inline-block", padding: "3px 9px", background: isLight ? "rgba(26,0,80,.12)" : "rgba(255,255,255,.18)", borderRadius: 20, fontSize: FS.bodyXs, fontWeight: 500, color: isLight ? C.p900 : "#fff" }}>
          {fmtK(ch.budget)}
        </div>
      </div>
      {/* Middle: formats + targeting */}
      <div style={{ background: C.white, padding: "12px 14px", borderLeft: `0.5px solid ${C.border}` }}>
        <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: col, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>Formats & targeting</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
          {ch.formats?.map((f, j) => (
            <span key={j} style={{ padding: "2px 7px", background: col + "18", color: col, borderRadius: 20, fontSize: FS.bodyXs, fontWeight: 500 }}>{f}</span>
          ))}
        </div>
        <div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.4 }}>{ch.targeting}</div>
      </div>
      {/* Right: KPIs */}
      <div style={{ background: C.inset, padding: "12px 13px", borderLeft: `0.5px solid ${C.border}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, alignContent: "start" }}>
        {([
          [rateLabel, rateValue],
          ["CTR",     fmtP(ch.ctr)],
          ["Conv.",   fmtN(ch.conversions)],
          ["CPA",     fmtE(ch.cpa)],
        ] as [string, string][]).map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: FS.cardLabel, fontWeight: 600, color: C.muted, marginBottom: 2 }}>{k}</div>
            <div style={{ fontSize: FS.body, fontWeight: 500, color: C.ink }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 3. Key execution insights ────────────────────────────────
function ExecutionInsights({ items }: { items: ExecutionInsight[] }) {
  return (
    <Card style={{ padding: "0 16px" }}>
      {items.map((ins, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: i < items.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
            {ins.icon}
          </div>
          <div>
            <div style={{ fontSize: FS.body, fontWeight: 500, color: C.ink, marginBottom: 2 }}>{ins.title}</div>
            <div style={{ fontSize: FS.bodySm, color: C.muted, lineHeight: 1.5 }}>{ins.desc}</div>
          </div>
        </div>
      ))}
    </Card>
  );
}

// ─── 4. Optimisation approach ─────────────────────────────────
function OptimisationApproach({ notes }: { notes: string[] }) {
  return (
    <Card>
      {notes.map((n, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: i < notes.length - 1 ? 8 : 0 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.p700, marginTop: 6, flexShrink: 0 }} />
          <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.55 }}>{n}</div>
        </div>
      ))}
    </Card>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export function SecMediaplan({ d, raw }: { d: MediaplanData; raw: string }) {
  const channels = d.channels || [];
  const totals   = d.totals   || { budget: 0, impressions: 0, clicks: 0, conversions: 0 };
  const insights = (d.execution_insights || []) as ExecutionInsight[];
  const optNotes = (d.optimisation_notes || []) as string[];

  return (
    <div>

      {/* 1. Media overview */}
      <div style={{ marginBottom: 10 }}>
        <SectionLabel>1 — Media overview</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
          <KpiCard label="Total budget"  value={fmtK(totals.budget)} />
          <KpiCard label="Impressions"   value={fmtN(totals.impressions)} />
          <KpiCard label="Clicks"        value={fmtN(totals.clicks)} />
          <KpiCard label="Conversions"   value={fmtN(totals.conversions)} />
          <KpiCard label="Blended CPA"   value={totals.blended_cpa ? fmtE(totals.blended_cpa) : totals.conversions > 0 ? fmtE(totals.budget / totals.conversions) : "—"} />
        </div>
      </div>

      {/* 2. Channel plan */}
      {channels.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <SectionLabel>2 — Channel plan</SectionLabel>
          {channels.map((ch, i) => <ChannelRow key={i} ch={ch} i={i} />)}
        </div>
      )}

      {/* 3 + 4 — pair */}
      {(insights.length > 0 || optNotes.length > 0) && (
        <Pair
          left={<>{insights.length > 0  && <><SectionLabel>3 — Key execution insights</SectionLabel><ExecutionInsights items={insights} /></>}</>}
          right={<>{optNotes.length > 0 && <><SectionLabel>4 — Optimisation approach</SectionLabel><OptimisationApproach notes={optNotes} /></>}</>}
        />
      )}

      <FeedbackBar phase="mediaplan" outputRaw={raw} />
    </div>
  );
}
