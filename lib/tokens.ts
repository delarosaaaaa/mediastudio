export const T = {
  bg:   "#F5F4F0",   // warm off-white page background
  sur:  "#FFFFFF",   // card surfaces (white)
  s2:   "#EFEDE8",   // inset elements, subtle backgrounds (slightly darker than bg)
  s3:   "#E8E6E0",   // borders, dividers
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
  shad: "0 2px 14px rgba(0,0,0,.06)",
} as const;

export const TY = {
  cardLabel: { fontSize: 9,  fontWeight: 700 as const, color: "#888888", textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: 9 },
  bodyLg:    { fontSize: 13, color: "#3A3A3A", lineHeight: 1.7 },
  bodyMd:    { fontSize: 12, color: "#3A3A3A", lineHeight: 1.6 },
  bodySm:    { fontSize: 11, color: "#3A3A3A", lineHeight: 1.55 },
  label:     { fontSize: 10, color: "#888888", fontWeight: 500 as const },
  num:       { fontSize: 16, fontWeight: 800 as const, color: "#0D0D0D", letterSpacing: "-.02em" as const, lineHeight: 1 },
} as const;
