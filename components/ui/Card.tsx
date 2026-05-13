import { T } from "@/lib/tokens";
import type { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?:   CSSProperties;
}

export function Card({ children, style = {} }: CardProps) {
  return (
    <div style={{ background: T.sur, borderRadius: 18, boxShadow: T.shad, padding: "20px 24px", ...style }}>
      {children}
    </div>
  );
}
