import { getEngagement } from "@/lib/engagements";
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
import { fetchersForEngagement } from "@/lib/notion";
import type { DashboardData, Programme } from "@/lib/types";

// Loads a full DashboardData object for one engagement (by slug).
// Returns null if the slug isn't in the registry — caller should 404.
// Underlying fetches are unstable_cached at 60s, so calling this from
// multiple routes on the same request is effectively free.
export async function loadDashboardData(
  slug: string
): Promise<DashboardData | null> {
  const engagement = getEngagement(slug);
  if (!engagement) return null;
  const f = fetchersForEngagement(slug);
  if (!f) return null;

  const [
    rawTasks,
    rawRaid,
    rawCommitments,
    rawValue,
    rawInvoices,
    rawWeeks,
    rawDeltaChanges,
  ] = await Promise.all([
    f.fetchTasks(),
    f.fetchRaid(),
    f.fetchCommitments(),
    f.fetchValueTracking(),
    f.fetchInvoices(),
    f.fetchWeeklyDelta(),
    f.fetchWeeklyDeltaChanges(),
  ]);

  const programme: Programme = {
    ...engagement.programme,
    today: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };

  const milestones = mapMilestones(rawInvoices, programme.fee * 1000);
  const invoiceTotals = computeInvoiceTotals(milestones, programme.fee * 1000);

  return {
    programme,
    weeklyDelta: mapWeeklyDelta(rawWeeks, rawDeltaChanges),
    milestones,
    invoiceTotals,
    workstreams: mapWorkstreams(rawTasks, engagement.workstreams),
    risks: mapRisks(rawRaid),
    decisions: mapDecisions(rawRaid),
    commitments: mapCommitments(rawCommitments),
    valueMetrics: mapValueMetrics(rawValue, engagement.workstreams),
    lastSync: new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }),
  };
}
