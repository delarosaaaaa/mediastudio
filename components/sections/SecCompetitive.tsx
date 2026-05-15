"use client";
import { useEffect, useState } from "react";
import { C, FS } from "@/lib/tokens";
import { FeedbackBar } from "@/components/ui/primitives";
import type { CompetitiveData, Competitor, PositioningBrand } from "@/lib/types";

const COLS = [C.p900, C.p700, C.p600, C.p300];

const SUBTABS = [
  { key: "markt", label: "① Marktpositie"      },
  { key: "pos",   label: "② Positioning & gaps" },
  { key: "deep",  label: "③ Diepteanalyse"      },
] as const;
type SubTab = typeof SUBTABS[number]["key"];

// ─── Hero card with accent line that follows the border-radius ─
function HeroCard({
  label, name, desc, accentColor,
}: {
  label: string; name: string; desc: string; accentColor: string;
}) {
  return (
    <div style={{ flex: 1, background: C.white, borderRadius: 14, boxShadow: `0 2px 10px rgba(0,0,0,.07)`, overflow: "hidden" }}>
      {/* Accent line — inside overflow:hidden so it follows the radius */}
      <div style={{ height: 3, background: accentColor, borderRadius: "14px 14px 0 0" }} />
      <div style={{ padding: "16px 20px" }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".12em", marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 500, color: C.ink, letterSpacing: "-.5px", marginBottom: 6 }}>{name}</div>
        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.65 }}>{desc}</div>
      </div>
    </div>
  );
}

// ─── White space gap card with accent line ─────────────────────
function GapCard({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, boxShadow: `0 2px 10px rgba(0,0,0,.07)`, overflow: "hidden" }}>
      <div style={{ height: 3, background: C.p900, borderRadius: "14px 14px 0 0" }} />
      <div style={{ padding: "16px 18px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.p700, marginBottom: 6 }}>{num}</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.ink, marginBottom: 6, lineHeight: 1.35 }}>{title}</div>
        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.65 }}>{desc}</div>
      </div>
    </div>
  );
}

// ─── SOV rows with zebra striping ─────────────────────────────
function SovRows({ d }: { d: CompetitiveData }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 200); return () => clearTimeout(t); }, []);
  const sov = d.sov || [];
  const ms  = d.market_share || [];

  return (
    <div>
      {sov.map((b, i) => {
        const msVal = ms[i]?.pct ?? 0;
        const over  = b.pct > msVal;
        const under = msVal > b.pct + 5;
        const diff  = Math.abs(b.pct - msVal);
        const bname = b.brand ?? b.name ?? `Merk ${i + 1}`;
        const col   = COLS[i % 4];
        const zebra = i % 2 === 1;
        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 14, alignItems: "center", padding: "14px 20px", background: zebra ? C.inset : C.white }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: col, flexShrink: 0 }} />
                <div style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{bname}</div>
              </div>
              <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 500, background: over ? "#FCEBEB" : under ? "#EAF3DE" : zebra ? C.white : C.inset, color: over ? "#A32D2D" : under ? "#27500A" : C.muted }}>
                {over ? `+${diff}% over-indexeert` : under ? `+${diff}% under-indexeert` : "In balans"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 11, color: C.muted, width: 100, flexShrink: 0 }}>Share of Voice</div>
                <div style={{ flex: 1, height: 6, background: zebra ? C.border : C.inset, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: col, width: on ? `${Math.min(b.pct * 1.6, 98)}%` : "0%", transition: `width 1s cubic-bezier(.4,0,.2,1) ${i * .1}s` }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.ink, width: 32, textAlign: "right" }}>{b.pct}%</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 11, color: C.muted, width: 100, flexShrink: 0 }}>Market Share</div>
                <div style={{ flex: 1, height: 6, background: zebra ? C.border : C.inset, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: col, opacity: .4, width: on ? `${Math.min(msVal * 1.6, 98)}%` : "0%", transition: `width 1s cubic-bezier(.4,0,.2,1) ${i * .1 + .15}s` }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.ink, width: 32, textAlign: "right" }}>{msVal}%</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Positioning map ──────────────────────────────────────────
