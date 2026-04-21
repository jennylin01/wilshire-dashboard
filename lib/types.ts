export type RAG = "green" | "amber" | "red";

export type WorkstreamId = "fa" | "srm" | "pm" | "gov";

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

export interface Milestone {
  id: string;
  week: number;
  amount: number;
  label: string;
  status: "in-progress" | "upcoming" | "complete";
  pct: number;
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
  risks: Risk[];
  decisions: Decision[];
  commitments: Commitment[];
  valueMetrics: ValueMetric[];
  lastSync: string;
}
