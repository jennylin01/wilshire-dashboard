import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { getEngagement } from "@/lib/engagements";

export const dynamic = "force-dynamic";

// Diagnostic endpoint — bypasses unstable_cache and queries each Notion data
// source for the requested engagement directly. Returns a row count or the
// raw error message per DB, plus the integration's bot name. Lets us see
// exactly what the prod NOTION_TOKEN can and can't reach.
//
// Usage: /api/diag?slug=wilshire&secret=<DASHBOARD_PASSWORD>
//
// Auth: gated by DASHBOARD_PASSWORD because the response includes raw Notion
// errors and DB IDs that are mildly sensitive. Constant-time compare.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug") ?? "wilshire";
  const submitted = url.searchParams.get("secret") ?? "";
  const expected = process.env.DASHBOARD_PASSWORD ?? "";
  if (!expected || !timingSafeEquals(submitted, expected)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const e = getEngagement(slug);
  if (!e) return NextResponse.json({ error: "unknown slug" }, { status: 404 });

  const token = process.env.NOTION_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "NOTION_TOKEN not set" }, { status: 500 });
  }

  const client = new Client({ auth: token });

  type Result = {
    kind: string;
    id: string;
    rows?: number;
    lastEdit?: string;
    error?: string;
  };
  async function probe(kind: string, id: string): Promise<Result> {
    if (!id) return { kind, id, error: "no id configured" };
    try {
      const full = await client.dataSources.query({
        data_source_id: id,
        page_size: 100,
        sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
      });
      const top = full.results[0] as { last_edited_time?: string } | undefined;
      return {
        kind,
        id,
        rows: full.results.length + (full.has_more ? Infinity : 0),
        lastEdit: top?.last_edited_time,
      };
    } catch (err) {
      return {
        kind,
        id,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  let bot = "(unknown)";
  try {
    const me = await client.users.me({});
    bot =
      me.type === "bot"
        ? `${me.name ?? "(unnamed)"} [${me.bot?.workspace_name ?? ""}]`
        : me.name ?? "(non-bot)";
  } catch (err) {
    bot = `lookup failed: ${err instanceof Error ? err.message : String(err)}`;
  }

  const probes = await Promise.all([
    probe("tasks", e.notion.tasks),
    probe("raid", e.notion.raid),
    probe("commitments", e.notion.commitments),
    probe("valueTracking", e.notion.valueTracking),
    probe("meetings", e.notion.meetings),
    probe("invoices", e.notion.invoices),
    probe("weeklyDelta", e.notion.weeklyDelta),
    probe("weeklyDeltaChanges", e.notion.weeklyDeltaChanges),
  ]);

  return NextResponse.json({
    slug,
    integration: bot,
    probes: probes.map((p) =>
      p.rows === Infinity ? { ...p, rows: ">=100" } : p
    ),
  });
}

function timingSafeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
