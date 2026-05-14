import type { PhaseKey } from "./types";

// Version tracking — bump when you improve a prompt
export const PROMPT_VERSIONS: Record<PhaseKey, string> = {
  briefing:    "v1",
  audience:    "v1",
  market:      "v1",
  competitive: "v1",
  strategy:    "v1",
  budget:      "v1",
  mediaplan:   "v1",
  synthesis:   "v1",
};

// ─── Prompt builder ───────────────────────────────────────────

export function buildPrompt(
  key: PhaseKey,
  briefing: string,
  outputs: Record<string, string>,
  extra = ""
): string {
  const ctx = Object.entries(outputs)
    .map(([k, v]) => `[${k}]\n${v}`)
    .join("\n\n");

  const prompt = PROMPTS[key](briefing, ctx);
  return extra ? `${prompt}\n\nADDITIONAL CONTEXT:\n${extra}` : prompt;
}

// ─── Individual prompts ───────────────────────────────────────

const PROMPTS: Record<PhaseKey, (briefing: string, ctx: string) => string> = {

  briefing: (briefing) => `You are a senior media strategy expert. Analyse the briefing below.

RULES:
- Ask ONLY for missing facts: brand name, budget, target audience, campaign duration, geography.
- NEVER ask about strategy, channel selection, or budget allocation — you decide that.
- Respond ONLY in JSON, no extra text before or after.
- For each missing fact, write on a SEPARATE line: CLIENT_QUESTION: [question]

JSON schema:
{"brand":"","intro":"professional 3-4 sentence summary","business_goals":[{"goal":"","target":"","metric":""}],"marketing_goals":[{"kpi":"","target":""}],"params":{"budget":"","duration":"","geo":"","timing":""}}

BRIEFING: ${briefing}`,

  audience: (briefing, ctx) => `You are a senior audience strategist. Create exactly 3 rich personas + a total audience profile. Respond ONLY in JSON:

{"total":{"name":"Total Audience","age_range":"25-38","jobs":"Knowledge workers, freelancers","income":"€35-70K/year","daily_media_hours":"4.8 hours","size_estimate":"~280,000","motivations":["motivation 1","motivation 2","motivation 3"],"pain_points":["pain 1","pain 2","pain 3"],"platforms":["Instagram","YouTube","Google Search"]},"personas":[{"name":"First name","age":"28","job":"Job title at company type","income":"€XX/year gross","daily_media_hours":"X.X hours","mindset":"2-3 sentence description of mindset, digital behaviour and relationship with money/banking","motivations":["specific motivation 1","specific motivation 2","specific motivation 3"],"pain_points":["specific pain 1","specific pain 2","specific pain 3"],"trigger_moments":["specific trigger 1","specific trigger 2","specific trigger 3","specific trigger 4"],"platforms":["Platform1","Platform2","Platform3"],"trust_builders":["trust element 1","trust element 2","trust element 3","trust element 4"],"recommended":true},{"name":"Second name","age":"33","job":"Job title","income":"€XX/year","daily_media_hours":"X hours","mindset":"mindset description","motivations":["motivation 1","motivation 2","motivation 3"],"pain_points":["pain 1","pain 2","pain 3"],"trigger_moments":["trigger 1","trigger 2","trigger 3"],"platforms":["Platform1","Platform2"],"trust_builders":["trust 1","trust 2","trust 3"],"recommended":false},{"name":"Third name","age":"26","job":"Job title","income":"€XX/year","daily_media_hours":"X hours","mindset":"mindset description","motivations":["motivation 1","motivation 2","motivation 3"],"pain_points":["pain 1","pain 2","pain 3"],"trigger_moments":["trigger 1","trigger 2","trigger 3"],"platforms":["Platform1","Platform2","Platform3"],"trust_builders":["trust 1","trust 2"],"recommended":false}],"barriers":[{"barrier":"barrier 1","solution":"solution 1"},{"barrier":"barrier 2","solution":"solution 2"},{"barrier":"barrier 3","solution":"solution 3"}]}

IMPORTANT:
- Mark exactly ONE persona as recommended:true (the highest-value target)
- mindset should be 2-3 sentences, specific and insightful
- trigger_moments should be concrete situations, not abstract
- trust_builders should be specific to the brand/product
- Make personas clearly distinct from each other
BRIEFING: ${briefing}
CONTEXT: ${ctx}`,

  competitive: (briefing, ctx) => `You are a competitive intelligence expert. Respond ONLY in JSON:

{"competitors":[{"name":"","est_budget":"","channels":[""],"positioning":"","strengths":["",""],"weaknesses":["",""],"sov_pct":0,"market_share_pct":0,"recent_ads":[{"format":"","platform":"","description":"","angle":""},{"format":"","platform":"","description":"","angle":""}]}],"sov":[{"brand":"","pct":0}],"market_share":[{"brand":"","pct":0}],"market_gaps":[{"title":"","description":""}]}

Provide 3–4 competitors. recent_ads are based on publicly known recent campaigns (last 30 days).
CONTEXT: ${briefing}
${ctx}`,

  market: (briefing, ctx) => `You are a market analyst. Respond ONLY in JSON:

{"tam":"€2.4B","sam":"€380M","target_size":"~280,000 users","growth":"+18% YoY","segments":[{"name":"Urban professionals","pct":42},{"name":"Freelancers / ZZP","pct":31},{"name":"Students / starters","pct":27}],"trends":[{"direction":"up","title":"Mobile-first banking accelerating","description":"stat or insight"},{"direction":"up","title":"Fee sensitivity rising","description":"stat or insight"},{"direction":"down","title":"Trust in incumbents declining","description":"stat or insight"}],"opportunities":[{"title":"Gap title","description":"detailed explanation"},{"title":"Gap title","description":"detailed explanation"},{"title":"Gap title","description":"detailed explanation"}],"positioning_space":"1-2 sentence positioning opportunity for the brand"}

direction must be: up, down, or neutral. Provide 3 trends and 3 opportunities specific to the brand's market.
CONTEXT: ${briefing}
${ctx}`,

  strategy: (briefing, ctx) => `You are a media strategy expert combining funnel planning and channel strategy. Respond ONLY in JSON:

{"stages":[{"name":"Awareness","goal":"goal","channels":["YouTube Pre-roll","Meta Video"],"kpi":"Impressions / Aided Awareness","target":"42M impressions · 40% awareness","message_type":"Emotional brand story","budget_pct":40,"conversion_rate":"4.2% click-through"},{"name":"Consideration","goal":"goal","channels":["Google Search","Meta Carousel"],"kpi":"Website visits","target":"180K visits","message_type":"Rational comparison","budget_pct":30,"conversion_rate":"28% to download"},{"name":"Conversion","goal":"goal","channels":["Google Search brand","Meta Retargeting"],"kpi":"Account openings / CPA","target":"44,000 accounts · CPA ≤ €45","message_type":"Urgency + social proof","budget_pct":22,"conversion_rate":"46% complete onboarding"},{"name":"Retention","goal":"goal","channels":["Push","Email"],"kpi":"Activation / 30-day retention","target":"75% activation","message_type":"Onboarding tips","budget_pct":8,"conversion_rate":""}],"retargeting":["retargeting rule 1","retargeting rule 2","retargeting rule 3"],"channels":[{"name":"YouTube Pre-roll","role":"awareness","motivation":"why this channel","targeting":"audience","formats":["Non-skippable 15s","Bumper 6s"],"always_on":false,"reach_index":88,"selectivity_index":60,"score_label":"●●●●○"},{"name":"Meta Social","role":"consideration","motivation":"why","targeting":"audience","formats":["Reels 15s","Stories"],"always_on":true,"reach_index":85,"selectivity_index":78,"score_label":"●●●●●"},{"name":"Google Search","role":"conversion","motivation":"why","targeting":"keywords","formats":["Responsive Search Ads"],"always_on":true,"reach_index":52,"selectivity_index":94,"score_label":"●●●●●"}],"channel_overlap":[{"channels":["YouTube Pre-roll","Meta Social","Spotify"],"overlap_pct":44,"insight":"awareness overlap insight"},{"channels":["Google Search","Programmatic Display"],"overlap_pct":28,"insight":"consideration overlap insight"},{"channels":["Google Search brand","Meta Retargeting"],"overlap_pct":62,"insight":"conversion overlap insight"},{"channels":["Push","Email","In-app"],"overlap_pct":85,"insight":"retention overlap insight"}],"synergy_score":82,"synergy_notes":"explain overall channel synergy"}

IMPORTANT:
- role must be exactly: awareness, consideration, conversion, or retention
- channel_overlap must have 4 entries, one per funnel phase
- Minimum 5 channels
CONTEXT: ${briefing}
${ctx}`,

  budget: (briefing, ctx) => `You are a media budget expert. Respond ONLY in JSON using EXACTLY this structure:

{"total_budget":2000000,"net_budget":1800000,"by_channel":[{"channel":"YouTube Pre-roll","budget":576000,"pct":32,"motivation":"high reach"},{"channel":"Meta Social","budget":432000,"pct":24,"motivation":"precise targeting"},{"channel":"Google Search","budget":360000,"pct":20,"motivation":"conversion intent"},{"channel":"Programmatic Display","budget":252000,"pct":14,"motivation":"retargeting"},{"channel":"Other","budget":180000,"pct":10,"motivation":"test & learn"}],"by_funnel":[{"stage":"Awareness","budget":720000,"pct":40},{"stage":"Consideration","budget":540000,"pct":30},{"stage":"Conversion","budget":360000,"pct":20},{"stage":"Retention","budget":180000,"pct":10}],"test_budget":{"amount":180000,"pct":10,"tests":["A/B creative","Audience test"]},"pacing":{"strategy":"Burst + Always-on","motivation":"strong launch followed by consolidation","weeks":[{"week":1,"budget":250000,"phase":"Burst","focus":"Maximum launch reach. Activate YouTube + Meta for brand awareness.","stage_split":{"awareness":0.65,"consideration":0.20,"conversion":0.10,"retention":0.05}},{"week":2,"budget":250000,"phase":"Burst","focus":"Consolidate reach. Increase frequency for brand recall.","stage_split":{"awareness":0.60,"consideration":0.25,"conversion":0.10,"retention":0.05}},{"week":3,"budget":210000,"phase":"Burst","focus":"Wind down burst. Activate Search for first conversions.","stage_split":{"awareness":0.45,"consideration":0.30,"conversion":0.20,"retention":0.05}},{"week":4,"budget":170000,"phase":"Peak","focus":"Balance brand-performance. Launch retargeting.","stage_split":{"awareness":0.30,"consideration":0.35,"conversion":0.25,"retention":0.10}},{"week":5,"budget":170000,"phase":"Peak","focus":"Performance optimisation. A/B creative testing.","stage_split":{"awareness":0.25,"consideration":0.35,"conversion":0.30,"retention":0.10}},{"week":6,"budget":145000,"phase":"Peak","focus":"Scale best creatives. Shift budget towards conversion.","stage_split":{"awareness":0.20,"consideration":0.30,"conversion":0.35,"retention":0.15}},{"week":7,"budget":115000,"phase":"Always-on","focus":"Steady state. Focus on conversion funnel.","stage_split":{"awareness":0.15,"consideration":0.25,"conversion":0.40,"retention":0.20}},{"week":8,"budget":100000,"phase":"Always-on","focus":"Intensify retargeting. CPA optimisation.","stage_split":{"awareness":0.10,"consideration":0.25,"conversion":0.40,"retention":0.25}},{"week":9,"budget":100000,"phase":"Always-on","focus":"Long-tail conversions. Consolidate learnings.","stage_split":{"awareness":0.10,"consideration":0.20,"conversion":0.40,"retention":0.30}},{"week":10,"budget":90000,"phase":"Always-on","focus":"Final push. Maximise best performers.","stage_split":{"awareness":0.10,"consideration":0.20,"conversion":0.40,"retention":0.30}}]}}

IMPORTANT: Adjust ALL budget amounts to match the actual briefing. stage_split values per week must sum to 1.0.
CONTEXT: ${briefing}
${ctx}`,

  mediaplan: (briefing, ctx) => `You are a media planning expert. Respond ONLY in JSON:

{"channels":[{"name":"YouTube Pre-roll","funnel_stage":"Awareness","platform":"YouTube","buy_type":"Programmatic","targeting":"25–35y Amsterdam","formats":["Video 15s"],"budget":576000,"impressions":31000000,"reach":750000,"frequency":2.6,"cpm":18.60,"vtr":34,"cpv":0.055,"clicks":620000,"ctr":2.0,"cpc":0.93,"visits":496000,"cpa_visit":1.16,"conversions":9920,"cvr":2.0,"cpa":58.06}],"totals":{"budget":1800000,"impressions":75000000,"clicks":1440000,"conversions":40000}}

Create one entry per channel from the channel strategy. Use exact field names above.
CONTEXT: ${briefing}
${ctx}`,

  synthesis: (briefing, ctx) => `You are a senior media strategist writing a final report. Respond ONLY in JSON:

{"summary":"executive summary max 150 words","strategic_core":["","",""],"recommendations":[{"title":"","description":"","priority":"high"},{"title":"","description":"","priority":"medium"},{"title":"","description":"","priority":"low"}],"risks":[{"risk":"","mitigation":""},{"risk":"","mitigation":""}],"next_steps":[{"action":"","owner":"","timing":""},{"action":"","owner":"","timing":""},{"action":"","owner":"","timing":""}]}

CONTEXT: ${briefing}
${ctx}`,
};