function PosMap({ brands, insight }: { brands: PositioningBrand[]; insight?: string }) {
  const [vis, setVis] = useState(false);
  const [hov, setHov] = useState<string | null>(null);
  useEffect(() => { const t = setTimeout(() => setVis(true), 100); return () => clearTimeout(t); }, []);
  const vault = brands.find(b => b.name.toLowerCase().includes("vault"));

  return (
    <div style={{ background: C.white, borderRadius: 14, boxShadow: `0 2px 10px rgba(0,0,0,.07)`, overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "18px 20px 14px" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: C.ink, marginBottom: 4 }}>Positioning map</div>
        <div style={{ fontSize: 11, color: C.muted }}>Hover voor positioneringstoelichting</div>
      </div>
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 4 }}>
          <span>← Traditioneel</span><span>Innovatief →</span>
        </div>
      </div>
      <div style={{ position: "relative", height: 240, margin: "0 20px" }}>
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: C.border }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: C.border }} />
        <span style={{ position: "absolute", top: 6, left: 4, fontSize: 10, color: C.muted }}>Premium</span>
        <span style={{ position: "absolute", bottom: 6, left: 4, fontSize: 10, color: C.muted }}>Accessible</span>
        {vault && (
          <div style={{ position: "absolute", left: `${vault.x}%`, top: `${100 - vault.y}%`, width: 100, height: 80, border: `1.5px dashed ${C.p700}`, borderRadius: "50%", background: `${C.p700}05`, transform: "translate(-50%,-50%)", opacity: vis ? 1 : 0, transition: "opacity .6s .4s" }} />
        )}
        {brands.map((b, i) => {
          const isV = b.name.toLowerCase().includes("vault");
          const col = b.color ?? COLS[i % 4];
          const size = isV ? 44 : 36;
          return (
            <div key={i}
              onMouseEnter={() => setHov(b.name)}
              onMouseLeave={() => setHov(null)}
              style={{ position: "absolute", left: `${b.x}%`, top: `${100 - b.y}%`, width: size, height: size, borderRadius: "50%", background: col, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 500, color: "#fff", transform: `translate(-50%,-50%) scale(${vis ? 1 : 0})`, transition: `transform .45s cubic-bezier(.34,1.56,.64,1) ${i * .1}s`, boxShadow: isV ? `0 0 0 3px #fff, 0 0 0 5px ${C.p700}` : "none", cursor: "pointer", zIndex: hov === b.name ? 10 : 1 }}>
              {b.name.slice(0, 2)}
            </div>
          );
        })}
      </div>
      <div style={{ margin: "12px 20px 18px", padding: "10px 14px", background: C.inset, borderRadius: 9, fontSize: 11, color: hov ? C.ink : C.muted, minHeight: 34, transition: "color .2s" }}>
        {hov ? (brands.find(b => b.name === hov)?.name + (insight ? " — " + insight : "")) : "Hover over een merk voor positionering"}
      </div>
    </div>
  );
}

