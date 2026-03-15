import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { useEffect, useRef, useState, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Cinzel:wght@400;600;700&family=Jost:wght@200;300;400;500&display=swap');

  :root {
    --brand:       #8B6F47;
    --brand-dark:  #4A3728;
    --brand-light: #FDF8F3;
    --gold:        #C9A96E;
    --gold-dim:    rgba(201,169,110,0.16);
    --smoke:       #F5EFE8;
    --muted:       #7A6555;
    --ink:         #1C1008;
    --sidebar-w:   272px;
  }

  @keyframes dlFadeUp   { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
  @keyframes dlSlideL   { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
  @keyframes dlFadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes dlRotateGem{ 0%,100%{transform:rotate(45deg) scale(1)} 50%{transform:rotate(45deg) scale(1.5)} }
  @keyframes dlLineGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes dlPulseRing{ 0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,0)} 50%{box-shadow:0 0 0 6px rgba(201,169,110,0.1)} }
  @keyframes dlShimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes dlSpinRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes dlSlideIn  { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
  @keyframes dlTopBar   { from{transform:scaleX(0);transform-origin:left} to{transform:scaleX(1);transform-origin:left} }
  @keyframes dlFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes dlContentIn{ from{opacity:0;transform:translateY(24px) scale(.99)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes dlImgReveal{ from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }

  /* ── LAYOUT SHELL ── */
  .dl-shell {
    display:flex; min-height:100vh;
    background:var(--brand-light);
    font-family:'Jost',sans-serif;
  }

  /* ── SIDEBAR ── */
  .dl-sidebar {
    width:var(--sidebar-w); flex-shrink:0;
    background:var(--brand-dark);
    display:flex; flex-direction:column;
    position:fixed; top:0; left:0; bottom:0; z-index:100;
    overflow:hidden;
    transition:transform .45s cubic-bezier(.23,1,.32,1);
    animation:dlSlideL .6s cubic-bezier(.23,1,.32,1) both;
  }
  /* decorative background text */
  .dl-sidebar::before {
    content:'CHAPTER';
    position:absolute; bottom:-20px; left:-10px;
    font-family:'Cormorant Garamond',serif; font-size:130px; font-weight:700;
    color:rgba(201,169,110,.03); white-space:nowrap; pointer-events:none; letter-spacing:-.02em;
  }
  /* subtle vertical line */
  .dl-sidebar::after {
    content:''; position:absolute; right:0; top:0; bottom:0;
    width:1px; background:linear-gradient(to bottom,transparent,rgba(201,169,110,.15) 30%,rgba(201,169,110,.15) 70%,transparent);
  }

  /* sidebar header */
  .dl-sidebar-hdr {
    padding:32px 28px 24px;
    border-bottom:1px solid rgba(201,169,110,.1);
    position:relative; z-index:1;
  }
  .dl-sidebar-logo { display:flex; align-items:center; gap:12px; text-decoration:none; }
  .dl-sidebar-gem  { width:8px; height:8px; background:var(--gold); transform:rotate(45deg); animation:dlRotateGem 5s ease-in-out infinite; flex-shrink:0; }
  .dl-sidebar-brand{
    font-family:'Cinzel',serif; font-size:11px; font-weight:700;
    letter-spacing:.24em; text-transform:uppercase; color:#fff; line-height:1.3; display:block;
  }
  .dl-sidebar-sub  {
    font-family:'Cormorant Garamond',serif; font-style:italic; font-size:.82rem;
    color:var(--gold); letter-spacing:.1em; margin-top:2px; display:block;
  }

  /* user block */
  .dl-user-block {
    padding:20px 28px; display:flex; align-items:center; gap:12px;
    border-bottom:1px solid rgba(201,169,110,.08);
    position:relative; z-index:1;
  }
  .dl-user-avatar {
    width:40px; height:40px; border-radius:50%;
    background:rgba(201,169,110,.15); border:1.5px solid rgba(201,169,110,.35);
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
    animation:dlPulseRing 4s ease-in-out infinite;
  }
  .dl-user-initial { font-family:'Cormorant Garamond',serif; font-size:1.15rem; color:var(--gold); font-weight:300; line-height:1; }
  .dl-user-name    { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.3em; color:#fff; text-transform:uppercase; display:block; margin-bottom:3px; }
  .dl-user-tag     { font-size:.72rem; color:rgba(253,248,243,.35); font-weight:300; display:block; }

  /* nav section label */
  .dl-nav-lbl {
    font-family:'Cinzel',serif; font-size:7.5px; letter-spacing:.44em;
    text-transform:uppercase; color:rgba(201,169,110,.4);
    padding:20px 28px 8px; display:block; position:relative; z-index:1;
  }

  /* nav items */
  .dl-nav { flex:1; overflow-y:auto; position:relative; z-index:1; padding-bottom:16px; }
  .dl-nav-link {
    display:flex; align-items:center; gap:14px;
    padding:14px 28px; text-decoration:none;
    font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.34em;
    text-transform:uppercase; font-weight:500;
    color:rgba(253,248,243,.52);
    border-left:2px solid transparent;
    transition:all .35s cubic-bezier(.23,1,.32,1);
    position:relative; overflow:hidden;
  }
  .dl-nav-link::before {
    content:''; position:absolute; inset:0;
    background:rgba(255,255,255,.04); opacity:0; transition:opacity .35s ease;
  }
  .dl-nav-link:hover { color:rgba(253,248,243,.9); border-left-color:var(--gold-dim); padding-left:34px; }
  .dl-nav-link:hover::before { opacity:1; }
  .dl-nav-link.active {
    color:#fff; border-left-color:var(--gold);
    background:rgba(201,169,110,.07); padding-left:34px;
  }
  .dl-nav-link.active::after {
    content:''; position:absolute; top:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg,var(--gold),transparent);
    animation:dlTopBar .4s ease both;
  }
  .dl-nav-icon {
    width:32px; height:32px; border:1px solid rgba(201,169,110,.14);
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
    transition:all .35s ease;
  }
  .dl-nav-link:hover .dl-nav-icon,
  .dl-nav-link.active .dl-nav-icon { border-color:rgba(201,169,110,.35); background:rgba(201,169,110,.1); }
  .dl-nav-icon svg { transition:transform .35s ease; }
  .dl-nav-link:hover .dl-nav-icon svg,
  .dl-nav-link.active .dl-nav-icon svg { transform:scale(1.15); }
  .dl-nav-arrow {
    margin-left:auto; opacity:0; transform:translateX(-6px);
    transition:all .35s ease; flex-shrink:0;
  }
  .dl-nav-link:hover .dl-nav-arrow,
  .dl-nav-link.active .dl-nav-arrow { opacity:1; transform:translateX(0); }

  /* sidebar divider */
  .dl-sidebar-div { height:1px; background:linear-gradient(90deg,transparent,rgba(201,169,110,.12),transparent); margin:8px 0; }

  /* sidebar venue card */
  .dl-sidebar-venue {
    margin:16px 20px; position:relative; overflow:hidden; height:110px;
    border:1px solid rgba(201,169,110,.1);
    animation:dlFloat 6s ease-in-out infinite;
  }
  .dl-sidebar-venue-img { width:100%; height:100%; object-fit:cover; display:block; filter:saturate(.7) brightness(.55); }
  .dl-sidebar-venue-grad { position:absolute; inset:0; background:linear-gradient(to top,rgba(28,16,8,.88) 0%,transparent 60%); }
  .dl-sidebar-venue-info { position:absolute; bottom:0; left:0; right:0; padding:12px 14px; }
  .dl-sidebar-venue-tag  { font-family:'Cinzel',serif; font-size:7px; letter-spacing:.36em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:3px; }
  .dl-sidebar-venue-name { font-family:'Cormorant Garamond',serif; font-size:.95rem; color:#fff; font-weight:300; }

  /* logout */
  .dl-logout-wrap { padding:16px 20px 28px; position:relative; z-index:1; }
  .dl-logout-btn {
    width:100%; display:flex; align-items:center; gap:12px;
    padding:13px 20px; font-family:'Cinzel',serif; font-size:8.5px;
    letter-spacing:.34em; text-transform:uppercase; font-weight:600;
    background:none; border:1px solid rgba(180,50,50,.2); cursor:pointer;
    color:rgba(255,120,120,.55); transition:all .35s ease;
  }
  .dl-logout-btn:hover { background:rgba(180,50,50,.07); border-color:rgba(180,50,50,.4); color:#e07070; }
  .dl-logout-btn svg { flex-shrink:0; transition:transform .35s ease; }
  .dl-logout-btn:hover svg { transform:translateX(3px); }

  /* sidebar footer stamp */
  .dl-sidebar-stamp {
    padding:0 28px 24px; display:flex; align-items:center; gap:8px;
    position:relative; z-index:1;
  }
  .dl-stamp-gem  { width:4px; height:4px; background:rgba(201,169,110,.3); transform:rotate(45deg); }
  .dl-stamp-text { font-family:'Cinzel',serif; font-size:7px; letter-spacing:.34em; color:rgba(201,169,110,.3); text-transform:uppercase; }

  /* ── MOBILE HEADER ── */
  .dl-mobile-hdr {
    display:none; background:var(--brand-dark); padding:16px 20px;
    align-items:center; justify-content:space-between;
    border-bottom:1px solid rgba(201,169,110,.1); position:sticky; top:0; z-index:50;
  }
  .dl-mobile-logo-wrap { display:flex; align-items:center; gap:10px; }
  .dl-mobile-gem  { width:6px; height:6px; background:var(--gold); transform:rotate(45deg); animation:dlRotateGem 5s ease-in-out infinite; }
  .dl-mobile-logo { font-family:'Cinzel',serif; font-size:10px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:#fff; }
  .dl-mobile-nav-row {
    display:none; overflow-x:auto; background:var(--brand-dark);
    padding:8px 16px 16px; gap:8px;
    border-bottom:1px solid rgba(201,169,110,.1);
    scrollbar-width:none;
  }
  .dl-mobile-nav-row::-webkit-scrollbar { display:none; }
  .dl-mobile-link {
    display:flex; align-items:center; gap:8px; padding:10px 16px;
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.3em;
    text-transform:uppercase; text-decoration:none; white-space:nowrap;
    color:rgba(253,248,243,.52); border:1px solid rgba(201,169,110,.1);
    transition:all .3s ease; flex-shrink:0;
  }
  .dl-mobile-link.active { color:var(--gold); border-color:var(--gold); background:rgba(201,169,110,.07); }
  .dl-mobile-link:hover  { color:rgba(253,248,243,.9); border-color:rgba(201,169,110,.28); }

  /* ── MAIN CONTENT ── */
  .dl-main {
    flex:1; margin-left:var(--sidebar-w);
    min-height:100vh; display:flex; flex-direction:column;
  }

  /* top breadcrumb strip */
  .dl-topbar {
    background:#fff; border-bottom:1px solid rgba(139,111,71,.1);
    padding:0 clamp(24px,4vw,48px); height:56px;
    display:flex; align-items:center; justify-content:space-between;
    position:sticky; top:0; z-index:40;
    box-shadow:0 1px 0 rgba(139,111,71,.06), 0 4px 16px rgba(74,55,40,.05);
  }
  .dl-breadcrumb { display:flex; align-items:center; gap:10px; }
  .dl-breadcrumb-home {
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.3em;
    text-transform:uppercase; color:var(--muted); text-decoration:none;
    transition:color .3s ease;
  }
  .dl-breadcrumb-home:hover { color:var(--brand); }
  .dl-breadcrumb-sep { width:12px; height:1px; background:rgba(139,111,71,.25); }
  .dl-breadcrumb-current { font-family:'Cinzel',serif; font-size:8px; letter-spacing:.3em; text-transform:uppercase; color:var(--brand-dark); }
  .dl-topbar-right { display:flex; align-items:center; gap:16px; }
  .dl-topbar-date  { font-family:'Cinzel',serif; font-size:7.5px; letter-spacing:.3em; text-transform:uppercase; color:var(--muted); }
  .dl-topbar-btn   {
    width:32px; height:32px; border:1px solid rgba(139,111,71,.18);
    display:flex; align-items:center; justify-content:center;
    transition:all .3s ease; cursor:pointer; background:none;
  }
  .dl-topbar-btn:hover { border-color:var(--gold); background:var(--smoke); }

  /* page content */
  .dl-content {
    flex:1; padding:clamp(28px,4vw,48px) clamp(24px,4vw,48px);
    animation:dlContentIn .6s cubic-bezier(.23,1,.32,1) both;
  }
  .dl-content-inner { max-width:1100px; margin:0 auto; }

  /* ── WELCOME CARD ── */
  .dl-welcome {
    background:var(--brand-dark); padding:clamp(28px,4vw,44px);
    position:relative; overflow:hidden; margin-bottom:28px;
  }
  .dl-welcome::before {
    content:'PORTAL'; position:absolute; right:-10px; bottom:-20px;
    font-family:'Cormorant Garamond',serif; font-size:120px; font-weight:700;
    color:rgba(201,169,110,.04); white-space:nowrap; pointer-events:none;
  }
  .dl-welcome-inner { position:relative; z-index:1; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px; }
  .dl-welcome-text  {}
  .dl-welcome-eyebrow { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.42em; text-transform:uppercase; color:var(--gold); display:block; margin-bottom:10px; }
  .dl-welcome-h1  { font-family:'Cormorant Garamond',serif; font-size:clamp(1.8rem,3vw,2.6rem); font-weight:300; color:#fff; line-height:1.12; margin-bottom:8px; }
  .dl-welcome-h1 em { font-style:italic; color:var(--gold); }
  .dl-welcome-sub { font-size:.875rem; color:rgba(253,248,243,.52); font-weight:300; line-height:1.7; }
  .dl-welcome-img-wrap { flex-shrink:0; }
  .dl-welcome-img { width:160px; height:100px; object-fit:cover; display:block; filter:saturate(.7) brightness(.65); border:1px solid rgba(201,169,110,.15); }
  .dl-welcome-ornament { display:flex; align-items:center; gap:10px; margin-top:16px; }
  .dl-welcome-line { height:1px; width:40px; background:linear-gradient(90deg,var(--gold),transparent); }
  .dl-welcome-gem  { width:5px; height:5px; background:var(--gold); transform:rotate(45deg); animation:dlRotateGem 4s ease-in-out infinite; }

  /* ── QUICK STATS ── */
  .dl-qs-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:3px; margin-bottom:28px; }
  .dl-qs-card {
    background:#fff; padding:28px 24px; position:relative; overflow:hidden;
    border:1px solid rgba(139,111,71,.09); transition:all .4s ease;
  }
  .dl-qs-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);
    transform:scaleX(0); transform-origin:left; transition:transform .5s ease;
  }
  .dl-qs-card:hover { transform:translateY(-4px); box-shadow:0 16px 48px rgba(74,55,40,.1); }
  .dl-qs-card:hover::before { transform:scaleX(1); }
  .dl-qs-num   { font-family:'Cormorant Garamond',serif; font-size:2.8rem; color:var(--brand-dark); font-weight:300; display:block; line-height:1; margin-bottom:8px; }
  .dl-qs-label { font-family:'Cinzel',serif; font-size:8px; letter-spacing:.36em; color:var(--muted); text-transform:uppercase; display:block; }
  .dl-qs-icon  {
    position:absolute; top:20px; right:20px; width:36px; height:36px;
    border:1px solid var(--gold-dim); display:flex; align-items:center; justify-content:center;
  }
  .dl-qs-card:nth-child(2) { background:var(--brand-dark); }
  .dl-qs-card:nth-child(2) .dl-qs-num   { color:var(--gold); }
  .dl-qs-card:nth-child(2) .dl-qs-label { color:rgba(253,248,243,.45); }
  .dl-qs-card:nth-child(2) .dl-qs-icon  { border-color:rgba(201,169,110,.2); }

  /* ── MAIN CHILDREN AREA ── */
  .dl-children-wrap { background:#fff; border:1px solid rgba(139,111,71,.08); min-height:400px; }

  /* ── RESPONSIVE ── */
  @media(max-width:900px) {
    .dl-sidebar   { transform:translateX(-100%); }
    .dl-main      { margin-left:0; }
    .dl-mobile-hdr{ display:flex; }
    .dl-mobile-nav-row { display:flex; }
    .dl-topbar    { display:none; }
  }
`;

/* ─────────────────────────────────────────────────────────────
   NAV ICONS  (SVG — no emojis)
───────────────────────────────────────────────────────────── */
const NAV_ICONS = {
  Dashboard: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  'My Enquiries': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  'My Bookings': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="1"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  Profile: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
};

const LOGOUT_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT  —  all original logic 100% preserved
───────────────────────────────────────────────────────────── */
export default function DashboardLayout({ children }) {
  /* ── original logic ── */
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('https://weddings-backend.onrender.com/api/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  /* ── original navItems — icons replaced with SVG components ── */
  const navItems = [
    { name: 'Dashboard',     path: '/dashboard' },
    { name: 'My Enquiries',  path: '/dashboard/enquiries' },
    { name: 'My Bookings',   path: '/dashboard/bookings' },
    { name: 'Profile',       path: '/dashboard/profile' },
  ];

  /* ── derived ── */
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'W';
  const currentNav  = navItems.find(n => n.path === location.pathname);
  const today = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });

  return (
    <>
      <style>{STYLES}</style>

      {/* ── MOBILE TOP HEADER ── */}
      <div className="dl-mobile-hdr">
        <div className="dl-mobile-logo-wrap">
          <div className="dl-mobile-gem" />
          <span className="dl-mobile-logo">Client Portal</span>
        </div>
        <button
          onClick={handleLogout}
          style={{ background:'none', border:'1px solid rgba(201,169,110,.2)', padding:'7px 12px', cursor:'pointer', fontFamily:"'Cinzel',serif", fontSize:'8px', letterSpacing:'.3em', textTransform:'uppercase', color:'rgba(253,248,243,.55)', transition:'all .3s ease' }}
        >
          Logout
        </button>
      </div>

      {/* ── MOBILE NAV ROW ── */}
      <div className="dl-mobile-nav-row">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`dl-mobile-link${location.pathname === item.path ? ' active' : ''}`}
          >
            <span style={{ flexShrink:0 }}>{NAV_ICONS[item.name]}</span>
            {item.name}
          </Link>
        ))}
      </div>

      {/* ── MAIN SHELL ── */}
      <div className="dl-shell">

        {/* ══════════ SIDEBAR ══════════ */}
        <aside className="dl-sidebar" role="complementary" aria-label="Dashboard navigation">

          {/* Logo */}
          <div className="dl-sidebar-hdr">
            <Link to="/" className="dl-sidebar-logo">
              <div className="dl-sidebar-gem" />
              <div>
                <span className="dl-sidebar-brand">Wedding Chapter</span>
                <span className="dl-sidebar-sub">Client Portal</span>
              </div>
            </Link>
          </div>

          {/* User block */}
          {user && (
            <div className="dl-user-block">
              <div className="dl-user-avatar">
                <span className="dl-user-initial">{userInitial}</span>
              </div>
              <div>
                <span className="dl-user-name">{user.name || 'Guest'}</span>
                <span className="dl-user-tag">{user.email || 'Member'}</span>
              </div>
            </div>
          )}

          {/* Nav */}
          <nav className="dl-nav" aria-label="Dashboard links">
            <span className="dl-nav-lbl">Navigation</span>

            {/* ── original navItems .map() — logic unchanged ── */}
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`dl-nav-link${isActive ? ' active' : ''}`}
                >
                  <div className="dl-nav-icon">
                    {NAV_ICONS[item.name]}
                  </div>
                  {item.name}
                  <svg className="dl-nav-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}

            <div className="dl-sidebar-div" />
            <span className="dl-nav-lbl">Quick Access</span>

            <Link to="/book" className="dl-nav-link">
              <div className="dl-nav-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </div>
              Book a Date
              <svg className="dl-nav-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <Link to="/vendors" className="dl-nav-link">
              <div className="dl-nav-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              Vendors Directory
              <svg className="dl-nav-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </nav>

          {/* Sidebar venue card */}
          <div className="dl-sidebar-venue">
            <img
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=75"
              alt="Grand Rosewood"
              className="dl-sidebar-venue-img"
              loading="lazy"
            />
            <div className="dl-sidebar-venue-grad" />
            <div className="dl-sidebar-venue-info">
              <span className="dl-sidebar-venue-tag">Featured Venue</span>
              <span className="dl-sidebar-venue-name">The Grand Rosewood</span>
            </div>
          </div>

          {/* Logout — original onClick handler preserved */}
          <div className="dl-logout-wrap">
            <button onClick={handleLogout} className="dl-logout-btn">
              {LOGOUT_ICON}
              Logout
            </button>
          </div>

          {/* Sidebar stamp */}
          <div className="dl-sidebar-stamp">
            <div className="dl-stamp-gem" />
            <span className="dl-stamp-text">Est. 2017 &nbsp;·&nbsp; Premium Collective</span>
          </div>

        </aside>

        {/* ══════════ MAIN CONTENT ══════════ */}
        <div className="dl-main">

          {/* Top bar */}
          <div className="dl-topbar">
            <div className="dl-breadcrumb">
              <Link to="/" className="dl-breadcrumb-home">Home</Link>
              <div className="dl-breadcrumb-sep" />
              <Link to="/dashboard" className="dl-breadcrumb-home">Dashboard</Link>
              {currentNav && currentNav.path !== '/dashboard' && (
                <>
                  <div className="dl-breadcrumb-sep" />
                  <span className="dl-breadcrumb-current">{currentNav.name}</span>
                </>
              )}
            </div>
            <div className="dl-topbar-right">
              <span className="dl-topbar-date">{today}</span>
              <button className="dl-topbar-btn" aria-label="Notifications">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Page content */}
          <div className="dl-content">
            <div className="dl-content-inner">

              {/* Welcome banner */}
              <div className="dl-welcome" style={{ marginBottom:28 }}>
                <div className="dl-welcome-inner">
                  <div className="dl-welcome-text">
                    <span className="dl-welcome-eyebrow">Welcome back</span>
                    <h1 className="dl-welcome-h1">
                      {user?.name?.split(' ')[0] || 'Hello'},<br />
                      <em>Your Chapter Awaits</em>
                    </h1>
                    <p className="dl-welcome-sub">
                      Manage your bookings, enquiries, and profile — all in one place.
                    </p>
                    <div className="dl-welcome-ornament">
                      <div className="dl-welcome-line" />
                      <div className="dl-welcome-gem" />
                    </div>
                  </div>
                  <div className="dl-welcome-img-wrap">
                    <img
                      src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=75"
                      alt=""
                      className="dl-welcome-img"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="dl-qs-grid" style={{ marginBottom:28 }}>
                {[
                  { num:'0', label:'Active Bookings', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="1"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
                  { num:'0', label:'Pending Enquiries', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,.7)" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
                  { num:'—', label:'Next Event', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
                  { num:'—', label:'Venues Browsed', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
                ].map(({ num, label, icon }, i) => (
                  <div className="dl-qs-card" key={i}>
                    <div className="dl-qs-icon">{icon}</div>
                    <span className="dl-qs-num">{num}</span>
                    <span className="dl-qs-label">{label}</span>
                  </div>
                ))}
              </div>

              {/* ── CHILDREN — original {children} preserved ── */}
              <div className="dl-children-wrap">
                {children}
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
}