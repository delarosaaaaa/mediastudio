// ─────────────────────────────────────────────────────────────
// Design tokens — Option C "Warm Editorial"
// ALL design values live here. Never hardcode colours elsewhere.
// ─────────────────────────────────────────────────────────────

export const C = {
  // Page
  pageBg:     "#F5F4F0",   // warm off-white — body background
  navBg:      "#FAFAF8",   // slightly lighter — top nav
  // Surfaces
  white:      "#FFFFFF",   // cards
  inset:      "#EFEDE8",   // inset elements inside cards
  border:     "#E8E6E0",   // dividers, card borders
  // Text
  ink:        "#0D0D0D",   // headings
  body:       "#3A3A3A",   // body copy
  muted:      "#888888",   // labels, captions
  faint:      "#BBBBBB",   // placeholders, disabled
  // Purple ramp
  p900:       "#1A0050",   // darkest — hero gradients, awareness
  p700:       "#5B21B6",   // primary action colour
  p600:       "#7C3AED",   // section accent, icons
  p400:       "#A855F7",   // tags, section number
  p300:       "#C4B5FD",   // light purple
  p100:       "#EDE9FE",   // chip backgrounds, tag bg
  // Shadows
  shadow:     "0 2px 14px rgba(0,0,0,.07)",
  shadowSm:   "0 1px 4px rgba(0,0,0,.05)",
} as const;

// Funnel phase colours — used consistently across Strategy, Budget, Mediaplan
export const FUNNEL_COLORS: Record<string, string> = {
  awareness:     C.p900,
  consideration: C.p700,
  conversion:    C.p600,
  retention:     C.p300,
};

// Typography scale — only use these, never ad-hoc font sizes
export const FS = {
  sectionNum:   9,
  cardLabel:    9,
  bodyXs:       10,
  bodySm:       11,
  body:         12,
  bodyLg:       13,
  sectionTitle: 22,
  heroTitle:    26,
  welcomeTitle: 36,
} as const;
