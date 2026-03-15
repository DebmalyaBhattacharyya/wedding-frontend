import { useState, useRef, useEffect, useCallback } from 'react';

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
  @keyframes ctFadeUp   { from{opacity:0;transform:translateY(56px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ctSlideL   { from{opacity:0;transform:translateX(-68px)} to{opacity:1;transform:translateX(0)} }
  @keyframes ctSlideR   { from{opacity:0;transform:translateX(68px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes ctFadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes ctShimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes ctLineGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes ctKen      { 0%{transform:scale(1.04)} 100%{transform:scale(1.11) translateX(-1.2%)} }
  @keyframes ctScrollDot {
    0%,100%{transform:translateY(0);opacity:1}
    60%{transform:translateY(14px);opacity:0}
    61%{transform:translateY(-4px);opacity:0}
  }
  @keyframes ctBorderGlow {
    0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,0)}
    50%{box-shadow:0 0 0 12px rgba(201,169,110,0.09)}
  }
  @keyframes ctRotateGem {
    0%,100%{transform:rotate(45deg) scale(1)}
    50%{transform:rotate(45deg) scale(1.4)}
  }
  @keyframes ctPulseRing {
    0%{transform:translate(-50%,-50%) scale(1);opacity:.5}
    100%{transform:translate(-50%,-50%) scale(2.7);opacity:0}
  }
  @keyframes ctTickerScroll {
    from{transform:translateX(0)}
    to{transform:translateX(-50%)}
  }
  @keyframes ctFloatY {
    0%,100%{transform:translateY(0px)}
    50%{transform:translateY(-12px)}
  }
  @keyframes ctCheckDraw {
    from{stroke-dashoffset:100}
    to{stroke-dashoffset:0}
  }
  @keyframes ctSuccessScale {
    0%{opacity:0;transform:scale(.7) translateY(20px)}
    100%{opacity:1;transform:scale(1) translateY(0)}
  }
  @keyframes ctInputFocus {
    from{transform:scaleX(0);transform-origin:left}
    to{transform:scaleX(1);transform-origin:left}
  }
  @keyframes ctTopBarGrow {
    from{transform:scaleX(0);transform-origin:left}
    to{transform:scaleX(1);transform-origin:left}
  }
  @keyframes ctCounterIn {
    from{opacity:0;transform:translateY(22px)}
    to{opacity:1;transform:translateY(0)}
  }

  /* ── Utility ── */
  .ct-eyebrow {
    display:block; font-family:'Cinzel',serif; font-size:9.5px;
    letter-spacing:.44em; text-transform:uppercase; color:var(--gold); margin-bottom:16px;
  }
  .ct-ornament {
    display:flex; align-items:center; gap:12px; justify-content:center; margin:0 auto 22px;
  }
  .ct-ornament-line {
    flex:1; max-width:68px; height:1px;
    background:linear-gradient(90deg,transparent,var(--gold));
    transform-origin:left; animation:ctLineGrow .8s ease both;
  }
  .ct-ornament-line.r { background:linear-gradient(90deg,var(--gold),transparent); transform-origin:right; }
  .ct-ornament-gem   { width:7px; height:7px; background:var(--gold); transform:rotate(45deg); animation:ctRotateGem 4s ease-in-out infinite; }

  /* ── HERO ── */
  .ct-hero {
    position:relative; height:72vh; min-height:520px;
    display:flex; align-items:center; justify-content:center;
    text-align:center; overflow:hidden;
  }
  .ct-hero-bg {
    position:absolute; inset:0; background-size:cover; background-position:center 40%;
    animation:ctKen 18s ease-in-out infinite alternate;
  }
  .ct-hero-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to bottom,rgba(28,16,8,.55) 0%,rgba(28,16,8,.22) 42%,rgba(28,16,8,.78) 100%);
  }
  .ct-hero-grain {
    position:absolute; inset:0; opacity:.045;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:200px;
  }
  .ct-hero-content { position:relative; z-index:2; padding:0 24px; }
  .ct-hero-badge {
    display:inline-block; font-family:'Cinzel',serif; font-size:9px;
    letter-spacing:.46em; text-transform:uppercase; color:var(--gold);
    border:1px solid rgba(201,169,110,.42); padding:9px 28px; margin-bottom:30px;
    animation:ctFadeUp .7s ease both; position:relative;
  }
  .ct-hero-badge::before,.ct-hero-badge::after {
    content:''; position:absolute; width:6px; height:6px;
    border:1px solid var(--gold); transform:rotate(45deg); background:rgba(28,16,8,.6);
  }
  .ct-hero-badge::before{top:-4px;left:-4px}
  .ct-hero-badge::after{bottom:-4px;right:-4px}
  .ct-hero-h1 {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(3.2rem,8vw,7.5rem); font-weight:300;
    color:#fff; line-height:1.02; margin-bottom:24px;
    animation:ctFadeUp .9s .13s ease both;
  }
  .ct-hero-h1 .gold-italic {
    font-style:italic; display:block;
    background:linear-gradient(90deg,var(--gold),#f0d090,var(--gold),#c8924a,var(--gold));
    background-size:300% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    animation:ctShimmer 5s linear 1s infinite;
  }
  .ct-hero-sub {
    max-width:560px; margin:0 auto; color:rgba(255,255,255,.68);
    font-size:clamp(.9rem,1.5vw,1.12rem); font-weight:300; line-height:1.9;
    letter-spacing:.03em; animation:ctFadeUp .9s .28s ease both;
  }
  .ct-scroll-cue {
    position:absolute; bottom:34px; left:50%; transform:translateX(-50%);
    z-index:2; display:flex; flex-direction:column; align-items:center; gap:10px;
    animation:ctFadeIn 1s 1.3s both;
  }
  .ct-scroll-track {
    width:1px; height:62px;
    background:linear-gradient(to bottom,rgba(201,169,110,.6),transparent);
    position:relative; overflow:hidden;
  }
  .ct-scroll-track::after {
    content:''; position:absolute; top:0; left:0; width:100%; height:35%;
    background:var(--gold); animation:ctScrollDot 2s ease-in-out infinite;
  }
  .ct-scroll-lbl {
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.4em;
    color:rgba(201,169,110,.65); text-transform:uppercase;
    writing-mode:vertical-lr; transform:rotate(180deg); margin-top:4px;
  }

  /* ── TICKER ── */
  .ct-ticker {
    background:var(--brand-dark); overflow:hidden;
    padding:13px 0; border-top:1px solid rgba(201,169,110,.14);
  }
  .ct-ticker-inner { display:flex; white-space:nowrap; width:max-content; animation:ctTickerScroll 30s linear infinite; }
  .ct-ticker-item  { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em; color:rgba(201,169,110,.52); text-transform:uppercase; padding:0 48px; }
  .ct-ticker-dot   { display:inline-block; width:4px; height:4px; background:var(--gold); transform:rotate(45deg); margin:0 24px; vertical-align:middle; opacity:.45; }

  /* ── STATS ── */
  .ct-stats {
    display:grid; grid-template-columns:repeat(4,1fr);
    background:var(--brand-dark); position:relative; overflow:hidden;
  }
  .ct-stats::before {
    content:''; position:absolute; inset:0;
    background:repeating-linear-gradient(90deg,rgba(201,169,110,.04) 0,rgba(201,169,110,.04) 1px,transparent 1px,transparent 100px);
  }
  .ct-stat { text-align:center; padding:52px 20px; border-right:1px solid rgba(201,169,110,.1); }
  .ct-stat:last-child { border-right:none; }
  .ct-stat-num { font-family:'Cormorant Garamond',serif; font-size:clamp(2.6rem,4.5vw,4rem); color:var(--gold); font-weight:300; display:block; line-height:1; }
  .ct-stat-lbl { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.3em; color:rgba(253,248,243,.38); margin-top:10px; text-transform:uppercase; display:block; }
  @media(max-width:640px){
    .ct-stats{grid-template-columns:1fr 1fr}
    .ct-stat:nth-child(2){border-right:none}
    .ct-stat:nth-child(3){border-right:1px solid rgba(201,169,110,.1);border-top:1px solid rgba(201,169,110,.1)}
    .ct-stat:nth-child(4){border-top:1px solid rgba(201,169,110,.1)}
  }

  /* ── CONTACT MAIN ── */
  .ct-main-sec {
    padding:clamp(80px,9vw,140px) clamp(24px,5vw,64px);
    background:var(--brand-light);
  }
  .ct-main-grid {
    display:grid; grid-template-columns:1fr 1.6fr;
    gap:3px; max-width:1280px; margin:0 auto;
    background:rgba(139,111,71,.06);
    border:1px solid rgba(139,111,71,.14);
  }
  @media(max-width:900px){ .ct-main-grid{grid-template-columns:1fr} }

  /* ── INFO PANEL (left) ── */
  .ct-info-panel {
    background:var(--brand-dark); padding:clamp(48px,6vw,72px) clamp(32px,4vw,52px);
    position:relative; overflow:hidden;
  }
  .ct-info-panel::before {
    content:'CONTACT'; position:absolute; bottom:-20px; left:-10px;
    font-family:'Cormorant Garamond',serif; font-size:130px; font-weight:700;
    color:rgba(201,169,110,.035); white-space:nowrap; pointer-events:none; letter-spacing:-.02em;
  }
  .ct-info-img {
    width:100%; aspect-ratio:4/3; object-fit:cover;
    display:block; margin-bottom:40px;
    filter:saturate(.8) contrast(1.06);
    animation:ctBorderGlow 4s ease-in-out infinite;
    border:1px solid rgba(201,169,110,.2);
  }
  .ct-info-block { margin-bottom:36px; position:relative; z-index:1; }
  .ct-info-block:last-of-type { margin-bottom:0; }
  .ct-info-label {
    font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.42em;
    text-transform:uppercase; color:var(--gold);
    border-bottom:1px solid rgba(201,169,110,.18); padding-bottom:10px; margin-bottom:16px; display:block;
  }
  .ct-info-value {
    font-family:'Cormorant Garamond',serif; font-size:1.15rem;
    color:rgba(253,248,243,.82); font-weight:300; line-height:1.75;
  }
  .ct-info-value a {
    color:rgba(253,248,243,.82); text-decoration:none;
    transition:color .3s ease; display:block;
  }
  .ct-info-value a:hover { color:var(--gold); }
  .ct-info-hours { font-size:.85rem; color:rgba(253,248,243,.45); font-weight:300; line-height:1.85; font-family:'Jost',sans-serif; }

  /* Social row */
  .ct-social-row { display:flex; gap:12px; margin-top:36px; position:relative; z-index:1; }
  .ct-social-btn {
    width:40px; height:40px; border:1px solid rgba(201,169,110,.25);
    display:flex; align-items:center; justify-content:center;
    transition:all .35s ease; flex-shrink:0;
  }
  .ct-social-btn:hover { background:rgba(201,169,110,.12); border-color:var(--gold); }
  .ct-social-btn svg { stroke:rgba(201,169,110,.6); transition:stroke .3s ease; }
  .ct-social-btn:hover svg { stroke:var(--gold); }

  /* ── FORM PANEL (right) ── */
  .ct-form-panel { background:#fff; padding:clamp(48px,6vw,72px) clamp(32px,4vw,56px); }

  /* Form inputs */
  .ct-field-group { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px; }
  @media(max-width:600px){ .ct-field-group{grid-template-columns:1fr} }
  .ct-field { display:flex; flex-direction:column; margin-bottom:20px; }
  .ct-field-full { margin-bottom:20px; }
  .ct-label {
    font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.38em;
    text-transform:uppercase; color:var(--brand-dark); margin-bottom:10px; display:block;
  }
  .ct-input, .ct-textarea, .ct-select {
    width:100%; border:none; border-bottom:1.5px solid rgba(139,111,71,.22);
    padding:12px 0; font-family:'Jost',sans-serif; font-size:.95rem;
    color:var(--brand-dark); background:transparent; outline:none;
    transition:border-color .35s ease; font-weight:300;
    appearance:none; -webkit-appearance:none;
  }
  .ct-input::placeholder, .ct-textarea::placeholder { color:rgba(90,65,45,.35); font-weight:300; }
  .ct-input:focus, .ct-textarea:focus, .ct-select:focus { border-bottom-color:var(--gold); }
  .ct-textarea { resize:none; padding-top:12px; line-height:1.7; }
  .ct-select { cursor:pointer; }
  .ct-field-underline {
    height:1px; background:var(--gold); transform:scaleX(0);
    transform-origin:left; transition:transform .4s ease; margin-top:-1px;
  }
  .ct-input:focus ~ .ct-field-underline,
  .ct-textarea:focus ~ .ct-field-underline,
  .ct-select:focus ~ .ct-field-underline { transform:scaleX(1); }

  /* Submit button */
  .ct-submit-btn {
    width:100%; background:var(--brand-dark); color:var(--brand-light);
    padding:18px 32px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.38em; text-transform:uppercase; font-weight:600;
    border:none; cursor:pointer; position:relative; overflow:hidden;
    transition:all .45s cubic-bezier(.23,1,.32,1); margin-top:8px;
    box-shadow:0 6px 24px rgba(74,55,40,.2);
  }
  .ct-submit-btn::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg,var(--brand) 0%,var(--gold) 100%);
    opacity:0; transition:opacity .4s ease;
  }
  .ct-submit-btn:hover { transform:translateY(-3px); box-shadow:0 14px 40px rgba(74,55,40,.3); }
  .ct-submit-btn:hover::before { opacity:1; }
  .ct-submit-btn span { position:relative; z-index:1; }

  /* Success state */
  .ct-success {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    text-align:center; padding:40px 20px; min-height:480px;
    animation:ctSuccessScale .7s cubic-bezier(.23,1,.32,1) both;
  }
  .ct-success-icon {
    width:80px; height:80px; border:1.5px solid var(--gold);
    display:flex; align-items:center; justify-content:center; margin-bottom:32px;
    position:relative;
  }
  .ct-success-icon::after {
    content:''; position:absolute; inset:-10px;
    border:1px solid rgba(201,169,110,.2);
    animation:ctPulseRing 2.5s ease-out infinite;
  }
  .ct-success-check {
    stroke-dasharray:100; stroke-dashoffset:100;
    animation:ctCheckDraw .7s .3s ease both;
  }
  .ct-success-h3 {
    font-family:'Cormorant Garamond',serif; font-size:2.4rem;
    color:var(--brand-dark); font-weight:300; margin-bottom:14px;
  }
  .ct-success-p { font-size:.95rem; color:var(--muted); font-weight:300; line-height:1.85; max-width:340px; margin-bottom:32px; }
  .ct-success-reset {
    font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.36em;
    text-transform:uppercase; color:var(--brand); background:none; border:none;
    cursor:pointer; border-bottom:1px solid transparent;
    transition:all .3s ease; padding-bottom:3px;
  }
  .ct-success-reset:hover { color:var(--brand-dark); border-bottom-color:var(--brand-dark); }

  /* ── VENUES STRIP ── */
  .ct-venues-sec { padding:clamp(80px,9vw,130px) clamp(24px,5vw,64px); background:var(--smoke); }
  .ct-venues-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:3px; max-width:1200px; margin:0 auto; }
  .ct-venue-card { position:relative; overflow:hidden; min-height:300px; display:flex; align-items:flex-end; cursor:pointer; }
  .ct-venue-img  { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform .8s cubic-bezier(.23,1,.32,1); filter:saturate(.8) contrast(1.05); }
  .ct-venue-card:hover .ct-venue-img { transform:scale(1.07); }
  .ct-venue-grad { position:absolute; inset:0; background:linear-gradient(to top,rgba(28,16,8,.88) 0%,rgba(28,16,8,.2) 60%,transparent 100%); transition:opacity .5s ease; }
  .ct-venue-card:hover .ct-venue-grad { opacity:.96; }
  .ct-venue-info { position:relative; z-index:1; padding:28px; }
  .ct-venue-tag  { font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.38em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:6px; }
  .ct-venue-name { font-family:'Cormorant Garamond',serif; font-size:1.6rem; color:#fff; font-weight:300; line-height:1.15; }
  .ct-venue-cap  { font-size:.78rem; color:rgba(253,248,243,.42); margin-top:5px; font-weight:300; }
  .ct-venue-arrow {
    position:absolute; top:24px; right:24px; width:38px; height:38px;
    border:1px solid rgba(201,169,110,.3); display:flex; align-items:center; justify-content:center;
    opacity:0; transform:translateY(8px); transition:all .4s ease; z-index:2;
  }
  .ct-venue-card:hover .ct-venue-arrow { opacity:1; transform:translateY(0); }

  /* ── FAQ ── */
  .ct-faq-sec { padding:clamp(80px,9vw,130px) clamp(24px,5vw,64px); background:var(--brand-dark); position:relative; overflow:hidden; }
  .ct-faq-sec::before {
    content:'"?'; position:absolute; top:-40px; right:-10px;
    font-family:'Cormorant Garamond',serif; font-size:380px;
    color:rgba(201,169,110,.03); line-height:1; pointer-events:none; font-weight:700;
  }
  .ct-faq-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; max-width:1100px; margin:0 auto; position:relative; z-index:1; }
  @media(max-width:768px){ .ct-faq-grid{grid-template-columns:1fr} }
  .ct-faq-item {
    border:1px solid rgba(201,169,110,.1); padding:36px 32px;
    background:rgba(255,255,255,.03); transition:all .4s ease; position:relative;
  }
  .ct-faq-item::before {
    content:''; position:absolute; top:0; left:0; right:0; height:1.5px;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);
    transform:scaleX(0); transform-origin:left; transition:transform .5s ease;
  }
  .ct-faq-item:hover { background:rgba(255,255,255,.07); transform:translateY(-4px); border-color:rgba(201,169,110,.22); }
  .ct-faq-item:hover::before { transform:scaleX(1); }
  .ct-faq-q { font-family:'Cormorant Garamond',serif; font-size:1.2rem; color:var(--gold); font-weight:400; margin-bottom:12px; }
  .ct-faq-a { font-size:.875rem; color:rgba(253,248,243,.5); font-weight:300; line-height:1.82; }

  /* ── MOSAIC ── */
  .ct-mosaic { display:grid; grid-template-columns:repeat(5,1fr); grid-template-rows:repeat(2,220px); gap:3px; }
  .ct-mosaic-item:nth-child(1){ grid-column:span 2; grid-row:span 2; }
  .ct-mosaic-item:nth-child(5){ grid-column:span 2; }
  .ct-mosaic-item { overflow:hidden; position:relative; }
  .ct-mosaic-img  { width:100%; height:100%; object-fit:cover; display:block; transition:transform .8s cubic-bezier(.23,1,.32,1),filter .5s ease; filter:saturate(.7) contrast(1.06); }
  .ct-mosaic-item:hover .ct-mosaic-img { transform:scale(1.08); filter:saturate(1.05) contrast(1.02); }
  .ct-mosaic-item::after { content:''; position:absolute; inset:0; background:rgba(201,169,110,0); transition:background .4s ease; }
  .ct-mosaic-item:hover::after { background:rgba(201,169,110,.06); }
  @media(max-width:640px){
    .ct-mosaic{grid-template-columns:1fr 1fr;grid-template-rows:repeat(4,150px)}
    .ct-mosaic-item:nth-child(1){grid-column:span 2;grid-row:span 1}
    .ct-mosaic-item:nth-child(5){grid-column:span 2}
  }

  /* ── CTA ── */
  .ct-cta-sec {
    background:var(--brand-dark); padding:clamp(90px,10vw,150px) clamp(24px,5vw,64px);
    text-align:center; position:relative; overflow:hidden;
    border-top:1px solid rgba(201,169,110,.14);
  }
  .ct-cta-ring { position:absolute; border-radius:50%; border:1px solid rgba(201,169,110,.07); top:50%; left:50%; pointer-events:none; }
  .ct-cta-h2 { font-family:'Cormorant Garamond',serif; font-size:clamp(2.4rem,5.5vw,4.8rem); font-weight:300; color:#fff; line-height:1.1; margin-bottom:20px; position:relative; z-index:1; }
  .ct-cta-h2 em { font-style:italic; color:var(--gold); }
  .ct-cta-sub { max-width:500px; margin:0 auto 48px; color:rgba(255,255,255,.5); font-size:.98rem; font-weight:300; line-height:1.9; position:relative; z-index:1; }
  .ct-cta-btns { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; position:relative; z-index:1; }
  .ct-btn-primary {
    background:var(--brand); color:var(--brand-light);
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none; position:relative; overflow:hidden;
    transition:all .45s cubic-bezier(.23,1,.32,1); box-shadow:0 6px 28px rgba(139,111,71,.4);
  }
  .ct-btn-primary::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--gold) 0%,var(--brand-dark) 100%); opacity:0; transition:opacity .4s ease; }
  .ct-btn-primary:hover  { transform:translateY(-3px); box-shadow:0 14px 44px rgba(139,111,71,.5); }
  .ct-btn-primary:hover::after { opacity:1; }
  .ct-btn-primary span   { position:relative; z-index:1; }
  .ct-btn-outline {
    border:1.5px solid rgba(255,255,255,.38); color:#fff;
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none; transition:all .4s ease;
  }
  .ct-btn-outline:hover { border-color:var(--gold); color:var(--gold); transform:translateY(-3px); }
  .ct-est { margin-top:72px; opacity:.27; }
  .ct-est p { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em; color:rgba(253,248,243,.9); text-transform:uppercase; margin-top:14px; }
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
  const map = { up:'ctFadeUp', left:'ctSlideL', right:'ctSlideR', plain:'ctFadeIn' };
  return (
    <div ref={ref} className={className} style={{
      animation: inView ? `${map[dir]} .88s ${delay}s cubic-bezier(.23,1,.32,1) both` : 'none',
      opacity: inView ? undefined : 0,
    }}>{children}</div>
  );
}

