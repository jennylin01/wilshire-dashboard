"use client";

import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { fontStack, monoStack, ragColor } from "@/lib/theme";
import type { DashboardData, RAG } from "@/lib/types";

export function ProgramTile({ data }: { data: DashboardData }) {
  const { theme } = useTheme();
  const router = useRouter();

  // Roll up worst-RAG across all workstreams for the header dot.
  const ragOrder: Record<RAG, number> = { green: 0, amber: 1, red: 2 };
  const overall = data.workstreams
    .map((w) => w.rag)
    .reduce<RAG>(
      (acc, r) => (ragOrder[r] > ragOrder[acc] ? r : acc),
      "green"
    );
  const overallLabel =
    overall === "red" ? "Red" : overall === "amber" ? "Amber" : "Green";

  const openHighRisks = data.risks.filter(
    (r) => r.severity === "High" && r.status.toLowerCase() !== "closed"
  ).length;
  const lateCommitments = data.commitments.filter(
    (c) => c.status === "Late"
  ).length;
  const pendingDecisions = data.decisions.filter(
    (d) => d.status === "Pending decision"
  ).length;

  return (
    <div
      onClick={() => router.push("/program")}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push("/program");
        }
      }}
      style={{
        background: theme.surface,
        border: `1px solid ${theme.rule}`,
        borderRadius: "8px",
        padding: "32px 36px",
        cursor: "pointer",
        transition: "all 0.18s ease",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        minHeight: "440px",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = theme.surfaceHover;
        e.currentTarget.style.borderColor = theme.mutedSoft;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = theme.surface;
        e.currentTarget.style.borderColor = theme.rule;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Accent rail */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "3px",
          background: theme.accent,
        }}
      />

      {/* Top: category label + title */}
      <div>
        <div
          style={{
            fontFamily: monoStack,
            fontSize: "11px",
            color: theme.accent,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          Programme · Live
        </div>
        <h2
          style={{
            fontFamily: fontStack,
            fontSize: "32px",
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            color: theme.ink,
          }}
        >
          {data.programme.name}
        </h2>
        <p
          style={{
            fontFamily: fontStack,
            fontSize: "15px",
            color: theme.muted,
            margin: "10px 0 0",
            lineHeight: 1.5,
          }}
        >
          {data.programme.supplier} &times; {data.programme.client}
        </p>
      </div>

      {/* Timeline row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          paddingTop: "18px",
          borderTop: `1px solid ${theme.ruleSoft}`,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: fontStack,
              fontSize: "12px",
              color: theme.muted,
              marginBottom: "6px",
              fontWeight: 500,
            }}
          >
            Timeline
          </div>
          <div
            style={{
              fontFamily: fontStack,
              fontSize: "18px",
              color: theme.ink,
              fontWeight: 600,
              letterSpacing: "-0.015em",
            }}
          >
            Week {data.programme.currentWeek} of {data.programme.totalWeeks}
          </div>
          <div
            style={{
              fontFamily: monoStack,
              fontSize: "12px",
              color: theme.mutedSoft,
              marginTop: "4px",
            }}
          >
            {data.programme.start} → {data.programme.end}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: fontStack,
              fontSize: "12px",
              color: theme.muted,
              marginBottom: "6px",
              fontWeight: 500,
            }}
          >
            Fee
          </div>
          <div
            style={{
              fontFamily: fontStack,
              fontSize: "18px",
              color: theme.ink,
              fontWeight: 600,
              letterSpacing: "-0.015em",
            }}
          >
            ${data.programme.fee}k fixed
          </div>
          <div
            style={{
              fontFamily: monoStack,
              fontSize: "12px",
              color: theme.mutedSoft,
              marginTop: "4px",
            }}
          >
            PM: {data.programme.clientPM}
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          paddingTop: "18px",
          borderTop: `1px solid ${theme.ruleSoft}`,
        }}
      >
        <KPIMini
          label="Overall RAG"
          value={overallLabel}
          color={ragColor(theme, overall)}
          dot
        />
        <KPIMini
          label="High-sev risks"
          value={String(openHighRisks)}
          color={theme.red}
        />
        <KPIMini
          label="Late commitments"
          value={String(lateCommitments)}
          color={theme.red}
        />
        <KPIMini
          label="Pending decisions"
          value={String(pendingDecisions)}
          color={theme.amber}
        />
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "20px",
          borderTop: `1px solid ${theme.ruleSoft}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: monoStack,
            fontSize: "11px",
            color: theme.mutedSoft,
          }}
        >
          Last sync · {data.lastSync}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: fontStack,
            fontSize: "15px",
            fontWeight: 600,
            color: theme.accent,
            letterSpacing: "-0.01em",
          }}
        >
          Open program dashboard
          <ArrowUpRight size={16} />
        </div>
      </div>
    </div>
  );
}

function KPIMini({
  label,
  value,
  color,
  dot = false,
}: {
  label: string;
  value: string;
  color: string;
  dot?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <div>
      <div
        style={{
          fontFamily: fontStack,
          fontSize: "12px",
          color: theme.muted,
          fontWeight: 500,
          marginBottom: "8px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: fontStack,
          fontSize: "26px",
          fontWeight: 700,
          color,
          letterSpacing: "-0.025em",
          lineHeight: 1,
        }}
      >
        {dot && (
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: color,
              display: "inline-block",
            }}
          />
        )}
        {value}
      </div>
    </div>
  );
}
