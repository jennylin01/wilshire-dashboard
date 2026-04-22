"use client";

import { useTheme } from "@/components/ThemeProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fontStack, monoStack, type ThemeTokens } from "@/lib/theme";
import type { Milestone, MilestoneStatus, Programme } from "@/lib/types";
import type { DetailRef } from "./Dashboard";

function fmtAmount(amount: number): string {
  return `$${Math.round(amount / 1000)}k`;
}

function statusPillColor(
  theme: ThemeTokens,
  status: MilestoneStatus
): string {
  switch (status) {
    case "Paid":
      return theme.green;
    case "Invoice sent":
    case "Signed off":
      return theme.accent;
    case "Due":
      return theme.amber;
    case "Disputed":
      return theme.red;
    case "Placeholder":
      return theme.mutedSoft;
    case "Not due":
    default:
      return theme.muted;
  }
}

function statusLabel(status: MilestoneStatus): string {
  return status.toUpperCase();
}

export function MilestonesStrip({
  milestones,
  programme,
  onOpen,
}: {
  milestones: Milestone[];
  programme: Programme;
  onOpen: (d: DetailRef) => void;
}) {
  const { theme } = useTheme();

  // Only sized milestones appear. Placeholders are hidden entirely.
  const sized = milestones.filter(
    (m) => m.status !== "Placeholder" && m.amount > 0
  );

  return (
    <>
      <SectionHeader label="Key milestones" />
      <div
        onClick={() => onOpen({ type: "milestones" })}
        style={{
          background: theme.surface,
          border: `1px solid ${theme.rule}`,
          padding: "26px 28px",
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
            gridTemplateColumns: `repeat(${Math.max(sized.length, 1)}, 1fr)`,
            gap: "16px",
          }}
        >
          {sized.map((m, i) => {
            const isCurrent = m.week === programme.currentWeek;
            const pillColor = statusPillColor(theme, m.status);
            return (
              <div
                key={m.id}
                style={{
                  paddingLeft: i === 0 ? 0 : "16px",
                  borderLeft:
                    i === 0 ? "none" : `1px solid ${theme.ruleSoft}`,
                }}
              >
                <div
                  style={{
                    fontFamily: monoStack,
                    fontSize: "13px",
                    color: theme.muted,
                    marginBottom: "10px",
                  }}
                >
                  {m.id} · Wk{m.week}
                </div>
                <div
                  style={{
                    fontFamily: fontStack,
                    fontSize: "26px",
                    color: isCurrent ? theme.accent : theme.ink,
                    fontWeight: 700,
                    lineHeight: 1,
                    marginBottom: "10px",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {fmtAmount(m.amount)}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: theme.inkSoft,
                    lineHeight: 1.35,
                    marginBottom: "10px",
                    minHeight: "32px",
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontFamily: monoStack,
                    fontSize: "12px",
                    color: pillColor,
                    fontWeight: 600,
                  }}
                >
                  {m.pct ? `${m.pct}% · ` : ""}
                  {statusLabel(m.status)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
