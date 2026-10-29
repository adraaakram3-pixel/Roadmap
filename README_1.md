# PM Roadmap Dashboard

A shared roadmap dashboard for product delivery. Everyone who opens the link
sees the same data, which is saved automatically.

## Views

- **Roadmap**
  - KPI cards: on track / delayed / ahead / delivered / blocked
  - Insight cards: delivery health, why features are delayed, pipeline by stage.
    Click any card or bar to filter the tickets.
  - Sprint tables. The navy column header stays frozen while you scroll through
    each sprint.
- **Gantt**: a per-feature delivery plan with stage durations, gap/hold days
  and lines for new requirements.

## Dates and delay tracking

- All dates use **dd/mm/yyyy**. You can type a date (`28/10/2026` or `28102026`)
  or use the calendar button.
- The first delivery date you set is the **original plan**. Every later change
  is kept in the ticket's **date history**, with the shift in days, the date of
  the change, a reason and a note. Click "N changes" under a date to expand it,
  or use "Show date history" to expand them all.
- When a date moves, a prompt asks why. The options are:
  - Vendor / CMC
  - Requirements change
  - New design required
  - Design changes
  - Team capacity
  - Deprioritization
  - Other

  If you only fixed a typo, choose "Just a correction" and the change isn't logged.
- The **schedule status** is calculated automatically:
  - **On track**: the date hasn't moved and isn't overdue.
  - **Delayed**: the date was pushed out, is overdue, or the feature was delivered late.
  - **Ahead of date**: the date was pulled in, or the feature was delivered early.
  - **Delivered**: shipped on time.
  - **No date set**

  You can override the status manually (options marked ✎).

## Presentation mode

Click **Present** to get a read-only view for leadership. It hides all the
editing controls. **More → Copy presentation link** gives you a link
(`?view=exec`) that always opens in this mode.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole dashboard (single page) |
| `api/data.js` | Vercel serverless function that reads and writes the shared data in Upstash Redis |
| `vercel.json` | Vercel config |

## Setup (already done for the live site)

1. Push these files to the GitHub repo connected to Vercel. Vercel redeploys
   automatically on every commit.
2. In Vercel → Project → Settings → Environment Variables, set
   `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

Existing saved data is upgraded automatically the first time the new version
loads. Old "previous date" entries become the first item in each ticket's date
history.

## Safety

If the shared data can't be loaded (network or database error), the page shows
a warning and **won't save anything**. This means an empty board can never
overwrite your real data. Use **More → Export data** from time to time to keep
a backup.
