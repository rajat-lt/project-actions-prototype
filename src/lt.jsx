// Hand-rolled look-alikes of the lt-components primitives this page needs.
// The real library (@lambdatestincprivate/lt-components) is private and is
// deliberately NOT used here; visuals follow design-context/TOKENS.md values
// and the Primer foundation the library is built on.
import React, { useEffect, useRef, useState } from 'react'

/* ---------------- icons (16px, stroke-based) ---------------- */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="7" cy="7" r="4.5" {...S} />
    <path d="M10.5 10.5 14 14" {...S} />
  </svg>
)
export const ChevronDown = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 6l4 4 4-4" {...S} strokeWidth="1.8" />
  </svg>
)
export const ChevronRight = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
    <path d="M6 4l4 4-4 4" {...S} strokeWidth="1.8" />
  </svg>
)
export const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 8.5l3.2 3.2L13 5" {...S} strokeWidth="1.8" />
  </svg>
)
export const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 4l8 8M12 4l-8 8" {...S} strokeWidth="1.8" />
  </svg>
)
export const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 2a4 4 0 0 0-4 4v2.5L2.8 10.7a.6.6 0 0 0 .5 1h9.4a.6.6 0 0 0 .5-1L12 8.5V6a4 4 0 0 0-4-4Z" {...S} />
    <path d="M6.8 13.5a1.3 1.3 0 0 0 2.4 0" {...S} />
  </svg>
)
export const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="6" {...S} />
    <path d="M8 4.5V8l2.4 1.6" {...S} />
  </svg>
)
export const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 1.8 15 13.5H1L8 1.8Z" {...S} />
    <path d="M8 6.2v3.2" {...S} strokeWidth="1.8" />
    <circle cx="8" cy="11.6" r="0.9" fill="currentColor" stroke="none" />
  </svg>
)
/* Announcements — megaphone intent, deliberately unlike the bell beside it
   (guidelines/lticonbutton.md; topbar.md open question 5). */
export const MegaphoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M13.5 2.5v11L5 10.8V5.2L13.5 2.5Z" {...S} />
    <path d="M5 5.2H3.2A1.7 1.7 0 0 0 1.5 7v2a1.7 1.7 0 0 0 1.7 1.7H5" {...S} />
    <path d="M6.4 11.2v2.3" {...S} />
  </svg>
)
export const CreditsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="6" {...S} />
    <path d="M9.8 6.1a2.4 2.4 0 1 0 0 3.8" {...S} />
  </svg>
)

/* Platform glyphs. icons.md is still pending, so these are named by intent and
   drawn to be distinguishable — not verified lucide names. */
