import { T, TY } from "@/lib/tokens";

interface KpiCardProps {
  label: string;
  value: string | number | undefined | null;
  sub?:  string;
}

export function KpiCard({ label, value, sub }: KpiCardProps) {
  const str = String(value ?? "—");
  const fs  = str.length > 28 ? 11 : str.length > 18 ? 12 : str.length > 10 ? 14 : 16;
  return (
    <div style={{
      background: T.sur, borderRadius: 10, padding: "11px 14px",
      borderTop: `2px solid ${T.pa}`, boxShadow: T.shad,
    }}>
      <div style={{ ...TY.cardLabel }}>{label}</div>
      <div style={{ fontSize: fs, fontWeight: 700, color: T.t1, letterSpacing: "-.02em", lineHeight: 1.2 }}>{str}</div>
      {sub && <div style={{ ...TY.label, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}
