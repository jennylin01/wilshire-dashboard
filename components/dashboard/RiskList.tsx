"use client";

import { ArrowUpRight } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { monoStack } from "@/lib/theme";
import type { Programme, Risk } from "@/lib/types";
import type { DetailRef } from "./Dashboard";

export function RiskList({
  risks,
  programme,
  onOpen,
}: {
  risks: Risk[];
  programme: Programme;
  onOpen: (d: DetailRef) => void;
}) {
  const { theme } = useTheme();
  const top = risks.slice(0, 6);
  return (
    <div>
      <SectionHeader
        label="RAID · items needing leadership attention"
        href={programme.raidUrl}
      />
      <div
        style={{
          background: theme.surface,
          border: `1px solid ${theme.rule}`,
          borderRadius: "4px",
        }}
      >
        {top.length === 0 && (
          <div style={{ padding: "18px", color: theme.muted, fontSize: "15px" }}>
            No open items.
          </div>
        )}
        {top.map((r, i) => (
          <div
            key={r.id}
            onClick={() => onOpen({ type: "risk", id: r.id })}
            style={{
              padding: "14px 18px",
              borderBottom:
                i < top.length - 1 ? `1px solid ${theme.ruleSoft}` : "none",
              cursor: "pointer",
              transition: "background 0.1s",
              display: "flex",
              gap: "14px",
              alignItems: "flex-start",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = theme.surfaceHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: r.severity === "High" ? theme.red : theme.amber,
                flexShrink: 0,
                marginTop: "7px",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "15px",
                  color: theme.ink,
                  lineHeight: 1.4,
                  marginBottom: "4px",
                  fontWeight: 500,
                }}
              >
                {r.item}
              </div>
              <div
                style={{
                  fontFamily: monoStack,
                  fontSize: "13px",
                  color: theme.muted,
                }}
              >
                {r.type} · {r.ws} · {r.owner} · {r.status}
              </div>
            </div>
            <ArrowUpRight
              size={14}
              style={{ color: theme.mutedSoft, flexShrink: 0, marginTop: "3px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
