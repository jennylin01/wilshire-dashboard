"use client";

import { useTheme } from "@/components/ThemeProvider";
import { DetailPanel } from "@/components/dashboard/DetailPanel";
import { Pill } from "@/components/ui/Pill";
import { monoStack, statusColor } from "@/lib/theme";
import type { Decision } from "@/lib/types";

export function DecisionsDetail({
  decisions,
  onClose,
}: {
  decisions: Decision[];
  onClose: () => void;
}) {
  const { theme } = useTheme();
  // Closed decisions are hidden from the modal too — they're summarised
  // as a count instead of cluttering the active list.
  const visible = decisions.filter((d) => d.status !== "Closed");
  const closed = decisions.length - visible.length;
  return (
    <DetailPanel
      title="Decisions log"
      subtitle={`${visible.length} active · ${closed} closed`}
      onClose={onClose}
    >
      {visible.map((d, i) => (
        <div
          key={d.id}
          style={{
            padding: "16px 0",
            borderBottom:
              i < visible.length - 1 ? `1px solid ${theme.ruleSoft}` : "none",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                fontSize: "17px",
                color: theme.ink,
                lineHeight: 1.35,
                fontWeight: 500,
              }}
            >
              {d.item}
            </div>
            <Pill
              label={d.status}
              color={statusColor(theme, d.status)}
              bg={d.status === "Closed" ? theme.greenBg : theme.amberBg}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              fontSize: "14px",
              color: theme.muted,
              fontFamily: monoStack,
              marginBottom: "8px",
              flexWrap: "wrap",
            }}
          >
            {d.owner && <span>owner: {d.owner}</span>}
            {d.target && <span>target: {d.target}</span>}
          </div>
          {d.detail && (
            <div
              style={{
                fontSize: "15px",
                color: theme.inkSoft,
                lineHeight: 1.5,
              }}
            >
              {d.detail}
            </div>
          )}
        </div>
      ))}
    </DetailPanel>
  );
}
