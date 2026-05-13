"use client";
import { T, TY } from "@/lib/tokens";
import { KpiCard } from "@/components/ui/KpiCard";
import { FeedbackBar } from "@/components/ui/FeedbackBar";
import { fmtN, fmtE, fmtP, fmtK } from "@/lib/format";
import type { MediaplanData, MediaChannel } from "@/lib/types";

interface Props { d: MediaplanData; raw: string; }

const FUNNEL_COLS: Record<string, string> = {
  awareness:     T.p1,
  consideration: T.p2,
  conversion:    T.p3,
  retention:     T.p5,
};

function stageColor(stage: string): string {
  const s = (stage || "").toLowerCase();
  if (s.includes("aware"))  return FUNNEL_COLS.awareness;
  if (s.includes("consid")) return FUNNEL_COLS.consideration;
  if (s.includes("conver")) return FUNNEL_COLS.conversion;
  if (s.includes("retent")) return FUNNEL_COLS.retention;
  return T.p2;
}

function ChannelRow({ ch }: { ch: MediaChannel }) {
  const col = stageColor(ch.funnel_stage || "");
  return (
    <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 140px", borderRadius: 9, overflow: "hidden", border: `0.5px solid rgba(0,0,0,.07)`, marginBottom: 6 }}>
      <div style={{ background: col, padding: "13px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{ch.name}</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,.55)", marginBottom: 8, lineHeight: 1.4 }}>
            {[ch.funnel_stage, ch.platform, ch.buy_type].filter(Boolean).join(" · ")}
          </div>
        </div>
        <div style={{ display: "inline-block", padding: "3px 9px", background: "rgba(255,255,255,.18)", borderRadius: 20, fontSize: 10, fontWeight: 600, color: "#fff" }}>
          {fmtK(ch.budget)}
        </div>
      </div>
      <div style={{ background: T.sur, padding: "13px 16px", borderLeft: `0.5px solid ${T.s3}` }}>
        <div style={{ ...TY.cardLabel, color: col, marginBottom: 6 }}>Formats & targeting</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 7 }}>
          {ch.formats?.map((f, i) => (
            <span key={i} style={{ padding: "2px 8px", background: col + "14", color: col, borderRadius: 20, fontSize: 10, fontWeight: 600 }}>{f}</span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: T.t3 }}>{ch.targeting}</div>
      </div>
      <div style={{ background: T.s2, padding: "13px 14px", borderLeft: `0.5px solid ${T.s3}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, alignContent: "start" }}>
        {([["CPM", fmtE(ch.cpm)], ["CTR", fmtP(ch.ctr)], ["Conv.", fmtN(ch.conversions)], ["CPA", fmtE(ch.cpa)]] as [string,string][]).map(([k, v]) => (
          <div key={k}>
            <div style={{ ...TY.cardLabel, marginBottom: 2 }}>{k}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.t1 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SecMediaplan({ d, raw }: Props) {
  const channels = d.channels || [];
  if (!channels.length) return (
    <div style={{ background: T.sur, borderRadius: 12, padding: 28, textAlign: "center", fontSize: 12, color: T.t3 }}>No media plan data.</div>
  );
  const totals = d.totals || { budget: 0, impressions: 0, clicks: 0, conversions: 0 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        <KpiCard label="Total budget"  value={fmtK(totals.budget)} />
        <KpiCard label="Impressions"   value={fmtN(totals.impressions)} />
        <KpiCard label="Clicks"        value={fmtN(totals.clicks)} />
        <KpiCard label="Conversions"   value={fmtN(totals.conversions)} />
      </div>

      <div style={{ background: T.sur, borderRadius: 12, padding: "16px 18px", boxShadow: T.shad }}>
        <div style={{ ...TY.cardLabel, marginBottom: 12 }}>Channel plan</div>
        {channels.map((ch, i) => <ChannelRow key={i} ch={ch} />)}
      </div>

      <FeedbackBar phase="mediaplan" outputRaw={raw} />
    </div>
  );
}
