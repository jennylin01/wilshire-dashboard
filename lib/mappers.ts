import type { WorkstreamDef } from "./engagements";
import type {
  Commitment,
  Decision,
  InvoiceTotals,
  Milestone,
  MilestoneStatus,
  RAG,
  Risk,
  Task,
  ValueMetric,
  WeeklyDelta,
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

// Classify a raw Notion Workstream select value into one of the engagement's
// declared workstream IDs using the `matchers` substrings. Returns null if
// no matcher hits. Longer matchers win over shorter ones to avoid e.g.
// "Governance" being misclassified as "gov" when there's a more specific
// match available.
function classifyWorkstream(
  raw: string,
  defs: WorkstreamDef[]
): WorkstreamId | null {
  const s = raw.toLowerCase();
  if (!s) return null;
  let best: { id: WorkstreamId; len: number } | null = null;
  for (const def of defs) {
    for (const m of def.matchers) {
      if (s.includes(m.toLowerCase())) {
        if (!best || m.length > best.len) {
          best = { id: def.id, len: m.length };
        }
      }
    }
  }
  return best?.id ?? null;
}

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

export function mapWorkstreams(
  rawTasks: unknown[],
  defs: WorkstreamDef[]
): Workstream[] {
  // Seed one entry per declared workstream so cards appear even if empty.
  const acc: Record<WorkstreamId, Workstream> = {};
  const worstRag: Record<WorkstreamId, RAG | null> = {};
  for (const def of defs) {
    acc[def.id] = {
      id: def.id,
      name: def.name,
      short: def.short,
      lead: def.lead,
      sponsor: def.sponsor,
      thesis: def.thesis,
      milestones: def.milestones,
      matchers: def.matchers,
      rag: "green",
      committed: 0,
      done: 0,
      inProgress: 0,
      blocked: 0,
    };
    worstRag[def.id] = null;
  }

  for (const page of rawTasks) {
    const props = safeProps(page);
    const wsRaw = readSelect(props["Workstream"]);
    const wsId = classifyWorkstream(wsRaw, defs);
    if (!wsId || !acc[wsId]) continue;

    const status = readSelect(props["Status"]).toLowerCase();
    const rag = ragFromSelect(readSelect(props["RAG"]));

    const ws = acc[wsId];
    ws.committed += 1;

    if (status.includes("done") || status.includes("complete")) {
      ws.done += 1;
    } else {
      // Only count RAG for non-done tasks.
      if (rag) worstRag[wsId] = worseRag(worstRag[wsId], rag);
    }
    if (status.includes("progress")) ws.inProgress += 1;
    if (status.includes("block")) ws.blocked += 1;
  }

  // Apply worst-RAG; default green if none observed.
  for (const def of defs) {
    acc[def.id].rag = worstRag[def.id] ?? "green";
  }

  // Preserve the engagement's declared order.
  return defs.map((d) => acc[d.id]);
}

// ----- Tasks → flat list (for workstream drill-down) -----

export function mapTasks(rawTasks: unknown[]): Task[] {
  const out: Task[] = [];
  for (const page of rawTasks) {
    const p = page as { id?: string };
    const props = safeProps(page);
    const title = readTitle(props["Task"]);
    if (!title) continue;
    out.push({
      id: p.id ?? title,
      title,
      workstream: readSelect(props["Workstream"]),
      subWorkstream: readSelect(props["Sub-workstream"]),
      week: readSelect(props["Week"]),
      phase: readSelect(props["Phase"]),
      status: readSelect(props["Status"]) || "To Do",
      rag: readSelect(props["RAG"]) || "Green",
      scope: readSelect(props["Scope"]) || "In scope",
      owner: readRichText(props["Owner"]),
      milestone: readRichText(props["Milestone"]),
      notes: readRichText(props["Notes"]),
    });
  }
  return out;
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

export function mapValueMetrics(
  raw: unknown[],
  defs: WorkstreamDef[]
): ValueMetric[] {
  const shortById = new Map(defs.map((d) => [d.id, d.short]));
  const out: ValueMetric[] = [];
  for (const page of raw) {
    const props = safeProps(page);
    const metric = readTitle(props["Metric"]);
    if (!metric) continue;
    const wsRaw = readSelect(props["Workstream"]);
    const wsId = classifyWorkstream(wsRaw, defs);
    const short = wsId ? shortById.get(wsId) ?? wsRaw : wsRaw;
    // Accept either "Baseline (Wk1)" (Wilshire legacy) or "Baseline (start)"
    // (Motive OS) as the baseline field. Same for Target.
    const baseline =
      readRichText(props["Baseline (Wk1)"]) ||
      readRichText(props["Baseline (start)"]) ||
      "TBV";
    const target =
      readRichText(props["Target (Wk8)"]) ||
      readRichText(props["Target (end)"]) ||
      "TBV";
    out.push({
      metric,
      ws: short,
      baseline,
      target,
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

// "Wk 1 — May 11-17" or "Week 1 — Apr 20-26" → 1. "Ongoing" / unknown → 0.
function parseWeekDue(raw: string): number {
  const m = raw.match(/(?:Wk|Week)\s+(\d+)/i);
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

export function mapMilestones(
  rawInvoices: unknown[],
  contractedFee = 0
): Milestone[] {
  const out: Milestone[] = [];
  for (const page of rawInvoices) {
    const props = safeProps(page);
    const titleRaw = readTitle(props["Milestone"]);
    if (!titleRaw) continue;
    const { id, label } = parseMilestoneTitle(titleRaw);
    const week = parseWeekDue(readSelect(props["Week due"]));
    const pct = readNumber(props["% of total"]) ?? 0;
    const rawAmount = readNumber(props["Amount"]);
    // If Notion row has no Amount but does have % of total, derive $ from the
    // contracted fee so the milestone still shows a business-case number.
    const amount =
      rawAmount != null && rawAmount > 0
        ? rawAmount
        : pct > 0 && contractedFee > 0
          ? Math.round((pct / 100) * contractedFee)
          : 0;
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

// ----- Weekly delta (Notion-backed) -----

// Fallback shown if Notion has no weeks populated.
const EMPTY_WEEKLY_DELTA: WeeklyDelta = {
  weekOf: "—",
  weekEnding: "—",
  headline: "",
  weekNumber: null,
  summary: "No weekly update yet — add a row to the Weekly delta database in Notion.",
  progress: "",
  risks: "",
  keyDecision: "",
  plan: "",
};

// Derive the week-ending Friday from a Monday (Week start). Returns
// e.g. "24 April 2026". Falls back to the input ISO string on parse fail.
function formatWeekEnding(startISO: string | null): string {
  if (!startISO) return "—";
  const d = new Date(startISO);
  if (isNaN(d.getTime())) return startISO;
  d.setUTCDate(d.getUTCDate() + 4);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function mapWeeklyDelta(
  rawWeeks: unknown[],
  // The changes DB is no longer rendered, but we keep the parameter so
  // load-data.ts callers don't break and Notion data stays intact.
  _rawChanges: unknown[],
  today: Date = new Date()
): WeeklyDelta {
  if (!rawWeeks.length) return EMPTY_WEEKLY_DELTA;

  // Pick the week with the latest Week start ≤ today. If none qualify
  // (e.g. future-dated only), fall back to the earliest week.
  type ParsedWeek = {
    id: string;
    weekOf: string;
    startISO: string | null;
    headline: string;
    weekNumber: number | null;
    summary: string;
    progress: string;
    risks: string;
    keyDecision: string;
    plan: string;
    startMs: number;
  };
  const weeks: ParsedWeek[] = [];
  for (const page of rawWeeks) {
    const p = page as { id?: string };
    const props = safeProps(page);
    const weekOf = readTitle(props["Week of"]);
    const startISO = readDate(props["Week start"]);
    if (!weekOf) continue;
    const startMs = startISO ? new Date(startISO).getTime() : NaN;
    weeks.push({
      id: p.id ?? weekOf,
      weekOf,
      startISO,
      headline: readRichText(props["Headline"]),
      weekNumber: readNumber(props["Week number"]),
      summary: readRichText(props["Summary status"]),
      // Column name in Notion has a typo ("progess"); read it verbatim.
      progress: readRichText(props["This week progess"]),
      risks: readRichText(props["Key risks issues blockers"]),
      // Column name in Notion has a trailing space ("Key Decision ").
      keyDecision:
        readRichText(props["Key Decision "]) ||
        readRichText(props["Key Decision"]),
      // Column was renamed from "Plan for next period" → "Plan for next week".
      plan:
        readRichText(props["Plan for next week"]) ||
        readRichText(props["Plan for next period"]),
      startMs: isNaN(startMs) ? 0 : startMs,
    });
  }
  if (!weeks.length) return EMPTY_WEEKLY_DELTA;

  const todayMs = today.getTime();
  const eligible = weeks
    .filter((w) => w.startMs <= todayMs)
    .sort((a, b) => b.startMs - a.startMs);
  // No fallback to future weeks: showing a forecasted week as "this week"
  // is misleading pre-engagement. Return the empty state instead.
  const chosen = eligible[0];
  if (!chosen) return EMPTY_WEEKLY_DELTA;

  return {
    weekOf: chosen.weekOf,
    weekEnding: formatWeekEnding(chosen.startISO),
    headline: chosen.headline,
    weekNumber: chosen.weekNumber,
    summary: chosen.summary,
    progress: chosen.progress,
    risks: chosen.risks,
    keyDecision: chosen.keyDecision,
    plan: chosen.plan,
    pageId: chosen.id,
  };
}

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
