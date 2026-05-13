"use client";

import { T, TY } from "@/lib/tokens";
import { PHASES, AGENTS, SEC_TITLES } from "@/lib/constants";
import { useMediaStudio } from "@/hooks/useMediaStudio";
import { TopNav } from "@/components/layout/TopNav";
import { RightPanel } from "@/components/layout/RightPanel";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { SecBriefing }    from "@/components/sections/SecBriefing";
import { SecAudience }    from "@/components/sections/SecAudience";
import { SecCompetitive } from "@/components/sections/SecCompetitive";
import { SecFunnel }      from "@/components/sections/SecFunnel";
import { SecChannel }     from "@/components/sections/SecChannel";
import { SecBudget }      from "@/components/sections/SecBudget";
import { SecMediaplan }   from "@/components/sections/SecMediaplan";
import { SecSynthesis }   from "@/components/sections/SecSynthesis";
import { ExportPDF } from "@/components/ui/ExportPDF";
import type { PhaseKey, SectionData } from "@/lib/types";
import type { ComponentType } from "react";

type SectionProps = { d: SectionData; raw: string };

const RENDERERS: Record<PhaseKey, ComponentType<SectionProps>> = {
  briefing:    SecBriefing    as ComponentType<SectionProps>,
  audience:    SecAudience    as ComponentType<SectionProps>,
  competitive: SecCompetitive as ComponentType<SectionProps>,
  funnel:      SecFunnel      as ComponentType<SectionProps>,
  channel:     SecChannel     as ComponentType<SectionProps>,
  budget:      SecBudget      as ComponentType<SectionProps>,
  mediaplan:   SecMediaplan   as ComponentType<SectionProps>,
  synthesis:   SecSynthesis   as ComponentType<SectionProps>,
};

const AGENT_DESCS: Record<string, string> = {
  briefing:    "Extracts goals & KPIs",
  audience:    "3 detailed personas",
  competitive: "SOV & market gaps",
  funnel:      "Customer journey",
  channel:     "Overlap & synergy",
  budget:      "Allocation & pacing",
  mediaplan:   "Full channel plan",
  synthesis:   "Strategy summary",
};

