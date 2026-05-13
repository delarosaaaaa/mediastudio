import { T, TY } from "@/lib/tokens";

interface KpiCardProps {
  label: string;
  value: string | number | undefined | null;
  sub?:  string;
}

export function KpiCard({ label, value, sub }: KpiCardProps) {
  const str = String(value ?? "—");
  const fs  = str.length > 30 ? 10 : str.length > 20 ? 11 : str.length > 12 ? 12 : 16;
  return (
    <div style={{ background: T.sur, borderRadius: 14, boxShadow: T.shad, padding: "14px 16px", borderTop: `3px solid ${T.pa}` }}>
      <div style={{ ...TY.cardLabel }}>{label}</div>
      <div style={{ fontSize: fs, fontWeight: 700, color: T.t1, letterSpacing: "-.02em", lineHeight: 1.3 }}>{str}</div>
      {sub && <div style={{ ...TY.label, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
