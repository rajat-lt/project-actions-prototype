// Platform shell — the two surfaces every LT page inherits.
// Built from design-context/patterns/platform-sidebar.md and topbar.md.
// Pages never redesign these; they supply crumbs and nav state only.
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Btn, Avatar, Tip, Badge, ChevronDown, ChevronRight, BellIcon, MegaphoneIcon,
  ClockIcon, CreditsIcon, RailGlyph, NavGlyph,
} from './lt.jsx'

/* Primary nav, in the order recorded in platform-sidebar.md §2.
   `sub: true` marks an item with sub-navigation (chevron); the rest navigate
   directly. SmartUI is one word — delta 1 in that pattern. */
const PRIMARY_NAV = [
  { id: 'home', label: 'Home' },
  { id: 'kaneai', label: 'KaneAI', sub: true },
  { id: 'kane-cli', label: 'Kane CLI' },
  { id: 'test-manager', label: 'Test Manager', sub: true },
  { id: 'agent-testing', label: 'Agent Testing' },
  { id: 'real-time', label: 'Real Time', sub: true },
  { id: 'real-device', label: 'Real Device', sub: true },
  { id: 'automation', label: 'Automation', sub: true },
  { id: 'smartui', label: 'SmartUI' },
  { id: 'hyperexecute', label: 'HyperExecute', sub: true },
  { id: 'insights', label: 'Insights', sub: true },
  { id: 'accessibility', label: 'Accessibility', sub: true },
  { id: 'web-scanner', label: 'Web Scanner', sub: true },
  { id: 'more-tools', label: 'More Tools', sub: true },
  { id: 'settings', label: 'Settings', sub: true },
]

const SECONDARY_NAV = [
  { id: 'help', label: 'Help', sub: true },
  { id: 'credentials', label: 'Credentials', sub: true },
  { id: 'quick-actions', label: 'Quick Actions', sub: true },
]

function NavItem({ item, active }) {
  return (
    <li>
      <a className={`navitem${active ? ' active' : ''}`} href="#nav"
        aria-current={active ? 'page' : undefined}
        onClick={e => e.preventDefault()}>
        <span className="navitem-icon" aria-hidden="true"><NavGlyph id={item.id} /></span>
        <span className="navitem-label">{item.label}</span>
        {item.sub && <span className="navitem-caret" aria-hidden="true"><ChevronRight /></span>}
      </a>
    </li>
  )
}

/**
 * Platform sidebar. 56px rail, expands on hover into a ~320px panel that
 * OVERLAYS the page — content never reflows (platform-sidebar.md §1). The
 * collapsed rail shows product-specific icons; the expanded panel shows the
 * 15 platform destinations, which is different content, not the same icons
 * with labels (§1, and its open question 3).
 *
 * Keyboard: the pattern records hover-only expansion as current behaviour and
 * recommends "opening on focus as well as hover, and closing on Escape" as the
 * fix that costs no visual change. This prototype implements that
 * recommendation via the brand trigger — beyond what ships today, flagged
 * rather than silent.
 */
