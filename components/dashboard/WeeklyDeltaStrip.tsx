"use client";

import { useTheme } from "@/components/ThemeProvider";
import { fontStack, monoStack } from "@/lib/theme";
import type { WeeklyDelta } from "@/lib/types";

export function WeeklyDeltaStrip({ delta }: { delta: WeeklyDelta }) {
  const { theme } = useTheme();
  return (
    <div
      style={{
        background: theme.surface,
        border: `1px solid ${theme.rule}`,
        borderRadius: "4px",
        padding: "22px 26px",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
          <div
            style={{
              fontFamily: fontStack,
              fontSize: "13px",
              fontWeight: 700,
              color: theme.accent,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            This week
          </div>
          <div
            style={{
              fontFamily: monoStack,
              fontSize: "13px",
              color: theme.muted,
            }}
          >
            {delta.weekOf}
          </div>
        </div>
        <div
          style={{
            fontFamily: monoStack,
            fontSize: "12px",
            color: theme.mutedSoft,
          }}
        >
          Updated Fridays
        </div>
      </div>

      <p
        style={{
          fontFamily: fontStack,
          fontSize: "20px",
          fontWeight: 500,
          color: theme.ink,
          margin: "0 0 20px",
          lineHeight: 1.35,
          letterSpacing: "-0.015em",
        }}
      >
        {delta.headline}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px 28px",
        }}
      >
        {delta.changes.map((c, i) => {
          const color =
            c.direction === "up"
              ? theme.green
              : c.direction === "down"
                ? theme.red
                : theme.muted;
          const symbol =
            c.direction === "up" ? "↑" : c.direction === "down" ? "↓" : "→";
          return (
            <div
              key={i}
              style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
            >
              <div
                style={{
                  fontFamily: monoStack,
                  fontSize: "17px",
                  fontWeight: 700,
                  color,
                  lineHeight: 1.3,
                  width: "14px",
                  flexShrink: 0,
                }}
              >
                {symbol}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "15px",
                    color: theme.ink,
                    fontWeight: 500,
                    lineHeight: 1.4,
                    marginBottom: "2px",
                  }}
                >
                  {c.label}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: theme.muted,
                    lineHeight: 1.45,
                  }}
                >
                  {c.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
