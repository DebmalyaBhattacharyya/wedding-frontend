import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Cinzel:wght@400;600;700&family=Jost:wght@200;300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
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

  /* ── Keyframes ── */
  @keyframes rvFadeUp   { from{opacity:0;transform:translateY(56px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rvSlideL   { from{opacity:0;transform:translateX(-64px)} to{opacity:1;transform:translateX(0)} }
  @keyframes rvSlideR   { from{opacity:0;transform:translateX(64px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes rvFadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes rvShimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes rvLineGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes rvKen      { 0%{transform:scale(1.04)} 100%{transform:scale(1.1) translateX(-1%)} }
  @keyframes rvScrollDot {
    0%,100%{transform:translateY(0);opacity:1}
    60%{transform:translateY(14px);opacity:0}
    61%{transform:translateY(-4px);opacity:0}
  }
  @keyframes rvBorderGlow {
    0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,0)}
    50%{box-shadow:0 0 0 10px rgba(201,169,110,0.1)}
  }
  @keyframes rvRotateGem {
    0%,100%{transform:rotate(45deg) scale(1)}
    50%{transform:rotate(45deg) scale(1.4)}
  }
  @keyframes rvPulseRing {
    0%{transform:translate(-50%,-50%) scale(1);opacity:.5}
    100%{transform:translate(-50%,-50%) scale(2.7);opacity:0}
  }
  @keyframes rvTickerScroll {
    from{transform:translateX(0)}
    to{transform:translateX(-50%)}
  }
  @keyframes rvCardFloat {
    0%,100%{transform:translateY(0px)}
    50%{transform:translateY(-8px)}
  }
  @keyframes rvCounterIn {
    from{opacity:0;transform:translateY(20px)}
    to{opacity:1;transform:translateY(0)}
  }
  @keyframes rvSpinSlow {
    from{transform:rotate(0deg)}
    to{transform:rotate(360deg)}
  }
  @keyframes rvRevealClip {
    from{clip-path:inset(0 100% 0 0)}
    to{clip-path:inset(0 0% 0 0)}
  }
  @keyframes rvTypewriter {
    from{width:0}
    to{width:100%}
  }

  /* ── Utility ── */
  .rv-eyebrow {
    display:block; font-family:'Cinzel',serif; font-size:9.5px;
    letter-spacing:.44em; text-transform:uppercase; color:var(--gold); margin-bottom:16px;
  }
  .rv-ornament {
    display:flex; align-items:center; gap:12px; justify-content:center; margin:0 auto 22px;
  }
  .rv-ornament-line {
    flex:1; max-width:68px; height:1px;
    background:linear-gradient(90deg,transparent,var(--gold));
    transform-origin:left; animation:rvLineGrow .8s ease both;
  }
  .rv-ornament-line.r { background:linear-gradient(90deg,var(--gold),transparent); transform-origin:right; }
  .rv-ornament-gem   { width:7px; height:7px; background:var(--gold); transform:rotate(45deg); animation:rvRotateGem 4s ease-in-out infinite; }

  /* ── HERO ── */
  .rv-hero {
    position:relative; height:78vh; min-height:560px;
    display:flex; align-items:center; justify-content:center;
    text-align:center; overflow:hidden;
  }
  .rv-hero-bg {
    position:absolute; inset:0; background-size:cover; background-position:center 35%;
    animation:rvKen 18s ease-in-out infinite alternate;
  }
  .rv-hero-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to bottom,rgba(28,16,8,.5) 0%,rgba(28,16,8,.22) 40%,rgba(28,16,8,.75) 100%);
  }
  .rv-hero-grain {
    position:absolute; inset:0; opacity:.045;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:200px;
  }
  .rv-hero-content { position:relative; z-index:2; padding:0 24px; }
  .rv-hero-badge {
    display:inline-block; font-family:'Cinzel',serif; font-size:9px;
    letter-spacing:.46em; text-transform:uppercase; color:var(--gold);
    border:1px solid rgba(201,169,110,.42); padding:9px 28px; margin-bottom:30px;
    animation:rvFadeUp .7s ease both; position:relative;
  }
  .rv-hero-badge::before,.rv-hero-badge::after {
    content:''; position:absolute; width:6px; height:6px;
    border:1px solid var(--gold); transform:rotate(45deg); background:rgba(28,16,8,.6);
  }
  .rv-hero-badge::before{top:-4px;left:-4px}
  .rv-hero-badge::after{bottom:-4px;right:-4px}
  .rv-hero-h1 {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(3.4rem,8.5vw,7.5rem); font-weight:300;
    color:#fff; line-height:1.02; margin-bottom:24px;
    animation:rvFadeUp .88s .13s ease both;
  }
  .rv-hero-h1 .gold-italic {
    font-style:italic; display:block;
    background:linear-gradient(90deg,var(--gold),#f0d090,var(--gold),#c8924a,var(--gold));
    background-size:300% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    animation:rvShimmer 5s linear 1s infinite;
  }
  .rv-hero-sub {
    max-width:560px; margin:0 auto; color:rgba(255,255,255,.68);
    font-size:clamp(.9rem,1.5vw,1.12rem); font-weight:300; line-height:1.9;
    letter-spacing:.03em; animation:rvFadeUp .88s .27s ease both;
  }
  .rv-scroll-cue {
    position:absolute; bottom:34px; left:50%; transform:translateX(-50%);
    z-index:2; display:flex; flex-direction:column; align-items:center; gap:10px;
    animation:rvFadeIn 1s 1.3s both;
  }
  .rv-scroll-track {
    width:1px; height:62px;
    background:linear-gradient(to bottom,rgba(201,169,110,.6),transparent);
    position:relative; overflow:hidden;
  }
  .rv-scroll-track::after {
    content:''; position:absolute; top:0; left:0; width:100%; height:35%;
    background:var(--gold); animation:rvScrollDot 2s ease-in-out infinite;
  }
  .rv-scroll-lbl {
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.4em;
    color:rgba(201,169,110,.65); text-transform:uppercase;
    writing-mode:vertical-lr; transform:rotate(180deg); margin-top:4px;
  }

  /* ── TICKER ── */
  .rv-ticker {
    background:var(--brand-dark); overflow:hidden;
    padding:13px 0; border-top:1px solid rgba(201,169,110,.14);
  }
  .rv-ticker-inner {
    display:flex; white-space:nowrap; width:max-content;
    animation:rvTickerScroll 30s linear infinite;
  }
  .rv-ticker-item {
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em;
    color:rgba(201,169,110,.52); text-transform:uppercase; padding:0 48px;
  }
  .rv-ticker-dot {
    display:inline-block; width:4px; height:4px; background:var(--gold);
    transform:rotate(45deg); margin:0 24px; vertical-align:middle; opacity:.45;
  }

  /* ── STATS ── */
  .rv-stats {
    display:grid; grid-template-columns:repeat(4,1fr);
    background:var(--brand-dark); position:relative; overflow:hidden;
  }
  .rv-stats::before {
    content:''; position:absolute; inset:0;
    background:repeating-linear-gradient(90deg,rgba(201,169,110,.04) 0,rgba(201,169,110,.04) 1px,transparent 1px,transparent 100px);
  }
  .rv-stat { text-align:center; padding:52px 20px; border-right:1px solid rgba(201,169,110,.1); position:relative; }
  .rv-stat:last-child { border-right:none; }
  .rv-stat-num {
    font-family:'Cormorant Garamond',serif; font-size:clamp(2.6rem,4.5vw,4rem);
    color:var(--gold); font-weight:300; display:block; line-height:1;
  }
  .rv-stat-lbl {
    font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.3em;
    color:rgba(253,248,243,.38); margin-top:10px; text-transform:uppercase; display:block;
  }
  @media(max-width:640px) {
    .rv-stats{grid-template-columns:1fr 1fr}
    .rv-stat:nth-child(2){border-right:none}
    .rv-stat:nth-child(3){border-right:1px solid rgba(201,169,110,.1);border-top:1px solid rgba(201,169,110,.1)}
    .rv-stat:nth-child(4){border-top:1px solid rgba(201,169,110,.1)}
  }

  /* ── SECTION HEADER ── */
  .rv-sec-hdr { text-align:center; margin-bottom:72px; }
  .rv-sec-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2.4rem,4.5vw,3.8rem); font-weight:300;
    color:var(--brand-dark); line-height:1.12;
  }
  .rv-sec-title em { font-style:italic; color:var(--brand); }

  /* ── FEATURED REVIEW (cinematic split) ── */
  .rv-featured-sec {
    background:var(--brand-dark); padding:clamp(80px,9vw,140px) clamp(24px,5vw,64px);
    position:relative; overflow:hidden;
  }
  .rv-featured-sec::before {
    content:'"'; position:absolute; top:-60px; left:-10px;
    font-family:'Cormorant Garamond',serif; font-size:520px;
    color:rgba(201,169,110,.03); line-height:1; pointer-events:none; font-weight:700;
  }
  .rv-featured-grid {
    display:grid; grid-template-columns:1fr 1fr; gap:clamp(40px,6vw,100px);
    align-items:center; max-width:1200px; margin:0 auto; position:relative; z-index:1;
  }
  .rv-featured-img-wrap { position:relative; }
  .rv-featured-img {
    width:100%; aspect-ratio:3/4; object-fit:cover;
    filter:saturate(.85) contrast(1.06); display:block;
  }
  .rv-featured-img-border {
    position:absolute; inset:-14px; border:1px solid rgba(201,169,110,.22);
    pointer-events:none; animation:rvBorderGlow 4s ease-in-out infinite;
  }
  .rv-featured-img-tag {
    position:absolute; bottom:-20px; left:-20px;
    background:var(--brand); padding:16px 24px; border-left:3px solid var(--gold);
  }
  .rv-featured-img-tag span {
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.35em;
    color:rgba(253,248,243,.7); text-transform:uppercase; display:block;
  }
  .rv-featured-img-tag strong {
    font-family:'Cormorant Garamond',serif; font-size:1.3rem;
    color:#fff; font-weight:300; display:block; margin-top:4px;
  }
  .rv-featured-quote {
    font-family:'Cormorant Garamond',serif; font-size:clamp(1.6rem,2.5vw,2.1rem);
    color:#fff; font-style:italic; font-weight:300; line-height:1.65;
    margin-bottom:32px;
  }
  .rv-featured-author { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:6px; }
  .rv-featured-event  { font-size:.8rem; color:rgba(253,248,243,.4); font-weight:300; }
  .rv-featured-stars  { display:flex; gap:5px; margin-bottom:28px; }
  .rv-featured-star   { width:11px; height:11px; background:var(--gold); clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%); }
  .rv-featured-mark   { font-family:'Cormorant Garamond',serif; font-size:8rem; color:rgba(201,169,110,.12); line-height:.7; display:block; margin-bottom:8px; font-style:italic; }
  @media(max-width:768px) {
    .rv-featured-grid{grid-template-columns:1fr}
    .rv-featured-img-tag{bottom:12px;left:12px}
  }

  /* ── MAIN REVIEWS GRID ── */
  .rv-grid-sec { padding:clamp(80px,9vw,140px) clamp(24px,5vw,64px); background:var(--brand-light); }
  .rv-grid {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
    gap:24px; max-width:1280px; margin:0 auto;
  }
  .rv-card {
    background:#fff; border:1px solid rgba(139,111,71,.12);
    padding:44px 36px; position:relative; overflow:hidden;
    display:flex; flex-direction:column;
    transition:box-shadow .5s ease;
  }
  .rv-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);
    transform:scaleX(0); transform-origin:left; transition:transform .5s ease;
  }
  .rv-card:hover::before { transform:scaleX(1); }
  .rv-card:hover { box-shadow:0 28px 70px rgba(74,55,40,.12); }
  .rv-card-mark { font-family:'Cormorant Garamond',serif; font-size:4.5rem; color:rgba(201,169,110,.12); line-height:.7; font-style:italic; margin-bottom:12px; }
  .rv-card-stars { display:flex; gap:4px; margin-bottom:20px; }
  .rv-card-star  { width:10px; height:10px; background:var(--gold); clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%); }
  .rv-card-text  { font-family:'Cormorant Garamond',serif; font-size:1.1rem; color:var(--brand-dark); font-style:italic; line-height:1.85; font-weight:300; flex:1; margin-bottom:28px; }
  .rv-card-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(139,111,71,.18),transparent); margin-bottom:22px; }
  .rv-card-img-wrap { display:flex; align-items:center; gap:14px; }
  .rv-card-avatar { width:46px; height:46px; border-radius:50%; object-fit:cover; filter:saturate(.72); border:1.5px solid rgba(201,169,110,.28); flex-shrink:0; }
  .rv-card-names { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.3em; color:var(--brand-dark); text-transform:uppercase; display:block; margin-bottom:3px; }
  .rv-card-date  { font-size:.74rem; color:#a08070; font-weight:300; letter-spacing:.06em; }

  /* ── IMAGE MOSAIC ── */
  .rv-mosaic {
    display:grid; grid-template-columns:repeat(5,1fr); grid-template-rows:repeat(2,240px);
    gap:3px;
  }
  .rv-mosaic-item:nth-child(1){grid-column:span 2;grid-row:span 2}
  .rv-mosaic-item:nth-child(5){grid-column:span 2}
  .rv-mosaic-item { overflow:hidden; position:relative; cursor:pointer; }
  .rv-mosaic-img {
    width:100%; height:100%; object-fit:cover; display:block;
    transition:transform .8s cubic-bezier(.23,1,.32,1),filter .5s ease;
    filter:saturate(.7) contrast(1.06);
  }
  .rv-mosaic-item:hover .rv-mosaic-img { transform:scale(1.08); filter:saturate(1.05) contrast(1.02); }
  .rv-mosaic-item::after { content:''; position:absolute; inset:0; background:rgba(201,169,110,0); transition:background .4s ease; }
  .rv-mosaic-item:hover::after { background:rgba(201,169,110,.06); }
  @media(max-width:640px) {
    .rv-mosaic{grid-template-columns:1fr 1fr;grid-template-rows:repeat(4,160px)}
    .rv-mosaic-item:nth-child(1){grid-column:span 2;grid-row:span 1}
    .rv-mosaic-item:nth-child(5){grid-column:span 2}
  }

  /* ── WALL OF LOVE (dark masonry-style) ── */
  .rv-wall-sec {
    background:var(--brand-dark); padding:clamp(80px,9vw,140px) clamp(24px,5vw,64px);
    position:relative; overflow:hidden;
  }
  .rv-wall-sec::before {
    content:'LOVE'; position:absolute; bottom:-20px; right:-10px;
    font-family:'Cormorant Garamond',serif; font-size:260px; font-weight:700;
    color:rgba(201,169,110,.025); white-space:nowrap; pointer-events:none;
  }
  .rv-wall-grid {
    display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
    gap:16px; max-width:1200px; margin:0 auto; position:relative; z-index:1;
  }
  .rv-wall-card {
    border:1px solid rgba(201,169,110,.1); padding:32px 28px;
    background:rgba(255,255,255,.03); backdrop-filter:blur(6px);
    transition:all .4s ease; position:relative;
  }
  .rv-wall-card:hover { background:rgba(255,255,255,.07); transform:translateY(-5px); border-color:rgba(201,169,110,.22); }
  .rv-wall-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);
    transform:scaleX(0); transform-origin:left; transition:transform .5s ease;
  }
  .rv-wall-card:hover::before { transform:scaleX(1); }
  .rv-wall-quote { font-family:'Cormorant Garamond',serif; font-size:1rem; color:rgba(253,248,243,.75); font-style:italic; line-height:1.8; margin-bottom:20px; font-weight:300; }
  .rv-wall-meta  { font-family:'Cinzel',serif; font-size:8px; letter-spacing:.32em; color:var(--gold); text-transform:uppercase; }
  .rv-wall-date  { font-size:.72rem; color:rgba(253,248,243,.28); margin-top:3px; font-weight:300; }

  /* ── RATING BAR ── */
  .rv-rating-sec { padding:clamp(80px,9vw,130px) clamp(24px,5vw,64px); background:var(--smoke); }
  .rv-rating-inner { display:grid; grid-template-columns:1fr 1fr; gap:80px; max-width:1100px; margin:0 auto; align-items:center; }
  .rv-rating-score-wrap { text-align:center; }
  .rv-rating-big {
    font-family:'Cormorant Garamond',serif; font-size:8rem; color:var(--brand-dark);
    font-weight:300; line-height:1; display:block; margin-bottom:8px;
  }
  .rv-rating-stars-big { display:flex; gap:6px; justify-content:center; margin-bottom:12px; }
  .rv-rating-star-big  { width:18px; height:18px; background:var(--gold); clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%); }
  .rv-rating-total { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.35em; color:var(--muted); text-transform:uppercase; }
  .rv-rating-bars {}
  .rv-rating-bar-row { display:flex; align-items:center; gap:16px; margin-bottom:18px; }
  .rv-rating-bar-label { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.28em; color:var(--brand-dark); text-transform:uppercase; width:64px; flex-shrink:0; text-align:right; }
  .rv-rating-bar-track { flex:1; height:4px; background:rgba(139,111,71,.12); position:relative; overflow:hidden; }
  .rv-rating-bar-fill  { height:100%; background:linear-gradient(90deg,var(--gold),var(--brand)); transform-origin:left; transform:scaleX(0); transition:transform 1.2s cubic-bezier(.23,1,.32,1); }
  .rv-rating-bar-fill.active { transform:scaleX(1); }
  .rv-rating-bar-pct   { font-family:'Jost',sans-serif; font-size:.8rem; color:var(--muted); font-weight:300; width:36px; text-align:right; flex-shrink:0; }
  @media(max-width:768px) {
    .rv-rating-inner{grid-template-columns:1fr;gap:48px}
  }

  /* ── VENUES MENTIONED ── */
  .rv-venues-sec { padding:clamp(80px,9vw,130px) clamp(24px,5vw,64px); background:var(--brand-light); }
  .rv-venues-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:3px; max-width:1200px; margin:0 auto; }
  .rv-venue-card { position:relative; overflow:hidden; min-height:300px; display:flex; align-items:flex-end; cursor:pointer; }
  .rv-venue-img  { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform .8s cubic-bezier(.23,1,.32,1); filter:saturate(.8) contrast(1.05); }
  .rv-venue-card:hover .rv-venue-img { transform:scale(1.07); }
  .rv-venue-grad { position:absolute; inset:0; background:linear-gradient(to top,rgba(28,16,8,.88) 0%,rgba(28,16,8,.2) 60%,transparent 100%); transition:opacity .5s ease; }
  .rv-venue-card:hover .rv-venue-grad { opacity:.96; }
  .rv-venue-info { position:relative; z-index:1; padding:28px; }
  .rv-venue-tag  { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.38em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:6px; }
  .rv-venue-name { font-family:'Cormorant Garamond',serif; font-size:1.6rem; color:#fff; font-weight:300; line-height:1.15; }
  .rv-venue-cap  { font-size:.78rem; color:rgba(253,248,243,.4); margin-top:5px; font-weight:300; }

  /* ── CTA ── */
  .rv-cta-sec {
    background:var(--brand-dark); padding:clamp(90px,11vw,160px) clamp(24px,5vw,64px);
    text-align:center; position:relative; overflow:hidden;
    border-top:1px solid rgba(201,169,110,.14);
  }
  .rv-cta-ring { position:absolute; border-radius:50%; border:1px solid rgba(201,169,110,.07); top:50%; left:50%; pointer-events:none; }
  .rv-cta-h2 {
    font-family:'Cormorant Garamond',serif; font-size:clamp(2.6rem,6vw,5.2rem);
    font-weight:300; color:#fff; line-height:1.1; margin-bottom:20px; position:relative; z-index:1;
  }
  .rv-cta-h2 em { font-style:italic; color:var(--gold); }
  .rv-cta-sub { max-width:520px; margin:0 auto 48px; color:rgba(255,255,255,.52); font-size:1rem; font-weight:300; line-height:1.9; position:relative; z-index:1; }
  .rv-cta-btns { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; position:relative; z-index:1; }
  .rv-btn-primary {
    background:var(--brand); color:var(--brand-light);
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none; position:relative; overflow:hidden;
    transition:all .45s cubic-bezier(.23,1,.32,1); box-shadow:0 6px 28px rgba(139,111,71,.4);
  }
  .rv-btn-primary::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--gold) 0%,var(--brand-dark) 100%); opacity:0; transition:opacity .4s ease; }
  .rv-btn-primary:hover  { transform:translateY(-3px); box-shadow:0 14px 44px rgba(139,111,71,.5); }
  .rv-btn-primary:hover::after { opacity:1; }
  .rv-btn-primary span   { position:relative; z-index:1; }
  .rv-btn-outline {
    border:1.5px solid rgba(255,255,255,.38); color:#fff;
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none; transition:all .4s ease;
  }
  .rv-btn-outline:hover { border-color:var(--gold); color:var(--gold); transform:translateY(-3px); }
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
    const steps = 55; const inc = target / steps; let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(cur));
    }, duration / steps);
    return () => clearInterval(t);
  }, [inView, target, duration]);
  return val;
}

