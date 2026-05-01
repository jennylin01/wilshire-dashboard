"use client";

import { useTheme } from "@/components/ThemeProvider";
import { fontStack } from "@/lib/theme";
import { ArrowUpRight } from "lucide-react";

export function SectionHeader({
  label,
  href,
}: {
  label: string;
  href?: string;
}) {
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
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${label} in Notion`}
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontFamily: fontStack,
            fontSize: "12px",
            fontWeight: 500,
            color: theme.muted,
            textDecoration: "none",
            padding: "2px 6px",
            borderRadius: "3px",
            transition: "color 0.1s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = theme.ink;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = theme.muted;
          }}
        >
          Open in Notion
          <ArrowUpRight size={12} />
        </a>
      )}
      <div style={{ flex: 1, height: "1px", background: theme.rule }} />
    </div>
  );
}
