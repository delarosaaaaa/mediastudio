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
  shad: "0 2px 16px rgba(0,0,0,.07),0 1px 4px rgba(0,0,0,.04)",
} as const;

export const TY = {
  sectionTitle: { fontSize: 18, fontWeight: 700, color: T.t1, marginBottom: 16 },
  cardLabel:    { fontSize: 10, fontWeight: 600, color: T.t3, textTransform: "uppercase" as const, letterSpacing: ".05em", marginBottom: 4 },
  bodyLg:       { fontSize: 13, color: T.t2, lineHeight: 1.65 },
  bodyMd:       { fontSize: 12, color: T.t2, lineHeight: 1.6 },
  bodySm:       { fontSize: 11, color: T.t2, lineHeight: 1.55 },
  label:        { fontSize: 10, color: T.t3, fontWeight: 500 },
  num:          { fontSize: 17, fontWeight: 700, color: T.t1, letterSpacing: "-.02em" },
  numLg:        { fontSize: 22, fontWeight: 800, color: T.t1, letterSpacing: "-.03em", lineHeight: 1 },
} as const;
