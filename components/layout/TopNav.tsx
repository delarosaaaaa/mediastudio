"use client";
import { C, FS } from "@/lib/tokens";
import { PHASES } from "@/lib/constants";
import type { PhaseKey } from "@/lib/types";

interface Props {
  outputs:      Record<string, string>;
  activeTab:    PhaseKey | null;
  done:         boolean;
  started:      boolean;
  onTabClick:   (k: PhaseKey) => void;
  onReset:      () => void;
  onShowReport: () => void;
}

export function TopNav({ outputs, activeTab, done, started, onTabClick, onReset, onShowReport }: Props) {
  return (
    <div style={{
      height: 52, background: C.navBg, borderBottom: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", padding: "0 24px", flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        fontSize: 15, fontWeight: 800, color: C.ink, letterSpacing: "-.4px",
        paddingRight: 20, borderRight: `1px solid ${C.border}`, marginRight: 14, flexShrink: 0,
      }}>
        <span style={{ fontWeight: 800 }}>Media</span><span style={{ fontWeight: 300 }}>Studio</span>
      </div>

      {/* Phase chips */}
      <div style={{ display: "flex", alignItems: "center", flex: 1, overflow: "hidden" }}>
        {PHASES.map((ph, i) => {
          const isDone   = !!outputs[ph.key];
          const isActive = activeTab === ph.key;
          const canClick = isDone || isActive;
          return (
            <div key={ph.key} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <button onClick={() => canClick && onTabClick(ph.key)} style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "5px 10px", borderRadius: 6, border: "none",
                background: isActive ? C.p100 : "transparent",
                color: isActive ? C.p700 : isDone ? C.body : C.faint,
                fontSize: FS.bodySm, fontWeight: isActive ? 700 : isDone ? 500 : 400,
                cursor: canClick ? "pointer" : "default", whiteSpace: "nowrap",
              }}>
                {isDone && (
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    background: isActive ? C.p700 : C.p300,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 7, fontWeight: 700, color: isActive ? "#fff" : C.p700, flexShrink: 0,
                  }}>✓</div>
                )}
                {ph.label}
              </button>
              {i < PHASES.length - 1 && (
                <span style={{ fontSize: FS.body, color: C.faint, padding: "0 1px", userSelect: "none" }}>·</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 12 }}>
        {started && (
          <button onClick={onReset} style={{
            padding: "5px 14px", fontSize: FS.bodySm, fontWeight: 600,
            background: "transparent", border: `1.5px solid ${C.ink}`,
            borderRadius: 7, color: C.ink,
          }}>Reset</button>
        )}
        {done && (
          <button onClick={onShowReport} style={{
            padding: "5px 16px", fontSize: FS.bodySm, fontWeight: 600,
            background: C.p700, border: "none", borderRadius: 7, color: "#fff",
          }}>Final Report →</button>
        )}
      </div>
    </div>
  );
}
