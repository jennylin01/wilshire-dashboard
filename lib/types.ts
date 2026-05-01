export type RAG = "green" | "amber" | "red";

// Workstream IDs are engagement-specific. Each engagement declares its own
// set in lib/engagements.ts (e.g. ["fa","srm","pm","gov"] for Wilshire,
// ["dp","ai","ad","gov"] for Motive OS).
export type WorkstreamId = string;

export interface Workstream {
  id: WorkstreamId;
  name: string;
  short: string;
  lead: string;
  sponsor: string;
  rag: RAG;
  committed: number;
  done: number;
  inProgress: number;
  blocked: number;
  thesis: string;
  milestones: string[];
  // Lowercase substrings used to classify Notion rows into this workstream
  // (see mapWorkstreams / mapRisks / mapValueMetrics).
  matchers: string[];
}

export interface Task {
  id: string;
  title: string;
  workstream: string;       // raw Notion select value
  subWorkstream: string;    // raw; empty string if not set
  week: string;             // raw Notion select, e.g. "Week 6 — May 6-12"
  phase: string;
  status: string;           // To Do / In Progress / Done / Blocked
  rag: string;
  scope: string;            // "In scope" | "Stretch"
  owner: string;
  milestone: string;
  notes: string;
}

export interface Risk {
  id: string;
  item: string;
  type: "Risk" | "Assumption" | "Issue" | "Decision";
  severity: "High" | "Medium" | "Low";
  status: string;
  ws: string;
  owner: string;
  mitigation: string;
  target: string | null;
}

export interface Decision {
  id: string;
  item: string;
  status: string;
  owner: string;
  target: string;
  detail: string;
}

export interface Commitment {
  item: string;
  status: string;
  owner: string;
  due: string;
  blocks: string;
}

export interface ValueMetric {
  metric: string;
  ws: string;
  baseline: string;
  target: string;
  status: string;
  confidence: string;
}

export type MilestoneStatus =
  | "Not due"
  | "Due"
  | "Signed off"
  | "Invoice sent"
  | "Paid"
  | "Disputed"
  | "Placeholder";

export interface Milestone {
  id: string;              // e.g. "M1", "M-PM1"
  week: number;            // 1-9; 0 if unparseable
  amount: number;          // dollars; 0 for placeholders
  label: string;           // human title
  status: MilestoneStatus;
  pct: number;             // % of total contract
  workstream: string;
  signOffDate: string | null;
  invoiceSentDate: string | null;
  paidDate: string | null;
}

export interface InvoiceTotals {
  contractedFee: number;   // programme.fee (hardcoded SOW value)
  pipelineSized: number;   // sum of milestones with amount > 0 (excludes placeholders)
  signedOff: number;       // sum where status ∈ {Signed off, Invoice sent, Paid}
  invoicedSent: number;    // sum where status ∈ {Invoice sent, Paid}
  paid: number;            // sum where status = Paid
}

export interface WeeklyDelta {
  // e.g. "Apr 20–26, 2026" — the human-readable week label from Notion
  weekOf: string;
  // Auto-derived from Week start (Monday + 4 = Friday), e.g. "24 April 2026"
  weekEnding: string;
  // The top-line exec message for the week (Notion: Headline)
  headline: string;
  // Engagement week number, 1..N (Notion: Week number)
  weekNumber: number | null;
  // Notion: Summary status
  summary: string;
  // Notion: This week progess (sic — typo in the column name)
  progress: string;
  // Notion: Key risks issues blockers
  risks: string;
  // Notion: Key Decision
  keyDecision: string;
  // Notion: Plan for next week
  plan: string;
  // Notion: RAG select (Red/Amber/Green). null when not explicitly set —
  // dashboard then falls back to deriving from the headline text.
  rag: "Red" | "Amber" | "Green" | null;
  // Notion page id of the chosen row, when one was selected. Absent in
  // empty state. Used by the dashboard inline editor to write changes back.
  pageId?: string;
}

export interface Programme {
  name: string;
  client: string;
  supplier: string;
  fee: number;
  clientSponsor: string;
  workstreamLead: string;
  // Senior contacts surfaced on the masthead. Optional — engagements
  // without a Motive Capital / Motive Create line just hide the row.
  motiveCapital?: string;
  motiveCreate?: string;
  // Override for the masthead subtitle. Defaults to a "{N}-week …"
  // template when not provided.
  subtitle?: string;
  sponsors: string[];
  start: string;
  end: string;
  currentWeek: number;
  totalWeeks: number;
  today: string;
  notionUrl: string;
  // Optional deep-link to the Milestones tracker DB in Notion. Surfaced
  // on the MilestonesStrip section header as an "Open in Notion" affordance.
  milestonesUrl?: string;
  // Optional deep-link to the Weekly delta DB in Notion. Surfaced on the
  // WeeklyDeltaStrip header so users can jump straight to edit the row.
  weeklyDeltaUrl?: string;
  // Optional deep-links surfaced on tiles and section headers via the
  // NotionBadge so users can jump straight to the source DB.
  raidUrl?: string;
  decisionsUrl?: string;
  commitmentsUrl?: string;
  tasksUrl?: string;
  valueTrackingUrl?: string;
}

// Sections of the dashboard that can be conditionally hidden per engagement.
// The dashboard always renders Masthead, TimelineBar, VitalsStrip, Workstreams,
// Risks and Decisions. The sections below are optional and can be hidden
// per engagement via Engagement.hiddenSections.
export type DashboardSection =
  | "weeklyDelta"
  | "milestones"
  | "commitments"
  | "valueTracking";

export interface DashboardData {
  programme: Programme;
  weeklyDelta: WeeklyDelta;
  workstreams: Workstream[];
  milestones: Milestone[];
  invoiceTotals: InvoiceTotals;
  risks: Risk[];
  decisions: Decision[];
  commitments: Commitment[];
  valueMetrics: ValueMetric[];
  tasks: Task[];
  lastSync: string;
  // Sections to hide from rendering (per-engagement config).
  hiddenSections: DashboardSection[];
}
