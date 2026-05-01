"use client";

import { useTheme } from "@/components/ThemeProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fontStack, monoStack } from "@/lib/theme";
import type { ValueMetric } from "@/lib/types";
import type { DetailRef } from "./Dashboard";

export function ValueTrackingSummary({
  metrics,
  onOpen,
}: {
  metrics: ValueMetric[];
  onOpen: (d: DetailRef) => void;
}) {
  const { theme } = useTheme();
  const baselines = metrics.filter((v) => v.status === "Baseline captured").length;
  const highConf = metrics.filter((v) => v.confidence === "High").length;

  // Show top 3 metrics with the most aspirational targets (first non-TBV target).
  const headline = metrics
    .filter((v) => v.target && v.target !== "TBV")
    .slice(0, 3);

  return (
    <div>
      <SectionHeader label="Value tracking" />
      <div
        onClick={() => onOpen({ type: "value" })}
        style={{
          background: theme.surface,
          border: `1px solid ${theme.rule}`,
          padding: "22px 24px",
          cursor: "pointer",
          transition: "all 0.15s",
          borderRadius: "4px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = theme.surfaceHover;
          e.currentTarget.style.borderColor = theme.mutedSoft;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = theme.surface;
          e.currentTarget.style.borderColor = theme.rule;
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          {[
            { label: "Metrics", value: metrics.length, color: theme.ink },
            { label: "Baselines", value: baselines, color: theme.accent },
            { label: "High conf.", value: highConf, color: theme.green },
          ].map((s, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: fontStack,
                  fontSize: "30px",
                  color: s.color,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: fontStack,
                  fontSize: "13px",
                  color: theme.muted,
                  marginTop: "8px",
                  fontWeight: 500,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${theme.ruleSoft}`, paddingTop: "14px" }}>
          <div
            style={{
              fontFamily: fontStack,
              fontSize: "13px",
              color: theme.muted,
              marginBottom: "10px",
              fontWeight: 500,
            }}
          >
            Headline targets
          </div>
          {headline.length === 0 && (
            <div style={{ color: theme.muted, fontSize: "15px" }}>
              No targets defined yet.
            </div>
          )}
          {headline.map((x, i) => (
            <div
              key={i}
              style={{
                padding: "8px 0",
                fontSize: "15px",
                color: theme.inkSoft,
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                alignItems: "baseline",
              }}
            >
              <span style={{ flex: 1 }}>{x.metric}</span>
              <span
                style={{
                  fontFamily: monoStack,
                  fontSize: "13px",
                  color: theme.ink,
                  flexShrink: 0,
                  fontWeight: 500,
                }}
              >
                {x.target}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
