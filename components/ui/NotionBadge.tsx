"use client";

import { useTheme } from "@/components/ThemeProvider";

// Small clickable badge that opens a Notion page in a new tab. Used on
// dashboard tiles / section headers to give users a one-click jump to the
// underlying source DB.
export function NotionBadge({
  href,
  size = 18,
  title = "Open source in Notion",
  style,
}: {
  href: string;
  size?: number;
  title?: string;
  style?: React.CSSProperties;
}) {
  const { theme } = useTheme();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      aria-label={title}
      onClick={(e) => e.stopPropagation()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: 4,
        background: theme.surfaceElevated,
        border: `1px solid ${theme.rule}`,
        color: theme.ink,
        textDecoration: "none",
        flexShrink: 0,
        transition: "background 0.1s, border-color 0.1s",
        ...style,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = theme.ink;
        el.style.color = theme.surface;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = theme.surfaceElevated;
        el.style.color = theme.ink;
      }}
    >
      <NotionLogomark size={Math.round(size * 0.65)} />
    </a>
  );
}

// Simplified Notion-style "N" logomark. Uses currentColor so the surrounding
// link element controls the colour (lets us invert on hover).
function NotionLogomark({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5.5 4.5h2.7l8.6 11.1V4.5h2.7v15h-2.7L8.2 8.4v11.1H5.5z"
        fill="currentColor"
      />
    </svg>
  );
}
