import { NextResponse } from "next/server";

// Temporary diagnostic endpoint to debug auth mismatches.
// Returns metadata about DASHBOARD_PASSWORD (length, whitespace), never the
// value itself. Remove once auth is working.

export async function GET() {
  const raw = process.env.DASHBOARD_PASSWORD;
  const trimmed = raw?.trim() ?? "";
  return NextResponse.json({
    password: {
      set: !!raw,
      rawLength: raw?.length ?? 0,
      trimmedLength: trimmed.length,
      hasLeadingWhitespace: raw ? raw !== raw.trimStart() : false,
      hasTrailingWhitespace: raw ? raw !== raw.trimEnd() : false,
      hasInteriorWhitespace: trimmed.includes(" "),
      firstCharCode: trimmed.length > 0 ? trimmed.charCodeAt(0) : null,
      lastCharCode:
        trimmed.length > 0 ? trimmed.charCodeAt(trimmed.length - 1) : null,
    },
    notionToken: {
      set: !!process.env.NOTION_TOKEN,
      length: process.env.NOTION_TOKEN?.length ?? 0,
    },
    serverTime: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
  });
}
