import { programme } from "@/lib/milestones";
import {
  computeInvoiceTotals,
  mapCommitments,
  mapDecisions,
  mapMilestones,
  mapRisks,
  mapValueMetrics,
  mapWeeklyDelta,
  mapWorkstreams,
} from "@/lib/mappers";
import {
  fetchCommitments,
  fetchInvoices,
  fetchRaid,
  fetchTasks,
  fetchValueTracking,
  fetchWeeklyDelta,
  fetchWeeklyDeltaChanges,
} from "@/lib/notion";
import type { DashboardData } from "@/lib/types";

// Single shared loader used by both / (hub) and /program (dashboard).
// Underlying fetches are unstable_cached at 60s, so calling this from
// two routes on the same request is effectively free.
export async function loadDashboardData(): Promise<DashboardData> {
  const [
    rawTasks,
    rawRaid,
    rawCommitments,
    rawValue,
    rawInvoices,
    rawWeeks,
    rawDeltaChanges,
  ] = await Promise.all([
    fetchTasks(),
    fetchRaid(),
    fetchCommitments(),
    fetchValueTracking(),
    fetchInvoices(),
    fetchWeeklyDelta(),
    fetchWeeklyDeltaChanges(),
  ]);

  const milestones = mapMilestones(rawInvoices, programme.fee * 1000);
  const invoiceTotals = computeInvoiceTotals(milestones, programme.fee * 1000);

  return {
    programme,
    weeklyDelta: mapWeeklyDelta(rawWeeks, rawDeltaChanges),
    milestones,
    invoiceTotals,
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
