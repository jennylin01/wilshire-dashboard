import type {
  Commitment,
  Decision,
  InvoiceTotals,
  Milestone,
  MilestoneStatus,
  RAG,
  Risk,
  ValueMetric,
  Workstream,
  WorkstreamId,
} from "./types";

// ----- generic property readers -----

type Prop = Record<string, unknown>;
type NotionPage = { id: string; properties: Record<string, Prop> };

const readTitle = (p: Prop | undefined): string => {
  if (!p || p.type !== "title") return "";
  const arr = (p as { title?: { plain_text?: string }[] }).title ?? [];
  return arr.map((t) => t.plain_text ?? "").join("").trim();
};

const readRichText = (p: Prop | undefined): string => {
  if (!p) return "";
  if (p.type === "rich_text") {
    const arr =
      (p as { rich_text?: { plain_text?: string }[] }).rich_text ?? [];
    return arr.map((t) => t.plain_text ?? "").join("").trim();
  }
  if (p.type === "title") return readTitle(p);
  return "";
};

const readSelect = (p: Prop | undefined): string => {
  if (!p || p.type !== "select") return "";
  const s = (p as { select?: { name?: string } | null }).select;
  return s?.name ?? "";
};

const readDate = (p: Prop | undefined): string | null => {
  if (!p || p.type !== "date") return null;
  const d = (p as { date?: { start?: string } | null }).date;
  return d?.start ?? null;
};

const readNumber = (p: Prop | undefined): number | null => {
  if (!p || p.type !== "number") return null;
  const v = (p as { number?: number | null }).number;
  return typeof v === "number" ? v : null;
};

const readRelation = (p: Prop | undefined): string[] => {
  if (!p || p.type !== "relation") return [];
  const arr = (p as { relation?: { id: string }[] }).relation ?? [];
  return arr.map((r) => r.id);
};

const safeProps = (page: unknown): Record<string, Prop> => {
  const p = page as NotionPage;
  return p?.properties ?? {};
};

// ----- Tasks → Workstreams aggregation -----

// The Workstream select in Tasks uses full names; we map them to the
// 4 workstream cards that appear on the dashboard.
const WORKSTREAM_META: Record<
  WorkstreamId,
  Pick<Workstream, "id" | "name" | "short" | "lead" | "sponsor" | "thesis" | "milestones">
> = {
  fa: {
    id: "fa",
    name: "Finance & accounting",
    short: "F&A",
    lead: "Mo Beldo",
    sponsor: "Christina Walsh",
    thesis:
      "AP automation — email routing, doc intelligence, mismatch detection, query auto-response.",
    milestones: ["M2 (Wk4)", "M3 (Wk5)"],
  },
  srm: {
    id: "srm",
    name: "Sales & revenue management",
    short: "S&RM",
    lead: "Mo Beldo",
    sponsor: "Todd Kessler",
    thesis:
      "Salesforce gap report, duplicate resolution, Accordion data mart integration.",
    milestones: ["M4 (Wk4)", "M5 (Wk7)"],
  },
  pm: {
    id: "pm",
    name: "E2E investment mgmt — private market",
    short: "PM",
    lead: "Mo Beldo",
    sponsor: "Mark P",
    thesis:
      "Workflow reimagination — placeholder milestones pending Mark P sign-off (Apr 22).",
    milestones: ["M-PM1/2/3 — TBD"],
  },
  gov: {
    id: "gov",
    name: "Governance",
    short: "GOV",
    lead: "Motive Create PM",
    sponsor: "Hanna Valva",
    thesis:
      "Mobilisation, governance rhythm, status reporting, change control.",
    milestones: ["M1 (Wk1)", "M6 (Wk8)"],
  },
};

// Map the raw Workstream select name → our workstream id.
// Notion values may be the long form ("Finance & accounting") or the short
// code ("F&A"). Both are accepted.
const classifyWorkstream = (raw: string): WorkstreamId | null => {
  const s = raw.toLowerCase();
  if (!s) return null;
  if (s.includes("f&a") || s.includes("finance")) return "fa";
  if (s.includes("s&rm") || s.includes("sales")) return "srm";
  if (s.includes("pm") || s.includes("investment mgmt") || s.includes("private market"))
    return "pm";
  if (s.includes("gov")) return "gov";
  return null;
};

const ragFromSelect = (raw: string): RAG | null => {
  const s = raw.toLowerCase();
  if (s.startsWith("g")) return "green";
  if (s.startsWith("a") || s.startsWith("y")) return "amber";
  if (s.startsWith("r")) return "red";
  return null;
};

const worseRag = (a: RAG | null, b: RAG | null): RAG | null => {
  const order: Record<RAG, number> = { green: 0, amber: 1, red: 2 };
  if (!a) return b;
  if (!b) return a;
  return order[b] > order[a] ? b : a;
};

