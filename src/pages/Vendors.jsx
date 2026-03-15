import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link } from '@tanstack/react-router';

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

  @keyframes vnFadeUp  { from{opacity:0;transform:translateY(56px)} to{opacity:1;transform:translateY(0)} }
  @keyframes vnSlideL  { from{opacity:0;transform:translateX(-64px)} to{opacity:1;transform:translateX(0)} }
  @keyframes vnSlideR  { from{opacity:0;transform:translateX(64px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes vnFadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes vnShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes vnLineGrow{ from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes vnKen     { 0%{transform:scale(1.04)} 100%{transform:scale(1.1) translateX(-1%)} }
  @keyframes vnScrollDot {
    0%,100%{transform:translateY(0);opacity:1}
    60%{transform:translateY(14px);opacity:0}
    61%{transform:translateY(-4px);opacity:0}
  }
  @keyframes vnBorderGlow {
    0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,0)}
    50%{box-shadow:0 0 0 10px rgba(201,169,110,0.09)}
  }
  @keyframes vnRotateGem {
    0%,100%{transform:rotate(45deg) scale(1)}
    50%{transform:rotate(45deg) scale(1.4)}
  }
  @keyframes vnPulseRing {
    0%{transform:translate(-50%,-50%) scale(1);opacity:.5}
    100%{transform:translate(-50%,-50%) scale(2.7);opacity:0}
  }
  @keyframes vnTickerScroll {
    from{transform:translateX(0)}
    to{transform:translateX(-50%)}
  }
  @keyframes vnSpinRing {
    from{transform:rotate(0deg)}
    to{transform:rotate(360deg)}
  }
  @keyframes vnCounterIn {
    from{opacity:0;transform:translateY(22px)}
    to{opacity:1;transform:translateY(0)}
  }
  @keyframes vnCardReveal {
    from{opacity:0;transform:translateY(40px) scale(.97)}
    to{opacity:1;transform:translateY(0) scale(1)}
  }
  @keyframes vnTopBar {
    from{transform:scaleX(0);transform-origin:left}
    to{transform:scaleX(1);transform-origin:left}
  }

  /* ── Utility ── */
  .vn-eyebrow {
    display:block; font-family:'Cinzel',serif; font-size:9.5px;
    letter-spacing:.44em; text-transform:uppercase; color:var(--gold); margin-bottom:16px;
  }
  .vn-ornament { display:flex; align-items:center; gap:12px; justify-content:center; margin:0 auto 22px; }
  .vn-ornament-line {
    flex:1; max-width:68px; height:1px;
    background:linear-gradient(90deg,transparent,var(--gold));
    transform-origin:left; animation:vnLineGrow .8s ease both;
  }
  .vn-ornament-line.r { background:linear-gradient(90deg,var(--gold),transparent); transform-origin:right; }
  .vn-ornament-gem { width:7px; height:7px; background:var(--gold); transform:rotate(45deg); animation:vnRotateGem 4s ease-in-out infinite; }

  /* ── RESTRICTED ── */
  .vn-restricted {
    min-height:92vh; display:flex; flex-direction:column;
    align-items:center; justify-content:center; text-align:center;
    padding:80px 24px; position:relative; overflow:hidden;
    background:
      radial-gradient(ellipse at 20% 50%,rgba(139,111,71,.07) 0%,transparent 55%),
      radial-gradient(ellipse at 80% 20%,rgba(201,169,110,.06) 0%,transparent 50%),
      var(--brand-light);
  }
  .vn-restricted-bg {
    position:absolute; inset:0; width:100%; height:100%;
    object-fit:cover; opacity:.07; filter:saturate(.4); pointer-events:none;
  }
  .vn-restricted-ring {
    position:absolute; border-radius:50%;
    border:1px solid rgba(201,169,110,.09); top:50%; left:50%; pointer-events:none;
  }
  .vn-restricted-content { position:relative; z-index:2; max-width:620px; }
  .vn-restricted-badge {
    display:inline-block; font-family:'Cinzel',serif; font-size:9px;
    letter-spacing:.45em; text-transform:uppercase; color:var(--gold);
    border:1px solid rgba(201,169,110,.4); padding:9px 28px; margin-bottom:32px;
    animation:vnFadeUp .7s ease both; position:relative;
  }
  .vn-restricted-badge::before,.vn-restricted-badge::after {
    content:''; position:absolute; width:6px; height:6px;
    border:1px solid var(--gold); transform:rotate(45deg); background:var(--brand-light);
  }
  .vn-restricted-badge::before{top:-4px;left:-4px}
  .vn-restricted-badge::after{bottom:-4px;right:-4px}
  .vn-restricted-h2 {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2.8rem,6vw,5.2rem); font-weight:300;
    color:var(--brand-dark); line-height:1.08; margin-bottom:20px;
    animation:vnFadeUp .85s .1s ease both;
  }
  .vn-restricted-h2 em { font-style:italic; color:var(--brand); }
  .vn-restricted-p {
    color:var(--muted); max-width:500px; margin:0 auto 48px;
    font-size:1.05rem; font-weight:300; line-height:1.9;
    animation:vnFadeUp .85s .22s ease both;
  }
  .vn-restricted-btns {
    display:flex; flex-wrap:wrap; gap:16px; justify-content:center;
    animation:vnFadeUp .85s .34s ease both;
  }
  /* preview strip below restricted CTA */
  .vn-restricted-preview {
    position:relative; z-index:2; margin-top:72px; width:100%;
    max-width:900px; display:grid; grid-template-columns:repeat(3,1fr); gap:3px;
    animation:vnFadeIn 1s .6s both;
  }
  .vn-preview-item { aspect-ratio:4/3; overflow:hidden; position:relative; }
  .vn-preview-img { width:100%; height:100%; object-fit:cover; filter:saturate(.5) blur(2px); display:block; }
  .vn-preview-item::after { content:''; position:absolute; inset:0; background:rgba(253,248,243,.55); }

  /* ── LOADING ── */
  .vn-loading {
    min-height:72vh; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:24px; background:var(--brand-light);
  }
  .vn-loading-spinner {
    width:48px; height:48px; border:1.5px solid rgba(201,169,110,.2);
    border-top-color:var(--gold); border-radius:50%;
    animation:vnSpinRing 1s linear infinite;
  }
  .vn-loading-text {
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em;
    text-transform:uppercase; color:var(--gold);
  }

  /* ── HERO ── */
  .vn-hero {
    position:relative; height:72vh; min-height:520px;
    display:flex; align-items:center; justify-content:center;
    text-align:center; overflow:hidden;
  }
  .vn-hero-bg {
    position:absolute; inset:0; background-size:cover; background-position:center 35%;
    animation:vnKen 18s ease-in-out infinite alternate;
  }
  .vn-hero-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to bottom,rgba(28,16,8,.52) 0%,rgba(28,16,8,.22) 42%,rgba(28,16,8,.76) 100%);
  }
  .vn-hero-grain {
    position:absolute; inset:0; opacity:.044;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:200px;
  }
  .vn-hero-content { position:relative; z-index:2; padding:0 24px; }
  .vn-hero-badge {
    display:inline-block; font-family:'Cinzel',serif; font-size:9px;
    letter-spacing:.46em; text-transform:uppercase; color:var(--gold);
    border:1px solid rgba(201,169,110,.42); padding:9px 28px; margin-bottom:30px;
    animation:vnFadeUp .7s ease both; position:relative;
  }
  .vn-hero-badge::before,.vn-hero-badge::after {
    content:''; position:absolute; width:6px; height:6px;
    border:1px solid var(--gold); transform:rotate(45deg); background:rgba(28,16,8,.6);
  }
  .vn-hero-badge::before{top:-4px;left:-4px}
  .vn-hero-badge::after{bottom:-4px;right:-4px}
  .vn-hero-h1 {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(3.4rem,8.5vw,7.8rem); font-weight:300;
    color:#fff; line-height:1.02; margin-bottom:24px;
    animation:vnFadeUp .9s .13s ease both;
  }
  .vn-hero-h1 .gold-italic {
    font-style:italic; display:block;
    background:linear-gradient(90deg,var(--gold),#f0d090,var(--gold),#c8924a,var(--gold));
    background-size:300% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    animation:vnShimmer 5s linear 1s infinite;
  }
  .vn-hero-sub {
    max-width:560px; margin:0 auto; color:rgba(255,255,255,.68);
    font-size:clamp(.9rem,1.5vw,1.12rem); font-weight:300; line-height:1.9;
    animation:vnFadeUp .9s .28s ease both;
  }
  .vn-scroll-cue {
    position:absolute; bottom:34px; left:50%; transform:translateX(-50%);
    z-index:2; display:flex; flex-direction:column; align-items:center; gap:10px;
    animation:vnFadeIn 1s 1.3s both;
  }
  .vn-scroll-track {
    width:1px; height:62px;
    background:linear-gradient(to bottom,rgba(201,169,110,.6),transparent);
    position:relative; overflow:hidden;
  }
  .vn-scroll-track::after {
    content:''; position:absolute; top:0; left:0; width:100%; height:35%;
    background:var(--gold); animation:vnScrollDot 2s ease-in-out infinite;
  }
  .vn-scroll-lbl {
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.4em;
    color:rgba(201,169,110,.65); text-transform:uppercase;
    writing-mode:vertical-lr; transform:rotate(180deg); margin-top:4px;
  }

  /* ── TICKER ── */
  .vn-ticker {
    background:var(--brand-dark); overflow:hidden;
    padding:13px 0; border-top:1px solid rgba(201,169,110,.14);
  }
  .vn-ticker-inner { display:flex; white-space:nowrap; width:max-content; animation:vnTickerScroll 28s linear infinite; }
  .vn-ticker-item  { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em; color:rgba(201,169,110,.52); text-transform:uppercase; padding:0 48px; }
  .vn-ticker-dot   { display:inline-block; width:4px; height:4px; background:var(--gold); transform:rotate(45deg); margin:0 24px; vertical-align:middle; opacity:.45; }

  /* ── STATS ── */
  .vn-stats {
    display:grid; grid-template-columns:repeat(4,1fr);
    background:var(--brand-dark); position:relative; overflow:hidden;
  }
  .vn-stats::before {
    content:''; position:absolute; inset:0;
    background:repeating-linear-gradient(90deg,rgba(201,169,110,.04) 0,rgba(201,169,110,.04) 1px,transparent 1px,transparent 100px);
  }
  .vn-stat { text-align:center; padding:52px 20px; border-right:1px solid rgba(201,169,110,.1); position:relative; z-index:1; }
  .vn-stat:last-child { border-right:none; }
  .vn-stat-num { font-family:'Cormorant Garamond',serif; font-size:clamp(2.6rem,4.5vw,4rem); color:var(--gold); font-weight:300; display:block; line-height:1; }
  .vn-stat-lbl { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.3em; color:rgba(253,248,243,.38); margin-top:10px; text-transform:uppercase; display:block; }
  @media(max-width:640px){
    .vn-stats{grid-template-columns:1fr 1fr}
    .vn-stat:nth-child(2){border-right:none}
    .vn-stat:nth-child(3){border-right:1px solid rgba(201,169,110,.1);border-top:1px solid rgba(201,169,110,.1)}
    .vn-stat:nth-child(4){border-top:1px solid rgba(201,169,110,.1)}
  }

  /* ── SECTION HEADER ── */
  .vn-sec-hdr { text-align:center; margin-bottom:72px; }
  .vn-sec-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2.4rem,4.5vw,3.8rem); font-weight:300;
    color:var(--brand-dark); line-height:1.12;
  }
  .vn-sec-title em { font-style:italic; color:var(--brand); }

  /* ── VENDORS GRID SECTION ── */
  .vn-grid-sec { padding:clamp(80px,9vw,140px) clamp(24px,5vw,64px); background:var(--brand-light); }
  .vn-grid {
    display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr));
    gap:24px; max-width:1320px; margin:0 auto;
  }

  /* ── VENDOR CARD ── */
  .vn-card {
    background:#fff; border:1px solid rgba(139,111,71,.1);
    overflow:hidden; position:relative;
    transition:box-shadow .5s ease;
    display:flex; flex-direction:column;
  }
  .vn-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);
    transform:scaleX(0); transform-origin:left; transition:transform .55s ease; z-index:2;
  }
  .vn-card:hover::before { transform:scaleX(1); }
  .vn-card:hover { box-shadow:0 28px 72px rgba(74,55,40,.14); }

  /* image */
  .vn-card-img-wrap { height:260px; overflow:hidden; position:relative; flex-shrink:0; }
  .vn-card-img {
    width:100%; height:100%; object-fit:cover; display:block;
    transition:transform .8s cubic-bezier(.23,1,.32,1), filter .5s ease;
    filter:saturate(.82) contrast(1.04);
  }
  .vn-card:hover .vn-card-img { transform:scale(1.07); filter:saturate(1) contrast(1.04); }
  .vn-card-img-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to top,rgba(28,16,8,.6) 0%,transparent 50%);
    opacity:0; transition:opacity .5s ease;
  }
  .vn-card:hover .vn-card-img-overlay { opacity:1; }
  .vn-card-cat {
    position:absolute; top:18px; left:18px;
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.36em;
    text-transform:uppercase; color:var(--gold);
    background:rgba(28,16,8,.72); border:1px solid rgba(201,169,110,.28);
    padding:6px 14px; backdrop-filter:blur(4px);
  }
  .vn-card-price {
    position:absolute; top:18px; right:18px;
    font-family:'Cormorant Garamond',serif; font-size:1rem;
    color:#fff; background:rgba(28,16,8,.72); border:1px solid rgba(201,169,110,.2);
    padding:5px 12px; font-weight:300; backdrop-filter:blur(4px);
  }

  /* body */
  .vn-card-body { padding:28px 28px 0; flex:1; }
  .vn-card-name {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(1.4rem,2.2vw,1.8rem); font-weight:300;
    color:var(--brand-dark); margin-bottom:10px; line-height:1.15;
    transition:color .3s ease;
  }
  .vn-card:hover .vn-card-name { color:var(--brand); }
  .vn-card-desc { font-family:'Jost',sans-serif; font-size:.86rem; color:#8a7060; line-height:1.82; font-weight:300; margin-bottom:20px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

  /* footer */
  .vn-card-footer {
    padding:18px 28px 28px;
    display:flex; justify-content:space-between; align-items:center;
    border-top:1px solid rgba(139,111,71,.08); margin-top:auto;
  }
  .vn-card-loc {
    display:flex; align-items:center; gap:7px;
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.3em;
    text-transform:uppercase; color:var(--muted);
  }
  .vn-card-loc svg { flex-shrink:0; }
  .vn-card-link {
    font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.34em;
    text-transform:uppercase; color:var(--brand-dark); text-decoration:none;
    display:flex; align-items:center; gap:8px; position:relative;
    padding-bottom:3px; transition:color .3s ease;
  }
  .vn-card-link::after {
    content:''; position:absolute; bottom:0; left:0;
    width:0; height:1px; background:var(--gold); transition:width .4s ease;
  }
  .vn-card-link:hover { color:var(--brand); }
  .vn-card-link:hover::after { width:100%; }
  .vn-card-link svg { transition:transform .3s ease; }
  .vn-card-link:hover svg { transform:translateX(5px); }

  /* ── FEATURED BANNER ── */
  .vn-featured-sec {
    background:var(--brand-dark); padding:clamp(80px,9vw,130px) clamp(24px,5vw,64px);
    position:relative; overflow:hidden;
  }
  .vn-featured-sec::before {
    content:'PARTNERS'; position:absolute; bottom:-20px; right:-10px;
    font-family:'Cormorant Garamond',serif; font-size:180px; font-weight:700;
    color:rgba(201,169,110,.025); white-space:nowrap; pointer-events:none;
  }
  .vn-featured-grid {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
    gap:3px; max-width:1200px; margin:0 auto; position:relative; z-index:1;
  }
  .vn-feat-card {
    position:relative; overflow:hidden; min-height:340px;
    display:flex; align-items:flex-end; cursor:pointer;
  }
  .vn-feat-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform .8s cubic-bezier(.23,1,.32,1); filter:saturate(.82) contrast(1.05); }
  .vn-feat-card:hover .vn-feat-img { transform:scale(1.07); }
  .vn-feat-grad { position:absolute; inset:0; background:linear-gradient(to top,rgba(28,16,8,.9) 0%,rgba(28,16,8,.22) 60%,transparent 100%); transition:opacity .5s ease; }
  .vn-feat-card:hover .vn-feat-grad { opacity:.96; }
  .vn-feat-arrow {
    position:absolute; top:22px; right:22px; width:38px; height:38px;
    border:1px solid rgba(201,169,110,.3); display:flex; align-items:center; justify-content:center;
    opacity:0; transform:translateY(8px); transition:all .4s ease; z-index:2;
  }
  .vn-feat-card:hover .vn-feat-arrow { opacity:1; transform:translateY(0); }
  .vn-feat-info { position:relative; z-index:1; padding:28px; }
  .vn-feat-tag { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.38em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:6px; }
  .vn-feat-name { font-family:'Cormorant Garamond',serif; font-size:clamp(1.4rem,2.5vw,1.9rem); color:#fff; font-weight:300; line-height:1.15; }
  .vn-feat-cap  { font-size:.78rem; color:rgba(253,248,243,.42); margin-top:5px; font-weight:300; }

  /* ── HOW IT WORKS ── */
  .vn-how-sec { padding:clamp(80px,9vw,130px) clamp(24px,5vw,64px); background:var(--smoke); }
  .vn-how-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:3px; max-width:1100px; margin:0 auto; }
  .vn-how-card {
    background:#fff; border:1px solid rgba(139,111,71,.09);
    padding:48px 36px; position:relative; overflow:hidden;
    transition:all .45s ease;
  }
  .vn-how-card:nth-child(2) { background:var(--brand-dark); }
  .vn-how-card:nth-child(2) .vn-how-title { color:var(--gold); }
  .vn-how-card:nth-child(2) .vn-how-text  { color:rgba(253,248,243,.52); }
  .vn-how-card:nth-child(2) .vn-how-num   { color:rgba(201,169,110,.07); }
  .vn-how-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);
    transform:scaleX(0); transform-origin:left; transition:transform .55s ease;
  }
  .vn-how-card:hover { transform:translateY(-6px); box-shadow:0 24px 64px rgba(74,55,40,.12); }
  .vn-how-card:hover::before { transform:scaleX(1); }
  .vn-how-num   { font-family:'Cormorant Garamond',serif; font-size:5rem; color:rgba(139,111,71,.07); font-weight:300; position:absolute; top:12px; right:18px; line-height:1; }
  .vn-how-title { font-family:'Cormorant Garamond',serif; font-size:1.5rem; color:var(--brand-dark); font-weight:400; margin-bottom:14px; line-height:1.2; }
  .vn-how-text  { font-size:.88rem; color:#8a7060; line-height:1.85; font-weight:300; }

  /* ── CATEGORIES STRIP ── */
  .vn-cats-sec { padding:clamp(72px,8vw,120px) clamp(24px,5vw,64px); background:var(--brand-light); }
  .vn-cats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:3px; max-width:1200px; margin:0 auto; }
  .vn-cat-item {
    position:relative; overflow:hidden; aspect-ratio:1;
    display:flex; align-items:flex-end; cursor:pointer;
  }
  .vn-cat-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform .7s cubic-bezier(.23,1,.32,1),filter .5s ease; filter:saturate(.65) contrast(1.06); }
  .vn-cat-item:hover .vn-cat-img { transform:scale(1.1); filter:saturate(1) contrast(1.02); }
  .vn-cat-grad { position:absolute; inset:0; background:linear-gradient(to top,rgba(28,16,8,.82) 0%,transparent 60%); }
  .vn-cat-info { position:relative; z-index:1; padding:12px 14px; width:100%; }
  .vn-cat-name { font-family:'Cinzel',serif; font-size:8px; letter-spacing:.3em; color:#fff; text-transform:uppercase; display:block; }

  /* ── TESTIMONIALS ── */
  .vn-testi-sec { background:var(--brand-dark); padding:clamp(80px,9vw,130px) clamp(24px,5vw,64px); position:relative; overflow:hidden; }
  .vn-testi-sec::before { content:'"'; position:absolute; top:-60px; left:-8px; font-family:'Cormorant Garamond',serif; font-size:480px; color:rgba(201,169,110,.03); line-height:1; pointer-events:none; font-weight:700; }
  .vn-testi-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:20px; max-width:1100px; margin:0 auto; position:relative; z-index:1; }
  .vn-testi-card { border:1px solid rgba(201,169,110,.1); padding:40px 32px; background:rgba(255,255,255,.03); position:relative; transition:all .4s ease; }
  .vn-testi-card:hover { background:rgba(255,255,255,.06); transform:translateY(-5px); border-color:rgba(201,169,110,.22); }
  .vn-testi-mark { position:absolute; top:18px; right:22px; font-family:'Cormorant Garamond',serif; font-size:4rem; color:rgba(201,169,110,.1); line-height:1; font-style:italic; }
  .vn-testi-stars { display:flex; gap:4px; margin-bottom:20px; }
  .vn-testi-star  { width:9px; height:9px; background:var(--gold); clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%); }
  .vn-testi-quote { font-family:'Cormorant Garamond',serif; font-size:1.1rem; color:rgba(253,248,243,.82); font-style:italic; line-height:1.85; margin-bottom:24px; font-weight:300; }
  .vn-testi-couple { display:flex; align-items:center; gap:12px; }
  .vn-testi-avatar { width:44px; height:44px; border-radius:50%; object-fit:cover; filter:saturate(.7); border:1.5px solid rgba(201,169,110,.28); flex-shrink:0; }
  .vn-testi-name  { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.3em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:3px; }
  .vn-testi-event { font-size:.74rem; color:rgba(253,248,243,.3); font-weight:300; }

  /* ── MOSAIC ── */
  .vn-mosaic { display:grid; grid-template-columns:repeat(5,1fr); grid-template-rows:repeat(2,220px); gap:3px; }
  .vn-mosaic-item:nth-child(1){ grid-column:span 2; grid-row:span 2; }
  .vn-mosaic-item:nth-child(5){ grid-column:span 2; }
  .vn-mosaic-item { overflow:hidden; position:relative; }
  .vn-mosaic-img  { width:100%; height:100%; object-fit:cover; display:block; transition:transform .8s cubic-bezier(.23,1,.32,1),filter .5s ease; filter:saturate(.7) contrast(1.06); }
  .vn-mosaic-item:hover .vn-mosaic-img { transform:scale(1.08); filter:saturate(1.05) contrast(1.02); }
  .vn-mosaic-item::after { content:''; position:absolute; inset:0; background:rgba(201,169,110,0); transition:background .4s ease; }
  .vn-mosaic-item:hover::after { background:rgba(201,169,110,.06); }
  @media(max-width:640px){
    .vn-mosaic{grid-template-columns:1fr 1fr;grid-template-rows:repeat(4,150px)}
    .vn-mosaic-item:nth-child(1){grid-column:span 2;grid-row:span 1}
    .vn-mosaic-item:nth-child(5){grid-column:span 2}
  }

  /* ── CTA ── */
  .vn-cta-sec {
    background:var(--brand-dark); padding:clamp(90px,10vw,150px) clamp(24px,5vw,64px);
    text-align:center; position:relative; overflow:hidden;
    border-top:1px solid rgba(201,169,110,.14);
  }
  .vn-cta-ring { position:absolute; border-radius:50%; border:1px solid rgba(201,169,110,.07); top:50%; left:50%; pointer-events:none; }
  .vn-cta-h2 { font-family:'Cormorant Garamond',serif; font-size:clamp(2.4rem,5.5vw,4.8rem); font-weight:300; color:#fff; line-height:1.1; margin-bottom:20px; position:relative; z-index:1; }
  .vn-cta-h2 em { font-style:italic; color:var(--gold); }
  .vn-cta-sub { max-width:500px; margin:0 auto 48px; color:rgba(255,255,255,.5); font-size:.98rem; font-weight:300; line-height:1.9; position:relative; z-index:1; }
  .vn-cta-btns { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; position:relative; z-index:1; }
  .vn-btn-primary {
    background:var(--brand); color:var(--brand-light);
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none; position:relative; overflow:hidden;
    transition:all .45s cubic-bezier(.23,1,.32,1); box-shadow:0 6px 28px rgba(139,111,71,.4);
  }
  .vn-btn-primary::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--gold) 0%,var(--brand-dark) 100%); opacity:0; transition:opacity .4s ease; }
  .vn-btn-primary:hover  { transform:translateY(-3px); box-shadow:0 14px 44px rgba(139,111,71,.5); }
  .vn-btn-primary:hover::after { opacity:1; }
  .vn-btn-primary span   { position:relative; z-index:1; }
  .vn-btn-outline {
    border:1.5px solid rgba(255,255,255,.38); color:#fff;
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none; transition:all .4s ease;
  }
  .vn-btn-outline:hover { border-color:var(--gold); color:var(--gold); transform:translateY(-3px); }
  .vn-btn-dk {
    background:var(--brand-dark); color:var(--brand-light);
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none;
    transition:all .4s ease; box-shadow:0 6px 24px rgba(74,55,40,.26);
  }
  .vn-btn-dk:hover { background:var(--brand); transform:translateY(-3px); }
  .vn-btn-outdk {
    border:1.5px solid var(--brand); color:var(--brand);
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none; transition:all .4s ease;
  }
  .vn-btn-outdk:hover { background:var(--brand); color:var(--brand-light); transform:translateY(-3px); }
  .vn-est { margin-top:72px; opacity:.27; }
  .vn-est p { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em; color:rgba(253,248,243,.9); text-transform:uppercase; margin-top:14px; }
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
  const map = { up:'vnFadeUp', left:'vnSlideL', right:'vnSlideR', plain:'vnFadeIn' };
  return (
    <div ref={ref} className={className} style={{
      animation: inView ? `${map[dir]} .88s ${delay}s cubic-bezier(.23,1,.32,1) both` : 'none',
      opacity: inView ? undefined : 0,
    }}>{children}</div>
  );
}

