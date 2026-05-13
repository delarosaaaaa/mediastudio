"use client";
import { T, TY } from "@/lib/tokens";
import { PHASES } from "@/lib/constants";
import type { PhaseKey } from "@/lib/types";

interface TopNavProps {
  outputs:      Record<string, string>;
  activePhase:  PhaseKey | null;
  activeTab:    PhaseKey | null;
  done:         boolean;
  started:      boolean;
  onTabClick:   (key: PhaseKey) => void;
  onReset:      () => void;
  onShowReport: () => void;
}

export function TopNav({ outputs, activeTab, done, started, onTabClick, onReset, onShowReport }: TopNavProps) {
  return (
    <div style={{
      background: "#FAFAF8",
      borderBottom: `1px solid ${T.s3}`,
      height: 52,
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      gap: 0,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        fontSize: 15, fontWeight: 800, color: T.t1, letterSpacing: "-.4px",
        paddingRight: 20, borderRight: `1px solid ${T.s3}`, marginRight: 14,
        flexShrink: 0,
      }}>
        <span style={{ fontWeight: 800 }}>Media</span><span style={{ fontWeight: 300 }}>Studio</span>
      </div>

      {/* Phase chips with dot separators */}
      <div style={{ display: "flex", alignItems: "center", flex: 1, overflow: "hidden" }}>
        {PHASES.map((ph, i) => {
          const isDone   = !!outputs[ph.key];
          const isActive = activeTab === ph.key;
          const canClick = isDone || isActive;
          return (
            <div key={ph.key} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <button
                onClick={() => canClick && onTabClick(ph.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "5px 10px", borderRadius: 6, borderWidth: 0,
                  background: isActive ? T.p6 : "transparent",
                  color: isActive ? T.p2 : isDone ? T.t2 : T.t4,
                  fontSize: 11,
                  fontWeight: isActive ? 700 : isDone ? 500 : 400,
                  cursor: canClick ? "pointer" : "default",
                  fontFamily: "inherit",
                  transition: "all .12s",
                  whiteSpace: "nowrap",
                }}
              >
                {isDone && (
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    background: isActive ? T.p2 : T.p5,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 7, fontWeight: 700, color: isActive ? "#fff" : T.p2,
                    flexShrink: 0,
                  }}>✓</div>
                )}
                {ph.label}
              </button>
              {i < PHASES.length - 1 && (
                <span style={{ fontSize: 11, color: T.t4, padding: "0 1px", userSelect: "none" }}>·</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 12 }}>
        {started && (
          <button onClick={onReset} style={{
            padding: "5px 14px", fontSize: 11, fontWeight: 600,
            background: "transparent",
            border: `1.5px solid ${T.t1}`,
            borderRadius: 7, color: T.t1,
            cursor: "pointer", fontFamily: "inherit",
          }}>Reset</button>
        )}
        {done && (
          <button onClick={onShowReport} style={{
            padding: "5px 16px", fontSize: 11, fontWeight: 600,
            background: T.p2, borderWidth: 0, borderRadius: 7,
            color: "#fff", cursor: "pointer", fontFamily: "inherit",
          }}>Final Report →</button>
        )}
      </div>
    </div>
  );
}
