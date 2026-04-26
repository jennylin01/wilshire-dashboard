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
function cachedQuery(
  slug: string,
  kind: string,
  dataSourceId: string
): () => Promise<unknown[]> {
  return unstable_cache(
    async () => queryAll(dataSourceId),
    ["notion", slug, kind, dataSourceId],
    { revalidate: 60, tags: [NOTION_TAG] }
  );
}

export interface EngagementFetchers {
  fetchTasks: () => Promise<unknown[]>;
  fetchRaid: () => Promise<unknown[]>;
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
  return {
    fetchTasks: cachedQuery(slug, "tasks", n.tasks),
    fetchRaid: cachedQuery(slug, "raid", n.raid),
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
