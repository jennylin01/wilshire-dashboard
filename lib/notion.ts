import { Client } from "@notionhq/client";
import { unstable_cache } from "next/cache";
import { getEngagement } from "@/lib/engagements";

export const NOTION_TAG = "notion";

function client(): Client {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error(
      "NOTION_TOKEN is not set. Create .env.local with NOTION_TOKEN=secret_..."
    );
  }
  return new Client({ auth: token });
}

async function queryAll(dataSourceId: string): Promise<unknown[]> {
  const c = client();
  const out: unknown[] = [];
  let cursor: string | undefined;
  for (let i = 0; i < 20; i++) {
    const res = await c.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      page_size: 100,
    });
    out.push(...res.results);
    if (!res.has_more || !res.next_cursor) break;
    cursor = res.next_cursor;
  }
  return out;
}

// One cached accessor per (engagement slug, DB kind). Keyed so different
// engagements don't share cache entries.
//
// Failures are swallowed and return []. This keeps the dashboard usable when
// a single Notion DB is unreachable (integration not shared, DB renamed,
// transient API error) — the affected section renders empty instead of the
// whole page 500ing. The error is logged so it stays diagnosable, and we
// avoid caching the failure so a fix shows up on the next request rather
// than after the 60s revalidate window.
function cachedQuery(
  slug: string,
  kind: string,
  dataSourceId: string
): () => Promise<unknown[]> {
  const cached = unstable_cache(
    async () => queryAll(dataSourceId),
    ["notion", slug, kind, dataSourceId],
    { revalidate: 60, tags: [NOTION_TAG] }
  );
  return async () => {
    try {
      return await cached();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(
        `[notion] fetch failed for ${slug}/${kind} (${dataSourceId}): ${msg}`
      );
      return [];
    }
  };
}

export interface EngagementFetchers {
  fetchTasks: () => Promise<unknown[]>;
  fetchRaid: () => Promise<unknown[]>;
  // Returns [] when the engagement has no dedicated decisions DB
  // (DecisionsPanel then falls back to filtering raid by Type=Decision).
  fetchDecisions: () => Promise<unknown[]>;
  fetchCommitments: () => Promise<unknown[]>;
  fetchValueTracking: () => Promise<unknown[]>;
  fetchMeetings: () => Promise<unknown[]>;
  fetchInvoices: () => Promise<unknown[]>;
  fetchWeeklyDelta: () => Promise<unknown[]>;
  fetchWeeklyDeltaChanges: () => Promise<unknown[]>;
}

export function fetchersForEngagement(
  slug: string
): EngagementFetchers | null {
  const e = getEngagement(slug);
  if (!e) return null;
  const n = e.notion;
  const decisionsId = n.decisions;
  return {
    fetchTasks: cachedQuery(slug, "tasks", n.tasks),
    fetchRaid: cachedQuery(slug, "raid", n.raid),
    fetchDecisions: decisionsId
      ? cachedQuery(slug, "decisions", decisionsId)
      : async () => [],
    fetchCommitments: cachedQuery(slug, "commitments", n.commitments),
    fetchValueTracking: cachedQuery(slug, "valueTracking", n.valueTracking),
    fetchMeetings: cachedQuery(slug, "meetings", n.meetings),
    fetchInvoices: cachedQuery(slug, "invoices", n.invoices),
    fetchWeeklyDelta: cachedQuery(slug, "weeklyDelta", n.weeklyDelta),
    fetchWeeklyDeltaChanges: cachedQuery(
      slug,
      "weeklyDeltaChanges",
      n.weeklyDeltaChanges
    ),
  };
}
