"use client";
import { C, FS } from "@/lib/tokens";
import { KpiCard, FeedbackBar, SectionCard, Pair, SectionLabel, BulletItem, Divider } from "@/components/ui/primitives";
import type { CompetitiveData, Competitor, PositioningBrand, CompetitorWeakness } from "@/lib/types";

const BRAND_COLORS = [C.p900, C.p700, C.p600, C.p300];

function SecTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>{children}</div>;
}

function Insight({ text }: { text: string }) {
  return (
    <div style={{ marginTop: 12, padding: "9px 11px", background: C.inset, borderRadius: "0 8px 8px 0", borderLeft: `2px solid ${C.p700}` }}>
      <div style={{ fontSize: FS.bodySm, color: C.body, lineHeight: 1.55 }}>{text}</div>
    </div>
  );
}

function BarRow({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <div style={{ fontSize: FS.bodySm, color: C.body, width: 90, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 6, background: C.inset, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
      <div style={{ fontSize: FS.bodySm, fontWeight: 500, color: C.ink, width: 30, textAlign: "right" }}>{pct}%</div>
    </div>
  );
}

// ─── 1. Competitive overview ──────────────────────────────────
function Overview({ competitors }: { competitors: Competitor[] }) {
  return (
    <Card>
      {competitors.map((c, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: i < competitors.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: BRAND_COLORS[i % 4], flexShrink: 0, marginTop: 5 }} />
          <div style={{ fontSize: FS.bodySm, fontWeight: 500, color: C.ink, width: 100, flexShrink: 0 }}>{c.name}</div>
          <div style={{ fontSize: FS.bodySm, color: C.muted, lineHeight: 1.5 }}>{c.positioning}</div>
        </div>
      ))}
    </Card>
  );
}

// ─── 2. SOV vs Market share ───────────────────────────────────
function SovCard({ title, items, insight }: { title: string; items: { name: string; pct: number }[]; insight?: string }) {
  return (
    <Card>
      {items.map((s, i) => <BarRow key={i} label={s.name} pct={s.pct} color={BRAND_COLORS[i % 4]} />)}
      {insight && <Insight text={insight} />}
    </Card>
  );
}

