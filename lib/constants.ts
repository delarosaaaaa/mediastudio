import type { Phase, PhaseKey } from "./types";

export const PHASES: Phase[] = [
  { key: "briefing",    label: "Briefing",     agent: "analyst"     },
  { key: "audience",    label: "Audience",     agent: "audience"    },
  { key: "competitive", label: "Competitive",  agent: "competitive" },
  { key: "funnel",      label: "Funnel",       agent: "funnel"      },
  { key: "channel",     label: "Channels",     agent: "channel"     },
  { key: "budget",      label: "Budget",       agent: "budget"      },
  { key: "mediaplan",   label: "Media Plan",   agent: "mediaplan"   },
  { key: "synthesis",   label: "Final Report", agent: "synthesizer" },
];

export const AGENTS: Record<string, { label: string }> = {
  analyst:     { label: "Briefing Analyst"  },
  audience:    { label: "Audience Agent"    },
  competitive: { label: "Competitive Agent" },
  funnel:      { label: "Funnel Agent"      },
  channel:     { label: "Channel Agent"     },
  budget:      { label: "Budget Agent"      },
  mediaplan:   { label: "Media Planner"     },
  synthesizer: { label: "Synthesizer"       },
};

export const SEC_TITLES: Record<PhaseKey, string> = {
  briefing:    "Introduction & Objectives",
  audience:    "Audience Analysis",
  competitive: "Competitive Analysis",
  funnel:      "Customer Journey",
  channel:     "Channel Strategy",
  budget:      "Budget Allocation",
  mediaplan:   "Media Plan",
  synthesis:   "Final Report",
};
