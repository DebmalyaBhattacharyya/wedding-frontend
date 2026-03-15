import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState, useCallback } from 'react';

/* ─── STYLES ─── */
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
  }

  /* ── Keyframes ── */
  @keyframes svFadeUp   { from{opacity:0;transform:translateY(56px)} to{opacity:1;transform:translateY(0)} }
  @keyframes svSlideL   { from{opacity:0;transform:translateX(-70px)} to{opacity:1;transform:translateX(0)} }
  @keyframes svSlideR   { from{opacity:0;transform:translateX(70px)} to{opacity:1;transform:translateX(0)} }
  @keyframes svFadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes svShimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes svLineGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes svPulseRing {
    0%   { transform:translate(-50%,-50%) scale(1); opacity:.5 }
    100% { transform:translate(-50%,-50%) scale(2.6); opacity:0 }
  }
  @keyframes svBorderGlow {
    0%,100% { box-shadow:0 0 0 0 rgba(201,169,110,0) }
    50%      { box-shadow:0 0 0 10px rgba(201,169,110,0.1) }
  }
  @keyframes svCounterIn {
    from { opacity:0; transform:translateY(20px) }
    to   { opacity:1; transform:translateY(0) }
  }
  @keyframes svHeroKen {
    0%   { transform:scale(1.04) }
    100% { transform:scale(1.1) translateX(-1%) }
  }
  @keyframes svScrollDot {
    0%,100% { transform:translateY(0);    opacity:1 }
    60%     { transform:translateY(14px); opacity:0 }
    61%     { transform:translateY(-4px); opacity:0 }
  }
  @keyframes svRotateGem {
    0%,100% { transform:rotate(45deg) scale(1) }
    50%     { transform:rotate(45deg) scale(1.35) }
  }
  @keyframes svDriftUp {
    0%,100% { transform:translateY(0px) }
    50%     { transform:translateY(-12px) }
  }
  @keyframes svImgReveal {
    from { clip-path:inset(0 100% 0 0) }
    to   { clip-path:inset(0 0% 0 0) }
  }
  @keyframes svNumberCount {
    from { opacity:0; transform:scale(.7) }
    to   { opacity:1; transform:scale(1) }
  }
  @keyframes svTickerScroll {
    from { transform:translateX(0) }
    to   { transform:translateX(-50%) }
  }

  /* ── Utilities ── */
  .sv-eyebrow {
    display:block; font-family:'Cinzel',serif; font-size:9.5px;
    letter-spacing:.44em; text-transform:uppercase; color:var(--gold); margin-bottom:16px;
  }
  .sv-ornament {
    display:flex; align-items:center; gap:12px;
    justify-content:center; margin:0 auto 22px;
  }
  .sv-ornament-line {
    flex:1; max-width:68px; height:1px;
    background:linear-gradient(90deg,transparent,var(--gold));
    transform-origin:left; animation:svLineGrow .8s ease both;
  }
  .sv-ornament-line.r { background:linear-gradient(90deg,var(--gold),transparent); transform-origin:right; }
  .sv-ornament-gem {
    width:7px; height:7px; background:var(--gold);
    transform:rotate(45deg); animation:svRotateGem 4s ease-in-out infinite;
  }

  /* ── HERO BANNER ── */
  .sv-hero {
    position:relative; height:72vh; min-height:520px;
    display:flex; align-items:center; justify-content:center;
    text-align:center; overflow:hidden;
  }
  .sv-hero-bg {
    position:absolute; inset:0; background-size:cover; background-position:center 40%;
    animation:svHeroKen 16s ease-in-out infinite alternate;
  }
  .sv-hero-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to bottom,rgba(28,16,8,.55) 0%,rgba(28,16,8,.28) 45%,rgba(28,16,8,.72) 100%);
  }
  .sv-hero-grain {
    position:absolute; inset:0; opacity:.05;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:200px;
  }
  .sv-hero-content { position:relative; z-index:2; padding:0 24px; }
  .sv-hero-badge {
    display:inline-block; font-family:'Cinzel',serif; font-size:9px;
    letter-spacing:.45em; text-transform:uppercase; color:var(--gold);
    border:1px solid rgba(201,169,110,.4); padding:8px 26px; margin-bottom:28px;
    animation:svFadeUp .7s ease both; position:relative;
  }
  .sv-hero-badge::before,.sv-hero-badge::after {
    content:''; position:absolute; width:6px; height:6px;
    border:1px solid var(--gold); transform:rotate(45deg); background:rgba(28,16,8,.6);
  }
  .sv-hero-badge::before { top:-4px; left:-4px; }
  .sv-hero-badge::after  { bottom:-4px; right:-4px; }
  .sv-hero-h1 {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(3.2rem,8vw,7rem); font-weight:300; color:#fff;
    line-height:1.04; margin-bottom:22px;
    animation:svFadeUp .85s .12s ease both;
  }
  .sv-hero-h1 .gold {
    font-style:italic; display:block;
    background:linear-gradient(90deg,var(--gold),#f0d090,var(--gold),#c8924a,var(--gold));
    background-size:300% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    animation:svShimmer 5s linear 1s infinite;
  }
  .sv-hero-sub {
    max-width:540px; margin:0 auto;
    color:rgba(255,255,255,.68); font-size:clamp(.9rem,1.5vw,1.1rem);
    font-weight:300; line-height:1.9; letter-spacing:.03em;
    animation:svFadeUp .85s .26s ease both;
  }
  .sv-scroll-cue {
    position:absolute; bottom:32px; left:50%; transform:translateX(-50%);
    z-index:2; display:flex; flex-direction:column; align-items:center; gap:8px;
    animation:svFadeIn 1s 1.2s both;
  }
  .sv-scroll-track {
    width:1px; height:60px;
    background:linear-gradient(to bottom,rgba(201,169,110,.6),transparent);
    position:relative; overflow:hidden;
  }
  .sv-scroll-track::after {
    content:''; position:absolute; top:0; left:0; width:100%; height:35%;
    background:var(--gold); animation:svScrollDot 2s ease-in-out infinite;
  }
  .sv-scroll-lbl {
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.4em;
    color:rgba(201,169,110,.65); text-transform:uppercase;
    writing-mode:vertical-lr; transform:rotate(180deg);
  }

  /* ── TICKER ── */
  .sv-ticker {
    background:var(--brand-dark); overflow:hidden;
    padding:14px 0; border-top:1px solid rgba(201,169,110,.15);
  }
  .sv-ticker-inner {
    display:flex; gap:0; white-space:nowrap;
    animation:svTickerScroll 28s linear infinite;
    width:max-content;
  }
  .sv-ticker-item {
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em;
    color:rgba(201,169,110,.55); text-transform:uppercase;
    padding:0 48px;
  }
  .sv-ticker-dot {
    display:inline-block; width:4px; height:4px;
    background:var(--gold); transform:rotate(45deg); margin:0 24px; vertical-align:middle; opacity:.5;
  }

  /* ── STATS ── */
  .sv-stats {
    display:grid; grid-template-columns:repeat(4,1fr);
    background:var(--brand-dark); position:relative; overflow:hidden;
  }
  .sv-stats::before {
    content:''; position:absolute; inset:0;
    background:repeating-linear-gradient(90deg,rgba(201,169,110,.04) 0,rgba(201,169,110,.04) 1px,transparent 1px,transparent 100px);
  }
  .sv-stat {
    text-align:center; padding:52px 20px;
    border-right:1px solid rgba(201,169,110,.1); position:relative;
  }
  .sv-stat:last-child { border-right:none; }
  .sv-stat-num {
    font-family:'Cormorant Garamond',serif; font-size:clamp(2.6rem,4.5vw,4rem);
    color:var(--gold); font-weight:300; display:block; line-height:1;
  }
  .sv-stat-lbl {
    font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.3em;
    color:rgba(253,248,243,.38); margin-top:10px; text-transform:uppercase; display:block;
  }
  @media(max-width:640px) {
    .sv-stats { grid-template-columns:1fr 1fr; }
    .sv-stat:nth-child(2) { border-right:none; }
    .sv-stat:nth-child(3) { border-right:1px solid rgba(201,169,110,.1); border-top:1px solid rgba(201,169,110,.1); }
    .sv-stat:nth-child(4) { border-top:1px solid rgba(201,169,110,.1); }
  }

  /* ── SECTION HEADER ── */
  .sv-section-hdr { text-align:center; margin-bottom:72px; }
  .sv-section-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2.4rem,4.5vw,3.8rem); font-weight:300;
    color:var(--brand-dark); line-height:1.12;
  }
  .sv-section-title em { font-style:italic; color:var(--brand); }

  /* ── MAIN SERVICES (alternating) ── */
  .sv-services-wrap { max-width:1280px; margin:0 auto; padding:clamp(80px,9vw,140px) clamp(24px,5vw,64px); }
  .sv-svc-row {
    display:grid; grid-template-columns:1fr 1fr;
    gap:clamp(40px,6vw,96px); align-items:center;
    margin-bottom:clamp(80px,10vw,140px);
  }
  .sv-svc-row:last-child { margin-bottom:0; }
  .sv-svc-row.rev { direction:rtl; }
  .sv-svc-row.rev > * { direction:ltr; }
  @media(max-width:768px) {
    .sv-svc-row { grid-template-columns:1fr; }
    .sv-svc-row.rev { direction:ltr; }
  }

  /* Image side */
  .sv-svc-img-wrap {
    position:relative;
    transition:transform .5s cubic-bezier(.23,1,.32,1);
  }
  .sv-svc-img-frame {
    position:absolute; inset:-14px;
    border:1px solid rgba(201,169,110,.22); pointer-events:none;
    animation:svBorderGlow 4s ease-in-out infinite;
  }
  .sv-svc-img {
    width:100%; aspect-ratio:4/3; object-fit:cover; display:block;
    filter:contrast(1.05) saturate(.9);
    transition:transform .8s cubic-bezier(.23,1,.32,1), filter .5s ease;
  }
  .sv-svc-img-wrap:hover .sv-svc-img { transform:scale(1.04); filter:contrast(1.08) saturate(1); }
  .sv-svc-number {
    position:absolute; bottom:-20px; left:-20px;
    font-family:'Cormorant Garamond',serif; font-size:5rem; font-weight:300;
    color:var(--brand-dark); line-height:1;
    background:var(--brand-light); padding:8px 16px;
    border-left:3px solid var(--gold);
    animation:svCounterIn .6s ease both;
  }

  /* Text side */
  .sv-svc-text { padding:8px 0; }
  .sv-svc-num-label {
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:.45em;
    color:var(--gold); text-transform:uppercase; display:inline-block;
    border-bottom:1px solid var(--gold-dim); padding-bottom:4px; margin-bottom:20px;
  }
  .sv-svc-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2rem,3.5vw,2.8rem); font-weight:300;
    color:var(--brand-dark); line-height:1.12; margin-bottom:18px;
  }
  .sv-svc-title em { font-style:italic; color:var(--brand); }
  .sv-svc-desc {
    font-family:'Jost',sans-serif; font-size:1rem; color:var(--muted);
    line-height:1.9; font-weight:300; margin-bottom:20px;
  }
  .sv-svc-features { margin-bottom:28px; }
  .sv-svc-feature {
    display:flex; align-items:flex-start; gap:12px;
    font-size:.875rem; color:#6b5844; margin-bottom:12px;
    font-family:'Jost',sans-serif; font-weight:300; line-height:1.6;
  }
  .sv-feat-dot {
    width:5px; height:5px; background:var(--gold);
    transform:rotate(45deg); flex-shrink:0; margin-top:5px;
  }
  .sv-svc-link {
    display:inline-flex; align-items:center; gap:10px;
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:.38em;
    text-transform:uppercase; color:var(--brand-dark); text-decoration:none;
    border-bottom:1px solid var(--gold-dim); padding-bottom:6px;
    transition:all .3s ease; position:relative;
  }
  .sv-svc-link::after {
    content:''; position:absolute; bottom:-1px; left:0;
    width:0; height:1px; background:var(--gold); transition:width .4s ease;
  }
  .sv-svc-link:hover { color:var(--brand); }
  .sv-svc-link:hover::after { width:100%; }
  .sv-svc-link svg { transition:transform .3s ease; }
  .sv-svc-link:hover svg { transform:translateX(5px); }

  /* ── PROCESS STRIP ── */
  .sv-process {
    background:var(--brand-dark); position:relative; overflow:hidden;
    padding:clamp(80px,9vw,130px) clamp(24px,5vw,64px);
  }
  .sv-process::before {
    content:'PROCESS'; position:absolute; bottom:-30px; right:-10px;
    font-family:'Cormorant Garamond',serif; font-size:200px; font-weight:700;
    color:rgba(201,169,110,.03); white-space:nowrap; pointer-events:none;
  }
  .sv-process-grid {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
    gap:3px; max-width:1100px; margin:0 auto; position:relative; z-index:1;
  }
  .sv-process-card {
    padding:48px 36px; background:rgba(255,255,255,.03);
    border:1px solid rgba(201,169,110,.08);
    position:relative; overflow:hidden;
    transition:all .4s ease;
  }
  .sv-process-card:hover { background:rgba(255,255,255,.07); transform:translateY(-5px); border-color:rgba(201,169,110,.2); }
  .sv-process-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);
    transform:scaleX(0); transform-origin:left; transition:transform .5s ease;
  }
  .sv-process-card:hover::before { transform:scaleX(1); }
  .sv-process-n {
    font-family:'Cormorant Garamond',serif; font-size:4rem; color:rgba(201,169,110,.12);
    font-weight:300; line-height:1; margin-bottom:20px; display:block;
  }
  .sv-process-title {
    font-family:'Cormorant Garamond',serif; font-size:1.4rem; color:var(--gold);
    font-weight:300; margin-bottom:12px;
  }
  .sv-process-text { font-size:.84rem; color:rgba(253,248,243,.5); font-weight:300; line-height:1.8; }
  .sv-process-line {
    position:absolute; right:0; top:50%; transform:translateY(-50%);
    width:1px; height:60%; background:linear-gradient(to bottom,transparent,rgba(201,169,110,.12),transparent);
  }
  .sv-process-card:last-child .sv-process-line { display:none; }

  /* ── GALLERY MOSAIC ── */
  .sv-mosaic { display:grid; grid-template-columns:repeat(4,1fr); grid-template-rows:repeat(2,260px); gap:3px; }
  .sv-mosaic-item { overflow:hidden; position:relative; cursor:pointer; }
  .sv-mosaic-item:nth-child(1) { grid-column:span 2; grid-row:span 2; }
  .sv-mosaic-item:nth-child(4) { grid-column:span 2; }
  .sv-mosaic-img {
    width:100%; height:100%; object-fit:cover;
    transition:transform .8s cubic-bezier(.23,1,.32,1), filter .5s ease;
    filter:saturate(.75) contrast(1.05);
  }
  .sv-mosaic-item:hover .sv-mosaic-img { transform:scale(1.07); filter:saturate(1) contrast(1.02); }
  .sv-mosaic-item::after {
    content:''; position:absolute; inset:0;
    background:rgba(201,169,110,0); transition:background .4s ease;
  }
  .sv-mosaic-item:hover::after { background:rgba(201,169,110,.06); }
  @media(max-width:640px) {
    .sv-mosaic { grid-template-columns:1fr 1fr; grid-template-rows:repeat(4,180px); }
    .sv-mosaic-item:nth-child(1) { grid-column:span 2; grid-row:span 1; }
    .sv-mosaic-item:nth-child(4) { grid-column:span 2; }
  }

  /* ── PACKAGES ── */
  .sv-packages-sec { padding:clamp(80px,9vw,140px) clamp(24px,5vw,64px); background:var(--smoke); }
  .sv-packages-grid {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
    gap:20px; max-width:1100px; margin:0 auto; align-items:start;
  }
  .sv-pkg {
    background:#fff; border:1px solid rgba(139,111,71,.13);
    padding:48px 36px; position:relative; transition:all .5s cubic-bezier(.23,1,.32,1);
  }
  .sv-pkg:hover:not(.sv-pkg-feat) { transform:translateY(-7px); box-shadow:0 28px 64px rgba(74,55,40,.12); }
  .sv-pkg-feat {
    background:var(--brand-dark); border-color:var(--gold);
    transform:translateY(-10px); box-shadow:0 32px 80px rgba(74,55,40,.28);
    animation:svBorderGlow 3s ease-in-out infinite;
  }
  .sv-pkg-badge {
    position:absolute; top:0; left:50%; transform:translate(-50%,-50%);
    background:var(--gold); color:var(--brand-dark); font-family:'Cinzel',serif;
    font-size:7.5px; letter-spacing:.35em; padding:7px 20px; text-transform:uppercase; font-weight:700; white-space:nowrap;
  }
  .sv-pkg-tier { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.4em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:10px; }
  .sv-pkg-name { font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:300; color:var(--brand-dark); margin-bottom:6px; }
  .sv-pkg-feat .sv-pkg-name { color:#fff; }
  .sv-pkg-price { font-family:'Cormorant Garamond',serif; font-size:3rem; color:var(--brand); font-weight:300; line-height:1; margin-bottom:4px; }
  .sv-pkg-feat .sv-pkg-price { color:var(--gold); }
  .sv-pkg-per { font-size:.74rem; color:#9a8070; letter-spacing:.08em; margin-bottom:28px; display:block; }
  .sv-pkg-feat .sv-pkg-per { color:rgba(253,248,243,.38); }
  .sv-pkg-div { height:1px; background:linear-gradient(90deg,transparent,rgba(139,111,71,.2),transparent); margin-bottom:24px; }
  .sv-pkg-feat .sv-pkg-div { background:linear-gradient(90deg,transparent,rgba(201,169,110,.2),transparent); }
  .sv-pkg-item { display:flex; align-items:flex-start; gap:10px; font-size:.85rem; color:#6b5844; margin-bottom:12px; font-weight:300; line-height:1.5; }
  .sv-pkg-feat .sv-pkg-item { color:rgba(253,248,243,.68); }
  .sv-pkg-dot { width:5px; height:5px; background:var(--gold); transform:rotate(45deg); flex-shrink:0; margin-top:4px; }
  .sv-pkg-cta {
    display:block; text-align:center; margin-top:32px; padding:14px 24px;
    font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.34em;
    text-transform:uppercase; text-decoration:none; transition:all .35s ease;
    border:1px solid var(--brand); color:var(--brand);
  }
  .sv-pkg-cta:hover { background:var(--brand); color:var(--brand-light); }
  .sv-pkg-feat .sv-pkg-cta { border-color:var(--gold); color:var(--gold); }
  .sv-pkg-feat .sv-pkg-cta:hover { background:var(--gold); color:var(--brand-dark); }
  @media(max-width:768px) { .sv-pkg-feat { transform:translateY(0); } }

  /* ── TESTIMONIALS ── */
  .sv-testi-sec {
    background:var(--brand-dark); padding:clamp(80px,9vw,140px) clamp(24px,5vw,64px);
    position:relative; overflow:hidden;
  }
  .sv-testi-sec::before {
    content:'"'; position:absolute; top:-60px; left:-5px;
    font-family:'Cormorant Garamond',serif; font-size:480px;
    color:rgba(201,169,110,.03); line-height:1; pointer-events:none; font-weight:700;
  }
  .sv-testi-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:20px; max-width:1100px; margin:0 auto; position:relative; z-index:1; }
  .sv-testi-card { border:1px solid rgba(201,169,110,.1); padding:40px 32px; background:rgba(255,255,255,.03); position:relative; transition:all .4s ease; }
  .sv-testi-card:hover { background:rgba(255,255,255,.06); transform:translateY(-5px); border-color:rgba(201,169,110,.2); }
  .sv-testi-mark { position:absolute; top:18px; right:22px; font-family:'Cormorant Garamond',serif; font-size:4rem; color:rgba(201,169,110,.1); line-height:1; font-style:italic; }
  .sv-testi-stars { display:flex; gap:4px; margin-bottom:20px; }
  .sv-testi-star { width:9px; height:9px; background:var(--gold); clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%); }
  .sv-testi-quote { font-family:'Cormorant Garamond',serif; font-size:1.1rem; color:rgba(253,248,243,.82); font-style:italic; line-height:1.85; margin-bottom:24px; font-weight:300; }
  .sv-testi-couple { display:flex; align-items:center; gap:12px; }
  .sv-testi-avatar { width:44px; height:44px; border-radius:50%; object-fit:cover; filter:saturate(.7); border:1.5px solid rgba(201,169,110,.28); flex-shrink:0; }
  .sv-testi-name { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.3em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:3px; }
  .sv-testi-event { font-size:.75rem; color:rgba(253,248,243,.3); font-weight:300; }

  /* ── CTA SECTION ── */
  .sv-cta-sec {
    background:var(--brand-dark); position:relative; overflow:hidden;
    padding:clamp(80px,10vw,160px) clamp(24px,5vw,64px);
    text-align:center; border-top:1px solid rgba(201,169,110,.15);
    border-bottom:1px solid rgba(201,169,110,.15);
  }
  .sv-cta-ring {
    position:absolute; border-radius:50%;
    border:1px solid rgba(201,169,110,.08);
    top:50%; left:50%; pointer-events:none;
  }
  .sv-cta-h2 {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2.6rem,6vw,5rem); font-weight:300; color:#fff;
    line-height:1.1; margin-bottom:20px; position:relative; z-index:1;
  }
  .sv-cta-h2 em { font-style:italic; color:var(--gold); }
  .sv-cta-sub {
    max-width:520px; margin:0 auto 48px; color:rgba(255,255,255,.55);
    font-size:1rem; font-weight:300; line-height:1.9;
    position:relative; z-index:1;
  }
  .sv-cta-btns { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; position:relative; z-index:1; }
  .sv-btn-primary {
    background:var(--brand); color:var(--brand-light);
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none;
    transition:all .4s ease; box-shadow:0 6px 28px rgba(139,111,71,.4);
    position:relative; overflow:hidden;
  }
  .sv-btn-primary::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg,var(--gold) 0%,var(--brand-dark) 100%);
    opacity:0; transition:opacity .4s ease;
  }
  .sv-btn-primary:hover { transform:translateY(-3px); box-shadow:0 14px 44px rgba(139,111,71,.5); }
  .sv-btn-primary:hover::after { opacity:1; }
  .sv-btn-primary span { position:relative; z-index:1; }
  .sv-btn-outline {
    border:1.5px solid rgba(255,255,255,.4); color:#fff;
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none; transition:all .4s ease;
  }
  .sv-btn-outline:hover { border-color:var(--gold); color:var(--gold); transform:translateY(-3px); }
