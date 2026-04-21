"use client";

import { ArrowUpRight } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fontStack, monoStack, ragColor } from "@/lib/theme";
import type { Workstream } from "@/lib/types";
import type { DetailRef } from "./Dashboard";

export function WorkstreamsGrid({
  workstreams,
  onOpen,
}: {
  workstreams: Workstream[];
  onOpen: (d: DetailRef) => void;
}) {
  const { theme } = useTheme();
  return (
    <>
      <SectionHeader label="Workstreams" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
        }}
      >
        {workstreams.map((ws) => {
          const progressPct = ws.committed > 0 ? (ws.done / ws.committed) * 100 : 0;
          return (
            <div
              key={ws.id}
              onClick={() => onOpen({ type: "workstream", id: ws.id })}
              style={{
                padding: "22px 24px",
                background: theme.surface,
                border: `1px solid ${theme.rule}`,
                cursor: "pointer",
                transition: "all 0.15s",
                borderRadius: "4px",
                position: "relative",
                overflow: "hidden",
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
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "3px",
                  background: ragColor(theme, ws.rag),
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: monoStack,
                      fontSize: "12px",
                      color: theme.muted,
                      marginBottom: "6px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {ws.short}
                  </div>
                  <h3
                    style={{
                      fontFamily: fontStack,
                      fontSize: "19px",
                      fontWeight: 600,
                      margin: 0,
                      letterSpacing: "-0.02em",
                      color: theme.ink,
                      lineHeight: 1.25,
                    }}
                  >
                    {ws.name}
                  </h3>
                </div>
                <ArrowUpRight
                  size={16}
                  style={{ color: theme.mutedSoft, flexShrink: 0, marginTop: "2px" }}
                />
              </div>
              <p
                style={{
                  fontFamily: fontStack,
                  fontSize: "15px",
                  color: theme.muted,
                  lineHeight: 1.5,
                  margin: "0 0 16px",
                }}
              >
                {ws.thesis}
              </p>
              <div
                style={{
                  height: "3px",
                  background: theme.ruleSoft,
                  marginBottom: "12px",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressPct}%`,
                    background: ragColor(theme, ws.rag),
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: monoStack,
                  fontSize: "13px",
                  color: theme.muted,
                }}
              >
                <span>
                  {ws.done}/{ws.committed} done
                  {ws.blocked > 0 ? ` · ${ws.blocked} blocked` : ""}
                </span>
                <span>
                  {ws.lead} · {ws.sponsor}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
