"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, mode, toggle } = useTheme();
  const isDark = mode === "dark";
  return (
    <button
      onClick={toggle}
      style={{
        width: "34px",
        height: "34px",
        border: `1px solid ${theme.rule}`,
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.ink,
        borderRadius: "3px",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = theme.surfaceHover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      title={isDark ? "Switch to light" : "Switch to dark"}
      aria-label={isDark ? "Switch to light" : "Switch to dark"}
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}