function Ornament() {
  return (
    <div className="vn-ornament">
      <div className="vn-ornament-line" />
      <div className="vn-ornament-gem" />
      <div className="vn-ornament-line r" />
    </div>
  );
}

function SectionHeader({ eyebrow, title, light = false }) {
  return (
    <div className="vn-sec-hdr">
      <span className="vn-eyebrow" style={light ? { color:'var(--gold)' } : {}}>{eyebrow}</span>
      <Ornament />
      <h2 className="vn-sec-title" style={light ? { color:'#fff' } : {}} dangerouslySetInnerHTML={{ __html: title }} />
    </div>
  );
}

function TiltCard({ children, className }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateZ(4px)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateY(0) rotateX(0) translateZ(0)';
  }, []);
  return (
    <div ref={ref} className={className}
      style={{ transition:'transform .35s ease' }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

function StatItem({ number, suffix, label }) {
  const [ref, inView] = useInView(0.3);
  const val = useCounter(number, inView);
  return (
    <div ref={ref} className="vn-stat">
      <span className="vn-stat-num">{val}{suffix}</span>
      <span className="vn-stat-lbl">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────────────────────── */
const tickerItems = ['Curated Partners','Wedding Chapter','Premium Vendors','Banquet Specialists','Photography','Cinematic Films','Floral Design','Catering','Entertainment'];

const featuredVenues = [
  { tag:'Flagship Hall',    name:'The Grand Rosewood', cap:'Up to 1,200 guests  ·  Mumbai',  img:'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80' },
  { tag:'Rooftop Garden',   name:'Sky Garden Terrace', cap:'Up to 300 guests  ·  Delhi',     img:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80' },
  { tag:'Heritage Estate',  name:'The Ivory Manor',    cap:'Up to 500 guests  ·  Jaipur',    img:'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80' },
];

const howSteps = [
  { num:'01', title:'Browse & Discover',  text:'Filter our curated directory by category, location, and budget to find vendors that match your vision perfectly.' },
  { num:'02', title:'View Full Profiles',  text:'Explore each vendor\'s portfolio, read verified reviews, check pricing, and understand exactly what they offer.' },
  { num:'03', title:'Send an Inquiry',     text:'Submit a request directly through the platform. Vendors respond within 24 hours with a custom proposal.' },
  { num:'04', title:'Book with Confidence',text:'Confirm your booking with transparent pricing, contract support, and a dedicated Wedding Chapter coordinator.' },
];

const categories = [
  { name:'Photography',   img:'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=75' },
  { name:'Cinematography',img:'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=400&q=75' },
  { name:'Florals',       img:'https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=400&q=75' },
  { name:'Catering',      img:'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=75' },
  { name:'Venues',        img:'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=75' },
  { name:'Entertainment', img:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=75' },
];

const testimonials = [
  { quote:'Finding our photographer through Wedding Chapter was seamless. The vendor profiles are thorough and completely honest.', name:'Priya & Arjun Sharma', event:'Grand Ballroom, 2025', avatar:'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=100&q=70' },
  { quote:'The catering vendor we booked through here was extraordinary. 800 guests, not a single complaint. Remarkable platform.', name:'Sneha & Rohan Mehta', event:'Heritage Villa, 2024', avatar:'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=100&q=70' },
  { quote:'Three vendors, one platform, zero stress. The entire team was vetted and professional from the very first call.', name:'Kavya & Dev Kapoor', event:'Sky Garden, 2025', avatar:'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=100&q=70' },
];

const mosaicImgs = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=75',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=75',
  'https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=700&q=75',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=75',
];

/* ─────────────────────────────────────────────────────────────
   FALLBACK IMAGES for vendor cards when cover_image_url is missing
───────────────────────────────────────────────────────────── */
const fallbackImgs = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
];

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT  —  all original logic 100% untouched
───────────────────────────────────────────────────────────── */
export default function Vendors() {
  /* ── original state ── */
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ── original auth check ── */
  const user = JSON.parse(localStorage.getItem('user'));

  /* ── original fetch ── */
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetchVendors = async () => {
      try {
        const response = await axios.get('https://weddings-backend.onrender.com/api/vendors');
        setVendors(response.data.vendors);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        setLoading(false);
      }
    };
    fetchVendors();
  }, [user]);

  /* ══════════════════════════════════════════
     RESTRICTED SCREEN  (original check preserved)
  ══════════════════════════════════════════ */
  if (!user) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="vn-restricted">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="vn-restricted-bg"
          />
          {[220, 400, 580, 760].map((size, i) => (
            <div key={i} className="vn-restricted-ring" style={{
              width:size, height:size, marginLeft:-size/2, marginTop:-size/2,
              animation:`vnPulseRing ${3+i*.7}s ${i*.8}s ease-out infinite`,
            }} />
          ))}
          <div className="vn-restricted-content">
            <div className="vn-restricted-badge">Exclusive Access</div>
            <h2 className="vn-restricted-h2">
              Members Only<br /><em>Directory</em>
            </h2>
            <p className="vn-restricted-p">
              Our curated list of premium wedding professionals is exclusively available to registered couples. Please log in or create an account to start planning your dream wedding.
            </p>
            <div className="vn-restricted-btns">
              <Link to="/login"  className="vn-btn-dk">Log In to Access</Link>
              <Link to="/signup" className="vn-btn-outdk">Create an Account</Link>
            </div>
          </div>
          {/* blurred preview strip */}
          <div className="vn-restricted-preview">
            {fallbackImgs.slice(0,3).map((src, i) => (
              <div className="vn-preview-item" key={i}>
                <img src={src} alt="" className="vn-preview-img" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  /* ══════════════════════════════════════════
     LOADING  (original check preserved)
  ══════════════════════════════════════════ */
  if (loading) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="vn-loading">
          <div className="vn-loading-spinner" />
          <span className="vn-loading-text">Loading Curated Vendors</span>
        </div>
      </>
    );
  }

  /* ══════════════════════════════════════════
     MAIN VENDORS PAGE
  ══════════════════════════════════════════ */
  return (
    <>
      <style>{STYLES}</style>

      {/* ── HERO ── */}
      <section className="vn-hero">
        <div className="vn-hero-bg" style={{ backgroundImage:"url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85')" }} />
        <div className="vn-hero-overlay" />
        <div className="vn-hero-grain" />
        <div className="vn-hero-content">
          <div className="vn-hero-badge">Handpicked for Excellence</div>
          <h1 className="vn-hero-h1">
            Our Curated
            <span className="gold-italic">Partners</span>
          </h1>
          <p className="vn-hero-sub">
            Browse our handpicked selection of premium wedding professionals — guaranteed to make your special day extraordinary, seamless, and entirely unforgettable.
          </p>
        </div>
        <div className="vn-scroll-cue">
          <div className="vn-scroll-track" />
          <span className="vn-scroll-lbl">Scroll</span>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="vn-ticker">
        <div className="vn-ticker-inner">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="vn-ticker-item">{item}<span className="vn-ticker-dot" /></span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="vn-stats">
        <StatItem number={500}  suffix="+"    label="Weddings Served" />
        <StatItem number={80}   suffix="+"    label="Verified Vendors" />
        <StatItem number={98}   suffix="%"    label="Satisfaction Rate" />
        <StatItem number={8}    suffix=" yrs" label="of Curation" />
      </div>

      {/* ══ MAIN VENDORS GRID  —  original .map() logic unchanged ══ */}
      <section className="vn-grid-sec">
        <Reveal>
          <SectionHeader eyebrow="Premium Directory" title="Our <em>Curated Partners</em>" />
        </Reveal>

        <div className="vn-grid">
          {vendors.map((vendor, index) => (
            <Reveal key={vendor.id} delay={(index % 3) * 0.08} dir="plain">
              <TiltCard className="vn-card">
                {/* Image */}
                <div className="vn-card-img-wrap">
                  <img
                    src={vendor.cover_image_url || fallbackImgs[index % fallbackImgs.length]}
                    alt={vendor.business_name}
                    className="vn-card-img"
                    loading="lazy"
                    onError={e => { e.currentTarget.src = fallbackImgs[index % fallbackImgs.length]; }}
                  />
                  <div className="vn-card-img-overlay" />
                  {/* original category + price_range — preserved */}
                  <span className="vn-card-cat">{vendor.category}</span>
                  <span className="vn-card-price">{vendor.price_range}</span>
                </div>

                {/* Body */}
                <div className="vn-card-body">
                  {/* original business_name — preserved */}
                  <h3 className="vn-card-name">{vendor.business_name}</h3>
                  {/* original description — preserved */}
                  <p className="vn-card-desc">{vendor.description}</p>
                </div>

                {/* Footer */}
                <div className="vn-card-footer">
                  {/* original location — preserved, SVG replaces emoji */}
                  <span className="vn-card-loc">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {vendor.location}
                  </span>
                  {/* original Link — preserved exactly */}
                  <Link
                    to={`/vendors/${vendor.id}`}
                    className="vn-card-link"
                  >
                    View Details
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURED VENUES ── */}
      <section className="vn-featured-sec">
        <Reveal>
          <SectionHeader eyebrow="Signature Spaces" title="<span style='color:#fff'>Featured</span> <em>Venues</em>" light />
        </Reveal>
        <div className="vn-featured-grid">
          {featuredVenues.map(({ tag, name, cap, img }, i) => (
            <Reveal key={i} delay={i * 0.09} dir="plain">
              <div className="vn-feat-card">
                <img src={img} alt={name} className="vn-feat-img" loading="lazy" />
                <div className="vn-feat-grad" />
                <div className="vn-feat-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
                <div className="vn-feat-info">
                  <span className="vn-feat-tag">{tag}</span>
                  <h3 className="vn-feat-name">{name}</h3>
                  <p className="vn-feat-cap">{cap}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="vn-how-sec">
        <Reveal>
          <SectionHeader eyebrow="The Process" title="How <em>It Works</em>" />
        </Reveal>
        <div className="vn-how-grid">
          {howSteps.map(({ num, title, text }, i) => (
            <Reveal key={i} delay={i * 0.08} dir="plain">
              <TiltCard className="vn-how-card">
                <span className="vn-how-num">{num}</span>
                <h3 className="vn-how-title">{title}</h3>
                <p className="vn-how-text">{text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY ── */}
      <section className="vn-cats-sec">
        <Reveal>
          <SectionHeader eyebrow="Browse by Type" title="Explore <em>Categories</em>" />
        </Reveal>
        <div className="vn-cats-grid">
          {categories.map(({ name, img }, i) => (
            <Reveal key={i} delay={i * 0.06} dir="plain">
              <div className="vn-cat-item">
                <img src={img} alt={name} className="vn-cat-img" loading="lazy" />
                <div className="vn-cat-grad" />
                <div className="vn-cat-info">
                  <span className="vn-cat-name">{name}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── GALLERY MOSAIC ── */}
      <div className="vn-mosaic">
        {mosaicImgs.map((src, i) => (
          <div className="vn-mosaic-item" key={i}>
            <img src={src} alt="" className="vn-mosaic-img" loading="lazy" />
          </div>
        ))}
      </div>

      {/* ── TESTIMONIALS ── */}
      <section className="vn-testi-sec">
        <Reveal>
          <SectionHeader eyebrow="Client Stories" title="<span style='color:#fff'>What Couples</span> <em>Say</em>" light />
        </Reveal>
        <div className="vn-testi-grid">
          {testimonials.map(({ quote, name, event, avatar }, i) => (
            <Reveal key={i} delay={i * 0.09}>
              <div className="vn-testi-card">
                <div className="vn-testi-mark">"</div>
                <div className="vn-testi-stars">{Array.from({length:5}).map((_,j)=><div className="vn-testi-star" key={j}/>)}</div>
                <p className="vn-testi-quote">{quote}</p>
                <div className="vn-testi-couple">
                  <img src={avatar} alt={name} className="vn-testi-avatar" loading="lazy" />
                  <div>
                    <span className="vn-testi-name">{name}</span>
                    <span className="vn-testi-event">{event}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="vn-cta-sec">
        {[200, 380, 560, 740].map((size, i) => (
          <div key={i} className="vn-cta-ring" style={{
            width:size, height:size, marginLeft:-size/2, marginTop:-size/2,
            animation:`vnPulseRing ${3+i*.7}s ${i*.8}s ease-out infinite`,
          }} />
        ))}
        <Reveal>
          <span className="vn-eyebrow" style={{ color:'var(--gold)' }}>Limited Dates Available</span>
          <Ornament />
          <h2 className="vn-cta-h2">
            Ready to Build<br /><em>Your Dream Day?</em>
          </h2>
          <p className="vn-cta-sub">
            Speak with a dedicated planner and let us connect you with the perfect vendors for every element of your celebration.
          </p>
          <div className="vn-cta-btns">
            <Link to="/contact" className="vn-btn-primary"><span>Get In Touch</span></Link>
            <Link to="/book"    className="vn-btn-outline">Book Your Date</Link>
          </div>
          <div className="vn-est">
            <Ornament />
            <p>Est. 2017 &nbsp;&bull;&nbsp; Mumbai, India &nbsp;&bull;&nbsp; Wedding Chapter Collective</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}