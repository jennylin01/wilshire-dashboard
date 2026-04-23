"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { fontStack, monoStack } from "@/lib/theme";
import type { HubEntry } from "@/app/page";
import { ProgramTile } from "./ProgramTile";

export function Hub({ entries }: { entries: HubEntry[] }) {
  const { theme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      style={{
        fontFamily: fontStack,
        background: theme.bg,
        minHeight: "100vh",
        color: theme.ink,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* TOP NAV */}
      <div
        style={{
          borderBottom: `1px solid ${theme.rule}`,
          background: theme.bg,
          padding: "14px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: theme.ink,
              letterSpacing: "-0.02em",
            }}
          >
            Motive
            <span style={{ color: theme.muted, fontWeight: 400 }}>
              {" "}· Create
            </span>
          </div>
          <div
            style={{ width: "1px", height: "16px", background: theme.rule }}
          />
          <div
            style={{
              fontSize: "14px",
              color: theme.muted,
            }}
          >
            Delivery — all engagements
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              fontFamily: monoStack,
              fontSize: "12px",
              color: theme.muted,
            }}
          >
            {today}
          </div>
          <ThemeToggle />
          <button
            onClick={handleLogout}
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
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = theme.surfaceHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "36px 40px 32px" }}>
        {/* Heading */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontFamily: monoStack,
              fontSize: "10px",
              color: theme.accent,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Engagement portfolio
          </div>
          <h1
            style={{
              fontFamily: fontStack,
              fontSize: "26px",
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              color: theme.ink,
            }}
          >
            Motive Create — Delivery
          </h1>
          <p
            style={{
              fontFamily: fontStack,
              fontSize: "13px",
              color: theme.muted,
              margin: "6px 0 0",
              lineHeight: 1.5,
              maxWidth: "720px",
            }}
          >
            One tile per active engagement. Click through for live health,
            workstream status, risks, commitments, and milestones.
          </p>
        </div>

        {/* Grid of engagement tiles */}
        {entries.length === 0 ? (
          <div
            style={{
              padding: "40px 28px",
              border: `1px dashed ${theme.rule}`,
              borderRadius: "8px",
              color: theme.muted,
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            No engagements configured yet. Add one to{" "}
            <code
              style={{
                fontFamily: monoStack,
                fontSize: "12px",
                background: theme.surfaceElevated,
                padding: "2px 6px",
                borderRadius: "3px",
              }}
            >
              lib/engagements.ts
            </code>
            .
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                entries.length === 1
                  ? "minmax(0, 720px)"
                  : "repeat(auto-fill, minmax(420px, 1fr))",
              gap: "20px",
              alignItems: "stretch",
            }}
          >
            {entries.map((e) => (
              <ProgramTile key={e.slug} entry={e} />
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div
        style={{
          borderTop: `1px solid ${theme.rule}`,
          padding: "16px 40px",
          fontFamily: monoStack,
          fontSize: "11px",
          color: theme.mutedSoft,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>Motive Create · Delivery · 2026</div>
        <div>Confidential</div>
      </div>
    </div>
  );
}