`;

/* ─── HOOKS ─── */
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

/* ─── COMPONENTS ─── */
function Reveal({ children, delay = 0, dir = 'up', className = '' }) {
  const [ref, inView] = useInView();
  const anims = { up: 'svFadeUp', left: 'svSlideL', right: 'svSlideR', plain: 'svFadeIn' };
  return (
    <div ref={ref} className={className} style={{
      animation: inView ? `${anims[dir]} .85s ${delay}s cubic-bezier(.23,1,.32,1) both` : 'none',
      opacity: inView ? undefined : 0,
    }}>{children}</div>
  );
}

function Ornament({ align = 'center' }) {
  return (
    <div className="sv-ornament" style={{ justifyContent: align }}>
      <div className="sv-ornament-line" />
      <div className="sv-ornament-gem" />
      <div className="sv-ornament-line r" />
    </div>
  );
}

function SectionHeader({ eyebrow, title, light = false }) {
  return (
    <div className="sv-section-hdr">
      <span className="sv-eyebrow">{eyebrow}</span>
      <Ornament />
      <h2 className="sv-section-title" style={light ? { color: '#fff' } : {}} dangerouslySetInnerHTML={{ __html: title }} />
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
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(4px)`;
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
    <div ref={ref} className="sv-stat">
      <span className="sv-stat-num">{val}{suffix}</span>
      <span className="sv-stat-lbl">{label}</span>
    </div>
  );
}

