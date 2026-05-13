export const T = {
  bg:   "#ECEDF0",
  sur:  "#FFFFFF",
  s2:   "#F7F7F9",
  s3:   "#F0EFF4",
  t1:   "#0D0D0D",
  t2:   "#3A3A3A",
  t3:   "#888888",
  t4:   "#BBBBBB",
  p1:   "#1A0050",
  p2:   "#5B21B6",
  p3:   "#7C3AED",
  p4:   "#A855F7",
  p5:   "#C4B5FD",
  p6:   "#EDE9FE",
  pa:   "#6D28D9",
  shad: "0 1px 3px rgba(0,0,0,.06)",
} as const;

export const TY = {
  cardLabel:  { fontSize: 9,  fontWeight: 600, color: T.t3, textTransform: "uppercase" as const, letterSpacing: ".06em", marginBottom: 4 },
  bodyLg:     { fontSize: 13, color: T.t2, lineHeight: 1.65 },
  bodyMd:     { fontSize: 12, color: T.t2, lineHeight: 1.6 },
  bodySm:     { fontSize: 11, color: T.t2, lineHeight: 1.55 },
  label:      { fontSize: 10, color: T.t3, fontWeight: 500 },
  num:        { fontSize: 16, fontWeight: 700, color: T.t1, letterSpacing: "-.02em", lineHeight: 1 },
} as const;

// Shared section header used in every section
export const secHeader = (num: string, agent: string, title: string) => ({ num, agent, title });
