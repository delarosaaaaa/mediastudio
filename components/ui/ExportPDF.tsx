"use client";
import { useState, useRef } from "react";
import { C, FS } from "@/lib/tokens";
import { PHASES, AGENTS, SEC_TITLES } from "@/lib/constants";
import { RENDERERS } from "@/lib/renderers";

interface Props {
  outputs: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsed:  Record<string, any>;
}

export function ExportPDF({ outputs, parsed }: Props) {
  const [exporting, setExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const done = PHASES.filter(ph => !!parsed[ph.key] && !!outputs[ph.key]);

  async function handleExport() {
    if (!contentRef.current || done.length === 0) return;
    setExporting(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"), import("html2canvas"),
      ]);
      const canvas = await html2canvas(contentRef.current, {
        scale: 2, useCORS: true, logging: false, backgroundColor: C.pageBg, windowWidth: 900,
      });
      const pageW = 210; const pageH = 297; const m = 12;
      const usableW = pageW - m * 2;
      const totalMM = (canvas.height / canvas.width) * usableW;
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      let y = 0;
      while (y < totalMM) {
        if (y > 0) pdf.addPage();
        const sliceH = Math.min(pageH - m * 2, totalMM - y);
        const srcY   = (y / totalMM) * canvas.height;
        const srcH   = (sliceH / totalMM) * canvas.height;
        const sl = document.createElement("canvas");
        sl.width = canvas.width; sl.height = Math.ceil(srcH);
        sl.getContext("2d")!.drawImage(canvas, 0, -srcY);
        pdf.addImage(sl.toDataURL("image/jpeg", 0.92), "JPEG", m, m, usableW, sliceH);
        y += sliceH;
      }
      const brand = (parsed.briefing?.brand || "MediaStudio").replace(/\s+/g, "_");
      pdf.save(`${brand}_Media_Strategy.pdf`);
    } catch (e) {
      console.error(e);
      alert("PDF export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <button onClick={handleExport} disabled={exporting || done.length === 0} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "9px 18px", borderRadius: 9, border: "none",
        background: exporting ? C.faint : C.p900,
        color: "#fff", fontSize: FS.body, fontWeight: 600,
        cursor: exporting || done.length === 0 ? "not-allowed" : "pointer",
      }}>
        {exporting
          ? <><div style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} />Generating...</>
          : "↓ Download PDF report"
        }
      </button>

      {/* Off-screen render area */}
      <div ref={contentRef} style={{ position: "absolute", left: -9999, top: 0, width: 900, background: C.pageBg, pointerEvents: "none" }} aria-hidden="true">
        {done.map((ph, i) => {
          const Renderer = RENDERERS[ph.key];
          if (!Renderer) return null;
          return (
            <div key={ph.key} style={{ padding: "36px 40px", borderBottom: i < done.length - 1 ? `1px solid ${C.border}` : "none", background: C.pageBg }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: FS.cardLabel, fontWeight: 700, color: C.p400, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>
                  {String(i + 1).padStart(2, "0")} — {AGENTS[ph.agent].label.toUpperCase()}
                </div>
                <div style={{ fontSize: FS.sectionTitle, fontWeight: 800, color: C.ink, letterSpacing: "-.4px" }}>
                  {SEC_TITLES[ph.key]}
                </div>
              </div>
              <Renderer d={parsed[ph.key]} raw={outputs[ph.key] || ""} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