export default function Home() {
  const ms = useMediaStudio();
  const Renderer = ms.activeTab ? RENDERERS[ms.activeTab] : null;

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", display: "flex", flexDirection: "column", height: "100vh", background: T.bg, overflow: "hidden" }}>

      <TopNav
        outputs={ms.outputs}
        activePhase={ms.activePhase}
        activeTab={ms.activeTab}
        done={ms.done}
        started={ms.started}
        onTabClick={ms.setActiveTab}
        onReset={ms.reset}
        onShowReport={() => ms.setActiveTab("synthesis")}
      />

      {/* Demo banner */}
      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
        <div style={{ background: "#FEF3C7", borderBottom: "1px solid #FDE68A", padding: "6px 20px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 12 }}>🧪</span>
          <span style={{ fontSize: 11, color: "#92400E", fontWeight: 500 }}>
            Demo mode — showing example data for Vault. Add your <strong>ANTHROPIC_API_KEY</strong> in Vercel to use real AI.
          </span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", flex: 1, overflow: "hidden" }}>

        {/* ── Main content ── */}
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", background: T.bg }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 32px" }}>

            {/* Welcome screen */}
            {!ms.started && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, paddingTop: 16, animation: "fadeIn .4s ease" }}>
                {/* Left */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 38, fontWeight: 800, color: T.t1, letterSpacing: "-1.5px", lineHeight: 1.0, marginBottom: 8 }}>
                    <span style={{ fontWeight: 800 }}>Media</span><span style={{ fontWeight: 300 }}>Studio</span>
                  </div>
                  <div style={{ fontSize: 13, color: T.t3, marginBottom: 22, lineHeight: 1.65 }}>
                    8 AI agents transform your briefing into a complete media strategy document.
                  </div>
                  {ms.sessions.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ ...TY.cardLabel, marginBottom: 7 }}>Previous strategies</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {ms.sessions.map(s => (
                          <button key={s.id} onClick={() => ms.loadSession(s)} style={{ padding: "5px 12px", background: T.sur, borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(0,0,0,.12)", borderRadius: 20, fontSize: 11, color: T.t2, cursor: "pointer", fontFamily: "inherit" }}>
                            {s.brand} · {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ background: T.sur, borderRadius: 14, boxShadow: T.shad, padding: "16px 20px", marginBottom: 14, flex: 1 }}>
                    <div style={{ ...TY.cardLabel, color: T.pa, marginBottom: 8 }}>Briefing</div>
                    <textarea
                      value={ms.briefing} onChange={e => ms.setBriefing(e.target.value)}
                      placeholder="E.g. 'We are launching a new checking account. Target: men 25–35, Amsterdam. Budget €2M for 2026. Goal: max CPO €45 + brand awareness...'"
                      style={{ width: "100%", minHeight: 130, background: "transparent", borderWidth: 0, fontFamily: "inherit", fontSize: 13, lineHeight: 1.75, color: T.t1, resize: "none", outline: "none" }}
                    />
                  </div>
                  <button onClick={ms.start} disabled={!ms.briefing.trim()} style={{
                    display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px",
                    borderRadius: 8, borderWidth: 0, alignSelf: "flex-start",
                    background: ms.briefing.trim() ? T.pa : "#CCC",
                    color: "#fff", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                    cursor: ms.briefing.trim() ? "pointer" : "not-allowed", transition: "background .15s",
                  }}>Start media strategy →</button>
                </div>
                {/* Right: agent grid */}
                <div>
                  <div style={{ ...TY.cardLabel, marginBottom: 10 }}>8 agents</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                    {PHASES.map((ph, i) => {
                      const isLast = i === PHASES.length - 1;
                      return (
                        <div key={ph.key} style={{ background: isLast ? T.p1 : T.s2, borderRadius: 10, padding: "11px 13px" }}>
                          <div style={{ fontSize: 9, fontWeight: 600, color: isLast ? T.p4 : T.pa, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>
                            {String(i + 1).padStart(2, "0")}
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: isLast ? "#fff" : T.t1, marginBottom: 2 }}>{ph.label}</div>
                          <div style={{ fontSize: 10, color: isLast ? "rgba(255,255,255,.45)" : T.t3, lineHeight: 1.4 }}>{AGENT_DESCS[ph.key]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Spinner */}
            {ms.started && !ms.activeTab && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "70px 0", gap: 12 }}>
                <div style={{ width: 30, height: 30, border: "3px solid rgba(0,0,0,.07)", borderTopColor: T.pa, borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                <div style={{ fontSize: 13, color: T.t3 }}>Analysis started...</div>
              </div>
            )}

            {/* Section content */}
            {ms.activeTab && Renderer && ms.parsed[ms.activeTab] && (
              <div style={{ animation: "fadeIn .3s ease" }}>
                {/* Section header */}
                <div style={{ marginBottom: 16, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: T.pa, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 3 }}>
                      {String(PHASES.findIndex(p => p.key === ms.activeTab) + 1).padStart(2, "0")} — {AGENTS[PHASES.find(p => p.key === ms.activeTab)!.agent].label.toUpperCase()}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: T.t1, letterSpacing: "-.3px" }}>
                      {SEC_TITLES[ms.activeTab]}
                    </div>
                  </div>
                  {ms.activeTab === "synthesis" && ms.done && (
                    <ExportPDF outputs={ms.outputs} parsed={ms.parsed as Record<string, SectionData | null>} />
                  )}
                </div>
                <ErrorBoundary key={ms.activeTab}>
                  <Renderer d={ms.parsed[ms.activeTab] as SectionData} raw={ms.outputs[ms.activeTab] || ""} />
                </ErrorBoundary>
              </div>
            )}

            {/* Skeleton loader */}
            {ms.started && ms.activeTab && !ms.parsed[ms.activeTab] && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[75, 55, 68, 48, 62].map((w, i) => (
                  <div key={i} style={{ height: 12, background: "rgba(0,0,0,.06)", borderRadius: 6, width: `${w}%` }} />
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Right panel */}
        <RightPanel
          outputs={ms.outputs}
          activePhase={ms.activePhase}
          messages={ms.messages}
          questions={ms.questions}
          answer={ms.answer}
          setAnswer={ms.setAnswer}
          onAnswer={ms.handleAnswer}
          done={ms.done}
          running={ms.running}
        />

      </div>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg) } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}
