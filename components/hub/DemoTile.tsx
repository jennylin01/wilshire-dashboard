"use client";

import { ArrowRight, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { fontStack, monoStack } from "@/lib/theme";

export function DemoTile({
  title,
  suffix = "(Demo)",
  Icon,
}: {
  title: string;
  suffix?: string;
  Icon: LucideIcon;
}) {
  const { theme } = useTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="presentation"
      aria-disabled="true"
      style={{
        background: theme.surface,
        border: `1px solid ${theme.rule}`,
        borderRadius: "8px",
        padding: "16px 18px",
        cursor: "not-allowed",
        transition: "all 0.18s ease",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "142px",
        overflow: "hidden",
        opacity: 0.92,
      }}
    >
      {/* Top: icon + tiny "Demo" eyebrow */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "6px",
            background: theme.surfaceElevated,
            border: `1px solid ${theme.ruleSoft}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: hovered ? theme.mutedSoft : theme.muted,
            transition: "color 0.18s ease",
          }}
        >
          <Icon size={15} strokeWidth={1.75} />
        </div>
        <span
          style={{
            fontFamily: monoStack,
            fontSize: "9px",
            color: theme.mutedSoft,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 600,
            padding: "2px 6px",
            border: `1px solid ${theme.ruleSoft}`,
            borderRadius: "3px",
          }}
        >
          Demo
        </span>
      </div>

      {/* Bottom: title + default/hover swap */}
      <div style={{ position: "relative", minHeight: "46px" }}>
        {/* Default label */}
        <div
          style={{
            opacity: hovered ? 0 : 1,
            transform: hovered ? "translateY(-4px)" : "translateY(0)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            position: "absolute",
            inset: 0,
          }}
        >
          <div
            style={{
              fontFamily: fontStack,
              fontSize: "14px",
              fontWeight: 600,
              color: theme.ink,
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
            }}
          >
            {title}
          </div>
          {suffix && (
            <div
              style={{
                fontFamily: fontStack,
                fontSize: "11px",
                color: theme.mutedSoft,
                marginTop: "3px",
                fontWeight: 500,
              }}
            >
              {suffix}
            </div>
          )}
        </div>

        {/* Hover state */}
        <div
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: fontStack,
            fontSize: "13px",
            fontWeight: 600,
            color: theme.accent,
            letterSpacing: "-0.005em",
            pointerEvents: "none",
          }}
        >
          Coming soon
          <ArrowRight size={13} />
        </div>
      </div>
    </div>
  );
}
