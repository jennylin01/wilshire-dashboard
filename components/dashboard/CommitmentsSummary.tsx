"use client";

import { useTheme } from "@/components/ThemeProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fontStack, monoStack } from "@/lib/theme";
import type { Commitment } from "@/lib/types";
import type { DetailRef } from "./Dashboard";

export function CommitmentsSummary({
  commitments,
  onOpen,
}: {
  commitments: Commitment[];
  onOpen: (d: DetailRef) => void;
}) {
  const { theme } = useTheme();
  const delivered = commitments.filter((c) => c.status === "Delivered").length;
  const late = commitments.filter((c) => c.status === "Late").length;
  const notStarted = commitments.filter((c) => c.status === "Not started").length;

  const topHot = commitments
    .filter((c) => c.status === "Late" || c.status === "Not started")
    .slice(0, 3);

  return (
    <div>
      <SectionHeader label="Client commitments" />
      <div
        onClick={() => onOpen({ type: "commitment" })}
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
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          {[
            { label: "Total", value: commitments.length, color: theme.ink },
            { label: "Delivered", value: delivered, color: theme.green },
            { label: "Late", value: late, color: theme.red },
            { label: "Not started", value: notStarted, color: theme.amber },
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
            Top late / not-started
          </div>
          {topHot.length === 0 && (
            <div style={{ color: theme.muted, fontSize: "15px" }}>
              Nothing outstanding.
            </div>
          )}
          {topHot.map((c, i) => (
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
              <span style={{ flex: 1 }}>{c.item}</span>
              <span
                style={{
                  fontFamily: monoStack,
                  fontSize: "13px",
                  color: c.status === "Late" ? theme.red : theme.muted,
                  flexShrink: 0,
                  fontWeight: c.status === "Late" ? 600 : 400,
                }}
              >
                {c.due}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
