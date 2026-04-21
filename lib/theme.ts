export type ThemeMode = "light" | "dark";

export interface ThemeTokens {
  bg: string;
  surface: string;
  surfaceHover: string;
  surfaceElevated: string;
  ink: string;
  inkSoft: string;
  muted: string;
  mutedSoft: string;
  rule: string;
  ruleSoft: string;
  accent: string;
  accentSoft: string;
  amber: string;
  amberBg: string;
  red: string;
  redBg: string;
  green: string;
  greenBg: string;
}

const light: ThemeTokens = {
  bg: "#ffffff",
  surface: "#ffffff",
  surfaceHover: "#f5f5f5",
  surfaceElevated: "#fafafa",
  ink: "#0a0a0a",
  inkSoft: "#333333",
  muted: "#737373",
  mutedSoft: "#a3a3a3",
  rule: "#e5e5e5",
  ruleSoft: "#f0f0f0",
  accent: "#1e40af",
  accentSoft: "#dbeafe",
  amber: "#b45309",
  amberBg: "#fef3c7",
  red: "#b91c1c",
  redBg: "#fee2e2",
  green: "#047857",
  greenBg: "#d1fae5",
};

const dark: ThemeTokens = {
  bg: "#0a0a0a",
  surface: "#141414",
  surfaceHover: "#1c1c1c",
  surfaceElevated: "#1a1a1a",
  ink: "#ffffff",
  inkSoft: "#d4d4d4",
  muted: "#7a7a7a",
  mutedSoft: "#5a5a5a",
  rule: "#2a2a2a",
  ruleSoft: "#1f1f1f",
  accent: "#3b82f6",
  accentSoft: "#1e3a8a",
  amber: "#d97706",
  amberBg: "#2a1f0a",
  red: "#dc2626",
  redBg: "#2a0f0f",
  green: "#10b981",
  greenBg: "#0f2a20",
};

export const themeFor = (mode: ThemeMode): ThemeTokens =>
  mode === "dark" ? dark : light;

export const fontStack =
  'Aptos, "Aptos Display", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif';
export const monoStack = '"JetBrains Mono", "SF Mono", Consolas, monospace';

export const ragColor = (t: ThemeTokens, rag: string): string =>
  ({ green: t.green, amber: t.amber, red: t.red } as Record<string, string>)[
    rag
  ] || t.muted;

export const ragBg = (t: ThemeTokens, rag: string): string =>
  (
    { green: t.greenBg, amber: t.amberBg, red: t.redBg } as Record<
      string,
      string
    >
  )[rag] || t.surfaceElevated;

export const statusColor = (t: ThemeTokens, s: string | undefined): string => {
  const n = (s || "").toLowerCase();
  if (
    n.includes("delivered") ||
    n.includes("done") ||
    n === "closed" ||
    n === "hit"
  )
    return t.green;
  if (
    n.includes("late") ||
    n.includes("blocked") ||
    n === "open" ||
    n === "off track"
  )
    return t.red;
  if (
    n.includes("progress") ||
    n.includes("mitigating") ||
    n.includes("pending") ||
    n === "at risk"
  )
    return t.amber;
  return t.muted;
};
