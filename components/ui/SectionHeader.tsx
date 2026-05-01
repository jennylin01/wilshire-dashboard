"use client";

import { useTheme } from "@/components/ThemeProvider";
import { fontStack } from "@/lib/theme";
import { NotionBadge } from "./NotionBadge";

export function SectionHeader({
  label,
  href,
}: {
  label: string;
  // When set, renders a small Notion badge after the label that links to
  // the source DB in Notion.
  href?: string;
}) {
  const { theme } = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
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
      {href && (
        <NotionBadge
          href={href}
          size={18}
          title={`Open ${label} in Notion`}
        />
      )}
      <div style={{ flex: 1, height: "1px", background: theme.rule }} />
    </div>
  );
}