const NAV_PATHS = {
  home: 'M2.5 7.2 8 2.8l5.5 4.4v6a.8.8 0 0 1-.8.8H3.3a.8.8 0 0 1-.8-.8Z',
  kaneai: 'M8 2.2 9.5 6 13.3 7.5 9.5 9 8 12.8 6.5 9 2.7 7.5 6.5 6Z',
  'kane-cli': 'M3 3.5h10v9H3Z M5.2 6.4 7 8.2l-1.8 1.8 M8.8 10.2h2.4',
  'test-manager': 'M4 2.5h8v11H4Z M6 5.5h4 M6 8h4 M6 10.5h2.5',
  'agent-testing': 'M5 5.5h6v6H5Z M8 2.5v3 M2.8 8.5h2.2 M11 8.5h2.2 M6.6 8h.01 M9.4 8h.01',
  'real-time': 'M5.5 2.5h5v11h-5Z M7 12.2h2',
  'real-device': 'M4.5 2.5h7v11h-7Z M7 4.3h2',
  automation: 'M8 2.5v3 M8 10.5v3 M2.5 8h3 M10.5 8h3 M5.6 5.6h4.8v4.8H5.6Z',
  smartui: 'M2.5 3.5h11v9h-11Z M2.5 6.5h11 M5.5 6.5v6',
  hyperexecute: 'M9 2.2 4 9h3.4l-.6 4.8L12 7H8.6Z',
  insights: 'M3 12.5V8 M6.5 12.5V4.5 M10 12.5v-5 M13.5 12.5v-9',
  accessibility: 'M8 4.2a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z M3.5 6.2 8 7l4.5-.8 M8 7v3 M8 10l-2 3.6 M8 10l2 3.6',
  'web-scanner': 'M8 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z M2.4 8h11.2 M8 2.2a9 9 0 0 1 0 11.6 M8 2.2a9 9 0 0 0 0 11.6',
  'more-tools': 'M4 8h.01 M8 8h.01 M12 8h.01',
  settings: 'M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z M13 8a5 5 0 0 0-.1-1l1.3-1-1.5-2.6-1.5.6a5 5 0 0 0-1.7-1L9.2 1.4H6.8L6.5 3a5 5 0 0 0-1.7 1l-1.5-.6L1.8 6l1.3 1a5 5 0 0 0 0 2l-1.3 1 1.5 2.6 1.5-.6a5 5 0 0 0 1.7 1l.3 1.6h2.4l.3-1.6a5 5 0 0 0 1.7-1l1.5.6 1.5-2.6-1.3-1c.06-.33.1-.66.1-1Z',
  help: 'M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z M6 6a2 2 0 0 1 3.9.6c0 1.3-1.9 1.6-1.9 2.6 M8 11.4v.2',
  credentials: 'M6.4 9.6a2.9 2.9 0 1 1 2-2L13.5 3l1 1-1 1 1 1-1.4 1.4-1-1-2.2 2.2Z',
  'quick-actions': 'M9 2.2 4 9h3.4l-.6 4.8L12 7H8.6Z',
  /* Collapsed-rail placeholders — the pattern does not name Test Manager's
     four product icons (platform-sidebar.md open question 3). */
  a: 'M2.5 8 8 2.5 13.5 8 8 13.5Z',
  b: 'M8 2.5v4 M5 13.5h6L9.5 6.5h-3Z',
  c: 'M3 3h4v4H3Z M9 3h4v4H9Z M3 9h4v4H3Z M9 9h4v4H9Z',
}

const glyph = id => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d={NAV_PATHS[id] ?? NAV_PATHS.a} fill="none" stroke="currentColor"
      strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
export const NavGlyph = ({ id }) => glyph(id)
export const RailGlyph = ({ id }) => glyph(id)

/* ---------------- status icons (12-status vocabulary subset) ----------------
   Glyphs follow the Status component descriptions in mock-data.md:
   queued = purple circle + stacked lines · running = blue partial ring (spinner)
   completed = grey circle + tick · failed = red circle + cross            */
