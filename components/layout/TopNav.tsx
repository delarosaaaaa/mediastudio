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

export function TopNav({ outputs, activePhase, activeTab, done, started, onTabClick, onReset, onShowReport }: TopNavProps) {
  return (
    <div style={{ background: "#F5F5F7", borderBottom: "1px solid rgba(0,0,0,.08)", padding: "0 20px", height: 50, display: "flex", alignItems: "center", flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 16, borderRight: "1px solid rgba(0,0,0,.08)", marginRight: 14, flexShrink: 0 }}>
        <div style={{ width: 3, height: 18, background: T.pa, borderRadius: 2 }} />
        <div style={{ fontSize: 13, fontWeight: 700, color: T.t1 }}>MediaStudio</div>
      </div>

      {/* Phase chips */}
      <div style={{ display: "flex", alignItems: "center", flex: 1, overflowX: "auto" }}>
        {PHASES.map((ph, i) => {
          const isDone = !!outputs[ph.key];
          const isAct  = activePhase === ph.key;
          const isSel  = activeTab === ph.key;
          return (
            <div key={ph.key} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <button
                onClick={() => isDone && onTabClick(ph.key)}
                style={{
                  height: 30, padding: "0 11px",
                  background: isSel ? "#fff" : isAct ? T.pa + "15" : "transparent",
                  borderWidth: 0,
                  borderBottom: `1.5px solid ${isSel || isAct ? T.pa : isDone ? "rgba(0,0,0,.14)" : "rgba(0,0,0,.08)"}`,
                  borderRadius: 7,
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: 11, fontWeight: 600,
                  color: isSel || isAct ? T.pa : isDone ? T.t2 : T.t4,
                  cursor: isDone ? "pointer" : "default",
                  fontFamily: "inherit", whiteSpace: "nowrap",
                  transition: "all .15s",
                }}
              >
                <span style={{ fontSize: 10, opacity: 0.8 }}>{isDone ? "✓" : i + 1}</span>
                {ph.label}
              </button>
              {i < PHASES.length - 1 && (
                <div style={{ width: 14, height: 1, background: isDone && outputs[PHASES[i + 1]?.key] ? T.pa : "rgba(0,0,0,.1)", margin: "0 1px" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 7, paddingLeft: 12, borderLeft: "1px solid rgba(0,0,0,.08)", marginLeft: 8, flexShrink: 0 }}>
        {started && (
          <button onClick={onReset} style={{ padding: "4px 11px", borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(0,0,0,.12)", background: "transparent", color: T.t2, fontSize: 11, fontWeight: 500, borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>
            Reset
          </button>
        )}
        {done && (
          <button onClick={onShowReport} style={{ padding: "4px 13px", background: T.pa, borderWidth: 0, borderRadius: 6, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Final Report →
          </button>
        )}
      </div>
    </div>
  );
}
