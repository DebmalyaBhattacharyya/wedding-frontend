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
  @keyframes abFadeUp  { from{opacity:0;transform:translateY(56px)} to{opacity:1;transform:translateY(0)} }
  @keyframes abSlideL  { from{opacity:0;transform:translateX(-68px)} to{opacity:1;transform:translateX(0)} }
  @keyframes abSlideR  { from{opacity:0;transform:translateX(68px)} to{opacity:1;transform:translateX(0)} }
  @keyframes abFadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes abShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes abLineGrow{ from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes abKen     { 0%{transform:scale(1.04)} 100%{transform:scale(1.11) translateX(-1.2%)} }
  @keyframes abScrollDot {
    0%,100%{transform:translateY(0);opacity:1}
    60%{transform:translateY(14px);opacity:0}
    61%{transform:translateY(-4px);opacity:0}
  }
  @keyframes abBorderGlow {
    0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,0)}
    50%{box-shadow:0 0 0 12px rgba(201,169,110,0.09)}
  }
  @keyframes abRotateGem {
    0%,100%{transform:rotate(45deg) scale(1)}
    50%{transform:rotate(45deg) scale(1.4)}
  }
  @keyframes abPulseRing {
    0%{transform:translate(-50%,-50%) scale(1);opacity:.5}
    100%{transform:translate(-50%,-50%) scale(2.7);opacity:0}
  }
  @keyframes abTickerScroll {
    from{transform:translateX(0)}
    to{transform:translateX(-50%)}
  }
  @keyframes abCounterIn {
    from{opacity:0;transform:translateY(22px)}
    to{opacity:1;transform:translateY(0)}
  }
  @keyframes abFloatY {
    0%,100%{transform:translateY(0px)}
    50%{transform:translateY(-14px)}
  }
  @keyframes abRevealImg {
    from{clip-path:inset(0 100% 0 0)}
    to{clip-path:inset(0 0% 0 0)}
  }
  @keyframes abTopBarGrow {
    from{transform:scaleX(0);transform-origin:left}
    to{transform:scaleX(1);transform-origin:left}
  }
  @keyframes abNumberScale {
    from{opacity:0;transform:scale(.6)}
    to{opacity:1;transform:scale(1)}
  }
  @keyframes abParallaxDrift {
    0%{background-position:50% 0%}
    100%{background-position:50% 30%}
  }

  /* ── Utility ── */
  .ab-eyebrow {
    display:block; font-family:'Cinzel',serif; font-size:9.5px;
    letter-spacing:.44em; text-transform:uppercase; color:var(--gold); margin-bottom:16px;
  }
  .ab-ornament {
    display:flex; align-items:center; gap:12px; justify-content:center; margin:0 auto 22px;
  }
  .ab-ornament-line {
    flex:1; max-width:68px; height:1px;
    background:linear-gradient(90deg,transparent,var(--gold));
    transform-origin:left; animation:abLineGrow .8s ease both;
  }
  .ab-ornament-line.r { background:linear-gradient(90deg,var(--gold),transparent); transform-origin:right; }
  .ab-ornament-gem   { width:7px; height:7px; background:var(--gold); transform:rotate(45deg); animation:abRotateGem 4s ease-in-out infinite; }

  /* ── HERO ── */
  .ab-hero {
    position:relative; height:82vh; min-height:580px;
    display:flex; align-items:center; justify-content:center;
    text-align:center; overflow:hidden;
  }
  .ab-hero-bg {
    position:absolute; inset:0; background-size:cover; background-position:center 38%;
    animation:abKen 18s ease-in-out infinite alternate;
  }
  .ab-hero-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to bottom,rgba(28,16,8,.54) 0%,rgba(28,16,8,.22) 42%,rgba(28,16,8,.78) 100%);
  }
  .ab-hero-grain {
    position:absolute; inset:0; opacity:.045;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:200px;
  }
  .ab-hero-content { position:relative; z-index:2; padding:0 24px; }
  .ab-hero-badge {
    display:inline-block; font-family:'Cinzel',serif; font-size:9px;
    letter-spacing:.46em; text-transform:uppercase; color:var(--gold);
    border:1px solid rgba(201,169,110,.42); padding:9px 28px; margin-bottom:30px;
    animation:abFadeUp .7s ease both; position:relative;
  }
  .ab-hero-badge::before,.ab-hero-badge::after {
    content:''; position:absolute; width:6px; height:6px;
    border:1px solid var(--gold); transform:rotate(45deg); background:rgba(28,16,8,.6);
  }
  .ab-hero-badge::before{top:-4px;left:-4px}
  .ab-hero-badge::after{bottom:-4px;right:-4px}
  .ab-hero-h1 {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(3.4rem,8.5vw,7.8rem); font-weight:300;
    color:#fff; line-height:1.02; margin-bottom:24px;
    animation:abFadeUp .9s .13s ease both;
  }
  .ab-hero-h1 .gold-italic {
    font-style:italic; display:block;
    background:linear-gradient(90deg,var(--gold),#f0d090,var(--gold),#c8924a,var(--gold));
    background-size:300% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    animation:abShimmer 5s linear 1s infinite;
  }
  .ab-hero-sub {
    max-width:560px; margin:0 auto; color:rgba(255,255,255,.68);
    font-size:clamp(.9rem,1.5vw,1.12rem); font-weight:300; line-height:1.9;
    letter-spacing:.03em; animation:abFadeUp .9s .28s ease both;
  }
  .ab-scroll-cue {
    position:absolute; bottom:34px; left:50%; transform:translateX(-50%);
    z-index:2; display:flex; flex-direction:column; align-items:center; gap:10px;
    animation:abFadeIn 1s 1.3s both;
  }
  .ab-scroll-track {
    width:1px; height:62px;
    background:linear-gradient(to bottom,rgba(201,169,110,.6),transparent);
    position:relative; overflow:hidden;
  }
  .ab-scroll-track::after {
    content:''; position:absolute; top:0; left:0; width:100%; height:35%;
    background:var(--gold); animation:abScrollDot 2s ease-in-out infinite;
  }
  .ab-scroll-lbl {
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.4em;
    color:rgba(201,169,110,.65); text-transform:uppercase;
    writing-mode:vertical-lr; transform:rotate(180deg); margin-top:4px;
  }

  /* ── TICKER ── */
  .ab-ticker {
    background:var(--brand-dark); overflow:hidden;
    padding:13px 0; border-top:1px solid rgba(201,169,110,.14);
  }
  .ab-ticker-inner { display:flex; white-space:nowrap; width:max-content; animation:abTickerScroll 30s linear infinite; }
  .ab-ticker-item  { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em; color:rgba(201,169,110,.52); text-transform:uppercase; padding:0 48px; }
  .ab-ticker-dot   { display:inline-block; width:4px; height:4px; background:var(--gold); transform:rotate(45deg); margin:0 24px; vertical-align:middle; opacity:.45; }

  /* ── STATS ── */
  .ab-stats {
    display:grid; grid-template-columns:repeat(4,1fr);
    background:var(--brand-dark); position:relative; overflow:hidden;
  }
  .ab-stats::before {
    content:''; position:absolute; inset:0;
    background:repeating-linear-gradient(90deg,rgba(201,169,110,.04) 0,rgba(201,169,110,.04) 1px,transparent 1px,transparent 100px);
  }
  .ab-stat { text-align:center; padding:52px 20px; border-right:1px solid rgba(201,169,110,.1); position:relative; }
  .ab-stat:last-child { border-right:none; }
  .ab-stat-num  { font-family:'Cormorant Garamond',serif; font-size:clamp(2.6rem,4.5vw,4rem); color:var(--gold); font-weight:300; display:block; line-height:1; }
  .ab-stat-lbl  { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.3em; color:rgba(253,248,243,.38); margin-top:10px; text-transform:uppercase; display:block; }
  @media(max-width:640px) {
    .ab-stats{grid-template-columns:1fr 1fr}
    .ab-stat:nth-child(2){border-right:none}
    .ab-stat:nth-child(3){border-right:1px solid rgba(201,169,110,.1);border-top:1px solid rgba(201,169,110,.1)}
    .ab-stat:nth-child(4){border-top:1px solid rgba(201,169,110,.1)}
  }

  /* ── SECTION HEADER ── */
  .ab-sec-hdr { text-align:center; margin-bottom:72px; }
  .ab-sec-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2.4rem,4.5vw,3.8rem); font-weight:300;
    color:var(--brand-dark); line-height:1.12;
  }
  .ab-sec-title em { font-style:italic; color:var(--brand); }

  /* ── ORIGIN SPLIT (The Beginning) ── */
  .ab-origin-sec { padding:clamp(80px,9vw,140px) clamp(24px,5vw,64px); background:var(--brand-light); overflow:hidden; }
  .ab-origin-grid { display:grid; grid-template-columns:1fr 1fr; gap:clamp(40px,6vw,100px); align-items:center; max-width:1280px; margin:0 auto; }
  .ab-origin-img-wrap { position:relative; }
  .ab-origin-img {
    width:100%; aspect-ratio:4/5; object-fit:cover; display:block;
    filter:contrast(1.05) saturate(.9);
  }
  .ab-origin-img-border {
    position:absolute; inset:-14px; border:1px solid rgba(201,169,110,.24);
    pointer-events:none; animation:abBorderGlow 4s ease-in-out infinite;
  }
  .ab-origin-tag {
    position:absolute; bottom:-20px; left:-20px;
    background:var(--brand-dark); padding:20px 26px; border-left:3px solid var(--gold);
  }
  .ab-origin-tag strong { font-family:'Cormorant Garamond',serif; font-size:2rem; color:var(--gold); font-weight:300; display:block; line-height:1; }
  .ab-origin-tag span   { font-family:'Cinzel',serif; font-size:8px; letter-spacing:.32em; color:rgba(253,248,243,.5); text-transform:uppercase; }
  .ab-origin-text p     { font-family:'Jost',sans-serif; font-size:1.05rem; color:var(--muted); line-height:1.95; font-weight:300; margin-bottom:20px; }
  .ab-origin-text p strong { color:var(--brand-dark); font-weight:500; }
  .ab-origin-sig-wrap { margin-top:36px; padding-top:28px; border-top:1px solid rgba(139,111,71,.14); }
  .ab-sig-line { display:flex; align-items:center; gap:16px; }
  .ab-sig-avatar { width:60px; height:60px; border-radius:50%; object-fit:cover; filter:saturate(.75); border:2px solid rgba(201,169,110,.28); flex-shrink:0; }
  .ab-sig-name  { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.36em; color:var(--brand-dark); text-transform:uppercase; display:block; margin-bottom:4px; }
  .ab-sig-role  { font-size:.78rem; color:var(--muted); font-weight:300; letter-spacing:.08em; }
  @media(max-width:900px) {
    .ab-origin-grid{grid-template-columns:1fr;gap:60px}
    .ab-origin-tag{bottom:12px;left:12px}
  }

  /* ── PHILOSOPHY PILLARS ── */
  .ab-pillars-sec { background:var(--brand-dark); padding:clamp(80px,9vw,140px) clamp(24px,5vw,64px); position:relative; overflow:hidden; }
  .ab-pillars-sec::before {
    content:'CRAFT'; position:absolute; bottom:-20px; right:-10px;
    font-family:'Cormorant Garamond',serif; font-size:220px; font-weight:700;
    color:rgba(201,169,110,.025); white-space:nowrap; pointer-events:none;
  }
  .ab-pillars-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:3px; max-width:1200px; margin:0 auto; position:relative; z-index:1; }
  .ab-pillar-card {
    padding:52px 40px; background:rgba(255,255,255,.03); border:1px solid rgba(201,169,110,.08);
    position:relative; overflow:hidden; transition:all .45s ease;
  }
  .ab-pillar-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);
    transform:scaleX(0); transform-origin:left; transition:transform .55s ease;
  }
  .ab-pillar-card:hover { background:rgba(255,255,255,.07); transform:translateY(-6px); border-color:rgba(201,169,110,.2); }
  .ab-pillar-card:hover::before { transform:scaleX(1); }
  .ab-pillar-num  { font-family:'Cormorant Garamond',serif; font-size:4.5rem; color:rgba(201,169,110,.1); font-weight:300; display:block; line-height:1; margin-bottom:20px; }
  .ab-pillar-icon-img { width:52px; height:52px; object-fit:cover; margin-bottom:24px; display:block; filter:sepia(.35) saturate(.7); }
  .ab-pillar-title { font-family:'Cormorant Garamond',serif; font-size:1.55rem; color:var(--gold); font-weight:400; margin-bottom:14px; line-height:1.2; }
  .ab-pillar-text  { font-size:.88rem; color:rgba(253,248,243,.52); line-height:1.88; font-weight:300; }

  /* ── TIMELINE (Our Journey) ── */
  .ab-tl-sec { padding:clamp(80px,9vw,140px) clamp(24px,5vw,64px); background:var(--smoke); }
  .ab-tl { max-width:800px; margin:0 auto; position:relative; }
  .ab-tl::before {
    content:''; position:absolute; left:50%; top:0; bottom:0; width:1px;
    background:linear-gradient(to bottom,transparent,var(--gold) 8%,var(--gold) 92%,transparent);
    transform:translateX(-50%);
  }
  .ab-tl-row { display:grid; grid-template-columns:1fr 64px 1fr; margin-bottom:64px; align-items:center; }
  .ab-tl-row:last-child { margin-bottom:0; }
  .ab-tl-node {
    width:64px; height:64px; background:var(--brand-dark); border:1.5px solid var(--gold);
    display:flex; align-items:center; justify-content:center; position:relative;
  }
  .ab-tl-node::after {
    content:''; position:absolute; inset:-8px; border:1px solid rgba(201,169,110,.22);
    animation:abPulseRing 3s ease-out infinite;
  }
  .ab-tl-year   { font-family:'Cormorant Garamond',serif; font-size:1.15rem; color:var(--gold); font-weight:300; }
  .ab-tl-content{ padding:0 32px; }
  .ab-tl-step   { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.36em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:7px; }
  .ab-tl-title  { font-family:'Cormorant Garamond',serif; font-size:1.35rem; color:var(--brand-dark); font-weight:400; margin-bottom:8px; }
  .ab-tl-text   { font-size:.84rem; color:#8a7060; font-weight:300; line-height:1.8; }
  .ab-tl-left   { text-align:right; }
  .ab-tl-right  { text-align:left; }
  @media(max-width:640px) {
    .ab-tl::before{left:32px}
    .ab-tl-row{grid-template-columns:48px 1fr;gap:20px}
    .ab-tl-node{width:48px;height:48px}
    .ab-tl-left,.ab-tl-right{text-align:left}
    .ab-tl-empty{display:none}
    .ab-tl-content{padding:0}
  }

  /* ── TEAM ── */
  .ab-team-sec { padding:clamp(80px,9vw,140px) clamp(24px,5vw,64px); background:var(--brand-light); }
  .ab-team-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:24px; max-width:1200px; margin:0 auto; }
  .ab-team-card {
    background:#fff; border:1px solid rgba(139,111,71,.1); overflow:hidden;
    transition:all .5s cubic-bezier(.23,1,.32,1); position:relative;
  }
  .ab-team-card:hover { transform:translateY(-7px); box-shadow:0 28px 64px rgba(74,55,40,.12); }
  .ab-team-img-wrap { position:relative; overflow:hidden; }
  .ab-team-img {
    width:100%; aspect-ratio:3/4; object-fit:cover; object-position:top;
    display:block; transition:transform .8s cubic-bezier(.23,1,.32,1),filter .5s ease;
    filter:saturate(.8) contrast(1.05);
  }
  .ab-team-card:hover .ab-team-img { transform:scale(1.05); filter:saturate(.95) contrast(1.06); }
  .ab-team-img-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to top,rgba(28,16,8,.7) 0%,transparent 50%);
    opacity:0; transition:opacity .5s ease;
  }
  .ab-team-card:hover .ab-team-img-overlay { opacity:1; }
  .ab-team-info { padding:28px 28px 32px; }
  .ab-team-role { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.38em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:8px; }
  .ab-team-name { font-family:'Cormorant Garamond',serif; font-size:1.55rem; color:var(--brand-dark); font-weight:400; margin-bottom:10px; }
  .ab-team-bio  { font-size:.84rem; color:var(--muted); font-weight:300; line-height:1.78; }
  .ab-team-bar  { height:2px; background:linear-gradient(90deg,var(--gold),transparent); margin-top:20px; transform-origin:left; transform:scaleX(0); transition:transform .6s ease; }
  .ab-team-card:hover .ab-team-bar { transform:scaleX(1); }

  /* ── GALLERY MOSAIC ── */
  .ab-mosaic { display:grid; grid-template-columns:repeat(5,1fr); grid-template-rows:repeat(2,240px); gap:3px; }
  .ab-mosaic-item:nth-child(1){ grid-column:span 2; grid-row:span 2; }
  .ab-mosaic-item:nth-child(5){ grid-column:span 2; }
  .ab-mosaic-item { overflow:hidden; position:relative; cursor:pointer; }
  .ab-mosaic-img {
    width:100%; height:100%; object-fit:cover; display:block;
    transition:transform .8s cubic-bezier(.23,1,.32,1),filter .5s ease;
    filter:saturate(.7) contrast(1.06);
  }
  .ab-mosaic-item:hover .ab-mosaic-img { transform:scale(1.08); filter:saturate(1.05) contrast(1.02); }
  .ab-mosaic-item::after { content:''; position:absolute; inset:0; background:rgba(201,169,110,0); transition:background .4s ease; }
  .ab-mosaic-item:hover::after { background:rgba(201,169,110,.06); }
  @media(max-width:640px) {
    .ab-mosaic{grid-template-columns:1fr 1fr;grid-template-rows:repeat(4,160px)}
    .ab-mosaic-item:nth-child(1){grid-column:span 2;grid-row:span 1}
    .ab-mosaic-item:nth-child(5){grid-column:span 2}
  }

  /* ── AWARDS ── */
  .ab-awards-sec { background:var(--brand-dark); padding:clamp(80px,9vw,130px) clamp(24px,5vw,64px); position:relative; overflow:hidden; }
  .ab-awards-sec::before {
    content:'AWARDS'; position:absolute; bottom:-20px; left:-10px;
    font-family:'Cormorant Garamond',serif; font-size:200px; font-weight:700;
    color:rgba(201,169,110,.025); white-space:nowrap; pointer-events:none;
  }
  .ab-awards-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:3px; max-width:1200px; margin:0 auto; position:relative; z-index:1; }
  .ab-award-card { padding:44px 32px; border:1px solid rgba(201,169,110,.1); background:rgba(255,255,255,.03); transition:all .4s ease; position:relative; }
  .ab-award-card:hover { background:rgba(255,255,255,.07); transform:translateY(-5px); border-color:rgba(201,169,110,.22); }
  .ab-award-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);
    transform:scaleX(0); transform-origin:left; transition:transform .5s ease;
  }
  .ab-award-card:hover::before { transform:scaleX(1); }
  .ab-award-year  { font-family:'Cormorant Garamond',serif; font-size:3.5rem; color:rgba(201,169,110,.2); font-weight:300; display:block; line-height:1; margin-bottom:14px; }
  .ab-award-title { font-family:'Cormorant Garamond',serif; font-size:1.3rem; color:var(--gold); font-weight:300; margin-bottom:8px; }
  .ab-award-body  { font-size:.82rem; color:rgba(253,248,243,.42); font-weight:300; line-height:1.75; }

  /* ── MANIFESTO QUOTE ── */
  .ab-manifesto {
    padding:clamp(80px,9vw,130px) clamp(24px,5vw,64px);
    background:var(--smoke); text-align:center; position:relative; overflow:hidden;
  }
  .ab-manifesto::before {
    content:'"'; position:absolute; top:-60px; left:-10px;
    font-family:'Cormorant Garamond',serif; font-size:500px;
    color:rgba(139,111,71,.05); line-height:1; pointer-events:none; font-weight:700;
  }
  .ab-manifesto-quote {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(1.6rem,3.5vw,2.6rem); font-style:italic;
    color:var(--brand-dark); line-height:1.55; font-weight:300;
    max-width:900px; margin:0 auto 28px; position:relative; z-index:1;
  }
  .ab-manifesto-attr { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em; color:var(--gold); text-transform:uppercase; position:relative; z-index:1; }

  /* ── CTA ── */
  .ab-cta-sec {
    background:var(--brand-dark); padding:clamp(90px,11vw,160px) clamp(24px,5vw,64px);
    text-align:center; position:relative; overflow:hidden;
    border-top:1px solid rgba(201,169,110,.14);
  }
  .ab-cta-ring { position:absolute; border-radius:50%; border:1px solid rgba(201,169,110,.07); top:50%; left:50%; pointer-events:none; }
  .ab-cta-h2 {
    font-family:'Cormorant Garamond',serif; font-size:clamp(2.6rem,6vw,5.2rem);
    font-weight:300; color:#fff; line-height:1.1; margin-bottom:20px; position:relative; z-index:1;
  }
  .ab-cta-h2 em { font-style:italic; color:var(--gold); }
  .ab-cta-sub { max-width:520px; margin:0 auto 48px; color:rgba(255,255,255,.5); font-size:1rem; font-weight:300; line-height:1.9; position:relative; z-index:1; }
  .ab-cta-btns { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; position:relative; z-index:1; }
  .ab-btn-primary {
    background:var(--brand); color:var(--brand-light);
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none; position:relative; overflow:hidden;
    transition:all .45s cubic-bezier(.23,1,.32,1); box-shadow:0 6px 28px rgba(139,111,71,.4);
  }
  .ab-btn-primary::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--gold) 0%,var(--brand-dark) 100%); opacity:0; transition:opacity .4s ease; }
  .ab-btn-primary:hover  { transform:translateY(-3px); box-shadow:0 14px 44px rgba(139,111,71,.5); }
  .ab-btn-primary:hover::after { opacity:1; }
  .ab-btn-primary span   { position:relative; z-index:1; }
  .ab-btn-outline {
    border:1.5px solid rgba(255,255,255,.38); color:#fff;
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none; transition:all .4s ease;
  }
  .ab-btn-outline:hover { border-color:var(--gold); color:var(--gold); transform:translateY(-3px); }
  .ab-est { margin-top:80px; opacity:.27; }
  .ab-est p { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em; color:rgba(253,248,243,.9); text-transform:uppercase; margin-top:14px; }
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
  const map = { up:'abFadeUp', left:'abSlideL', right:'abSlideR', plain:'abFadeIn' };
  return (
    <div ref={ref} className={className} style={{
      animation: inView ? `${map[dir]} .88s ${delay}s cubic-bezier(.23,1,.32,1) both` : 'none',
      opacity: inView ? undefined : 0,
    }}>{children}</div>
  );
}

