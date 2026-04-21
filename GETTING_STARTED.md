# Getting started with Claude Code

Run these steps in order. Each block is copy-paste into your terminal.

## 1. Install Claude Code (if you haven't)

```bash
npm install -g @anthropic-ai/claude-code
```

## 2. Create the project folder

```bash
mkdir wilshire-dashboard && cd wilshire-dashboard
mkdir reference
# Copy wilshire-dashboard.jsx and BRIEF.md into this folder:
#   wilshire-dashboard/
#     BRIEF.md
#     reference/wilshire-dashboard.jsx
```

## 3. Get a Notion API token

1. Go to https://www.notion.so/profile/integrations
2. Click "New integration"
3. Name it "Wilshire Dashboard", workspace = Motive
4. Copy the secret (starts with `secret_` or `ntn_`)
5. Go to the root Notion page: https://www.notion.so/3485e123a435810ab817edd0326ff7ab
6. Click "..." → "Connections" → add your new integration
   (This grants it read access to that page AND all databases inside it)

## 4. Start Claude Code

```bash
cd wilshire-dashboard
claude
```

## 5. Your first prompt

Paste this exactly:

```
Read BRIEF.md and reference/wilshire-dashboard.jsx. Then:

1. Confirm you understand the task in 3 bullets.
2. List any questions about the spec before starting.
3. Then execute "First steps" section of BRIEF.md.

Work autonomously — run commands, install packages, create files. Stop only if you hit a real blocker. Commit to git after each major component is done.

When you've wired the Notion fetch and have real data rendering on at least one section, stop and show me the output so I can verify.
```

## 6. When Claude Code asks for the Notion token

It will ask where to store `NOTION_TOKEN`. Tell it `.env.local` (gitignored by default in Next.js).

## 7. Deploy to Vercel (once it works locally)

```bash
npx vercel
# Follow prompts. When asked about env vars, paste your NOTION_TOKEN.
# In the Vercel dashboard, under Settings → Deployment Protection,
# enable Password Protection so only you and the team can view.
```

## Tips for working with Claude Code

- **Trust but verify.** Let it run autonomously, but review each commit before continuing.
- **Use `/clear` between major phases** to keep context focused (e.g., after scaffolding is done, clear and start the UI work).
- **Ask for diffs, not rewrites.** When iterating, say "show me the diff before you apply it."
- **Push back on scope creep.** If Claude Code proposes adding tests, auth, or state management beyond what's in the brief — tell it to stick to the brief.

## When to come back here (to Claude chat)

- You want to change the design/approach (visual iteration is easier in this chat where I can show you)
- You want to brainstorm v2 features
- You're debugging Notion data model confusion
- You want to update the `BRIEF.md` mid-build as requirements change

Claude Code is for execution. This chat is for design and strategy.