/* ─── DATA ─── */
const offerings = [
  {
    title: 'Wedding Photography',
    titleEm: 'Photography',
    description: 'Timeless photographs that capture every precious moment, stolen glance, and joyous tear of your special day. Our photographers blend into the ceremony, preserving authenticity without intruding on the magic.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
    features: ['Full-day coverage from preparation to reception', 'Second photographer included', 'Minimum 600 edited high-resolution images', 'Online gallery delivery within 4 weeks'],
  },
  {
    title: 'Cinematic Films',
    titleEm: 'Films',
    description: "We don't just record video — we craft cinematic wedding films that tell your unique love story with sweeping compositions, colour-graded visuals, and carefully chosen soundscapes that will move you to tears.",
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop',
    features: ['4K cinematic highlight film (5–8 minutes)', 'Extended ceremony & reception cut', 'Drone aerial footage included', 'Delivered via private streaming link'],
  },
  {
    title: 'Pre-Wedding Shoots',
    titleEm: 'Shoots',
    description: 'Romantic, editorial-style pre-wedding sessions at handpicked locations — golden-hour fields, architectural landmarks, or intimate interiors — giving you images worthy of the finest magazines.',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop',
    features: ['3-hour location shoot with styling guidance', 'Up to 2 outfit changes & 2 locations', '100+ edited images delivered', 'Complimentary mood-board consultation'],
  },
  {
    title: 'Bespoke Album Design',
    titleEm: 'Design',
    description: 'Beautifully crafted, museum-quality wedding albums — lay-flat binding, archival pigment printing, and hand-selected covers — preserving your memories in heirloom form for generations to come.',
    image: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200&auto=format&fit=crop',
    features: ['Lay-flat flush-mount album construction', 'Genuine leather or linen cover options', 'Bespoke layout design with 3 revision rounds', 'Parent album duplicates available'],
  },
];

