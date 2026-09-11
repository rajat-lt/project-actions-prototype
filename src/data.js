// Mock data per mock-data.md — approved cast, run-name shapes, duration and
// timestamp formats, plus the mandatory awkward rows. Folder and file names
// are [proposed] additions (not yet in mock-data.md).

export const EVENT_TYPES = [
  'Import', 'Export', 'Automation', 'Move', 'Copy', 'Delete', 'Run execution',
]

export const DAY_GROUPS = [
  { key: '2026-09-11', label: 'Today' },
  { key: '2026-09-10', label: 'Yesterday' },
  { key: '2026-09-08', label: 'Sep 08, 2026' },
]

export const DATE_PRESETS = [
  { id: 'today', label: 'Today', days: 1 },
  { id: '7d', label: 'Last 7 days', days: 7 },
  { id: '30d', label: 'Last 30 days', days: 30 },
  { id: 'all', label: 'All time', days: Infinity },
]

// Durations drop leading units: "1h 4m 12s", "2m 35s", "45s" (mock-data.md).
export function fmtDur(totalSec) {
  const s = Math.max(0, Math.round(totalSec))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}h ${m}m ${sec}s`
  if (m > 0) return `${m}m ${sec}s`
  return `${sec}s`
}

// Numbers over 999 use k with up to 2 decimals, trailing zeros trimmed.
export function fmtK(n) {
  const v = Math.floor(n)
  if (v <= 999) return String(v)
  let s = (v / 1000).toFixed(2)
  s = s.replace(/\.?0+$/, '')
  return `${s}k`
}

export const pctOf = (done, total) => (total > 0 ? Math.floor((done / total) * 100) : 0)

/*
 * Row shape:
 *  status: queued | running | completed | failed  (12-status vocabulary subset)
 *  unit:   test cases | test runs | instances
 *  For running rows: done/total/rate (per second), elapsed (seconds so far),
 *    etaDelay (ticks before an estimate exists), startDelay (ticks before
 *    progress moves — parse phase).
 *  For finished rows: duration is display-ready.
 */
export const initialActions = [
  // ---- Today ----
  {
    id: 'a1', day: '2026-09-11', time: '09:12 AM', status: 'running',
    title: 'Import test cases from CSV', eventType: 'Import', tags: ['CSV'],
    scope: 'regression-suite.csv', initiator: 'Ritika Sharma',
    unit: 'test cases', total: 1240, done: 312, rate: 3.7, elapsed: 84,
  },
  {
    id: 'a2', day: '2026-09-11', time: '08:47 AM', status: 'running',
    title: 'Regression Suite - Release 8.4', eventType: 'Run execution', tags: [],
    scope: '10 test cases · 5 configurations', initiator: 'Mahendra Damodardas Baahubali',
    unit: 'instances', total: 50, done: 34, rate: 0.022, elapsed: 1545,
  },
  {
    id: 'a3', day: '2026-09-11', time: '09:30 AM', status: 'running',
    title: 'Move test cases to Internal HRMS / Archive', eventType: 'Move',
    tags: ['Cross-project'], crossProject: true,
    scope: 'From 6 folders', initiator: 'Oppenheimer',
    unit: 'test cases', total: 24, done: 9, rate: 0.273, elapsed: 33,
  },
  {
    id: 'a4', day: '2026-09-11', time: '09:31 AM', status: 'running',
    title: 'Export test cases', eventType: 'Export', tags: [],
    scope: 'All test cases', initiator: 'Gabbar Singh',
    unit: 'test cases', total: 482, done: 0, rate: 4.2, elapsed: 3,
    etaDelay: 5, startDelay: 3,
  },
  {
    id: 'a5', day: '2026-09-11', time: '09:32 AM', status: 'queued',
    title: 'Import test cases from TestRail', eventType: 'Import', tags: ['TestRail'],
    scope: null, initiator: 'Darth Vader',
    unit: 'test cases', total: 340, done: 0, rate: 2.1, elapsed: 0, queuedTicks: 8,
  },
  {
    id: 'a6', day: '2026-09-11', time: '08:02 AM', status: 'completed',
    title: 'Copy test cases to Payments / Regression', eventType: 'Copy', tags: [],
    scope: 'From Regression / Checkout', initiator: 'George Orwell',
    unit: 'test cases', total: 24, duration: '1m 40s',
  },
  {
    id: 'a7', day: '2026-09-11', time: '07:55 AM', status: 'failed',
    title: 'Import test cases from Zephyr', eventType: 'Import', tags: ['Zephyr'],
    scope: null, initiator: 'Kokushibo',
    unit: 'test cases', total: 120, done: 9, duration: '32s',
  },
  {
    id: 'a8', day: '2026-09-11', time: '07:33 AM', status: 'completed',
    title: 'Automate test cases', eventType: 'Automation', tags: ['KaneAI'],
    scope: 'From Regression / Checkout', initiator: 'Ritika Sharma',
    unit: 'test cases', total: 12, duration: '6m 12s',
  },
  {
    id: 'a9', day: '2026-09-11', time: '06:58 AM', status: 'completed',
    title: 'Delete test runs', eventType: 'Delete', tags: [],
    scope: 'From 3 folders', initiator: 'Mehmed Dracul',
    unit: 'test runs', total: 8, duration: '12s',
  },
  {
    id: 'a10', day: '2026-09-11', time: '06:12 AM', status: 'completed',
    title: 'Delete test cases', eventType: 'Delete', tags: [],
    scope: 'From 4 folders', initiator: 'Darth Vader',
    unit: 'test cases', total: 45, duration: '28s',
  },

  // ---- Yesterday ----
  {
    id: 'b1', day: '2026-09-10', time: '11:41 PM', status: 'completed',
    title: 'Cross-browser Sanity || 2026-09-03 07:33:26', eventType: 'Run execution', tags: [],
    scope: '25 test cases · 2 configurations', initiator: 'System',
    unit: 'instances', total: 50, duration: '1h 4m 12s',
  },
  {
    id: 'b2', day: '2026-09-10', time: '04:15 PM', status: 'completed',
    title: 'Copy test runs to Archive', eventType: 'Copy', tags: [],
    scope: 'From Payments', initiator: 'Darth Vader',
    unit: 'test runs', total: 3, duration: '41s',
  },
  {
    id: 'b3', day: '2026-09-10', time: '02:03 PM', status: 'completed',
    title: 'Export test cases', eventType: 'Export', tags: [],
    scope: 'From Regression / Checkout', initiator: 'Ritika Sharma',
    unit: 'test cases', total: 128, duration: '54s',
  },
  {
    id: 'b4', day: '2026-09-10', time: '11:22 AM', status: 'completed',
    title: 'Import test cases from Katalon', eventType: 'Import', tags: ['Katalon'],
    scope: null, initiator: 'George Orwell',
    unit: 'test cases', total: 300, duration: '8m 3s',
  },
  {
    id: 'b5', day: '2026-09-10', time: '01:15 AM', status: 'failed',
    title: 'Smoke - Sprint 42 Nightly', eventType: 'Run execution', tags: [],
    scope: '10 test cases · 2 configurations', initiator: 'System',
    unit: 'instances', total: 20, done: 12, duration: '22m 40s',
  },

  // ---- Sep 08, 2026 ----
  {
    id: 'c1', day: '2026-09-08', time: '02:20 PM', status: 'failed',
    title: 'Move test runs to Internal HRMS / Release Archive', eventType: 'Move',
    tags: ['Cross-project'], crossProject: true,
    scope: 'From 2 folders', initiator: 'Oppenheimer',
    unit: 'test runs', total: 5, done: 0, duration: '8s',
  },
  {
    id: 'c2', day: '2026-09-08', time: '10:04 AM', status: 'completed',
    title: 'Move test cases to Regression / Checkout', eventType: 'Move', tags: [],
    scope: 'From 6 folders', initiator: 'Mahendra Damodardas Baahubali',
    unit: 'test cases', total: 61, duration: '2m 19s',
  },
  {
    id: 'c3', day: '2026-09-08', time: '09:00 AM', status: 'completed',
    title: 'Import test cases from qTest', eventType: 'Import', tags: ['qTest'],
    scope: null, initiator: 'Gabbar Singh',
    unit: 'test cases', total: 96, duration: '1m 12s',
  },
]

// Inserted live at ~tick 20 to demonstrate a new action arriving at the top of Today.
export const lateArrival = {
  id: 'live1', day: '2026-09-11', time: '09:36 AM', status: 'running',
  title: 'Copy test cases to Smoke', eventType: 'Copy', tags: [],
  scope: 'From Regression / Checkout', initiator: 'Mehmed Dracul',
  unit: 'test cases', total: 18, done: 0, rate: 0.6, elapsed: 0,
}
