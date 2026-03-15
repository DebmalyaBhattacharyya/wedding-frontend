import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from '@tanstack/react-router';
import DashboardLayout from '../../components/DashboardLayout';

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
    --crimson:     #5C0A16;
  }

  @keyframes dbFadeUp   { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes dbSlideL   { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
  @keyframes dbSlideR   { from{opacity:0;transform:translateX(40px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes dbFadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes dbLineGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes dbRotateGem{ 0%,100%{transform:rotate(45deg) scale(1)} 50%{transform:rotate(45deg) scale(1.5)} }
  @keyframes dbShimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes dbTopBar   { from{transform:scaleX(0);transform-origin:left} to{transform:scaleX(1);transform-origin:left} }
  @keyframes dbPulseRing{ 0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,0)} 50%{box-shadow:0 0 0 8px rgba(201,169,110,0.09)} }
  @keyframes dbCountUp  { from{opacity:0;transform:translateY(16px) scale(.8)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes dbCardHover{ from{transform:perspective(800px) rotateX(0deg) rotateY(0deg)} }
  @keyframes dbFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes dbTickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes dbSpinRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes dbStatusPop{ 0%{opacity:0;transform:scale(.7)} 100%{opacity:1;transform:scale(1)} }
  @keyframes dbImgReveal{ from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }

  /* ── WELCOME BANNER ── */
  .db-welcome {
    position:relative; overflow:hidden;
    background:linear-gradient(135deg, var(--crimson) 0%, #8B2030 45%, #C08552 100%);
    padding:clamp(32px,5vw,52px); margin-bottom:28px;
    animation:dbFadeUp .7s cubic-bezier(.23,1,.32,1) both;
  }
  .db-welcome::before {
    content:'WELCOME'; position:absolute; right:-10px; bottom:-20px;
    font-family:'Cormorant Garamond',serif; font-size:160px; font-weight:700;
    color:rgba(255,255,255,.04); white-space:nowrap; pointer-events:none;
  }
  .db-welcome-grain {
    position:absolute; inset:0; opacity:.04;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:200px; pointer-events:none;
  }
  .db-welcome-grid {
    display:grid; grid-template-columns:1fr auto;
    gap:24px; align-items:center; position:relative; z-index:1;
  }
  @media(max-width:640px){ .db-welcome-grid{ grid-template-columns:1fr; } .db-welcome-img-wrap{ display:none; } }
  .db-welcome-eyebrow {
    font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.44em;
    text-transform:uppercase; color:rgba(212,175,55,.8); display:block; margin-bottom:12px;
    animation:dbFadeIn .7s .1s ease both;
  }
  .db-welcome-h1 {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2rem,4vw,3.2rem); font-weight:300; color:#fff;
    line-height:1.1; margin-bottom:10px;
    animation:dbFadeUp .8s .12s ease both;
  }
  .db-welcome-h1 .gold-name {
    font-style:italic;
    background:linear-gradient(90deg,#D4AF37,#f0d090,#D4AF37,#c8924a,#D4AF37);
    background-size:300% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    animation:dbShimmer 5s linear 1s infinite;
  }
  .db-welcome-sub {
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:.34em;
    text-transform:uppercase; color:rgba(253,248,243,.55);
    animation:dbFadeIn .8s .26s ease both;
  }
  .db-welcome-ornament { display:flex; align-items:center; gap:10px; margin-top:20px; animation:dbFadeIn .8s .38s ease both; }
  .db-welcome-line { height:1px; width:40px; background:linear-gradient(90deg,rgba(212,175,55,.6),transparent); }
  .db-welcome-gem  { width:6px; height:6px; background:rgba(212,175,55,.7); transform:rotate(45deg); animation:dbRotateGem 4s ease-in-out infinite; }
  .db-welcome-img-wrap { flex-shrink:0; }
  .db-welcome-img {
    width:180px; height:120px; object-fit:cover; display:block;
    filter:saturate(.75) brightness(.65) contrast(1.05);
    border:1px solid rgba(212,175,55,.2);
    animation:dbImgReveal .9s .3s cubic-bezier(.23,1,.32,1) both;
  }

  /* ── METRIC CARDS ── */
  .db-metrics-grid {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
    gap:3px; margin-bottom:28px;
    animation:dbFadeUp .7s .1s ease both;
  }
  .db-metric-card {
    background:#fff; padding:28px 24px; position:relative; overflow:hidden;
    border:1px solid rgba(139,111,71,.08);
    display:flex; align-items:center; gap:18px;
    transition:all .45s cubic-bezier(.23,1,.32,1); cursor:default;
  }
  .db-metric-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);
    transform:scaleX(0); transform-origin:left; transition:transform .5s ease;
  }
  .db-metric-card:hover { transform:translateY(-5px); box-shadow:0 20px 56px rgba(74,55,40,.12); }
  .db-metric-card:hover::before { transform:scaleX(1); }
  .db-metric-card.dark { background:var(--brand-dark); border-color:transparent; }
  .db-metric-card.dark .db-metric-value { color:var(--gold); }
  .db-metric-card.dark .db-metric-label { color:rgba(253,248,243,.42); }
  .db-metric-icon {
    width:48px; height:48px; border:1px solid var(--gold-dim);
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
    transition:all .35s ease;
  }
  .db-metric-card:hover .db-metric-icon { border-color:var(--gold); background:var(--smoke); }
  .db-metric-card.dark .db-metric-icon { border-color:rgba(201,169,110,.2); background:rgba(201,169,110,.06); }
  .db-metric-value {
    font-family:'Cormorant Garamond',serif; font-size:2.8rem;
    color:var(--brand-dark); font-weight:300; display:block; line-height:1;
    animation:dbCountUp .6s cubic-bezier(.23,1,.32,1) both;
  }
  .db-metric-label {
    font-family:'Cinzel',serif; font-size:7.5px; letter-spacing:.36em;
    text-transform:uppercase; color:var(--muted); display:block; margin-top:6px;
  }

  /* ── SECTION CARD ── */
  .db-section-card {
    background:#fff; border:1px solid rgba(139,111,71,.1);
    margin-bottom:24px;
    animation:dbFadeUp .7s .18s ease both;
  }
  .db-section-hdr {
    padding:24px 28px; border-bottom:1px solid rgba(139,111,71,.08);
    display:flex; justify-content:space-between; align-items:center;
  }
  .db-section-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(1.4rem,2.5vw,1.8rem); color:var(--brand-dark); font-weight:300;
  }
  .db-section-title em { font-style:italic; color:var(--brand); }
  .db-section-link {
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.36em;
    text-transform:uppercase; color:var(--brand); text-decoration:none;
    display:flex; align-items:center; gap:6px; transition:color .3s ease;
    border-bottom:1px solid var(--gold-dim); padding-bottom:2px;
  }
  .db-section-link:hover { color:var(--brand-dark); }

  /* ── EMPTY STATE ── */
  .db-empty {
    padding:clamp(48px,8vw,80px) 24px; text-align:center;
    border:1px dashed rgba(139,111,71,.18); margin:24px 24px 24px;
    display:flex; flex-direction:column; align-items:center; gap:20px;
    animation:dbFadeIn .8s ease both;
  }
  .db-empty-img {
    width:100%; max-height:200px; object-fit:cover; display:block;
    margin-bottom:8px; filter:saturate(.6) brightness(.8);
    opacity:.55;
  }
  .db-empty-img-wrap { width:200px; height:140px; overflow:hidden; position:relative; }
  .db-empty-img-wrap::after { content:''; position:absolute; inset:0; background:linear-gradient(to top,var(--brand-light) 0%,transparent 60%); }
  .db-empty-title { font-family:'Cormorant Garamond',serif; font-size:1.5rem; color:var(--brand-dark); font-weight:300; }
  .db-empty-text  { font-size:.88rem; color:var(--muted); max-width:340px; font-weight:300; line-height:1.8; }
  .db-empty-btn {
    background:var(--brand-dark); color:#fff;
    padding:14px 40px; font-family:'Cinzel',serif; font-size:9px;
    letter-spacing:.36em; text-transform:uppercase; font-weight:700;
    text-decoration:none; position:relative; overflow:hidden;
    transition:all .4s ease; box-shadow:0 6px 22px rgba(74,55,40,.2);
  }
  .db-empty-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--gold),var(--brand)); opacity:0; transition:opacity .4s ease; }
  .db-empty-btn:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(74,55,40,.28); }
  .db-empty-btn:hover::before { opacity:1; }
  .db-empty-btn span { position:relative; z-index:1; }

  /* ── INQUIRY ROWS ── */
  .db-inquiry-row {
    display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center;
    gap:16px; padding:22px 28px;
    border-bottom:1px solid rgba(139,111,71,.07);
    transition:background .3s ease;
    position:relative; overflow:hidden;
  }
  .db-inquiry-row:last-child { border-bottom:none; }
  .db-inquiry-row::before {
    content:''; position:absolute; left:0; top:0; bottom:0; width:2px;
    background:var(--gold); transform:scaleY(0); transform-origin:bottom; transition:transform .4s ease;
  }
  .db-inquiry-row:hover { background:rgba(253,248,243,.6); }
  .db-inquiry-row:hover::before { transform:scaleY(1); }
  .db-inquiry-biz {
    font-family:'Cormorant Garamond',serif; font-size:1.2rem;
    color:var(--brand-dark); font-weight:400; margin-bottom:4px;
  }
  .db-inquiry-cat {
    display:inline-block; font-family:'Cinzel',serif; font-size:7.5px;
    letter-spacing:.32em; text-transform:uppercase;
    background:var(--brand); color:#fff; padding:3px 10px; margin-left:10px;
    vertical-align:middle;
  }
  .db-inquiry-date {
    font-size:.8rem; color:var(--muted); font-weight:300;
    font-family:'Jost',sans-serif;
  }
  .db-inquiry-date svg { display:inline; vertical-align:middle; margin-right:5px; }
  .db-status-badge {
    font-family:'Cinzel',serif; font-size:7.5px; letter-spacing:.32em;
    text-transform:uppercase; font-weight:700; padding:6px 16px;
    display:inline-block; animation:dbStatusPop .4s cubic-bezier(.23,1,.32,1) both;
  }
  .db-status-badge.pending  { background:rgba(201,150,50,.1); color:#9a7020; border:1px solid rgba(201,150,50,.2); }
  .db-status-badge.completed{ background:rgba(60,140,80,.08); color:#2d7a40; border:1px solid rgba(60,140,80,.18); }

  /* ── QUICK ACTIONS ── */
  .db-actions-grid {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
    gap:3px; margin-bottom:24px;
    animation:dbFadeUp .7s .24s ease both;
  }
  .db-action-card {
    background:var(--brand-dark); padding:28px 22px; position:relative; overflow:hidden;
    cursor:pointer; text-decoration:none; display:block;
    transition:all .45s cubic-bezier(.23,1,.32,1); border:1px solid rgba(201,169,110,.08);
  }
  .db-action-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:1.5px;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);
    transform:scaleX(0); transform-origin:left; transition:transform .5s ease;
  }
  .db-action-card:hover { transform:translateY(-4px); box-shadow:0 18px 48px rgba(74,55,40,.2); border-color:rgba(201,169,110,.2); }
  .db-action-card:hover::before { transform:scaleX(1); }
  .db-action-icon { width:36px; height:36px; border:1px solid rgba(201,169,110,.2); display:flex; align-items:center; justify-content:center; margin-bottom:16px; transition:all .35s ease; }
  .db-action-card:hover .db-action-icon { border-color:var(--gold); background:rgba(201,169,110,.1); }
  .db-action-label { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.34em; text-transform:uppercase; color:rgba(253,248,243,.7); display:block; margin-bottom:4px; }
  .db-action-desc  { font-size:.78rem; color:rgba(253,248,243,.35); font-weight:300; line-height:1.6; }
  .db-action-arrow { position:absolute; bottom:20px; right:20px; opacity:0; transform:translateX(-6px); transition:all .35s ease; }
  .db-action-card:hover .db-action-arrow { opacity:1; transform:translateX(0); }

  /* ── VENUE SHOWCASE ── */
  .db-venues-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:3px; margin-bottom:24px; }
  @media(max-width:768px){ .db-venues-grid{ grid-template-columns:1fr; } }
  .db-venue-card { position:relative; overflow:hidden; height:200px; cursor:pointer; }
  .db-venue-img  { width:100%; height:100%; object-fit:cover; display:block; transition:transform .8s cubic-bezier(.23,1,.32,1),filter .5s ease; filter:saturate(.75) contrast(1.05) brightness(.7); }
  .db-venue-card:hover .db-venue-img { transform:scale(1.07); filter:saturate(.9) brightness(.8); }
  .db-venue-grad { position:absolute; inset:0; background:linear-gradient(to top,rgba(28,16,8,.88) 0%,rgba(28,16,8,.15) 65%,transparent 100%); }
  .db-venue-arrow { position:absolute; top:14px; right:14px; width:32px; height:32px; border:1px solid rgba(201,169,110,.3); display:flex; align-items:center; justify-content:center; opacity:0; transform:translateY(6px); transition:all .4s ease; z-index:2; }
  .db-venue-card:hover .db-venue-arrow { opacity:1; transform:translateY(0); }
  .db-venue-info { position:absolute; bottom:0; left:0; right:0; padding:20px; z-index:1; }
  .db-venue-tag  { font-family:'Cinzel',serif; font-size:7.5px; letter-spacing:.36em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:4px; }
  .db-venue-name { font-family:'Cormorant Garamond',serif; font-size:1.2rem; color:#fff; font-weight:300; }
  .db-venue-cap  { font-size:.75rem; color:rgba(253,248,243,.42); margin-top:3px; font-weight:300; }

  /* ── LOADING ── */
  .db-loading {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:16px; padding:80px 24px;
  }
  .db-loading-spinner { width:40px; height:40px; border:1.5px solid rgba(139,111,71,.15); border-top-color:var(--gold); border-radius:50%; animation:dbSpinRing 1s linear infinite; }
  .db-loading-text { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em; color:var(--muted); text-transform:uppercase; }

  /* ── TICKER ── */
  .db-ticker { background:var(--brand-dark); overflow:hidden; padding:11px 0; margin-bottom:24px; animation:dbFadeIn .6s ease both; }
  .db-ticker-inner { display:flex; white-space:nowrap; width:max-content; animation:dbTickerScroll 28s linear infinite; }
  .db-ticker-item  { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.4em; color:rgba(201,169,110,.48); text-transform:uppercase; padding:0 40px; }
  .db-ticker-dot   { display:inline-block; width:4px; height:4px; background:rgba(201,169,110,.35); transform:rotate(45deg); margin:0 20px; vertical-align:middle; }
`;

/* ─────────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, dir = 'up' }) {
  const [ref, inView] = useInView();
  const map = { up:'dbFadeUp', left:'dbSlideL', right:'dbSlideR', plain:'dbFadeIn' };
  return (
    <div ref={ref} style={{
      animation: inView ? `${map[dir]} .85s ${delay}s cubic-bezier(.23,1,.32,1) both` : 'none',
      opacity: inView ? undefined : 0,
    }}>{children}</div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────────────────────── */
const tickerItems = ['Client Dashboard','Wedding Chapter','My Bookings','My Enquiries','Vendor Directory','Book Your Date','Premium Collective'];

const venues = [
  { tag:'Flagship Hall',   name:'The Grand Rosewood', cap:'Up to 1,200 guests', img:'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=75' },
  { tag:'Rooftop Garden',  name:'Sky Garden Terrace',  cap:'Up to 300 guests',  img:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=700&q=75' },
  { tag:'Heritage Estate', name:'The Ivory Manor',     cap:'Up to 500 guests',  img:'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=700&q=75' },
];

const quickActions = [
  { to:'/vendors', label:'Browse Vendors', desc:'Explore our curated directory of premium partners', icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg> },
  { to:'/book',    label:'Book a Date',    desc:'Reserve your date with a simple booking form',    icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="1"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
  { to:'/services',label:'Our Services',   desc:'Explore photography, venues, films and more',     icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { to:'/contact', label:'Get Support',    desc:'Speak to a dedicated wedding coordinator',        icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
];

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT  —  all original logic 100% preserved
───────────────────────────────────────────────────────────── */
export default function Dashboard() {
  /* ── original state ── */
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading]     = useState(true);
  const navigate                  = useNavigate();
  const user                      = JSON.parse(localStorage.getItem('user'));

  /* ── original useEffect ── */
  useEffect(() => {
    if (!user) { navigate({ to: '/login' }); return; }

    const fetchInquiries = async () => {
      try {
        const response = await axios.get('https://weddings-backend.onrender.com/api/inquiries/my-inquiries', { withCredentials: true });
        setInquiries(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [navigate, user]);

  /* ── original guard ── */
  if (!user || loading) {
    return (
      <DashboardLayout>
        <>
          <style>{STYLES}</style>
          <div className="db-loading">
            <div className="db-loading-spinner" />
            <span className="db-loading-text">Loading Overview</span>
          </div>
        </>
      </DashboardLayout>
    );
  }

  /* ── original recentBookings ── */
  const recentBookings = [];

  return (
    <DashboardLayout>
      <>
        <style>{STYLES}</style>

        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>

          {/* ── TICKER ── */}
          <div className="db-ticker">
            <div className="db-ticker-inner">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className="db-ticker-item">{item}<span className="db-ticker-dot" /></span>
              ))}
            </div>
          </div>

          {/* ── WELCOME BANNER — original user.name preserved ── */}
          <div className="db-welcome">
            <div className="db-welcome-grain" />
            <div className="db-welcome-grid">
              <div>
                <span className="db-welcome-eyebrow">Client Dashboard</span>
                {/* original h1 text preserved — emoji removed */}
                <h1 className="db-welcome-h1">
                  Welcome back,{' '}
                  <span className="gold-name">{user.name.split(' ')[0]}</span>
                </h1>
                {/* original sub text preserved */}
                <p className="db-welcome-sub">
                  Here's an overview of your wedding planning journey.
                </p>
                <div className="db-welcome-ornament">
                  <div className="db-welcome-line" />
                  <div className="db-welcome-gem" />
                  <div className="db-welcome-line" />
                </div>
              </div>
              <div className="db-welcome-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=75"
                  alt=""
                  className="db-welcome-img"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* ── METRIC CARDS — original data preserved ── */}
          <Reveal delay={0.05}>
            <div className="db-metrics-grid">
              {/* original card data preserved — emojis replaced with SVGs */}
              {[
                {
                  label: 'Total Enquiries',
                  value: inquiries.length,
                  dark: false,
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
                },
                {
                  label: 'Simulated Bookings',
                  value: recentBookings.length,
                  dark: true,
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,.8)" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="1"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
                },
                {
                  label: 'In Progress',
                  value: inquiries.filter(i => i.status === 'Pending').length,
                  dark: false,
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
                },
                {
                  label: 'Completed',
                  value: inquiries.filter(i => i.status === 'Completed').length,
                  dark: false,
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
                },
              ].map((card, idx) => (
                <div key={idx} className={`db-metric-card${card.dark ? ' dark' : ''}`}>
                  <div className="db-metric-icon">{card.icon}</div>
                  <div>
                    <span className="db-metric-value">{card.value}</span>
                    <span className="db-metric-label">{card.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* ── QUICK ACTIONS ── */}
          <Reveal delay={0.1}>
            <div style={{ marginBottom:24 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <span style={{ fontFamily:"'Cinzel',serif", fontSize:'9px', letterSpacing:'.42em', textTransform:'uppercase', color:'var(--muted)' }}>Quick Actions</span>
                <div style={{ flex:1, height:1, background:'linear-gradient(90deg,rgba(139,111,71,.15),transparent)' }} />
              </div>
              <div className="db-actions-grid">
                {quickActions.map(({ to, label, desc, icon }, i) => (
                  <Link key={i} to={to} className="db-action-card">
                    <div className="db-action-icon">{icon}</div>
                    <span className="db-action-label">{label}</span>
                    <span className="db-action-desc">{desc}</span>
                    <div className="db-action-arrow">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ── RECENT INQUIRIES — original JSX logic preserved ── */}
          <Reveal delay={0.14}>
            <div className="db-section-card">
              <div className="db-section-hdr">
                {/* original title preserved */}
                <h2 className="db-section-title">Recent <em>Inquiries</em></h2>
                {/* original link preserved */}
                <Link to="/dashboard/bookings" className="db-section-link">
                  View All
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* original empty / filled conditional preserved */}
              {inquiries.length === 0 ? (
                /* ── EMPTY STATE — original link & text preserved, emoji removed ── */
                <div className="db-empty">
                  <div className="db-empty-img-wrap">
                    <img
                      src="https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=400&q=75"
                      alt=""
                      className="db-empty-img"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="db-empty-title">No Inquiries Yet</h3>
                  {/* original text preserved */}
                  <p className="db-empty-text">
                    You haven't sent any inquiries or created any bookings yet. Start by browsing our directory!
                  </p>
                  {/* original Link preserved */}
                  <Link to="/vendors" className="db-empty-btn">
                    <span>Browse Vendors</span>
                  </Link>
                </div>
              ) : (
                /* ── INQUIRY LIST — original .map() logic preserved ── */
                <div>
                  {inquiries.slice(0, 3).map((inquiry) => (
                    <div key={inquiry.id} className="db-inquiry-row">
                      <div>
                        <div>
                          {/* original business_name preserved */}
                          <span className="db-inquiry-biz">{inquiry.business_name}</span>
                          {/* original category badge preserved */}
                          <span className="db-inquiry-cat">{inquiry.category}</span>
                        </div>
                        {/* original event_date preserved */}
                        <p className="db-inquiry-date">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display:'inline', verticalAlign:'middle', marginRight:5 }}>
                            <rect x="3" y="4" width="18" height="18" rx="1"/><path d="M16 2v4M8 2v4M3 10h18"/>
                          </svg>
                          Event Date: {new Date(inquiry.event_date).toLocaleDateString()}
                        </p>
                      </div>
                      {/* original status badge preserved */}
                      <span className={`db-status-badge${inquiry.status === 'Pending' ? ' pending' : ' completed'}`}>
                        {inquiry.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* ── VENUE SHOWCASE ── */}
          <Reveal delay={0.18}>
            <div style={{ marginBottom:24 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <span style={{ fontFamily:"'Cinzel',serif", fontSize:'9px', letterSpacing:'.42em', textTransform:'uppercase', color:'var(--muted)' }}>Browse Venues</span>
                <div style={{ flex:1, height:1, background:'linear-gradient(90deg,rgba(139,111,71,.15),transparent)' }} />
                <Link to="/vendors" style={{ fontFamily:"'Cinzel',serif", fontSize:'8px', letterSpacing:'.3em', textTransform:'uppercase', color:'var(--brand)', textDecoration:'none' }}>
                  View All
                </Link>
              </div>
              <div className="db-venues-grid">
                {venues.map(({ tag, name, cap, img }, i) => (
                  <div className="db-venue-card" key={i}>
                    <img src={img} alt={name} className="db-venue-img" loading="lazy" />
                    <div className="db-venue-grad" />
                    <div className="db-venue-arrow">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                        <path d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </div>
                    <div className="db-venue-info">
                      <span className="db-venue-tag">{tag}</span>
                      <h4 className="db-venue-name">{name}</h4>
                      <p className="db-venue-cap">{cap}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

        </div>
      </>
    </DashboardLayout>
  );
}