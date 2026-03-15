import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────
   UNSPLASH IMAGE REGISTRY  (no API key — direct CDN URLs)
───────────────────────────────────────────────────────────── */
const IMG = {
  hero:     "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85",
  hall1:    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
  hall2:    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
  hall3:    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80",
  gallery1: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=75",
  gallery2: "https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=600&q=75",
  gallery3: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=75",
  gallery4: "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=600&q=75",
  gallery5: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=600&q=75",
  gallery6: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?auto=format&fit=crop&w=600&q=75",
  couple1:  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=200&q=75",
  couple2:  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=200&q=75",
  couple3:  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=200&q=75",
};

/* ─────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Cinzel:wght@400;600;700&family=Jost:wght@200;300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
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
  html { scroll-behavior: smooth; }
  body, .wd-root { font-family:'Jost',sans-serif; background:var(--brand-light); color:var(--ink); overflow-x:hidden; }

  /* ── Keyframes ── */
  @keyframes fadeUp   { from{opacity:0;transform:translateY(52px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes fadeDown { from{opacity:0;transform:translateY(-32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes slideL   { from{opacity:0;transform:translateX(-64px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideR   { from{opacity:0;transform:translateX(64px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes shimmerText {
    0%   { background-position:200% center }
    100% { background-position:-200% center }
  }
  @keyframes borderPulse {
    0%,100% { box-shadow:0 0 0 0 rgba(201,169,110,0) }
    50%      { box-shadow:0 0 0 8px rgba(201,169,110,0.1) }
  }
  @keyframes lineExpand {
    from { transform:scaleX(0) }
    to   { transform:scaleX(1) }
  }
  @keyframes ringPulse {
    0%   { transform:translate(-50%,-50%) scale(1); opacity:.5 }
    100% { transform:translate(-50%,-50%) scale(2.8); opacity:0 }
  }
  @keyframes heroKen {
    0%   { transform:scale(1.04) translateX(0) }
    100% { transform:scale(1.12) translateX(-1.5%) }
  }
  @keyframes scrollDot {
    0%,100% { transform:translateY(0);   opacity:1 }
    60%      { transform:translateY(14px); opacity:0 }
    61%      { transform:translateY(-4px); opacity:0 }
  }
  @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  /* ── Utilities ── */
  .wd-eyebrow {
    display:block; font-family:'Cinzel',serif; font-size:9.5px;
    letter-spacing:.42em; text-transform:uppercase; color:var(--gold); margin-bottom:18px;
  }
  .wd-ornament {
    display:flex; align-items:center; gap:14px; justify-content:center; margin:0 auto 20px;
  }
  .wd-ornament-line {
    flex:1; max-width:72px; height:1px;
    background:linear-gradient(90deg,transparent,var(--gold));
    transform-origin:left; animation:lineExpand .8s ease both;
  }
  .wd-ornament-line.r { background:linear-gradient(90deg,var(--gold),transparent); transform-origin:right; }
  .wd-ornament-gem { width:7px; height:7px; background:var(--gold); transform:rotate(45deg); }
  .wd-section-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2.4rem,5vw,4rem);
    font-weight:300; line-height:1.12; color:var(--brand-dark);
  }
  .wd-section-title em { font-style:italic; color:var(--brand); }

  /* ── HERO ── */
  .wd-hero {
    position:relative; min-height:100vh;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    text-align:center; overflow:hidden; padding:100px 24px 80px;
  }
  .wd-hero-bg {
    position:absolute; inset:0;
    background-size:cover; background-position:center 30%;
    animation:heroKen 18s ease-in-out infinite alternate;
  }
  .wd-hero-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to bottom,rgba(28,16,8,.62) 0%,rgba(28,16,8,.32) 40%,rgba(28,16,8,.72) 100%);
  }
  .wd-hero-grain {
    position:absolute; inset:0; opacity:.04;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:180px;
  }
  .wd-hero-content { position:relative; z-index:2; }

  .wd-hero-badge {
    display:inline-block; font-family:'Cinzel',serif; font-size:9px;
    letter-spacing:.45em; text-transform:uppercase; color:var(--gold);
    border:1px solid rgba(201,169,110,.45); padding:9px 28px; margin-bottom:36px;
    animation:fadeDown .8s ease both; position:relative;
  }
  .wd-hero-badge::before,.wd-hero-badge::after {
    content:''; position:absolute; width:6px; height:6px;
    border:1px solid var(--gold); transform:rotate(45deg); background:rgba(28,16,8,.6);
  }
  .wd-hero-badge::before { top:-4px; left:-4px; }
  .wd-hero-badge::after  { bottom:-4px; right:-4px; }

  .wd-hero-h1 {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(3.6rem,9vw,8rem); font-weight:300;
    color:#fff; line-height:1.02; margin-bottom:28px;
    animation:fadeUp .9s .15s ease both;
  }
  .wd-hero-h1 .gold-italic {
    font-style:italic; display:block;
    background:linear-gradient(90deg,var(--gold),#f0d090,var(--gold),#c8924a,var(--gold));
    background-size:300% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    animation:shimmerText 5s linear 1s infinite;
  }
  .wd-hero-sub {
    max-width:560px; margin:0 auto 48px;
    color:rgba(255,255,255,.72); font-size:clamp(.95rem,1.6vw,1.15rem);
    font-weight:300; line-height:1.9; letter-spacing:.03em;
    animation:fadeUp .9s .3s ease both;
  }
  .wd-hero-ctas {
    display:flex; flex-wrap:wrap; gap:16px; justify-content:center;
    animation:fadeUp .9s .45s ease both;
  }

  /* Buttons */
  .wd-btn-primary {
    background:var(--brand); color:var(--brand-light);
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none; position:relative; overflow:hidden;
    transition:all .45s cubic-bezier(.23,1,.32,1); box-shadow:0 6px 28px rgba(139,111,71,.4);
  }
  .wd-btn-primary::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg,var(--gold) 0%,var(--brand-dark) 100%);
    opacity:0; transition:opacity .4s ease;
  }
  .wd-btn-primary:hover { transform:translateY(-3px); box-shadow:0 14px 44px rgba(139,111,71,.5); }
  .wd-btn-primary:hover::after { opacity:1; }
  .wd-btn-primary span { position:relative; z-index:1; }

  .wd-btn-outline {
    border:1.5px solid rgba(255,255,255,.5); color:#fff;
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none; transition:all .4s ease;
  }
  .wd-btn-outline:hover { background:rgba(255,255,255,.1); border-color:var(--gold); color:var(--gold); transform:translateY(-3px); }

  .wd-btn-dk {
    background:var(--brand); color:var(--brand-light);
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none;
    transition:all .4s ease; box-shadow:0 6px 24px rgba(139,111,71,.28);
  }
  .wd-btn-dk:hover { background:var(--brand-dark); transform:translateY(-3px); box-shadow:0 14px 44px rgba(139,111,71,.42); }
  .wd-btn-outdk {
    border:1.5px solid var(--brand); color:var(--brand);
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none; transition:all .4s ease;
  }
  .wd-btn-outdk:hover { background:var(--brand); color:var(--brand-light); transform:translateY(-3px); }

  /* Scroll cue */
  .wd-scroll-cue {
    position:absolute; bottom:36px; left:50%; transform:translateX(-50%);
    z-index:2; display:flex; flex-direction:column; align-items:center; gap:10px;
    animation:fadeIn 1s 1.4s both;
  }
  .wd-scroll-track {
    width:1px; height:64px;
    background:linear-gradient(to bottom,rgba(201,169,110,.6),transparent);
    position:relative; overflow:hidden;
  }
  .wd-scroll-track::after {
    content:''; position:absolute; top:0; left:0; width:100%; height:40%;
    background:var(--gold); animation:scrollDot 2s ease-in-out infinite;
  }
  .wd-scroll-label {
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.4em;
    color:rgba(201,169,110,.7); text-transform:uppercase;
    writing-mode:vertical-lr; transform:rotate(180deg); margin-top:6px;
  }

  /* ── STATS ── */
  .wd-stats {
    display:grid; grid-template-columns:repeat(4,1fr);
    background:var(--brand-dark); position:relative; overflow:hidden;
  }
  .wd-stats::before {
    content:''; position:absolute; inset:0;
    background:repeating-linear-gradient(90deg,rgba(201,169,110,.04) 0,rgba(201,169,110,.04) 1px,transparent 1px,transparent 120px);
  }
  .wd-stat-item {
    text-align:center; padding:52px 24px;
    border-right:1px solid rgba(201,169,110,.1); position:relative;
  }
  .wd-stat-item:last-child { border-right:none; }
  .wd-stat-num {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2.8rem,5vw,4.4rem); color:var(--gold);
    font-weight:300; display:block; line-height:1;
  }
  .wd-stat-lbl {
    font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.32em;
    color:rgba(253,248,243,.4); margin-top:10px; text-transform:uppercase; display:block;
  }
  @media(max-width:640px) {
    .wd-stats { grid-template-columns:1fr 1fr; }
    .wd-stat-item:nth-child(2) { border-right:none; }
    .wd-stat-item:nth-child(3) { border-right:1px solid rgba(201,169,110,.1); border-top:1px solid rgba(201,169,110,.1); }
    .wd-stat-item:nth-child(4) { border-top:1px solid rgba(201,169,110,.1); }
  }

  /* ── INTRO SPLIT ── */
  .wd-intro {
    display:grid; grid-template-columns:1fr 1fr;
    max-width:1300px; margin:0 auto;
    padding:clamp(80px,9vw,140px) clamp(24px,5vw,80px);
    gap:80px; align-items:center;
  }
  .wd-intro-img-wrap { position:relative; }
  .wd-intro-img { width:100%; aspect-ratio:4/5; object-fit:cover; display:block; filter:contrast(1.04) saturate(.9); }
  .wd-intro-border {
    position:absolute; inset:-16px;
    border:1px solid rgba(201,169,110,.25); pointer-events:none;
    animation:borderPulse 4s ease-in-out infinite;
  }
  .wd-intro-tag {
    position:absolute; bottom:-20px; right:-20px;
    background:var(--brand-dark); padding:20px 28px; border-left:3px solid var(--gold);
  }
  .wd-intro-tag strong {
    font-family:'Cormorant Garamond',serif; font-size:2rem;
    color:var(--gold); font-weight:300; display:block; line-height:1;
  }
  .wd-intro-tag span {
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.3em;
    color:rgba(253,248,243,.5); text-transform:uppercase;
  }
  .wd-intro-text p { font-size:1.05rem; line-height:1.95; color:var(--muted); font-weight:300; margin-bottom:20px; }
  .wd-intro-text p strong { color:var(--brand-dark); font-weight:500; }
  @media(max-width:900px) {
    .wd-intro { grid-template-columns:1fr; gap:60px; }
    .wd-intro-tag { bottom:16px; right:16px; }
  }

  /* ── SERVICES ── */
  .wd-services-sec { padding:clamp(80px,9vw,140px) clamp(24px,5vw,60px); background:var(--smoke); }
  .wd-services-grid {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(290px,1fr));
    gap:2px; max-width:1280px; margin:0 auto;
  }
  .wd-svc-card {
    background:#fff; padding:52px 40px; position:relative; overflow:hidden;
    border:1px solid rgba(139,111,71,.07); transition:box-shadow .5s ease, transform .5s ease;
  }
  .wd-svc-card.dark { background:var(--brand-dark); }
  .wd-svc-card.dark .wd-svc-title { color:var(--gold); }
  .wd-svc-card.dark .wd-svc-desc  { color:rgba(253,248,243,.52); }
  .wd-svc-card.dark .wd-svc-tag   { color:rgba(201,169,110,.55); border-color:rgba(201,169,110,.18); }
  .wd-svc-card.dark .wd-svc-num   { color:rgba(201,169,110,.05); }
  .wd-svc-card:hover { transform:translateY(-6px); box-shadow:0 24px 72px rgba(74,55,40,.13); }
  .wd-svc-num { font-family:'Cormorant Garamond',serif; font-size:5.5rem; color:rgba(139,111,71,.06); font-weight:300; position:absolute; top:12px; right:20px; line-height:1; pointer-events:none; }
  .wd-svc-img { width:56px; height:56px; object-fit:cover; margin-bottom:24px; filter:sepia(.3) saturate(.8); display:block; }
  .wd-svc-title { font-family:'Cormorant Garamond',serif; font-size:1.55rem; color:var(--brand-dark); font-weight:400; margin-bottom:14px; line-height:1.2; }
  .wd-svc-desc  { font-size:.88rem; color:#8a7060; line-height:1.85; font-weight:300; }
  .wd-svc-tag   { display:inline-block; margin-top:24px; font-family:'Cinzel',serif; font-size:8px; letter-spacing:.32em; color:var(--gold); border-bottom:1px solid var(--gold-dim); padding-bottom:4px; text-transform:uppercase; }

  /* ── VENUES ── */
  .wd-venues-sec {
    background:var(--brand-dark);
    padding:clamp(80px,9vw,140px) clamp(24px,5vw,60px);
    position:relative; overflow:hidden;
  }
  .wd-venues-sec::before {
    content:'VENUES'; position:absolute; top:40px; left:-20px;
    font-family:'Cormorant Garamond',serif; font-size:160px;
    color:rgba(201,169,110,.03); font-weight:700; white-space:nowrap; pointer-events:none;
  }
  .wd-venue-grid {
    display:grid; grid-template-columns:1.3fr 1fr; grid-template-rows:auto auto;
    gap:3px; max-width:1200px; margin:0 auto; position:relative; z-index:1;
  }
  .wd-venue-card { position:relative; overflow:hidden; cursor:pointer; display:flex; align-items:flex-end; }
  .wd-venue-card:first-child { grid-row:span 2; min-height:600px; }
  .wd-venue-card:not(:first-child) { min-height:290px; }
  .wd-venue-img {
    position:absolute; inset:0; width:100%; height:100%;
    object-fit:cover; transition:transform .8s cubic-bezier(.23,1,.32,1);
    filter:saturate(.85) contrast(1.05);
  }
  .wd-venue-card:hover .wd-venue-img { transform:scale(1.06); }
  .wd-venue-grad {
    position:absolute; inset:0;
    background:linear-gradient(to top,rgba(28,16,8,.9) 0%,rgba(28,16,8,.28) 50%,rgba(28,16,8,.04) 100%);
    transition:opacity .5s ease;
  }
  .wd-venue-card:hover .wd-venue-grad { opacity:.96; }
  .wd-venue-arrow {
    position:absolute; top:28px; right:28px; width:40px; height:40px;
    border:1px solid rgba(201,169,110,.35); display:flex; align-items:center; justify-content:center;
    opacity:0; transform:translateY(8px); transition:all .4s ease; z-index:2;
  }
  .wd-venue-card:hover .wd-venue-arrow { opacity:1; transform:translateY(0); }
  .wd-venue-info { position:relative; z-index:1; padding:32px; }
  .wd-venue-tag { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.38em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:8px; }
  .wd-venue-name { font-family:'Cormorant Garamond',serif; font-size:clamp(1.4rem,3vw,2rem); color:#fff; font-weight:300; line-height:1.15; }
  .wd-venue-cap  { font-size:.78rem; color:rgba(253,248,243,.42); margin-top:6px; font-weight:300; letter-spacing:.05em; }
  @media(max-width:768px) {
    .wd-venue-grid { grid-template-columns:1fr; }
    .wd-venue-card:first-child { grid-row:auto; min-height:320px; }
    .wd-venue-card:not(:first-child) { min-height:240px; }
  }

  /* ── PACKAGES ── */
  .wd-packages-sec { padding:clamp(80px,9vw,140px) clamp(24px,5vw,60px); background:var(--brand-light); }
  .wd-packages-grid {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
    gap:24px; max-width:1100px; margin:0 auto; align-items:start;
  }
  .wd-pkg-card {
    border:1px solid rgba(139,111,71,.14); padding:52px 40px;
    background:#fff; position:relative; transition:all .5s cubic-bezier(.23,1,.32,1);
  }
  .wd-pkg-card:hover:not(.feat) { transform:translateY(-8px); box-shadow:0 28px 72px rgba(74,55,40,.12); }
  .wd-pkg-card.feat {
    background:var(--brand-dark); border-color:var(--gold);
    transform:translateY(-12px); box-shadow:0 32px 80px rgba(74,55,40,.28);
    animation:borderPulse 3s ease-in-out infinite;
  }
  .wd-pkg-badge {
    position:absolute; top:0; left:50%; transform:translate(-50%,-50%);
    background:var(--gold); color:var(--brand-dark);
    font-family:'Cinzel',serif; font-size:7.5px; letter-spacing:.35em;
    padding:7px 22px; text-transform:uppercase; font-weight:700; white-space:nowrap;
  }
  .wd-pkg-tier { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.38em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:12px; }
  .wd-pkg-name { font-family:'Cormorant Garamond',serif; font-size:1.9rem; font-weight:300; margin-bottom:6px; color:var(--brand-dark); }
  .wd-pkg-card.feat .wd-pkg-name { color:#fff; }
  .wd-pkg-price { font-family:'Cormorant Garamond',serif; font-size:3.2rem; color:var(--brand); font-weight:300; line-height:1; margin-bottom:4px; }
  .wd-pkg-card.feat .wd-pkg-price { color:var(--gold); }
  .wd-pkg-per { font-size:.75rem; color:#9a8070; letter-spacing:.08em; margin-bottom:32px; display:block; }
  .wd-pkg-card.feat .wd-pkg-per { color:rgba(253,248,243,.38); }
  .wd-pkg-div { height:1px; background:linear-gradient(90deg,transparent,rgba(139,111,71,.2),transparent); margin-bottom:28px; }
  .wd-pkg-card.feat .wd-pkg-div { background:linear-gradient(90deg,transparent,rgba(201,169,110,.22),transparent); }
  .wd-pkg-item { display:flex; align-items:flex-start; gap:12px; font-size:.875rem; color:#6b5844; margin-bottom:14px; font-weight:300; line-height:1.5; }
  .wd-pkg-card.feat .wd-pkg-item { color:rgba(253,248,243,.68); }
  .wd-pkg-dot { width:5px; height:5px; background:var(--gold); transform:rotate(45deg); flex-shrink:0; margin-top:5px; }
  .wd-pkg-cta { display:block; text-align:center; margin-top:36px; padding:15px 28px; font-family:'Cinzel',serif; font-size:9px; letter-spacing:.34em; text-transform:uppercase; text-decoration:none; border:1px solid var(--brand); color:var(--brand); transition:all .35s ease; }
  .wd-pkg-cta:hover { background:var(--brand); color:var(--brand-light); }
  .wd-pkg-card.feat .wd-pkg-cta { border-color:var(--gold); color:var(--gold); }
  .wd-pkg-card.feat .wd-pkg-cta:hover { background:var(--gold); color:var(--brand-dark); }
  @media(max-width:768px) { .wd-pkg-card.feat { transform:translateY(0); } }

  /* ── GALLERY ── */
  .wd-gallery { display:grid; grid-template-columns:repeat(6,1fr); gap:3px; }
  .wd-gallery-item { aspect-ratio:1; overflow:hidden; cursor:pointer; position:relative; }
  .wd-gallery-img { width:100%; height:100%; object-fit:cover; transition:transform .7s cubic-bezier(.23,1,.32,1),filter .5s ease; filter:saturate(.7) contrast(1.05); }
  .wd-gallery-item:hover .wd-gallery-img { transform:scale(1.1); filter:saturate(1) contrast(1.02); }
  .wd-gallery-item::after { content:''; position:absolute; inset:0; background:rgba(201,169,110,0); transition:background .4s ease; }
  .wd-gallery-item:hover::after { background:rgba(201,169,110,.07); }
  @media(max-width:640px) { .wd-gallery { grid-template-columns:repeat(3,1fr); } }

  /* ── TIMELINE ── */
  .wd-tl-sec { padding:clamp(80px,9vw,140px) clamp(24px,5vw,60px); background:var(--smoke); position:relative; }
  .wd-tl { max-width:760px; margin:0 auto; position:relative; }
  .wd-tl::before { content:''; position:absolute; left:50%; top:0; bottom:0; width:1px; background:linear-gradient(to bottom,transparent,var(--gold) 8%,var(--gold) 92%,transparent); transform:translateX(-50%); }
  .wd-tl-row { display:grid; grid-template-columns:1fr 64px 1fr; margin-bottom:60px; align-items:center; }
  .wd-tl-row:last-child { margin-bottom:0; }
  .wd-tl-node { width:64px; height:64px; background:var(--brand-dark); border:1.5px solid var(--gold); display:flex; align-items:center; justify-content:center; position:relative; }
  .wd-tl-node::after { content:''; position:absolute; inset:-8px; border:1px solid rgba(201,169,110,.22); animation:ringPulse 3s ease-out infinite; }
  .wd-tl-node-num { font-family:'Cormorant Garamond',serif; font-size:1.3rem; color:var(--gold); font-weight:300; }
  .wd-tl-content { padding:0 32px; }
  .wd-tl-step { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.36em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:7px; }
  .wd-tl-title { font-family:'Cormorant Garamond',serif; font-size:1.35rem; color:var(--brand-dark); font-weight:400; margin-bottom:8px; }
  .wd-tl-text  { font-size:.84rem; color:#8a7060; font-weight:300; line-height:1.8; }
  .wd-tl-right { text-align:left; }
  .wd-tl-left  { text-align:right; }
  @media(max-width:640px) {
    .wd-tl::before { left:32px; }
    .wd-tl-row { grid-template-columns:48px 1fr; gap:20px; }
    .wd-tl-node { width:48px; height:48px; }
    .wd-tl-left,.wd-tl-right { text-align:left; }
    .wd-tl-empty { display:none; }
    .wd-tl-content { padding:0; }
  }

  /* ── TESTIMONIALS ── */
  .wd-testi-sec { background:var(--brand-dark); padding:clamp(80px,9vw,140px) clamp(24px,5vw,60px); position:relative; overflow:hidden; }
  .wd-testi-sec::before { content:'"'; position:absolute; top:-80px; left:-10px; font-family:'Cormorant Garamond',serif; font-size:500px; color:rgba(201,169,110,.03); line-height:1; pointer-events:none; font-weight:700; }
  .wd-testi-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:20px; max-width:1100px; margin:0 auto; position:relative; z-index:1; }
  .wd-testi-card { border:1px solid rgba(201,169,110,.1); padding:44px 36px; background:rgba(255,255,255,.03); position:relative; backdrop-filter:blur(6px); transition:all .4s ease; }
  .wd-testi-card:hover { background:rgba(255,255,255,.06); transform:translateY(-5px); border-color:rgba(201,169,110,.22); }
  .wd-testi-mark { position:absolute; top:20px; right:24px; font-family:'Cormorant Garamond',serif; font-size:4.5rem; color:rgba(201,169,110,.1); line-height:1; font-style:italic; }
  .wd-testi-stars { display:flex; gap:4px; margin-bottom:22px; }
  .wd-testi-star { width:10px; height:10px; background:var(--gold); clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%); }
  .wd-testi-quote { font-family:'Cormorant Garamond',serif; font-size:1.12rem; color:rgba(253,248,243,.82); font-style:italic; line-height:1.85; margin-bottom:28px; font-weight:300; }
  .wd-testi-couple { display:flex; align-items:center; gap:14px; }
  .wd-testi-avatar { width:48px; height:48px; border-radius:50%; object-fit:cover; filter:saturate(.7); border:1.5px solid rgba(201,169,110,.3); flex-shrink:0; }
  .wd-testi-author { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.3em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:4px; }
  .wd-testi-event  { font-size:.75rem; color:rgba(253,248,243,.3); font-weight:300; }

  /* ── FINAL CTA ── */
  .wd-final {
    padding:clamp(100px,12vw,180px) 24px; text-align:center; position:relative; overflow:hidden;
    background:radial-gradient(ellipse at center,rgba(139,111,71,.08) 0%,transparent 70%),var(--brand-light);
  }
  .wd-final-ring { position:absolute; border-radius:50%; border:1px solid rgba(201,169,110,.1); top:50%; left:50%; pointer-events:none; }
  .wd-final-h2 { font-family:'Cormorant Garamond',serif; font-size:clamp(2.8rem,7vw,5.8rem); font-weight:300; color:var(--brand-dark); line-height:1.08; margin-bottom:24px; }
  .wd-final-h2 em { font-style:italic; color:var(--brand); }
  .wd-final-sub { max-width:520px; margin:0 auto 52px; color:var(--muted); line-height:1.9; font-weight:300; font-size:1.05rem; }
  .wd-est { margin-top:80px; opacity:.28; }
  .wd-est p { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em; color:var(--brand-dark); text-transform:uppercase; margin-top:14px; }
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
    const steps = 55;
    const inc = target / steps;
    let cur = 0;
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
  const anims = { up:'fadeUp', down:'fadeDown', left:'slideL', right:'slideR', plain:'fadeIn' };
  return (
    <div ref={ref} className={className} style={{
      animation: inView ? `${anims[dir]} .85s ${delay}s cubic-bezier(.23,1,.32,1) both` : 'none',
      opacity: inView ? undefined : 0,
    }}>{children}</div>
  );
}

function Ornament() {
  return (
    <div className="wd-ornament">
      <div className="wd-ornament-line" />
      <div className="wd-ornament-gem" />
      <div className="wd-ornament-line r" />
    </div>
  );
}

function SectionHeader({ eyebrow, title, light = false }) {
  return (
    <div style={{ textAlign:'center', marginBottom:72 }}>
      <span className="wd-eyebrow">{eyebrow}</span>
      <Ornament />
      <h2
        className="wd-section-title"
        style={light ? { color:'#fff' } : {}}
        dangerouslySetInnerHTML={{ __html: title }}
      />
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
    el.style.transform = `perspective(1000px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateZ(6px)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
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
    <div ref={ref} className="wd-stat-item">
      <span className="wd-stat-num">{val}{suffix}</span>
      <span className="wd-stat-lbl">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────── */
export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  const services = [
    { num:'01', img:IMG.gallery3, title:'Grand Banquet Halls',    desc:'Palatial spaces adorned with silk draping, crystal chandeliers, and bespoke lighting — accommodating 50 to 1,500 guests with flawless elegance.', tag:'Capacity from 50 guests' },
    { num:'02', img:IMG.gallery1, title:'Bridal Photography',     desc:'Award-winning photographers capturing every fleeting glance, every tear of joy — images that will outlive generations and tell your story forever.', tag:'Full-day coverage' },
    { num:'03', img:IMG.gallery2, title:'Floral Architecture',    desc:'Living installations — from towering mandap arrangements to sprawling table centrepieces — that transform every corner into a breathing garden.', tag:'Bespoke designs' },
    { num:'04', img:IMG.gallery5, title:'Royal Catering',         desc:'Multi-cuisine spreads featuring 200+ dishes, live cooking stations, and expert sommeliers curating your signature bar experience.', tag:'200+ menu items' },
    { num:'05', img:IMG.gallery4, title:'Entertainment & Sound',  desc:'Live orchestras, curated DJ sets, and professional sound production ensure the dance floor remains electric from the first note to the last.', tag:'Live & DJ options' },
    { num:'06', img:IMG.gallery6, title:'Bridal Styling Suite',   desc:'An in-house lounge with master hair artists, makeup specialists, and wardrobe consultants ensuring you look breathtaking all day long.', tag:'Premium artists' },
  ];

  const venues = [
    { tag:'Flagship Hall',    name:'The Grand Rosewood', cap:'Up to 1,200 guests  ·  Full ballroom & garden terrace', img:IMG.hall1 },
    { tag:'Rooftop Garden',   name:'Sky Garden Terrace', cap:'Up to 300 guests  ·  Open air with panoramic views',   img:IMG.hall2 },
    { tag:'Heritage Estate',  name:'The Ivory Manor',    cap:'Up to 500 guests  ·  Colonial architecture & lawns',   img:IMG.hall3 },
  ];

  const packages = [
    {
      tier:'Entry', name:'Silver Serenade', price:'₹2.5L', per:'starting price', feat:false,
      items:['Banquet hall up to 200 guests','Essential décor & florals','5-hour photography session','Standard catering — 80 dishes','DJ & professional sound system'],
    },
    {
      tier:'Signature', name:'Golden Grandeur', price:'₹6.5L', per:'all-inclusive', feat:true, badge:'Most Popular',
      items:['Premium hall up to 600 guests','Luxury décor & floral architecture','Full-day photo & cinematic film','Royal catering — 200+ dishes','Live orchestra + DJ','Bridal styling suite access','Dedicated event coordinator'],
    },
    {
      tier:'Prestige', name:'Royal Opulence', price:'₹14L', per:'bespoke pricing', feat:false,
      items:['Exclusive venue buyout','Custom theme & design direction','Cinematic multi-camera package','Private chef & tasting menu','Celebrity entertainment options','Guest concierge & transport'],
    },
  ];

  const timeline = [
    { step:'Step 01', title:'Consultation', text:'Share your vision, budget, and guest count. Our planners craft a tailored proposal within 24 hours.' },
    { step:'Step 02', title:'Venue Tour',   text:'Walk through shortlisted venues, meet the décor and catering teams, and experience the space firsthand.' },
    { step:'Step 03', title:'Confirm & Sign', text:'Lock your date with a simple booking form, transparent pricing, and flexible payment milestones.' },
    { step:'Step 04', title:'Your Perfect Day', text:'Arrive and celebrate. Our team handles every detail while you simply live in the moment.' },
  ];

  const testimonials = [
    { quote:'Every single detail was beyond what we had imagined. The décor left our 700 guests absolutely breathless, and the catering was nothing short of divine.', author:'Priya & Arjun Sharma', event:'Grand Ballroom Wedding, February 2025', avatar:IMG.couple1 },
    { quote:'The team made us feel completely at ease from the very first call. Our ceremony felt like a fairytale unfolding in real time — genuinely magical.', author:'Sneha & Rohan Mehta', event:'Garden Ceremony, November 2024', avatar:IMG.couple2 },
    { quote:'Professional, warm, and extraordinarily detail-oriented. Worth every rupee. Our guests are still sending messages about it months later.', author:'Kavya & Dev Kapoor', event:'Heritage Villa, January 2025', avatar:IMG.couple3 },
  ];

  const galleryImgs = [
    IMG.gallery1, IMG.gallery2, IMG.gallery3, IMG.gallery4, IMG.gallery5, IMG.gallery6,
    IMG.hall1,    IMG.hall2,    IMG.hall3,    IMG.gallery1, IMG.gallery4, IMG.gallery6,
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="wd-root">

        {/* ══ HERO ══ */}
        <section className="wd-hero">
          <div className="wd-hero-bg" style={{ backgroundImage:`url(${IMG.hero})` }} />
          <div className="wd-hero-overlay" />
          <div className="wd-hero-grain" />
          <div className="wd-hero-content">
            <div className="wd-hero-badge">
              {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Banquet & Wedding Specialists'}
            </div>
            <h1 className="wd-hero-h1">
              Capturing Your
              <span className="gold-italic">Love Story</span>
            </h1>
            <p className="wd-hero-sub">
              Discover the finest wedding photographers, breathtaking banquet halls,
              and visionary planners. From intimate gatherings to grand celebrations —
              your perfect chapter begins here.
            </p>
            <div className="wd-hero-ctas">
              <Link to="/vendors" className="wd-btn-primary"><span>Explore Services</span></Link>
              <Link to="/book"    className="wd-btn-outline">Book Your Date</Link>
            </div>
          </div>
          <div className="wd-scroll-cue">
            <div className="wd-scroll-track" />
            <span className="wd-scroll-label">Scroll</span>
          </div>
        </section>

        {/* ══ STATS ══ */}
        <div className="wd-stats">
          <StatItem number={500} suffix="+" label="Weddings Hosted" />
          <StatItem number={12}  suffix="+"   label="Luxury Venues" />
          <StatItem number={98}  suffix="%"   label="Happy Couples" />
          <StatItem number={8}   suffix=" yrs" label="of Excellence" />
        </div>

        {/* ══ INTRO SPLIT ══ */}
        <section style={{ background:'var(--brand-light)', overflow:'hidden' }}>
          <div className="wd-intro">
            <Reveal dir="left">
              <div className="wd-intro-img-wrap">
                <img src={IMG.hall1} alt="Luxury banquet interior" className="wd-intro-img" loading="lazy" />
                <div className="wd-intro-border" />
                <div className="wd-intro-tag">
                  <strong>2026</strong>
                  <span>Est. · Premium Collective</span>
                </div>
              </div>
            </Reveal>
            <Reveal dir="right" delay={0.1}>
              <div className="wd-intro-text">
                <span className="wd-eyebrow">Our Philosophy</span>
                <div className="wd-ornament" style={{ justifyContent:'flex-start' }}>
                  <div className="wd-ornament-line" />
                  <div className="wd-ornament-gem" />
                  <div className="wd-ornament-line r" />
                </div>
                <h2 className="wd-section-title" style={{ marginBottom:28 }}>
                  Where Every Detail<br /><em>Tells Your Story</em>
                </h2>
                <p>
                  <strong>Wedding Chapter</strong> was founded on a singular belief — that your wedding day should feel as extraordinary as the love it celebrates. We do not offer templates. We craft bespoke experiences that are entirely, irreversibly yours.
                </p>
                <p>
                  Our curated network of venues, photographers, florists, and caterers has been carefully selected for one quality above all others: <strong>excellence without compromise</strong>. Every vendor carries our personal mark of approval.
                </p>
                <p>
                  From the first consultation to the final dance, a dedicated coordinator walks beside you — anticipating, resolving, and perfecting every moment so you never have to.
                </p>
                <div style={{ marginTop:36 }}>
                  <Link to="/book" className="wd-btn-dk">Begin Your Journey</Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ SERVICES ══ */}
        <section className="wd-services-sec">
          <Reveal><SectionHeader eyebrow="What We Offer" title="Crafting Unforgettable<br /><em>Celebrations</em>" /></Reveal>
          <div className="wd-services-grid">
            {services.map(({ num, img, title, desc, tag }, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <TiltCard className={`wd-svc-card${i === 1 ? ' dark' : ''}`}>
                  <span className="wd-svc-num">{num}</span>
                  <img src={img} alt={title} className="wd-svc-img" loading="lazy" />
                  <h3 className="wd-svc-title">{title}</h3>
                  <p className="wd-svc-desc">{desc}</p>
                  <span className="wd-svc-tag">{tag}</span>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══ VENUES ══ */}
        <section className="wd-venues-sec">
          <Reveal><SectionHeader eyebrow="Our Spaces" title="<span style='color:#fff'>Iconic</span> <em>Venues</em>" light /></Reveal>
          <div className="wd-venue-grid">
            {venues.map(({ tag, name, cap, img }, i) => (
              <Reveal key={i} delay={i * 0.09} dir="plain">
                <div className="wd-venue-card">
                  <img src={img} alt={name} className="wd-venue-img" loading="lazy" />
                  <div className="wd-venue-grad" />
                  <div className="wd-venue-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color:'var(--gold)' }}>
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </div>
                  <div className="wd-venue-info">
                    <span className="wd-venue-tag">{tag}</span>
                    <h3 className="wd-venue-name">{name}</h3>
                    <p className="wd-venue-cap">{cap}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══ PACKAGES ══ */}
        <section className="wd-packages-sec">
          <Reveal><SectionHeader eyebrow="Curated Collections" title="Wedding <em>Packages</em>" /></Reveal>
          <div className="wd-packages-grid">
            {packages.map(({ tier, name, price, per, feat, badge, items }, i) => (
              <Reveal key={i} delay={i * 0.09}>
                <TiltCard className={`wd-pkg-card${feat ? ' feat' : ''}`}>
                  {badge && <div className="wd-pkg-badge">{badge}</div>}
                  <span className="wd-pkg-tier">{tier}</span>
                  <h3 className="wd-pkg-name">{name}</h3>
                  <div className="wd-pkg-price">{price}</div>
                  <span className="wd-pkg-per">{per}</span>
                  <div className="wd-pkg-div" />
                  {items.map((item, j) => (
                    <div className="wd-pkg-item" key={j}>
                      <div className="wd-pkg-dot" /><span>{item}</span>
                    </div>
                  ))}
                  <Link to="/book" className="wd-pkg-cta">Reserve Now</Link>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══ GALLERY STRIP ══ */}
        <div className="wd-gallery">
          {galleryImgs.map((src, i) => (
            <div className="wd-gallery-item" key={i}>
              <img src={src} alt="" className="wd-gallery-img" loading="lazy" />
            </div>
          ))}
        </div>

        {/* ══ TIMELINE ══ */}
        <section className="wd-tl-sec">
          <Reveal><SectionHeader eyebrow="Your Journey" title="How It <em>Works</em>" /></Reveal>
          <div className="wd-tl">
            {timeline.map(({ step, title, text }, i) => {
              const even = i % 2 === 0;
              return (
                <Reveal key={i} delay={i * 0.1} dir={even ? 'left' : 'right'}>
                  <div className="wd-tl-row">
                    {even ? (
                      <>
                        <div className="wd-tl-content wd-tl-left">
                          <span className="wd-tl-step">{step}</span>
                          <h4 className="wd-tl-title">{title}</h4>
                          <p className="wd-tl-text">{text}</p>
                        </div>
                        <div className="wd-tl-node"><span className="wd-tl-node-num">0{i+1}</span></div>
                        <div className="wd-tl-empty" />
                      </>
                    ) : (
                      <>
                        <div className="wd-tl-empty" />
                        <div className="wd-tl-node"><span className="wd-tl-node-num">0{i+1}</span></div>
                        <div className="wd-tl-content wd-tl-right">
                          <span className="wd-tl-step">{step}</span>
                          <h4 className="wd-tl-title">{title}</h4>
                          <p className="wd-tl-text">{text}</p>
                        </div>
                      </>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ══ TESTIMONIALS ══ */}
        <section className="wd-testi-sec">
          <Reveal><SectionHeader eyebrow="Love Letters" title="<span style='color:#fff'>What Couples</span> <em>Say</em>" light /></Reveal>
          <div className="wd-testi-grid">
            {testimonials.map(({ quote, author, event, avatar }, i) => (
              <Reveal key={i} delay={i * 0.09}>
                <div className="wd-testi-card">
                  <div className="wd-testi-mark">"</div>
                  <div className="wd-testi-stars">
                    {Array.from({ length:5 }).map((_,j) => <div className="wd-testi-star" key={j} />)}
                  </div>
                  <p className="wd-testi-quote">{quote}</p>
                  <div className="wd-testi-couple">
                    <img src={avatar} alt={author} className="wd-testi-avatar" loading="lazy" />
                    <div>
                      <span className="wd-testi-author">{author}</span>
                      <span className="wd-testi-event">{event}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══ FINAL CTA ══ */}
        <section className="wd-final">
          {[220, 400, 580, 760].map((size, i) => (
            <div key={i} className="wd-final-ring" style={{
              width:size, height:size,
              marginLeft:-size/2, marginTop:-size/2,
              animation:`ringPulse ${3+i*.7}s ${i*.8}s ease-out infinite`,
            }} />
          ))}
          <Reveal>
            <span className="wd-eyebrow">Begin Your Chapter</span>
            <Ornament />
            <h2 className="wd-final-h2">
              Your Dream Wedding<br /><em>Awaits You</em>
            </h2>
            <p className="wd-final-sub">
              Limited dates available for 2025–2026. Speak with a dedicated planner
              today and secure the once-in-a-lifetime celebration you deserve.
            </p>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap', justifyContent:'center' }}>
              <Link to="/vendors" className="wd-btn-dk">Explore Services</Link>
              <Link to="/book"    className="wd-btn-outdk">Book Your Date</Link>
            </div>
          </Reveal>
          <div className="wd-est">
            <Ornament />
            <p>Est. 2026 &nbsp;&bull;&nbsp; Premium Wedding Collective &nbsp;&bull;&nbsp; Wedding Chapter</p>
          </div>
        </section>

      </div>
    </>
  );
}