import type { Programme, WorkstreamId } from "@/lib/types";

// Workstream definition for an engagement. `matchers` is a list of
// lowercase substrings that `mapWorkstreams` uses to classify a Notion
// Workstream select value into this bucket.
export interface WorkstreamDef {
  id: WorkstreamId;
  name: string;
  short: string;
  lead: string;
  sponsor: string;
  thesis: string;
  milestones: string[];
  matchers: string[];
}

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
  // meetings DB is currently unused by the dashboard — leave empty string
  // if a given engagement doesn't have one.
  meetings: string;
  invoices: string;
  weeklyDelta: string;
  weeklyDeltaChanges: string;
}

export interface Engagement {
  slug: string;
  programme: Programme;
  notion: EngagementNotion;
  // Workstream definitions for this engagement — shapes the workstream
  // grid on the dashboard and how Notion Tasks rows are classified.
  workstreams: WorkstreamDef[];
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
  workstreams: [
    {
      id: "fa",
      name: "Finance & accounting",
      short: "F&A",
      lead: "Mo Beldo",
      sponsor: "Christina Walsh",
      thesis:
        "AP automation — email routing, doc intelligence, mismatch detection, query auto-response.",
      milestones: ["M2 (Wk4, $60k)", "M3 (Wk5, $80k)"],
      matchers: ["f&a", "finance"],
    },
    {
      id: "srm",
      name: "Sales & revenue management",
      short: "S&RM",
      lead: "Mo Beldo",
      sponsor: "Todd Kessler",
      thesis:
        "Salesforce gap report, duplicate resolution, Accordion data mart integration.",
      milestones: ["M4 (Wk4, $40k)", "M5 (Wk7, $80k)"],
      matchers: ["s&rm", "sales"],
    },
    {
      id: "pm",
      name: "E2E investment mgmt — private market",
      short: "PM",
      lead: "Mo Beldo",
      sponsor: "Mark P",
      thesis:
        "Workflow reimagination — placeholder milestones pending Mark P sign-off (Apr 22).",
      milestones: ["M-PM1/2/3 — TBD"],
      matchers: ["investment mgmt", "private market", "e2e"],
    },
    {
      id: "gov",
      name: "Governance",
      short: "GOV",
      lead: "Motive Create PM",
      sponsor: "Hanna Valva",
      thesis:
        "Mobilisation, governance rhythm, status reporting, change control.",
      milestones: ["M1 (Wk1, $80k)", "M6 (Wk8, $60k)"],
      matchers: ["gov"],
    },
  ],
  passwordEnv: "CLIENT_PASSWORD_WILSHIRE",
};

const MOTIVE_OS: Engagement = {
  slug: "motive-os",
  programme: {
    name: "Motive OS",
    client: "Motive Labs US, LLC",
    supplier: "Sideko / Port of Context",
    fee: 150,
    clientSponsor: "Sarah Cooper (Phase 1) / Mo Beldo (Phase 2)",
    workstreamLead: "Mo Beldo",
    sponsors: ["Ramin Kamfar", "Mo Beldo"],
    start: "Apr 1, 2026",
    end: "Jun 30, 2026",
    currentWeek: 4,
    totalWeeks: 13,
    today: "",
    notionUrl: "https://www.notion.so/34b5e123a4358174b531ebfacaaab064",
  },
  notion: {
    tasks: "ae548889-e107-4df1-b802-9b4045154b88",
    raid: "1f8d2791-7c54-485e-b0b8-b7a8b7e3e3d0",
    commitments: "f127ad4e-3896-4192-bccf-dbdc4bd985fc",
    valueTracking: "3004f4e8-2896-4b89-9d2c-47657f95b314",
    meetings: "",
    invoices: "e0c8a02d-3151-47a5-8ae0-36c3df783a61",
    weeklyDelta: "8270ff0b-3a5e-4abe-9945-29df45d3305d",
    weeklyDeltaChanges: "3270a3e9-9f31-4177-8b25-ac8f59286465",
  },
  workstreams: [
    {
      id: "dp",
      name: "Data Platform",
      short: "DP",
      lead: "Patrick Carney + Elias Posen",
      sponsor: "Sarah Cooper",
      thesis:
        "Ingestion + Postgres + ETL for 4 sources (Box, SharePoint, Affinity, Outlook); Phase 2 platform build (backend, UI, audit, deploy).",
      milestones: ["M1 (Wk2, $25k)", "M2 (Wk4, $25k)"],
      matchers: ["data platform", "data-platform"],
    },
    {
      id: "ai",
      name: "AI Agents",
      short: "AI",
      lead: "Patrick Kelly",
      sponsor: "Mo Beldo",
      thesis:
        "Claude Agent SDK + Skills/Flows layer + 21 use-case agents across Network Intelligence, Pulsey, Market Radar services.",
      milestones: ["M3–M6 (Wks 7/9/11/13, $25k each)"],
      matchers: ["ai agents", "agents", "ai-agents"],
    },
    {
      id: "ad",
      name: "Adoption",
      short: "AD",
      lead: "Mo Beldo",
      sponsor: "Mo Beldo",
      thesis:
        "Handover from PoC to Motive AI Platform; firm-wide rollout comms; beta cohort; office hours.",
      milestones: [],
      matchers: ["adoption"],
    },
    {
      id: "gov",
      name: "Governance",
      short: "GOV",
      lead: "Sarah Cooper / Mo Beldo",
      sponsor: "Ramin Kamfar",
      thesis:
        "Kickoff, sign-offs, working sessions, Blocker Protocol, CO tracking.",
      milestones: [],
      matchers: ["governance", "gov"],
    },
  ],
  passwordEnv: "CLIENT_PASSWORD_MOTIVE_OS",
};

export const ENGAGEMENTS: Record<string, Engagement> = {
  wilshire: WILSHIRE,
  "motive-os": MOTIVE_OS,
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
