# Pattern: Project Actions listing

A **new page** — it does not exist in the product yet. Drafted 11 Sep 2026 from a feature brief by Rajat Garg, not from a screenshot, so unlike the other patterns this is a proposal, not an observation. Everything a screenshot would normally settle is either grounded in an existing pattern, cited to a guideline, or flagged `[proposed]`.

Every component and prop below was read from `COMPONENTS.md`. Nothing is invented. Structured prop shapes are marked `TBD` with the Storybook story that shows the real shape.

Reference point from the brief: GitHub's Actions tab inside a repository — a feed of operations with live progress. The LT idiom for that page shape already exists (`automation-listing.md`, `hyperexecute-jobs-listing.md`); this pattern is that idiom placed inside Test Manager.

---

## 1. What this page is

A new **Actions** tab in the Test Manager project nav, placed **immediately after Test Runs**. It lists every long-running operation inside the project — running and recently finished — **regardless of who started it**, each with live progress (percentage bar, count of entities processed, estimated time remaining).

What it is **not**: an audit log. The SmartUI Activity specs (`smartui-audit-log-prototype-spec.md`) answer "who changed this and why"; this page answers "what is running right now, and did my operation finish". One row here is one *operation*, never one affected entity — a move of 24 test cases is one row, not 24.

**Rows are not interactive in v1.** No click action, no detail page, no row overflow menu — deliberate, per the brief. See decision 4.

### 1.1 The fifteen actions, one vocabulary

The brief lists 15 action situations. They collapse into **7 event types** — the within-project / cross-project split and the import source are row detail, not separate types, otherwise the Event type filter carries 15 near-duplicate options.

