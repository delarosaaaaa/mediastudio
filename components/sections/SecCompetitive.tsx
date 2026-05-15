"use client";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { C, FS } from "@/lib/tokens";
import { Card, CardLabel, FeedbackBar, Pair, SectionLabel } from "@/components/ui/primitives";
import type { CompetitiveData, Competitor, PositioningBrand, CompetitorWeakness } from "@/lib/types";

const BRAND_COLORS = [C.p900, C.p700, C.p600, C.p300];

function SecTitle({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".07em", marginBottom: 8 }}>{children}</div>;
}

// SOV vs Market share racing bars
function SovBars({ sov, ms }: { sov: CompetitiveData["sov"]; ms: CompetitiveData["market_share"] }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t); }, []);
  const brands = sov.slice(0, 4);
  return (
    <Card>
      <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: FS.bodyXs, color: C.muted }}><div style={{ width: 18, height: 3, background: C.p700, borderRadius: 2 }} />Share of Voice</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: FS.bodyXs, color: C.muted }}><div style={{ width: 18, height: 3, background: C.p300, borderRadius: 2 }} />Market Share</div>
      </div>
      {brands.map((b, i) => {
        const msVal = (ms?.[i]?.pct ?? 0);
        const over = b.pct > msVal;
        return (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: FS.bodyXs, color: C.muted, marginBottom: 4 }}>
              <span>{b.brand ?? b.name}</span>
              <span>SOV {b.pct}% vs Share {msVal}%</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <div style={{ flex: 1, height: 6, background: C.inset, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: animated ? `${b.pct}%` : "0%", background: over ? "#A32D2D" : C.p700, borderRadius: 3, transition: `width 1s cubic-bezier(.4,0,.2,1) ${i * .1}s` }} />
              </div>
              <div style={{ flex: 1, height: 6, background: C.inset, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: animated ? `${msVal}%` : "0%", background: C.p300, borderRadius: 3, transition: `width 1s cubic-bezier(.4,0,.2,1) ${i * .1 + .15}s` }} />
              </div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// Heatmap weakness matrix
function Heatmap({ competitors }: { competitors: Competitor[] }) {
  const dims = ["UX", "Vertrouwen", "Prijs", "Dutch", "ZZP"];
  const cols = ["#EDE9FE", "#C4B5FD", "#A855F7", "#5B21B6", "#1A0050"];
  const textCols = ["#3C3489", "#3C3489", "#fff", "#fff", "#fff"];
  const symbols = ["✕", "○", "◑", "●", "★"];
  const [hovered, setHovered] = useState<[number, number] | null>(null);

  // Score each competitor per dimension (heuristic from data)
  function score(c: Competitor, dim: string) {
    if (dim === "UX") return c.name.toLowerCase().includes("ing") || c.name.toLowerCase().includes("rabo") ? 2 : 4;
    if (dim === "Vertrouwen") return c.name.toLowerCase().includes("ing") || c.name.toLowerCase().includes("rabo") ? 5 : 2 + (c.strengths?.length ?? 0) % 3;
    if (dim === "Prijs") return c.name.toLowerCase().includes("revolut") || c.name.toLowerCase().includes("n26") ? 4 : 2;
    if (dim === "Dutch") return c.name.toLowerCase().includes("ing") || c.name.toLowerCase().includes("rabo") ? 4 : c.name.toLowerCase().includes("bunq") ? 3 : 1;
    if (dim === "ZZP") return c.name.toLowerCase().includes("ing") || c.name.toLowerCase().includes("rabo") ? 2 : 2;
    return 2;
  }

  const colStr = `80px ${dims.map(() => "1fr").join(" ")}`;
  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: `.5px solid ${C.border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: colStr, background: C.inset, padding: "7px 10px", gap: 5 }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".06em" }}>Merk</div>
        {dims.map(d => <div key={d} style={{ fontSize: 8, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".06em", textAlign: "center" }}>{d}</div>)}
      </div>
      {competitors.slice(0, 4).map((c, ri) => (
        <div key={ri} onMouseEnter={() => setHovered([ri, -1])} onMouseLeave={() => setHovered(null)}
          style={{ display: "grid", gridTemplateColumns: colStr, padding: "7px 10px", gap: 5, borderTop: `.5px solid ${C.border}`, background: hovered?.[0] === ri ? C.inset : "transparent", transition: "background .15s", cursor: "pointer" }}>
          <div style={{ fontSize: FS.bodySm, fontWeight: 700, color: C.ink }}>{c.name}</div>
          {dims.map((d, di) => {
            const v = Math.min(5, Math.max(1, score(c, d)));
            return (
              <div key={di}
                onMouseEnter={() => setHovered([ri, di])}
                style={{ borderRadius: 5, height: 22, display: "flex", alignItems: "center", justifyContent: "center", background: cols[v - 1], fontSize: 10, fontWeight: 700, color: textCols[v - 1], transform: hovered?.[0] === ri && hovered?.[1] === di ? "scale(1.2)" : "scale(1)", transition: "transform .2s", cursor: "pointer" }}>
                {symbols[v - 1]}
              </div>
            );
          })}
        </div>
      ))}
      {hovered && (
        <div style={{ padding: "6px 10px", background: C.p100, fontSize: FS.bodyXs, color: C.p700, borderTop: `.5px solid ${C.border}` }}>
          {hovered[1] >= 0 ? `${dims[hovered[1]]} — ${competitors[hovered[0]]?.name}` : competitors[hovered[0]]?.name}
        </div>
      )}
    </div>
  );
}

// Interactive positioning map
function PositioningMap({ brands, insight }: { brands: PositioningBrand[]; insight?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  return (
    <Card style={{ padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: FS.bodyXs, color: C.muted, marginBottom: 5 }}>
        <span>← Traditioneel</span><span>Innovatief →</span>
      </div>
      <div style={{ position: "relative", height: 180 }}>
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: C.border }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: C.border }} />
        <span style={{ position: "absolute", top: 3, left: 3, fontSize: 8, color: C.muted }}>Premium</span>
        <span style={{ position: "absolute", bottom: 3, left: 3, fontSize: 8, color: C.muted }}>Accessible</span>
        {/* Vault opportunity zone */}
        {brands.find(b => b.name.toLowerCase().includes("vault")) && (
          <div style={{
            position: "absolute", left: "60%", top: "45%", width: 80, height: 60,
            border: `1.5px dashed ${C.p700}`, borderRadius: "50%",
            background: `${C.p700}08`,
            transform: "translate(-50%,-50%)",
            opacity: visible ? 1 : 0, transition: "opacity .6s .4s",
          }} />
        )}
        {brands.map((b, i) => {
          const isVault = b.name.toLowerCase().includes("vault");
          const col = b.color ?? BRAND_COLORS[i % 4];
          const size = isVault ? 38 : 32;
          return (
            <div key={i}
              onMouseEnter={() => setHovered(b.name)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: "absolute",
                left: `${b.x}%`, top: `${(100 - b.y)}%`,
                width: size, height: size, borderRadius: "50%",
                background: col,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 8, fontWeight: 700, color: "#fff",
                transform: `translate(-50%,-50%) scale(${visible ? 1 : 0})`,
                transition: `transform .45s cubic-bezier(.34,1.56,.64,1) ${i * .1}s`,
                boxShadow: isVault ? `0 0 0 3px #fff, 0 0 0 5px ${C.p700}` : "none",
                cursor: "pointer", zIndex: hovered === b.name ? 10 : 1,
              }}>
              {b.name.slice(0, 2)}
              {hovered === b.name && (
                <div style={{ position: "absolute", bottom: "110%", left: "50%", transform: "translateX(-50%)", background: C.p900, color: "#fff", fontSize: 9, padding: "4px 8px", borderRadius: 6, whiteSpace: "nowrap", zIndex: 20 }}>
                  {b.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {(hovered ?? insight) && (
        <div style={{ marginTop: 8, padding: "7px 10px", background: C.inset, borderRadius: 8, fontSize: FS.bodyXs, color: C.body }}>
          {hovered ?? insight}
        </div>
      )}
    </Card>
  );
}

export function SecCompetitive({ d, raw }: { d: CompetitiveData; raw: string }) {
  const competitors = d.competitors || [];
  const weaknesses = (d.weaknesses || []) as CompetitorWeakness[];
  const posMap = (d.positioning_map || []) as PositioningBrand[];

  return (
    <div>
      <Pair
        left={<><SecTitle>SOV vs Market share</SecTitle><SovBars sov={d.sov || []} ms={d.market_share || []} /></>}
        right={<><SecTitle>Weakness matrix</SecTitle><Heatmap competitors={competitors} /></>}
      />

      <Pair
        left={<><SecTitle>Competitive overview</SecTitle>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            {competitors.slice(0, 3).map((c, i) => (
              <div key={i} style={{ padding: "12px 14px", borderBottom: i < competitors.length - 1 ? `.5px solid ${C.border}` : "none", animation: `slideInUp .35s ease ${i * .08}s both` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: BRAND_COLORS[i % 4] }} />
                  <div style={{ fontSize: FS.body, fontWeight: 700, color: C.ink, flex: 1 }}>{c.name}</div>
                  <div style={{ fontSize: FS.bodyXs, color: C.muted }}>est. {c.est_budget}</div>
                </div>
                <div style={{ fontSize: FS.bodySm, color: C.muted, marginBottom: 6, lineHeight: 1.5 }}>{c.positioning}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {c.channels?.slice(0, 3).map((ch, j) => (
                    <span key={j} style={{ padding: "2px 7px", background: C.inset, borderRadius: 20, fontSize: FS.bodyXs, color: C.muted }}>{ch}</span>
                  ))}
                </div>
              </div>
            ))}
          </Card></>}
        right={<><SecTitle>Positioning map</SecTitle>
          {posMap.length > 0
            ? <PositioningMap brands={posMap} insight={d.positioning_insight} />
            : <Card><div style={{ fontSize: FS.bodySm, color: C.muted }}>No positioning data</div></Card>
          }</>}
      />

      {(d.market_gaps?.length ?? 0)>0 && (
        <div style={{ marginBottom: 9 }}>
          <SectionLabel>White space opportunities</SectionLabel>
          <Card>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 8 }}>
              {d.market_gaps.map((g, i) => (
                <div key={i} style={{ background: C.p100, borderRadius: 10, padding: "11px 13px", animation: `slideInUp .35s ease ${i * .07}s both` }}>
                  <div style={{ fontSize: FS.body, fontWeight: 700, color: C.p900, marginBottom: 4 }}>{g.title}</div>
                  <div style={{ fontSize: FS.bodyXs, color: C.p700, lineHeight: 1.55 }}>{g.description}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <FeedbackBar phase="competitive" outputRaw={raw} />
    </div>
  );
}
