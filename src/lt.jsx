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

export const Avatar = ({ initials, name }) => (
  <span className="avatar" role="img" aria-label={name} title={name}>{initials}</span>
)

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

export function ProgressBar({ pct, animated = false, label }) {
  return (
    <div className="pbar" role="progressbar" aria-valuemin={0} aria-valuemax={100}
      aria-valuenow={pct} aria-label={label}>
      <div className={`pbar-fill${animated ? ' animated' : ''}`} style={{ width: `${pct}%` }} />
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
