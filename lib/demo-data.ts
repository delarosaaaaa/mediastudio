// Demo data used when ANTHROPIC_API_KEY is not set
// Simulates a media strategy for a fictional challenger bank "Vault"

export const DEMO_DATA: Record<string, string> = {
  briefing: JSON.stringify({
    brand: "Vault",
    intro: "Vault is a digital challenger bank launching its first current account in the Netherlands, targeting urban professionals who are frustrated with legacy banks. The campaign aims to build brand awareness and drive account openings, with a focus on Amsterdam, Rotterdam and Utrecht.",
    business_goals: [
      { goal: "Acquire new current account holders", target: "44,000 new accounts", metric: "Cost per acquisition ≤ €45" },
      { goal: "Build brand awareness among target audience", target: "40% aided awareness", metric: "Brand tracker (Kantar)" },
      { goal: "Drive app downloads", target: "80,000 downloads", metric: "App store installs" },
    ],
    marketing_goals: [
      { kpi: "Cost per Acquisition (CPA)", target: "≤ €45" },
      { kpi: "New account holders", target: "44,000" },
      { kpi: "Aided brand awareness", target: "40%" },
      { kpi: "App downloads", target: "80,000" },
      { kpi: "Share of Voice (SOV)", target: "15%" },
    ],
    params: {
      budget: "€2,000,000",
      duration: "10 weeks (Q1 2026)",
      geo: "Amsterdam, Rotterdam, Utrecht",
      timing: "January – March 2026",
    },
  }),


  market: JSON.stringify({
    tam: "€2.4B",
    sam: "€380M",
    target_size: "~280,000 users",
    growth: "+18% YoY",
    segments: [
      { name: "Urban professionals", pct: 42 },
      { name: "Freelancers / ZZP",   pct: 31 },
      { name: "Students / starters", pct: 27 },
    ],
    trends: [
      { direction: "up",   title: "Mobile-first banking accelerating",  description: "+34% app-only account openings YoY in NL" },
      { direction: "up",   title: "Fee sensitivity rising post-inflation", description: "62% cite fees as top switching trigger (DNB 2024)" },
      { direction: "down", title: "Trust in incumbents declining",       description: "NPS for big-4 banks dropped 12 pts in 2 years" },
    ],
    opportunities: [
      { title: "No challenger owns the freelancer positioning",    description: "1.2M ZZP in NL with no dedicated banking champion. Bunq goes broad, Revolut focuses on travellers." },
      { title: "Dutch-language digital banking content is scarce", description: "Most challengers run English-language ads. Dutch creative outperforms by 23% on recall (Nielsen 2024)." },
      { title: "Trust gap at the bottom of the funnel",           description: "Competitors focus on acquisition; few invest in safety and deposit guarantee reassurance content." },
    ],
    positioning_space: "Zero-fee, full-control digital banking for the Dutch urban professional — in their own language. No competitor owns this space clearly.",
  }),

  audience: JSON.stringify({
    total: {
      name: "Total Audience",
      age_range: "25–38",
      jobs: "Knowledge workers, freelancers, young professionals",
      income: "€35–70K/year",
      daily_media_hours: "4.8 hours",
      size_estimate: "~280,000",
      motivations: [
        "Lower fees and transparent pricing",
        "Full control via mobile app",
        "Instant payment notifications",
        "Better spending insights",
      ],
      pain_points: [
        "Paying monthly fees for basic services",
        "App crashes during iDEAL payments",
        "Legacy banks lack modern UX",
        "No actionable spending insights",
      ],
      platforms: ["Instagram", "YouTube", "Spotify", "Google Search", "LinkedIn"],
    },
    personas: [
      {
        name: "Daan",
        age: "28",
        job: "UX Designer at a scale-up",
        income: "€52K/year gross",
        daily_media_hours: "5.2 hours",
        mindset: "Digital-first, convenience-driven, low loyalty to traditional banks. Expects bank apps to feel like consumer tech.",
        motivations: [
          "Save €90+/year on unnecessary fees",
          "Clean, intuitive app UX",
          "Instant spending notifications",
          "Smart budgeting categories",
        ],
        pain_points: [
          "Pays €8/month at ING for a basic account",
          "App crashes during iDEAL payments",
          "No spending insights or categorisation",
        ],
        trigger_moments: [
          "ING increases fees again",
          "Payment app crashes in a busy moment",
          "Friend shows him Vault — opens account in 5 min",
          "Wants to start a savings pot for a holiday",
        ],
        platforms: ["Instagram", "YouTube", "Spotify"],
        trust_builders: [
          "DNB licence prominently displayed",
          "Deposit guarantee (€100K)",
          "Reviews and social proof",
          "Easy onboarding demo",
        ],
        recommended: true,
      },
      {
        name: "Sven",
        age: "33",
        job: "Freelance developer (ZZP)",
        income: "€72K/year (variable)",
        daily_media_hours: "4.1 hours",
        mindset: "Financially self-sufficient, values control and flexibility. Frustrated by banks that don't understand freelancers.",
        motivations: [
          "Separate business and personal finances easily",
          "No unnecessary charges on variable income months",
          "Instant payment confirmation for client invoices",
        ],
        pain_points: [
          "Banks charge extra for business features he barely needs",
          "Hard to see cash flow at a glance",
          "Customer support is slow when something goes wrong",
        ],
        trigger_moments: [
          "Large invoice takes 3 days to clear",
          "Bank refuses to give him a second account",
          "Accountant recommends a smarter banking solution",
        ],
        platforms: ["LinkedIn", "YouTube", "Reddit"],
        trust_builders: [
          "Clear fee schedule — no surprises",
          "Fast customer support (chat, <5 min)",
          "DNB licensed and regulated",
        ],
      },
      {
        name: "Lisa",
        age: "26",
        job: "Marketing Manager, recently relocated to Amsterdam",
        income: "€42K/year gross",
        daily_media_hours: "5.8 hours",
        mindset: "Socially influenced, values aesthetics and peer validation. Discovery via social media. Switchers quickly if experience disappoints.",
        motivations: [
          "Bank that matches her digital lifestyle",
          "Looks and feels premium — card design matters",
          "Easy to split bills with friends",
          "Cashback or rewards",
        ],
        pain_points: [
          "Transferring money internationally is expensive",
          "Old bank app feels dated and clunky",
          "No card controls — can't freeze/unfreeze instantly",
        ],
        trigger_moments: [
          "Sees Vault card on Instagram",
          "Friend uses Vault to split dinner instantly",
          "Struggles with international transfer fees",
        ],
        platforms: ["Instagram", "TikTok", "Spotify", "Pinterest"],
        trust_builders: [
          "Social proof — friends already use it",
          "Beautiful card design",
          "Instant freeze/unfreeze via app",
        ],
      },
    ],
    barriers: [
      { barrier: "Switching banks feels like too much work", solution: "Emphasise 5-minute onboarding and automatic payment redirection" },
      { barrier: "Is a new bank actually safe?", solution: "Lead with DNB licence and €100K deposit guarantee" },
      { barrier: "I don't want to lose access to my old account", solution: "Promote dual-account approach — keep old bank, add Vault" },
    ],
  }),


  strategy: JSON.stringify({
    stages: [
      { name: "Awareness",     goal: "Reach 70% of target audience at least 3 times", channels: ["YouTube Pre-roll", "Meta Video", "Spotify Audio", "Programmatic Display"], kpi: "Impressions / Aided Awareness", target: "42M impressions · 40% awareness", message_type: "Emotional brand story — 'Banking that actually works for you'", budget_pct: 40, conversion_rate: "4.2% click-through to consideration" },
      { name: "Consideration", goal: "Drive active product comparison and app store visits", channels: ["Google Search", "Meta Carousel", "YouTube TrueView", "LinkedIn"], kpi: "Website visits / App store page views", target: "180,000 website visits · 95,000 app page views", message_type: "Rational comparison — fee savings calculator, feature checklist", budget_pct: 30, conversion_rate: "28% conversion from visit to app download" },
      { name: "Conversion",    goal: "Drive account sign-ups at ≤ €45 CPA", channels: ["Google Search (brand)", "Meta Retargeting", "App Store Ads"], kpi: "Account openings / CPA", target: "44,000 accounts · CPA ≤ €45", message_type: "Urgency + social proof — 'Join 44,000 people who switched'", budget_pct: 22, conversion_rate: "46% complete onboarding after download" },
      { name: "Retention",     goal: "Activate accounts and drive first transaction within 7 days", channels: ["Push notifications", "Email", "In-app messages"], kpi: "Activation rate / 30-day retention", target: "75% activation · 60% 30-day retention", message_type: "Onboarding tips + first transaction incentive (€5 cashback)", budget_pct: 8, conversion_rate: "" },
    ],
    retargeting: [
      "Website visitors who did not download the app → Meta + Google Display with fee-saving message (7-day window)",
      "App downloaders who did not complete sign-up → Push notification series + Meta retargeting (3-day window)",
      "Completed sign-up but no first transaction → Email + in-app nudge with €5 cashback offer (7-day window)",
    ],
    channels: [
      { name: "YouTube Pre-roll",     role: "awareness",     motivation: "Highest video reach among 25–38 urban professionals. Non-skippable 15s builds rapid brand familiarity.", targeting: "25–38, Amsterdam/Rotterdam/Utrecht, interest: fintech, personal finance", formats: ["Non-skippable 15s", "Bumper 6s"], always_on: false, reach_index: 88, selectivity_index: 60, score_label: "●●●●○" },
      { name: "Meta Social",          role: "consideration", motivation: "Unmatched targeting precision. Instagram Stories and Reels drive strong brand recall and click-through.", targeting: "25–38, 3 cities, behaviours: mobile banking app users, lookalike of current customer base", formats: ["Reels 15s", "Stories", "Feed carousel"], always_on: true, reach_index: 85, selectivity_index: 78, score_label: "●●●●●" },
      { name: "Google Search",        role: "conversion",    motivation: "Captures high-intent users. Brand + competitor keywords drive lowest CPA in the mix.", targeting: "Keywords: gratis bankrekening, beste challenger bank, Vault bank", formats: ["Responsive Search Ads"], always_on: true, reach_index: 52, selectivity_index: 94, score_label: "●●●●●" },
      { name: "Programmatic Display", role: "consideration", motivation: "Cost-efficient retargeting. Keeps Vault top-of-mind for users who engaged with video but haven't converted.", targeting: "Retargeting: video viewers + website visitors (30-day window)", formats: ["300x250", "728x90", "Native"], always_on: false, reach_index: 70, selectivity_index: 65, score_label: "●●●●○" },
      { name: "Spotify Audio",        role: "awareness",     motivation: "Reaches the audience during commute and gym. Audio + display combo drives 18% higher recall.", targeting: "25–35, urban, playlists: workout, commute, focus work", formats: ["Audio 30s + companion banner"], always_on: false, reach_index: 62, selectivity_index: 55, score_label: "●●●○○" },
      { name: "LinkedIn",             role: "consideration", motivation: "Targets the freelancer/ZZP segment with precision.", targeting: "Freelancers, self-employed, 26–40, NL", formats: ["Sponsored content", "InMail"], always_on: false, reach_index: 40, selectivity_index: 88, score_label: "●●●○○" },
    ],
    channel_overlap: [
      { channels: ["YouTube Pre-roll", "Meta Social", "Spotify Audio"],     overlap_pct: 44, insight: "YouTube + Meta share the largest overlap. Align creative for a consistent brand story across awareness touchpoints." },
      { channels: ["Google Search", "Programmatic Display", "LinkedIn"],    overlap_pct: 28, insight: "Low overlap — each channel reaches a distinct segment of the consideration audience." },
      { channels: ["Google Search (brand)", "Meta Retargeting"],            overlap_pct: 62, insight: "High overlap is intentional — both channels hit the same high-intent user at the purchase moment." },
      { channels: ["Push notifications", "Email", "In-app messages"],       overlap_pct: 85, insight: "Same user across all retention channels — coordinate timing carefully to avoid message fatigue." },
    ],
    synergy_score: 82,
    synergy_notes: "Strong synergy between YouTube brand building and Google Search conversion. Users exposed to YouTube pre-roll show 2.3× higher Search CTR.",
  }),

  competitive: JSON.stringify({
    competitors: [
      {
        name: "Bunq",
        est_budget: "€3.5M/year estimated",
        channels: ["Meta", "YouTube", "OOH Amsterdam", "Influencer"],
        positioning: "The bank for independent thinkers — sustainability angle",
        strengths: ["Strong brand recognition among under-35s", "Sustainability positioning resonates", "High social following"],
        weaknesses: ["Premium pricing (€10.99/month)", "Perceived as expensive vs free alternatives", "Customer service complaints"],
        sov_pct: 28,
        market_share_pct: 22,
        recent_ads: [
          { format: "Video 30s", platform: "YouTube", description: "Brand film showing a freelancer managing multiple income streams with zero stress", angle: "Freedom & independence" },
          { format: "Stories", platform: "Instagram", description: "Carousel comparing Bunq's tree-planting feature vs traditional banks", angle: "Sustainability guilt-trip" },
        ],
      },
      {
        name: "Revolut",
        est_budget: "€5M/year estimated",
        channels: ["Meta", "Google Search", "App Store", "Affiliate"],
        positioning: "Global financial super-app — do everything in one place",
        strengths: ["Massive brand recognition", "Product breadth (crypto, stocks, travel)", "Aggressive referral programme"],
        weaknesses: ["Perceived as fintech toy, not a real bank", "No Dutch IBAN (UK-based)", "Customer service horror stories"],
        sov_pct: 35,
        market_share_pct: 18,
        recent_ads: [
          { format: "Search", platform: "Google", description: "Keyword targeting on 'goedkope bankrekening' and 'gratis bankrekening'", angle: "Performance / price comparison" },
          { format: "Video 15s", platform: "YouTube", description: "Quick demo of currency exchange with zero fees while travelling", angle: "Travel use case" },
        ],
      },
      {
        name: "N26",
        est_budget: "€2M/year estimated",
        channels: ["Meta", "YouTube", "Google Search"],
        positioning: "The mobile bank you'll actually love — simplicity first",
        strengths: ["Clean design aesthetic", "Strong consideration among design-conscious users", "Good NPS scores"],
        weaknesses: ["Less feature-rich than Revolut", "No Dutch customer support", "Recent layoffs hurt brand perception"],
        sov_pct: 18,
        market_share_pct: 12,
        recent_ads: [
          { format: "Feed", platform: "Instagram", description: "Minimalist product shots of the metal card with lifestyle backgrounds", angle: "Premium simplicity" },
          { format: "Video 20s", platform: "YouTube", description: "Side-by-side comparison of N26 vs legacy bank app speed", angle: "Speed & simplicity" },
        ],
      },
      {
        name: "ING / Rabobank (incumbents)",
        est_budget: "€40M+/year estimated",
        channels: ["TV", "OOH", "Radio", "Search", "Display"],
        positioning: "Trusted, established, local — the safe choice",
        strengths: ["Massive brand trust", "Full-service offering", "Physical branch network"],
        weaknesses: ["Old-fashioned UX", "Slow to innovate", "Monthly fees with little value"],
        sov_pct: 19,
        market_share_pct: 48,
        recent_ads: [
          { format: "TV 30s", platform: "TV / YouTube", description: "Family moments, trusted bank since 1881, emotional brand film", angle: "Heritage & trust" },
          { format: "Display", platform: "Programmatic", description: "Retargeting banner with mortgage rate comparison", angle: "Product push" },
        ],
      },
    ],
    sov: [
      { brand: "Revolut", pct: 35 },
      { brand: "Bunq", pct: 28 },
      { brand: "Incumbents", pct: 19 },
      { brand: "N26", pct: 18 },
    ],
    market_share: [
      { brand: "Incumbents", pct: 48 },
      { brand: "Bunq", pct: 22 },
      { brand: "Revolut", pct: 18 },
      { brand: "N26", pct: 12 },
    ],
    market_gaps: [
      { title: "No challenger owns the 'freelancer' positioning", description: "Bunq goes broad, Revolut focuses on travellers. The freelancer/ZZP segment (1.2M in NL) has no dedicated champion." },
      { title: "Trust gap at the bottom of the funnel", description: "Competitors focus on acquisition but few invest in reassurance content about safety and deposit guarantees." },
      { title: "Dutch-language social content is scarce", description: "Most challengers run English-language ads in NL. Dutch-language creative outperforms by 23% on recall (Nielsen 2024)." },
    ],
  }),

  funnel: JSON.stringify({
    stages: [
      {
        name: "Awareness",
        goal: "Reach 70% of target audience at least 3 times",
        channels: ["YouTube Pre-roll", "Meta Video", "Spotify Audio", "Programmatic Display"],
        kpi: "Impressions / Aided Awareness",
        target: "42M impressions · 40% awareness",
        message_type: "Emotional brand story — 'Banking that actually works for you'",
        budget_pct: 40,
        conversion_rate: "4.2% click-through to consideration",
      },
      {
        name: "Consideration",
        goal: "Drive active product comparison and app store visits",
        channels: ["Google Search", "Meta Carousel", "YouTube TrueView", "Reddit"],
        kpi: "Website visits / App store page views",
        target: "180,000 website visits · 95,000 app page views",
        message_type: "Rational comparison — fee savings calculator, feature checklist",
        budget_pct: 30,
        conversion_rate: "28% conversion from visit to app download",
      },
      {
        name: "Conversion",
        goal: "Drive account sign-ups at ≤ €45 CPA",
        channels: ["Google Search (brand)", "Meta Retargeting", "App Store Ads"],
        kpi: "Account openings / CPA",
        target: "44,000 accounts · CPA ≤ €45",
        message_type: "Urgency + social proof — 'Join 44,000 people who switched this month'",
        budget_pct: 22,
        conversion_rate: "46% complete onboarding after download",
      },
      {
        name: "Retention",
        goal: "Activate accounts and drive first transaction within 7 days",
        channels: ["Push notifications", "Email", "In-app messages"],
        kpi: "Activation rate / 30-day retention",
        target: "75% activation · 60% 30-day retention",
        message_type: "Onboarding tips + first transaction incentive (€5 cashback)",
        budget_pct: 8,
        conversion_rate: "",
      },
    ],
    retargeting: [
      "Website visitors who did not download the app → Meta + Google Display with fee-saving message (7-day window)",
      "App downloaders who did not complete sign-up → Push notification series + Meta retargeting (3-day window)",
      "Completed sign-up but no first transaction → Email + in-app nudge with €5 cashback offer (7-day window)",
    ],
    budget_split: [
      { stage: "Awareness", pct: 40 },
      { stage: "Consideration", pct: 30 },
      { stage: "Conversion", pct: 22 },
      { stage: "Retention", pct: 8 },
    ],
  }),

  channel: JSON.stringify({
    channels: [
      { name: "YouTube Pre-roll", role: "awareness", motivation: "Highest video reach among 25–38 urban professionals. Non-skippable 15s builds rapid brand familiarity at competitive CPM.", targeting: "25–38, Amsterdam/Rotterdam/Utrecht, interest: fintech, personal finance, design", formats: ["Non-skippable 15s", "Bumper 6s"], always_on: false, reach_index: 88, selectivity_index: 60, score_label: "●●●●○" },
      { name: "Meta Social", role: "awareness", motivation: "Unmatched targeting precision for urban professionals. Instagram Stories and Reels drive strong brand recall and click-through.", targeting: "25–38, 3 cities, behaviours: mobile banking app users, lookalike of current customer base", formats: ["Reels 15s", "Stories", "Feed carousel"], always_on: true, reach_index: 85, selectivity_index: 78, score_label: "●●●●●" },
      { name: "Google Search", role: "conversion", motivation: "Captures high-intent users actively searching for banking alternatives. Brand + competitor keywords drive lowest CPA in the mix.", targeting: "Keywords: gratis bankrekening, beste challenger bank, Bunq alternatief, Vault bank", formats: ["Responsive Search Ads", "Brand keywords"], always_on: true, reach_index: 52, selectivity_index: 94, score_label: "●●●●●" },
      { name: "Programmatic Display", role: "consideration", motivation: "Cost-efficient retargeting layer. Keeps Vault top-of-mind for users who engaged with video but haven't converted.", targeting: "Retargeting: video viewers + website visitors (30-day window). Contextual: personal finance content", formats: ["300x250", "728x90", "Native"], always_on: false, reach_index: 70, selectivity_index: 65, score_label: "●●●●○" },
      { name: "Spotify Audio", role: "awareness", motivation: "Reaches the audience during commute and gym — key moments when they're not scrolling. Audio + display combo drives 18% higher recall.", targeting: "25–35, urban, playlists: workout, commute, focus work", formats: ["Audio 30s + companion banner"], always_on: false, reach_index: 62, selectivity_index: 55, score_label: "●●●○○" },
      { name: "LinkedIn", role: "consideration", motivation: "Targets the freelancer/ZZP segment with precision. Sponsored InMail for freelancer-specific messaging about expense management.", targeting: "Freelancers, self-employed, 26–40, NL, job function: creative, consulting, tech", formats: ["Sponsored content", "InMail"], always_on: false, reach_index: 40, selectivity_index: 88, score_label: "●●●○○" },
    ],
    channel_overlap: [
      { channels: ["YouTube", "Meta"], overlap_pct: 44, insight: "44% of the target audience is reachable on both platforms. Coordinate creative to build a coherent brand story across both touchpoints." },
      { channels: ["YouTube", "Meta", "Search"], overlap_pct: 31, insight: "31% see all three — these are your highest-intent prospects. Ensure message progression from awareness → consideration → conversion." },
    ],
    attribution_model: "Data-driven attribution (Google) + Meta 7-day click / 1-day view",
    frequency_cap: "YouTube: 3x/week · Meta: 4x/week · Display: 5x/week",
    synergy_score: 82,
    synergy_notes: "Strong synergy between YouTube brand building and Google Search conversion. Users exposed to YouTube pre-roll show 2.3x higher Search CTR (Nielsen study, comparable fintech launch 2024).",
  }),

  budget: JSON.stringify({
    total_budget: 2000000,
    net_budget: 1800000,
    by_channel: [
      { channel: "Meta Social",           budget: 504000, pct: 28, motivation: "Highest ROI channel — precision targeting + always-on conversion" },
      { channel: "YouTube Pre-roll",      budget: 396000, pct: 22, motivation: "Primary awareness driver, strong brand recall" },
      { channel: "Google Search",         budget: 360000, pct: 20, motivation: "Lowest CPA channel — captures high intent" },
      { channel: "Programmatic Display",  budget: 252000, pct: 14, motivation: "Cost-efficient retargeting layer" },
      { channel: "Spotify Audio",         budget: 162000, pct: 9,  motivation: "Commute reach, incremental to video" },
      { channel: "LinkedIn",              budget: 126000, pct: 7,  motivation: "ZZP/freelancer segment precision" },
    ],
    by_funnel: [
      { stage: "Awareness",     budget: 720000, pct: 40 },
      { stage: "Consideration", budget: 540000, pct: 30 },
      { stage: "Conversion",    budget: 396000, pct: 22 },
      { stage: "Retention",     budget: 144000, pct: 8  },
    ],
    test_budget: {
      amount: 180000,
      pct: 10,
      tests: ["Dutch vs English creative A/B test", "Fee calculator vs emotional spot", "Influencer micro vs macro test"],
    },
    pacing: {
      strategy: "Burst + Always-on",
      motivation: "Heavy burst in weeks 1–3 to build rapid awareness, transition to always-on performance focus from week 4",
      weeks: [
        { week: 1,  budget: 280000, phase: "Burst",     focus: "Maximum launch reach. YouTube + Meta at full spend. All creatives live simultaneously to build instant brand presence." },
        { week: 2,  budget: 260000, phase: "Burst",     focus: "Sustain burst. Increase frequency for brand recall. Monitor CPM and pause underperforming ad sets." },
        { week: 3,  budget: 220000, phase: "Burst",     focus: "Wind down burst. Activate Google Search and LinkedIn. First conversion data starting to come in." },
        { week: 4,  budget: 180000, phase: "Peak",      focus: "Shift to performance mode. Retargeting activated. A/B test results analysed — scale winners." },
        { week: 5,  budget: 175000, phase: "Peak",      focus: "Optimise toward CPA ≤ €45. Double down on best-performing Meta audiences. Pause Spotify if CPM too high." },
        { week: 6,  budget: 155000, phase: "Peak",      focus: "Mid-campaign review. Reallocate budget from Display to Search if conversion rates hold." },
        { week: 7,  budget: 130000, phase: "Always-on", focus: "Steady state. Meta + Search as core always-on channels. Creative refresh to avoid fatigue." },
        { week: 8,  budget: 120000, phase: "Always-on", focus: "Retargeting intensification. CPA optimisation. Lookalike expansion based on converters." },
        { week: 9,  budget: 115000, phase: "Always-on", focus: "Long-tail conversions. Push referral programme to existing customers for organic growth." },
        { week: 10, budget: 95000,  phase: "Always-on", focus: "Final push. Maximise best performers. Prepare learnings document for Q2 planning." },
      ],
    },
  }),

  mediaplan: JSON.stringify({
    channels: [
      { name: "Meta Social", funnel_stage: "Awareness + Conversion", platform: "Meta (Facebook/Instagram)", buy_type: "Auction", targeting: "25–38, 3 cities, lookalike + interest", formats: ["Reels 15s", "Stories", "Feed"], budget: 504000, impressions: 28000000, reach: 220000, frequency: 3.8, cpm: 18.00, vtr: 42, cpv: 0.043, clicks: 840000, ctr: 3.0, cpc: 0.60, visits: 672000, cpa_visit: 0.75, conversions: 18144, cvr: 2.7, cpa: 27.78 },
      { name: "YouTube Pre-roll", funnel_stage: "Awareness", platform: "YouTube", buy_type: "Programmatic / Reserve", targeting: "25–38 urban, interest: fintech, personal finance", formats: ["Non-skippable 15s", "Bumper 6s"], budget: 396000, impressions: 22000000, reach: 185000, frequency: 3.2, cpm: 18.00, vtr: 36, cpv: 0.050, clicks: 440000, ctr: 2.0, cpc: 0.90, visits: 352000, cpa_visit: 1.13, conversions: 7040, cvr: 2.0, cpa: 56.25 },
      { name: "Google Search", funnel_stage: "Conversion", platform: "Google Ads", buy_type: "CPC auction", targeting: "Keywords: gratis bankrekening, challenger bank NL, Vault bank", formats: ["Responsive Search Ads"], budget: 360000, impressions: 3600000, reach: 120000, frequency: 2.1, cpm: 100.00, vtr: 0, cpv: 0, clicks: 288000, ctr: 8.0, cpc: 1.25, visits: 259200, cpa_visit: 1.39, conversions: 12960, cvr: 5.0, cpa: 27.78 },
      { name: "Programmatic Display", funnel_stage: "Consideration", platform: "DV360 / Trade Desk", buy_type: "Programmatic RTB", targeting: "Retargeting: video viewers + site visitors (30-day)", formats: ["300x250", "Native"], budget: 252000, impressions: 18000000, reach: 95000, frequency: 5.3, cpm: 14.00, vtr: 0, cpv: 0, clicks: 162000, ctr: 0.9, cpc: 1.56, visits: 129600, cpa_visit: 1.94, conversions: 2592, cvr: 2.0, cpa: 97.22 },
      { name: "Spotify Audio", funnel_stage: "Awareness", platform: "Spotify", buy_type: "Reservation", targeting: "25–35 urban, commute + workout playlists", formats: ["Audio 30s + companion banner"], budget: 162000, impressions: 5400000, reach: 72000, frequency: 2.5, cpm: 30.00, vtr: 0, cpv: 0, clicks: 54000, ctr: 1.0, cpc: 3.00, visits: 43200, cpa_visit: 3.75, conversions: 864, cvr: 2.0, cpa: 187.50 },
      { name: "LinkedIn", funnel_stage: "Consideration", platform: "LinkedIn", buy_type: "Auction", targeting: "Freelancers, ZZP, 26–40, NL", formats: ["Sponsored content", "InMail"], budget: 126000, impressions: 2100000, reach: 42000, frequency: 2.0, cpm: 60.00, vtr: 0, cpv: 0, clicks: 63000, ctr: 3.0, cpc: 2.00, visits: 50400, cpa_visit: 2.50, conversions: 2016, cvr: 4.0, cpa: 62.50 },
    ],
    totals: {
      budget: 1800000,
      impressions: 79100000,
      clicks: 1847000,
      conversions: 43616,
    },
  }),

  synthesis: JSON.stringify({
    summary: "Vault's Q1 2026 launch campaign positions the brand as the go-to digital bank for urban professionals aged 25–38 in Amsterdam, Rotterdam and Utrecht. With a €2M budget across 10 weeks, the strategy delivers an estimated 43,600 account openings at an average CPA of €41 — within the €45 target. The plan leads with a heavy awareness burst on YouTube and Meta, transitions to a performance-led always-on phase, and closes with retargeting and referral activation. Three personas — Daan, Sven and Lisa — anchor all creative decisions, ensuring relevance across design-conscious professionals, freelancers and career starters.",
    strategic_core: [
      "Own the 'zero-fee, full-control' positioning — no competitor has claimed this clearly in Dutch-language creative",
      "Lead with emotion, close with reason — brand film drives awareness, fee calculator closes conversion",
      "Meta + Search as the performance engine — these two channels deliver 70% of conversions at the lowest CPA",
    ],
    recommendations: [
      { title: "Produce Dutch-language creative from day one", description: "Research shows Dutch-language ads outperform English by 23% on recall among this target group. All hero assets should be in Dutch, even if the product UI is bilingual.", priority: "high" },
      { title: "Launch a referral programme in week 6", description: "At ~20,000 accounts opened by week 6, a referral mechanic (€10 for referrer + referee) can drive significant organic growth at €20 CPA — well below paid channels.", priority: "high" },
      { title: "Invest in a fee-savings calculator landing page", description: "Users converting from Search show 2.1x higher intent when they can input their current bank and see a personalised savings amount. Build this before launch.", priority: "medium" },
    ],
    risks: [
      { risk: "Bunq or Revolut respond with aggressive counter-spend", mitigation: "Monitor SOV weekly via Kantar. Have a contingency budget of €100K ready to defend Search keywords and key Meta audiences." },
      { risk: "CPA exceeds €45 in weeks 1–3 (burst phase)", mitigation: "Burst is intentionally brand-focused — CPA will be high early. Do not optimise toward CPA until week 4. Set a blended CPA target across the full 10 weeks." },
    ],
    next_steps: [
      { action: "Brief creative agency on hero brand film (30s) and social cutdowns (15s, 6s)", owner: "Brand team", timing: "Week –4 before launch" },
      { action: "Build fee-savings calculator and dedicated landing page", owner: "Product + Web team", timing: "Week –3 before launch" },
      { action: "Set up campaign tracking: UTM structure, Adjust/Appsflyer, Google Analytics 4", owner: "Data & Analytics", timing: "Week –2 before launch" },
    ],
  }),
};
