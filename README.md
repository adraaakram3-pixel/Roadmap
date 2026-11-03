# PM Roadmap Dashboard

A shared roadmap dashboard for product delivery. Everyone who opens the link
sees the same data, which is saved automatically.

## Views

- **Roadmap**
  - KPI cards: Portfolio (total, blocked) and Delivered (early, on time, late)
  - Delivery health leaves out sprints named "Backlog" (features not planned yet)
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
  - Other: type your own reason. It's saved to the list under that name, so it
    shows as the text you typed (not "Other") and can be reused.

  If you only fixed a typo, choose "Just a correction" and the change isn't logged.
- You can also add reasons with **+ Add reason** on the "Why features slipped" card.
- **Delay categories.** Every reason belongs to one fixed category, and the
  charts count categories:
  - Business approval & content
  - Vendor & third party
  - Regulatory
  - Requirements change
  - Design
  - Internal dependency
  - Capacity & priority
  - Testing & fixes
  - Release & infrastructure
  - Other

  A typed reason asks for its category; the category is pre-filled with a
  best guess. Use **More → Manage delay reasons** to rename reasons, change
  their category or merge duplicates.
- **Zain Mart: Web / App / Dashboard column** (replaces Release type for Zain Mart only).
  Click each chip (Web, App, Dashboard) to cycle through not set (–), live
  (green ✓) and not live (red ✗). All green means live everywhere; a red chip
  means it isn't live on that channel yet.
- **Release type** column (other products): App release, Backend only, Web / portal, or
  Config / content. This means backend-only changes aren't compared like for
  like with app releases.
- **Stage days.** Under the stage you see the plan from the Gantt chart and
  the actual days so far, from the stage history. The text turns amber when
  the actual days pass the plan. Gantt features are linked to tickets **by
  ID**: in the Gantt editor, use **Linked ticket**. Matching names are linked
  automatically.
- **Owners**: open features with no assignee show "⚠ No owner".
- The **schedule status** is calculated automatically, always against the
  **original plan**:

  | In progress | Delivered (stage PROD, or status Done / Closed) |
  |---|---|
  | **On track**: no slip, not overdue | **Delivered early**: shipped before the original plan |
  | **Delayed** + reason: pushed out or overdue | **Delivered on time**: shipped on the original plan date |
  | **Ahead of plan**: date pulled in | **Delivered late** + reason: shipped after the original plan |

  The ship date is recorded automatically when a ticket reaches PROD or Done.
  You can also override any status manually (options marked ✎).
- **Delay Reasons column**: lists every push-out of the date, numbered
  (1. Vendor / CMC +20d, 2. Requirements change +15d, ...). A chosen reason
  shows as a coloured chip. Click the chip to change it. A dropdown only
  appears when no reason has been chosen yet.
- **Stage days come from the Gantt chart**: the grey text under the stage
  (e.g. "UAT · 4 days") is the planned number of working days for that stage
  in the Gantt chart. A ticket is linked to the Gantt feature with the **same
  name**; if there are "new requirements" lines, the latest one is used. If
  there's no matching Gantt feature, nothing is shown.

## Sprint stage journey

- Each sprint ribbon shows the sprint's current stage and how many days it has been in that stage. The stages are: Development → Internal testing → Under business testing → Feedback received → Signed off → Approved · awaiting store approval → Released.
- Use **Move to…** on the ribbon to change the stage. Today's date is recorded. Stages can repeat (for example, Feedback received → Development → Internal testing → Under business testing again), and repeats are labeled "2nd time", "3rd time" and so on.
- **History** opens the full journey: a colored bar, the total days per stage (with the number of rounds), and a table of every step with its start date, end date, days and an optional note. Dates are editable, and a step added by mistake can be removed (with Undo).
- A stage runs from its start date until the next stage starts. The current stage counts until today. "Released" ends the journey.
- In Present mode the ribbon shows only the stage and its days. Dates and edit controls are hidden, and History can still be opened.

## Sprint order

- Use the ↑ ↓ arrows on the right of each sprint ribbon to move a sprint up or down. The new order is saved for everyone.

## Delivery health

- Counts delivered features only (delivered early, on time, late) against their original plan, and shows the % delivered on time or early. Backlog sprints are not counted.

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