export function mapWorkstreams(rawTasks: unknown[]): Workstream[] {
  // Seed all 4 workstreams so they appear even if empty.
  const acc: Record<WorkstreamId, Workstream> = {
    fa: { ...WORKSTREAM_META.fa, rag: "green", committed: 0, done: 0, inProgress: 0, blocked: 0 },
    srm: { ...WORKSTREAM_META.srm, rag: "green", committed: 0, done: 0, inProgress: 0, blocked: 0 },
    pm: { ...WORKSTREAM_META.pm, rag: "green", committed: 0, done: 0, inProgress: 0, blocked: 0 },
    gov: { ...WORKSTREAM_META.gov, rag: "green", committed: 0, done: 0, inProgress: 0, blocked: 0 },
  };
  const worstRag: Record<WorkstreamId, RAG | null> = {
    fa: null, srm: null, pm: null, gov: null,
  };

  for (const page of rawTasks) {
    const props = safeProps(page);
    const wsRaw = readSelect(props["Workstream"]);
    const wsId = classifyWorkstream(wsRaw);
    if (!wsId) continue;

    const status = readSelect(props["Status"]).toLowerCase();
    const rag = ragFromSelect(readSelect(props["RAG"]));

    const ws = acc[wsId];
    ws.committed += 1;

    if (status.includes("done") || status.includes("complete")) {
      ws.done += 1;
    } else {
      // Only count RAG for non-done tasks, per BRIEF spec.
      if (rag) worstRag[wsId] = worseRag(worstRag[wsId], rag);
    }
    if (status.includes("progress")) ws.inProgress += 1;
    if (status.includes("block")) ws.blocked += 1;
  }

  // Apply worst-RAG; default green if none observed.
  (Object.keys(acc) as WorkstreamId[]).forEach((id) => {
    acc[id].rag = worstRag[id] ?? "green";
  });

  return [acc.fa, acc.srm, acc.pm, acc.gov];
}

// ----- RAID → Risks + Decisions -----

export function mapRisks(rawRaid: unknown[]): Risk[] {
  const out: Risk[] = [];
  for (const page of rawRaid) {
    const props = safeProps(page);
    const type = readSelect(props["Type"]);
    if (type === "Decision") continue; // handled separately
    const severity = readSelect(props["Severity"]) || "Medium";
    const status = readSelect(props["Status"]) || "Open";
    const item = readTitle(props["Item"]);
    if (!item) continue;
    out.push({
      id: (page as { id?: string }).id ?? item,
      item,
      type: (type as Risk["type"]) || "Risk",
      severity: (severity as Risk["severity"]),
      status,
      ws: readSelect(props["Workstream"]) || "",
      owner: readRichText(props["Owner"]),
      mitigation:
        readRichText(props["Mitigation / decision detail"]) ||
        readRichText(props["Description"]) ||
        "",
      target: readDate(props["Target resolution"]),
    });
  }

  // Sort: High first, then Medium, then Low; open before closed.
  const sev: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
  const isClosed = (s: string) => s.toLowerCase() === "closed";
  out.sort((a, b) => {
    const cA = isClosed(a.status) ? 1 : 0;
    const cB = isClosed(b.status) ? 1 : 0;
    if (cA !== cB) return cA - cB;
    return (sev[a.severity] ?? 9) - (sev[b.severity] ?? 9);
  });
  return out;
}

export function mapDecisions(rawRaid: unknown[]): Decision[] {
  const out: Decision[] = [];
  for (const page of rawRaid) {
    const props = safeProps(page);
    const type = readSelect(props["Type"]);
    if (type !== "Decision") continue;
    const item = readTitle(props["Item"]);
    if (!item) continue;
    out.push({
      id: (page as { id?: string }).id ?? item,
      item,
      status: readSelect(props["Status"]) || "Pending decision",
      owner: readRichText(props["Owner"]),
      target: readDate(props["Target resolution"]) ?? "",
      detail:
        readRichText(props["Mitigation / decision detail"]) ||
        readRichText(props["Description"]) ||
        "",
    });
  }
  // Pending first, then by target date asc.
  out.sort((a, b) => {
    const pA = a.status === "Pending decision" ? 0 : 1;
    const pB = b.status === "Pending decision" ? 0 : 1;
    if (pA !== pB) return pA - pB;
    return (a.target || "").localeCompare(b.target || "");
  });
  return out;
}

// ----- Client commitments -----

const formatDueDate = (isoOrSelect: string, selectFallback: string): string => {
  if (isoOrSelect) {
    const d = new Date(isoOrSelect);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  }
  return selectFallback;
};

