"use client";

import { useState, useRef, useCallback } from "react";
import type { PhaseKey, SectionData, Message, Session } from "@/lib/types";
import { PHASES, AGENTS, SEC_TITLES } from "@/lib/constants";
import { parseJSON, extractClientQuestions, stripClientQuestions } from "@/lib/parse";

const MAX_SESSIONS = 5;
const SESSION_KEY  = "ms_sessions";

// ─── Session helpers ──────────────────────────────────────────

function loadSessions(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "[]");
  } catch { return []; }
}

function saveSessions(sessions: Session[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS)));
}

// ─── API call with retry ──────────────────────────────────────

async function callAnalyze(
  phase: PhaseKey,
  briefing: string,
  outputs: Record<string, string>,
  extra = ""
): Promise<string> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phase, briefing, outputs, extra }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `HTTP ${res.status}`);
  }
  return res.text();
}

function isRetryable(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  return msg.includes("529") || msg.includes("503") || msg.includes("network");
}

async function callWithRetry(
  phase: PhaseKey,
  briefing: string,
  outputs: Record<string, string>,
  extra = "",
  attempt = 0
): Promise<string> {
  try {
    return await callAnalyze(phase, briefing, outputs, extra);
  } catch (e) {
    if (attempt < 2 && isRetryable(e)) {
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
      return callWithRetry(phase, briefing, outputs, extra, attempt + 1);
    }
    throw e;
  }
}

// ─── Main hook ────────────────────────────────────────────────