/* ─────────────────────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, dir = 'up', className = '' }) {
  const [ref, inView] = useInView();
  const map = { up: 'rvFadeUp', left: 'rvSlideL', right: 'rvSlideR', plain: 'rvFadeIn' };
  return (
    <div ref={ref} className={className} style={{
      animation: inView ? `${map[dir]} .85s ${delay}s cubic-bezier(.23,1,.32,1) both` : 'none',
      opacity: inView ? undefined : 0,
    }}>{children}</div>
  );
}

function Ornament() {
  return (
    <div className="rv-ornament">
      <div className="rv-ornament-line" />
      <div className="rv-ornament-gem" />
      <div className="rv-ornament-line r" />
    </div>
  );
}

function SectionHeader({ eyebrow, title, light = false }) {
  return (
    <div className="rv-sec-hdr">
      <span className="rv-eyebrow" style={light ? { color: 'var(--gold)' } : {}}>{eyebrow}</span>
      <Ornament />
      <h2 className="rv-sec-title" style={light ? { color: '#fff' } : {}} dangerouslySetInnerHTML={{ __html: title }} />
    </div>
  );
}

function TiltCard({ children, className, style }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(5px)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateY(0) rotateX(0) translateZ(0)';
  }, []);
  return (
    <div ref={ref} className={className} style={{ transition: 'transform .35s ease', ...style }}
      onMouseMove={onMove} onMouseLeave={onLeave}>{children}</div>
  );
}

function StatItem({ number, suffix, label }) {
  const [ref, inView] = useInView(0.3);
  const val = useCounter(number, inView);
  return (
    <div ref={ref} className="rv-stat">
      <span className="rv-stat-num">{val}{suffix}</span>
      <span className="rv-stat-lbl">{label}</span>
    </div>
  );
}

function RatingBar({ label, pct, delay }) {
  const [ref, inView] = useInView(0.2);
  return (
    <div ref={ref} className="rv-rating-bar-row">
      <span className="rv-rating-bar-label">{label}</span>
      <div className="rv-rating-bar-track">
        <div className="rv-rating-bar-fill" style={{
          width: `${pct}%`,
          transitionDelay: inView ? `${delay}s` : '0s',
          transform: inView ? 'scaleX(1)' : 'scaleX(0)',
          transition: inView ? `transform 1.2s ${delay}s cubic-bezier(.23,1,.32,1)` : 'none',
        }} />
      </div>
      <span className="rv-rating-bar-pct">{pct}%</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DATA  (original 6 reviews preserved exactly)
───────────────────────────────────────────────────────────── */
const reviews = [
  { id:1, names:"Priya & Rahul",   date:"Wedding 2024", text:"The team captured our wedding so beautifully! Every photo tells a story. We couldn't be happier with the results. They made us feel entirely at ease in front of the camera.", rating:5 },
  { id:2, names:"Anita & Vikram",  date:"Wedding 2024", text:"Professional, creative, and so easy to work with. Our wedding film is absolutely stunning! We've watched it a dozen times and it brings back all the emotions perfectly.", rating:5 },
  { id:3, names:"Meera & Arjun",   date:"Wedding 2024", text:"From the first meeting to the final delivery, everything was perfect. Highly recommend! The bespoke album they designed for us is a true family heirloom.", rating:5 },
  { id:4, names:"Sneha & Rohan",   date:"Wedding 2025", text:"They truly understood our vision for a minimalist, elegant celebration. The photos look like they belong in a high-end bridal magazine. Absolutely breathtaking work.", rating:5 },
  { id:5, names:"Aisha & Kabir",   date:"Wedding 2025", text:"Booking them was the best decision we made for our wedding. The candid shots are our absolute favorites—they captured the real joy, laughter, and chaos perfectly.", rating:5 },
  { id:6, names:"Riya & Aman",     date:"Wedding 2023", text:"Incredible talent and such a calming presence on a very fast-paced day. The final gallery was delivered ahead of schedule and completely blew our families away.", rating:5 },
];

