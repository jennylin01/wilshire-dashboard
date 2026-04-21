"use client";

import { useTheme } from "@/components/ThemeProvider";
import { DetailPanel } from "@/components/dashboard/DetailPanel";
import { Pill } from "@/components/ui/Pill";
import { fontStack, monoStack, statusColor } from "@/lib/theme";
import type { Commitment } from "@/lib/types";

export function CommitmentsDetail({
  commitments,
  notionUrl,
  onClose,
}: {
  commitments: Commitment[];
  notionUrl: string;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  return (
    <DetailPanel
      title="Client commitments"
      subtitle="Wilshire-owned inputs · Hanna conversation"
      notionUrl={notionUrl}
      onClose={onClose}
    >
      <p
        style={{
          fontFamily: fontStack,
          fontSize: "15px",
          color: theme.inkSoft,
          lineHeight: 1.5,
          marginTop: 0,
          marginBottom: "20px",
        }}
      >
        Every item below is a Wilshire-owned input with a named owner, date,
        and 72-hour SLA per SOW Section 9.
      </p>
      {commitments.map((c, i) => (
        <div
          key={i}
          style={{
            padding: "14px 0",
            borderBottom:
              i < commitments.length - 1
                ? `1px solid ${theme.ruleSoft}`
                : "none",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "12px",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                fontSize: "15px",
                color: theme.ink,
                lineHeight: 1.4,
                flex: 1,
                fontWeight: 500,
              }}
            >
              {c.item}
            </div>
            <Pill
              label={c.status}
              color={statusColor(theme, c.status)}
              bg={
                c.status === "Late"
                  ? theme.redBg
                  : c.status === "Delivered"
                    ? theme.greenBg
                    : theme.surfaceElevated
              }
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              fontSize: "14px",
              color: theme.muted,
              fontFamily: monoStack,
              marginBottom: "6px",
              flexWrap: "wrap",
            }}
          >
            {c.owner && <span>owner: {c.owner}</span>}
            {c.due && <span>due: {c.due}</span>}
          </div>
          {c.blocks && (
            <div
              style={{
                fontSize: "15px",
                color: theme.inkSoft,
                lineHeight: 1.45,
              }}
            >
              ↳ {c.blocks}
            </div>
          )}
        </div>
      ))}
    </DetailPanel>
  );
}
