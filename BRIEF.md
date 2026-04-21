# Wilshire AI Acceleration — Dashboard Build Brief

## Context
A 9-week, $400k fixed-fee engagement between Motive Create US, LLC and Wilshire Advisors LLC (Apr 20 – Jun 21, 2026). The dashboard is a leadership at-a-glance view over the Notion workspace that the delivery team updates daily.

- **Audience:** Sponsors (Christina Walsh CFO, Todd Kessler CRO, Leah Emkin OCIO), client PM (Hanna Valva CTO), Motive leadership (Jenny, Andy, Chris)
- **Purpose:** 30-second read on engagement health; drill-through for detail
- **Cadence:** Leadership checks weekly; Motive team references in Thursday Hanna syncs

## Starting point
A working single-file React artifact exists at `./reference/wilshire-dashboard.jsx` (from the prototyping phase). Use it as the design and logic reference. Do NOT copy verbatim — refactor into proper Next.js + TypeScript components with the structure below.

## Stack
- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS
- `@notionhq/client` for Notion API
- Deploy target: Vercel
- Light/dark theme toggle (persisted to localStorage)

## Structure
```
app/
  page.tsx                   # server component, fetches data, renders dashboard
  layout.tsx                 # theme provider, font imports (Aptos fallback: Inter)
  api/notion/route.ts        # optional: client-side revalidation endpoint
lib/
  notion.ts                  # typed Notion client, data source queries
  mappers.ts                 # Notion → dashboard shape
  types.ts                   # Workstream, Risk, Commitment, Milestone, ValueMetric, Decision, WeeklyDelta
  theme.ts                   # light/dark color tokens (lifted from reference)
components/
  dashboard/
    Masthead.tsx
    TimelineBar.tsx
    WeeklyDeltaStrip.tsx     # "This week" — THE most important section
    VitalsStrip.tsx
    WorkstreamsGrid.tsx
    MilestonesStrip.tsx
    RiskList.tsx
    DecisionsPanel.tsx
    CommitmentsSummary.tsx
    ValueTrackingSummary.tsx
    DetailPanel.tsx          # generic side-panel, receives children
    details/                 # one file per detail type: WorkstreamDetail, RiskDetail, etc.
  ui/
    Pill.tsx
    KPI.tsx
    SectionHeader.tsx
    ThemeToggle.tsx
```

## Notion data model (live — already exists)
Root page: https://www.notion.so/3485e123a435810ab817edd0326ff7ab

Six data sources, with these collection IDs:

| Database | Data Source ID |
|---|---|
| Tasks | cc5a7172-0133-419f-b1d2-3587e804ee6b |
| RAID log | 3c657330-bcb7-4933-abc2-eca38274b7b4 |
| Client commitments | 57e9fb3b-e3dd-40f0-bb47-9e29b10aef80 |
| Value tracking | 46977b20-a8cd-4a8c-bd28-fbceaf6becbd |
| Meetings & Decisions | 8ab0d80e-7a93-42fb-ac36-164dc002824d |
| Invoice tracker | c60f4f90-ad21-474d-8b42-09270ae3214a |

Key property names (use exactly — case and spacing matter for the Notion API):

**Tasks**: Task (title), Workstream (select), RAG (select), Status (select), Phase (select), Week (select), Owner (text), Milestone (text), Depends on (relation), Blocks (relation), Notes (text)

**RAID log**: Item (title), Type (select: Risk/Assumption/Issue/Decision), Severity (select: High/Medium/Low), Status (select: Open/Mitigating/Closed/Accepted/Pending decision), Workstream (select), Owner (text), Category (text), Description (text), Mitigation / decision detail (text), Raised (date), Target resolution (date), Linked task (relation)

**Client commitments**: Commitment (title), Status (select: Not started/In progress/Delivered/Late/Blocked/Accepted delay), Category (select), Wilshire owner (text), Motive counterpart (text), Week due (select), Committed date (date), Blocks (impact if late) (text), SOW reference (text), Notes (text)