export function PlatformSidebar({ activeProduct = 'test-manager' }) {
  const [hover, setHover] = useState(false)
  const [pinnedOpen, setPinnedOpen] = useState(false)
  const wrapRef = useRef(null)
  const brandRef = useRef(null)
  const open = hover || pinnedOpen

  const close = useCallback(() => {
    setPinnedOpen(false)
    setHover(false)
  }, [])

  const onKeyDown = e => {
    if (e.key === 'Escape' && open) {
      close()
      brandRef.current?.focus()
    }
  }

  const onBlurCapture = e => {
    if (!wrapRef.current?.contains(e.relatedTarget)) setPinnedOpen(false)
  }

  return (
    <>
      {/* 56px placeholder holds the layout; the surface below is fixed, so the
          hover expansion floats over page content instead of pushing it. */}
      <div className="rail-slot" />

      <div ref={wrapRef} className={`rail${open ? ' open' : ''}`}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onKeyDown={onKeyDown} onBlurCapture={onBlurCapture}>

        {/* Brand mark sits in the 56px corner, left of where the top bar
            starts, so it is visible in both states and never collides with the
            bar. Doubles as the keyboard route into the panel. */}
        <div className="rail-corner">
          <button ref={brandRef} type="button" className="rail-brand"
            aria-expanded={open} aria-label="TestMu AI — open platform navigation"
            onFocus={() => setPinnedOpen(true)}
            onClick={() => setPinnedOpen(v => !v)}>
            <span className="rail-mark" aria-hidden="true">T</span>
          </button>
        </div>

        {open ? (
          <>
            {/* Brand zone: wordmark, and beneath it "Formerly LambdaTest"
                (§2). Starts below the bar — the panel floats above page
                content only, never over the top bar (topbar.md §7). */}
            <div className="rail-word">
              <strong>TestMu AI</strong>
              <em>Formerly LambdaTest</em>
            </div>

            <nav className="rail-nav" aria-label="Products">
              <ul>
                {PRIMARY_NAV.map(item => (
                  <NavItem key={item.id} item={item} active={item.id === activeProduct} />
                ))}
              </ul>
            </nav>

            <hr className="rail-div" />

            <nav className="rail-secondary" aria-label="Support">
              <ul>
                {SECONDARY_NAV.map(item => <NavItem key={item.id} item={item} />)}
              </ul>
            </nav>

            {/* Orange is reserved for upgrade and marketing — canonical use.
                Full-bleed to the panel edges, not inset (§7). */}
            <button type="button" className="btn orange rail-upgrade">Upgrade Now</button>
          </>
        ) : (
          /* Collapsed rail: four product-specific icons on Test Manager. The
             pattern does not name them (open question 3), so only the active
             product — which we do know — is a labelled control; the rest are
             presentational placeholders rather than invented destinations. */
          <div className="rail-icons">
            <Tip label="Test Manager" side="e">
              <button type="button" className="rail-icon active" aria-label="Test Manager"
                aria-current="page">
                <RailGlyph id="test-manager" />
              </button>
            </Tip>
            {['a', 'b', 'c'].map(k => (
              <span key={k} className="rail-icon" aria-hidden="true"><RailGlyph id={k} /></span>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

/* Left slot: breadcrumb at depth ≥ 2, plain bold label at depth 1
   (topbar.md §1 + guidelines/ltbreadcrumbs.md). */
function Breadcrumb({ crumbs }) {
  if (crumbs.length === 1) return <p className="crumb-single">{crumbs[0].label}</p>
  return (
    <nav aria-label="Breadcrumb">
      <ol className="crumbs">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1
          return (
            <li key={c.label}>
              {i > 0 && <span className="crumb-sep" aria-hidden="true">/</span>}
              {last
                ? <span className="crumb current" aria-current="page">{c.label}</span>
                : <a className="crumb" href="#crumb" onClick={e => e.preventDefault()}>{c.label}</a>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * Platform top bar. Left slot is the breadcrumb; the right cluster is modular —
 * zero or more quota modules, a separator, product buttons, the notifications
 * bell, the avatar, then Upgrade Now, always rightmost (topbar.md §1–§5).
 * Test Manager's modules: Credits; its product buttons: Recent Tests and
 * announcements (§2).
 */
export function TopBar({ crumbs, user, credits, unreadCount = 0 }) {
  return (
    <header className="topbar">
      <Breadcrumb crumbs={crumbs} />

      <div className="topbar-right">
        {/* Quota module. "Credits: 20k" — lowercase k, no space before the
            colon; the live bar's "Credits : 4.3K" breaks both (§6 delta 1).
            The caret implies a surface whose contents are unconfirmed — §8
            open question 1 — so it opens nothing here. */}
        <Btn size="small" leading={<CreditsIcon />} caret>{`Credits: ${credits}`}</Btn>

        {/* Composed 1px rule — LTDivider documents no orientation (§8 q3). */}
        <span className="vsep" aria-hidden="true" />

        <Btn size="small" leading={<ClockIcon />}>Recent Tests</Btn>

        {/* Announcements must not read as a bell: adjacent icon buttons differ
            by clearly different glyphs (guidelines/lticonbutton.md, §8 q5).
            Megaphone intent, pending a verified name in icons.md. */}
        <Tip label="Announcements">
          <button type="button" className="btn iconbtn outline" aria-label="Announcements">
            <MegaphoneIcon />
          </button>
        </Tip>

        {/* Notifications bell — platform-scoped, constant in every product's
            bar, between the product buttons and the avatar. Badge hidden at
            zero, capped at 99. The panel it opens is specced separately in
            notifications/notification-center.md and is out of scope here. */}
        <Tip label="Notifications">
          <button type="button" className="btn iconbtn outline bell"
            aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}>
            <BellIcon />
            {unreadCount > 0 && <Badge count={unreadCount} />}
          </button>
        </Tip>

        <Avatar initials={user.initials} name={user.name} size={32} />

        <Btn variant="orange">Upgrade Now</Btn>
      </div>
    </header>
  )
}
