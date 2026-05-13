"use client";
import { Component, type ReactNode } from "react";

interface State { error: Error | null; }
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };
  static getDerivedStateFromError(e: Error) { return { error: e }; }
  render() {
    if (this.state.error) return (
      <div style={{ padding: "20px", color: "#888", fontSize: 12, fontFamily: "monospace" }}>
        <strong>Section error:</strong><br />{this.state.error.message}
      </div>
    );
    return this.props.children;
  }
}
