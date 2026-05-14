// Single source of truth for section renderers.
// Both page.tsx and ExportPDF import from here.
// Adding/removing a section? Change ONLY this file.

import type { ComponentType } from "react";
import type { PhaseKey, SectionData } from "@/lib/types";

import { SecBriefing }    from "@/components/sections/SecBriefing";
import { SecAudience }    from "@/components/sections/SecAudience";
import { SecMarket }      from "@/components/sections/SecMarket";
import { SecCompetitive } from "@/components/sections/SecCompetitive";
import { SecStrategy }    from "@/components/sections/SecStrategy";
import { SecBudget }      from "@/components/sections/SecBudget";
import { SecMediaplan }   from "@/components/sections/SecMediaplan";
import { SecSynthesis }   from "@/components/sections/SecSynthesis";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SectionProps = {
  d:       any;
  raw:     string;
  outputs?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsed?:  Record<string, any>;
};

export const RENDERERS: Record<PhaseKey, ComponentType<SectionProps>> = {
  briefing:    SecBriefing,
  audience:    SecAudience,
  market:      SecMarket,
  competitive: SecCompetitive,
  strategy:    SecStrategy,
  budget:      SecBudget,
  mediaplan:   SecMediaplan,
  synthesis:   SecSynthesis,
};
