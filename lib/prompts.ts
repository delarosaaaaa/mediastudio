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

// Which previous phases are relevant as context for each phase.
// Avoids sending all outputs to every prompt — keeps token count bounded.
const RELEVANT_CONTEXT: Partial<Record<PhaseKey, PhaseKey[]>> = {
  briefing:    [],
  audience:    ["briefing"],
  market:      ["briefing"],
  competitive: ["briefing", "market"],
  strategy:    ["briefing", "audience", "market", "competitive"],
  budget:      ["briefing", "strategy"],
  mediaplan:   ["briefing", "strategy", "budget"],
  synthesis:   ["briefing", "strategy", "budget", "mediaplan"],
};

// Cap each context snippet to avoid very large prompts
const MAX_CTX_CHARS_PER_PHASE = 3_000;

export function buildPrompt(
  key: PhaseKey,
  briefing: string,
  outputs: Record<string, string>,
  extra = ""
): string {
  const relevant = RELEVANT_CONTEXT[key] ?? [];
  const ctx = relevant
    .filter(k => !!outputs[k])
    .map(k => {
      const v = outputs[k];
      const snippet = v.length > MAX_CTX_CHARS_PER_PHASE
        ? v.slice(0, MAX_CTX_CHARS_PER_PHASE) + "…"
        : v;
      return `[${k}]\n${snippet}`;
    })
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

{"competitors":[{"name":"Competitor name","est_budget":"€X-YM/year","positioning":"1-2 sentence positioning description","channels":["channel1","channel2"],"strengths":["strength1","strength2","strength3"],"weaknesses":["weakness1","weakness2","weakness3"],"sov_pct":0,"market_share_pct":0,"recent_ads":[{"format":"format","platform":"platform","description":"ad description","angle":"strategic angle"},{"format":"format","platform":"platform","description":"ad description","angle":"strategic angle"}]}],"sov":[{"brand":"Brand","pct":0}],"sov_insight":"1 strategic insight comparing SOV leaders vs their market share","market_share":[{"brand":"Brand","pct":0}],"market_share_insight":"1 strategic insight about market share distribution","positioning_map":[{"name":"Brand","x":50,"y":50,"color":"#1A0050"}],"positioning_insight":"1-2 sentences about the white space on the map","creative_patterns":[{"icon":"📈","label":"pattern description"},{"icon":"🛡️","label":"pattern description"},{"icon":"🇳🇱","label":"pattern description"},{"icon":"💜","label":"pattern description"}],"weaknesses":[{"name":"Brand","weakness":"specific vulnerability description"}],"market_gaps":[{"title":"Gap title","description":"Who is underserved and why"}],"white_space_title":"A [brand type] that no current competitor owns:","white_space":[{"label":"specific white space item"},{"label":"specific white space item"},{"label":"specific white space item"},{"label":"specific white space item"}]}

RULES:
- Provide 3-4 competitors relevant to the brand's market
- positioning_map: x=0 Traditional, x=100 Innovative; y=0 Accessible, y=100 Premium
- Include the brand itself in positioning_map with name matching the brand and color "#5B21B6"
- sov and market_share must sum to ~100%
- creative_patterns must have exactly 4 items with emoji icons
- weaknesses must have one entry per competitor
- white_space must have exactly 4 items
BRIEFING: ${briefing}
CONTEXT: ${ctx}`,

  market: (briefing, ctx) => `You are a senior market analyst. Respond ONLY in JSON with no extra text:

{"tam":"€2.4B","sam":"€380M","target_size":"~280,000 users","growth":"+18% YoY","segments":[{"name":"Segment name","pct":42},{"name":"Segment name","pct":31},{"name":"Segment name","pct":27}],"trends":[{"direction":"up","title":"Trend title","description":"1 concrete datapoint with source"},{"direction":"up","title":"Trend title","description":"1 concrete datapoint with source"},{"direction":"down","title":"Trend title","description":"1 concrete datapoint with source"}],"consumer_behaviour":"2-3 sentences describing how consumer expectations and behaviour are shifting in this market. Be specific and insightful.","opportunities":[{"title":"Opportunity title","description":"Who is underserved and why this is a real gap"},{"title":"Opportunity title","description":"Who is underserved and why this is a real gap"},{"title":"Opportunity title","description":"Who is underserved and why this is a real gap"}],"why_now":["Reason 1 — specific market signal","Reason 2 — specific market signal","Reason 3 — specific market signal","Reason 4 — specific market signal","Reason 5 — specific market signal"],"strategic_implications":["Implication 1 for marketing/growth","Implication 2 for marketing/growth","Implication 3 for marketing/growth","Implication 4 for marketing/growth"],"risks":["Risk 1","Risk 2","Risk 3","Risk 4","Risk 5"],"positioning_space":"1-2 sentences: the clear white space this brand can own in the market. Be specific and competitive."}

RULES:
- segments must sum to 100%
- trends direction must be exactly: up, down, or neutral
- Be specific to the brand and market in the briefing — not generic
- consumer_behaviour must be a narrative sentence, not bullet points
BRIEFING: ${briefing}
CONTEXT: ${ctx}`,

  strategy: (briefing, ctx) => `You are a senior media strategist. Respond ONLY in JSON:

{"strategic_idea":"1-2 sentence strategic idea answering how we win this market","audience_priority":[{"segment":"Segment name","why":"why this segment is prioritised","priority":"Primary"},{"segment":"Segment name","why":"why","priority":"Primary"},{"segment":"Segment name","why":"why","priority":"Secondary"}],"messaging_pillars":[{"title":"Pillar 1 title","description":"short description"},{"title":"Pillar 2 title","description":"short description"},{"title":"Pillar 3 title","description":"short description"}],"stages":[{"name":"Awareness","goal":"goal","channels":["YouTube Pre-roll","Meta Video","Spotify"],"kpi":"Impressions / Aided Awareness","target":"42M impressions · 40% awareness","message_type":"message angle","budget_pct":40,"conversion_rate":"4.2% click-through"},{"name":"Consideration","goal":"goal","channels":["Google Search","Meta Carousel"],"kpi":"Website visits","target":"180K visits","message_type":"message angle","budget_pct":30,"conversion_rate":"28% to download"},{"name":"Conversion","goal":"goal","channels":["Google Search brand","Meta Retargeting"],"kpi":"Account openings / CPA","target":"44,000 accounts","message_type":"message angle","budget_pct":22,"conversion_rate":"46% complete onboarding"},{"name":"Retention","goal":"goal","channels":["Push","Email","In-app"],"kpi":"Activation / 30-day retention","target":"75% activation","message_type":"message angle","budget_pct":8,"conversion_rate":""}],"channel_roles":[{"channel":"YouTube","role":"Awareness","why":"why this channel"},{"channel":"Meta Social","role":"Consideration","why":"why"},{"channel":"Google Search","role":"Conversion","why":"why"},{"channel":"Spotify","role":"Awareness","why":"why"},{"channel":"LinkedIn","role":"Credibility","why":"why"}],"retargeting_rules":[{"trigger":"trigger behaviour 1","action":"retargeting action 1"},{"trigger":"trigger behaviour 2","action":"retargeting action 2"},{"trigger":"trigger behaviour 3","action":"retargeting action 3"}],"retargeting":["rule 1","rule 2","rule 3"],"channels":[{"name":"YouTube Pre-roll","role":"awareness","motivation":"why","targeting":"audience","formats":["format1"],"always_on":false,"reach_index":88,"selectivity_index":60,"score_label":"●●●●○"},{"name":"Meta Social","role":"consideration","motivation":"why","targeting":"audience","formats":["format1"],"always_on":true,"reach_index":85,"selectivity_index":78,"score_label":"●●●●●"},{"name":"Google Search","role":"conversion","motivation":"why","targeting":"keywords","formats":["format1"],"always_on":true,"reach_index":52,"selectivity_index":94,"score_label":"●●●●●"},{"name":"Spotify Audio","role":"awareness","motivation":"why","targeting":"audience","formats":["format1"],"always_on":false,"reach_index":62,"selectivity_index":55,"score_label":"●●●○○"},{"name":"Push / Email / In-app","role":"retention","motivation":"why","targeting":"registered users","formats":["Push","Email"],"always_on":true,"reach_index":90,"selectivity_index":95,"score_label":"●●●●●"}],"channel_overlap":[{"channels":["YouTube Pre-roll","Meta Social","Spotify"],"overlap_pct":44,"insight":"awareness overlap insight"},{"channels":["Google Search","Meta Social"],"overlap_pct":28,"insight":"consideration overlap insight"},{"channels":["Google Search","Meta Retargeting"],"overlap_pct":62,"insight":"conversion overlap insight"},{"channels":["Push","Email","In-app"],"overlap_pct":85,"insight":"retention overlap insight"}],"synergy_score":82,"synergy_notes":"key synergy insight between channels","budget_stages":[{"stage":"Awareness","amount":"€XK","pct":40},{"stage":"Consideration","amount":"€XK","pct":30},{"stage":"Conversion","amount":"€XK","pct":22},{"stage":"Retention","amount":"€XK","pct":8}],"budget_rationale":"1-2 sentences explaining why budget is distributed this way","north_star_kpi":"primary KPI with target","north_star_desc":"brief description of how it is measured","success_metrics":[{"label":"metric label","value":"target value"},{"label":"metric label","value":"target value"},{"label":"metric label","value":"target value"},{"label":"metric label","value":"target value"},{"label":"metric label","value":"target value"},{"label":"metric label","value":"target value"}]}

RULES:
- strategic_idea must directly answer "how do we win" for this specific brand
- messaging_pillars must be brand-specific, not generic
- budget_stages pct must sum to 100
- success_metrics must have exactly 6 items
- channel_overlap must have exactly 4 items, one per funnel phase
BRIEFING: ${briefing}
CONTEXT: ${ctx}`,

  budget: (briefing, ctx) => `You are a senior media budget strategist. Respond ONLY in JSON:

{"total_budget":2000000,"net_budget":1800000,"by_funnel":[{"stage":"Awareness","budget":720000,"pct":40},{"stage":"Consideration","budget":540000,"pct":30},{"stage":"Conversion","budget":396000,"pct":22},{"stage":"Retention","budget":144000,"pct":8}],"budget_rationale":["rationale 1 for this specific brand","rationale 2","rationale 3"],"by_channel":[{"channel":"Meta Social","budget":504000,"pct":28},{"channel":"YouTube","budget":396000,"pct":22},{"channel":"Google Search","budget":360000,"pct":20},{"channel":"Programmatic","budget":270000,"pct":15},{"channel":"Spotify","budget":180000,"pct":10},{"channel":"LinkedIn","budget":90000,"pct":5}],"test_budget":{"amount":180000,"pct":10,"tests":["test 1","test 2","test 3","test 4"],"refresh_week":5},"pacing":{"strategy":"Burst + Always-on","motivation":"1 sentence explaining the pacing rationale","phases":[{"label":"Burst","weeks":"Weeks 1–3","description":"what happens and why in weeks 1-3","color":"#1A0050"},{"label":"Peak","weeks":"Weeks 4–6","description":"what happens in weeks 4-6","color":"#5B21B6"},{"label":"Always-on","weeks":"Weeks 7–10","description":"what happens in weeks 7-10","color":"#7C3AED"}],"weeks":[{"week":1,"budget":280000,"phase":"Burst","focus":"what this week focuses on"},{"week":2,"budget":265000,"phase":"Burst","focus":"focus"},{"week":3,"budget":240000,"phase":"Burst","focus":"focus"},{"week":4,"budget":195000,"phase":"Peak","focus":"focus"},{"week":5,"budget":185000,"phase":"Peak","focus":"focus"},{"week":6,"budget":170000,"phase":"Peak","focus":"focus"},{"week":7,"budget":135000,"phase":"Always-on","focus":"focus"},{"week":8,"budget":125000,"phase":"Always-on","focus":"focus"},{"week":9,"budget":115000,"phase":"Always-on","focus":"focus"},{"week":10,"budget":110000,"phase":"Always-on","focus":"focus"}]},"optimisation_rules":[{"icon":"📊","title":"rule title","desc":"rule description"},{"icon":"⏱️","title":"rule title","desc":"rule description"},{"icon":"🔍","title":"rule title","desc":"rule description"},{"icon":"🎯","title":"rule title","desc":"rule description"}],"test_items":[{"title":"test name","option_a":"option A","option_b":"option B"},{"title":"test name","option_a":"option A","option_b":"option B"},{"title":"test name","option_a":"option A","option_b":"option B"},{"title":"test name","option_a":"option A","option_b":"option B"}]}

RULES:
- Adapt all values to the specific brand, market and total budget from the briefing
- by_funnel pct must sum to 100; by_channel pct must sum to 100
- weeks budgets must sum to approximately net_budget
- budget_rationale must be brand-specific, not generic
- test_items must have exactly 4 items with meaningful A/B test pairs
- optimisation_rules must have exactly 4 items
BRIEFING: ${briefing}
CONTEXT: ${ctx}`,

  mediaplan: (briefing, ctx) => `You are a senior media planner. Respond ONLY in JSON:

{"totals":{"budget":1800000,"impressions":79100000,"clicks":1847000,"conversions":43616,"blended_cpa":41.27},"channels":[{"name":"Meta Social","funnel_stage":"Awareness","platform":"Meta","buy_type":"Auction CPM","targeting":"audience description + freq cap","formats":["Reels 15s","Stories","Feed Carousel"],"budget":504000,"impressions":28000000,"cpm":18.00,"clicks":840000,"ctr":3.0,"conversions":18144,"cpa":27.78},{"name":"YouTube Pre-roll","funnel_stage":"Awareness","platform":"YouTube","buy_type":"CPV","targeting":"audience description","formats":["Non-skip 15s","Bumper 6s"],"budget":396000,"impressions":21290000,"cpm":18.60,"clicks":425800,"ctr":2.0,"conversions":9920,"cpa":58.06},{"name":"Google Search","funnel_stage":"Conversion","platform":"Google","buy_type":"CPC tCPA","targeting":"keywords + bidding strategy","formats":["Responsive Search Ads","Brand"],"budget":360000,"impressions":3600000,"cpm":1.25,"clicks":288000,"ctr":8.0,"conversions":12960,"cpa":27.78},{"name":"Programmatic Display","funnel_stage":"Consideration","platform":"DV360","buy_type":"CPM","targeting":"retargeting audience description","formats":["300x250","728x90","Native"],"budget":270000,"impressions":64285714,"cpm":4.20,"clicks":225000,"ctr":0.35,"conversions":2592,"cpa":104.17}],"execution_insights":[{"icon":"🎯","title":"insight title","desc":"insight description with specific numbers"},{"icon":"🔍","title":"insight title","desc":"insight description"},{"icon":"📺","title":"insight title","desc":"insight description"},{"icon":"📊","title":"insight title","desc":"insight description"}],"optimisation_notes":["optimisation rule 1","optimisation rule 2","optimisation rule 3","optimisation rule 4","optimisation rule 5"]}

RULES:
- Adapt all budgets, channels and KPIs to match the briefing's total budget and market
- blended_cpa = total_budget / total_conversions
- execution_insights must have exactly 4 items with emoji icons and specific numbers
- optimisation_notes must have exactly 5 specific, actionable rules
- Channel KPIs must be internally consistent: impressions * ctr/100 ≈ clicks, budget/conversions ≈ cpa
BRIEFING: ${briefing}
CONTEXT: ${ctx}`,

  synthesis: (briefing, ctx) => `You are a senior media strategist writing a final report. Respond ONLY in JSON:

{"campaign_name":"Brand · Campaign period","summary_paragraphs":["paragraph 1: what is the strategy and why","paragraph 2: competitive positioning and expected results","paragraph 3: what determines success and key dependencies"],"summary":"1-2 sentence summary of the full strategy","strategic_core":[{"title":"Strategic insight 1 title","description":"1-2 sentence explanation"},{"title":"Strategic insight 2 title","description":"1-2 sentence explanation"},{"title":"Strategic insight 3 title","description":"1-2 sentence explanation"}],"outcomes":[{"label":"New accounts","value":"44,000","sub":"CPA ≤ €45 target"},{"label":"Blended CPA","value":"€41","sub":"Within €45 target"},{"label":"Aided awareness","value":"40%","sub":"+18pts lift vs baseline"},{"label":"App downloads","value":"80,000","sub":"46% onboarding completion"},{"label":"30-day retention","value":"60%","sub":"75% activation rate"},{"label":"Total impressions","value":"79M","sub":"Across all channels"}],"risks":[{"level":"high","risk":"specific risk description","mitigation":"specific mitigation action"},{"level":"high","risk":"specific risk description","mitigation":"specific mitigation action"},{"level":"medium","risk":"specific risk description","mitigation":"specific mitigation action"},{"level":"medium","risk":"specific risk description","mitigation":"specific mitigation action"}],"recommendations":[{"title":"recommendation title","priority":"high","description":"why this matters and what to do"},{"title":"recommendation title","priority":"high","description":"why this matters"},{"title":"recommendation title","priority":"medium","description":"why this matters"},{"title":"recommendation title","priority":"medium","description":"why this matters"}],"next_steps":[{"action":"specific action","owner":"team/person","timing":"Week -4"},{"action":"specific action","owner":"team/person","timing":"Week -3"},{"action":"specific action","owner":"team/person","timing":"Week -2"},{"action":"specific action","owner":"team/person","timing":"Week -1"},{"action":"specific action","owner":"team/person","timing":"Week 1"},{"action":"specific action","owner":"team/person","timing":"Week 6"}]}

RULES:
- summary_paragraphs must have exactly 3 paragraphs answering: what/why/success factors
- strategic_core must have exactly 3 items with specific, non-generic insights
- outcomes must have exactly 6 items with real numbers from the media plan
- risks must have exactly 4 items (2 high, 2 medium) with concrete mitigations
- recommendations must have exactly 4 items (2 high, 2 medium priority)
- next_steps must have exactly 6 items in chronological order
- All content must be specific to the brand and briefing — no generic statements
BRIEFING: ${briefing}
CONTEXT: ${ctx}`,
};
