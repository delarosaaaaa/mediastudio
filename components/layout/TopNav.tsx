"use client";
import { T, TY } from "@/lib/tokens";
import { PHASES } from "@/lib/constants";
import type { PhaseKey } from "@/lib/types";

interface TopNavProps {
  outputs:     Record<string, string>;
  activePhase: PhaseKey | null;
  activeTab:   PhaseKey | null;
  done:        boolean;
  started:     boolean;
  onTabClick:  (key: PhaseKey) => void;
  onReset:     () => void;
  onShowReport: () => void;
}

export function TopNav({ outputs, activePhase, activeTab, done, started, onTabClick, onReset, onShowReport }: TopNavProps) {
  return (
    <div style={{
      background: T.sur, borderBottom: `1px solid rgba(0,0,0,.07)`,
      height: 48, display: "flex", alignItems: "center",
      padding: "0 20px", gap: 0, flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 18, borderRight: `1px solid ${T.s3}`, flexShrink: 0 }}>
        <div style={{ width: 3, height: 18, background: T.pa, borderRadius: 2 }} />
        <div style={{ fontSize: 14, fontWeight: 700, color: T.t1, letterSpacing: "-.2px" }}>MediaStudio</div>
      </div>

      {/* Phase chips */}
      <div style={{ display: "flex", alignItems: "center", flex: 1, overflow: "hidden", paddingLeft: 4 }}>
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
                  padding: "4px 10px", borderRadius: 6, borderWidth: 0,
                  background: isActive ? T.p6 : "transparent",
                  color: isActive ? T.pa : isDone ? T.t2 : T.t4,
                  fontSize: 11, fontWeight: isActive ? 600 : 500,
                  cursor: canClick ? "pointer" : "default",
                  fontFamily: "inherit",
                  transition: "all .12s",
                }}
              >
                {isDone && (
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    background: isActive ? T.pa : T.p5,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 7, fontWeight: 700, color: "#fff", flexShrink: 0,
                  }}>✓</div>
                )}
                {ph.label}
              </button>
              {i < PHASES.length - 1 && (
                <div style={{ width: 10, height: 1, background: T.s3, flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 8 }}>
        {started && (
          <button
            onClick={onReset}
            style={{
              padding: "5px 12px", fontSize: 11, fontWeight: 500,
              background: "transparent", borderWidth: "1px", borderStyle: "solid",
              borderColor: "rgba(0,0,0,.12)", borderRadius: 7, color: T.t2,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >Reset</button>
        )}
        {done && (
          <button
            onClick={onShowReport}
            style={{
              padding: "5px 14px", fontSize: 11, fontWeight: 600,
              background: T.pa, borderWidth: 0, borderRadius: 7,
              color: "#fff", cursor: "pointer", fontFamily: "inherit",
            }}
          >Final Report →</button>
        )}
      </div>
    </div>
  );
}
