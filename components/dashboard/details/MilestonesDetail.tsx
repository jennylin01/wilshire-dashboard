"use client";

import { useTheme } from "@/components/ThemeProvider";
import { DetailPanel } from "@/components/dashboard/DetailPanel";
import { Pill } from "@/components/ui/Pill";
import { monoStack, type ThemeTokens } from "@/lib/theme";
import type { Milestone, MilestoneStatus, Programme } from "@/lib/types";

function statusStyle(
  theme: ThemeTokens,
  status: MilestoneStatus
): { color: string; bg: string } {
  switch (status) {
    case "Paid":
      return { color: theme.green, bg: theme.greenBg };
    case "Invoice sent":
    case "Signed off":
      return { color: theme.accent, bg: theme.accentSoft };
    case "Due":
      return { color: theme.amber, bg: theme.amberBg };
    case "Disputed":
      return { color: theme.red, bg: theme.redBg };
    case "Placeholder":
      return { color: theme.mutedSoft, bg: theme.surfaceElevated };
    case "Not due":
    default:
      return { color: theme.muted, bg: theme.surfaceElevated };
  }
}

export function MilestonesDetail({
  milestones,
  programme,
  notionUrl,
  onClose,
}: {
  milestones: Milestone[];
  programme: Programme;
  notionUrl: string;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  // Show everything except placeholders; Amount display was removed.
  const sized = milestones.filter((m) => m.status !== "Placeholder");

  return (
    <DetailPanel
      title="Key milestones"
      subtitle={`${sized.length} milestones · ${programme.totalWeeks}-week engagement`}
      notionUrl={notionUrl}
      onClose={onClose}
    >
      {sized.map((m, i) => {
        const { color, bg } = statusStyle(theme, m.status);
        return (
          <div
            key={m.id + "-" + m.week + "-" + i}
            style={{
              padding: "14px 0",
              borderBottom:
                i < sized.length - 1
                  ? `1px solid ${theme.ruleSoft}`
                  : "none",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                fontFamily: monoStack,
                fontSize: "13px",
                color: theme.muted,
                width: "60px",
              }}
            >
              {m.id}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "14px",
                  color: theme.ink,
                  marginBottom: "4px",
                  fontWeight: 500,
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: theme.muted,
                  fontFamily: monoStack,
                }}
              >
                Week {m.week || "TBD"}
                {m.workstream ? ` · ${m.workstream}` : ""}
              </div>
            </div>
            <Pill label={m.status} color={color} bg={bg} />
          </div>
        );
      })}
      {milestones.length === 0 && (
        <div
          style={{
            color: theme.muted,
            fontSize: "14px",
            padding: "14px 0",
          }}
        >
          No milestones defined yet. Add rows to the Invoice tracker in
          Notion.
        </div>
      )}
      <div
        style={{
          marginTop: "24px",
          paddingTop: "16px",
          borderTop: `1px solid ${theme.ruleSoft}`,
          fontFamily: monoStack,
          fontSize: "11px",
          color: theme.mutedSoft,
          lineHeight: 1.5,
        }}
      >
        Live from Notion Invoice tracker. Programme is Week{" "}
        {programme.currentWeek} of {programme.totalWeeks}.
      </div>
    </DetailPanel>
  );
}