const wallReviews = [
  { quote:"The way they captured the mandap ceremony had our entire family in tears. Pure magic.", names:"Divya & Karthik", date:"Heritage Hall, 2024" },
  { quote:"We had 1,100 guests and they made every moment feel intimate. Truly gifted artists.", names:"Pooja & Nikhil", date:"The Grand Rosewood, 2025" },
  { quote:"Our pre-wedding shoot in Jaipur was editorial-level. We cannot stop showing everyone.", names:"Tara & Sid", date:"Destination Shoot, 2024" },
  { quote:"Delivered the gallery 10 days ahead of schedule. Professionalism at every step.", names:"Nandini & Rohan", date:"Sky Garden Terrace, 2024" },
  { quote:"The album is absolutely museum quality. It lives in a glass case in our living room.", names:"Shruti & Dev", date:"The Ivory Manor, 2025" },
  { quote:"They blended into the celebration completely — and somehow caught every single moment.", names:"Kajal & Aryan", date:"Lakeside Pavilion, 2023" },
  { quote:"The cinematic film made my mother cry every time she watches it. That is priceless.", names:"Pia & Sameer", date:"Grand Ballroom, 2025" },
  { quote:"Five stars is not enough. This team redefined what wedding photography means to us.", names:"Ritika & Aakash", date:"Garden Estate, 2024" },
];

