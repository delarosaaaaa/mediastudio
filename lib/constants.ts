import type { Phase, PhaseKey } from "./types";

export const PHASES: Phase[] = [
  { key: "briefing",    label: "Briefing",     agent: "analyst"     },
  { key: "audience",    label: "Audience",     agent: "audience"    },
  { key: "market",      label: "Market",       agent: "market"      },
  { key: "competitive", label: "Competitive",  agent: "competitive" },
  { key: "strategy",    label: "Strategy",     agent: "strategy"    },
  { key: "budget",      label: "Budget",       agent: "budget"      },
  { key: "mediaplan",   label: "Media Plan",   agent: "mediaplan"   },
  { key: "synthesis",   label: "Final Report", agent: "synthesizer" },
];

export const AGENTS: Record<string, { label: string }> = {
  analyst:     { label: "Briefing Analyst"  },
  audience:    { label: "Audience Agent"    },
  market:      { label: "Market Agent"      },
  competitive: { label: "Competitive Agent" },
  strategy:    { label: "Strategy Agent"    },
  budget:      { label: "Budget Agent"      },
  mediaplan:   { label: "Media Planner"     },
  synthesizer: { label: "Synthesizer"       },
};

export const SEC_TITLES: Record<PhaseKey, string> = {
  briefing:    "Introduction & Objectives",
  audience:    "Audience Analysis",
  market:      "Market Analysis",
  competitive: "Competitive Analysis",
  strategy:    "Media Strategy",
  budget:      "Budget & Pacing",
  mediaplan:   "Media Plan",
  synthesis:   "Final Report",
};