// ─── 3. Positioning map ───────────────────────────────────────
function PositioningMap({ brands, insight }: { brands: PositioningBrand[]; insight?: string }) {
  const W = 560; const H = 200;
  const pad = 16;

  return (
    <div style={{ background: C.white, borderRadius: 14, border: `0.5px solid ${C.border}`, overflow: "hidden", marginBottom: 10 }}>
      <div style={{ padding: "12px 16px 0", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: FS.bodyXs, fontWeight: 500, color: C.muted }}>← Traditional</div>
        <div style={{ fontSize: FS.bodyXs, fontWeight: 500, color: C.muted }}>Innovative →</div>
      </div>
      <div style={{ padding: "0 16px" }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H + pad * 2}`} style={{ display: "block" }}>
          {/* Axis lines */}
          <line x1={W / 2} y1={0} x2={W / 2} y2={H + pad * 2} stroke={C.border} strokeWidth={1} strokeDasharray="4,4" />
          <line x1={0} y1={(H + pad * 2) / 2} x2={W} y2={(H + pad * 2) / 2} stroke={C.border} strokeWidth={1} strokeDasharray="4,4" />
          {/* Axis labels */}
          <text x={4} y={16} fontSize={10} fill={C.muted} fontFamily="sans-serif">Premium</text>
          <text x={4} y={H + pad * 2 - 4} fontSize={10} fill={C.muted} fontFamily="sans-serif">Accessible</text>
          {/* Vault territory ellipse */}
          <ellipse cx={W * 0.74} cy={H * 0.65 + pad} rx={72} ry={48} fill={C.p700} opacity={0.07} stroke={C.p700} strokeWidth={1.5} strokeDasharray="5,4" />
          <text x={W * 0.74} y={H * 0.65 + pad + 62} fontSize={10} fontWeight="500" fill={C.p700} fontFamily="sans-serif" textAnchor="middle">Vault territory</text>
          {/* Brands */}
          {brands.map((b, i) => {
            const cx = pad + (b.x / 100) * (W - pad * 2);
            const cy = pad + ((100 - b.y) / 100) * H;
            const col = b.color || BRAND_COLORS[i % 4];
            const isVault = b.name.toLowerCase() === "vault";
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={isVault ? 9 : 8} fill={col} opacity={isVault ? 0.9 : 1} />
                <text x={cx + 13} y={cy + 4} fontSize={11} fontWeight="500" fill={isVault ? col : C.ink} fontFamily="sans-serif">{b.name}</text>
                {isVault && <text x={cx + 13} y={cy + 16} fontSize={9} fill={col} fontFamily="sans-serif">(target)</text>}
              </g>
            );
          })}
        </svg>
      </div>
      {insight && (
        <div style={{ padding: "10px 16px", borderTop: `0.5px solid ${C.border}`, background: C.inset }}>
          <div style={{ fontSize: FS.bodySm, color: C.muted, lineHeight: 1.55 }}>{insight}</div>
        </div>
      )}
    </div>
  );
}

// ─── 4. Messaging & creative patterns ────────────────────────
function MessagingCard({ competitors, patterns }: { competitors: Competitor[]; patterns?: { label: string; icon: string }[] }) {
  const allAds = competitors.flatMap(c => (c.recent_ads || []).slice(0, 1).map(ad => ({ ...ad, brand: c.name, brandIdx: competitors.indexOf(c) })));
  return (
    <Card>
      {allAds.map((ad, i) => (
        <div key={i} style={{ display: "flex", gap: 9, padding: "9px 11px", background: C.inset, borderRadius: 9, marginBottom: 7 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 5, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ padding: "2px 7px", background: C.p100, color: C.p900, borderRadius: 20, fontSize: FS.cardLabel, fontWeight: 500 }}>{ad.brand}</span>
              <span style={{ padding: "2px 7px", background: C.white, border: `0.5px solid ${C.border}`, color: C.muted, borderRadius: 20, fontSize: FS.cardLabel }}>{ad.platform}</span>
              <span style={{ padding: "2px 7px", background: C.white, border: `0.5px solid ${C.border}`, color: C.muted, borderRadius: 20, fontSize: FS.cardLabel }}>{ad.format}</span>
            </div>
            <div style={{ fontSize: FS.bodySm, color: C.body, marginBottom: 2 }}>{ad.description}</div>
            <div style={{ fontSize: FS.bodyXs, color: C.muted, fontStyle: "italic" }}>{ad.angle}</div>
          </div>
        </div>
      ))}
      {patterns && patterns.length > 0 && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `0.5px solid ${C.border}` }}>
          <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 7 }}>Category patterns</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {patterns.map((p, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", background: C.inset, borderRadius: 20, fontSize: FS.bodySm, color: C.muted }}>
                {p.icon} {p.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── 5. Weaknesses ────────────────────────────────────────────
function WeaknessCard({ items }: { items: CompetitorWeakness[] }) {
  return (
    <Card>
      {items.map((w, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 10, padding: "9px 0", borderBottom: i < items.length - 1 ? `0.5px solid ${C.border}` : "none", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: BRAND_COLORS[i % 4], flexShrink: 0 }} />
            <div style={{ fontSize: FS.bodySm, fontWeight: 500, color: C.ink }}>{w.name}</div>
          </div>
          <div style={{ fontSize: FS.bodySm, color: C.muted, lineHeight: 1.5 }}>{w.weakness}</div>
        </div>
      ))}
    </Card>
  );
}

// ─── 6. Market gaps ───────────────────────────────────────────
function MarketGaps({ gaps }: { gaps: { title: string; description: string }[] }) {
  return (
    <Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {gaps.map((g, i) => (
          <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: FS.bodyXs, fontWeight: 500, color: C.p900, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: FS.body, fontWeight: 500, color: C.ink, marginBottom: 3 }}>{g.title}</div>
              <div style={{ fontSize: FS.bodyXs, color: C.muted, lineHeight: 1.5 }}>{g.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── 7. White space ───────────────────────────────────────────
function WhiteSpace({ title, items }: { title?: string; items: { label: string }[] }) {
  return (
    <div style={{ background: C.p100, borderRadius: "0 14px 14px 0", borderLeft: `3px solid ${C.p700}`, padding: "16px 18px" }}>
      <div style={{ fontSize: FS.bodyLg, fontWeight: 500, color: C.p900, marginBottom: 12 }}>
        {title || "A challenger no current competitor owns:"}
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 8 }}>
          <div style={{ width: 16, height: 16, borderRadius: 5, background: C.p700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
            <svg width="9" height="7" viewBox="0 0 9 7"><path d="M1 3.5l2.5 2.5L8 1" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ fontSize: FS.body, color: C.p900, lineHeight: 1.6 }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export function SecCompetitive({ d, raw }: { d: CompetitiveData; raw: string }) {
  const competitors = d.competitors || [];
  const sov         = (d.sov || []).map(s => ({ name: s.brand || s.name || "", pct: s.pct }));
  const ms          = (d.market_share || []).map(s => ({ name: s.brand || s.name || "", pct: s.pct }));
  const posMap      = d.positioning_map || [];
  const weaknesses  = d.weaknesses || [];
  const gaps        = d.market_gaps || [];
  const whiteSpace  = d.white_space || [];
  const patterns    = d.creative_patterns || [];

  return (
    <div>

      {/* 1. Competitive overview */}
      {competitors.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <SecTitle>1 — Competitive overview</SecTitle>
          <Overview competitors={competitors} />
        </div>
      )}

      {/* 2. SOV vs Market share — equal-height pair */}
      {(sov.length > 0 || ms.length > 0) && (
        <Pair
          left={<><SecTitle>2a — Share of Voice</SecTitle><SovCard title="SOV" items={sov} insight={d.sov_insight} /></>}
          right={<><SecTitle>2b — Market Share</SecTitle><SovCard title="Market Share" items={ms} insight={d.market_share_insight} /></>}
        />
      )}

      {/* 3. Positioning map */}
      {posMap.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <SecTitle>3 — Positioning map</SecTitle>
          <PositioningMap brands={posMap} insight={d.positioning_insight} />
        </div>
      )}

      {/* 4. Messaging + 5. Weaknesses — equal-height pair */}
      <Pair
        left={<><SecTitle>4 — Messaging & creative patterns</SecTitle><MessagingCard competitors={competitors} patterns={patterns} /></>}
        right={<>{weaknesses.length > 0 && <><SecTitle>5 — Weaknesses & vulnerabilities</SecTitle><WeaknessCard items={weaknesses} /></>}</>}
      />

      {/* 6. Market gaps */}
      {gaps.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <SecTitle>6 — Market gaps</SecTitle>
          <MarketGaps gaps={gaps} />
        </div>
      )}

      {/* 7. White space */}
      {whiteSpace.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <SecTitle>7 — Competitive white space</SecTitle>
          <WhiteSpace title={d.white_space_title} items={whiteSpace} />
        </div>
      )}

      <FeedbackBar phase="competitive" outputRaw={raw} />
    </div>
  );
}
