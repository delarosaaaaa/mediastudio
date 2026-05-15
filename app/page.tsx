"use client";

import { useRef, useEffect } from "react";
import { C, FS } from "@/lib/tokens";
import { PHASES, AGENTS, SEC_TITLES, AGENT_DESCS } from "@/lib/constants";
import { RENDERERS } from "@/lib/renderers";
import { useMediaStudio } from "@/hooks/useMediaStudio";
import { TopNav }        from "@/components/layout/TopNav";
import { RightPanel }    from "@/components/layout/RightPanel";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ExportPDF }     from "@/components/ui/ExportPDF";

export default function Home() {
  const ms       = useMediaStudio();
  const Renderer = ms.activeTab ? RENDERERS[ms.activeTab] : null;
  const prevTab  = useRef<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Slide transition on tab change
  useEffect(() => {
    if (!ms.activeTab || !contentRef.current) return;
    const el = contentRef.current;
    const isForward = !prevTab.current ||
      PHASES.findIndex(p => p.key === ms.activeTab) >
      PHASES.findIndex(p => p.key === prevTab.current);

    el.style.opacity = "0";
    el.style.transform = isForward ? "translateX(18px)" : "translateX(-18px)";
    el.style.transition = "none";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "opacity .32s ease, transform .32s ease";
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    });
    prevTab.current = ms.activeTab;
  }, [ms.activeTab]);

  // Scroll to top on tab change
  useEffect(() => {
    const scroller = contentRef.current?.parentElement;
    if (scroller) scroller.scrollTop = 0;
  }, [ms.activeTab]);

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", display: "flex", flexDirection: "column", height: "100vh", background: C.pageBg, overflow: "hidden" }}>

      <TopNav
        outputs={ms.outputs}
        activeTab={ms.activeTab}
        done={ms.done}
        started={ms.started}
        onTabClick={ms.setActiveTab}
        onReset={ms.reset}
        onShowReport={() => ms.setActiveTab("synthesis")}
      />

      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
        <div style={{ background: "#FEF3C7", borderBottom: "1px solid #FDE68A", padding: "6px 20px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span>🧪</span>
          <span style={{ fontSize: FS.bodySm, color: "#92400E", fontWeight: 500 }}>
            Demo mode — Add <strong>GEMINI_API_KEY</strong> to Vercel for live AI.
          </span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 256px", flex: 1, overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 26px 40px" }}>

            {/* Welcome */}
            {!ms.started && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, paddingTop: 8, animation: "fadeIn .4s ease" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: FS.welcomeTitle, fontWeight: 800, color: C.ink, letterSpacing: "-1.5px", lineHeight: 1, marginBottom: 8 }}>
                    <span style={{ fontWeight: 800 }}>Media</span><span style={{ fontWeight: 300 }}>Studio</span>
                  </div>
                  <div style={{ fontSize: FS.bodyLg, color: C.muted, marginBottom: 24, lineHeight: 1.7 }}>
                    8 AI agents transform your briefing into a complete media strategy.
                  </div>
                  {ms.sessions.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Previous strategies</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {ms.sessions.map(s => (
                          <button key={s.id} onClick={() => ms.loadSession(s)} style={{ padding: "5px 13px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, fontSize: FS.bodySm, color: C.body, boxShadow: C.shadowSm }}>
                            {s.brand} · {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, padding: "16px 20px", marginBottom: 16, flex: 1 }}>
                    <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.p600, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Briefing</div>
                    <textarea
                      value={ms.briefing} onChange={e => ms.setBriefing(e.target.value)}
                      placeholder="E.g. 'We are launching a new checking account. Target: men 25–35, Amsterdam. Budget €2M for 2026. Goal: max CPO €45 + brand awareness...'"
                      style={{ width: "100%", minHeight: 140, background: "transparent", border: "none", fontSize: FS.bodyLg, lineHeight: 1.75, color: C.ink }}
                    />
                  </div>
                  <button
                    onClick={ms.start}
                    disabled={!ms.briefing.trim()}
                    style={{
                      alignSelf: "flex-start", padding: "10px 24px", borderRadius: 9, border: "none",
                      background: ms.briefing.trim() ? C.p700 : C.faint,
                      color: "#fff", fontSize: FS.bodyLg, fontWeight: 700,
                      cursor: ms.briefing.trim() ? "pointer" : "not-allowed",
                      position: "relative", overflow: "hidden",
                    }}
                  >
                    Start media strategy →
                    {ms.briefing.trim() && (
                      <span style={{
                        position: "absolute", inset: 0, borderRadius: 9,
                        border: `2px solid ${C.p400}`,
                        animation: "pulseRing 1.5s ease infinite",
                        pointerEvents: "none",
                      }} />
                    )}
                  </button>
                </div>

                <div>
                  <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>8 agents</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                    {PHASES.map((ph, i) => {
                      const last = i === PHASES.length - 1;
                      return (
                        <div key={ph.key} style={{
                          background: last ? C.p900 : C.white,
                          borderRadius: 12, padding: "12px 14px",
                          boxShadow: last ? "none" : C.shadowSm,
                          animation: `slideInUp .4s ease ${i * .06}s both`,
                          transition: "transform .2s, box-shadow .2s",
                        }}>
                          <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: last ? C.p400 : C.p600, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 }}>
                            {String(i + 1).padStart(2, "0")}
                          </div>
                          <div style={{ fontSize: FS.body, fontWeight: 700, color: last ? "#fff" : C.ink, marginBottom: 3 }}>{ph.label}</div>
                          <div style={{ fontSize: FS.bodyXs, color: last ? "rgba(255,255,255,.4)" : C.muted }}>{AGENT_DESCS[ph.key]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Spinner */}
            {ms.started && !ms.activeTab && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 12 }}>
                <div style={{ width: 28, height: 28, border: `3px solid ${C.inset}`, borderTopColor: C.p700, borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                <div style={{ fontSize: FS.bodyLg, color: C.muted }}>Analysis started...</div>
              </div>
            )}

            {/* Section content */}
            {ms.activeTab && Renderer && ms.parsed[ms.activeTab] && (
              <div ref={contentRef}>
                <div style={{ marginBottom: 18, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: FS.sectionNum, fontWeight: 700, color: C.p400, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>
                      {String(PHASES.findIndex(p => p.key === ms.activeTab) + 1).padStart(2, "0")} — {AGENTS[(PHASES.find(p => p.key === ms.activeTab) ?? PHASES[0]).agent].label.toUpperCase()}
                    </div>
                    <div style={{ fontSize: FS.sectionTitle, fontWeight: 800, color: C.ink, letterSpacing: "-.4px", lineHeight: 1.1 }}>
                      {SEC_TITLES[ms.activeTab]}
                    </div>
                  </div>
                  {ms.activeTab === "synthesis" && ms.done && (
                    <ExportPDF outputs={ms.outputs} parsed={ms.parsed} />
                  )}
                </div>
                <ErrorBoundary key={ms.activeTab}>
                  <Renderer
                    d={ms.parsed[ms.activeTab]}
                    raw={ms.outputs[ms.activeTab] || ""}
                    outputs={ms.activeTab === "synthesis" ? ms.outputs : undefined}
                    parsed={ms.activeTab === "synthesis" ? ms.parsed : undefined}
                  />
                </ErrorBoundary>
              </div>
            )}

            {/* Skeleton */}
            {ms.started && ms.activeTab && !ms.parsed[ms.activeTab] && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[75, 50, 65, 45, 60].map((w, i) => (
                  <div key={i} style={{ height: 12, background: "rgba(0,0,0,.07)", borderRadius: 6, width: `${w}%`, animation: "pulse 1.5s ease infinite" }} />
                ))}
              </div>
            )}
          </div>
        </div>

        <RightPanel
          messages={ms.messages}
          questions={ms.questions}
          answer={ms.answer}
          setAnswer={ms.setAnswer}
          onAnswer={ms.handleAnswer}
          done={ms.done}
          running={ms.running}
        />
      </div>
    </div>
  );
}