function Ornament() {
  return (
    <div className="ab-ornament">
      <div className="ab-ornament-line" />
      <div className="ab-ornament-gem" />
      <div className="ab-ornament-line r" />
    </div>
  );
}

function SectionHeader({ eyebrow, title, light = false }) {
  return (
    <div className="ab-sec-hdr">
      <span className="ab-eyebrow" style={light ? { color:'var(--gold)' } : {}}>{eyebrow}</span>
      <Ornament />
      <h2 className="ab-sec-title" style={light ? { color:'#fff' } : {}} dangerouslySetInnerHTML={{ __html: title }} />
    </div>
  );
}

function TiltCard({ children, className, style }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(5px)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateY(0) rotateX(0) translateZ(0)';
  }, []);
  return (
    <div ref={ref} className={className} style={{ transition:'transform .35s ease', ...style }}
      onMouseMove={onMove} onMouseLeave={onLeave}>{children}</div>
  );
}

function StatItem({ number, suffix, label }) {
  const [ref, inView] = useInView(0.3);
  const val = useCounter(number, inView);
  return (
    <div ref={ref} className="ab-stat">
      <span className="ab-stat-num">{val}{suffix}</span>
      <span className="ab-stat-lbl">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const tickerItems = ['Our Story','Wedding Chapter','Est. 2026','Visual Storytellers','Banquet Venues','Premium Collective','Bespoke Photography','Cinematic Films'];

const pillars = [
  {
    num:'01',
    img:'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=200&q=70',
    title:'Authenticity First',
    text:'We prioritise genuine moments over manufactured perfection. The messy, beautiful reality of your day is what you will want to remember for the rest of your lives.',
  },
  {
    num:'02',
    img:'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=200&q=70',
    title:'Timeless Editing',
    text:'We avoid trendy filters. Our colouring and post-production is designed to ensure your photographs look as breathtaking in fifty years as they do today.',
  },
  {
    num:'03',
    img:'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=200&q=70',
    title:'Unobtrusive Presence',
    text:'We aim to be invisible observers during your ceremony and gentle guides during portraits, ensuring you remain fully present in every extraordinary moment.',
  },
  {
    num:'04',
    img:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=200&q=70',
    title:'Bespoke Every Time',
    text:'No two love stories are alike. Every couple receives a fully custom creative brief, shot list, and album design — nothing is templated, everything is yours alone.',
  },
];

const timelineItems = [
  { year:'2017', step:'The Spark',     title:'Founded in Mumbai',       text:'Wedding Chapter was born from a single belief: that every couple deserves imagery as extraordinary as the love they share.' },
  { year:'2019', step:'First Award',   title:'National Recognition',    text:'Awarded Best Wedding Photography Studio at the India Wedding Industry Awards, validating our commitment to artistry over volume.' },
  { year:'2021', step:'Expansion',     title:'Venues & Banquets',       text:'We expanded beyond photography to curate a network of premium banquet halls, floral studios, and event planners across India.' },
  { year:'2023', step:'500 Weddings',  title:'A Milestone Reached',     text:'We celebrated 500 weddings — each one as personal and unique as the first. Our waiting list now extends 18 months in advance.' },
  { year:'2026', step:'Today',         title:'Wedding Chapter Collective', text:'A full-service premium wedding collective — photographers, cinematographers, venue specialists, and coordinators under one roof.' },
];

const team = [
  { role:'Founder & Lead Director', name:'Aryan Mehta',    bio:'With 12 years of editorial and wedding photography across 4 countries, Aryan leads every flagship project with a cinematic eye and an unobtrusive hand.', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
  { role:'Lead Cinematographer',    name:'Priya Iyer',     bio:'Priya brings a documentary sensibility to wedding films — her cuts are quiet, her timing impeccable, and her final edits consistently leave families in tears.', img:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80' },
  { role:'Creative Director',       name:'Rohit Sharma',   bio:'Rohit oversees all venue styling, floral architecture, and brand aesthetics — the invisible hand behind the visual language that makes every event cohesive.', img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80' },
  { role:'Senior Photographer',     name:'Kavya Nair',     bio:'Kavya specialises in intimate ceremonies and destination pre-wedding shoots, her portraits combining warmth, wit, and an unmistakable graphic sensibility.', img:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80' },
];

const awards = [
  { year:'2024', title:'Best Wedding Studio',      body:'India Wedding Industry Awards — National Category, recognising 5 consecutive years of consistent excellence.' },
  { year:'2023', title:'Cinematic Film of the Year', body:'South Asia Bridal Media Awards for the feature-length film "A Mumbai Monsoon Wedding" — 3.2M organic views.' },
  { year:'2022', title:'Best Venue Partner',        body:'Banquet & Events India — Platinum Partner status awarded for exceptional client satisfaction scores across 200+ events.' },
  { year:'2021', title:'Editorial Excellence',      body:'Featured in Vogue India Weddings, Harper\'s Bazaar Bride, and Brides Today in the same calendar year.' },
];

const mosaicImgs = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=75',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=700&q=75',
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=700&q=75',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=75',
];

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────── */
export default function About() {
  return (
    <>
      <style>{STYLES}</style>

      {/* ══ HERO ══ */}
      <section className="ab-hero">
        <div className="ab-hero-bg" style={{ backgroundImage:"url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85')" }} />
        <div className="ab-hero-overlay" />
        <div className="ab-hero-grain" />
        <div className="ab-hero-content">
          <div className="ab-hero-badge">Est. 2017 &nbsp;&bull;&nbsp; Mumbai, India</div>
          <h1 className="ab-hero-h1">
            Our Story
            <span className="gold-italic">Wedding Chapter</span>
          </h1>
          <p className="ab-hero-sub">
            We are visual storytellers dedicated to capturing the raw, authentic emotion of your most important day — with elegance, intention, and truth.
          </p>
        </div>
        <div className="ab-scroll-cue">
          <div className="ab-scroll-track" />
          <span className="ab-scroll-lbl">Scroll</span>
        </div>
      </section>

      {/* ══ TICKER ══ */}
      <div className="ab-ticker">
        <div className="ab-ticker-inner">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="ab-ticker-item">{item}<span className="ab-ticker-dot" /></span>
          ))}
        </div>
      </div>

      {/* ══ STATS ══ */}
      <div className="ab-stats">
        <StatItem number={500}  suffix="+"    label="Weddings Hosted" />
        <StatItem number={12}   suffix="+"    label="National Awards" />
        <StatItem number={98}   suffix="%"    label="Happy Couples" />
        <StatItem number={8}    suffix=" yrs" label="of Craft" />
      </div>

      {/* ══ ORIGIN — The Beginning ══ */}
      <section className="ab-origin-sec">
        <div className="ab-origin-grid">
          <Reveal dir="left">
            <div className="ab-origin-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80"
                alt="Wedding photographer in action"
                className="ab-origin-img"
                loading="lazy"
              />
              <div className="ab-origin-img-border" />
              <div className="ab-origin-tag">
                <strong>2017</strong>
                <span>The Beginning</span>
              </div>
            </div>
          </Reveal>

          <Reveal dir="right" delay={0.1}>
            <div className="ab-origin-text">
              <span className="ab-eyebrow">The Beginning</span>
              <div className="ab-ornament" style={{ justifyContent:'flex-start' }}>
                <div className="ab-ornament-line" />
                <div className="ab-ornament-gem" />
                <div className="ab-ornament-line r" />
              </div>
              <h2 className="ab-sec-title" style={{ marginBottom:28 }}>
                More than photographers.<br />
                <em>Historians of your love.</em>
              </h2>
              <p>
                <strong>Wedding Chapter</strong> was born from a simple belief — every couple has a unique narrative that deserves to be preserved with elegance and truth. We do not believe in stiff poses or forced smiles.
              </p>
              <p>
                Instead, we blend into the background, watching for the fleeting glances, the tearful embraces, and the unscripted joy that makes your celebration entirely, irreversibly your own.
              </p>
              <p>
                Today, Wedding Chapter is India's most trusted <strong>premium wedding collective</strong> — covering photography, cinematography, banquet curation, floral architecture, and bespoke album design under one roof.
              </p>
              <div className="ab-origin-sig-wrap">
                <div className="ab-sig-line">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=70"
                    alt="Founder"
                    className="ab-sig-avatar"
                    loading="lazy"
                  />
                  <div>
                    <span className="ab-sig-name">Aryan Mehta</span>
                    <span className="ab-sig-role">Founder &amp; Lead Director</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ PHILOSOPHY PILLARS ══ */}
      <section className="ab-pillars-sec">
        <Reveal>
          <SectionHeader eyebrow="Our Philosophy" title="The Pillars of <em>Our Craft</em>" light />
        </Reveal>
        <div className="ab-pillars-grid">
          {pillars.map(({ num, img, title, text }, i) => (
            <Reveal key={i} delay={i * 0.08} dir="plain">
              <TiltCard className="ab-pillar-card">
                <span className="ab-pillar-num">{num}</span>
                <img src={img} alt={title} className="ab-pillar-icon-img" loading="lazy" />
                <h3 className="ab-pillar-title">{title}</h3>
                <p className="ab-pillar-text">{text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ TIMELINE ══ */}
      <section className="ab-tl-sec">
        <Reveal>
          <SectionHeader eyebrow="Our Journey" title="A Decade of <em>Excellence</em>" />
        </Reveal>
        <div className="ab-tl">
          {timelineItems.map(({ year, step, title, text }, i) => {
            const even = i % 2 === 0;
            return (
              <Reveal key={i} delay={i * 0.1} dir={even ? 'left' : 'right'}>
                <div className="ab-tl-row">
                  {even ? (
                    <>
                      <div className="ab-tl-content ab-tl-left">
                        <span className="ab-tl-step">{step}</span>
                        <h4 className="ab-tl-title">{title}</h4>
                        <p className="ab-tl-text">{text}</p>
                      </div>
                      <div className="ab-tl-node"><span className="ab-tl-year">{year}</span></div>
                      <div className="ab-tl-empty" />
                    </>
                  ) : (
                    <>
                      <div className="ab-tl-empty" />
                      <div className="ab-tl-node"><span className="ab-tl-year">{year}</span></div>
                      <div className="ab-tl-content ab-tl-right">
                        <span className="ab-tl-step">{step}</span>
                        <h4 className="ab-tl-title">{title}</h4>
                        <p className="ab-tl-text">{text}</p>
                      </div>
                    </>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ══ TEAM ══ */}
      <section className="ab-team-sec">
        <Reveal>
          <SectionHeader eyebrow="The People" title="Meet the <em>Creative Team</em>" />
        </Reveal>
        <div className="ab-team-grid">
          {team.map(({ role, name, bio, img }, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="ab-team-card">
                <div className="ab-team-img-wrap">
                  <img src={img} alt={name} className="ab-team-img" loading="lazy" />
                  <div className="ab-team-img-overlay" />
                </div>
                <div className="ab-team-info">
                  <span className="ab-team-role">{role}</span>
                  <h3 className="ab-team-name">{name}</h3>
                  <p className="ab-team-bio">{bio}</p>
                  <div className="ab-team-bar" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ GALLERY MOSAIC ══ */}
      <div className="ab-mosaic">
        {mosaicImgs.map((src, i) => (
          <div className="ab-mosaic-item" key={i}>
            <img src={src} alt="" className="ab-mosaic-img" loading="lazy" />
          </div>
        ))}
      </div>

      {/* ══ AWARDS ══ */}
      <section className="ab-awards-sec">
        <Reveal>
          <SectionHeader eyebrow="Recognition" title="<span style='color:#fff'>Awards &amp;</span> <em>Accolades</em>" light />
        </Reveal>
        <div className="ab-awards-grid">
          {awards.map(({ year, title, body }, i) => (
            <Reveal key={i} delay={i * 0.08} dir="plain">
              <TiltCard className="ab-award-card">
                <span className="ab-award-year">{year}</span>
                <h3 className="ab-award-title">{title}</h3>
                <p className="ab-award-body">{body}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ MANIFESTO QUOTE ══ */}
      <section className="ab-manifesto">
        <Reveal>
          <p className="ab-manifesto-quote">
            "We take on a limited number of weddings each year to ensure we can dedicate our full creative energy, undivided attention, and deepest care to every single couple who trusts us with the most important day of their lives."
          </p>
          <span className="ab-manifesto-attr">Aryan Mehta &nbsp;&bull;&nbsp; Founder, Wedding Chapter</span>
        </Reveal>
      </section>

      {/* ══ CTA ══ */}
      <section className="ab-cta-sec">
        {[200, 380, 560, 740].map((size, i) => (
          <div key={i} className="ab-cta-ring" style={{
            width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2,
            animation: `abPulseRing ${3 + i * .7}s ${i * .8}s ease-out infinite`,
          }} />
        ))}
        <Reveal>
          <span className="ab-eyebrow" style={{ color:'var(--gold)' }}>Your Chapter Awaits</span>
          <Ornament />
          <h2 className="ab-cta-h2">
            Let's Create<br /><em>Something Beautiful.</em>
          </h2>
          <p className="ab-cta-sub">
            We take on a limited number of weddings each year to ensure every couple receives our full creative energy. Check availability before your date is gone.
          </p>
          <div className="ab-cta-btns">
            <Link to="/contact" className="ab-btn-primary"><span>Check Our Availability</span></Link>
            <Link to="/vendors" className="ab-btn-outline">Explore Services</Link>
          </div>
          <div className="ab-est">
            <Ornament />
            <p>Est. 2017 &nbsp;&bull;&nbsp; Mumbai, India &nbsp;&bull;&nbsp; Wedding Chapter Collective</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}