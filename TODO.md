# Wilshire Dashboard — Build Plan

## Phase 1 — Scaffold & config
- [ ] Move pre-existing files aside (BRIEF, GETTING_STARTED, reference/, .env.local)
- [ ] `create-next-app` with TS + Tailwind + App Router + no src dir
- [ ] Restore files into scaffolded project
- [ ] Install `@notionhq/client` + `lucide-react`
- [ ] `git init` + initial commit

## Phase 2 — Types & config
- [ ] `lib/types.ts` — Workstream, Task, Risk, Decision, Commitment, ValueMetric, Milestone, WeeklyDelta
- [ ] `lib/theme.ts` — light + dark tokens (lifted from reference)
- [ ] `lib/workstreams-config.ts` — static workstream metadata
- [ ] `lib/milestones-config.ts` — SOW milestones M1-M6
- [ ] `lib/weekly-delta.ts` — current Friday-edited config
- [ ] Commit

## Phase 3 — Notion layer
- [ ] `lib/notion.ts` — client, `getTasks`, `getRaid`, `getCommitments`, `getValueMetrics`, `getDecisions`
- [ ] `lib/mappers.ts` — Notion raw → typed objects
- [ ] Wrap each fetch in `unstable_cache` with tag `notion`
- [ ] `app/api/revalidate/route.ts` — manual refresh endpoint
- [ ] Commit

## Phase 4 — App shell + first section wired
- [ ] `app/layout.tsx` — theme provider, fonts (Inter/JetBrains Mono via next/font)
- [ ] `app/page.tsx` — `Promise.all` 5 fetches, render dashboard
- [ ] `components/ui/` — SectionHeader, Pill, KPI, ThemeToggle
- [ ] `components/dashboard/Masthead.tsx`
- [ ] `components/dashboard/TimelineBar.tsx`
- [ ] `components/dashboard/WeeklyDeltaStrip.tsx` (static first)
- [ ] `components/dashboard/WorkstreamsGrid.tsx` — wired to live Tasks
- [ ] `npm run dev` — show real data on Workstreams
- [ ] Commit + **HAND OFF TO JENNY FOR VERIFICATION**

## Phase 5 (deferred — not in this session)
- VitalsStrip, MilestonesStrip, RAID list, Decisions panel, Commitments, Value, DetailPanel + all detail views, README, Vercel deploy
