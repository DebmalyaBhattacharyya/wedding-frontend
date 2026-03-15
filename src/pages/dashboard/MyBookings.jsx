import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
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
    --ink:         #1C1008;
  }

  @keyframes mbFadeUp   { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes mbSlideL   { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
  @keyframes mbFadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes mbLineGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes mbRotateGem{ 0%,100%{transform:rotate(45deg) scale(1)} 50%{transform:rotate(45deg) scale(1.5)} }
  @keyframes mbShimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes mbSpinRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes mbTopBar   { from{transform:scaleX(0);transform-origin:left} to{transform:scaleX(1);transform-origin:left} }
  @keyframes mbPulseRing{ 0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,0)} 50%{box-shadow:0 0 0 8px rgba(201,169,110,0.09)} }
  @keyframes mbCardIn   { from{opacity:0;transform:translateY(28px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes mbFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes mbTickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes mbGlowStatus{
    0%,100%{box-shadow:0 0 0 0 rgba(74,180,100,0)}
    50%{box-shadow:0 0 0 6px rgba(74,180,100,0.1)}
  }

  /* ── PAGE HEADER ── */
  .mb-hdr {
    background:var(--brand-dark); padding:clamp(32px,4vw,52px) clamp(24px,4vw,44px);
    position:relative; overflow:hidden; margin-bottom:28px;
  }
  .mb-hdr::before {
    content:'BOOKINGS'; position:absolute; bottom:-28px; right:-8px;
    font-family:'Cormorant Garamond',serif; font-size:150px; font-weight:700;
    color:rgba(201,169,110,.03); white-space:nowrap; pointer-events:none; letter-spacing:-.02em;
  }
  .mb-hdr-inner { position:relative; z-index:1; display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:20px; }
  .mb-hdr-left  {}
  .mb-hdr-eyebrow { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.44em; text-transform:uppercase; color:var(--gold); display:block; margin-bottom:12px; }
  .mb-hdr-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2rem,4vw,3.2rem); font-weight:300; color:#fff; line-height:1.1; margin-bottom:10px;
  }
  .mb-hdr-title em { font-style:italic; color:var(--gold); }
  .mb-hdr-sub { font-family:'Jost',sans-serif; font-size:.85rem; color:rgba(253,248,243,.5); font-weight:300; letter-spacing:.06em; }
  .mb-hdr-ornament { display:flex; align-items:center; gap:10px; margin-top:16px; }
  .mb-hdr-orn-line { height:1px; width:36px; background:linear-gradient(90deg,var(--gold),transparent); }
  .mb-hdr-orn-gem  { width:5px; height:5px; background:var(--gold); transform:rotate(45deg); animation:mbRotateGem 4s ease-in-out infinite; }
  .mb-hdr-img { width:140px; height:88px; object-fit:cover; display:block; filter:saturate(.7) brightness(.6); border:1px solid rgba(201,169,110,.15); flex-shrink:0; }

  /* ── STATS MINI STRIP ── */
  .mb-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:3px; margin-bottom:28px; }
  .mb-stat {
    background:#fff; border:1px solid rgba(139,111,71,.09);
    padding:20px 22px; position:relative; overflow:hidden; transition:all .4s ease;
  }
  .mb-stat::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);
    transform:scaleX(0); transform-origin:left; transition:transform .5s ease;
  }
  .mb-stat:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(74,55,40,.09); }
  .mb-stat:hover::before { transform:scaleX(1); }
  .mb-stat:nth-child(2){ background:var(--brand-dark); }
  .mb-stat:nth-child(2) .mb-stat-num { color:var(--gold); }
  .mb-stat:nth-child(2) .mb-stat-lbl { color:rgba(253,248,243,.42); }
  .mb-stat-num { font-family:'Cormorant Garamond',serif; font-size:2.2rem; color:var(--brand-dark); font-weight:300; display:block; line-height:1; margin-bottom:6px; }
  .mb-stat-lbl { font-family:'Cinzel',serif; font-size:7.5px; letter-spacing:.34em; color:var(--muted); text-transform:uppercase; display:block; }
  @media(max-width:600px){ .mb-stats{grid-template-columns:1fr 1fr} .mb-stat:last-child{grid-column:span 2} }

  /* ── TICKER ── */
  .mb-ticker { background:var(--brand); overflow:hidden; padding:11px 0; margin-bottom:28px; }
  .mb-ticker-inner { display:flex; white-space:nowrap; width:max-content; animation:mbTickerScroll 28s linear infinite; }
  .mb-ticker-item  { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.4em; color:rgba(253,248,243,.55); text-transform:uppercase; padding:0 44px; }
  .mb-ticker-dot   { display:inline-block; width:4px; height:4px; background:rgba(253,248,243,.35); transform:rotate(45deg); margin:0 22px; vertical-align:middle; }

  /* ── LOADING ── */
  .mb-loading {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:80px 24px; gap:20px; background:#fff; border:1px solid rgba(139,111,71,.08);
  }
  .mb-loading-ring { width:44px; height:44px; border:1.5px solid rgba(201,169,110,.2); border-top-color:var(--gold); border-radius:50%; animation:mbSpinRing 1s linear infinite; }
  .mb-loading-text { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em; text-transform:uppercase; color:var(--gold); }

  /* ── EMPTY STATE ── */
  .mb-empty {
    background:#fff; border:1px solid rgba(139,111,71,.08);
    padding:clamp(48px,7vw,80px) 24px; text-align:center;
    display:flex; flex-direction:column; align-items:center;
    animation:mbFadeUp .7s cubic-bezier(.23,1,.32,1) both;
  }
  .mb-empty-img-wrap {
    width:80px; height:80px; border:1.5px solid rgba(201,169,110,.22);
    display:flex; align-items:center; justify-content:center;
    margin-bottom:24px; position:relative; overflow:hidden;
    animation:mbPulseRing 3.5s ease-in-out infinite;
  }
  .mb-empty-img  { width:100%; height:100%; object-fit:cover; filter:saturate(.6) brightness(.7); }
  .mb-empty-h3   { font-family:'Cormorant Garamond',serif; font-size:1.7rem; color:var(--brand-dark); font-weight:300; margin-bottom:10px; }
  .mb-empty-p    { font-family:'Jost',sans-serif; font-size:.875rem; color:var(--muted); font-weight:300; line-height:1.8; max-width:420px; margin:0 auto 32px; }
  .mb-empty-btn  {
    background:var(--brand-dark); color:#fff; padding:14px 40px;
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:.36em;
    text-transform:uppercase; font-weight:700; text-decoration:none;
    display:inline-block; position:relative; overflow:hidden;
    transition:all .4s ease; box-shadow:0 4px 18px rgba(74,55,40,.22);
  }
  .mb-empty-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--gold) 0%,var(--brand-dark) 100%); opacity:0; transition:opacity .4s ease; }
  .mb-empty-btn:hover { transform:translateY(-3px); box-shadow:0 10px 32px rgba(74,55,40,.3); }
  .mb-empty-btn:hover::before { opacity:1; }
  .mb-empty-btn span { position:relative; z-index:1; }

  /* ── BOOKING CARD ── */
  .mb-card {
    background:#fff; border:1px solid rgba(139,111,71,.09);
    display:grid; grid-template-columns:auto 1fr auto;
    gap:0; overflow:hidden; position:relative;
    transition:box-shadow .5s ease, transform .45s cubic-bezier(.23,1,.32,1);
  }
  .mb-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);
    transform:scaleX(0); transform-origin:left; transition:transform .55s ease; z-index:1;
  }
  .mb-card:hover { transform:translateY(-5px); box-shadow:0 24px 60px rgba(74,55,40,.12); }
  .mb-card:hover::before { transform:scaleX(1); }

  /* card image panel */
  .mb-card-img-panel { width:100px; flex-shrink:0; position:relative; overflow:hidden; }
  .mb-card-img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .7s cubic-bezier(.23,1,.32,1),filter .5s ease; filter:saturate(.75) contrast(1.06); min-height:140px; }
  .mb-card:hover .mb-card-img { transform:scale(1.08); filter:saturate(.9) contrast(1.04); }
  .mb-card-img-overlay { position:absolute; inset:0; background:linear-gradient(to right,rgba(28,16,8,.18),transparent); }
  @media(max-width:600px){ .mb-card{ grid-template-columns:1fr } .mb-card-img-panel{ width:100%; height:180px; } }

  /* card body */
  .mb-card-body { padding:clamp(20px,3vw,32px); border-right:1px solid rgba(139,111,71,.08); }
  .mb-card-pkg  {
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.4em;
    text-transform:uppercase; color:var(--gold); display:block; margin-bottom:10px;
  }
  .mb-card-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(1.3rem,2.5vw,1.7rem); font-weight:400;
    color:var(--brand-dark); margin-bottom:14px; line-height:1.15;
  }
  .mb-card-meta { display:flex; flex-wrap:wrap; gap:16px; }
  .mb-card-meta-item {
    display:flex; align-items:center; gap:8px;
    font-family:'Jost',sans-serif; font-size:.82rem; color:var(--muted); font-weight:300;
  }
  .mb-card-meta-icon {
    width:24px; height:24px; border:1px solid rgba(139,111,71,.18);
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .mb-card-addons { margin-top:16px; display:flex; flex-wrap:wrap; gap:6px; }
  .mb-card-addon-tag {
    font-family:'Cinzel',serif; font-size:7px; letter-spacing:.28em;
    text-transform:uppercase; color:var(--brand); border:1px solid rgba(139,111,71,.18);
    padding:4px 10px; background:var(--smoke);
  }

  /* card right panel */
  .mb-card-right { padding:clamp(20px,3vw,32px); display:flex; flex-direction:column; align-items:flex-end; justify-content:space-between; min-width:160px; }
  @media(max-width:600px){ .mb-card-right{ align-items:flex-start; border-top:1px solid rgba(139,111,71,.08); flex-direction:row; align-items:center; justify-content:space-between; } }

  /* status badge */
  .mb-status {
    font-family:'Cinzel',serif; font-size:7.5px; letter-spacing:.32em;
    text-transform:uppercase; font-weight:700; padding:7px 16px;
    display:inline-block; margin-bottom:12px;
  }
  .mb-status.confirmed { background:rgba(74,180,100,.08); color:#2d7d46; border:1px solid rgba(74,180,100,.2); animation:mbGlowStatus 3s ease-in-out infinite; }
  .mb-status.pending   { background:rgba(201,169,110,.08); color:var(--brand); border:1px solid var(--gold-dim); }
  .mb-status.cancelled { background:rgba(180,50,50,.06); color:#8b2020; border:1px solid rgba(180,50,50,.18); }

  .mb-card-price { font-family:'Cormorant Garamond',serif; font-size:clamp(1.8rem,3vw,2.4rem); color:var(--brand-dark); font-weight:300; line-height:1; }
  .mb-card-price-lbl { font-family:'Cinzel',serif; font-size:7.5px; letter-spacing:.32em; text-transform:uppercase; color:var(--muted); margin-top:4px; display:block; }

  /* ── HOW IT WORKS STRIP ── */
  .mb-how-sec { margin-top:36px; }
  .mb-how-hdr { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.42em; text-transform:uppercase; color:var(--gold); display:block; margin-bottom:16px; }
  .mb-how-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:3px; }
  .mb-how-card {
    background:var(--brand-dark); padding:28px 24px; position:relative; overflow:hidden;
    transition:all .4s ease;
  }
  .mb-how-card:hover { transform:translateY(-4px); }
  .mb-how-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:1.5px;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);
    transform:scaleX(0); transform-origin:left; transition:transform .5s ease;
  }
  .mb-how-card:hover::before { transform:scaleX(1); }
  .mb-how-num   { font-family:'Cormorant Garamond',serif; font-size:3.5rem; color:rgba(201,169,110,.1); font-weight:300; display:block; line-height:1; margin-bottom:12px; }
  .mb-how-title { font-family:'Cormorant Garamond',serif; font-size:1.1rem; color:var(--gold); font-weight:400; margin-bottom:8px; }
  .mb-how-text  { font-size:.8rem; color:rgba(253,248,243,.42); font-weight:300; line-height:1.75; }

  /* ── VENUES SUGGESTION ROW ── */
  .mb-venues-sec { margin-top:36px; }
  .mb-venues-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:3px; }
  @media(max-width:600px){ .mb-venues-grid{grid-template-columns:1fr} }
  .mb-venue-card { position:relative; overflow:hidden; height:140px; cursor:pointer; }
  .mb-venue-img  { width:100%; height:100%; object-fit:cover; display:block; transition:transform .7s cubic-bezier(.23,1,.32,1); filter:saturate(.75) brightness(.55); }
  .mb-venue-card:hover .mb-venue-img { transform:scale(1.07); filter:saturate(.9) brightness(.65); }
  .mb-venue-grad { position:absolute; inset:0; background:linear-gradient(to top,rgba(28,16,8,.88) 0%,transparent 65%); }
  .mb-venue-info { position:absolute; bottom:0; left:0; right:0; padding:14px 16px; }
  .mb-venue-tag  { font-family:'Cinzel',serif; font-size:7px; letter-spacing:.36em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:3px; }
  .mb-venue-name { font-family:'Cormorant Garamond',serif; font-size:.95rem; color:#fff; font-weight:300; }
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
  const map = { up:'mbFadeUp', left:'mbSlideL', plain:'mbFadeIn' };
  return (
    <div ref={ref} style={{
      animation: inView ? `${map[dir]} .8s ${delay}s cubic-bezier(.23,1,.32,1) both` : 'none',
      opacity: inView ? undefined : 0,
    }}>{children}</div>
  );
}

