import { Link, useLocation } from '@tanstack/react-router';
import axios from 'axios';
import { useEffect, useState, useRef, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');

  :root {
    --brand:       #8B6F47;
    --brand-dark:  #4A3728;
    --brand-light: #FDF8F3;
    --gold:        #C9A96E;
    --gold-dim:    rgba(201,169,110,0.15);
    --smoke:       #F5EFE8;
    --muted:       #7A6555;
    --ink:         #1C1008;
    --nav-h:       72px;
  }

  @keyframes nbSlideDown { from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
  @keyframes nbFadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes nbSlideUp   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes nbUnderline { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes nbRotateGem { 0%,100%{transform:rotate(45deg) scale(1)} 50%{transform:rotate(45deg) scale(1.5)} }
  @keyframes nbShimmer   { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes nbMenuSlide { from{opacity:0;transform:translateX(100%)} to{opacity:1;transform:translateX(0)} }
  @keyframes nbMenuItemIn{ from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:translateX(0)} }
  @keyframes nbLineGrow  { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes nbPulse     { 0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,0)} 50%{box-shadow:0 0 0 6px rgba(201,169,110,0.12)} }
  @keyframes nbBadgePop  { 0%{opacity:0;transform:scale(.7)} 100%{opacity:1;transform:scale(1)} }
  @keyframes nbScrollBar { from{width:0} to{width:var(--scroll-pct,0%)} }

  /* ── NAV SHELL ── */
  .nb-root {
    position:fixed; top:0; left:0; right:0; z-index:1000;
    font-family:'Jost',sans-serif;
    background:rgba(253,248,243,.97);
    backdrop-filter:blur(16px);
    box-shadow:0 1px 0 rgba(139,111,71,.14), 0 4px 24px rgba(74,55,40,.07);
    transition:background .4s ease, box-shadow .4s ease, transform .4s ease;
  }
  .nb-root.scrolled {
    background:rgba(253,248,243,.98);
    backdrop-filter:blur(20px);
    box-shadow:0 1px 0 rgba(139,111,71,.18), 0 8px 36px rgba(74,55,40,.10);
  }
  .nb-root.hidden { transform:translateY(-100%); }
  .nb-root.top {
    background:rgba(253,248,243,.95);
    backdrop-filter:blur(12px);
    border-bottom:1px solid rgba(139,111,71,.12);
  }

  /* scroll progress */
  .nb-progress {
    position:absolute; bottom:0; left:0; height:1px;
    background:linear-gradient(90deg,var(--gold),var(--brand));
    width:0; transition:width .1s linear;
  }

  /* ── TOP BAR (announcement) ── */
  .nb-topbar {
    background:var(--brand-dark); text-align:center; padding:9px 24px;
    overflow:hidden; position:relative;
    transition:height .4s ease, padding .4s ease, opacity .4s ease;
  }
  .nb-topbar.hidden-bar { height:0; padding:0; opacity:0; overflow:hidden; }
  .nb-topbar-text {
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:.42em;
    text-transform:uppercase; color:var(--gold); display:inline-block;
  }
  .nb-topbar-gem {
    display:inline-block; width:5px; height:5px; background:var(--gold);
    transform:rotate(45deg); margin:0 18px; vertical-align:middle; opacity:.6;
  }
  .nb-topbar-close {
    position:absolute; right:16px; top:50%; transform:translateY(-50%);
    background:none; border:none; cursor:pointer; padding:4px;
    color:rgba(201,169,110,.5); transition:color .3s ease; line-height:1;
    font-family:'Cinzel',serif; font-size:11px;
  }
  .nb-topbar-close:hover { color:var(--gold); }

  /* ── MAIN NAV ── */
  .nb-main {
    height:var(--nav-h); display:flex; align-items:center; justify-content:space-between;
    padding:0 clamp(16px,4vw,48px); max-width:1500px; margin:0 auto; gap:16px;
    animation:nbSlideDown .6s cubic-bezier(.23,1,.32,1) both;
  }

  /* ── LOGO ── */
  .nb-logo {
    display:flex; align-items:center; gap:12px; text-decoration:none; flex-shrink:0;
  }
  .nb-logo-gem {
    width:8px; height:8px; background:var(--gold); transform:rotate(45deg);
    animation:nbRotateGem 5s ease-in-out infinite; flex-shrink:0;
    transition:transform .3s ease;
  }
  .nb-logo:hover .nb-logo-gem { transform:rotate(45deg) scale(1.3); }
  .nb-logo-text {
    font-family:'Cinzel',serif; font-size:clamp(11px,1.2vw,14px); font-weight:700;
    letter-spacing:.22em; text-transform:uppercase; color:var(--brand-dark);
    white-space:nowrap; transition:color .3s ease;
  }
  .nb-root.scrolled .nb-logo-text { color:var(--brand-dark); }
  .nb-root.top .nb-logo-text { color:var(--brand-dark); }
  .nb-root.top .nb-logo-gem { background:var(--gold); }

  /* ── DESKTOP LINKS ── */
  .nb-links {
    display:flex; align-items:center; gap:clamp(12px,2vw,28px);
    list-style:none; margin:0; padding:0;
  }
  .nb-link-item { position:relative; }
  .nb-link {
    font-family:'Cinzel',serif; font-size:clamp(8px,0.9vw,9.5px); letter-spacing:.36em;
    text-transform:uppercase; text-decoration:none; font-weight:500;
    color:var(--brand-dark); transition:color .3s ease; display:block; padding:4px 0;
    white-space:nowrap;
  }
  .nb-root.top .nb-link { color:var(--brand-dark); }
  .nb-root.top .nb-link:hover { color:var(--brand); }
  .nb-link::after {
    content:''; position:absolute; bottom:-2px; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);
    transform:scaleX(0); transform-origin:center; transition:transform .35s ease;
  }
  .nb-link:hover { color:var(--brand); }
  .nb-link:hover::after, .nb-link.active-link::after { transform:scaleX(1); }
  .nb-link.active-link { color:var(--brand); }
  .nb-root.top .nb-link.active-link { color:var(--brand); }

  /* vendors highlight */
  .nb-link.vendors {
    color:var(--brand); font-weight:700;
    border-bottom:1px solid var(--gold-dim); padding-bottom:2px;
  }
  .nb-root.top .nb-link.vendors { color:var(--brand); border-bottom-color:var(--gold-dim); }
  .nb-link.vendors::after { display:none; }
  .nb-link.vendors:hover { color:var(--brand-dark); }

  /* admin dashed */
  .nb-link.admin {
    font-size:8px; color:var(--muted);
    border:1px dashed rgba(139,111,71,.3); padding:4px 10px;
    transition:all .35s ease;
  }
  .nb-root.top .nb-link.admin { color:var(--muted); border-color:rgba(139,111,71,.3); }
  .nb-link.admin:hover { border-color:var(--gold); color:var(--brand); }
  .nb-link.admin::after { display:none; }

  /* ── AUTH AREA ── */
  .nb-auth { display:flex; align-items:center; gap:12px; flex-shrink:0; }
  .nb-auth-dashboard {
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:.34em;
    text-transform:uppercase; font-weight:600; text-decoration:none;
    color:var(--brand-dark); border:1px solid rgba(139,111,71,.25);
    padding:8px 16px; transition:all .35s ease; white-space:nowrap;
    background:rgba(253,248,243,.5);
  }
  .nb-auth-dashboard:hover { border-color:var(--gold); color:var(--brand); background:#fff; }
  .nb-root.top .nb-auth-dashboard { color:var(--brand-dark); border-color:rgba(139,111,71,.28); background:rgba(253,248,243,.5); }
  .nb-auth-logout {
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:.34em;
    text-transform:uppercase; font-weight:600; background:none; border:none;
    cursor:pointer; color:var(--muted); transition:color .3s ease; white-space:nowrap; padding:4px;
  }
  .nb-auth-logout:hover { color:#c0392b; }
  .nb-root.top .nb-auth-logout { color:var(--muted); }
  .nb-auth-login {
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:.34em;
    text-transform:uppercase; font-weight:600; text-decoration:none;
    color:var(--brand-dark); transition:color .3s ease; white-space:nowrap;
  }
  .nb-root.top .nb-auth-login { color:var(--brand-dark); }
  .nb-auth-login:hover { color:var(--brand); }
  .nb-auth-signup {
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:.34em;
    text-transform:uppercase; font-weight:700; text-decoration:none;
    background:var(--brand-dark); color:#fff; padding:10px 20px;
    transition:all .4s ease; white-space:nowrap; position:relative; overflow:hidden;
  }
  .nb-auth-signup::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--gold),var(--brand)); opacity:0; transition:opacity .4s ease; }
  .nb-auth-signup:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(74,55,40,.28); }
  .nb-auth-signup:hover::before { opacity:1; }
  .nb-auth-signup span { position:relative; z-index:1; }
  .nb-root.top .nb-auth-signup { background:var(--brand-dark); color:#fff; }

  /* user chip */
  .nb-user-chip {
    display:flex; align-items:center; gap:8px;
  }
  .nb-user-avatar {
    width:30px; height:30px; border-radius:50%;
    background:var(--brand-dark); border:1.5px solid var(--gold);
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0;
  }
  .nb-user-initial {
    font-family:'Cormorant Garamond',serif; font-size:.95rem;
    color:var(--gold); font-weight:300; line-height:1;
  }
  .nb-user-name {
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.3em;
    text-transform:uppercase; color:var(--brand-dark); white-space:nowrap;
  }
  .nb-root.top .nb-user-name { color:var(--brand-dark); }

  /* ── HAMBURGER ── */
  .nb-hamburger {
    display:none; flex-direction:column; gap:5px;
    background:none; border:none; cursor:pointer;
    padding:8px; width:40px; height:40px; align-items:center; justify-content:center;
    flex-shrink:0;
  }
  .nb-bar {
    width:22px; height:1.5px; background:var(--brand-dark);
    transform-origin:center; transition:all .4s cubic-bezier(.23,1,.32,1);
  }
  .nb-root.top .nb-bar { background:var(--brand-dark); }
  .nb-hamburger.open .nb-bar:nth-child(1) { transform:translateY(6.5px) rotate(45deg); }
  .nb-hamburger.open .nb-bar:nth-child(2) { opacity:0; transform:scaleX(0); }
  .nb-hamburger.open .nb-bar:nth-child(3) { transform:translateY(-6.5px) rotate(-45deg); }

  /* ── MOBILE DRAWER ── */
  .nb-drawer {
    position:fixed; top:0; right:0; bottom:0; width:min(360px,100vw);
    background:var(--brand-dark); z-index:999;
    display:flex; flex-direction:column;
    transform:translateX(100%); transition:transform .45s cubic-bezier(.23,1,.32,1);
    overflow-y:auto;
  }
  .nb-drawer.open { transform:translateX(0); }
  .nb-drawer-backdrop {
    position:fixed; inset:0; background:rgba(28,16,8,.6); z-index:998;
    opacity:0; pointer-events:none; transition:opacity .4s ease;
    backdrop-filter:blur(4px);
  }
  .nb-drawer-backdrop.open { opacity:1; pointer-events:auto; }

  .nb-drawer-header {
    padding:28px 28px 20px; display:flex; justify-content:space-between; align-items:center;
    border-bottom:1px solid rgba(201,169,110,.1);
  }
  .nb-drawer-logo {
    display:flex; align-items:center; gap:10px;
  }
  .nb-drawer-logo-gem { width:7px; height:7px; background:var(--gold); transform:rotate(45deg); animation:nbRotateGem 5s ease-in-out infinite; }
  .nb-drawer-logo-text { font-family:'Cinzel',serif; font-size:10px; letter-spacing:.28em; text-transform:uppercase; color:#fff; font-weight:700; }
  .nb-drawer-close {
    width:36px; height:36px; border:1px solid rgba(201,169,110,.2);
    background:none; cursor:pointer; display:flex; align-items:center; justify-content:center;
    transition:all .3s ease;
  }
  .nb-drawer-close:hover { background:rgba(201,169,110,.1); border-color:var(--gold); }

  /* drawer user block */
  .nb-drawer-user {
    margin:20px 28px; padding:20px; background:rgba(255,255,255,.04);
    border:1px solid rgba(201,169,110,.1); display:flex; align-items:center; gap:14px;
  }
  .nb-drawer-avatar {
    width:44px; height:44px; border-radius:50%; background:rgba(201,169,110,.15);
    border:1.5px solid rgba(201,169,110,.3); display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .nb-drawer-initial { font-family:'Cormorant Garamond',serif; font-size:1.3rem; color:var(--gold); font-weight:300; }
  .nb-drawer-uname { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.3em; color:#fff; text-transform:uppercase; display:block; margin-bottom:3px; }
  .nb-drawer-uemail { font-size:.75rem; color:rgba(253,248,243,.35); font-weight:300; font-family:'Jost',sans-serif; }

  /* drawer links */
  .nb-drawer-links { flex:1; padding:8px 0; }
  .nb-drawer-link {
    display:flex; align-items:center; justify-content:space-between;
    padding:16px 28px; font-family:'Cinzel',serif; font-size:9.5px;
    letter-spacing:.38em; text-transform:uppercase; color:rgba(253,248,243,.75);
    text-decoration:none; transition:all .3s ease; border-left:2px solid transparent;
    position:relative;
  }
  .nb-drawer-link:hover, .nb-drawer-link.active-link {
    color:#fff; background:rgba(255,255,255,.04); border-left-color:var(--gold);
    padding-left:32px;
  }
  .nb-drawer-link.vendors-mob { color:var(--gold); font-weight:700; }
  .nb-drawer-link-arrow { opacity:0; transition:opacity .3s ease, transform .3s ease; }
  .nb-drawer-link:hover .nb-drawer-link-arrow { opacity:1; transform:translateX(4px); }

  /* drawer section label */
  .nb-drawer-sec-lbl {
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.42em;
    text-transform:uppercase; color:rgba(201,169,110,.4);
    padding:20px 28px 8px; display:block;
  }

  /* drawer divider */
  .nb-drawer-div { height:1px; background:linear-gradient(90deg,transparent,rgba(201,169,110,.15),transparent); margin:8px 0; }

  /* drawer auth */
  .nb-drawer-auth { padding:20px 28px 32px; }
  .nb-drawer-auth-btn {
    display:block; text-align:center; padding:14px; font-family:'Cinzel',serif;
    font-size:9px; letter-spacing:.36em; text-transform:uppercase; font-weight:700;
    text-decoration:none; transition:all .35s ease; margin-bottom:10px;
  }
  .nb-drawer-auth-btn.primary { background:var(--gold); color:var(--brand-dark); }
  .nb-drawer-auth-btn.primary:hover { background:#fff; }
  .nb-drawer-auth-btn.outline { border:1px solid rgba(201,169,110,.3); color:rgba(253,248,243,.7); }
  .nb-drawer-auth-btn.outline:hover { border-color:var(--gold); color:#fff; }
  .nb-drawer-logout {
    width:100%; padding:14px; font-family:'Cinzel',serif; font-size:9px;
    letter-spacing:.36em; text-transform:uppercase; font-weight:600;
    background:none; border:1px solid rgba(180,50,50,.2); color:rgba(255,130,130,.6);
    cursor:pointer; transition:all .35s ease; margin-top:4px;
  }
  .nb-drawer-logout:hover { background:rgba(180,50,50,.08); border-color:rgba(180,50,50,.4); color:#e07070; }

  /* drawer footer */
  .nb-drawer-foot {
    padding:20px 28px; border-top:1px solid rgba(201,169,110,.1);
    display:flex; align-items:center; gap:10px;
  }
  .nb-drawer-foot-gem { width:5px; height:5px; background:rgba(201,169,110,.4); transform:rotate(45deg); }
  .nb-drawer-foot-text { font-family:'Cinzel',serif; font-size:7.5px; letter-spacing:.35em; color:rgba(201,169,110,.35); text-transform:uppercase; }

  /* ── RESPONSIVE ── */
  @media(max-width:1100px) {
    .nb-links .nb-link-item:nth-child(n+6):not(:last-child) { display:none; }
  }
  @media(max-width:900px) {
    .nb-links { display:none; }
    .nb-auth  { display:none; }
    .nb-hamburger { display:flex; }
  }
  @media(max-width:480px) {
    .nb-main { padding:0 16px; }
    .nb-logo-text { font-size:10px; letter-spacing:.16em; }
  }

  /* spacer so content starts below fixed nav */
  .nb-spacer { height:calc(var(--nav-h) + 36px); }
  .nb-spacer.no-topbar { height:var(--nav-h); }
`;

/* ─────────────────────────────────────────────────────────────
   NAV LINKS DATA
───────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { to: '/',         label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/plans',    label: 'Plans' },
  { to: '/portfolio',label: 'Portfolio' },
  { to: '/reviews',  label: 'Reviews' },
  { to: '/about',    label: 'About' },
  { to: '/contact',  label: 'Contact' },
];

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT  —  all original logic 100% preserved
───────────────────────────────────────────────────────────── */
export default function Navbar() {
  /* ── original state ── */
  const location = useLocation();
  const [user, setUser] = useState(null);

  /* ── new state ── */
  const [scrolled,    setScrolled]    = useState(false);
  const [hidden,      setHidden]      = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [topbarOn,    setTopbarOn]    = useState(true);
  const [scrollPct,   setScrollPct]   = useState(0);
  const lastScrollY = useRef(0);
  const progressRef = useRef(null);

  /* ── original useEffect (user sync on route change) ── */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  /* close drawer on route change */
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  /* scroll behaviour */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docH > 0 ? (y / docH) * 100 : 0);
      setScrolled(y > 40);
      setHidden(y > lastScrollY.current && y > 160);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* lock body when drawer open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  /* ── original logout handler ── */
  const handleLogout = async () => {
    try {
      await axios.post('https://weddings-backend.onrender.com/api/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  /* helpers */
  const isActive = (path) => location.pathname === path;
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'W';

  const navClass = [
    'nb-root',
    scrolled ? 'scrolled' : 'top',
    hidden   ? 'hidden'   : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <style>{STYLES}</style>

      <nav className={navClass} role="navigation" aria-label="Main navigation">

        {/* ── SCROLL PROGRESS ── */}
        <div
          className="nb-progress"
          style={{ width: `${scrollPct}%` }}
        />

        {/* ── TOP ANNOUNCEMENT BAR ── */}
        <div className={`nb-topbar${topbarOn ? '' : ' hidden-bar'}`}>
          <span className="nb-topbar-text">
            Limited dates for 2025–2026
            <span className="nb-topbar-gem" />
            Wedding Chapter &nbsp;·&nbsp; Premium Collective
            <span className="nb-topbar-gem" />
            Book your consultation today
          </span>
          <button
            className="nb-topbar-close"
            onClick={() => setTopbarOn(false)}
            aria-label="Close announcement"
          >
            &#215;
          </button>
        </div>

        {/* ── MAIN NAV ── */}
        <div className="nb-main">

          {/* LOGO — original Link to="/" preserved */}
          <Link to="/" className="nb-logo" aria-label="The Weddings Chapter — Home">
            <div className="nb-logo-gem" />
            <span className="nb-logo-text">The Weddings Chapter</span>
          </Link>

          {/* DESKTOP LINKS — all original routes preserved */}
          <ul className="nb-links" role="list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to} className="nb-link-item">
                <Link
                  to={to}
                  className={`nb-link${isActive(to) ? ' active-link' : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* original vendors link preserved */}
            <li className="nb-link-item">
              <Link
                to="/vendors"
                className={`nb-link vendors${isActive('/vendors') ? ' active-link' : ''}`}
              >
                Vendors Directory
              </Link>
            </li>

            {/* original admin link preserved */}
            <li className="nb-link-item">
              <Link to="/admin" className="nb-link admin">
                Admin Login
              </Link>
            </li>
          </ul>

          {/* DESKTOP AUTH — original conditions preserved */}
          <div className="nb-auth">
            {user ? (
              <>
                <div className="nb-user-chip">
                  <div className="nb-user-avatar">
                    <span className="nb-user-initial">{userInitial}</span>
                  </div>
                  <span className="nb-user-name">{user.name?.split(' ')[0]}</span>
                </div>
                {/* original dashboard link preserved */}
                <Link to="/dashboard" className={`nb-auth-dashboard${isActive('/dashboard') ? ' active-link' : ''}`}>
                  Dashboard
                </Link>
                {/* original logout handler preserved */}
                <button onClick={handleLogout} className="nb-auth-logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* original login link preserved */}
                <Link to="/login" className={`nb-auth-login${isActive('/login') ? ' active-link' : ''}`}>
                  Login
                </Link>
                {/* original signup link preserved */}
                <Link to="/signup" className="nb-auth-signup">
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* HAMBURGER */}
          <button
            className={`nb-hamburger${drawerOpen ? ' open' : ''}`}
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={drawerOpen}
          >
            <div className="nb-bar" />
            <div className="nb-bar" />
            <div className="nb-bar" />
          </button>

        </div>
      </nav>

      {/* ── MOBILE DRAWER BACKDROP ── */}
      <div
        className={`nb-drawer-backdrop${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ── MOBILE DRAWER ── */}
      <aside
        className={`nb-drawer${drawerOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* drawer header */}
        <div className="nb-drawer-header">
          <div className="nb-drawer-logo">
            <div className="nb-drawer-logo-gem" />
            <span className="nb-drawer-logo-text">Wedding Chapter</span>
          </div>
          <button
            className="nb-drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,.7)" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* user block */}
        {user && (
          <div className="nb-drawer-user">
            <div className="nb-drawer-avatar">
              <span className="nb-drawer-initial">{userInitial}</span>
            </div>
            <div>
              <span className="nb-drawer-uname">{user.name}</span>
              <span className="nb-drawer-uemail">{user.email}</span>
            </div>
          </div>
        )}

        {/* nav links */}
        <div className="nb-drawer-links">
          <span className="nb-drawer-sec-lbl">Navigation</span>

          {NAV_LINKS.map(({ to, label }, i) => (
            <Link
              key={to}
              to={to}
              className={`nb-drawer-link${isActive(to) ? ' active-link' : ''}`}
              style={{ animationDelay: drawerOpen ? `${i * 0.05}s` : '0s' }}
            >
              {label}
              <svg className="nb-drawer-link-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ))}

          {/* original vendors link */}
          <Link
            to="/vendors"
            className={`nb-drawer-link vendors-mob${isActive('/vendors') ? ' active-link' : ''}`}
          >
            Vendors Directory
            <svg className="nb-drawer-link-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <div className="nb-drawer-div" />

          <span className="nb-drawer-sec-lbl">Quick Links</span>

          {/* original admin link */}
          <Link to="/admin" className="nb-drawer-link" style={{ fontSize:'8.5px', color:'rgba(253,248,243,.4)' }}>
            Admin Login
            <svg className="nb-drawer-link-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,.4)" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="nb-drawer-div" />

        {/* auth block — original conditions preserved */}
        <div className="nb-drawer-auth">
          {user ? (
            <>
              <Link to="/dashboard" className="nb-drawer-auth-btn primary">
                Dashboard
              </Link>
              {/* original logout preserved */}
              <button onClick={handleLogout} className="nb-drawer-logout">
                Log Out
              </button>
            </>
          ) : (
            <>
              {/* original signup preserved */}
              <Link to="/signup" className="nb-drawer-auth-btn primary">
                Sign Up Free
              </Link>
              {/* original login preserved */}
              <Link to="/login" className="nb-drawer-auth-btn outline">
                Log In
              </Link>
            </>
          )}
        </div>

        {/* drawer footer */}
        <div className="nb-drawer-foot">
          <div className="nb-drawer-foot-gem" />
          <span className="nb-drawer-foot-text">Est. 2017 &nbsp;·&nbsp; Premium Wedding Collective</span>
        </div>
      </aside>

      {/* ── NAV SPACER ── */}
      <div className={`nb-spacer${topbarOn ? '' : ' no-topbar'}`} />
    </>
  );
}