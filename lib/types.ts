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
  weekOf: string;
  headline: string;
  changes: {
    direction: "up" | "down" | "flat";
    label: string;
    detail: string;
  }[];
}

export interface Programme {
  name: string;
  client: string;
  supplier: string;
  fee: number;
  clientSponsor: string;
  workstreamLead: string;
  sponsors: string[];
  start: string;
  end: string;
  currentWeek: number;
  totalWeeks: number;
  today: string;
  notionUrl: string;
}

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
  lastSync: string;
}
