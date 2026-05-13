import { T, TY } from "@/lib/tokens";
import { PHASES, AGENTS, SEC_TITLES } from "@/lib/constants";
import type { PhaseKey } from "@/lib/types";

interface Props { phase: PhaseKey; }

export function SectionHeader({ phase }: Props) {
  const ph    = PHASES.find(p => p.key === phase)!;
  const idx   = PHASES.findIndex(p => p.key === phase) + 1;
  const agent = AGENTS[ph.agent].label;
  const title = SEC_TITLES[phase];

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ ...TY.cardLabel, color: T.pa, marginBottom: 3 }}>
        {String(idx).padStart(2, "0")} — {agent.toUpperCase()}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: T.t1, letterSpacing: "-.3px", lineHeight: 1.1 }}>
        {title}
      </div>
    </div>
  );
}
