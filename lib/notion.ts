import { Client } from "@notionhq/client";
import { unstable_cache } from "next/cache";

// Data source IDs from BRIEF.md
export const DATA_SOURCES = {
  tasks: "cc5a7172-0133-419f-b1d2-3587e804ee6b",
  raid: "3c657330-bcb7-4933-abc2-eca38274b7b4",
  commitments: "57e9fb3b-e3dd-40f0-bb47-9e29b10aef80",
  valueTracking: "46977b20-a8cd-4a8c-bd28-fbceaf6becbd",
  meetings: "8ab0d80e-7a93-42fb-ac36-164dc002824d",
  invoices: "c60f4f90-ad21-474d-8b42-09270ae3214a",
  weeklyDelta: "93849d6f-33da-4b19-a8ff-ca026ed210e6",
  weeklyDeltaChanges: "ffe39e59-6ffb-48cf-b41a-ce4387ada811",
} as const;

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

// Paginate through every page in a data source.
async function queryAll(dataSourceId: string): Promise<unknown[]> {
  const c = client();
  const out: unknown[] = [];
  let cursor: string | undefined;
  for (let i = 0; i < 20; i++) {
    // safety cap
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

const cachedQuery = (dataSourceId: string, key: string) =>
  unstable_cache(
    async () => queryAll(dataSourceId),
    ["notion", key, dataSourceId],
    { revalidate: 60, tags: [NOTION_TAG] }
  );

export const fetchTasks = () => cachedQuery(DATA_SOURCES.tasks, "tasks")();
export const fetchRaid = () => cachedQuery(DATA_SOURCES.raid, "raid")();
export const fetchCommitments = () =>
  cachedQuery(DATA_SOURCES.commitments, "commitments")();
export const fetchValueTracking = () =>
  cachedQuery(DATA_SOURCES.valueTracking, "valueTracking")();
export const fetchMeetings = () =>
  cachedQuery(DATA_SOURCES.meetings, "meetings")();
export const fetchInvoices = () =>
  cachedQuery(DATA_SOURCES.invoices, "invoices")();
export const fetchWeeklyDelta = () =>
  cachedQuery(DATA_SOURCES.weeklyDelta, "weeklyDelta")();
export const fetchWeeklyDeltaChanges = () =>
  cachedQuery(DATA_SOURCES.weeklyDeltaChanges, "weeklyDeltaChanges")();
