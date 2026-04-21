import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { NOTION_TAG } from "@/lib/notion";

export async function POST() {
  revalidateTag(NOTION_TAG);
  return NextResponse.json({ revalidated: true, tag: NOTION_TAG });
}
