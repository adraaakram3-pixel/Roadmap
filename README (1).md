# Task Tracker

A single-page task tracker: task name, delivery date (with strikethrough
history when you change it), status, stage (BR/UI-UX/DEV/UAT/PROD), and
comments. Add rows, add columns, reorder rows, delete rows.

Data is saved in **your browser's localStorage** — no backend, no database.
That means it's private to you, but it's tied to one browser on one device.
If you clear your browser data, or open the site in a different browser,
you'll see a fresh/default board. (See "Optional: shared/multi-device data"
below if you want everyone who opens the link to see the same data.)

## Deploy to Vercel (no coding required)

### Option A — GitHub + Vercel (recommended, easiest to update later)

1. Create a free account at [github.com](https://github.com) if you don't have one.
2. Create a new repository (e.g. `task-tracker`), and upload these three files
   to it: `index.html`, `vercel.json`, `README.md`.
   - On the repo page, click **Add file → Upload files**, drag the files in,
     and commit.
3. Go to [vercel.com](https://vercel.com) and sign up (you can sign up with
   your GitHub account — this also makes step 4 easier).
4. Click **Add New… → Project**, select the `task-tracker` repo you just
   created, and click **Import**.
5. Framework preset: choose **Other** (it's a plain static site, no build
   step needed). Leave everything else default.
6. Click **Deploy**. In about 30 seconds you'll get a live URL like
   `task-tracker-yourname.vercel.app` — that's your dashboard.

To make changes later: edit `index.html` in GitHub (or push updates from your
computer) — Vercel automatically redeploys on every commit.

### Option B — Vercel CLI (if you're comfortable with a terminal)

```bash
npm install -g vercel
cd task-tracker-vercel
vercel
```

Follow the prompts (log in, confirm project name, etc.) and it'll give you a
live URL. Run `vercel --prod` to push it to your permanent production URL.

## Optional: shared / multi-device data

Right now each browser has its own local copy of the data. If you want the
tracker to show the **same data to everyone** who opens the link (e.g. your
whole team sees the same table, from any device), you'd need a small
database behind it instead of localStorage — for example
[Vercel KV](https://vercel.com/docs/storage/vercel-kv) or
[Supabase](https://supabase.com) (both have free tiers), plus a tiny API
route to read/write the data. Let me know if you want this — I can build
that version too, it's a bigger change since it needs a backend.