export function mapCommitments(raw: unknown[]): Commitment[] {
  const out: Commitment[] = [];
  for (const page of raw) {
    const props = safeProps(page);
    const item = readTitle(props["Commitment"]);
    if (!item) continue;
    const committedISO = readDate(props["Committed date"]) ?? "";
    const weekDue = readSelect(props["Week due"]);
    const owner =
      readRichText(props["Wilshire owner"]) ||
      readRichText(props["Motive counterpart"]);
    out.push({
      item,
      status: readSelect(props["Status"]) || "Not started",
      owner,
      due: formatDueDate(committedISO, weekDue),
      blocks:
        readRichText(props["Blocks (impact if late)"]) ||
        readRichText(props["Notes"]) ||
        "",
    });
  }
  // Late first, then Not started, then others.
  const order: Record<string, number> = {
    Late: 0,
    "Not started": 1,
    Blocked: 2,
    "In progress": 3,
    "Accepted delay": 4,
    Delivered: 5,
  };
  out.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
  return out;
}

// ----- Value tracking -----

export function mapValueMetrics(raw: unknown[]): ValueMetric[] {
  const out: ValueMetric[] = [];
  for (const page of raw) {
    const props = safeProps(page);
    const metric = readTitle(props["Metric"]);
    if (!metric) continue;
    const wsRaw = readSelect(props["Workstream"]);
    const wsId = classifyWorkstream(wsRaw);
    const short = wsId ? WORKSTREAM_META[wsId].short : wsRaw;
    out.push({
      metric,
      ws: short,
      baseline: readRichText(props["Baseline (Wk1)"]) || "TBV",
      target: readRichText(props["Target (Wk8)"]) || "TBV",
      status: readSelect(props["Status"]) || "Not started",
      confidence: readSelect(props["Confidence in claim"]) || "TBV",
    });
  }
  return out;
}

// ----- Invoice tracker → Milestones -----

// Titles look like "M1 — Mobilisation complete" or
// "M-PM1 — PM Sprint 1 demo [PLACEHOLDER]". Extract the prefix id + clean label.
function parseMilestoneTitle(title: string): { id: string; label: string } {
  const m = title.match(/^([MC][-A-Za-z0-9]*)\s*[—–-]\s*(.+)$/);
  if (m) {
    const [, id, rest] = m;
    const label = rest.replace(/\s*\[PLACEHOLDER\]\s*$/i, "").trim();
    return { id, label };
  }
  return { id: title.split(/\s+/)[0] || "M?", label: title };
}

// "Week 1 — Apr 20-26" → 1. "Ongoing" / unknown → 0.
function parseWeekDue(raw: string): number {
  const m = raw.match(/Week\s+(\d+)/i);
  return m ? parseInt(m[1], 10) : 0;
}

const MILESTONE_STATUSES: readonly MilestoneStatus[] = [
  "Not due",
  "Due",
  "Signed off",
  "Invoice sent",
  "Paid",
  "Disputed",
  "Placeholder",
];

function normalizeStatus(raw: string): MilestoneStatus {
  const match = MILESTONE_STATUSES.find(
    (s) => s.toLowerCase() === raw.toLowerCase()
  );
  return match ?? "Not due";
}

export function mapMilestones(rawInvoices: unknown[]): Milestone[] {
  const out: Milestone[] = [];
  for (const page of rawInvoices) {
    const props = safeProps(page);
    const titleRaw = readTitle(props["Milestone"]);
    if (!titleRaw) continue;
    const { id, label } = parseMilestoneTitle(titleRaw);
    const week = parseWeekDue(readSelect(props["Week due"]));
    const amount = readNumber(props["Amount"]) ?? 0;
    const pct = readNumber(props["% of total"]) ?? 0;
    const status = normalizeStatus(readSelect(props["Status"]));
    out.push({
      id,
      week,
      amount,
      label,
      status,
      pct,
      workstream: readSelect(props["Workstream"]) || "",
      signOffDate: readDate(props["Sign-off date"]),
      invoiceSentDate: readDate(props["Invoice sent date"]),
      paidDate: readDate(props["Paid date"]),
    });
  }
  // Sort by week ascending; within a week, by amount descending (bigger first).
  out.sort((a, b) => a.week - b.week || b.amount - a.amount);
  return out;
}

// ----- Invoice totals (derived from milestones) -----

const INVOICED_SIGNED: MilestoneStatus[] = [
  "Signed off",
  "Invoice sent",
  "Paid",
];
const INVOICED_SENT: MilestoneStatus[] = ["Invoice sent", "Paid"];

export function computeInvoiceTotals(
  milestones: Milestone[],
  contractedFee: number
): InvoiceTotals {
  const sumWhere = (pred: (m: Milestone) => boolean) =>
    milestones.filter(pred).reduce((s, m) => s + m.amount, 0);
  return {
    contractedFee,
    pipelineSized: sumWhere((m) => m.status !== "Placeholder" && m.amount > 0),
    signedOff: sumWhere((m) => INVOICED_SIGNED.includes(m.status)),
    invoicedSent: sumWhere((m) => INVOICED_SENT.includes(m.status)),
    paid: sumWhere((m) => m.status === "Paid"),
  };
}
