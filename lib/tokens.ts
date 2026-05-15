// ─────────────────────────────────────────────────────────────
// MediaStudio Design System v1.0
// Single source of truth — never hardcode values elsewhere
// ─────────────────────────────────────────────────────────────

// ── Colour ────────────────────────────────────────────────────
export const C = {
  // Page surfaces
  pageBg:  "#F5F4F0",   // warm off-white — always the page background
  navBg:   "#FAFAF8",   // top nav
  white:   "#FFFFFF",   // standard card background
  inset:   "#F5F4F0",   // zebra row alt / inner block (same as pageBg intentionally)
  zebraAlt:"#F8F7F4",   // table zebra alt row (slightly warmer than pageBg)
  border:  "#E8E6E0",   // dividers, subtle separators

  // Text
  ink:     "#0D0D0D",   // primary headings
  body:    "#0D0D0D",   // body text (same as ink — use muted for secondary)
  muted:   "#888888",   // labels, secondary text, captions
  faint:   "#BBBBBB",   // placeholders, disabled

  // Purple ramp — structural use only (see COLOUR_RULES below)
  p900:    "#1A0050",
  p800:    "#3B1591",
  p700:    "#5B21B6",
  p600:    "#7C3AED",
  p400:    "#A855F7",
  p300:    "#C4B5FD",
  p100:    "#EDE9FE",

  // Semantic signal colours
  threat:   "#7F1D1D",   // dreiging hero top-line
  danger:   "#A32D2D",   // danger label/text
  warning:  "#BA7517",   // warning label/text
  success:  "#1D9E75",   // positive outcome

  // Shadows — never use border + shadow together on cards
  shadow:   "0 2px 8px rgba(0,0,0,.06)",
  shadowSm: "0 1px 4px rgba(0,0,0,.05)",
} as const;

// ── Hero card tints ────────────────────────────────────────────
// Lichte achtergrond + top-lijn kleuren voor hero cards.
// Tekst is altijd de donkere variant van de tint-kleur.
export const HERO = {
  kans: {
    bg:       "#F0EFF8",   // blauw-paars tint
    line:     "#1A0050",   // p900
    label:    "#5B21B6",   // p700
    heroText: "#1A0050",   // p900
    bodyText: "#5B21B6",   // p700
  },
  dreiging: {
    bg:       "#F8EFEF",   // warm rood tint
    line:     "#7F1D1D",   // threat
    label:    "#A32D2D",   // danger
    heroText: "#7F1D1D",   // threat
    bodyText: "#A32D2D",   // danger
  },
  insight: {
    bg:       "#EEEDFE",   // p100
    line:     "#5B21B6",   // p700
    label:    "#5B21B6",   // p700
    heroText: "#3C1591",   // p800
    bodyText: "#5B21B6",   // p700
  },
  kansCard: {
    bg:       "#EEF0FA",   // koeler blauw voor gap/white-space cards
    line:     "#1A0050",
    label:    "#5B21B6",
    heroText: "#1A0050",
    bodyText: "#5B21B6",
  },
  success: {
    bg:       "#EBF7F1",
    line:     "#1D9E75",
    label:    "#1D9E75",
    heroText: "#0A5C3F",
    bodyText: "#1D9E75",
  },
  warning: {
    bg:       "#FDF4E7",
    line:     "#BA7517",
    label:    "#BA7517",
    heroText: "#713F00",
    bodyText: "#BA7517",
  },
  risk: {
    bg:       "#FEF2F2",
    line:     "#A32D2D",
    label:    "#A32D2D",
    heroText: "#7F1D1D",
    bodyText: "#A32D2D",
  },
} as const;

// ── Typography ─────────────────────────────────────────────────
// 4 sizes only. Never deviate.
export const FS = {
  // 10px — uppercase, #888, letter-spacing .08em, weight 500
  // Use for: card section titles, KPI labels, tab labels, column headers
  label:      10,
  // 13px — #0D0D0D primary, #888 secondary
  // Use for: all list items, body text, table rows, descriptions
  body:       13,
  // 11px — always #888 — supporting/secondary only
  bodySm:     11,
  // 16px — weight 500, #0D0D0D
  // Use for: persona names, KPI values, card primary values
  title:      16,
  // 22px — weight 500
  // Use for: company name on hero cards, hero numbers
  hero:       22,
} as const;

