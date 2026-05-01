"use client";

import { useTheme } from "@/components/ThemeProvider";
import { KPI } from "@/components/ui/KPI";
import type { DetailRef } from "@/components/dashboard/Dashboard";
import type { DashboardData } from "@/lib/types";

export function VitalsStrip({
  data,
  onOpen,
}: {
  data: DashboardData;
  onOpen: (r: DetailRef) => void;
}) {
  const { theme } = useTheme();

  const openHighRisks = data.risks.filter(
    (r) => r.severity === "High" && r.status.toLowerCase() !== "closed"
  ).length;
  const lateCommitments = data.commitments.filter(
    (c) => c.status === "Late" || c.status === "Blocked"
  ).length;
  const notStartedCount = data.commitments.filter(
    (c) => c.status === "Not started"
  ).length;
  const pendingDecisions = data.decisions.filter(
    (d) => d.status === "Open" || d.status === "Pending decision"
  ).length;

  // Overall RAG comes from the Weekly delta row's RAG select column.
  // Falls back to detecting Red/Amber/Green tokens in the Headline text
  // for legacy rows where the column isn't set. Defaults to Green.
  const headlineMatch = data.weeklyDelta.headline.match(
    /\b(red|amber|yellow|green)\b/i
  );
  const headlineRag = headlineMatch
    ? headlineMatch[1].toLowerCase() === "red"
      ? "red"
      : headlineMatch[1].toLowerCase() === "green"
        ? "green"
        : "amber"
    : null;
  const overall: "green" | "amber" | "red" = data.weeklyDelta.rag
    ? (data.weeklyDelta.rag.toLowerCase() as "red" | "amber" | "green")
    : (headlineRag as "red" | "amber" | "green" | null) ?? "green";
  const overallLabel =
    overall === "red" ? "Red" : overall === "amber" ? "Amber" : "Green";
  const overallAccent =
    overall === "red"
      ? theme.red
      : overall === "amber"
        ? theme.amber
        : theme.green;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1px",
        background: theme.rule,
        border: `1px solid ${theme.rule}`,
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <KPI
        label="Overall RAG"
        value={overallLabel}
        sub="From Weekly delta row"
        accent={overallAccent}
        notionHref={data.programme.weeklyDeltaUrl}
      />
      <KPI
        label="High-sev risks open"
        value={openHighRisks}
        sub="Monitor daily"
        accent={theme.red}
        onClick={() => onOpen({ type: "risks" })}
        notionHref={data.programme.raidUrl}
      />
      <KPI
        label="Late or blocked commitments"
        value={lateCommitments}
        sub={`${notStartedCount} not started`}
        accent={theme.red}
        onClick={() => onOpen({ type: "commitment" })}
        notionHref={data.programme.commitmentsUrl}
      />
      <KPI
        label="Pending decisions"
        value={pendingDecisions}
        sub="Open items"
        accent={theme.amber}
        onClick={() => onOpen({ type: "decisions" })}
        notionHref={data.programme.decisionsUrl}
      />
    </div>
  );
}
