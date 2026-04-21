"use client";

import { ExternalLink, X } from "lucide-react";
import { useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { fontStack } from "@/lib/theme";

export function DetailPanel({
  title,
  subtitle,
  notionUrl,
  children,
  onClose,
}: {
  title: string;
  subtitle: string;
  notionUrl?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const { theme, mode } = useTheme();
  const isDark = mode === "dark";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: isDark ? "rgba(0,0,0,0.7)" : "rgba(10,10,10,0.35)",
        display: "flex",
        justifyContent: "flex-end",
        animation: "wilshire-fade-in 0.18s ease",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "620px",
          maxWidth: "94vw",
          height: "100%",
          background: theme.bg,
          overflowY: "auto",
          borderLeft: `1px solid ${theme.rule}`,
          animation: "wilshire-slide-in 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
          boxShadow: isDark
            ? "-20px 0 60px rgba(0,0,0,0.5)"
            : "-20px 0 60px rgba(10,10,10,0.08)",
        }}
      >
        <div
          style={{
            padding: "24px 32px 20px",
            borderBottom: `1px solid ${theme.rule}`,
            position: "sticky",
            top: 0,
            background: theme.bg,
            zIndex: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "13px",
                fontFamily: fontStack,
                color: theme.muted,
                marginBottom: "6px",
                fontWeight: 500,
              }}
            >
              {subtitle}
            </div>
            <h2
              style={{
                fontFamily: fontStack,
                fontSize: "22px",
                color: theme.ink,
                margin: 0,
                letterSpacing: "-0.02em",
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {title}
            </h2>
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            {notionUrl && (
              <a
                href={notionUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: "32px",
                  height: "32px",
                  border: `1px solid ${theme.rule}`,
                  background: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.ink,
                  textDecoration: "none",
                  borderRadius: "3px",
                }}
                aria-label="Open in Notion"
              >
                <ExternalLink size={14} />
              </a>
            )}
            <button
              onClick={onClose}
              style={{
                width: "32px",
                height: "32px",
                border: `1px solid ${theme.rule}`,
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.ink,
                borderRadius: "3px",
              }}
              aria-label="Close panel"
            >
              <X size={14} />
            </button>
          </div>
        </div>
        <div style={{ padding: "24px 32px 48px" }}>{children}</div>
      </div>
    </div>
  );
}