// Legacy aliases (keep for backward compat)
export const FSlegacy = {
  cardLabel:  FS.label,
  bodyXs:     10,
  bodySm:     FS.bodySm,
  body:       FS.body,
  bodyLg:     FS.body,
  sectionTitle: FS.hero,
} as const;

// ── Spacing ────────────────────────────────────────────────────
export const SP = {
  pagePad:  16,   // page left/right padding
  cardPad:  18,   // card internal padding
  gap:      10,   // gap between sibling cards
  gapLg:    14,   // gap for persona cards
  radius:   14,   // card border-radius
  radiusSm: 12,   // small card / KPI card border-radius
  radiusXs:  8,   // inner block border-radius (test-agenda, trigger blocks)
} as const;

// ── Funnel / data series colours ───────────────────────────────
// Used consistently across Strategy, Budget, Mediaplan
export const SERIES = [C.p900, C.p700, C.p600, C.p300] as const;

export const FUNNEL: Record<string, string> = {
  awareness:     C.p900,
  consideration: C.p700,
  conversion:    C.p600,
  retention:     C.p300,
};

// ── Bullet colours ─────────────────────────────────────────────
// Pain points  = C.muted (#888)   — neutral, user suffers this
// Motivations  = C.p700 (#5B21B6) — active, Vault addresses this
// Implications = C.p700
// Risks        = C.warning / C.danger
export const BULLET = {
  pain:        C.muted,
  motivation:  C.p700,
  implication: C.p700,
  risk:        C.warning,
} as const;

// ── Motion ─────────────────────────────────────────────────────
// ALWAYS: bar fills, number counters, card slideInUp, SVG draw-on, bubble scale-in, donut
// CONDITIONAL: persona flip (only if real front/back), hover on clickable items
// NEVER: plain text, labels, headings, tab nav, static content
export const MOTION = {
  barFill:     "width 1s cubic-bezier(.4,0,.2,1)",
  counter:     1200,          // ms
  slideInUp:   ".4s ease both",
  staggerCard: 70,            // ms per card
  staggerBar:  100,           // ms per bar
  svgDraw:     "stroke-dashoffset 1s ease",
  bubbleIn:    "transform .45s cubic-bezier(.34,1.56,.64,1)",
} as const;

// ── Grid ───────────────────────────────────────────────────────
export const GRID = {
  kpiStrip4:    "repeat(4,1fr)",
  kpiStrip5:    "repeat(5,1fr)",
  twoCol:       "1fr 1fr",
  threeCol:     "repeat(3,1fr)",
  personaCol:   "repeat(3,1fr)",  // always 3 personas
  barrierCol:   "repeat(3,1fr)",  // always 3 per row
} as const;

// ── Card helpers ───────────────────────────────────────────────
// Call these to get consistent card style objects
export function cardStyle(extra?: Record<string, unknown>) {
  return {
    background:   C.white,
    borderRadius: SP.radius,
    boxShadow:    C.shadow,
    overflow:     "hidden" as const,
    ...extra,
  };
}

export function heroCardStyle(
  variant: keyof typeof HERO,
  extra?: Record<string, unknown>
) {
  const h = HERO[variant];
  return {
    background:   h.bg,
    borderRadius: SP.radius,
    boxShadow:    C.shadow,
    overflow:     "hidden" as const,
    ...extra,
  };
}

export function heroLineStyle(variant: keyof typeof HERO) {
  return {
    height:       4,
    background:   HERO[variant].line,
    borderRadius: `${SP.radius}px ${SP.radius}px 0 0`,
    flexShrink:   0 as const,
  };
}

export function kpiCardStyle(extra?: Record<string, unknown>) {
  return {
    background:   C.white,
    borderRadius: SP.radiusSm,
    boxShadow:    C.shadow,
    overflow:     "hidden" as const,
    ...extra,
  };
}

// Label style — always the same
export const labelStyle = {
  fontSize:      FS.label,
  fontWeight:    700 as const,
  color:         C.muted,
  textTransform: "uppercase" as const,
  letterSpacing: ".08em",
  marginBottom:  10,
} as const;

// Insight strip — left purple border
export function insightStyle(extra?: Record<string, unknown>) {
  return {
    background:  C.p100,
    borderLeft:  `3px solid ${C.p700}`,
    borderRadius:`0 ${SP.radiusSm}px ${SP.radiusSm}px 0`,
    padding:     "12px 16px",
    ...extra,
  };
}