// ─── Score matrix + detail panel ──────────────────────────────
function ScoreMatrix({ competitors, sov }: { competitors: Competitor[]; sov: CompetitiveData["sov"] }) {
  const [sel, setSel] = useState<number | null>(null);
  const dims = ["UX", "Vertrouwen", "Prijs", "Dutch", "ZZP"];

  function score(c: Competitor, dim: string): number {
    const n = c.name.toLowerCase();
    if (dim === "UX")         return n.includes("ing") || n.includes("rabo") || n.includes("nationale") || n.includes("abn") ? 2 : 4;
    if (dim === "Vertrouwen") return n.includes("ing") || n.includes("rabo") || n.includes("nationale") || n.includes("abn") ? 5 : n.includes("bunq") ? 3 : 2;
    if (dim === "Prijs")      return n.includes("revolut") || n.includes("n26") || n.includes("knab") ? 4 : n.includes("bunq") ? 1 : 2;
    if (dim === "Dutch")      return n.includes("ing") || n.includes("rabo") || n.includes("nationale") || n.includes("abn") ? 5 : n.includes("bunq") ? 3 : 1;
    if (dim === "ZZP")        return n.includes("ing") || n.includes("rabo") || n.includes("nationale") ? 2 : 1;
    return 2;
  }

  const labels = ["", "Zwak", "Matig", "Gemiddeld", "Sterk", "Dominant"];
  const selComp = sel !== null ? competitors[sel] : null;
  const selSov  = sel !== null ? sov[sel] : null;

  return (
    <div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>Klik een concurrent voor het volledige profiel</div>

      {/* Matrix */}
      <div style={{ background: C.white, borderRadius: 14, boxShadow: `0 2px 10px rgba(0,0,0,.07)`, overflow: "hidden", marginBottom: 14 }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: `160px ${dims.map(() => "1fr").join(" ")}`, background: C.inset, padding: "11px 18px", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: C.muted }}>Concurrent</div>
          {dims.map(d => <div key={d} style={{ fontSize: 11, fontWeight: 500, color: C.muted, textAlign: "center" }}>{d}</div>)}
        </div>

        {/* Rows */}
        {competitors.slice(0, 6).map((c, i) => {
          const zebra = i % 2 === 1;
          const isSel = sel === i;
          return (
            <div key={i} onClick={() => setSel(sel === i ? null : i)}
              style={{
                display: "grid", gridTemplateColumns: `160px ${dims.map(() => "1fr").join(" ")}`,
                padding: "13px 18px", gap: 8,
                background: isSel ? C.inset : zebra ? "#F8F7F4" : C.white,
                borderLeft: isSel ? `3px solid ${C.p700}` : "3px solid transparent",
                cursor: "pointer", transition: "background .15s", alignItems: "center",
                borderTop: `.5px solid ${C.border}`,
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: COLS[i % 4], flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: C.ink }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{c.est_budget}</div>
                </div>
              </div>
              {dims.map(d => {
                const v = score(c, d);
                return (
                  <div key={d} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <div style={{ width: "100%", height: 5, background: zebra ? C.border : C.inset, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 3, background: COLS[i % 4], width: `${v / 5 * 100}%` }} />
                    </div>
                    <div style={{ fontSize: 9, color: C.muted }}>{labels[v]}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Detail panel */}
      {selComp && (
        <div style={{ background: C.white, borderRadius: 14, boxShadow: `0 2px 10px rgba(0,0,0,.07)`, overflow: "hidden", animation: "slideInUp .3s ease" }}>
          {/* Head */}
          <div style={{ padding: "18px 20px", borderBottom: `.5px solid ${C.border}`, display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: COLS[sel! % 4], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 500, color: "#fff", flexShrink: 0 }}>
              {selComp.name.slice(0, 2)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 500, color: C.ink, marginBottom: 4 }}>{selComp.name}</div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>{selComp.positioning}</div>
            </div>
            {selSov && (
              <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: C.p100, color: C.p700, flexShrink: 0 }}>SOV {selSov.pct}%</span>
            )}
          </div>

          {/* Insight — left accent via border-left on a nested box */}
          {selSov?.insight && (
            <div style={{ margin: "0", padding: "13px 20px 13px 17px", background: C.inset, borderBottom: `.5px solid ${C.border}`, borderLeft: `3px solid ${C.p700}`, fontSize: 11, color: C.muted, lineHeight: 1.65 }}>
              {selSov.insight}
            </div>
          )}

          {/* 3-col body */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
            {[
              ["Sterke punten", selComp.strengths?.join(" · ") ?? "—"],
              ["Zwakte voor Vault", selComp.weaknesses?.join(" · ") ?? "—"],
              ["Kanalen", selComp.channels?.join(" · ") ?? "—"],
            ].map(([lbl, val], i) => (
              <div key={lbl} style={{ padding: "13px 18px", borderRight: i < 2 ? `.5px solid ${C.border}` : "none", borderTop: `.5px solid ${C.border}` }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 5 }}>{lbl}</div>
                <div style={{ fontSize: 11, color: C.ink, lineHeight: 1.55 }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Recent ads */}
          {(selComp.recent_ads?.length ?? 0) > 0 && (
            <div style={{ padding: "13px 18px", borderTop: `.5px solid ${C.border}` }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 10 }}>Recente campagnes</div>
              {selComp.recent_ads.map((ad, j) => (
                <div key={j} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: j < selComp.recent_ads.length - 1 ? `.5px solid ${C.border}` : "none", alignItems: "flex-start" }}>
                  <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 10, background: C.inset, color: C.muted, whiteSpace: "nowrap", flexShrink: 0 }}>{ad.format} · {ad.platform}</span>
                  <div>
                    <div style={{ fontSize: 11, color: C.ink, lineHeight: 1.5 }}>{ad.description}</div>
                    {ad.angle && <div style={{ fontSize: 10, color: C.muted, fontStyle: "italic", marginTop: 2 }}>{ad.angle}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────
export function SecCompetitive({ d, raw }: { d: CompetitiveData; raw: string }) {
  const [sub, setSub] = useState<SubTab>("markt");
  const competitors = d.competitors || [];
  const posMap      = (d.positioning_map || []) as PositioningBrand[];
  const sov         = d.sov || [];
  const ms          = d.market_share || [];

  // Compute biggest opportunity (under-invests) and threat (over-invests)
  let biggestUnder = { name: "", diff: -1 };
  let biggestOver  = { name: "", diff: -1 };
  sov.forEach((b, i) => {
    const msv  = ms[i]?.pct ?? 0;
    const name = b.brand ?? b.name ?? "";
    const underDiff = msv - b.pct;
    const overDiff  = b.pct - msv;
    if (underDiff > biggestUnder.diff) biggestUnder = { name, diff: underDiff };
    if (overDiff  > biggestOver.diff)  biggestOver  = { name, diff: overDiff };
  });

  return (
    <div>
      {/* Subtab nav */}
      <div style={{ display: "flex", gap: 2, marginBottom: 20, borderBottom: `.5px solid ${C.border}` }}>
        {SUBTABS.map(t => (
          <button key={t.key} onClick={() => setSub(t.key)} style={{ padding: "6px 16px", border: "none", background: "transparent", fontSize: FS.bodySm, fontWeight: sub === t.key ? 700 : 500, color: sub === t.key ? C.p700 : C.muted, cursor: "pointer", borderBottom: `2px solid ${sub === t.key ? C.p700 : "transparent"}`, marginBottom: -1, transition: "color .2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div key={sub} style={{ animation: "slideInRight .3s ease" }}>

        {/* ── TAB 1: MARKTPOSITIE ── */}
        {sub === "markt" && (
          <div>
            {/* Hero cards */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              {biggestUnder.name && (
                <HeroCard
                  label="Grootste kans"
                  name={biggestUnder.name}
                  accentColor={C.p900}
                  desc={`Under-investeert in media met +${biggestUnder.diff}% verschil tussen marktaandeel en SOV. Klanten worden niet actief vastgehouden.`}
                />
              )}
              {biggestOver.name && (
                <HeroCard
                  label="Grootste dreiging"
                  name={biggestOver.name}
                  accentColor="#7F1D1D"
                  desc={`Over-indexeert op SOV met +${biggestOver.diff}% boven marktaandeel. Investeert agressief om markt te winnen.`}
                />
              )}
            </div>

            {/* SOV card */}
            <div style={{ background: C.white, borderRadius: 14, boxShadow: `0 2px 10px rgba(0,0,0,.07)`, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ padding: "16px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `.5px solid ${C.border}` }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>Share of Voice vs Market Share</div>
                <div style={{ display: "flex", gap: 14 }}>
                  {([[C.p700, "Share of Voice"], [`${C.p700}55`, "Market Share"]] as [string, string][]).map(([col, lbl]) => (
                    <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: C.muted }}>
                      <div style={{ width: 18, height: 5, borderRadius: 3, background: col }} />{lbl}
                    </div>
                  ))}
                </div>
              </div>
              <SovRows d={d} />
            </div>

            {/* Strategic insight */}
            {d.sov_insight && (
              <div style={{ padding: "13px 17px", background: C.inset, borderRadius: 12, borderLeft: `3px solid ${C.p700}`, fontSize: 12, color: C.muted, lineHeight: 1.65 }}>
                {d.sov_insight}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: POSITIONING ── */}
        {sub === "pos" && (
          <div>
            {posMap.length > 0
              ? <PosMap brands={posMap} insight={d.positioning_insight} />
              : <div style={{ background: C.white, borderRadius: 14, padding: "40px 20px", textAlign: "center", color: C.muted, fontSize: FS.bodySm, marginBottom: 16, boxShadow: `0 2px 10px rgba(0,0,0,.07)` }}>Geen positioning data beschikbaar</div>
            }
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: ".09em", marginBottom: 12 }}>White space — niemand ownt dit nu</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {(d.market_gaps || []).map((g, i) => (
                <GapCard key={i} num={`0${i + 1}`} title={g.title} desc={g.description} />
              ))}
              {(d.white_space || []).map((w, i) => (
                <GapCard key={`ws-${i}`} num={`0${(d.market_gaps?.length ?? 0) + i + 1}`} title={w.label} desc="" />
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: DIEPTEANALYSE ── */}
        {sub === "deep" && (
          <ScoreMatrix competitors={competitors} sov={sov} />
        )}
      </div>

      <FeedbackBar phase="competitive" outputRaw={raw} />
    </div>
  );
}