const processSteps = [
  { n: '01', title: 'Initial Consultation', text: 'A relaxed call or in-person meeting to understand your vision, venue, and aesthetic. No obligation.' },
  { n: '02', title: 'Custom Proposal',      text: 'A tailored package built specifically around your wedding — timeline, locations, and deliverables.' },
  { n: '03', title: 'Engagement Session',   text: 'A pre-wedding shoot to build chemistry and ensure you are completely comfortable in front of the lens.' },
  { n: '04', title: 'Wedding Day',          text: 'Our team arrives early, anticipates every moment, and documents your day with complete discretion.' },
  { n: '05', title: 'Post-Production',      text: 'Meticulous colour grading, retouching, and soundtrack selection to craft your final gallery and film.' },
  { n: '06', title: 'Delivery & Albums',    text: 'Your gallery goes live. Albums are designed, approved, and delivered to your door in 8 weeks.' },
];

const packages = [
  {
    tier: 'Essential', name: 'Silver Chapter', price: '₹45K', per: 'starting price', feat: false,
    items: ['6-hour photography coverage', '300+ edited images', 'Online gallery access', 'Standard digital delivery', '1 photographer'],
  },
  {
    tier: 'Signature', name: 'Golden Chapter', price: '₹95K', per: 'all-inclusive', feat: true, badge: 'Most Popular',
    items: ['Full-day photography & video', '600+ images + 8-min film', 'Second photographer & videographer', 'Pre-wedding session included', 'Lay-flat album (40 pages)', 'Drone footage & aerial shots'],
  },
  {
    tier: 'Prestige', name: 'Royal Chapter', price: '₹1.8L', per: 'bespoke pricing', feat: false,
    items: ['2-day coverage (functions + wedding)', 'Unlimited edited images', 'Feature-length cinematic film', 'Destination shoot anywhere in India', 'Two premium heirloom albums', 'Dedicated creative director'],
  },
];

