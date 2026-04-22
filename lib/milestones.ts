import type { Programme } from "./types";

// Programme-level metadata lives here. Milestones themselves now live in the
// Notion Invoice tracker (collection://c60f4f90-ad21-474d-8b42-09270ae3214a)
// and are fetched live — edit them in Notion, not in this file.
export const programme: Programme = {
  name: "Wilshire — AI Acceleration",
  client: "Wilshire Advisors LLC",
  supplier: "Motive Create US, LLC",
  fee: 400, // thousands of dollars; contracted SOW value
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