**Value tracking**: Metric (title), Metric type (select), Workstream (select), Baseline (Wk1) (text), Current reading (text), Target (Wk8) (text), Unit (select), Status (select: Not started/Baseline captured/On track/At risk/Off track/Hit), Confidence in claim (select: High/Medium/Low/TBV), Measurement cadence (select), Source of data (text), Last measured (date)

## Mapping rules
- Workstream aggregation (the 4 cards on the dashboard) is derived from Tasks grouped by `Workstream`. Compute: total tasks, done, in-progress, blocked. RAG = worst RAG of any non-Done task in that workstream.
- Milestones are hardcoded from the SOW (M1-M6 with weeks and amounts). See `reference/wilshire-dashboard.jsx` for the canonical list.
- `WeeklyDelta` (the "This week" strip) is NOT from Notion — it's a separate config file (`lib/weekly-delta.ts`) updated manually each Friday. Keep the structure: headline string + array of {direction: 'up'|'down'|'flat', label, detail}.

## Caching
- Server component fetches data on every request, but wraps Notion calls in `unstable_cache` with 60-second TTL and `revalidate` tags.
- Add a manual "refresh" button (top right) that calls `revalidateTag('notion')`.

## Design system
Lift the theme object (light + dark) verbatim from the reference file. Key tokens:
- Light bg: `#ffffff`, ink: `#0a0a0a`, Motive blue: `#1e40af`, rule: `#e5e5e5`
- Dark bg: `#0a0a0a`, ink: `#ffffff`, Motive blue: `#3b82f6`, rule: `#2a2a2a`
- RAG: green `#047857`/`#10b981`, amber `#b45309`/`#d97706`, red `#b91c1c`/`#dc2626`
- Fonts: Aptos (brand) with Inter fallback for body, JetBrains Mono for data/IDs

## Required features (from reference artifact)
1. Masthead: programme title, client/supplier, fee, PM, lead
2. Programme timeline bar (9 weeks with milestone markers M1-M6)
3. Weekly delta strip (manually edited config, updated Fridays) — THIS IS THE MOST IMPORTANT COMPONENT
4. Vitals strip: 5 KPIs (Overall RAG, High-sev risks, Late commitments, Pending decisions, Invoice pipeline)
5. Workstreams grid (4 cards, clickable → detail panel)
6. Milestones strip (6 milestones horizontal, clickable → detail panel)
7. RAID list (top 6 by severity, clickable → detail panel)
8. Decisions pending panel (clickable → full decisions log)
9. Commitments summary (click → full commitments list)
10. Value tracking summary (click → full metrics list)
11. Light/dark theme toggle (persisted)
12. Each detail panel has a deep-link back to the relevant Notion page

## Acceptance criteria
- Build runs cleanly: `pnpm build` (or `npm run build`) with zero errors
- `pnpm dev` renders the dashboard at localhost:3000 with live Notion data
- Setting `NOTION_TOKEN=xxx` in `.env.local` is the only config needed
- README has: setup, deploy to Vercel instructions, how to update the weekly delta
- TypeScript strict mode, no `any` types
- Zero data hardcoded from Notion — only milestones (from SOW) and weekly delta (manual) are static

## Non-goals (don't do these, yet)
- No auth — private Vercel URL with password protection is enough
- No write-back to Notion (read-only)
- No realtime — 60s cache is fine
- No mobile-specific design — desktop-first, responsive to laptop
- No testing suite — ship first, test later

## First steps (Claude Code, start here)
1. Scaffold: `npx create-next-app@latest wilshire-dashboard --typescript --tailwind --app --no-src-dir`
2. Install: `@notionhq/client`, `lucide-react`
3. Set up `lib/types.ts` based on the schemas above
4. Build `lib/notion.ts` with one function per data source (getWorkstreams, getRisks, etc.)
5. Build `lib/mappers.ts` that transforms raw Notion → typed dashboard objects
6. Wire `app/page.tsx` to call all six fetches in parallel via `Promise.all`, then render
7. Port components one at a time from the reference file, starting with WeeklyDeltaStrip
