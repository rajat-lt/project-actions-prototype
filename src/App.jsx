// Actions — working prototype of the pattern in
// project-actions-listing.md. Day-grouped reverse-chronological feed of
// long-running operations with live progress simulation.
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  EVENT_TYPES, DAY_GROUPS, DATE_PRESETS, fmtDur, fmtK, pctOf,
  initialActions, lateArrival,
} from './data.js'
import {
  StatusIcon, SearchInput, ProgressBar, TRANSITION, BlankSlate, Loader,
  Flash, UnderlineNav, SelectPanel, DateMenu, DateRangeModal,
} from './lt.jsx'
import { PlatformSidebar, TopBar } from './shell.jsx'

const TODAY = '2026-09-11'
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const minutesOf = t => {
  const [hhmm, ap] = t.split(' ')
  let [h, m] = hhmm.split(':').map(Number)
  if (ap === 'PM' && h !== 12) h += 12
  if (ap === 'AM' && h === 12) h = 0
  return h * 60 + m
}

function isoDaysBack(days) {
  const d = new Date(`${TODAY}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - (days - 1))
  return d.toISOString().slice(0, 10)
}

function inDateFilter(day, presetId, custom) {
  if (presetId === 'custom' && custom) return day >= custom.from && day <= custom.to
  const p = DATE_PRESETS.find(x => x.id === presetId)
  if (!p || p.days === Infinity) return true
  return day >= isoDaysBack(p.days)
}

function fmtRange(from, to) {
  const md = iso => { const [, m, d] = iso.split('-'); return `${MONTHS[+m - 1]} ${d}` }
  const [fy] = from.split('-'); const [ty] = to.split('-')
  return fy === ty ? `${md(from)} – ${md(to)}, ${fy}` : `${md(from)}, ${fy} – ${md(to)}, ${ty}`
}

/* One simulation tick over the action list. Returns the next list plus an
   announcement for the live region when something finished. */
function stepActions(list) {
  let announce = null
  const next = list.map(a => {
    if (a.status === 'queued') {
      const qt = (a.queuedTicks ?? 0) - 1
      return qt <= 0 ? { ...a, status: 'running', queuedTicks: 0 } : { ...a, queuedTicks: qt }
    }
    if (a.status !== 'running') return a
    const elapsed = (a.elapsed ?? 0) + 1
    const etaDelay = Math.max(0, (a.etaDelay ?? 0) - 1)
    if ((a.startDelay ?? 0) > 0) return { ...a, startDelay: a.startDelay - 1, elapsed, etaDelay }
    const done = Math.min(a.total, a.done + a.rate)
    if (done >= a.total) {
      announce = `${a.title} completed`
      return { ...a, done: a.total, status: 'completed', duration: fmtDur(elapsed), elapsed }
    }
    return { ...a, done, elapsed, etaDelay }
  })
  return { next, announce }
}

function Cluster({ a }) {
  if (a.status === 'running') {
    const pct = pctOf(a.done, a.total)
    const noEtaYet = (a.etaDelay ?? 0) > 0
    const eta = noEtaYet ? null : fmtDur((a.total - a.done) / a.rate)
    return (
      <div className="cluster">
        <span className="frac">{fmtK(a.done)}/{fmtK(a.total)} {a.unit}</span>
        {/* This bar is genuinely moving while the user watches, so it takes
            the live recipe; a static bar is the default everywhere else. */}
        <ProgressBar pct={pct} animated transition={TRANSITION.SMOOTH}
          label={`${Math.floor(a.done)} of ${a.total} ${a.unit} processed, ${pct} percent${eta ? `, about ${eta} remaining` : ''}`} />
        <span className="note">{eta ? `${pct}% · ~${eta} left` : 'Estimating time left…'}</span>
      </div>
    )
  }
  const text =
    a.status === 'completed' ? `${fmtK(a.total)} ${a.unit} · Completed in ${a.duration}` :
    a.status === 'failed' ? `${fmtK(a.done ?? 0)} of ${fmtK(a.total)} ${a.unit} · Failed after ${a.duration}` :
    'Queued'
  return <div className="cluster"><span className="note">{text}</span></div>
}

function ActionRow({ a }) {
  return (
    <div className="row">
      <span className="row-status" aria-hidden="true"><StatusIcon status={a.status} /></span>
      <div className="row-main">
        <div className="titleline">
          <span className="title" title={a.title}>{a.title}</span>
          <ul className="tags">
            <li><span className="tag">{a.eventType}</span></li>
            {a.tags.map(t => <li key={t}><span className="tag">{t}</span></li>)}
          </ul>
        </div>
        <div className="meta">
          {a.scope && <><span>{a.scope}</span><span className="dot" aria-hidden="true">·</span></>}
          <span>Started at {a.time} by {a.initiator}</span>
        </div>
      </div>
      <Cluster a={a} />
    </div>
  )
}

export default function App() {
  const mode = useMemo(() => new URLSearchParams(window.location.search).get('state'), [])
  const [phase, setPhase] = useState(mode === 'error' ? 'error' : 'loading')
  const [actions, setActions] = useState(mode === 'empty' ? [] : initialActions)
  const [q, setQ] = useState('')
  const [types, setTypes] = useState([])
  const [datePreset, setDatePreset] = useState('all')
  const [custom, setCustom] = useState(null)
  const [rangeOpen, setRangeOpen] = useState(false)
  const [announce, setAnnounce] = useState('')
  const tickRef = useRef(0)

  useEffect(() => {
    if (mode === 'loading' || mode === 'error') return
    const t = setTimeout(() => setPhase('ready'), 700)
    return () => clearTimeout(t)
  }, [mode])

  useEffect(() => {
    if (phase !== 'ready' || mode === 'empty') return
    const iv = setInterval(() => {
      tickRef.current += 1
      setActions(prev => {
        const { next, announce: done } = stepActions(prev)
        if (done) setAnnounce(done)
        if (tickRef.current === 20 && !next.some(a => a.id === lateArrival.id)) {
          setAnnounce(`New action started: ${lateArrival.title}`)
          return [{ ...lateArrival }, ...next]
        }
        return next
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [phase, mode])

  const filtered = useMemo(() => actions.filter(a =>
    (types.length === 0 || types.includes(a.eventType)) &&
    inDateFilter(a.day, datePreset, custom) &&
    (q.trim() === '' ||
      a.title.toLowerCase().includes(q.trim().toLowerCase()) ||
      a.initiator.toLowerCase().includes(q.trim().toLowerCase()))
  ), [actions, types, datePreset, custom, q])

  const groups = useMemo(() => DAY_GROUPS
    .map(g => ({
      ...g,
      rows: filtered.filter(a => a.day === g.key).sort((x, y) => minutesOf(y.time) - minutesOf(x.time)),
    }))
    .filter(g => g.rows.length > 0), [filtered])

  const runningCount = actions.filter(a => a.status === 'running').length
  const isFiltering = q.trim() !== '' || types.length > 0 || datePreset !== 'all'

  const tabs = [
    { id: 'tc', label: 'Test Cases', counter: 482 },
    { id: 'tr', label: 'Test Runs', counter: 36 },
    { id: 'pa', label: 'Actions', counter: runningCount > 0 ? runningCount : undefined, active: true },
    { id: 'ms', label: 'Milestones', counter: 4 },
  ]

  return (
    <div className="app">
      <PlatformSidebar activeProduct="test-manager" />
      <div className="main">
        {/* Shell surfaces, both from design-context/patterns. Pages supply the
            crumbs and the product's modules; they never redesign the bar. */}
        <TopBar
          crumbs={[{ label: 'Test Manager' }, { label: 'Web app' }]}
          user={{ initials: 'RS', name: 'Ritika Sharma' }}
          credits="20k"
          unreadCount={3}
        />

        <UnderlineNav ariaLabel="Test Manager" tabs={tabs} />

        <main className="page">
          <h1>Actions</h1>
          <p className="page-desc">
            Every operation running in this project and what recently finished — imports, exports,
            moves, copies, deletions and test run executions — whoever started them.
          </p>

          <div className="filterbar">
            <SearchInput value={q} onChange={setQ} placeholder="Search actions" ariaLabel="Search actions" />
            <SelectPanel label="Event type" options={EVENT_TYPES} applied={types} onApply={setTypes} />
            <DateMenu presets={DATE_PRESETS} activeId={datePreset}
              customLabel={custom ? custom.label : ''}
              onPick={id => { setDatePreset(id); setCustom(null) }}
              onCustom={() => setRangeOpen(true)} />
          </div>

          {phase === 'error' && (
            <Flash>We could not load actions. Retry, or check your connection.</Flash>
          )}

          {phase === 'loading' && <div className="center"><Loader /></div>}

          {phase === 'ready' && actions.length === 0 && (
            <BlankSlate heading="No actions yet"
              description="Imports, exports, moves, copies, deletions and test run executions appear here as they happen." />
          )}

          {phase === 'ready' && actions.length > 0 && groups.length === 0 && (
            <BlankSlate heading="No results" description="No actions match these filters." />
          )}

          {phase === 'ready' && groups.length > 0 && (
            <>
              <div className="feed">
                {groups.map(g => (
                  <section key={g.key} className="group" aria-label={g.label}>
                    <h2>{g.label}</h2>
                    <div className="rows">
                      {g.rows.map(a => <ActionRow key={a.id} a={a} />)}
                    </div>
                  </section>
                ))}
              </div>
              {!isFiltering && (
                <div className="center" style={{ padding: '8px 0 0' }}>
                  <Loader small label="Loading older actions" />
                </div>
              )}
            </>
          )}

          <p className="protonote">
            Design prototype · mock data only · hand-rolled look-alikes of lt-components, not the real library
          </p>
        </main>
      </div>

      {rangeOpen && (
        <DateRangeModal initialFrom="2026-09-04" initialTo={TODAY} max={TODAY}
          onCancel={() => setRangeOpen(false)}
          onApply={(from, to) => {
            setCustom({ from, to, label: fmtRange(from, to) })
            setDatePreset('custom')
            setRangeOpen(false)
          }} />
      )}

      <div aria-live="polite" className="vh">{announce}</div>
    </div>
  )
}
