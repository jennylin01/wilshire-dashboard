"use client";

import { ArrowUpRight } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { monoStack } from "@/lib/theme";
import type { Decision } from "@/lib/types";
import type { DetailRef } from "./Dashboard";

export function DecisionsPanel({
  decisions,
  onOpen,
}: {
  decisions: Decision[];
  onOpen: (d: DetailRef) => void;
}) {
  const { theme } = useTheme();
  // Show every decision that isn't Closed. The footer summarises Closed
  // count separately so the panel gives the full picture without becoming
  // a wall of resolved items.
  const visible = decisions.filter((d) => d.status !== "Closed");
  const closedCount = decisions.length - visible.length;

  return (
    <div>
      <SectionHeader label="Decisions log" />
      <div
        onClick={() => onOpen({ type: "decisions" })}
        style={{
          background: theme.surface,
          border: `1px solid ${theme.rule}`,
          padding: "18px 22px",
          cursor: "pointer",
          transition: "all 0.15s",
          borderRadius: "4px",
          height: "calc(100% - 34px)",
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
        {visible.length === 0 && (
          <div style={{ color: theme.muted, fontSize: "15px", padding: "6px 0" }}>
            No active decisions.
          </div>
        )}
        {visible.map((d, i) => (
          <div
            key={d.id}
            style={{
              padding: "10px 0",
              borderBottom:
                i < visible.length - 1 ? `1px solid ${theme.ruleSoft}` : "none",
            }}
          >
            <div
              style={{
                fontSize: "15px",
                color: theme.ink,
                lineHeight: 1.35,
                marginBottom: "6px",
                fontWeight: 500,
              }}
            >
              {d.item}
            </div>
            <div
              style={{
                fontFamily: monoStack,
                fontSize: "13px",
                color: theme.muted,
              }}
            >
              {d.owner}
              {d.target ? ` · by ${d.target}` : ""}
            </div>
          </div>
        ))}
        <div
          style={{
            marginTop: "14px",
            paddingTop: "12px",
            borderTop: `1px solid ${theme.ruleSoft}`,
            fontFamily: monoStack,
            fontSize: "13px",
            color: theme.muted,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{closedCount} closed total</span>
          <ArrowUpRight size={12} />
        </div>
      </div>
    </div>
  );
}
