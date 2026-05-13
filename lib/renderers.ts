// Single source of truth for section renderers - used by page.tsx AND ExportPDF
// If you add/remove a section, change it here only.
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

export type SectionProps = { d: SectionData; raw: string };

export const RENDERERS: Record<PhaseKey, ComponentType<SectionProps>> = {
  briefing:    SecBriefing    as ComponentType<SectionProps>,
  audience:    SecAudience    as ComponentType<SectionProps>,
  market:      SecMarket      as ComponentType<SectionProps>,
  competitive: SecCompetitive as ComponentType<SectionProps>,
  strategy:    SecStrategy    as ComponentType<SectionProps>,
  budget:      SecBudget      as ComponentType<SectionProps>,
  mediaplan:   SecMediaplan   as ComponentType<SectionProps>,
  synthesis:   SecSynthesis   as ComponentType<SectionProps>,
};
