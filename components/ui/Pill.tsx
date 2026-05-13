import { T } from "@/lib/tokens";

interface PillProps { label: string; color?: string; }

export function Pill({ label, color = T.pa }: PillProps) {
  return (
    <span style={{
      padding: "2px 9px",
      background: color + "18",
      color,
      borderRadius: 20,
      fontSize: 10,
      fontWeight: 600,
      display: "inline-block",
    }}>
      {label}
    </span>
  );
}
