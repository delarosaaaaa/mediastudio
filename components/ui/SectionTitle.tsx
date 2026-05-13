import { T, TY } from "@/lib/tokens";

interface SectionTitleProps { a: string; b?: string; sub?: string; }

export function SectionTitle({ a, b, sub }: SectionTitleProps) {
  return (
    <div style={{ marginBottom: sub ? 5 : 16 }}>
      <div style={{ ...TY.sectionTitle, marginBottom: 0 }}>
        <span style={{ fontWeight: 700 }}>{a}</span>
        {b && <span style={{ fontWeight: 400 }}> {b}</span>}
      </div>
      {sub && <div style={{ ...TY.label, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}
