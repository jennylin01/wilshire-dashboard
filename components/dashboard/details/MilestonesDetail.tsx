"use client";

import { useTheme } from "@/components/ThemeProvider";
import { DetailPanel } from "@/components/dashboard/DetailPanel";
import { Pill } from "@/components/ui/Pill";
import { fontStack, monoStack } from "@/lib/theme";
import type { Milestone, Programme } from "@/lib/types";

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
  return (
    <DetailPanel
      title="Milestones & invoicing"
      subtitle="6 committed · 3 PM placeholders"
      notionUrl={notionUrl}
      onClose={onClose}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            padding: "16px",
            background: theme.surfaceElevated,
            border: `1px solid ${theme.rule}`,
            borderRadius: "3px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontFamily: fontStack,
              color: theme.muted,
              marginBottom: "6px",
              fontWeight: 500,
            }}
          >
            Total fee
          </div>
          <div
            style={{
              fontFamily: fontStack,
              fontSize: "26px",
              color: theme.ink,
              fontWeight: 600,
            }}
          >
            ${programme.fee}k
          </div>
        </div>
        <div
          style={{
            padding: "16px",
            background: theme.surfaceElevated,
            border: `1px solid ${theme.rule}`,
            borderRadius: "3px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontFamily: fontStack,
              color: theme.muted,
              marginBottom: "6px",
              fontWeight: 500,
            }}
          >
            Invoiced to date
          </div>
          <div
            style={{
              fontFamily: fontStack,
              fontSize: "26px",
              color: theme.ink,
              fontWeight: 600,
            }}
          >
            $0k
          </div>
        </div>
      </div>
      {milestones.map((m, i) => (
        <div
          key={m.id}
          style={{
            padding: "14px 0",
            borderBottom:
              i < milestones.length - 1
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
              fontSize: "14px",
              color: theme.muted,
              width: "48px",
            }}
          >
            {m.id}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "15px",
                color: theme.ink,
                marginBottom: "4px",
                fontWeight: 500,
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: theme.muted,
                fontFamily: monoStack,
              }}
            >
              Week {m.week} · {m.pct}%
            </div>
          </div>
          <div
            style={{
              fontFamily: fontStack,
              fontSize: "18px",
              color: theme.ink,
              minWidth: "70px",
              textAlign: "right",
              fontWeight: 600,
            }}
          >
            ${m.amount}k
          </div>
          <Pill
            label={m.status === "in-progress" ? "In progress" : "Upcoming"}
            color={m.status === "in-progress" ? theme.amber : theme.muted}
            bg={m.status === "in-progress" ? theme.amberBg : theme.surfaceElevated}
          />
        </div>
      ))}
      <div
        style={{
          padding: "14px 0",
          fontSize: "15px",
          color: theme.muted,
          fontFamily: fontStack,
        }}
      >
        + M-PM1 (Wk4) · M-PM2 (Wk7) · M-PM3 (Wk9) — sized after Mark P sign-off
      </div>
    </DetailPanel>
  );
}
