"use client";

import { fontStack } from "@/lib/theme";

export function Pill({
  label,
  color,
  bg,
  size = "sm",
}: {
  label: string;
  color: string;
  bg?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: size === "sm" ? "2px 8px" : "4px 10px",
        fontSize: size === "sm" ? "11px" : "12px",
        fontFamily: fontStack,
        fontWeight: 500,
        color,
        background: bg || "transparent",
        border: `1px solid ${bg ? bg : color}`,
        borderRadius: "3px",
        letterSpacing: "-0.005em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
