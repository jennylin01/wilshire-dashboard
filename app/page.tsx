import { Dashboard } from "@/components/dashboard/Dashboard";
import { milestones, programme } from "@/lib/milestones";
import {
  mapCommitments,
  mapDecisions,
  mapRisks,
  mapValueMetrics,
  mapWorkstreams,
} from "@/lib/mappers";
import {
  fetchCommitments,
  fetchRaid,
  fetchTasks,
  fetchValueTracking,
} from "@/lib/notion";
import type { DashboardData } from "@/lib/types";
import { weeklyDelta } from "@/lib/weekly-delta";

export const dynamic = "force-dynamic";

async function loadData(): Promise<DashboardData> {
  const [rawTasks, rawRaid, rawCommitments, rawValue] = await Promise.all([
    fetchTasks(),
    fetchRaid(),
    fetchCommitments(),
    fetchValueTracking(),
  ]);

  return {
    programme,
    weeklyDelta,
    milestones,
    workstreams: mapWorkstreams(rawTasks),
    risks: mapRisks(rawRaid),
    decisions: mapDecisions(rawRaid),
    commitments: mapCommitments(rawCommitments),
    valueMetrics: mapValueMetrics(rawValue),
    lastSync: new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }),
  };
}

export default async function Page() {
  let data: DashboardData;
  try {
    data = await loadData();
  } catch (err) {
    return (
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "40px",
          maxWidth: "800px",
          margin: "0 auto",
          color: "#0a0a0a",
        }}
      >
        <h1 style={{ fontSize: "24px", marginBottom: "12px" }}>
          Can&apos;t reach Notion
        </h1>
        <p style={{ color: "#737373", marginBottom: "16px" }}>
          The dashboard couldn&apos;t load data from the Notion workspace.
          Check that{" "}
          <code
            style={{
              background: "#f5f5f5",
              padding: "2px 6px",
              borderRadius: "3px",
            }}
          >
            NOTION_TOKEN
          </code>{" "}
          is set in{" "}
          <code
            style={{
              background: "#f5f5f5",
              padding: "2px 6px",
              borderRadius: "3px",
            }}
          >
            .env.local
          </code>{" "}
          and that the integration has access to the Wilshire root page.
        </p>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "12px",
            borderRadius: "4px",
            fontSize: "12px",
            overflow: "auto",
          }}
        >
          {String((err as Error)?.message ?? err)}
        </pre>
      </div>
    );
  }

  return <Dashboard data={data} />;
}
