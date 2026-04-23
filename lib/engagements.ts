import type { Programme } from "@/lib/types";

// Registry of every engagement served by this multi-tenant dashboard.
// Adding a new engagement:
//   1. Create its Notion Command Center via the project-update-dashboard skill.
//   2. Add a config entry below with the slug, programme metadata, and Notion
//      data-source IDs.
//   3. Add a matching CLIENT_PASSWORD_<SLUG> env var on Render.

export interface EngagementNotion {
  tasks: string;
  raid: string;
  commitments: string;
  valueTracking: string;
  meetings: string;
  invoices: string;
  weeklyDelta: string;
  weeklyDeltaChanges: string;
}

export interface Engagement {
  slug: string;
  programme: Programme;
  notion: EngagementNotion;
  // Env var name that holds this engagement's client-side password.
  // During the multi-tenant migration, Wilshire falls back to the legacy
  // DASHBOARD_PASSWORD if CLIENT_PASSWORD_WILSHIRE isn't set — see auth.ts.
  passwordEnv: string;
}

const WILSHIRE: Engagement = {
  slug: "wilshire",
  programme: {
    name: "Wilshire — AI Acceleration",
    client: "Wilshire Advisors LLC",
    supplier: "Motive Create US, LLC",
    fee: 400,
    clientSponsor: "Hanna Valva (CTO)",
    workstreamLead: "Mo Beldo",
    sponsors: [
      "Christina Walsh, CFO",
      "Todd Kessler, CRO",
      "Leah Emkin, OCIO",
    ],
    start: "Apr 20, 2026",
    end: "Jun 21, 2026",
    currentWeek: 1,
    totalWeeks: 9,
    // `today` is re-computed on each render in load-data.ts
    today: "",
    notionUrl: "https://www.notion.so/3485e123a435810ab817edd0326ff7ab",
  },
  notion: {
    tasks: "cc5a7172-0133-419f-b1d2-3587e804ee6b",
    raid: "3c657330-bcb7-4933-abc2-eca38274b7b4",
    commitments: "57e9fb3b-e3dd-40f0-bb47-9e29b10aef80",
    valueTracking: "46977b20-a8cd-4a8c-bd28-fbceaf6becbd",
    meetings: "8ab0d80e-7a93-42fb-ac36-164dc002824d",
    invoices: "c60f4f90-ad21-474d-8b42-09270ae3214a",
    weeklyDelta: "93849d6f-33da-4b19-a8ff-ca026ed210e6",
    weeklyDeltaChanges: "ffe39e59-6ffb-48cf-b41a-ce4387ada811",
  },
  passwordEnv: "CLIENT_PASSWORD_WILSHIRE",
};

export const ENGAGEMENTS: Record<string, Engagement> = {
  wilshire: WILSHIRE,
};

export const ENGAGEMENT_SLUGS = Object.keys(ENGAGEMENTS);

export function getEngagement(slug: string): Engagement | null {
  return ENGAGEMENTS[slug] ?? null;
}

export function listEngagements(): Engagement[] {
  return Object.values(ENGAGEMENTS);
}

// Look up an engagement by the submitted client password. Returns the slug of
// the first engagement whose passwordEnv value matches. Used by /api/login.
// Falls back to DASHBOARD_PASSWORD for Wilshire specifically (legacy migration).
export function findEngagementByPassword(
  submitted: string
): string | null {
  for (const e of Object.values(ENGAGEMENTS)) {
    const expected = readClientPassword(e);
    if (expected && timingSafeEquals(submitted, expected)) {
      return e.slug;
    }
  }
  return null;
}

export function readClientPassword(e: Engagement): string | null {
  const raw = process.env[e.passwordEnv]?.trim();
  if (raw && raw.length > 0) return raw;
  // Legacy fallback: during migration, Wilshire can still auth via the
  // existing DASHBOARD_PASSWORD env var that clients already know.
  if (e.slug === "wilshire") {
    const legacy = process.env.DASHBOARD_PASSWORD?.trim();
    if (legacy && legacy.length > 0) return legacy;
  }
  return null;
}

function timingSafeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
