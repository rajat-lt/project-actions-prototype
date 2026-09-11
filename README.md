# Project Actions — prototype

Working prototype of the proposed **Project Actions** tab for LambdaTest Test Manager: a
day-grouped, reverse-chronological feed of every long-running operation inside a project —
imports, exports, moves, copies, deletions, automation and test run executions — with live
progress (percentage bar, entity counts, estimated time remaining), regardless of who
started the operation.

The design spec lives in [`project-actions-listing.md`](project-actions-listing.md), written
in the `design-context/patterns/` house format. The prototype implements it: 7-value event
taxonomy, `queued → running → completed | failed` statuses from the 12-status vocabulary,
search + Event type + Date filters, no pagination (day-grouped feed exception), and
deliberately non-interactive rows.

**Live demo:** deployed via GitHub Pages from the `gh-pages` branch.

## Run it

```bash
npm install
npm run dev        # http://localhost:5178
npm run build      # static build in dist/
```

## What is simulated

Progress advances every second: bars fill, ETAs count down, the queued TestRail import
starts running, the export gets its estimate after a parse phase, finished actions flip to
`completed` in place (rows never move — position is anchored by start time), a new action
arrives at the top of `Today` after ~20s, and the nav counter tracks the running count.

## States

- default — brief loading, then the feed
- `?state=empty` — project has never had an action
- `?state=error` — feed failed to load (LTFlash)
- `?state=loading` — persistent loading state
- filtered-empty — reachable by filtering/searching to zero results

## Honesty notes

- **Mock data only** — fictional cast, projects and folder names per `mock-data.md`
  conventions. No real customer data.
- **Not the real component library.** `@lambdatestincprivate/lt-components` is private;
  this prototype hand-rolls visual look-alikes on the Primer foundation, with color values
  taken from the design-context token extraction (`TOKENS.md`, `colorSchemes.light`).
  The orange uses the theme's `severe.emphasis` pending the real LT orange token.
- Desktop-only, light theme only, prototyped at the 1512px default width.
