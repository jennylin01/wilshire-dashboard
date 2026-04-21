"use client";

import { Briefcase, LineChart, LogOut, Receipt, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { fontStack, monoStack } from "@/lib/theme";
import type { DashboardData } from "@/lib/types";
import { DemoTile } from "./DemoTile";
import { ProgramTile } from "./ProgramTile";

export function Hub({ data }: { data: DashboardData }) {
  const { theme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
  };

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
            Engagement hub
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
            {data.programme.today}
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
            Choose a programme
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
            Motive Create &mdash; engagement portfolio
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
            Open the live program to view engagement health. Additional
            workstream-level dashboards are in the pipeline.
          </p>
        </div>

        {/* Grid: big tile + 2x2 demo tiles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
            gap: "20px",
            alignItems: "stretch",
          }}
        >
          <ProgramTile data={data} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: "16px",
            }}
          >
            <DemoTile
              title="Finance & Accounting"
              suffix="(AP Demo)"
              Icon={Receipt}
            />
            <DemoTile
              title="Sales & Account Management"
              suffix="(Demo)"
              Icon={LineChart}
            />
            <DemoTile
              title="Private Market"
              suffix="(Demo)"
              Icon={Briefcase}
            />
            <DemoTile
              title="Client Services"
              suffix="(Demo)"
              Icon={Users}
            />
          </div>
        </div>
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
        <div>Motive Create &times; Wilshire Advisors &middot; 2026</div>
        <div>Confidential</div>
      </div>
    </div>
  );
}
