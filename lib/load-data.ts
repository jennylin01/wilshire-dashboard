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

// Single shared loader used by both / (hub) and /program (dashboard).
// Underlying fetches are unstable_cached at 60s, so calling this from
// two routes on the same request is effectively free.
export async function loadDashboardData(): Promise<DashboardData> {
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
