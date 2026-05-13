import type { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?:   CSSProperties;
}

export function Card({ children, style = {} }: CardProps) {
  return (
    <div style={{
      background: "#FFFFFF",
      borderRadius: 14,
      boxShadow: "0 2px 14px rgba(0,0,0,.06)",
      padding: "16px 18px",
      ...style,
    }}>
      {children}
    </div>
  );
}
