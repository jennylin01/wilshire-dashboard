"use client";

import { useTheme } from "@/components/ThemeProvider";
import { DetailPanel } from "@/components/dashboard/DetailPanel";
import { Pill } from "@/components/ui/Pill";
import { fontStack, monoStack, type ThemeTokens } from "@/lib/theme";
import type { Milestone, MilestoneStatus, Programme } from "@/lib/types";

function fmtAmount(amount: number): string {
  return `$${Math.round(amount / 1000)}k`;
}

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
  // Hide explicit Placeholders only. Amount/% are billing-side concepts
  // we don't surface, so don't filter on them.
  const visible = milestones.filter((m) => m.status !== "Placeholder");

  // Group by workstream, preserving week-asc order within each group.
  const byWorkstream = new Map<string, Milestone[]>();
  for (const m of visible) {
    const key = m.workstream || "Unassigned";
    const arr = byWorkstream.get(key) ?? [];
    arr.push(m);
    byWorkstream.set(key, arr);
  }
  byWorkstream.forEach((arr) => {
    arr.sort((a: Milestone, b: Milestone) => a.week - b.week);
  });
  // Stable workstream order: Governance first, then alphabetical.
  const workstreamOrder = Array.from(byWorkstream.keys()).sort((a, b) => {
    if (a === "Governance") return -1;
    if (b === "Governance") return 1;
    return a.localeCompare(b);
  });

  return (
    <DetailPanel
      title="Key milestones"
      subtitle={`${visible.length} milestones · ${programme.totalWeeks}-week engagement`}
      notionUrl={notionUrl}
      onClose={onClose}
    >
      {workstreamOrder.map((ws, gi) => {
        const items = byWorkstream.get(ws) ?? [];
        return (
          <div
            key={ws}
            style={{
              marginTop: gi === 0 ? 0 : "20px",
              paddingTop: gi === 0 ? 0 : "16px",
              borderTop:
                gi === 0 ? "none" : `1px solid ${theme.rule}`,
            }}
          >
            <div
              style={{
                fontFamily: monoStack,
                fontSize: "11px",
                color: theme.muted,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "10px",
                fontWeight: 600,
              }}
            >
              {ws} · {items.length}
            </div>
            {items.map((m, i) => {
              const { color, bg } = statusStyle(theme, m.status);
              return (
                <div
                  key={m.id + "-" + m.week + "-" + i}
                  style={{
                    padding: "12px 0",
                    borderBottom:
                      i < items.length - 1
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
                      width: "52px",
                      flexShrink: 0,
                    }}
                  >
                    Wk {m.week || "—"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "14px",
                        color: theme.ink,
                        fontWeight: 500,
                        lineHeight: 1.35,
                      }}
                    >
                      {m.label}
                    </div>
                  </div>
                  {m.amount > 0 && (
                    <div
                      style={{
                        fontFamily: fontStack,
                        fontSize: "16px",
                        color: theme.ink,
                        minWidth: "60px",
                        textAlign: "right",
                        fontWeight: 600,
                      }}
                    >
                      {fmtAmount(m.amount)}
                    </div>
                  )}
                  <Pill label={m.status} color={color} bg={bg} />
                </div>
              );
            })}
          </div>
        );
      })}
      {visible.length === 0 && (
        <div
          style={{
            color: theme.muted,
            fontSize: "14px",
            padding: "14px 0",
          }}
        >
          No milestones defined yet. Add rows to the Milestones tracker in
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
        Live from Notion Milestones tracker. Programme is Week{" "}
        {programme.currentWeek} of {programme.totalWeeks}.
      </div>
    </DetailPanel>
  );
}
