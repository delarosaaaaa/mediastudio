// ─── Phase & Agent types ──────────────────────────────────────

export type PhaseKey =
  | "briefing" | "audience" | "competitive" | "funnel"
  | "channel"  | "budget"   | "mediaplan"   | "synthesis";

export interface Phase {
  key:   PhaseKey;
  label: string;
  agent: string;
}

// ─── AI response data types ───────────────────────────────────

export interface BriefingData {
  brand:            string;
  intro:            string;
  business_goals:   { goal: string; target: string; metric: string }[];
  marketing_goals:  { kpi: string; target: string }[];
  params:           { budget: string; duration: string; geo: string; timing: string };
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
  lifestyle:         string;
  media_prime_time:  string;
  daily_media_hours: string;
  pain_points:       string[];
  motivations:       string[];
  platforms:         string[];
  values:            string;
  purchase_trigger:  string;
  platform_presence: PlatformPresence[];
}

export interface TotalAudienceData extends PersonaData {
  age_range:      string;
  jobs:           string;
  size_estimate:  string;
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
  name:              string;
  est_budget:        string;
  channels:          string[];
  positioning:       string;
  strengths:         string[];
  weaknesses:        string[];
  sov_pct:           number;
  market_share_pct:  number;
  recent_ads:        RecentAd[];
}

export interface CompetitiveData {
  competitors:  Competitor[];
  sov:          { brand?: string; name?: string; pct: number }[];
  market_share: { brand?: string; name?: string; pct: number }[];
  market_gaps:  { title: string; description: string }[];
}

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

export interface FunnelData {
  stages:       FunnelStage[];
  retargeting:  string[];
  budget_split: { stage: string; pct: number }[];
}

export interface Channel {
  name:               string;
  role:               "awareness" | "consideration" | "conversion";
  motivation:         string;
  targeting:          string;
  formats:            string[];
  always_on:          boolean;
  reach_index:        number;
  selectivity_index:  number;
  score_label:        string;
}

export interface ChannelOverlap {
  channels:    string[];
  overlap_pct: number;
  insight:     string;
}

export interface ChannelData {
  channels:         Channel[];
  channel_overlap:  ChannelOverlap[];
  attribution_model: string;
  frequency_cap:    string;
  synergy_score:    number;
  synergy_notes:    string;
}

export interface BudgetChannel {
  channel:    string;
  budget:     number;
  pct:        number;
  motivation: string;
}

export interface PacingWeek {
  week:   number;
  budget: number;
  phase:  string;
  focus:  string;
}

export interface BudgetData {
  total_budget: number;
  net_budget:   number;
  by_channel:   BudgetChannel[];
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
  reach:        number;
  frequency:    number;
  cpm:          number;
  vtr:          number;
  cpv:          number;
  clicks:       number;
  ctr:          number;
  cpc:          number;
  visits:       number;
  cpa_visit:    number;
  conversions:  number;
  cvr:          number;
  cpa:          number;
}

export interface MediaplanData {
  channels: MediaChannel[];
  totals:   { budget: number; impressions: number; clicks: number; conversions: number };
}

export interface SynthesisData {
  summary:        string;
  strategic_core: string[];
  recommendations: { title: string; description: string; priority: "high" | "medium" | "low" }[];
  risks:          { risk: string; mitigation: string }[];
  next_steps:     { action: string; owner: string; timing: string }[];
}

export type SectionData =
  | BriefingData | AudienceData | CompetitiveData | FunnelData
  | ChannelData  | BudgetData   | MediaplanData   | SynthesisData;

// ─── App state ────────────────────────────────────────────────

export interface Message {
  id:     number;
  from:   string;
  to:     string | null;
  text:   string;
  type:   "normal" | "handoff" | "question";
  ts:     string;
}

export interface Session {
  id:        string;
  brand:     string;
  briefing:  string;
  outputs:   Record<string, string>;
  parsed:    Record<string, SectionData | null>;
  createdAt: string;
}

// ─── Feedback ─────────────────────────────────────────────────

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
