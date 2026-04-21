"use client";

import { ArrowUpRight } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { fontStack } from "@/lib/theme";

export function KPI({
  label,
  value,
  sub,
  accent,
  onClick,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  onClick?: () => void;
}) {
  const { theme } = useTheme();
  return (
    <div
      onClick={onClick}
      style={{
        padding: "20px 22px 18px",
        background: theme.surface,
        cursor: onClick ? "pointer" : "default",
        transition: "background 0.15s",
        position: "relative",
      }}
      onMouseEnter={(e) =>
        onClick && (e.currentTarget.style.background = theme.surfaceHover)
      }
      onMouseLeave={(e) =>
        onClick && (e.currentTarget.style.background = theme.surface)
      }
    >
      <div
        style={{
          fontSize: "13px",
          fontFamily: fontStack,
          color: theme.muted,
          marginBottom: "14px",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: fontStack,
          fontSize: "36px",
          color: accent || theme.ink,
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: "14px",
            color: theme.muted,
            marginTop: "8px",
            fontFamily: fontStack,
          }}
        >
          {sub}
        </div>
      )}
      {onClick && (
        <ArrowUpRight
          size={13}
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            color: theme.mutedSoft,
          }}
        />
      )}
    </div>
  );
}
