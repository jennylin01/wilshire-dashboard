"use client";

import { useTheme } from "@/components/ThemeProvider";
import { fontStack } from "@/lib/theme";

export function SectionHeader({ label }: { label: string }) {
  const { theme } = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
      <h2
        style={{
          fontFamily: fontStack,
          fontSize: "15px",
          fontWeight: 600,
          color: theme.ink,
          margin: 0,
          letterSpacing: "-0.005em",
        }}
      >
        {label}
      </h2>
      <div style={{ flex: 1, height: "1px", background: theme.rule }} />
    </div>
  );
}