export function StatusIcon({ status, size = 16 }) {
  const w = { width: size, height: size }
  if (status === 'running') return (
    <svg {...w} viewBox="0 0 16 16" className="spin" aria-hidden="true">
      <circle cx="8" cy="8" r="6.2" fill="none" stroke="#0969DA" strokeWidth="2.4"
        strokeDasharray="29 10" strokeLinecap="round" />
    </svg>
  )
  if (status === 'queued') return (
    <svg {...w} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="#8250df" />
      <path d="M4.8 5.6h6.4M4.8 8h6.4M4.8 10.4h6.4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
  if (status === 'failed') return (
    <svg {...w} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="#d1242f" />
      <path d="M5.3 5.3l5.4 5.4M10.7 5.3l-5.4 5.4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
  return ( /* completed */
    <svg {...w} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="#6e7781" />
      <path d="M4.6 8.4l2.3 2.3 4.5-5" fill="none" stroke="#fff" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ---------------- primitives ---------------- */
export function Btn({ variant = '', size = '', caret = false, counter, leading, className = '', children, ...rest }) {
  return (
    <button type="button" className={`btn ${variant} ${size} ${className}`.trim()} {...rest}>
      {leading}
      <span>{children}</span>
      {counter != null && <span className="counter">{counter}</span>}
      {caret && <span className="caret"><ChevronDown /></span>}
    </button>
  )
}

/* Initials only, never an image (mock-data.md). */
export const Avatar = ({ initials, name, size = 24 }) => (
  <span className="avatar" role="img" aria-label={name}
    style={{ width: size, height: size, fontSize: size >= 32 ? 12 : 10 }}>{initials}</span>
)

/* Names an icon-only button on hover AND keyboard focus — the primary purpose
   of LTTooltip (guidelines/lttooltip.md). Every icon button in the shell has one. */
export const Tip = ({ label, side = 's', children }) => (
  <span className={`tip-wrap tip-${side}`}>
    {children}
    <span className="tip" role="tooltip">{label}</span>
  </span>
)

/* Unread count on the bell: LTNotificationIndicator counter geometry — badge at
   the icon button's top-right, hidden at zero, capped at 99
   (notifications/notification-center.md §3.1). */
export const Badge = ({ count, max = 99 }) =>
  count > 0 ? <span className="badge" aria-hidden="true">{count > max ? `${max}+` : count}</span> : null

export function SearchInput({ value, onChange, placeholder, ariaLabel }) {
  return (
    <div className="search">
      <SearchIcon />
      <input type="search" value={value} placeholder={placeholder} aria-label={ariaLabel}
        onChange={e => onChange(e.target.value)} />
      {value && (
        <button type="button" className="clear" aria-label="Clear search" onClick={() => onChange('')}>
          <XIcon />
        </button>
      )}
    </div>
  )
}

/* Mirrors LTProgressBar.Transition. The smooth fill is `animated` TOGETHER with
   transition SMOOTH — what `animated` does alone is undocumented, so both are
   always set (guidelines/ltprogressbar.md, story-verified 11 Sep 2026). */
export const TRANSITION = { SMOOTH: 'smooth' }

/* A solid fill that glides to each new value. Never a diagonal striped or
   barber-pole texture: a looping texture reads as indeterminate activity,
   which is the opposite of what a determinate bar claims. */
export function ProgressBar({ pct, animated = false, transition, label }) {
  const smooth = animated && transition === TRANSITION.SMOOTH
  return (
    <div className="pbar" role="progressbar" aria-valuemin={0} aria-valuemax={100}
      aria-valuenow={pct} aria-label={label}>
      <div className={`pbar-fill${smooth ? ' smooth' : ''}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export const BlankSlate = ({ heading, description }) => (
  <div className="blank"><h3>{heading}</h3><p>{description}</p></div>
)

export const Loader = ({ small = false, label = 'Loading' }) => (
  <span className={`loader${small ? ' small' : ''}`} role="status" aria-label={label} />
)

export const Flash = ({ children }) => (
  <div className="flash" role="alert"><AlertIcon />{children}</div>
)

export function UnderlineNav({ tabs, ariaLabel }) {
  return (
    <nav className="unav" aria-label={ariaLabel}>
      {tabs.map(t => (
        <button key={t.id} type="button" className={`unav-item${t.active ? ' active' : ''}`}
          aria-current={t.active ? 'page' : undefined} aria-disabled={t.active ? undefined : 'true'}>
          {t.label}
          {t.counter != null && <span className="counter">{t.counter}</span>}
        </button>
      ))}
    </nav>
  )
}

/* ---------------- overlays ---------------- */
function useDismiss(ref, open, onClose) {
  useEffect(() => {
    if (!open) return
    const onDown = e => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, ref])
}

/* Event type filter — LTSelectPanel-shaped: filterable multi-select with
   Reset / Apply. Closing without Apply discards the draft. */
export function SelectPanel({ label, options, applied, onApply }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(applied)
  const [q, setQ] = useState('')
  const ref = useRef(null)
  useDismiss(ref, open, () => setOpen(false))

  const toggleOpen = () => {
    if (!open) { setDraft(applied); setQ('') }
    setOpen(!open)
  }
  const toggle = opt =>
    setDraft(d => (d.includes(opt) ? d.filter(x => x !== opt) : [...d, opt]))
  const shown = options.filter(o => o.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="anchor" ref={ref}>
      <Btn caret counter={applied.length > 0 ? applied.length : undefined}
        aria-expanded={open} aria-haspopup="dialog" onClick={toggleOpen}>
        {label}
      </Btn>
      {open && (
        <div className="overlay panel" role="dialog" aria-label={`Filter by ${label.toLowerCase()}`}>
          <div className="panel-head">{label}</div>
          <div className="panel-filter">
            <input type="search" placeholder="Filter event types" aria-label="Filter event types"
              value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <div className="panel-list">
            {shown.map(opt => (
              <label key={opt} className="opt">
                <input type="checkbox" checked={draft.includes(opt)} onChange={() => toggle(opt)} />
                {opt}
              </label>
            ))}
            {shown.length === 0 && <div className="opt" aria-disabled="true">No matches</div>}
          </div>
          <div className="panel-foot">
            <Btn variant="invisible" size="small" onClick={() => setDraft([])}>Reset</Btn>
            <Btn variant="primary" size="small" onClick={() => { onApply(draft); setOpen(false) }}>Apply</Btn>
          </div>
        </div>
      )}
    </div>
  )
}

/* Date filter — LTActionMenu-shaped: button anchor, single-select presets,
   plus "Custom range…" which must open a modal (no inputs inside a menu). */
export function DateMenu({ presets, activeId, customLabel, onPick, onCustom }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useDismiss(ref, open, () => setOpen(false))

  const active = presets.find(p => p.id === activeId)
  const triggerLabel =
    activeId === 'custom' ? `Date: ${customLabel}`
      : activeId === 'all' ? 'Date'
        : `Date: ${active.label}`

  return (
    <div className="anchor" ref={ref}>
      <Btn caret aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(!open)}>
        {triggerLabel}
      </Btn>
      {open && (
        <div className="overlay menu" role="menu" aria-label="Filter by date">
          {presets.map(p => (
            <button key={p.id} type="button" role="menuitemradio" aria-checked={activeId === p.id}
              className="menu-item" onClick={() => { onPick(p.id); setOpen(false) }}>
              <span className="chk">{activeId === p.id && <CheckIcon />}</span>
              {p.label}
            </button>
          ))}
          <div className="menu-div" role="separator" />
          <button type="button" role="menuitem" className="menu-item"
            onClick={() => { setOpen(false); onCustom() }}>
            <span className="chk">{activeId === 'custom' && <CheckIcon />}</span>
            Custom range…
          </button>
        </div>
      )}
    </div>
  )
}

/* Custom date range — LTModal-shaped, 480px, two LTTimeDateSelector stand-ins. */
export function DateRangeModal({ initialFrom, initialTo, max, onCancel, onApply }) {
  const [from, setFrom] = useState(initialFrom)
  const [to, setTo] = useState(initialTo)
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])
  const valid = from && to && from <= to
  return (
    <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Filter by date">
        <div className="modal-head">
          Filter by date
          <button type="button" className="btn invisible iconbtn" aria-label="Close" onClick={onCancel}>
            <XIcon />
          </button>
        </div>
        <div className="modal-body">
          <div className="field">
            <label htmlFor="from-date">Start date</label>
            <input id="from-date" type="date" value={from} max={max} onChange={e => setFrom(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="to-date">End date</label>
            <input id="to-date" type="date" value={to} max={max} onChange={e => setTo(e.target.value)} />
          </div>
        </div>
        <div className="modal-foot">
          <Btn onClick={onCancel}>Cancel</Btn>
          <Btn variant="primary" disabled={!valid} onClick={() => valid && onApply(from, to)}>Apply</Btn>
        </div>
      </div>
    </div>
  )
}
