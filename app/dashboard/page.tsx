import { T, TY } from "@/lib/tokens";
import type { FeedbackEntry } from "@/lib/types";
import { PHASES } from "@/lib/constants";

async function getFeedback(): Promise<FeedbackEntry[]> {
  try {
    const { kv } = await import("@vercel/kv");
    const raw = await kv.lrange("feedback", 0, 999);
    return raw
      .map(r => {
        try { return JSON.parse(r as string) as FeedbackEntry; }
        catch { return null; }
      })
      .filter(Boolean) as FeedbackEntry[];
  } catch {
    return [];
  }
}

function ScoreBar({ good, improve, bad }: { good: number; improve: number; bad: number }) {
  const total = good + improve + bad;
  if (total === 0) return <div style={{ ...TY.label, color: T.t4 }}>No feedback yet</div>;
  const pct = (n: number) => Math.round((n / total) * 100);
  return (
    <div>
      <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 5 }}>
        <div style={{ width: `${pct(good)}%`, background: "#16a34a" }} />
        <div style={{ width: `${pct(improve)}%`, background: "#d97706" }} />
        <div style={{ width: `${pct(bad)}%`, background: "#dc2626" }} />
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <span style={{ fontSize: 10, color: "#16a34a" }}>👍 {good}</span>
        <span style={{ fontSize: 10, color: "#d97706" }}>✏️ {improve}</span>
        <span style={{ fontSize: 10, color: "#dc2626" }}>👎 {bad}</span>
        <span style={{ fontSize: 10, color: T.t4 }}>· {total} total</span>
      </div>
    </div>
  );
}

export default async function Dashboard() {
  const entries = await getFeedback();

  // Aggregate per phase
  const stats = PHASES.map(ph => {
    const phEntries = entries.filter(e => e.phase === ph.key);
    const good    = phEntries.filter(e => e.rating === "good").length;
    const improve = phEntries.filter(e => e.rating === "improve").length;
    const bad     = phEntries.filter(e => e.rating === "bad").length;
    const negativeWithComments = phEntries
      .filter(e => e.rating !== "good" && e.comment)
      .slice(0, 5);
    return { ph, good, improve, bad, total: phEntries.length, negativeWithComments };
  });

  const totalEntries = entries.length;
  const totalGood    = entries.filter(e => e.rating === "good").length;

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", minHeight: "100vh", background: T.bg, padding: 24 }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 3, height: 20, background: T.pa, borderRadius: 2 }} />
          <div style={{ fontSize: 22, fontWeight: 800, color: T.t1, letterSpacing: "-.4px" }}>MediaStudio</div>
          <div style={{ ...TY.cardLabel, background: T.p6, color: T.pa, padding: "3px 8px", borderRadius: 6, marginLeft: 4 }}>Dashboard</div>
        </div>
        <div style={{ ...TY.bodyMd, color: T.t3 }}>
          {totalEntries} feedback entries · {totalEntries > 0 ? Math.round((totalGood / totalEntries) * 100) : 0}% positive
        </div>
      </div>

      {/* Per-phase score cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {stats.map(({ ph, good, improve, bad, total }) => (
          <div key={ph.key} style={{ background: T.sur, borderRadius: 14, padding: "14px 16px", boxShadow: T.shad }}>
            <div style={{ ...TY.cardLabel, marginBottom: 8 }}>{ph.label}</div>
            <ScoreBar good={good} improve={improve} bad={bad} />
          </div>
        ))}
      </div>

      {/* Negative feedback with comments */}
      <div style={{ background: T.sur, borderRadius: 18, padding: "20px 24px", boxShadow: T.shad, marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.t1, marginBottom: 16 }}>
          Negative feedback — <span style={{ fontWeight: 400, color: T.t3 }}>comments to act on</span>
        </div>
        {stats.every(s => s.negativeWithComments.length === 0) ? (
          <div style={{ ...TY.bodyMd, color: T.t3, textAlign: "center", padding: "20px 0" }}>No negative feedback with comments yet.</div>
        ) : (
          stats.flatMap(({ ph, negativeWithComments }) =>
            negativeWithComments.map((e, i) => (
              <div key={`${ph.key}-${i}`} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: `1px solid ${T.s2}`, alignItems: "flex-start" }}>
                <div style={{ ...TY.cardLabel, background: T.p6, color: T.pa, padding: "3px 8px", borderRadius: 6, flexShrink: 0, lineHeight: 1.6 }}>{ph.label}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...TY.bodyMd, color: T.t1, marginBottom: 3 }}>{e.comment}</div>
                  <div style={{ ...TY.label }}>
                    {e.rating === "improve" ? "✏️ Can improve" : "👎 Not good"}
                    {" · "}prompt {e.promptVersion}
                    {" · "}{new Date(e.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  {e.outputSnippet && (
                    <div style={{ marginTop: 6, padding: "6px 10px", background: T.s2, borderRadius: 7, fontSize: 10, color: T.t3, fontFamily: "monospace" }}>
                      {e.outputSnippet.slice(0, 200)}…
                    </div>
                  )}
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* Prompt versions */}
      <div style={{ background: T.sur, borderRadius: 18, padding: "20px 24px", boxShadow: T.shad }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.t1, marginBottom: 16 }}>
          Prompt versions — <span style={{ fontWeight: 400, color: T.t3 }}>current active</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {PHASES.map(ph => {
            const latest = entries
              .filter(e => e.phase === ph.key)
              .sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];
            return (
              <div key={ph.key} style={{ background: T.s2, borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ ...TY.cardLabel, marginBottom: 4 }}>{ph.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.pa }}>{latest?.promptVersion || "v1"}</div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
