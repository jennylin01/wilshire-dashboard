"use client";

import { useTheme } from "@/components/ThemeProvider";
import { fontStack, monoStack } from "@/lib/theme";
import type { Milestone, Programme } from "@/lib/types";

export function TimelineBar({
  programme,
  milestones,
}: {
  programme: Programme;
  milestones: Milestone[];
}) {
  const { theme } = useTheme();
  return (
    <div
      style={{
        marginTop: "24px",
        padding: "16px 0",
        borderTop: `1px solid ${theme.rule}`,
        borderBottom: `1px solid ${theme.rule}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            fontFamily: fontStack,
            fontSize: "14px",
            color: theme.muted,
            fontWeight: 500,
          }}
        >
          Programme timeline
        </div>
        <div
          style={{
            fontFamily: monoStack,
            fontSize: "13px",
            color: theme.muted,
          }}
        >
          {programme.start} → {programme.end} · Week {programme.currentWeek} of{" "}
          {programme.totalWeeks}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${programme.totalWeeks}, 1fr)`,
          gap: "4px",
        }}
      >
        {Array.from({ length: programme.totalWeeks }, (_, i) => {
          // Timeline ticks are 0-indexed: Wk 0 (planning) through Wk N-1.
          const wk = i;
          const isPast = wk < programme.currentWeek;
          const isCurrent = wk === programme.currentWeek;
          const mThisWeek = milestones.filter((m) => m.week === wk);
          return (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  height: "6px",
                  borderRadius: "2px",
                  background: isCurrent
                    ? theme.accent
                    : isPast
                      ? theme.ink
                      : theme.rule,
                }}
              />
              <div
                style={{
                  fontFamily: monoStack,
                  fontSize: "12px",
                  color: isCurrent ? theme.accent : theme.muted,
                  marginTop: "8px",
                  fontWeight: isCurrent ? 600 : 400,
                }}
              >
                W{wk}
              </div>
              {mThisWeek.length > 0 && (
                <div
                  style={{
                    fontFamily: monoStack,
                    fontSize: "12px",
                    color: theme.ink,
                    marginTop: "2px",
                    fontWeight: 500,
                  }}
                >
                  {mThisWeek.map((m) => m.id).join(" ")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
