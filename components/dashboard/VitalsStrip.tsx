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
    (c) => c.status === "Late"
  ).length;
  const notStartedCount = data.commitments.filter(
    (c) => c.status === "Not started"
  ).length;
  const pendingDecisions = data.decisions.filter(
    (d) => d.status === "Pending decision"
  ).length;

  // Overall RAG = worst RAG across workstreams
  const ragOrder = { green: 0, amber: 1, red: 2 } as const;
  const overall = data.workstreams
    .map((w) => w.rag)
    .reduce<"green" | "amber" | "red">(
      (acc, r) => (ragOrder[r] > ragOrder[acc] ? r : acc),
      "green"
    );
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
        sub="Rolled up from workstreams"
        accent={overallAccent}
      />
      <KPI
        label="High-sev risks open"
        value={openHighRisks}
        sub="Monitor daily"
        accent={theme.red}
        onClick={() => onOpen({ type: "risks" })}
      />
      <KPI
        label="Late client commitments"
        value={lateCommitments}
        sub={`${notStartedCount} not started`}
        accent={theme.red}
        onClick={() => onOpen({ type: "commitment" })}
      />
      <KPI
        label="Pending decisions"
        value={pendingDecisions}
        sub="Open items"
        accent={theme.amber}
        onClick={() => onOpen({ type: "decisions" })}
      />
    </div>
  );
}
