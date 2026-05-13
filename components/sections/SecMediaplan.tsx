"use client";
import { C, FS } from "@/lib/tokens";
import { Card, KpiCard, CardLabel, Tag, FeedbackBar } from "@/components/ui/primitives";
import { fmtK, fmtN, fmtE, fmtP } from "@/lib/format";
import type { MediaplanData, MediaChannel } from "@/lib/types";

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

export function SecMediaplan({ d, raw }: { d: MediaplanData; raw: string }) {
  const channels = d.channels || [];
  const totals   = d.totals || { budget: 0, impressions: 0, clicks: 0, conversions: 0 };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 9 }}>
        <KpiCard label="Total budget"  value={fmtK(totals.budget)} />
        <KpiCard label="Impressions"   value={fmtN(totals.impressions)} />
        <KpiCard label="Clicks"        value={fmtN(totals.clicks)} />
        <KpiCard label="Conversions"   value={fmtN(totals.conversions)} />
      </div>

      <Card>
        <CardLabel>Channel plan — execution detail</CardLabel>
        {channels.map((ch, i) => {
          const col = stageColor(ch.funnel_stage, i);
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr 125px", borderRadius: 9, overflow: "hidden", border: `0.5px solid ${col}28`, marginBottom: 6 }}>
              <div style={{ background: col, padding: "12px 13px" }}>
                <div style={{ fontSize: FS.body, fontWeight: 800, color: "#fff", marginBottom: 2 }}>{ch.name}</div>
                <div style={{ fontSize: FS.cardLabel, color: "rgba(255,255,255,.5)", marginBottom: 7, lineHeight: 1.4 }}>
                  {[ch.funnel_stage, ch.platform, ch.buy_type].filter(Boolean).join(" · ")}
                </div>
                <div style={{ display: "inline-block", padding: "3px 9px", background: "rgba(255,255,255,.18)", borderRadius: 20, fontSize: FS.bodyXs, fontWeight: 600, color: "#fff" }}>
                  {fmtK(ch.budget)}
                </div>
              </div>
              <div style={{ background: C.white, padding: "12px 14px", borderLeft: `0.5px solid ${C.border}` }}>
                <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: col, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>Formats & targeting</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                  {ch.formats?.map((f, j) => (
                    <span key={j} style={{ padding: "2px 8px", background: col + "18", color: col, borderRadius: 20, fontSize: FS.bodyXs, fontWeight: 600 }}>{f}</span>
                  ))}
                </div>
                <div style={{ fontSize: FS.bodyXs, color: C.muted }}>{ch.targeting}</div>
              </div>
              <div style={{ background: C.inset, padding: "12px 13px", borderLeft: `0.5px solid ${C.border}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, alignContent: "start" }}>
                {([["CPM", fmtE(ch.cpm)], ["CTR", fmtP(ch.ctr)], ["Conv.", fmtN(ch.conversions)], ["CPA", fmtE(ch.cpa)]] as [string, string][]).map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: FS.cardLabel, fontWeight: 600, color: C.muted, marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: FS.body, fontWeight: 800, color: C.ink }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </Card>

      <FeedbackBar phase="mediaplan" outputRaw={raw} />
    </div>
  );
}
