import type { Milestone, Programme } from "./types";

// Hardcoded from the SOW. Source of truth is the signed statement of work.
export const milestones: Milestone[] = [
  { id: "M1", week: 1, amount: 80, label: "Mobilisation complete", status: "in-progress", pct: 20 },
  { id: "M2", week: 4, amount: 60, label: "F&A end-to-end demo", status: "upcoming", pct: 15 },
  { id: "M3", week: 5, amount: 80, label: "F&A UAT + measurement report", status: "upcoming", pct: 20 },
  { id: "M4", week: 4, amount: 40, label: "S&RM gap report walkthrough", status: "upcoming", pct: 10 },
  { id: "M5", week: 7, amount: 80, label: "S&RM UAT + final gap report", status: "upcoming", pct: 20 },
  { id: "M6", week: 8, amount: 60, label: "Final acceptance + prod readiness", status: "upcoming", pct: 15 },
];

export const programme: Programme = {
  name: "Wilshire — AI Acceleration",
  client: "Wilshire Advisors LLC",
  supplier: "Motive Create US, LLC",
  fee: 400,
  clientSponsor: "Hanna Valva (CTO)",
  workstreamLead: "Mo Beldo",
  sponsors: ["Christina Walsh, CFO", "Todd Kessler, CRO", "Leah Emkin, OCIO"],
  start: "Apr 20, 2026",
  end: "Jun 21, 2026",
  currentWeek: 1,
  totalWeeks: 9,
  today: new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  notionUrl: "https://www.notion.so/3485e123a435810ab817edd0326ff7ab",
};
