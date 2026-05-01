"use client";

import { useTheme } from "@/components/ThemeProvider";
import { fontStack } from "@/lib/theme";
import { ArrowUpRight } from "lucide-react";
import type { Programme, WeeklyDelta } from "@/lib/types";

export function WeeklyDeltaStrip({
  delta,
  programme,
}: {
  delta: WeeklyDelta;
  programme: Programme;
}) {
  const { theme } = useTheme();

  const sections: { label: string; body: string }[] = [
    { label: `Summary status w/e ${delta.weekEnding}`, body: delta.summary },
    { label: "Key risks / issues / blockers", body: delta.risks },
    { label: "Plan for next period", body: delta.plan },
  ];

  return (
    <div
      style={{
        background: theme.surface,
        border: `1px solid ${theme.rule}`,
        borderRadius: "4px",
        padding: "22px 26px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div
          style={{
            fontFamily: fontStack,
            fontSize: "13px",
            fontWeight: 700,
            color: theme.accent,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          This week
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontFamily: fontStack,
            fontSize: "12px",
            color: theme.mutedSoft,
          }}
        >
          <span>Updated Fridays</span>
          {programme.weeklyDeltaUrl && (
            <a
              href={programme.weeklyDeltaUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Edit weekly update in Notion"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                fontWeight: 500,
                color: theme.accent,
                textDecoration: "none",
                padding: "4px 10px",
                border: `1px solid ${theme.accent}`,
                borderRadius: "3px",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  theme.accentSoft;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent";
              }}
            >
              Edit in Notion
              <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {sections.map((s, i) => (
          <section key={i}>
            <h3
              style={{
                fontFamily: fontStack,
                fontSize: "13px",
                fontWeight: 700,
                color: theme.muted,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                margin: "0 0 8px",
              }}
            >
              {s.label}
            </h3>
            <p
              style={{
                fontFamily: fontStack,
                fontSize: "15px",
                color: theme.ink,
                margin: 0,
                lineHeight: 1.55,
                whiteSpace: "pre-wrap",
              }}
            >
              {s.body || "—"}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
