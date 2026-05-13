"use client";
import { Component, type ReactNode } from "react";
import { T, TY } from "@/lib/tokens";

interface Props  { children: ReactNode; }
interface State  { err: string | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(p: Props) { super(p); this.state = { err: null }; }

  static getDerivedStateFromError(e: Error): State {
    return { err: e?.message || "Render error" };
  }

  render() {
    if (this.state.err) return (
      <div style={{ padding: 24, background: T.s2, borderRadius: 12, textAlign: "center" }}>
        <div style={{ fontSize: 20, marginBottom: 8 }}>⚠️</div>
        <div style={{ ...TY.bodyMd, color: T.t3 }}>This section could not be loaded.</div>
        <div style={{ ...TY.label, marginTop: 6, color: T.t4 }}>{this.state.err}</div>
        <button
          onClick={() => this.setState({ err: null })}
          style={{ marginTop: 10, padding: "5px 14px", background: T.pa, borderWidth: 0, borderRadius: 6, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
        >
          Retry
        </button>
      </div>
    );
    return this.props.children;
  }
}
