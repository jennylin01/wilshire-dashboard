"use client";

import { useTheme } from "@/components/ThemeProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fontStack, monoStack } from "@/lib/theme";
import type { Milestone, Programme } from "@/lib/types";
import type { DetailRef } from "./Dashboard";

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
  return (
    <>
      <SectionHeader label="Milestones & invoicing" />
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "16px" }}>
          {milestones.map((m, i) => {
            const isCurrent = m.week === programme.currentWeek;
            return (
              <div
                key={m.id}
                style={{
                  paddingLeft: i === 0 ? 0 : "16px",
                  borderLeft: i === 0 ? "none" : `1px solid ${theme.ruleSoft}`,
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
                  ${m.amount}k
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
                    color: isCurrent ? theme.accent : theme.muted,
                    fontWeight: isCurrent ? 600 : 400,
                  }}
                >
                  {m.pct}% · {isCurrent ? "IN PROGRESS" : "UPCOMING"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
