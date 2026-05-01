import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { revalidateTag } from "next/cache";
import { NOTION_TAG } from "@/lib/notion";

export const dynamic = "force-dynamic";

// Inline-edit endpoint for the WeeklyDeltaStrip. Writes to the Notion row
// identified by `pageId`. Auth comes from the dashboard session cookie via
// middleware — anyone with the engagement password can write.
//
// Body: { pageId: string, summary: string, risks: string, plan: string }
//
// Notion text properties accept rich_text arrays. We always write a single
// plain-text run, which loses any prior inline formatting in the row. That's
// an acceptable tradeoff for an inline edit experience.
export async function POST(req: NextRequest) {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "NOTION_TOKEN not set" },
      { status: 500 }
    );
  }

  let body: {
    pageId?: unknown;
    headline?: unknown;
    weekNumber?: unknown;
    summary?: unknown;
    risks?: unknown;
    plan?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid json" },
      { status: 400 }
    );
  }

  const pageId = typeof body.pageId === "string" ? body.pageId.trim() : "";
  if (!pageId) {
    return NextResponse.json(
      { ok: false, error: "pageId required" },
      { status: 400 }
    );
  }
  const headline = typeof body.headline === "string" ? body.headline : "";
  const summary = typeof body.summary === "string" ? body.summary : "";
  const risks = typeof body.risks === "string" ? body.risks : "";
  const plan = typeof body.plan === "string" ? body.plan : "";
  const weekNumber =
    typeof body.weekNumber === "number" && Number.isFinite(body.weekNumber)
      ? body.weekNumber
      : null;

  const client = new Client({ auth: token });
  const richText = (text: string) =>
    text.length > 0
      ? [{ type: "text" as const, text: { content: text.slice(0, 2000) } }]
      : [];

  try {
    await client.pages.update({
      page_id: pageId,
      properties: {
        Headline: { rich_text: richText(headline) },
        "Week number": { number: weekNumber },
        "Summary status": { rich_text: richText(summary) },
        "Key risks issues blockers": { rich_text: richText(risks) },
        "Plan for next period": { rich_text: richText(plan) },
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }

  // Bust the dashboard cache so the next render reads the new values.
  revalidateTag(NOTION_TAG);
  return NextResponse.json({ ok: true });
}