| Event type | Covers (brief #) | Title grammar | Progress unit |
|---|---|---|---|
| Import | 1 CSV · 2 Zephyr / TestRail / qTest / Katalon | `Import test cases from {CSV\|tool}` | test cases |
| Export | 3 | `Export test cases` | test cases |
| Automation | 4 | `Automate test cases` | test cases |
| Move | 5–6 cases · 11–12 runs | `Move {test cases\|test runs} to {destination}` | test cases / test runs |
| Copy | 7–8 cases · 13–14 runs | `Copy {test cases\|test runs} to {destination}` | test cases / test runs |
| Delete | 9 cases · 15 runs | `Delete {test cases\|test runs}` | test cases / test runs |
| Run execution | 10 | the test run's own name | test instances |

**Destination grammar.** The brief says moves and copies always target *a single* destination folder. Within the project the title carries the folder path (`Copy test cases to Payments / Regression`); cross-project it leads with the destination project (`Move test cases to Internal HRMS / Archive`) **and** the row carries a `Cross-project` tag, so the meaning is in text, not only in the path shape (`guidelines/lttag.md`). Sources can be many folders, so the source lives in the meta strip as a count (`From 6 folders`) or a single path (`From Regression / Checkout`).

**Statuses come from the existing vocabulary — nothing new.** `queued` → `running` → `completed` | `failed`, all four already in the 12-status set in `mock-data.md`, each with its Status-component icon (purple stacked lines, blue spinner, grey tick, red cross). `completed` is exactly right for a finished operation — not `passed`, which asserts a test verdict. `stopped` is reserved for a future cancel control; no other status applies here. `[proposed — confirm the backend actually exposes a queued state; if not, drop it rather than faking it]`

## 2. Component inventory

| Component | Role | Notes |
|---|---|---|
| `LTUnderlineNav` | Project nav, top of page | New nav item after Test Runs; counter = running-action count. `navs` shape TBD, story `ltunderlinenav--with-counters` |
| `LTText` | H1, description, group headings, progress text | `HEADER_BOLD` for the h1 |
| `LTInputBox` | Search | `variant="default"` — the background variant, since `white` renders without one. `inputOnly`, `type="search"`, spans the row |
| `LTSelectPanel` | **Event type filter** — multi-select with its own trigger | `buttonLabel`, `showCountOnCta`, `onApply`. `options` shape TBD → `ltselectpanel--select-panel`. See open question 3 |
| `LTActionMenu` | **Date filter** — single-select presets | `anchorType="button"`, `buttonVariant="outline"`, `selectionVariant="single"`. No inputs in menus, so the custom range opens an `LTModal` (`guidelines/ltactionmenu.md`) |
| `LTModal` + `LTTimeDateSelector` | Custom date range | 480px. `LTTimeDateSelector` is the library's real date picker — see open question 4 |
| `LTTimeline` | Day-grouped vertical rail | Compound API, story-verified 11 Sep 2026: `LTTimeline.Item` (`badgeIcon`) + `LTTimeline.Body`. Plus `politenessLevel` on the root |
| `LTAutomationCard` | Every action row | `heading`, `subInfo[]`, `secondaryElement` — third page to borrow it, see open question 1 |
| `LTTestStatusLabel` | Status icon in the row heading | `status`, `showStatusText={false}`. Fourth entity type to use it — see open question 2 |
| `LTLabelGroup` + `LTTag` | Event type · `Cross-project` · source tags | Read-only, `labelStyle="outline"`, `variant="blueAccent"` |
| `LTProgressBar` | Live progress on running rows | Story-verified 11 Sep 2026: `animated` + `transition={LTProgressBar.Transition.SMOOTH}`; `segments=[{ id, progress, style:{ backgroundColor } }]`. `guidelines/ltprogressbar.md` |
| `LTCounterLabel` | Running count in the nav item | `count`, `scheme` |
| `LTBlankSlate` / `LTLoader` / `LTFlash` | Empty, loading, error | Required. Empty state deliberately has no primary action — see decision 5 |
| `LTBox`, `LTDivider` | Layout, row separators | — |

**Deliberately absent:** `LTCheckbox` (no bulk actions exist on actions), `LTActionMenu` per row (nothing to put in it), `LTLink` on titles (nowhere to go — decision 4), `LTPagination` (day-grouped feeds don't paginate — `guidelines/ltpagination.md`, the one sanctioned exception), `LTTabNav` (no second tab layer), the folder pane (decision 2).

## 3. Structure

### 3.1 Shell and nav

The platform shell, unchanged — and now owned by its own patterns rather than copied from a page: the 56px rail that expands on hover into a 320px overlay (`platform-sidebar.md`) and the top bar carrying the breadcrumb `Test Manager / {project}` plus the Credits quota module, product buttons, notifications bell, avatar and `Upgrade Now` (`topbar.md`, 11 Sep 2026). Both surfaces sit on the `canvas.subtle` grey; page content stays white. Then the project nav with the new item:

```jsx
import { LTUnderlineNav } from "@lambdatestincprivate/lt-components";

{/* Observed order (test-instance-details.md): Test Cases · Test Runs · Milestones · …
    New order: Test Cases · Test Runs · ACTIONS · Milestones · …
    The full observed tab set is not recorded in any pattern — leave the rest untouched.

    Counter on this item = number of RUNNING actions, not a total; it is the tab's
    pulse, and a lifetime total would be noise. Omit the counter at zero. [proposed]
    navs shape TBD → ltunderlinenav--with-counters (ltunderlinenav--loading-counters
    shows the skeleton state while the count loads). */}
<LTUnderlineNav ariaLabel="Test Manager" size="medium" navs={[]} onClick={() => {}} />
```

### 3.2 Header and filter bar

No folder pane, so this is a **centred single column: 112px each side, 1232px at the 1512 default** (`guidelines/README.md` §2 — same reasoning as `test-instance-details.md`). Structurally this body is `hyperexecute-jobs-listing.md` with two filters instead of six.

```jsx
import {
  LTBox, LTText, LTInputBox, LTSelectPanel, LTActionMenu,
} from "@lambdatestincprivate/lt-components";

<LTBox styles={{ maxWidth: "1232px", margin: "0 auto", padding: "24px 0" }}>

  <LTText as="h1" variant="HEADER_BOLD" text="Actions" />
  {/* Page description → body/medium (SUBHEADER_REGULAR, 14px). Corrected
      11 Sep 2026 from SMALL_REGULAR: a sentence the user reads is 14px,
      never 12. guidelines/README.md §3. */}
  <LTText variant="SUBHEADER_REGULAR" style={{ marginTop: "8px", maxWidth: "72ch" }}
    text="Every operation running in this project and what recently finished — imports, exports, moves, copies, deletions and test run executions — whoever started them." />

  {/* Filter bar. The search field spans the row and the two filters from the
      brief sit inline to its right — the Test Manager filter-bar shape
      (test-entity-listing.md §3.3), not HyperExecute's fixed 270px field.
      No select-all (nothing is selectable), no primary action (actions start
      elsewhere — you cannot create one here). */}
  <LTBox styles={{ display: "flex", alignItems: "center", gap: "12px", margin: "16px 0 24px" }}>

    {/* Search needs a background: variant="default", never "white".
        guidelines/ltinputbox.md. Matches title text and initiator name;
        destinations are covered because titles contain them. Announce the
        result-count change to screen readers, don't just re-render. */}
    <LTInputBox inputOnly type="search" size="medium" variant="default"
      placeholder="Search actions" ariaLabel="Search actions" allowClearSearch
      value="" onChange={() => {}} extraStyle={{ flex: 1 }} />

    {/* Event type: 7 options, multi-select → LTSelectPanel, the only multi-select
        surface (guidelines/ltactionmenu.md forbids multi-select menus).
        showCountOnCta puts the applied count on the trigger, which is the filter-bar
        recipe in guidelines/README.md §5. Options: Import · Export · Automation ·
        Move · Copy · Delete · Run execution. options shape TBD → ltselectpanel--select-panel */}
    <LTSelectPanel buttonLabel="Event type" label="Event type"
      ariaLabel="Filter by event type" options={[]} defaultValues={[]}
      onApply={() => {}} showCountOnCta />

    {/* Date: single-select presets → LTActionMenu with a button anchor.
        Today · Last 7 days · Last 30 days · All time (default) · Custom range…
        Applied, the label carries the choice — "Date: Last 7 days" — per the
        trigger-labelling rule in guidelines/ltselectpanel.md. "Custom range…"
        opens the modal below; inputs never live inside a menu. */}
    <LTActionMenu anchorType="button" buttonVariant="outline" buttonLabel="Date"
      selectionVariant="single" options={[]} onButtonClick={() => {}} />
  </LTBox>
```

The custom range, when a preset is not enough:

```jsx
import { LTModal, LTTimeDateSelector, LTButton } from "@lambdatestincprivate/lt-components";

{/* 480px — a short form (guidelines/ltmodal.md). Two pickers, start and end,
    end capped at today. Footer order per guidelines/README.md §7:
    secondary left of primary, primary hard right. */}
<LTModal title="Filter by date" ariaLabel="Filter by date"
  extraStyle={{ width: "480px" }} onClose={() => {}}
  renderFooter={null /* Cancel (outline) · Apply (primary) */}>
  <LTTimeDateSelector type="start_time" handleChange={() => {}} maxDate={new Date()} />
  <LTTimeDateSelector type="end_time" handleChange={() => {}} maxDate={new Date()} />
</LTModal>
```

### 3.3 The feed

Reverse-chronological, grouped by day, **ordered and grouped by start time** — a row never moves when it finishes, it changes in place (see §3.5). Group headings `Today` / `Yesterday` / `Sep 08, 2026` — `MMM DD, YYYY` is the only absolute format (`mock-data.md`). **No pagination**: this is a day-grouped reverse-chronological feed, the one sanctioned exception in `guidelines/ltpagination.md` — infinite scroll by group, with a small loader under the last group.

```jsx
import { LTTimeline, LTDivider } from "@lambdatestincprivate/lt-components";

{/* politenessLevel="polite" matters more here than on any sibling page:
    this feed updates itself while the user watches. */}
<LTTimeline politenessLevel="polite">
  {groups.map(group => (
    <LTBox key={group.label} styles={{ marginBottom: "32px" }}>
      <LTText as="h2" variant="SMALL_BOLD" text={group.label} />
      <LTBox styles={{ borderRadius: "8px", overflow: "hidden", marginTop: "12px" }}>
        {group.actions.map((action, i) => (
          <React.Fragment key={action.id}>
            <ActionRow action={action} />
            {i < group.actions.length - 1 && <LTDivider />}
          </React.Fragment>
        ))}
      </LTBox>
    </LTBox>
  ))}
</LTTimeline>
```

### 3.4 The action row

`LTAutomationCard`, exactly as on the two sibling feeds — status + title + tags in the heading, the dot-separated strip in `subInfo`, progress in `secondaryElement`. Tags sit in the heading (the HyperExecute placement; that page's delta 5 asks for the two placements to be aligned — this makes it three to one in favour of the heading).

```jsx
import {
  LTAutomationCard, LTLabelGroup, LTTag, LTProgressBar, LTText, LTBox,
} from "@lambdatestincprivate/lt-components";

/* heading / subInfo shapes TBD → ltautomationcard--automation-card */
function ActionRow({ action }) {
  return (
    <LTAutomationCard
      heading={{
        /* Status icon from the 12-status vocabulary: queued | running |
           completed | failed. Icon never carries the state alone — the
           trailing cluster says it in words. Long titles (run names) end-
           truncate with a tooltip carrying the full string — prose truncation
           rule proposed in automation-listing.md delta 3. */
        title: action.title,
        status: action.status,
        trailing: (
          <LTLabelGroup>
            {/* 1. The event type, always — the visible anchor for the filter. */}
            <LTTag text={action.eventType} labelStyle="outline" variant="blueAccent" size="small" />
            {/* 2. Only when the destination is another project. */}
            {action.crossProject && (
              <LTTag text="Cross-project" labelStyle="outline" variant="blueAccent" size="small" />
            )}
            {/* 3. Only where a source system exists: CSV, TestRail, Zephyr,
                  qTest, Katalon — and KaneAI on automation rows [proposed —
                  confirm bulk automation is KaneAI-driven before shipping the tag]. */}
            {action.source && (
              <LTTag text={action.source} labelStyle="outline" variant="blueAccent" size="small" />
            )}
          </LTLabelGroup>
        ),
      }}
      subInfo={[
        /* Scope: "From 6 folders" · "From Regression / Checkout" ·
           "regression-suite.csv" · "10 test cases · 4 configurations" (runs,
           mirroring the observed run meta in test-entity-listing.md §3.4). */
        { icon: null, value: action.scope },
        /* The group heading carries the date, so the row carries time only —
           zero-padded "HH:MM AM/PM" (mock-data.md). Always the START time; the
           finish shows as a duration in the trailing cluster. Attribution is
           the point of this page ("whoever started it"), so the initiator is
           never omitted; scheduled executions name "System". [proposed grammar] */
        { value: `Started at ${action.startTime} by ${action.initiator}` },
      ]}
      secondaryElement={<ActionProgress action={action} />}
    />
  );
}
```

**The trailing cluster is where the brief's requirement 8 lives** — percentage, progress bar, time remaining, entity counts — and it varies by status, nothing else in the row does:

```jsx
/* Cluster reserved at flex: 0 0 360px [proposed — the Test Runs row uses 320px,
   but that holds one text + one bar; this holds two texts + one bar. Both are
   multiples of 4; settle once against a build]. */
function ActionProgress({ action }) {
  const { status, done, total, unit, pct, timeLeft, duration } = action;

  if (status === "running") return (
    <LTBox styles={{ display: "flex", alignItems: "center", gap: "12px", flex: "0 0 360px" }}>
      <LTText variant="SMALL_REGULAR" text={`${done}/${total} ${unit}`} />
      {/* One segment — the completed fraction. This bar is genuinely live.
          Story-verified recipe (11 Sep 2026): animated + transition SMOOTH,
          segments=[{ id, progress, style:{ backgroundColor } }].
          guidelines/ltprogressbar.md */}
      <LTProgressBar animated transition={LTProgressBar.Transition.SMOOTH}
        segments={[{ id: "done", progress: pct, style: { backgroundColor: "success.emphasis" } }]}
        size="small" showInlineBar
        ariaLabel={`${done} of ${total} ${unit} processed, ${pct} percent, about ${timeLeft} remaining`} />
      <LTText variant="SMALL_REGULAR" text={`${pct}% · ~${timeLeft} left`} />
    </LTBox>
  );

  /* Finished rows keep the counts and swap the bar for the outcome + duration.
     Durations drop leading units: "1m 40s", "32s" (mock-data.md). */
  const text = {
    completed: `${total} ${unit} · Completed in ${duration}`,
    failed:    `${done} of ${total} ${unit} · Failed after ${duration}`,
    queued:    `${total} ${unit} · Queued`,
  }[status];

  return (
    <LTBox styles={{ display: "flex", justifyContent: "flex-end", flex: "0 0 360px" }}>
      <LTText variant="SMALL_REGULAR" text={text} />
    </LTBox>
  );
}
```

Two edge cases the cluster must survive:

- **No estimate yet.** A just-started action has no ETA: show `0/50 instances`, an empty bar, and `Estimating time left…` `[proposed copy]`. If the backend never produces estimates, the fallback is elapsed time instead — `Running for 2m 15s` — which is honest and still answers "is it stuck". Decide once (open question 5), don't mix the two.
- **No total yet.** A queued CSV import may not know its row count before parsing: render `Queued` alone and let `subInfo` carry the file name.

Time-remaining copy — `~` prefix, duration format, `left` suffix — is a new convention: `~45s left`, `~2m 15s left`, `~1h 20m left`. `[proposed — add to mock-data.md Formats if adopted]`

### 3.5 Live behaviour

- Rows update **in place**: bar, percentage, time remaining, then the status flip. A row never jumps between groups, because position is fixed by start time.
- Newly started actions insert at the top of `Today`.
- The nav counter tracks the running count as rows flip.
- `LTTimeline politenessLevel="polite"` announces updates without interrupting; status flips are the announcements that matter, per-percent ticks are not.
- No manual refresh control — the page keeps itself current, which is the point of it. `[proposed — if live updates are a later phase, ship a visible "Updated 12s ago" line instead of silently stale data]`

### 3.6 Worked example rows

Mock values per `mock-data.md` — cast, run names, formats, and the mandatory awkward rows. Folder names and CSV file names are **not in `mock-data.md`**; the ones here are `[proposed — add a folder-name and file-name list to mock-data.md]`.

| Status | Title | Tags | Scope (subInfo) | Trailing cluster |
|---|---|---|---|---|
| running | Import test cases from CSV | Import · CSV | `regression-suite.csv` · Started at 09:12 AM by Ritika Sharma | `312/1.24k test cases` · bar · `25% · ~4m 10s left` |
| running | Regression Suite - Release 8.4 | Run execution | 10 test cases · 5 configurations · Started at 08:47 AM by Mahendra Damodardas Baahubali | `34/50 instances` · bar · `68% · ~12m left` |
| running | Move test cases to Internal HRMS / Archive | Move · Cross-project | From 6 folders · Started at 09:30 AM by Oppenheimer | `9/24 test cases` · bar · `37% · ~55s left` |
| running | Export test cases | Export | All test cases · Started at 09:31 AM by Gabbar Singh | `0/482 test cases` · bar · `Estimating time left…` |
| queued | Import test cases from TestRail | Import · TestRail | Started at 09:32 AM by Darth Vader | `Queued` |
| completed | Copy test cases to Payments / Regression | Copy | From Regression / Checkout · Started at 08:02 AM by George Orwell | `24 test cases · Completed in 1m 40s` |
| failed | Import test cases from Zephyr | Import · Zephyr | Started at 07:55 AM by Kokushibo | `9 of 120 test cases · Failed after 32s` |
| completed | Automate test cases | Automation · KaneAI | From Regression / Checkout · Started at 07:33 AM by Ritika Sharma | `12 test cases · Completed in 6m 12s` |
| completed | Delete test runs | Delete | From 3 folders · Started at 06:58 AM by Mehmed Dracul | `8 test runs · Completed in 12s` |
| completed | Cross-browser Sanity \|\| 2026-09-03 07:33:26 | Run execution | 25 test cases · 2 configurations · Started at 11:41 PM by System | `50 instances · Completed in 1h 4m 12s` |
| completed | Copy test runs to Archive | Copy | From Payments · Started at 04:15 PM by Darth Vader | `3 test runs · Completed in 41s` |
| failed | Move test runs to Internal HRMS / Release Archive | Move · Cross-project | From 2 folders · Started at 02:20 PM by Oppenheimer | `0 of 5 test runs · Failed after 8s` |

Group membership is not row copy — the first nine rows sit under `Today`, the `Cross-browser Sanity` and `Copy test runs` rows under `Yesterday` (the former started 11:41 PM and ran past midnight — exactly the case in open question 6, here in its harmless completed form), and the last row under `Sep 08, 2026`.

The awkward rows, deliberately: the `1.24k` total stress-testing the k-format inside a fraction, a `0/482` with no estimate, a `0 of 5` instant failure, the timestamped run name that must truncate with a tooltip, the longest and the single-word cast names as initiators (initiators render as plain text in `subInfo`, as on the sibling feeds — no avatar), and one `System` initiator on a scheduled execution `[proposed — confirm scheduled runs surface here and how the trigger is attributed]`. Volume for a prototype: 15–25 rows across three day groups.

## 4. States

```jsx
/* Empty — project has never had an action. No primary action, deliberately:
   actions cannot be created here, they are side effects of work done on the
   other tabs. The description says where they come from instead (decision 5). */
<LTBlankSlate
  heading="No actions yet"
  description="Imports, exports, moves, copies, deletions and test run executions appear here as they happen."
  narrow
/>

/* Empty after filtering — the user has actions, the filters hid them. */
<LTBlankSlate heading="No results" description="No actions match these filters." narrow />

/* Loading */
<LTBox styles={{ display: "flex", justifyContent: "center", padding: "48px" }}>
  <LTLoader size="medium" />
</LTBox>

/* Partial load — under the last day group while the next one arrives.
   Never a full-page spinner mid-feed. */
<LTBox styles={{ display: "flex", justifyContent: "center", padding: "16px" }}>
  <LTLoader size="small" />
</LTBox>

/* Error — inline, above the feed. One LTFlash per page, maximum. */
<LTFlash variant="danger" text="We could not load actions. Retry, or check your connection." crossIcon fullBorder />
```

A failed *action* is a row state, not a page state — it renders as a normal `failed` row, never as an `LTFlash`. The banner is only for the feed itself failing to load.

## 5. Design decisions

There is no live product to diff against, so this replaces "Deltas from the live product": the calls made in this proposal, with the rejected alternative each time. All 11 Sep 2026.

1. **Day-grouped timeline, not GitHub's flat paginated list.** The brief points at GitHub Actions, but LT already has an idiom for "a feed of operations": the `LTTimeline` day groups on Automation and HyperExecute. Consistency inside the product beats fidelity to the reference. This also settles pagination — day-grouped feeds are the one sanctioned no-pagination exception (`guidelines/ltpagination.md`).

2. **No folder pane → centred single column.** Actions are project-scoped and routinely span many folders ("from their respective folders"), so a folder tree would filter almost nothing and misrepresent scope. Under `guidelines/README.md` §2 that makes this a centred 1232px page, unlike its full-width Test Manager siblings — the same split test-instance-details already makes.

3. **One feed; running rows are not pinned above it.** Rejected alternative: an "In progress" section pinned over the history. Running actions are short-lived and recent, so they sit at the top of `Today` anyway; the pinned section would duplicate the top of the feed on the good days and add a row-jump on completion. The one case it genuinely helps — an action started before midnight, still running, buried under `Yesterday` — is recorded as open question 6 rather than solved with structure the sibling feeds don't have.

4. **Nothing in a row is interactive.** Per the brief: no row click, no detail page. Consequences drawn all the way: titles are plain text, not `LTLink` (project-listing's link-titles rule applies only where clicking navigates — here there is no destination); no per-row `...` menu (it would be empty); no checkboxes (no bulk verbs exist). When cancel/retry/details arrive, they change this row anatomy — do not bolt them on without revisiting slot 5 and the menu.

5. **The empty state has no action button.** `guidelines/README.md` §8 wants "one line, one action", but every candidate button here would navigate away to a different tab's job. A create-style CTA on a page that cannot create is worse than none; the description carries the "what belongs here" line instead.

6. **The nav counter counts running actions, not lifetime total.** `Test Cases 17` counts what the tab holds; a lifetime count of actions is meaningless and unbounded. The running count is the one number that makes the tab worth glancing at, and it hides at zero. `[proposed — semantics differ from sibling counters; confirm]`

7. **Exactly the two filters from the brief — Event type and Date.** HyperExecute ships six including Status and Users; both would be defensible here and are deliberately left out until asked for (open question 6 covers Status as the lighter alternative to pinning).

8. **Tab label "Actions"** (renamed from "Project Actions", 12 Sep 2026). The nav already sits inside one project — the breadcrumb above it reads `Test Manager / {project}` — so every tab in it is project-scoped and none of the others repeats the word: `Test Cases`, not `Project Test Cases`. "Project" was doing no work, and the tab is the widest label in the control. The heading matches the tab, per the crumb-matches-title principle in `guidelines/ltbreadcrumbs.md`. One word also retires the earlier case question: sentence case (§8) and the nav's title case agree on `Actions`.

   **Still named for the longer form:** this pattern file, the prototype repo and the page's URL slug. Renaming those is a separate call — the file name describes the subject (actions within a project), not the label.

## 6. Layout notes

- **Centred single column, 112px each side → 1232px** at the 1512 default; 1160px at 1440, 1000px at 1280 (`guidelines/README.md` §2).
- Group spacing `32px`, rows in one bordered container (`8px` radius) with `LTDivider` between — identical to the sibling feeds and the settled listing treatment.
- Search spans the row (`flex: 1`); the filter triggers sit inline to its right at `12px` gaps. All spacing multiples of 4.
- Trailing cluster `360px` `[proposed — see §3.4]`.
- Timestamps: day in the group heading, zero-padded `HH:MM AM/PM` time in the row, durations in the leading-unit-dropping format — all `mock-data.md`.

## 7. Open questions

1. **`LTAutomationCard` outside Automation, third borrower.** HyperExecute's open question 1 asked whether this is really a general run-row component with a misleading name; a Test Manager page using it should force the rename-or-bless decision. `HeadingProps` / `SubInfoProps[]` shapes (and whether `heading.trailing` exists) remain the blocker — extract once from `ltautomationcard--automation-card`.
2. **`LTTestStatusLabel` on a fourth entity type.** `mock-data.md` scopes the execution vocabulary to cases, runs and instances, and warns against stretching the component (agent status explicitly may not use it). Actions borrow four statuses from that same vocabulary — confirm with the DS owner that this is a sanctioned use, and that the component accepts `queued` / `completed` strings (its `status` enum is unextracted; same gap as test-entity-listing.md §7.1).
3. **`LTSelectPanel` save model and trigger.** The guideline offers anchored (saves on close) vs modal (saves on Save); the component API exposes `onApply` + `cancelButtonText="Reset"`. Read the story, pick one deliberately, and confirm `showCountOnCta` renders the trigger like the outline-button-with-counter recipe — if not, fall back to an `LTButton` trigger with `counter`, as the other filter bars do.
4. **`LTTimeDateSelector` generality.** Its `handleChange` is typed against `ReservationFormType` — it may be welded to the reservation form. If it cannot be used standalone, the custom range ships presets-only and the picker becomes an FE ask.
5. **Does the backend produce ETAs?** Requirement 8 asks for time remaining; if the services only report counts, ship the elapsed-time fallback (§3.4) everywhere rather than fake estimates on some rows.
6. **The buried-runner case.** An action started before midnight and still running sits under `Yesterday`. If real usage hits this, the lighter fix is a Status filter (HyperExecute precedent); the heavier one is the pinned running section rejected in decision 3.
7. **Retention.** How far back does the feed go — 30 days, forever? Past 30 days the group headings go absolute anyway; the answer mostly decides storage, but "All time" in the Date filter should not promise history that was purged.
8. **`LTTimer`.** The library has a `timeInMs` timer component — whether it counts up or down is undocumented. If it ticks without re-render plumbing, it may be exactly what the running cluster's time-left/elapsed text wants. Check the story before hand-rolling.

### When this ships into `design-context/`

- Move this file to `design-context/patterns/project-actions-listing.md` and add row 17 to the patterns README status table.
- Add the nav item (and its counter semantics) to every pattern that renders the project nav: `test-entity-listing.md`, `test-instance-details.md`, `manual-test-case-summary.md`, `module-details.md`.
- If adopted, fold into `mock-data.md`: the `~{duration} left` convention, folder names, CSV file names, and an "action" row in the status-vocabulary applicability note.
