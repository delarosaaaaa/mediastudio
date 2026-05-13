import type { PhaseKey } from "./types";

// Version tracking — bump when you improve a prompt
export const PROMPT_VERSIONS: Record<PhaseKey, string> = {
  briefing:    "v1",
  audience:    "v1",
  competitive: "v1",
  funnel:      "v1",
  channel:     "v1",
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

  audience: (briefing, ctx) => `You are a senior audience strategist. Create exactly 3 personas + a total audience profile. Respond ONLY in JSON:

{"total":{"name":"Total Audience","age_range":"","jobs":"","income":"","education":"","living_situation":"","lifestyle":"","media_prime_time":"","daily_media_hours":"","motivations":["","",""],"pain_points":["","",""],"platforms":["","",""],"values":"","purchase_trigger":"","size_estimate":"","platform_presence":[{"platform":"Instagram","reach_index":82,"selectivity_index":68,"score_label":"●●●●○"},{"platform":"YouTube","reach_index":78,"selectivity_index":55,"score_label":"●●●○○"},{"platform":"Google Search","reach_index":65,"selectivity_index":88,"score_label":"●●●●●"},{"platform":"TikTok","reach_index":55,"selectivity_index":40,"score_label":"●●●○○"},{"platform":"LinkedIn","reach_index":28,"selectivity_index":82,"score_label":"●●○○○"}]},"personas":[{"name":"","age":"","job":"","income":"","education":"","living_situation":"","lifestyle":"","media_prime_time":"","daily_media_hours":"","pain_points":["","",""],"motivations":["","",""],"platforms":["","",""],"values":"","purchase_trigger":"","platform_presence":[{"platform":"Instagram","reach_index":0,"selectivity_index":0,"score_label":"●●●○○"},{"platform":"YouTube","reach_index":0,"selectivity_index":0,"score_label":"●●●○○"},{"platform":"Google Search","reach_index":0,"selectivity_index":0,"score_label":"●●●○○"},{"platform":"TikTok","reach_index":0,"selectivity_index":0,"score_label":"●●○○○"},{"platform":"LinkedIn","reach_index":0,"selectivity_index":0,"score_label":"●○○○○"}]},{"name":"","age":"","job":"","income":"","education":"","living_situation":"","lifestyle":"","media_prime_time":"","daily_media_hours":"","pain_points":[""],"motivations":[""],"platforms":[""],"values":"","purchase_trigger":"","platform_presence":[{"platform":"Instagram","reach_index":0,"selectivity_index":0,"score_label":"●●●○○"},{"platform":"YouTube","reach_index":0,"selectivity_index":0,"score_label":"●●●○○"},{"platform":"Google Search","reach_index":0,"selectivity_index":0,"score_label":"●●●○○"},{"platform":"TikTok","reach_index":0,"selectivity_index":0,"score_label":"●●○○○"},{"platform":"LinkedIn","reach_index":0,"selectivity_index":0,"score_label":"●○○○○"}]},{"name":"","age":"","job":"","income":"","education":"","living_situation":"","lifestyle":"","media_prime_time":"","daily_media_hours":"","pain_points":[""],"motivations":[""],"platforms":[""],"values":"","purchase_trigger":"","platform_presence":[{"platform":"Instagram","reach_index":0,"selectivity_index":0,"score_label":"●●●○○"},{"platform":"YouTube","reach_index":0,"selectivity_index":0,"score_label":"●●●○○"},{"platform":"Google Search","reach_index":0,"selectivity_index":0,"score_label":"●●●○○"},{"platform":"TikTok","reach_index":0,"selectivity_index":0,"score_label":"●●○○○"},{"platform":"LinkedIn","reach_index":0,"selectivity_index":0,"score_label":"●○○○○"}]}],"barriers":[{"barrier":"","solution":""}]}

Fill in all indices with real values 0–100. Each persona MUST have different indices.
BRIEFING: ${briefing}
CONTEXT: ${ctx}`,

  competitive: (briefing, ctx) => `You are a competitive intelligence expert. Respond ONLY in JSON:

{"competitors":[{"name":"","est_budget":"","channels":[""],"positioning":"","strengths":["",""],"weaknesses":["",""],"sov_pct":0,"market_share_pct":0,"recent_ads":[{"format":"","platform":"","description":"","angle":""},{"format":"","platform":"","description":"","angle":""}]}],"sov":[{"brand":"","pct":0}],"market_share":[{"brand":"","pct":0}],"market_gaps":[{"title":"","description":""}]}

Provide 3–4 competitors. recent_ads are based on publicly known recent campaigns (last 30 days).
CONTEXT: ${briefing}
${ctx}`,

  funnel: (briefing, ctx) => `You are a media funnel strategist. Respond ONLY in JSON:

{"stages":[{"name":"","goal":"","channels":["",""],"kpi":"","target":"","message_type":"","budget_pct":0,"conversion_rate":""}],"retargeting":["",""],"budget_split":[{"stage":"","pct":0}]}

Provide 3–4 funnel stages.
CONTEXT: ${briefing}
${ctx}`,

  channel: (briefing, ctx) => `You are a channel strategy expert. Respond ONLY in JSON using EXACTLY these field names:

{"channels":[{"name":"YouTube Pre-roll","role":"awareness","motivation":"explain why","targeting":"audience description","formats":["Video 15s","Video 30s"],"always_on":true,"reach_index":85,"selectivity_index":62,"score_label":"●●●●○"},{"name":"Meta Social","role":"consideration","motivation":"explain why","targeting":"audience","formats":["Feed","Stories"],"always_on":false,"reach_index":78,"selectivity_index":75,"score_label":"●●●●○"},{"name":"Google Search","role":"conversion","motivation":"explain why","targeting":"audience","formats":["Text ads"],"always_on":true,"reach_index":55,"selectivity_index":92,"score_label":"●●●●●"}],"channel_overlap":[{"channels":["YouTube","Meta"],"overlap_pct":42,"insight":"explain overlap"},{"channels":["YouTube","Meta","Search"],"overlap_pct":28,"insight":"explain combined overlap"}],"attribution_model":"last-click","frequency_cap":"3x/week","synergy_score":78,"synergy_notes":"explain synergy"}

Minimum 5 channels. role must be exactly: awareness, consideration, or conversion.
CONTEXT: ${briefing}
${ctx}`,

  budget: (briefing, ctx) => `You are a media budget expert. Respond ONLY in JSON using EXACTLY this structure:

{"total_budget":2000000,"net_budget":1800000,"by_channel":[{"channel":"YouTube Pre-roll","budget":576000,"pct":32,"motivation":"high reach"},{"channel":"Meta Social","budget":432000,"pct":24,"motivation":"precise targeting"},{"channel":"Google Search","budget":360000,"pct":20,"motivation":"conversion intent"},{"channel":"Programmatic Display","budget":252000,"pct":14,"motivation":"retargeting"},{"channel":"Other","budget":180000,"pct":10,"motivation":"test & learn"}],"by_funnel":[{"stage":"Awareness","budget":720000,"pct":40},{"stage":"Consideration","budget":540000,"pct":30},{"stage":"Conversion","budget":360000,"pct":20},{"stage":"Test","budget":180000,"pct":10}],"test_budget":{"amount":180000,"pct":10,"tests":["A/B creative","Audience test"]},"pacing":{"strategy":"Burst + Always-on","motivation":"strong launch followed by consolidation","weeks":[{"week":1,"budget":250000,"phase":"Burst","focus":"Maximum launch reach. Fully activate YouTube + Meta for brand awareness."},{"week":2,"budget":250000,"phase":"Burst","focus":"Consolidate reach. Increase frequency for brand recall."},{"week":3,"budget":210000,"phase":"Burst","focus":"Wind down burst. Activate Search for first conversions."},{"week":4,"budget":170000,"phase":"Peak","focus":"Balance brand-performance. Launch retargeting."},{"week":5,"budget":170000,"phase":"Peak","focus":"Performance optimisation. A/B creative testing."},{"week":6,"budget":145000,"phase":"Peak","focus":"Scale best creatives. Shift budget towards conversion."},{"week":7,"budget":115000,"phase":"Always-on","focus":"Steady state reached. Focus on conversion funnel."},{"week":8,"budget":100000,"phase":"Always-on","focus":"Intensify retargeting. CPA optimisation."},{"week":9,"budget":100000,"phase":"Always-on","focus":"Long-tail conversions. Consolidate audience learnings."},{"week":10,"budget":90000,"phase":"Always-on","focus":"Final push. Maximise best performers."}]}}

Adjust ALL amounts to match the actual briefing budget.
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