export function useMediaStudio() {
  const [briefing,    setBriefing]    = useState("");
  const [started,     setStarted]     = useState(false);
  const [running,     setRunning]     = useState(false);
  const [outputs,     setOutputs]     = useState<Record<string, string>>({});
  const [parsed,      setParsed]      = useState<Record<string, SectionData | null>>({});
  const [statuses,    setStatuses]    = useState<Record<string, string>>({});
  const [activePhase, setActivePhase] = useState<PhaseKey | null>(null);
  const [messages,    setMessages]    = useState<Message[]>([]);
  const [questions,   setQuestions]   = useState<string[]>([]);
  const [answer,      setAnswer]      = useState("");
  const [waitAt,      setWaitAt]      = useState<PhaseKey | null>(null);
  const [done,        setDone]        = useState(false);
  const [activeTab,   setActiveTab]   = useState<PhaseKey | null>(null);
  const [sessions,    setSessions]    = useState<Session[]>(loadSessions);

  const outsRef   = useRef<Record<string, string>>({});
  const parsedRef = useRef<Record<string, SectionData | null>>({});

  const setSt = useCallback((id: string, s: string) =>
    setStatuses(p => ({ ...p, [id]: s })), []);

  const addMsg = useCallback((from: string, to: string | null, text: string, type: Message["type"] = "normal") => {
    const ts = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setMessages(p => [...p, { from, to, text, type, ts, id: Date.now() + Math.random() }]);
  }, []);

  const saveSession = useCallback((brf: string, outs: Record<string, string>, prs: Record<string, SectionData | null>) => {
    const brand = (prs.briefing as { brand?: string } | null)?.brand || "Unnamed";
    const session: Session = {
      id:        `${Date.now()}`,
      brand,
      briefing:  brf,
      outputs:   outs,
      parsed:    prs,
      createdAt: new Date().toISOString(),
    };
    const existing = loadSessions().filter(s => s.id !== session.id);
    const updated  = [session, ...existing].slice(0, MAX_SESSIONS);
    saveSessions(updated);
    setSessions(updated);
  }, []);

  async function runPhase(key: PhaseKey, brf: string, outs: Record<string, string>, extra = "") {
    const ph = PHASES.find(p => p.key === key);
    if (!ph) return null;

    setActivePhase(key);
    setSt(ph.agent, "active");
    addMsg(ph.agent, null, `${SEC_TITLES[key]} — analysis started`);

    try {
      const raw       = await callWithRetry(key, brf, outs, extra);
      const questions = extractClientQuestions(raw);
      const clean     = stripClientQuestions(raw);
      const data      = parseJSON(clean);
      const newO      = { ...outs, [key]: clean };

      outsRef.current   = newO;
      parsedRef.current = { ...parsedRef.current, [key]: data };
      setOutputs({ ...newO });
      setParsed({ ...parsedRef.current });
      setSt(ph.agent, "done");
      setActiveTab(prev => prev || key);

      const idx  = PHASES.findIndex(p => p.key === key);
      const next = PHASES[idx + 1];

      if (questions.length > 0) {
        questions.forEach(q => addMsg(ph.agent, null, q, "question"));
        return { status: "need_human" as const, questions, outputs: newO };
      }

      if (next) addMsg(ph.agent, next.agent, `${SEC_TITLES[key]} complete → ${AGENTS[next.agent].label}`, "handoff");
      return { status: "ok" as const, outputs: newO, next: next?.key };

    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      addMsg(ph.agent, null, `Error: ${msg}`);
      return { status: "error" as const };
    }
  }

  async function runFrom(start: PhaseKey, brf: string, outs: Record<string, string>, extra = "") {
    setRunning(true);
    let cur: PhaseKey | undefined = start;
    let curO = { ...outs };
    let ex   = extra;

    while (cur) {
      const r = await runPhase(cur, brf, curO, ex);
      ex = "";
      if (!r || r.status === "error") break;

      if (r.status === "need_human") {
        setWaitAt(cur);
        setQuestions(r.questions);
        setRunning(false);
        setActivePhase(null);
        return;
      }

      curO = r.outputs;

      if (!r.next) {
        saveSession(brf, curO, parsedRef.current);
        setDone(true);
        setRunning(false);
        setActivePhase(null);
        setActiveTab("synthesis");
        addMsg("synthesizer", null, "Media strategy complete.", "handoff");
        return;
      }

      cur = r.next as PhaseKey;
    }

    setRunning(false);
  }

  function start() {
    if (!briefing.trim()) return;
    setStarted(true);
    setOutputs({});
    setParsed({});
    setStatuses({});
    setMessages([]);
    setDone(false);
    setQuestions([]);
    setActiveTab(null);
    setActivePhase(null);
    outsRef.current   = {};
    parsedRef.current = {};
    addMsg("analyst", null, "Briefing received. Analysis started.");
    runFrom("briefing", briefing, {});
  }

  function handleAnswer() {
    if (!answer.trim() || !waitAt) return;
    const qa = questions.map(q => `${q}: ${answer}`).join("\n");
    setQuestions([]);
    setAnswer("");
    addMsg("analyst", null, "Answer received — resuming analysis.", "handoff");
    runFrom(waitAt, briefing, outsRef.current, qa);
  }

  function reset() {
    setStarted(false);
    setOutputs({});
    setParsed({});
    setStatuses({});
    setMessages([]);
    setDone(false);
    setQuestions([]);
    setActivePhase(null);
    setRunning(false);
    setBriefing("");
    setActiveTab(null);
    outsRef.current   = {};
    parsedRef.current = {};
  }

  function loadSession(session: Session) {
    setBriefing(session.briefing);
    setOutputs(session.outputs);
    setParsed(session.parsed);
    setStatuses(
      Object.fromEntries(
        Object.keys(session.outputs).map(k => {
          const ph = PHASES.find(p => p.key === k);
          return ph ? [ph.agent, "done"] : ["", ""];
        })
      )
    );
    setStarted(true);
    setDone(Object.keys(session.outputs).length === PHASES.length);
    setActiveTab((Object.keys(session.parsed)[0] as PhaseKey) || null);
    outsRef.current   = session.outputs;
    parsedRef.current = session.parsed;
    setMessages([{ id: 0, from: "analyst", to: null, text: "Session restored.", type: "normal", ts: "" }]);
  }

  return {
    // State
    briefing, setBriefing,
    started, running, done,
    outputs, parsed, statuses,
    activePhase, activeTab, setActiveTab,
    messages, questions, answer, setAnswer,
    sessions,
    // Actions
    start, reset, handleAnswer, loadSession,
  };
}