const avatarImgs = [
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=100&q=70",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=100&q=70",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=100&q=70",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=100&q=70",
  "https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=100&q=70",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=100&q=70",
];

const mosaicImgs = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=75",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=75",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=700&q=75",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=700&q=75",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=75",
];

const venueImgs = [
  { img:"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80", tag:"Flagship Hall",   name:"The Grand Rosewood", cap:"Mentioned in 180+ reviews" },
  { img:"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80", tag:"Rooftop Garden",  name:"Sky Garden Terrace",  cap:"Mentioned in 94+ reviews" },
  { img:"https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80", tag:"Heritage Estate", name:"The Ivory Manor",      cap:"Mentioned in 72+ reviews" },
];

const tickerItems = ["Wedding Photography","Cinematic Films","Happy Couples","Five-Star Reviews","Banquet Venues","Pre-Wedding Shoots","Bespoke Albums","Destination Weddings"];

const ratingBars = [
  { label:"5 Stars", pct:96 },
  { label:"4 Stars", pct:3  },
  { label:"3 Stars", pct:1  },
];

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────── */
export default function Reviews() {

  /* original renderStars preserved */
  const renderStars = () => (
    <div className="rv-card-stars">
      {[...Array(5)].map((_, i) => <div key={i} className="rv-card-star" />)}
    </div>
  );

  return (
    <>
      <style>{STYLES}</style>

      {/* ══ HERO ══ */}
      <section className="rv-hero">
        <div className="rv-hero-bg" style={{ backgroundImage:"url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85')" }} />
        <div className="rv-hero-overlay" />
        <div className="rv-hero-grain" />
        <div className="rv-hero-content">
          <div className="rv-hero-badge">Love Notes</div>
          <h1 className="rv-hero-h1">
            What Our Couples
            <span className="gold-italic">Say</span>
          </h1>
          <p className="rv-hero-sub">
            Don't just take our word for it. Hear from the happy couples we've had the honour of working with to capture their most precious moments forever.
          </p>
        </div>
        <div className="rv-scroll-cue">
          <div className="rv-scroll-track" />
          <span className="rv-scroll-lbl">Scroll</span>
        </div>
      </section>

      {/* ══ TICKER ══ */}
      <div className="rv-ticker">
        <div className="rv-ticker-inner">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="rv-ticker-item">{item}<span className="rv-ticker-dot" /></span>
          ))}
        </div>
      </div>

      {/* ══ STATS ══ */}
      <div className="rv-stats">
        <StatItem number={500} suffix="+"    label="Weddings Captured" />
        <StatItem number={98}  suffix="%"    label="5-Star Reviews" />
        <StatItem number={12}  suffix="+"    label="Industry Awards" />
        <StatItem number={8}   suffix=" yrs" label="of Excellence" />
      </div>

      {/* ══ FEATURED REVIEW ══ */}
      <section className="rv-featured-sec">
        <Reveal>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <span className="rv-eyebrow" style={{ color:'var(--gold)' }}>Editor's Choice</span>
            <Ornament />
            <h2 className="rv-sec-title" style={{ color:'#fff' }}>
              A Featured <em style={{ fontStyle:'italic', color:'var(--gold)' }}>Love Story</em>
            </h2>
          </div>
        </Reveal>
        <div className="rv-featured-grid">
          <Reveal dir="left">
            <div className="rv-featured-img-wrap">
              <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=80" alt="Featured couple" className="rv-featured-img" loading="lazy" />
              <div className="rv-featured-img-border" />
              <div className="rv-featured-img-tag">
                <span>Wedding 2025</span>
                <strong>The Grand Rosewood</strong>
              </div>
            </div>
          </Reveal>
          <Reveal dir="right" delay={0.1}>
            <div>
              <span className="rv-featured-mark">"</span>
              <div className="rv-featured-stars">{Array.from({length:5}).map((_,i)=><div className="rv-featured-star" key={i}/>)}</div>
              <p className="rv-featured-quote">
                "Every photograph is a portal back to that perfect day. The attention to light, emotion, and composition is extraordinary — we feel like the subjects of a film we never want to end."
              </p>
              <span className="rv-featured-author">Ishita & Aryan Kapoor</span>
              <span className="rv-featured-event">Grand Ballroom Wedding, March 2025 &nbsp;·&nbsp; 800 Guests</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ MAIN REVIEWS GRID ══ */}
      <section className="rv-grid-sec">
        <Reveal>
          <SectionHeader eyebrow="Client Testimonials" title="Stories of <em>Love & Joy</em>" />
        </Reveal>
        <div className="rv-grid">
          {reviews.map((review, i) => (
            <Reveal key={review.id} delay={i * 0.07}>
              <TiltCard className="rv-card">
                <div className="rv-card-mark">"</div>
                {renderStars()}
                <p className="rv-card-text">"{review.text}"</p>
                <div className="rv-card-divider" />
                <div className="rv-card-img-wrap">
                  <img src={avatarImgs[i]} alt={review.names} className="rv-card-avatar" loading="lazy" />
                  <div>
                    <span className="rv-card-names">{review.names}</span>
                    <span className="rv-card-date">{review.date}</span>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ IMAGE MOSAIC ══ */}
      <div className="rv-mosaic">
        {mosaicImgs.map((src, i) => (
          <div className="rv-mosaic-item" key={i}>
            <img src={src} alt="" className="rv-mosaic-img" loading="lazy" />
          </div>
        ))}
      </div>

      {/* ══ RATING BREAKDOWN ══ */}
      <section className="rv-rating-sec">
        <Reveal>
          <SectionHeader eyebrow="Overall Rating" title="Our <em>Reputation</em> in Numbers" />
        </Reveal>
        <div className="rv-rating-inner">
          <Reveal dir="left">
            <div className="rv-rating-score-wrap">
              <span className="rv-rating-big">5.0</span>
              <div className="rv-rating-stars-big">{Array.from({length:5}).map((_,i)=><div className="rv-rating-star-big" key={i}/>)}</div>
              <span className="rv-rating-total">Based on 500+ verified reviews</span>
            </div>
          </Reveal>
          <Reveal dir="right" delay={0.1}>
            <div className="rv-rating-bars">
              {ratingBars.map(({ label, pct }, i) => (
                <RatingBar key={i} label={label} pct={pct} delay={i * 0.15} />
              ))}
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:'.84rem', color:'var(--muted)', fontWeight:300, lineHeight:1.8, marginTop:28 }}>
                Every couple who books with Wedding Chapter receives a follow-up survey 30 days after delivery. Our ratings reflect real, unedited responses — never curated or filtered.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ WALL OF LOVE ══ */}
      <section className="rv-wall-sec">
        <Reveal>
          <SectionHeader eyebrow="Wall of Love" title="<span style='color:#fff'>More</span> <em>Happy Couples</em>" light />
        </Reveal>
        <div className="rv-wall-grid">
          {wallReviews.map(({ quote, names, date }, i) => (
            <Reveal key={i} delay={i * 0.06} dir="plain">
              <TiltCard className="rv-wall-card">
                <p className="rv-wall-quote">"{quote}"</p>
                <span className="rv-wall-meta">{names}</span>
                <span className="rv-wall-date">{date}</span>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ VENUES FEATURED ══ */}
      <section className="rv-venues-sec">
        <Reveal>
          <SectionHeader eyebrow="Most Reviewed Venues" title="Celebrate at Our <em>Iconic Spaces</em>" />
        </Reveal>
        <div className="rv-venues-grid">
          {venueImgs.map(({ img, tag, name, cap }, i) => (
            <Reveal key={i} delay={i * 0.09} dir="plain">
              <div className="rv-venue-card">
                <img src={img} alt={name} className="rv-venue-img" loading="lazy" />
                <div className="rv-venue-grad" />
                <div className="rv-venue-info">
                  <span className="rv-venue-tag">{tag}</span>
                  <h3 className="rv-venue-name">{name}</h3>
                  <p className="rv-venue-cap">{cap}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="rv-cta-sec">
        {[200,380,560,740].map((size, i) => (
          <div key={i} className="rv-cta-ring" style={{
            width:size, height:size, marginLeft:-size/2, marginTop:-size/2,
            animation:`rvPulseRing ${3+i*.7}s ${i*.8}s ease-out infinite`,
          }} />
        ))}
        <Reveal>
          <span className="rv-eyebrow" style={{ color:'var(--gold)' }}>Your Chapter Awaits</span>
          <Ornament />
          <h2 className="rv-cta-h2">
            Ready to Capture<br /><em>Your Love Story?</em>
          </h2>
          <p className="rv-cta-sub">
            Let us create something beautiful together. Reach out to discuss how we can make your wedding day unforgettable — every photograph, every frame, forever.
          </p>
          <div className="rv-cta-btns">
            <Link to="/contact" className="rv-btn-primary"><span>Book a Consultation</span></Link>
            <Link to="/vendors" className="rv-btn-outline">Explore Services</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}