function TiltCard({ children, className }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(4px) translateY(-5px)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = '';
  }, []);
  return (
    <div ref={ref} className={className}
      style={{ transition:'transform .35s ease' }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────────────────────── */
const tickerItems = ['My Bookings','Wedding Chapter','Confirmed Dates','Premium Packages','Client Portal','Your Love Story'];

const howSteps = [
  { num:'01', title:'Booking Confirmed',    text:'Your date is secured. A 30% advance locks your session in our calendar.' },
  { num:'02', title:'Pre-Event Call',        text:'Your coordinator reaches out 30 days before to finalise every detail.' },
  { num:'03', title:'Your Big Day',          text:'Arrive and celebrate. Our team handles everything behind the scenes.' },
  { num:'04', title:'Gallery Delivered',     text:'Edited photographs and film delivered within 4 weeks of your event.' },
];

const suggestedVenues = [
  { tag:'Flagship Hall',   name:'The Grand Rosewood', img:'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=75' },
  { tag:'Rooftop Garden',  name:'Sky Garden Terrace',  img:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=75' },
  { tag:'Heritage Estate', name:'The Ivory Manor',     img:'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=600&q=75' },
];

/* fallback image for booking cards */
const BOOKING_IMG = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=75';

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT  —  all original logic 100% preserved
───────────────────────────────────────────────────────────── */
export default function MyBookings() {
  /* ── original state ── */
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  /* ── original useEffect & fetch ── */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('https://weddings-backend.onrender.com/api/bookings/my-bookings', {
          withCredentials: true,
        });
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  /* ── original loading state ── */
  if (loading) {
    return (
      <DashboardLayout>
        <style>{STYLES}</style>
        <div>
          {/* header */}
          <div className="mb-hdr">
            <div className="mb-hdr-inner">
              <div className="mb-hdr-left">
                <span className="mb-hdr-eyebrow">Client Portal</span>
                <h1 className="mb-hdr-title">My <em>Bookings</em></h1>
                <p className="mb-hdr-sub">Manage your confirmed vendors and session details.</p>
              </div>
            </div>
          </div>
          {/* original loading content */}
          <div className="mb-loading">
            <div className="mb-loading-ring" />
            <span className="mb-loading-text">Syncing your confirmed dates</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ── bookings count for stats ── */
  const confirmedCount = bookings.filter(b => (b.status || 'confirmed').toLowerCase() === 'confirmed').length;
  const totalSpend     = bookings.reduce((sum, b) => sum + Number(b.total_price || 0), 0);

  return (
    <DashboardLayout>
      <style>{STYLES}</style>

      {/* ── PAGE HEADER ── */}
      <Reveal dir="plain">
        <div className="mb-hdr">
          <div className="mb-hdr-inner">
            <div className="mb-hdr-left">
              <span className="mb-hdr-eyebrow">Client Portal</span>
              <h1 className="mb-hdr-title">My <em>Bookings</em></h1>
              {/* original subtitle preserved */}
              <p className="mb-hdr-sub">Manage your confirmed vendors and session details.</p>
              <div className="mb-hdr-ornament">
                <div className="mb-hdr-orn-line" />
                <div className="mb-hdr-orn-gem" />
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=400&q=75"
              alt=""
              className="mb-hdr-img"
              loading="lazy"
            />
          </div>
        </div>
      </Reveal>

      {/* ── TICKER ── */}
      <div className="mb-ticker">
        <div className="mb-ticker-inner">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="mb-ticker-item">{item}<span className="mb-ticker-dot" /></span>
          ))}
        </div>
      </div>

      {/* ── STATS MINI ── */}
      <Reveal dir="up" delay={0.06}>
        <div className="mb-stats">
          <div className="mb-stat">
            <span className="mb-stat-num">{bookings.length}</span>
            <span className="mb-stat-lbl">Total Bookings</span>
          </div>
          <div className="mb-stat">
            <span className="mb-stat-num">{confirmedCount}</span>
            <span className="mb-stat-lbl">Confirmed</span>
          </div>
          <div className="mb-stat">
            <span className="mb-stat-num">
              {totalSpend > 0 ? `₹${(totalSpend / 1000).toFixed(0)}K` : '—'}
            </span>
            <span className="mb-stat-lbl">Total Investment</span>
          </div>
        </div>
      </Reveal>

      {/* ══════════ EMPTY STATE  (original condition preserved) ══════════ */}
      {bookings.length === 0 ? (
        <Reveal dir="up" delay={0.1}>
          <div className="mb-empty">
            <div className="mb-empty-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=200&q=75"
                alt=""
                className="mb-empty-img"
                loading="lazy"
              />
            </div>
            {/* original text preserved */}
            <h3 className="mb-empty-h3">No Active Bookings</h3>
            <p className="mb-empty-p">
              You haven't confirmed any bookings yet. Use our "Book Your Date" tool to reserve your session.
            </p>
            {/* original href preserved */}
            <a href="/book" className="mb-empty-btn">
              <span>Start Booking</span>
            </a>
          </div>
        </Reveal>
      ) : (
        /* ══════════ BOOKINGS LIST  (original .map() preserved) ══════════ */
        <div style={{ display:'flex', flexDirection:'column', gap:'3px' }}>
          {bookings.map((booking, idx) => (
            <Reveal key={booking.id} delay={idx * 0.08} dir="up">
              <TiltCard className="mb-card">

                {/* image panel */}
                <div className="mb-card-img-panel">
                  <img
                    src={BOOKING_IMG}
                    alt={booking.package_name}
                    className="mb-card-img"
                    loading="lazy"
                  />
                  <div className="mb-card-img-overlay" />
                </div>

                {/* body — original booking fields preserved */}
                <div className="mb-card-body">
                  <span className="mb-card-pkg">{booking.package_name} Package</span>
                  {/* original title format preserved */}
                  <h3 className="mb-card-title">{booking.package_name} Photography Package</h3>

                  <div className="mb-card-meta">
                    {/* original booking.event_location preserved, emoji replaced with SVG */}
                    <div className="mb-card-meta-item">
                      <div className="mb-card-meta-icon">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                      </div>
                      {booking.event_location}
                    </div>

                    {/* original booking.event_date preserved, emoji replaced with SVG */}
                    <div className="mb-card-meta-item">
                      <div className="mb-card-meta-icon">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                          <rect x="3" y="4" width="18" height="18" rx="1"/><path d="M16 2v4M8 2v4M3 10h18"/>
                        </svg>
                      </div>
                      {new Date(booking.event_date).toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' })}
                    </div>
                  </div>

                  {/* addons if present */}
                  {booking.addons && booking.addons.length > 0 && (
                    <div className="mb-card-addons">
                      {booking.addons.map((addon, i) => (
                        <span key={i} className="mb-card-addon-tag">{addon}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* right panel — original booking.status & total_price preserved */}
                <div className="mb-card-right">
                  <div>
                    {/* original status preserved */}
                    <span className={`mb-status ${(booking.status || 'confirmed').toLowerCase()}`}>
                      {booking.status || 'Confirmed'}
                    </span>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    {/* original price format preserved */}
                    <span className="mb-card-price">₹{Number(booking.total_price).toLocaleString()}</span>
                    <span className="mb-card-price-lbl">Total Investment</span>
                  </div>
                </div>

              </TiltCard>
            </Reveal>
          ))}
        </div>
      )}

      {/* ── HOW IT WORKS ── */}
      <Reveal dir="plain" delay={0.1}>
        <div className="mb-how-sec">
          <span className="mb-how-hdr">What Happens Next</span>
          <div className="mb-how-grid">
            {howSteps.map(({ num, title, text }, i) => (
              <div className="mb-how-card" key={i}>
                <span className="mb-how-num">{num}</span>
                <h4 className="mb-how-title">{title}</h4>
                <p className="mb-how-text">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── SUGGESTED VENUES ── */}
      <Reveal dir="plain" delay={0.12}>
        <div className="mb-venues-sec">
          <span className="mb-how-hdr">Explore Venues for Your Next Event</span>
          <div className="mb-venues-grid">
            {suggestedVenues.map(({ tag, name, img }, i) => (
              <div className="mb-venue-card" key={i}>
                <img src={img} alt={name} className="mb-venue-img" loading="lazy" />
                <div className="mb-venue-grad" />
                <div className="mb-venue-info">
                  <span className="mb-venue-tag">{tag}</span>
                  <span className="mb-venue-name">{name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

    </DashboardLayout>
  );
}