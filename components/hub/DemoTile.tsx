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
        padding: "22px 20px",
        cursor: "not-allowed",
        transition: "all 0.18s ease",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "208px",
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
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: theme.surfaceElevated,
            border: `1px solid ${theme.ruleSoft}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: hovered ? theme.mutedSoft : theme.muted,
            transition: "color 0.18s ease",
          }}
        >
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <span
          style={{
            fontFamily: monoStack,
            fontSize: "10px",
            color: theme.mutedSoft,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 600,
            padding: "3px 8px",
            border: `1px solid ${theme.ruleSoft}`,
            borderRadius: "3px",
          }}
        >
          Demo
        </span>
      </div>

      {/* Bottom: title + default/hover swap */}
      <div style={{ position: "relative", minHeight: "58px" }}>
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
              fontSize: "17px",
              fontWeight: 600,
              color: theme.ink,
              letterSpacing: "-0.015em",
              lineHeight: 1.25,
            }}
          >
            {title}
          </div>
          {suffix && (
            <div
              style={{
                fontFamily: fontStack,
                fontSize: "12px",
                color: theme.mutedSoft,
                marginTop: "4px",
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
            gap: "8px",
            fontFamily: fontStack,
            fontSize: "16px",
            fontWeight: 600,
            color: theme.accent,
            letterSpacing: "-0.01em",
            pointerEvents: "none",
          }}
        >
          Coming soon
          <ArrowRight size={15} />
        </div>
      </div>
    </div>
  );
}
