import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

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
    --gold-dim:    rgba(201,169,110,0.18);
    --smoke:       #F5EFE8;
    --muted:       #7A6555;
    --ink:         #1C1008;
  }

  @keyframes ftFadeUp   { from{opacity:0;transform:translateY(48px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ftSlideL   { from{opacity:0;transform:translateX(-48px)} to{opacity:1;transform:translateX(0)} }
  @keyframes ftFadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes ftLineGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes ftRotateGem{ 0%,100%{transform:rotate(45deg) scale(1)} 50%{transform:rotate(45deg) scale(1.45)} }
  @keyframes ftShimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes ftTickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes ftPulseRing{
    0%{transform:translate(-50%,-50%) scale(1);opacity:.5}
    100%{transform:translate(-50%,-50%) scale(2.5);opacity:0}
  }
  @keyframes ftSocialHover{
    0%{transform:translateY(0) rotate(0deg)}
    50%{transform:translateY(-4px) rotate(-8deg)}
    100%{transform:translateY(0) rotate(0deg)}
  }
  @keyframes ftCounterIn{ from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ftTopBar   { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes ftFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes ftBorderPulse{
    0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,0)}
    50%{box-shadow:0 0 0 8px rgba(201,169,110,0.08)}
  }

  /* ── HERO IMAGE STRIP ── */
  .ft-img-strip {
    display:grid; grid-template-columns:repeat(5,1fr); gap:3px;
    height:200px; overflow:hidden;
  }
  .ft-img-strip-item { overflow:hidden; position:relative; }
  .ft-img-strip-img  {
    width:100%; height:100%; object-fit:cover; display:block;
    transition:transform .8s cubic-bezier(.23,1,.32,1), filter .5s ease;
    filter:saturate(.65) contrast(1.06) brightness(.7);
  }
  .ft-img-strip-item:hover .ft-img-strip-img { transform:scale(1.1); filter:saturate(.9) contrast(1.04) brightness(.85); }
  .ft-img-strip-item::after { content:''; position:absolute; inset:0; background:rgba(74,55,40,.35); pointer-events:none; }
  @media(max-width:640px) {
    .ft-img-strip { grid-template-columns:repeat(3,1fr); }
    .ft-img-strip-item:nth-child(4),.ft-img-strip-item:nth-child(5) { display:none; }
  }

  /* ── TICKER ── */
  .ft-ticker {
    background:var(--brand); overflow:hidden; padding:12px 0;
  }
  .ft-ticker-inner { display:flex; white-space:nowrap; width:max-content; animation:ftTickerScroll 32s linear infinite; }
  .ft-ticker-item  { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.42em; color:rgba(253,248,243,.65); text-transform:uppercase; padding:0 48px; }
  .ft-ticker-dot   { display:inline-block; width:4px; height:4px; background:rgba(253,248,243,.4); transform:rotate(45deg); margin:0 24px; vertical-align:middle; }

  /* ── STATS STRIP ── */
  .ft-stats {
    background:var(--ink); display:grid; grid-template-columns:repeat(4,1fr);
    position:relative; overflow:hidden;
  }
  .ft-stats::before {
    content:''; position:absolute; inset:0;
    background:repeating-linear-gradient(90deg,rgba(201,169,110,.04) 0,rgba(201,169,110,.04) 1px,transparent 1px,transparent 100px);
  }
  .ft-stat { text-align:center; padding:40px 20px; border-right:1px solid rgba(201,169,110,.08); position:relative; z-index:1; }
  .ft-stat:last-child { border-right:none; }
  .ft-stat-num { font-family:'Cormorant Garamond',serif; font-size:clamp(2.2rem,4vw,3.4rem); color:var(--gold); font-weight:300; display:block; line-height:1; }
  .ft-stat-lbl { font-family:'Cinzel',serif; font-size:8px; letter-spacing:.32em; color:rgba(201,169,110,.45); margin-top:8px; text-transform:uppercase; display:block; }
  @media(max-width:640px){
    .ft-stats{grid-template-columns:1fr 1fr}
    .ft-stat:nth-child(2){border-right:none}
    .ft-stat:nth-child(3){border-right:1px solid rgba(201,169,110,.08);border-top:1px solid rgba(201,169,110,.08)}
    .ft-stat:nth-child(4){border-top:1px solid rgba(201,169,110,.08)}
  }

  /* ── MAIN FOOTER ── */
  .ft-main {
    background:var(--brand-dark); padding:clamp(64px,8vw,110px) clamp(24px,5vw,64px) 0;
    position:relative; overflow:hidden;
  }
  .ft-main::before {
    content:'CHAPTER'; position:absolute; bottom:-30px; right:-10px;
    font-family:'Cormorant Garamond',serif; font-size:200px; font-weight:700;
    color:rgba(201,169,110,.025); white-space:nowrap; pointer-events:none; letter-spacing:-.02em;
  }

  /* ── BRAND COLUMN ── */
  .ft-brand-col { }
  .ft-logo-wrap { display:flex; align-items:center; gap:12px; margin-bottom:24px; }
  .ft-logo-gem  { width:9px; height:9px; background:var(--gold); transform:rotate(45deg); animation:ftRotateGem 5s ease-in-out infinite; flex-shrink:0; }
  .ft-logo-text {
    font-family:'Cinzel',serif; font-size:clamp(11px,1.1vw,13px); font-weight:700;
    letter-spacing:.2em; text-transform:uppercase; color:#fff; line-height:1.25;
  }
  .ft-logo-sub  { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:.85rem; color:var(--gold); letter-spacing:.12em; margin-top:2px; display:block; }
  .ft-brand-desc {
    font-family:'Jost',sans-serif; font-size:.875rem; color:rgba(253,248,243,.48);
    line-height:1.88; font-weight:300; margin-bottom:28px;
  }

  /* ── SOCIAL ICONS ── */
  .ft-social-row { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:32px; }
  .ft-social-btn {
    width:38px; height:38px; border:1px solid rgba(201,169,110,.22);
    display:flex; align-items:center; justify-content:center;
    transition:all .35s ease; position:relative; overflow:hidden; flex-shrink:0;
  }
  .ft-social-btn::before {
    content:''; position:absolute; inset:0; background:var(--brand); opacity:0; transition:opacity .35s ease;
  }
  .ft-social-btn:hover { border-color:var(--gold); transform:translateY(-3px); box-shadow:0 6px 18px rgba(139,111,71,.25); }
  .ft-social-btn:hover::before { opacity:1; }
  .ft-social-btn svg { position:relative; z-index:1; }

  /* ── NEWSLETTER ── */
  .ft-newsletter { background:rgba(255,255,255,.04); border:1px solid rgba(201,169,110,.1); padding:24px; margin-bottom:0; }
  .ft-newsletter-label { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.38em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:14px; }
  .ft-newsletter-row   { display:flex; gap:0; }
  .ft-newsletter-input {
    flex:1; background:rgba(255,255,255,.06); border:1px solid rgba(201,169,110,.18);
    border-right:none; padding:11px 14px; font-family:'Jost',sans-serif; font-size:.85rem;
    color:#fff; outline:none; transition:border-color .3s ease;
  }
  .ft-newsletter-input::placeholder { color:rgba(253,248,243,.28); font-weight:300; }
  .ft-newsletter-input:focus { border-color:var(--gold); }
  .ft-newsletter-btn {
    background:var(--gold); color:var(--brand-dark); border:none; cursor:pointer;
    padding:11px 18px; font-family:'Cinzel',serif; font-size:8px; letter-spacing:.3em;
    text-transform:uppercase; font-weight:700; transition:all .35s ease; white-space:nowrap;
  }
  .ft-newsletter-btn:hover { background:#fff; }

  /* ── FOOTER GRID ── */
  .ft-grid {
    display:grid; grid-template-columns:1.4fr 1fr 1fr 1.2fr;
    gap:clamp(32px,5vw,64px); max-width:1300px; margin:0 auto;
    position:relative; z-index:1;
  }
  @media(max-width:1100px){ .ft-grid{ grid-template-columns:1fr 1fr; gap:40px; } }
  @media(max-width:600px) { .ft-grid{ grid-template-columns:1fr; gap:36px; } }

  /* ── COLUMN HEADERS ── */
  .ft-col-hdr {
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:.44em;
    text-transform:uppercase; color:var(--gold); margin-bottom:24px; display:block;
    position:relative; padding-bottom:12px;
  }
  .ft-col-hdr::after {
    content:''; position:absolute; bottom:0; left:0; width:32px; height:1px;
    background:var(--gold); transform-origin:left; animation:ftLineGrow .6s ease both;
  }

  /* ── LINK LISTS ── */
  .ft-link-list { list-style:none; padding:0; margin:0; }
  .ft-link-item { margin-bottom:14px; }
  .ft-link {
    font-family:'Jost',sans-serif; font-size:.875rem; color:rgba(253,248,243,.48);
    text-decoration:none; font-weight:300; transition:all .3s ease;
    display:flex; align-items:center; gap:10px; position:relative;
  }
  .ft-link::before {
    content:''; width:4px; height:4px; background:var(--gold); transform:rotate(45deg);
    flex-shrink:0; opacity:0; transition:opacity .3s ease, transform .3s ease;
    transform:rotate(45deg) scale(0);
  }
  .ft-link:hover { color:#fff; padding-left:4px; }
  .ft-link:hover::before { opacity:1; transform:rotate(45deg) scale(1); }

  /* ── SERVICE ITEMS ── */
  .ft-service-item {
    font-family:'Jost',sans-serif; font-size:.875rem; color:rgba(253,248,243,.48);
    font-weight:300; margin-bottom:14px; display:flex; align-items:center; gap:10px;
    transition:color .3s ease; cursor:default;
  }
  .ft-service-item::before {
    content:''; width:4px; height:4px; background:var(--gold); transform:rotate(45deg);
    flex-shrink:0; opacity:.4;
  }
  .ft-service-item:hover { color:rgba(253,248,243,.78); }

  /* ── CONTACT COLUMN ── */
  .ft-contact-item {
    display:flex; align-items:flex-start; gap:12px;
    margin-bottom:18px; font-family:'Jost',sans-serif; font-size:.875rem;
    color:rgba(253,248,243,.52); font-weight:300; line-height:1.6;
  }
  .ft-contact-icon {
    width:28px; height:28px; border:1px solid rgba(201,169,110,.2);
    display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px;
    transition:all .35s ease;
  }
  .ft-contact-item:hover .ft-contact-icon { border-color:var(--gold); background:rgba(201,169,110,.08); }
  .ft-contact-item:hover { color:rgba(253,248,243,.78); }

  /* Book Now button */
  .ft-book-btn {
    display:inline-block; text-decoration:none; margin-top:8px;
    background:var(--gold); color:var(--brand-dark);
    padding:13px 32px; font-family:'Cinzel',serif; font-size:9px;
    letter-spacing:.36em; text-transform:uppercase; font-weight:700;
    position:relative; overflow:hidden; transition:all .4s ease;
    box-shadow:0 4px 18px rgba(201,169,110,.3); animation:ftBorderPulse 3s ease-in-out infinite;
  }
  .ft-book-btn::before { content:''; position:absolute; inset:0; background:#fff; opacity:0; transition:opacity .35s ease; }
  .ft-book-btn:hover { transform:translateY(-3px); box-shadow:0 10px 32px rgba(201,169,110,.4); }
  .ft-book-btn:hover::before { opacity:1; }
  .ft-book-btn span { position:relative; z-index:1; }

  /* ── DIVIDER ── */
  .ft-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(201,169,110,.15),transparent); margin:clamp(48px,6vw,72px) 0 0; }

  /* ── BOTTOM BAR ── */
  .ft-bottom {
    padding:24px clamp(24px,5vw,64px) clamp(32px,4vw,48px);
    display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center;
    gap:16px; max-width:1300px; margin:0 auto; position:relative; z-index:1;
  }
  .ft-bottom-copy {
    font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.36em;
    text-transform:uppercase; color:rgba(253,248,243,.28);
  }
  .ft-bottom-copy strong { color:rgba(201,169,110,.5); }
  .ft-bottom-links { display:flex; gap:28px; flex-wrap:wrap; }
  .ft-bottom-link {
    font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.3em;
    text-transform:uppercase; color:rgba(253,248,243,.28); text-decoration:none;
    transition:color .3s ease;
  }
  .ft-bottom-link:hover { color:var(--gold); }
  .ft-bottom-ornament { display:flex; align-items:center; gap:10px; }
  .ft-bottom-gem { width:5px; height:5px; background:rgba(201,169,110,.3); transform:rotate(45deg); animation:ftRotateGem 6s ease-in-out infinite; }
  .ft-bottom-est { font-family:'Cinzel',serif; font-size:8px; letter-spacing:.36em; color:rgba(201,169,110,.3); text-transform:uppercase; }

  /* ── VENUE CARDS ROW ── */
  .ft-venues {
    display:grid; grid-template-columns:repeat(3,1fr); gap:3px;
    max-width:1300px; margin:0 auto clamp(40px,5vw,64px); padding:0 clamp(24px,5vw,64px);
    position:relative; z-index:1;
  }
  @media(max-width:768px){ .ft-venues{grid-template-columns:1fr} }
  .ft-venue-card { position:relative; overflow:hidden; height:160px; cursor:pointer; }
  .ft-venue-img  { width:100%; height:100%; object-fit:cover; display:block; transition:transform .7s cubic-bezier(.23,1,.32,1),filter .5s ease; filter:saturate(.7) contrast(1.05) brightness(.6); }
  .ft-venue-card:hover .ft-venue-img { transform:scale(1.07); filter:saturate(.9) contrast(1.04) brightness(.75); }
  .ft-venue-grad { position:absolute; inset:0; background:linear-gradient(to top,rgba(28,16,8,.88) 0%,rgba(28,16,8,.1) 65%,transparent 100%); }
  .ft-venue-info { position:absolute; bottom:0; left:0; right:0; padding:18px 20px; z-index:1; }
  .ft-venue-tag  { font-family:'Cinzel',serif; font-size:7.5px; letter-spacing:.36em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:4px; }
  .ft-venue-name { font-family:'Cormorant Garamond',serif; font-size:1.1rem; color:#fff; font-weight:300; }

  /* ── MANIFESTO QUOTE ── */
  .ft-quote-row {
    max-width:1300px; margin:0 auto; padding:0 clamp(24px,5vw,64px) clamp(40px,5vw,60px);
    text-align:center; position:relative; z-index:1;
  }
  .ft-quote-text {
    font-family:'Cormorant Garamond',serif; font-size:clamp(1.2rem,2.5vw,1.8rem);
    font-style:italic; color:rgba(253,248,243,.4); line-height:1.65; font-weight:300;
  }
  .ft-quote-mark { font-size:4rem; color:rgba(201,169,110,.1); line-height:.5; display:block; margin-bottom:8px; font-family:'Cormorant Garamond',serif; }
`;

/* ─────────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────────── */
function useInView(threshold = 0.14) {
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

function useCounter(target, inView, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const steps = 50; const inc = target / steps; let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(cur));
    }, duration / steps);
    return () => clearInterval(t);
  }, [inView, target, duration]);
  return val;
}

function Reveal({ children, delay = 0, dir = 'up' }) {
  const [ref, inView] = useInView();
  const map = { up:'ftFadeUp', left:'ftSlideL', plain:'ftFadeIn' };
  return (
    <div ref={ref} style={{
      animation: inView ? `${map[dir]} .88s ${delay}s cubic-bezier(.23,1,.32,1) both` : 'none',
      opacity: inView ? undefined : 0,
    }}>{children}</div>
  );
}

function StatItem({ number, suffix, label }) {
  const [ref, inView] = useInView(0.3);
  const val = useCounter(number, inView);
  return (
    <div ref={ref} className="ft-stat">
      <span className="ft-stat-num">{val}{suffix}</span>
      <span className="ft-stat-lbl">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const tickerItems = ['The Weddings Chapter','Premium Collective','Est. 2017','Banquet Specialists','Wedding Photography','Cinematic Films','Floral Design','Luxury Venues','Limited Dates'];

const stripImgs = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=75',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=75',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=75',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=75',
  'https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=600&q=75',
];

const venues = [
  { tag:'Flagship Hall',   name:'The Grand Rosewood', img:'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=75' },
  { tag:'Rooftop Garden',  name:'Sky Garden Terrace',  img:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=700&q=75' },
  { tag:'Heritage Estate', name:'The Ivory Manor',     img:'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=700&q=75' },
];

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT  —  all original logic & routes preserved
───────────────────────────────────────────────────────────── */
export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <>
      <style>{STYLES}</style>

      {/* ── IMAGE STRIP ── */}
      <div className="ft-img-strip">
        {stripImgs.map((src, i) => (
          <div className="ft-img-strip-item" key={i}>
            <img src={src} alt="" className="ft-img-strip-img" loading="lazy" />
          </div>
        ))}
      </div>

      {/* ── TICKER ── */}
      <div className="ft-ticker">
        <div className="ft-ticker-inner">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="ft-ticker-item">
              {item}<span className="ft-ticker-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="ft-stats">
        <StatItem number={500}  suffix="+"    label="Weddings Hosted" />
        <StatItem number={12}   suffix="+"    label="Luxury Venues" />
        <StatItem number={98}   suffix="%"    label="Happy Couples" />
        <StatItem number={8}    suffix=" yrs" label="of Excellence" />
      </div>

      {/* ── MAIN FOOTER ── */}
      <footer className="ft-main">

        {/* ── VENUE CARDS ── */}
        <Reveal dir="plain">
          <div className="ft-venues">
            {venues.map(({ tag, name, img }, i) => (
              <div className="ft-venue-card" key={i}>
                <img src={img} alt={name} className="ft-venue-img" loading="lazy" />
                <div className="ft-venue-grad" />
                <div className="ft-venue-info">
                  <span className="ft-venue-tag">{tag}</span>
                  <h4 className="ft-venue-name">{name}</h4>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── MAIN GRID ── */}
        <div className="ft-grid" style={{ paddingBottom:'clamp(48px,6vw,72px)' }}>

          {/* ── COLUMN 1: Brand & Bio — original content preserved ── */}
          <Reveal dir="left" delay={0}>
            <div className="ft-brand-col">
              <div className="ft-logo-wrap">
                <div className="ft-logo-gem" />
                <div>
                  {/* original brand text preserved */}
                  <span className="ft-logo-text">The Weddings Chapter</span>
                  <span className="ft-logo-sub">Capturing Love Stories</span>
                </div>
              </div>

              {/* original description preserved */}
              <p className="ft-brand-desc">
                We believe every love story deserves to be told beautifully. Let us
                capture the magic of your special day with elegance and artistry.
              </p>

              {/* ── SOCIAL ICONS — original SVGs preserved, rounded removed ── */}
              <div className="ft-social-row">
                {/* Facebook */}
                <a href="#" className="ft-social-btn" aria-label="Facebook">
                  <svg className="w-4 h-4" width="16" height="16" fill="rgba(253,248,243,.75)" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a href="#" className="ft-social-btn" aria-label="Instagram">
                  <svg className="w-4 h-4" width="16" height="16" fill="rgba(253,248,243,.75)" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                {/* Twitter / X */}
                <a href="#" className="ft-social-btn" aria-label="Twitter / X">
                  <svg className="w-4 h-4" width="16" height="16" fill="rgba(253,248,243,.75)" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* YouTube */}
                <a href="#" className="ft-social-btn" aria-label="YouTube">
                  <svg className="w-4 h-4" width="16" height="16" fill="rgba(253,248,243,.75)" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>

              {/* Newsletter */}
              <div className="ft-newsletter">
                <span className="ft-newsletter-label">Stay in the loop</span>
                <div className="ft-newsletter-row">
                  <input
                    type="email"
                    className="ft-newsletter-input"
                    placeholder="Your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <button className="ft-newsletter-btn">Subscribe</button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── COLUMN 2: Quick Links — original routes preserved ── */}
          <Reveal dir="up" delay={0.08}>
            <div>
              <span className="ft-col-hdr">Quick Links</span>
              <ul className="ft-link-list">
                {/* original Links preserved */}
                <li className="ft-link-item"><Link to="/services"  className="ft-link">Our Services</Link></li>
                <li className="ft-link-item"><Link to="/plans"     className="ft-link">Pricing Plans</Link></li>
                <li className="ft-link-item"><Link to="/portfolio" className="ft-link">Portfolio</Link></li>
                <li className="ft-link-item"><Link to="/reviews"   className="ft-link">Testimonials</Link></li>
                <li className="ft-link-item"><Link to="/about"     className="ft-link">About Us</Link></li>
                <li className="ft-link-item"><Link to="/contact"   className="ft-link">Contact</Link></li>
                <li className="ft-link-item"><Link to="/vendors"   className="ft-link">Vendors Directory</Link></li>
                <li className="ft-link-item"><Link to="/book"      className="ft-link">Book Your Date</Link></li>
              </ul>
            </div>
          </Reveal>

          {/* ── COLUMN 3: Our Services — original items preserved ── */}
          <Reveal dir="up" delay={0.14}>
            <div>
              <span className="ft-col-hdr">Our Services</span>
              <ul className="ft-link-list">
                {/* original service items preserved */}
                {[
                  'Wedding Photography',
                  'Pre-Wedding Shoots',
                  'Engagement Sessions',
                  'Bridal Portraits',
                  'Wedding Films',
                  'Album Design',
                  'Floral Architecture',
                  'Banquet Curation',
                ].map((s, i) => (
                  <li key={i} className="ft-service-item">{s}</li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* ── COLUMN 4: Get In Touch — original content preserved ── */}
          <Reveal dir="up" delay={0.2}>
            <div>
              <span className="ft-col-hdr">Get In Touch</span>

              {/* original address — emoji replaced with SVG */}
              <div className="ft-contact-item">
                <div className="ft-contact-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                {/* original address preserved */}
                <span>123 Wedding Lane, Love City, Romance State 560001</span>
              </div>

              {/* original phone — emoji replaced with SVG */}
              <div className="ft-contact-item">
                <div className="ft-contact-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.06 1.2 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
                  </svg>
                </div>
                {/* original phone preserved */}
                <span>+91 98765 43210</span>
              </div>

              {/* original email — emoji replaced with SVG */}
              <div className="ft-contact-item">
                <div className="ft-contact-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                {/* original email preserved */}
                <span>hello@theweddingschapter.com</span>
              </div>

              <div style={{ marginTop:8, marginBottom:12 }}>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:'8px', letterSpacing:'.36em', textTransform:'uppercase', color:'rgba(201,169,110,.45)', marginBottom:8 }}>
                  Office Hours
                </div>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:'.82rem', color:'rgba(253,248,243,.38)', fontWeight:300, lineHeight:1.8 }}>
                  Mon – Fri &nbsp; 10am – 6pm<br />
                  Weekends &nbsp; By Appointment
                </div>
              </div>

              {/* original Book Now link — to="/book" preserved */}
              <Link to="/book" className="ft-book-btn">
                <span>Book Now</span>
              </Link>
            </div>
          </Reveal>

        </div>{/* /ft-grid */}

        {/* ── MANIFESTO QUOTE ── */}
        <Reveal dir="plain">
          <div className="ft-quote-row">
            <span className="ft-quote-mark">"</span>
            <p className="ft-quote-text">
              Every wedding is a singular chapter in the greatest love story ever written — and we have the honour of holding the pen.
            </p>
          </div>
        </Reveal>

        <div className="ft-divider" />

        {/* ── BOTTOM BAR — original copyright text & links preserved ── */}
        <div className="ft-bottom">
          {/* original copyright preserved, heart replaced with text */}
          <p className="ft-bottom-copy">
            &copy; 2026 <strong>The Weddings Chapter</strong>. Made with care in India.
          </p>
          <div className="ft-bottom-ornament">
            <div className="ft-bottom-gem" />
            <span className="ft-bottom-est">Est. 2017 &nbsp;·&nbsp; Premium Wedding Collective</span>
            <div className="ft-bottom-gem" />
          </div>
          {/* original policy links preserved */}
          <div className="ft-bottom-links">
            <a href="#" className="ft-bottom-link">Privacy Policy</a>
            <a href="#" className="ft-bottom-link">Terms of Service</a>
            <a href="#" className="ft-bottom-link">Refund Policy</a>
          </div>
        </div>

      </footer>
    </>
  );
}