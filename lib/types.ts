// ─── Phase types ──────────────────────────────────────────────

export type PhaseKey =
  | "briefing"
  | "audience"
  | "market"
  | "competitive"
  | "strategy"
  | "budget"
  | "mediaplan"
  | "synthesis";

export interface Phase {
  key:   PhaseKey;
  label: string;
  agent: string;
}

// ─── Section data types ───────────────────────────────────────

export interface BriefingData {
  brand:           string;
  intro:           string;
  business_goals:  { goal: string; target: string; metric: string }[];
  marketing_goals: { kpi: string; target: string }[];
  params:          { budget: string; duration: string; geo: string; timing: string };
}

export interface PlatformPresence {
  platform:          string;
  reach_index:       number;
  selectivity_index: number;
  score_label:       string;
}

export interface PersonaData {
  name:              string;
  age:               string;
  job:               string;
  income?:           string;
  education?:        string;
  living_situation?: string;
  media_prime_time?: string;
  daily_media_hours?: string;
  mindset?:          string;
  pain_points:       string[];
  motivations:       string[];
  trigger_moments?:  string[];
  platforms:         string[];
  trust_builders?:   string[];
  purchase_trigger?: string;
  platform_presence?: PlatformPresence[];
  recommended?:      boolean;
}

export interface TotalAudienceData extends PersonaData {
  age_range:     string;
  jobs:          string;
  size_estimate: string;
}

export interface AudienceData {
  total:    TotalAudienceData;
  personas: PersonaData[];
  barriers: { barrier: string; solution: string }[];
}

export interface RecentAd {
  format:      string;
  platform:    string;
  description: string;
  angle:       string;
}

export interface Competitor {
  name:             string;
  est_budget:       string;
  channels:         string[];
  positioning:      string;
  strengths:        string[];
  weaknesses:       string[];
  sov_pct:          number;
  market_share_pct: number;
  recent_ads:       RecentAd[];
}

export interface PositioningBrand {
  name:       string;
  x:          number;  // 0-100: Traditional=0, Innovative=100
  y:          number;  // 0-100: Accessible=0, Premium=100
  color?:     string;
}

export interface CreativePattern {
  label: string;
  icon:  string;
}

export interface CompetitorWeakness {
  name:      string;
  weakness:  string;
  color?:    string;
}

export interface WhiteSpaceItem {
  label: string;
}

export interface CompetitiveData {
  competitors:       Competitor[];
  sov:               { brand?: string; name?: string; pct: number; insight?: string }[];
  market_share:      { brand?: string; name?: string; pct: number; insight?: string }[];
  sov_insight?:      string;
  market_share_insight?: string;
  positioning_map?:  PositioningBrand[];
  positioning_insight?: string;
  creative_patterns?: CreativePattern[];
  weaknesses?:       CompetitorWeakness[];
  market_gaps:       { title: string; description: string }[];
  white_space?:      WhiteSpaceItem[];
  white_space_title?: string;
}

// Market — new section
export interface MarketSegment  { name: string; pct: number; }
export interface MarketTrend    { direction: "up" | "down" | "neutral"; title: string; description: string; }
export interface MarketGap      { title: string; description: string; }
export interface MarketData {
  tam?:                   string;
  sam?:                   string;
  target_size?:           string;
  growth?:                string;
  segments?:              MarketSegment[];
  trends?:                MarketTrend[];
  consumer_behaviour?:    string;
  opportunities?:         MarketGap[];
  why_now?:               string[];
  strategic_implications?: string[];
  risks?:                 string[];
  positioning_space?:     string;
}

// Strategy — full media strategy
export interface FunnelStage {
  name:            string;
  goal:            string;
  channels:        string[];
  kpi:             string;
  target:          string;
  message_type:    string;
  budget_pct:      number;
  conversion_rate: string;
}

export interface Channel {
  name:              string;
  role:              string;
  motivation:        string;
  targeting:         string;
  formats:           string[];
  always_on:         boolean;
  reach_index:       number;
  selectivity_index: number;
  score_label:       string;
}

export interface ChannelOverlap {
  channels:    string[];
  overlap_pct: number;
  insight:     string;
}

export interface AudiencePriority {
  segment:  string;
  why:      string;
  priority: "primary" | "secondary" | string;
}

export interface MessagingPillar {
  title:       string;
  description: string;
}

export interface ChannelRole {
  channel: string;
  role:    string;
  why:     string;
}

export interface RetargetingRule {
  trigger: string;
  action:  string;
}

