"use client";
import { useState, useRef } from "react";
import { T, TY } from "@/lib/tokens";
import { PHASES, AGENTS, SEC_TITLES } from "@/lib/constants";
import type { PhaseKey, SectionData } from "@/lib/types";

// Section components
import { SecBriefing }    from "@/components/sections/SecBriefing";
import { SecAudience }    from "@/components/sections/SecAudience";
import { SecCompetitive } from "@/components/sections/SecCompetitive";
import { SecFunnel }      from "@/components/sections/SecFunnel";
import { SecChannel }     from "@/components/sections/SecChannel";
import { SecBudget }      from "@/components/sections/SecBudget";
import { SecMediaplan }   from "@/components/sections/SecMediaplan";
import { SecSynthesis }   from "@/components/sections/SecSynthesis";
import type { ComponentType } from "react";

type SectionProps = { d: SectionData; raw: string };

const RENDERERS: Partial<Record<PhaseKey, ComponentType<SectionProps>>> = {
  briefing:    SecBriefing    as ComponentType<SectionProps>,
  audience:    SecAudience    as ComponentType<SectionProps>,
  competitive: SecCompetitive as ComponentType<SectionProps>,
  funnel:      SecFunnel      as ComponentType<SectionProps>,
  channel:     SecChannel     as ComponentType<SectionProps>,
  budget:      SecBudget      as ComponentType<SectionProps>,
  mediaplan:   SecMediaplan   as ComponentType<SectionProps>,
  synthesis:   SecSynthesis   as ComponentType<SectionProps>,
};

interface Props {
  outputs: Record<string, string>;
  parsed:  Record<string, SectionData | null>;
}

export function ExportPDF({ outputs, parsed }: Props) {
  const [exporting, setExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const doneSections = PHASES.filter(ph => !!parsed[ph.key] && !!outputs[ph.key]);

  async function handleExport() {
    if (!contentRef.current || doneSections.length === 0) return;
    setExporting(true);

    try {
      // Dynamic imports — avoids SSR issues
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const el = contentRef.current;

      // Render at 2x for sharpness
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#F5F4F0",
        windowWidth: 900,
      });

      const imgData  = canvas.toDataURL("image/jpeg", 0.92);
      const pageW    = 210; // A4 mm
      const pageH    = 297;
      const margin   = 12;
      const usableW  = pageW - margin * 2;
      const imgW     = canvas.width;
      const imgH     = canvas.height;
      const ratio    = imgW / (usableW * 3.78); // px per mm at 96dpi ~= 3.78
      const totalMM  = imgH / ratio;

      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      let yOffset = 0;

      while (yOffset < totalMM) {
        if (yOffset > 0) pdf.addPage();

        const sliceH   = Math.min(pageH - margin * 2, totalMM - yOffset);
        const srcY     = (yOffset / totalMM) * imgH;
        const srcH     = (sliceH  / totalMM) * imgH;

        // Crop canvas slice
        const slice    = document.createElement("canvas");
        slice.width    = imgW;
        slice.height   = Math.ceil(srcH);
        const ctx      = slice.getContext("2d")!;
        ctx.drawImage(canvas, 0, -srcY);
        const sliceData = slice.toDataURL("image/jpeg", 0.92);

        pdf.addImage(sliceData, "JPEG", margin, margin, usableW, sliceH);
        yOffset += sliceH;
      }

      const brand = (parsed.briefing as { brand?: string })?.brand || "MediaStudio";
      pdf.save(`${brand.replace(/\s+/g, "_")}_Media_Strategy.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      {/* Export button */}
      <button
        onClick={handleExport}
        disabled={exporting || doneSections.length === 0}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "10px 20px", borderRadius: 9, borderWidth: 0,
          background: exporting ? T.t4 : T.p1,
          color: "#fff", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
          cursor: exporting || doneSections.length === 0 ? "not-allowed" : "pointer",
          transition: "background .15s",
        }}
      >
        {exporting ? (
          <>
            <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
            Generating PDF...
          </>
        ) : (
          <>
            ↓ Download PDF report
          </>
        )}
      </button>

      {/* Hidden render area — all sections stacked */}
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          left: -9999,
          top: 0,
          width: 900,
          background: "#F5F4F0",
          padding: "0",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        {doneSections.map((ph, i) => {
          const Renderer = RENDERERS[ph.key];
          const data     = parsed[ph.key];
          const raw      = outputs[ph.key] || "";
          if (!Renderer || !data) return null;

          return (
            <div
              key={ph.key}
              style={{
                padding: "36px 40px",
                borderBottom: i < doneSections.length - 1 ? "1px solid #E8E6E0" : "none",
                background: "#F5F4F0",
                pageBreakAfter: "always",
              }}
            >
              {/* Section header */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: T.pa, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>
                  {String(i + 1).padStart(2, "0")} — {AGENTS[ph.agent].label.toUpperCase()}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: T.t1, letterSpacing: "-.4px" }}>
                  {SEC_TITLES[ph.key]}
                </div>
              </div>

              <Renderer d={data as SectionData} raw={raw} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