const testimonials = [
  { quote: 'The photographs made us cry all over again. Every emotion we felt on the day is right there on the page — frozen perfectly in time.', name: 'Priya & Arjun Sharma', event: 'Grand Ballroom, February 2025', avatar: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=100&q=70' },
  { quote: 'The cinematic film is the most precious thing we own. Friends who attended have watched it more times than we have.', name: 'Sneha & Rohan Mehta', event: 'Garden Ceremony, November 2024', avatar: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=100&q=70' },
  { quote: 'Every single frame looks like it belongs in Vogue. We had no idea a wedding album could feel this extraordinary.', name: 'Kavya & Dev Kapoor', event: 'Heritage Villa, January 2025', avatar: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=100&q=70' },
];

const mosaicImgs = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=75',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=75',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=75',
  'https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=800&q=75',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=75',
];

const tickerItems = ['Wedding Photography', 'Cinematic Films', 'Pre-Wedding Sessions', 'Bespoke Albums', 'Destination Weddings', 'Floral Coverage', 'Heritage Venues', 'Engagement Shoots'];

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────── */
export default function Services() {
  return (
    <>
      <style>{STYLES}</style>

      {/* ══ HERO ══ */}
      <section className="sv-hero">
        <div className="sv-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1800&q=85')" }} />
        <div className="sv-hero-overlay" />
        <div className="sv-hero-grain" />
        <div className="sv-hero-content">
          <div className="sv-hero-badge">Visual Storytelling for Weddings</div>
          <h1 className="sv-hero-h1">
            Our Services
            <span className="gold">Crafted for You</span>
          </h1>
          <p className="sv-hero-sub">
            From intimate ceremonies to grand celebrations — comprehensive visual storytelling tailored to your vision, crafted by specialists who understand that every love story is singular.
          </p>
        </div>
        <div className="sv-scroll-cue">
          <div className="sv-scroll-track" />
          <span className="sv-scroll-lbl">Scroll</span>
        </div>
      </section>

      {/* ══ TICKER ══ */}
      <div className="sv-ticker">
        <div className="sv-ticker-inner">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="sv-ticker-item">
              {item}<span className="sv-ticker-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ══ STATS ══ */}
      <div className="sv-stats">
        <StatItem number={500} suffix="+" label="Weddings Covered" />
        <StatItem number={12}  suffix="+"  label="Industry Awards" />
        <StatItem number={98}  suffix="%" label="5-Star Reviews" />
        <StatItem number={8}   suffix=" yrs" label="of Excellence" />
      </div>

      {/* ══ MAIN SERVICES (alternating) ══ */}
      <div className="sv-services-wrap">
        {offerings.map((svc, index) => (
          <div key={index} className={`sv-svc-row${index % 2 !== 0 ? ' rev' : ''}`}>

            {/* Image */}
            <Reveal dir={index % 2 === 0 ? 'left' : 'right'}>
              <div className="sv-svc-img-wrap">
                <div className="sv-svc-img-frame" />
                <img src={svc.image} alt={svc.title} className="sv-svc-img" loading="lazy" />
                <div className="sv-svc-number">0{index + 1}</div>
              </div>
            </Reveal>

            {/* Text */}
            <Reveal dir={index % 2 === 0 ? 'right' : 'left'} delay={0.1}>
              <div className="sv-svc-text">
                <span className="sv-svc-num-label">0{index + 1}</span>
                <h2 className="sv-svc-title"
                  dangerouslySetInnerHTML={{ __html: svc.title.replace(svc.titleEm, `<em>${svc.titleEm}</em>`) }}
                />
                <p className="sv-svc-desc">{svc.description}</p>
                <div className="sv-svc-features">
                  {svc.features.map((f, j) => (
                    <div className="sv-svc-feature" key={j}>
                      <div className="sv-feat-dot" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <Link to="/vendors" className="sv-svc-link">
                  Find a Specialist
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </Reveal>

          </div>
        ))}
      </div>

      {/* ══ PROCESS ══ */}
      <section className="sv-process">
        <Reveal>
          <SectionHeader eyebrow="How It Works" title="Our <em>Creative Process</em>" light />
        </Reveal>
        <div className="sv-process-grid">
          {processSteps.map(({ n, title, text }, i) => (
            <Reveal key={i} delay={i * 0.07} dir="plain">
              <TiltCard className="sv-process-card">
                <div className="sv-process-line" />
                <span className="sv-process-n">{n}</span>
                <h3 className="sv-process-title">{title}</h3>
                <p className="sv-process-text">{text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ GALLERY MOSAIC ══ */}
      <div className="sv-mosaic">
        {mosaicImgs.map((src, i) => (
          <div className="sv-mosaic-item" key={i}>
            <img src={src} alt="" className="sv-mosaic-img" loading="lazy" />
          </div>
        ))}
      </div>

      {/* ══ PACKAGES ══ */}
      <section className="sv-packages-sec">
        <Reveal>
          <SectionHeader eyebrow="Curated Collections" title="Service <em>Packages</em>" />
        </Reveal>
        <div className="sv-packages-grid">
          {packages.map(({ tier, name, price, per, feat, badge, items }, i) => (
            <Reveal key={i} delay={i * 0.09}>
              <TiltCard className={`sv-pkg${feat ? ' sv-pkg-feat' : ''}`}>
                {badge && <div className="sv-pkg-badge">{badge}</div>}
                <span className="sv-pkg-tier">{tier}</span>
                <h3 className="sv-pkg-name">{name}</h3>
                <div className="sv-pkg-price">{price}</div>
                <span className="sv-pkg-per">{per}</span>
                <div className="sv-pkg-div" />
                {items.map((item, j) => (
                  <div className="sv-pkg-item" key={j}>
                    <div className="sv-pkg-dot" /><span>{item}</span>
                  </div>
                ))}
                <Link to="/book" className="sv-pkg-cta">Reserve Now</Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="sv-testi-sec">
        <Reveal>
          <SectionHeader eyebrow="Client Stories" title="<span style='color:#fff'>What Couples</span> <em>Say</em>" light />
        </Reveal>
        <div className="sv-testi-grid">
          {testimonials.map(({ quote, name, event, avatar }, i) => (
            <Reveal key={i} delay={i * 0.09}>
              <div className="sv-testi-card">
                <div className="sv-testi-mark">"</div>
                <div className="sv-testi-stars">{Array.from({ length: 5 }).map((_, j) => <div className="sv-testi-star" key={j} />)}</div>
                <p className="sv-testi-quote">{quote}</p>
                <div className="sv-testi-couple">
                  <img src={avatar} alt={name} className="sv-testi-avatar" loading="lazy" />
                  <div>
                    <span className="sv-testi-name">{name}</span>
                    <span className="sv-testi-event">{event}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="sv-cta-sec">
        {[200, 380, 560, 740].map((size, i) => (
          <div key={i} className="sv-cta-ring" style={{
            width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2,
            animation: `svPulseRing ${3 + i * .7}s ${i * .8}s ease-out infinite`,
          }} />
        ))}
        <Reveal>
          <span className="sv-eyebrow" style={{ color: 'var(--gold)' }}>Begin Your Journey</span>
          <div className="sv-ornament">
            <div className="sv-ornament-line" />
            <div className="sv-ornament-gem" />
            <div className="sv-ornament-line r" />
          </div>
          <h2 className="sv-cta-h2">
            Ready to Create<br /><em>Something Beautiful?</em>
          </h2>
          <p className="sv-cta-sub">
            Book a consultation and let us discuss how we can make your wedding day unforgettable — every photograph, every frame, every moment.
          </p>
          <div className="sv-cta-btns">
            <Link to="/login" className="sv-btn-primary"><span>Start Your Journey</span></Link>
            <Link to="/vendors" className="sv-btn-outline">Explore All Services</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}