export interface BudgetStage {
  stage:  string;
  amount: string;
  pct:    number;
}

export interface SuccessMetric {
  label: string;
  value: string;
}

export interface StrategyData {
  // 1. Strategic idea
  strategic_idea?:      string;
  // 2. Audience priority
  audience_priority?:   AudiencePriority[];
  // 3. Messaging pillars
  messaging_pillars?:   MessagingPillar[];
  // 4. Funnel
  stages:               FunnelStage[];
  // 5. Channel roles
  channel_roles?:       ChannelRole[];
  // 6. Retargeting
  retargeting:          string[];
  retargeting_rules?:   RetargetingRule[];
  // 7. Synergy
  channels:             Channel[];
  channel_overlap:      ChannelOverlap[];
  synergy_score?:       number;
  synergy_notes?:       string;
  // 8. Budget rationale
  budget_stages?:       BudgetStage[];
  budget_rationale?:    string;
  // 9. Success metrics
  north_star_kpi?:      string;
  north_star_desc?:     string;
  success_metrics?:     SuccessMetric[];
}

export interface PacingWeek {
  week:         number;
  budget:       number;
  phase:        string;
  focus:        string;
  stage_split?: { awareness?: number; consideration?: number; conversion?: number; retention?: number };
}

export interface OptimisationRule {
  icon:  string;
  title: string;
  desc:  string;
}

export interface TestItem {
  title:    string;
  option_a: string;
  option_b: string;
}

export interface BudgetData {
  total_budget:     number;
  net_budget:       number;
  by_channel:       { channel: string; budget: number; pct: number; motivation?: string }[];
  by_funnel:        { stage: string; budget: number; pct: number }[];
  budget_rationale?: string[];
  test_budget:      { amount: number; pct: number; tests: string[]; refresh_week?: number };
  pacing:           { strategy: string; motivation: string; weeks: PacingWeek[]; phases?: { label: string; weeks: string; description: string; color: string }[] };
  optimisation_rules?: OptimisationRule[];
  test_items?:      TestItem[];
}

export interface MediaChannel {
  name:         string;
  funnel_stage: string;
  platform:     string;
  buy_type:     string;
  targeting:    string;
  formats:      string[];
  budget:       number;
  impressions:  number;
  cpm:          number;
  clicks:       number;
  ctr:          number;
  conversions:  number;
  cpa:          number;
}

export interface ExecutionInsight {
  icon:  string;
  title: string;
  desc:  string;
}

export interface MediaplanData {
  channels:            MediaChannel[];
  totals:              { budget: number; impressions: number; clicks: number; conversions: number; blended_cpa?: number };
  execution_insights?: ExecutionInsight[];
  optimisation_notes?: string[];
}

export interface SynthesisRisk {
  risk:       string;
  mitigation: string;
  level:      "high" | "medium" | "low";
}

export interface SynthesisRecommendation {
  title:       string;
  description: string;
  priority:    "high" | "medium" | "low";
}

export interface SynthesisNextStep {
  action: string;
  owner:  string;
  timing: string;
}

export interface SynthesisOutcome {
  label: string;
  value: string;
  sub?:  string;
}

export interface SynthesisData {
  // 1
  summary:          string;
  summary_paragraphs?: string[];
  campaign_name?:   string;
  // 2
  strategic_core:   { title: string; description: string }[];
  // 3
  outcomes?:        SynthesisOutcome[];
  // 4
  risks:            SynthesisRisk[];
  // 5
  recommendations:  SynthesisRecommendation[];
  // 6
  next_steps:       SynthesisNextStep[];
}

// Union of all section data types
export type SectionData =
  | BriefingData
  | AudienceData
  | MarketData
  | CompetitiveData
  | StrategyData
  | BudgetData
  | MediaplanData
  | SynthesisData;

// ─── App state ────────────────────────────────────────────────

export interface Message {
  id:   number;
  from: string;
  to:   string | null;
  text: string;
  type: "normal" | "handoff" | "question";
  ts:   string;
}

export interface Session {
  id:        string;
  brand:     string;
  briefing:  string;
  outputs:   Record<string, string>;
  parsed:    Record<string, SectionData | null>;
  createdAt: string;
}

export type FeedbackRating = "good" | "improve" | "bad";

export interface FeedbackEntry {
  id:            string;
  timestamp:     string;
  phase:         PhaseKey;
  rating:        FeedbackRating;
  comment:       string;
  outputSnippet: string;
  promptVersion: string;
}