function Ornament() {
  return (
    <div className="ct-ornament">
      <div className="ct-ornament-line" />
      <div className="ct-ornament-gem" />
      <div className="ct-ornament-line r" />
    </div>
  );
}

function SectionHeader({ eyebrow, title, light = false }) {
  return (
    <div style={{ textAlign:'center', marginBottom:72 }}>
      <span className="ct-eyebrow" style={light ? { color:'var(--gold)' } : {}}>{eyebrow}</span>
      <Ornament />
      <h2 style={{
        fontFamily:"'Cormorant Garamond',serif",
        fontSize:'clamp(2.4rem,4.5vw,3.8rem)',
        fontWeight:300, lineHeight:1.12,
        color: light ? '#fff' : 'var(--brand-dark)',
      }} dangerouslySetInnerHTML={{ __html: title }} />
    </div>
  );
}

function TiltCard({ children, className }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
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
    <div ref={ref} className="ct-stat">
      <span className="ct-stat-num">{val}{suffix}</span>
      <span className="ct-stat-lbl">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const tickerItems = ['Get In Touch','Wedding Chapter','Book Your Date','Studio Visits','Banquet Enquiries','Limited Dates','Premium Collective','Consultation Available'];

const venues = [
  { img:'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80', tag:'Flagship Hall',   name:'The Grand Rosewood', cap:'Up to 1,200 guests' },
  { img:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', tag:'Rooftop Garden',  name:'Sky Garden Terrace',  cap:'Up to 300 guests' },
  { img:'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80', tag:'Heritage Estate', name:'The Ivory Manor',      cap:'Up to 500 guests' },
];

const faqs = [
  { q:'How far in advance should I book?',             a:'We recommend booking at least 12–18 months before your wedding date. Our most popular weekends fill up quickly, and we take on a limited number of events per year to maintain quality.' },
  { q:'Do you offer site visits before booking?',      a:'Absolutely. We encourage every couple to visit our studio and tour shortlisted venues before committing. We offer no-obligation consultations Monday through Friday.' },
  { q:'What is included in the base package?',         a:'Our base package includes a full venue consultation, décor brief, catering coordination, and a dedicated event manager on your wedding day from start to finish.' },
  { q:'Can we customise our banquet package?',         a:'Every package is bespoke. We work around your vision, guest count, cuisine preferences, and budget to build something that feels entirely and irreversibly yours.' },
  { q:'Do you handle destination weddings?',           a:'Yes. We have managed weddings across Rajasthan, Goa, Kerala, and internationally in Bali and Dubai. Our coordination team handles all logistics end to end.' },
  { q:'What is your payment and refund policy?',       a:'We require a 30% holding deposit to secure your date, with milestone payments thereafter. Our team will walk you through the full agreement during your consultation.' },
];

const mosaicImgs = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=75',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=700&q=75',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=75',
  'https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=700&q=75',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=75',
];

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT  —  original state & logic untouched
───────────────────────────────────────────────────────────── */
export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  /* original handler — unchanged */
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <>
      <style>{STYLES}</style>

      {/* ══ HERO ══ */}
      <section className="ct-hero">
        <div className="ct-hero-bg" style={{ backgroundImage:"url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85')" }} />
        <div className="ct-hero-overlay" />
        <div className="ct-hero-grain" />
        <div className="ct-hero-content">
          <div className="ct-hero-badge">We Would Love To Hear From You</div>
          <h1 className="ct-hero-h1">
            Get In Touch
            <span className="gold-italic">Begin Your Chapter</span>
          </h1>
          <p className="ct-hero-sub">
            Whether you have a question about our services or you're ready to start planning your dream wedding, our team is ready to listen and guide you.
          </p>
        </div>
        <div className="ct-scroll-cue">
          <div className="ct-scroll-track" />
          <span className="ct-scroll-lbl">Scroll</span>
        </div>
      </section>

      {/* ══ TICKER ══ */}
      <div className="ct-ticker">
        <div className="ct-ticker-inner">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="ct-ticker-item">{item}<span className="ct-ticker-dot" /></span>
          ))}
        </div>
      </div>

      {/* ══ STATS ══ */}
      <div className="ct-stats">
        <StatItem number={500}  suffix="+"    label="Weddings Hosted" />
        <StatItem number={24}   suffix="hr"   label="Response Time" />
        <StatItem number={98}   suffix="%"    label="Happy Couples" />
        <StatItem number={8}    suffix=" yrs" label="of Excellence" />
      </div>

      {/* ══ MAIN CONTACT ══ */}
      <section className="ct-main-sec">
        <Reveal>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <span className="ct-eyebrow">Reach Out</span>
            <Ornament />
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2.4rem,4.5vw,3.8rem)', fontWeight:300, color:'var(--brand-dark)', lineHeight:1.12 }}>
              Let's Create <em style={{ fontStyle:'italic', color:'var(--brand)' }}>Something Beautiful</em>
            </h2>
          </div>
        </Reveal>

        <div className="ct-main-grid">

          {/* ── INFO PANEL ── */}
          <Reveal dir="left">
            <div className="ct-info-panel">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80"
                alt="Our studio venue"
                className="ct-info-img"
                loading="lazy"
              />

              <div className="ct-info-block">
                <span className="ct-info-label">Studio Office</span>
                <p className="ct-info-value">
                  123 Wedding Lane,<br />
                  Love City, Romance State<br />
                  560001
                </p>
              </div>

              <div className="ct-info-block">
                <span className="ct-info-label">Contact Details</span>
                <p className="ct-info-value">
                  <a href="mailto:hello@theweddingschapter.com">hello@theweddingschapter.com</a>
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </p>
              </div>

              <div className="ct-info-block">
                <span className="ct-info-label">Office Hours</span>
                <p className="ct-info-hours">
                  Monday – Friday &nbsp; 10am – 6pm<br />
                  Weekends &nbsp; By Appointment Only
                </p>
              </div>

              {/* Social icons (SVG only — no emojis) */}
              <div className="ct-social-row">
                {[
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></svg>,
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>,
                ].map((icon, i) => (
                  <button key={i} className="ct-social-btn" aria-label="Social">
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ── FORM PANEL ── */}
          <Reveal dir="right" delay={0.08}>
            <div className="ct-form-panel">
              {isSubmitted ? (
                /* ── SUCCESS STATE (original logic preserved) ── */
                <div className="ct-success">
                  <div className="ct-success-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                      <polyline className="ct-success-check" points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="ct-success-h3">Thank You</h3>
                  <p className="ct-success-p">Your message has been elegantly delivered. Our team will reach out to you within 24 hours.</p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="ct-success-reset"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                /* ── FORM (original fields, names, types — all unchanged) ── */
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom:36 }}>
                    <span className="ct-eyebrow" style={{ color:'var(--brand)' }}>Your Enquiry</span>
                    <Ornament />
                    <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.9rem', fontWeight:300, color:'var(--brand-dark)', marginBottom:8 }}>
                      Tell Us About Your Plans
                    </h3>
                    <p style={{ fontSize:'.88rem', color:'var(--muted)', fontWeight:300, lineHeight:1.8 }}>
                      We reply to all enquiries within 24 hours. For urgent requests, please call us directly.
                    </p>
                  </div>

                  <div className="ct-field-group">
                    <div>
                      <label className="ct-label">First Name</label>
                      <input type="text" required className="ct-input" placeholder="Priya" />
                      <div className="ct-field-underline" />
                    </div>
                    <div>
                      <label className="ct-label">Last Name</label>
                      <input type="text" required className="ct-input" placeholder="Sharma" />
                      <div className="ct-field-underline" />
                    </div>
                  </div>

                  <div className="ct-field-group">
                    <div>
                      <label className="ct-label">Email Address</label>
                      <input type="email" required className="ct-input" placeholder="hello@example.com" />
                      <div className="ct-field-underline" />
                    </div>
                    <div>
                      <label className="ct-label">Wedding Date (Optional)</label>
                      <input type="date" className="ct-input" style={{ color:'var(--muted)' }} />
                      <div className="ct-field-underline" />
                    </div>
                  </div>

                  <div className="ct-field-full">
                    <label className="ct-label">Venue Interest</label>
                    <select className="ct-select" style={{ color:'var(--brand-dark)' }}>
                      <option value="">Select a venue...</option>
                      <option>The Grand Rosewood — up to 1,200 guests</option>
                      <option>Sky Garden Terrace — up to 300 guests</option>
                      <option>The Ivory Manor — up to 500 guests</option>
                      <option>Not sure yet — advise me</option>
                    </select>
                    <div className="ct-field-underline" />
                  </div>

                  <div className="ct-field-full">
                    <label className="ct-label">How Can We Help You?</label>
                    <textarea rows="5" required placeholder="Tell us about your plans, guest count, style, and any special requests..." className="ct-textarea" />
                    <div className="ct-field-underline" />
                  </div>

                  <button type="submit" className="ct-submit-btn">
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </Reveal>

        </div>
      </section>

      {/* ══ VENUE ENQUIRY STRIP ══ */}
      <section className="ct-venues-sec">
        <Reveal>
          <SectionHeader eyebrow="Our Venues" title="Enquire About <em>These Spaces</em>" />
        </Reveal>
        <div className="ct-venues-grid">
          {venues.map(({ img, tag, name, cap }, i) => (
            <Reveal key={i} delay={i * 0.09} dir="plain">
              <div className="ct-venue-card">
                <img src={img} alt={name} className="ct-venue-img" loading="lazy" />
                <div className="ct-venue-grad" />
                <div className="ct-venue-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
                <div className="ct-venue-info">
                  <span className="ct-venue-tag">{tag}</span>
                  <h3 className="ct-venue-name">{name}</h3>
                  <p className="ct-venue-cap">{cap}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ GALLERY MOSAIC ══ */}
      <div className="ct-mosaic">
        {mosaicImgs.map((src, i) => (
          <div className="ct-mosaic-item" key={i}>
            <img src={src} alt="" className="ct-mosaic-img" loading="lazy" />
          </div>
        ))}
      </div>

      {/* ══ FAQ ══ */}
      <section className="ct-faq-sec">
        <Reveal>
          <SectionHeader eyebrow="Common Questions" title="<span style='color:#fff'>Frequently</span> <em>Asked</em>" light />
        </Reveal>
        <div className="ct-faq-grid">
          {faqs.map(({ q, a }, i) => (
            <Reveal key={i} delay={i * 0.07} dir="plain">
              <TiltCard className="ct-faq-item">
                <h3 className="ct-faq-q">{q}</h3>
                <p className="ct-faq-a">{a}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="ct-cta-sec">
        {[200, 380, 560, 740].map((size, i) => (
          <div key={i} className="ct-cta-ring" style={{
            width:size, height:size, marginLeft:-size/2, marginTop:-size/2,
            animation:`ctPulseRing ${3+i*.7}s ${i*.8}s ease-out infinite`,
          }} />
        ))}
        <Reveal>
          <span className="ct-eyebrow" style={{ color:'var(--gold)' }}>Limited Dates Available</span>
          <Ornament />
          <h2 className="ct-cta-h2">
            Your Dream Wedding<br /><em>Starts Here</em>
          </h2>
          <p className="ct-cta-sub">
            We take on a limited number of weddings each year. Secure your date before it's gone — speak to our team today.
          </p>
          <div className="ct-cta-btns">
            <a href="#form" className="ct-btn-primary"><span>Send An Enquiry</span></a>
            <a href="tel:+919876543210" className="ct-btn-outline">Call Us Now</a>
          </div>
          <div className="ct-est">
            <Ornament />
            <p>Est. 2017 &nbsp;&bull;&nbsp; Mumbai, India &nbsp;&bull;&nbsp; Wedding Chapter Collective</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}