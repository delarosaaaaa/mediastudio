"use client";
import { T } from "@/lib/tokens";

interface Tab { key: string | number; label: string; }
interface TabBarProps {
  tabs:     Tab[];
  active:   string | number;
  onSelect: (key: string | number) => void;
}

export function TabBar({ tabs, active, onSelect }: TabBarProps) {
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${T.s2}`, overflowX: "auto" }}>
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onSelect(t.key)}
          style={{
            padding: "12px 18px",
            fontSize: 12,
            fontWeight: 600,
            color: active === t.key ? T.pa : T.t3,
            background: "transparent",
            borderWidth: 0,
            borderBottom: `2px solid ${active === t.key ? T.pa : "transparent"}`,
            cursor: "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
