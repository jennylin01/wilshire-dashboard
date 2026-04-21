# Wilshire — AI Acceleration Dashboard

Leadership-facing status dashboard for the Motive Create × Wilshire Advisors 9-week engagement. Reads live from the shared Notion workspace (Tasks, RAID, Client commitments, Value tracking) and presents a 30-second read on engagement health with drill-through detail panels.

Built on Next.js 14 (App Router) + TypeScript + Tailwind + `@notionhq/client`.

---

## Local setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local from the template
cp .env.example .env.local
# then edit .env.local and fill in:
#   NOTION_TOKEN        — from https://www.notion.so/profile/integrations
#                         (the integration must be connected to the root
#                         Wilshire page — Share menu → Connections)
#   DASHBOARD_PASSWORD  — any string; this is the password you'll share
#                         with sponsors (username is always "wilshire")

# 3. Run locally
npm run dev
# → http://localhost:3000  (browser will show a Basic Auth dialog)
```

Two required env vars: `NOTION_TOKEN` and `DASHBOARD_PASSWORD`. Everything else (data source IDs, milestones, programme metadata) is committed in `lib/`.

---

## Project structure

```
app/
  layout.tsx                  # ThemeProvider + fonts
  page.tsx                    # server component: parallel Notion fetch → <Dashboard />
  api/revalidate/route.ts     # POST → revalidateTag('notion')
  globals.css                 # Tailwind base + body font
lib/
  notion.ts                   # typed Notion client with 60s unstable_cache per data source
  mappers.ts                  # raw Notion pages → typed dashboard objects
  types.ts                    # DashboardData, Workstream, Risk, Decision, Commitment, ValueMetric...
  theme.ts                    # light + dark tokens, fontStack, ragColor helpers
  milestones.ts               # hardcoded SOW milestones + programme metadata
  weekly-delta.ts             # MANUAL — edit this every Friday (see below)
components/
  ThemeProvider.tsx           # client context, persists mode to localStorage
  ui/                         # Pill, KPI, SectionHeader, ThemeToggle
  dashboard/
    Dashboard.tsx             # orchestrator (holds detail-panel state)
    Masthead.tsx              # programme title, fee, PM, lead
    TimelineBar.tsx           # 9-week bar with milestone markers
    WeeklyDeltaStrip.tsx      # THE most important section — edit lib/weekly-delta.ts
    VitalsStrip.tsx           # 5 KPIs
    WorkstreamsGrid.tsx       # 4 cards, clickable → detail panel
    MilestonesStrip.tsx       # 6 milestones horizontal
    RiskList.tsx              # top 6 RAID items
    DecisionsPanel.tsx        # pending decisions preview
    CommitmentsSummary.tsx    # commitment totals + top hot items
    ValueTrackingSummary.tsx  # metric totals + headline targets
    DetailPanel.tsx           # generic side-panel shell
    details/                  # one file per detail type
```

---

## Updating the weekly delta

The "This week" strip is the single most important piece of the page. It's intentionally *not* pulled from Notion — it's a curated narrative edited by the PM every Friday.

1. Open [`lib/weekly-delta.ts`](lib/weekly-delta.ts)
2. Update `weekOf`, `headline`, and the `changes` array.
3. Commit & push to `main` — Render redeploys in ~90s.

Each change has:

- `direction`: `"up"` = progress, `"down"` = concern, `"flat"` = FYI / status quo
- `label`: short headline
- `detail`: one-line context — what it blocks, or what happens next

Keep it to 3–5 items. More than that and it stops being a highlight reel.

---

## How data flows

1. `app/page.tsx` is a server component. It calls four Notion data-source fetches in parallel (`Tasks`, `RAID`, `Commitments`, `Value tracking`).
2. Each fetch is wrapped in `unstable_cache` with a 60-second TTL and the `notion` tag.
3. Raw Notion pages are normalised by `lib/mappers.ts` into typed dashboard objects.
4. The server hands a single `DashboardData` object to `<Dashboard />` (client component).
5. `<Dashboard />` holds the detail-panel state and routes clicks into the right `details/*Detail.tsx` renderer.

The refresh button in the top nav `POST`s to `/api/revalidate`, which runs `revalidateTag("notion")` and then `router.refresh()` — this busts the cache and re-renders.

---

## Notion data model

Root page: <https://www.notion.so/3485e123a435810ab817edd0326ff7ab>

Data source IDs live in [`lib/notion.ts`](lib/notion.ts). Property names (e.g. `"Baseline (Wk1)"`) are used verbatim — if someone renames a Notion property, `lib/mappers.ts` is where that breaks.

- **Workstreams** are derived from `Tasks`, grouped by the `Workstream` select. A workstream's RAG is the worst RAG of any non-Done task.
- **Risks vs Decisions** are the same `RAID` table split by `Type`.
- **Commitments** come from `Client commitments`.
- **Value metrics** come from `Value tracking`.
- **Milestones** and **programme metadata** are SOW facts — edit them in `lib/milestones.ts`.

---

## Deploy to Render

The repo ships with [`render.yaml`](render.yaml) pre-configured (Node 20, Starter plan, auto-deploy on push). First-time setup:

1. **Push this repo to a private GitHub repo** (one-time).
2. Go to [dashboard.render.com](https://dashboard.render.com) → **New +** → **Blueprint** → pick the repo. Render reads `render.yaml` and proposes a web service called `wilshire-dashboard`.
3. When prompted for the two `sync: false` env vars, paste:
   - `NOTION_TOKEN` — same value as in your `.env.local`
   - `DASHBOARD_PASSWORD` — the password you want sponsors to use
4. Click **Apply**. First build takes ~3 minutes. You'll get a URL like `https://wilshire-dashboard.onrender.com`.

Share with sponsors: **URL + username `wilshire` + password**.

**Ongoing updates:** edit `lib/weekly-delta.ts` on Fridays → `git push` → Render auto-redeploys in ~90 seconds. No manual redeploys.

### Rotating the password

Render dashboard → your service → **Environment** → update `DASHBOARD_PASSWORD` → Save. Service restarts automatically (~30s).

### Upgrading auth later

If you want per-person SSO instead of a shared password, put Cloudflare Access in front of the Render URL via a custom domain. No code changes in this repo.

---

## Tooling

```bash
npm run dev      # local dev with hot reload
npm run build    # production build
npm run start    # serve the production build locally
```

TypeScript strict mode is on. There are no `any` types. Build must stay clean.
