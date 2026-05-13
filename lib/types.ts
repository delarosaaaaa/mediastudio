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
  income:            string;
  education:         string;
  living_situation:  string;
  media_prime_time:  string;
  daily_media_hours: string;
  pain_points:       string[];
  motivations:       string[];
  platforms:         string[];
  purchase_trigger:  string;
  platform_presence: PlatformPresence[];
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

export interface CompetitiveData {
  competitors:  Competitor[];
  sov:          { brand?: string; name?: string; pct: number }[];
  market_share: { brand?: string; name?: string; pct: number }[];
  market_gaps:  { title: string; description: string }[];
}

// Market — new section
export interface MarketSegment  { name: string; pct: number; }
export interface MarketTrend    { direction: "up" | "down" | "neutral"; title: string; description: string; }
export interface MarketGap      { title: string; description: string; }
export interface MarketData {
  tam?:              string;
  sam?:              string;
  target_size?:      string;
  growth?:           string;
  segments?:         MarketSegment[];
  trends?:           MarketTrend[];
  opportunities?:    MarketGap[];
  positioning_space?: string;
}

// Strategy — funnel + channel merged
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

export interface StrategyData {
  stages:          FunnelStage[];
  retargeting:     string[];
  channels:        Channel[];
  channel_overlap: ChannelOverlap[];
  synergy_score:   number;
  synergy_notes:   string;
}

export interface PacingWeek {
  week:         number;
  budget:       number;
  phase:        string;
  focus:        string;
  stage_split?: { awareness?: number; consideration?: number; conversion?: number; retention?: number };
}

export interface BudgetData {
  total_budget: number;
  net_budget:   number;
  by_channel:   { channel: string; budget: number; pct: number; motivation: string }[];
  by_funnel:    { stage: string; budget: number; pct: number }[];
  test_budget:  { amount: number; pct: number; tests: string[] };
  pacing:       { strategy: string; motivation: string; weeks: PacingWeek[] };
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

export interface MediaplanData {
  channels: MediaChannel[];
  totals:   { budget: number; impressions: number; clicks: number; conversions: number };
}

export interface SynthesisData {
  summary:         string;
  strategic_core:  string[];
  recommendations: { title: string; description: string; priority: "high" | "medium" | "low" }[];
  risks:           { risk: string; mitigation: string }[];
  next_steps:      { action: string; owner: string; timing: string }[];
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
