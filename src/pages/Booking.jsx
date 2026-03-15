import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from '@tanstack/react-router';

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
    --crimson:     #5C0A16;
    --crimson-dim: rgba(92,10,22,0.06);
    --ink:         #1C1008;
  }

  @keyframes bkFadeUp   { from{opacity:0;transform:translateY(52px)} to{opacity:1;transform:translateY(0)} }
  @keyframes bkFadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes bkSlideL   { from{opacity:0;transform:translateX(-56px)} to{opacity:1;transform:translateX(0)} }
  @keyframes bkSlideR   { from{opacity:0;transform:translateX(56px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes bkShimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes bkLineGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes bkKen      { 0%{transform:scale(1.04)} 100%{transform:scale(1.1) translateX(-1%)} }
  @keyframes bkScrollDot{
    0%,100%{transform:translateY(0);opacity:1}
    60%{transform:translateY(14px);opacity:0}
    61%{transform:translateY(-4px);opacity:0}
  }
  @keyframes bkRotateGem{ 0%,100%{transform:rotate(45deg) scale(1)} 50%{transform:rotate(45deg) scale(1.4)} }
  @keyframes bkPulseRing{
    0%{transform:translate(-50%,-50%) scale(1);opacity:.5}
    100%{transform:translate(-50%,-50%) scale(2.6);opacity:0}
  }
  @keyframes bkSpinRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes bkTickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes bkStepPop  { 0%{opacity:0;transform:scale(.88) translateY(12px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes bkCheckDraw{ from{stroke-dashoffset:60} to{stroke-dashoffset:0} }
  @keyframes bkTopBar   { from{transform:scaleX(0);transform-origin:left} to{transform:scaleX(1);transform-origin:left} }
  @keyframes bkGlow     { 0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,0)} 50%{box-shadow:0 0 0 8px rgba(201,169,110,0.1)} }

  /* ── Utility ── */
  .bk-eyebrow{ display:block; font-family:'Cinzel',serif; font-size:9.5px; letter-spacing:.44em; text-transform:uppercase; color:var(--gold); margin-bottom:16px; }
  .bk-ornament{ display:flex; align-items:center; gap:12px; justify-content:center; margin:0 auto 22px; }
  .bk-ornament-line{ flex:1; max-width:68px; height:1px; background:linear-gradient(90deg,transparent,var(--gold)); transform-origin:left; animation:bkLineGrow .8s ease both; }
  .bk-ornament-line.r{ background:linear-gradient(90deg,var(--gold),transparent); transform-origin:right; }
  .bk-ornament-gem{ width:7px; height:7px; background:var(--gold); transform:rotate(45deg); animation:bkRotateGem 4s ease-in-out infinite; }

  /* ── HERO ── */
  .bk-hero{
    position:relative; min-height:58vh;
    display:flex; align-items:center; justify-content:center;
    text-align:center; overflow:hidden;
  }
  .bk-hero-bg{ position:absolute; inset:0; background-size:cover; background-position:center 38%; animation:bkKen 18s ease-in-out infinite alternate; }
  .bk-hero-overlay{ position:absolute; inset:0; background:linear-gradient(to bottom,rgba(92,10,22,.72) 0%,rgba(92,10,22,.48) 45%,rgba(92,10,22,.82) 100%); }
  .bk-hero-grain{ position:absolute; inset:0; opacity:.04; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size:200px; }
  .bk-hero-content{ position:relative; z-index:2; padding:100px 24px 80px; }
  .bk-hero-pill{ display:inline-block; background:var(--gold); color:var(--crimson); font-family:'Cinzel',serif; font-size:8px; letter-spacing:.42em; text-transform:uppercase; font-weight:700; padding:8px 22px; margin-bottom:28px; animation:bkFadeUp .7s ease both; }
  .bk-hero-h1{
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(3.2rem,8vw,7rem); font-weight:300; color:#fff;
    line-height:1.02; margin-bottom:20px; animation:bkFadeUp .9s .12s ease both;
  }
  .bk-hero-h1 .gold-italic{
    font-style:italic; display:block;
    background:linear-gradient(90deg,var(--gold),#f0d090,var(--gold),#c8924a,var(--gold));
    background-size:300% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    animation:bkShimmer 5s linear 1s infinite;
  }
  .bk-hero-sub{ max-width:520px; margin:0 auto; color:rgba(255,255,255,.68); font-size:clamp(.9rem,1.5vw,1.1rem); font-weight:300; line-height:1.9; animation:bkFadeUp .9s .26s ease both; }
  .bk-scroll-cue{ position:absolute; bottom:32px; left:50%; transform:translateX(-50%); z-index:2; display:flex; flex-direction:column; align-items:center; gap:9px; animation:bkFadeIn 1s 1.2s both; }
  .bk-scroll-track{ width:1px; height:56px; background:linear-gradient(to bottom,rgba(201,169,110,.6),transparent); position:relative; overflow:hidden; }
  .bk-scroll-track::after{ content:''; position:absolute; top:0; left:0; width:100%; height:35%; background:var(--gold); animation:bkScrollDot 2s ease-in-out infinite; }
  .bk-scroll-lbl{ font-family:'Cinzel',serif; font-size:8px; letter-spacing:.4em; color:rgba(201,169,110,.65); text-transform:uppercase; writing-mode:vertical-lr; transform:rotate(180deg); }

  /* ── TICKER ── */
  .bk-ticker{ background:var(--crimson); overflow:hidden; padding:13px 0; }
  .bk-ticker-inner{ display:flex; white-space:nowrap; width:max-content; animation:bkTickerScroll 28s linear infinite; }
  .bk-ticker-item{ font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em; color:rgba(212,175,55,.55); text-transform:uppercase; padding:0 48px; }
  .bk-ticker-dot{ display:inline-block; width:4px; height:4px; background:#D4AF37; transform:rotate(45deg); margin:0 24px; vertical-align:middle; opacity:.45; }

  /* ── MAIN LAYOUT ── */
  .bk-outer{ background:var(--brand-light); padding-bottom:clamp(80px,10vw,140px); }
  .bk-inner{ max-width:960px; margin:0 auto; padding:0 clamp(16px,4vw,40px); }

  /* ── STEPPER ── */
  .bk-stepper-wrap{
    background:#fff; border:1px solid rgba(92,10,22,.1);
    padding:28px 36px; display:flex; justify-content:space-between;
    align-items:center; gap:8px; overflow-x:auto;
    margin-top:-40px; position:relative; z-index:10;
    box-shadow:0 16px 48px rgba(92,10,22,.12);
  }
  .bk-step-item{ display:flex; align-items:center; gap:10px; flex-shrink:0; }
  .bk-step-num{
    width:36px; height:36px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-family:'Cinzel',serif; font-size:10px; font-weight:700;
    transition:all .5s ease; flex-shrink:0; position:relative;
  }
  .bk-step-num.active{ background:var(--crimson); color:#fff; box-shadow:0 4px 16px rgba(92,10,22,.3); }
  .bk-step-num.done{ background:var(--gold); color:var(--crimson); }
  .bk-step-num.inactive{ background:rgba(139,111,71,.08); color:rgba(139,111,71,.4); }
  .bk-step-num.done::after{
    content:''; position:absolute; inset:-4px; border:1px solid rgba(201,169,110,.3);
    border-radius:50%;
  }
  .bk-step-label{ font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.3em; text-transform:uppercase; font-weight:600; transition:color .4s ease; white-space:nowrap; }
  .bk-step-label.active{ color:var(--crimson); }
  .bk-step-label.done{ color:var(--gold); }
  .bk-step-label.inactive{ color:rgba(139,111,71,.3); }
  .bk-step-connector{ height:1px; width:clamp(20px,4vw,52px); flex-shrink:0; transition:background .5s ease; }
  .bk-step-connector.done{ background:var(--gold); }
  .bk-step-connector.inactive{ background:rgba(139,111,71,.12); }

  /* ── FORM CARD ── */
  .bk-card{
    background:#fff; border:1px solid rgba(139,111,71,.12);
    padding:clamp(36px,5vw,64px); margin-top:24px;
    box-shadow:0 24px 72px rgba(74,55,40,.1);
    min-height:520px;
    animation:bkStepPop .55s cubic-bezier(.23,1,.32,1) both;
  }
  .bk-card-step-hdr{ display:flex; align-items:center; gap:16px; margin-bottom:40px; }
  .bk-card-step-icon{ width:44px; height:44px; background:var(--crimson); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .bk-card-step-num-badge{ font-family:'Cinzel',serif; font-size:10px; letter-spacing:.3em; color:var(--gold); }
  .bk-card-step-title{ font-family:'Cormorant Garamond',serif; font-size:clamp(1.6rem,3vw,2.2rem); font-weight:300; color:var(--brand-dark); }

  /* ── STATUS MSG ── */
  .bk-status{ padding:14px 20px; font-family:'Jost',sans-serif; font-size:.85rem; margin-bottom:28px; text-align:center; border:1px solid; font-weight:300; }
  .bk-status.error{ background:rgba(180,50,50,.04); color:#8b2020; border-color:rgba(180,50,50,.2); }
  .bk-status.success{ background:rgba(139,111,71,.05); color:var(--brand-dark); border-color:var(--gold-dim); }

  /* ── PACKAGES ── */
  .bk-pkg-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; margin-bottom:40px; }
  .bk-pkg-card{
    border:1.5px solid rgba(139,111,71,.12); padding:36px 28px;
    cursor:pointer; position:relative; text-align:center;
    transition:all .4s cubic-bezier(.23,1,.32,1);
    background:#fff;
  }
  .bk-pkg-card:hover{ transform:translateY(-5px); box-shadow:0 20px 56px rgba(92,10,22,.1); border-color:rgba(92,10,22,.2); }
  .bk-pkg-card.selected{ border-color:var(--crimson); background:var(--crimson-dim); box-shadow:0 12px 40px rgba(92,10,22,.14); }
  .bk-pkg-card.selected::before{ content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--crimson); animation:bkTopBar .4s ease both; }
  .bk-pkg-popular{ position:absolute; top:-12px; left:50%; transform:translateX(-50%); background:var(--gold); color:var(--crimson); font-family:'Cinzel',serif; font-size:7.5px; letter-spacing:.35em; padding:5px 18px; text-transform:uppercase; font-weight:700; white-space:nowrap; }
  .bk-pkg-check{ position:absolute; top:12px; right:12px; width:22px; height:22px; background:var(--crimson); display:flex; align-items:center; justify-content:center; }
  .bk-pkg-check svg{ stroke:#fff; }
  .bk-pkg-name{ font-family:'Cormorant Garamond',serif; font-size:1.5rem; color:var(--brand-dark); font-weight:400; margin-bottom:6px; }
  .bk-pkg-desc{ font-family:'Cinzel',serif; font-size:8px; letter-spacing:.3em; color:var(--muted); text-transform:uppercase; margin-bottom:20px; display:block; min-height:28px; }
  .bk-pkg-price{ font-family:'Cormorant Garamond',serif; font-size:2.6rem; color:var(--crimson); font-weight:300; line-height:1; }

  /* ── ADDONS ── */
  .bk-addons-label{ font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.38em; text-transform:uppercase; color:var(--muted); margin-bottom:18px; display:block; }
  .bk-addons-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:12px; }
  .bk-addon-item{
    display:flex; align-items:flex-start; gap:12px; padding:18px 16px;
    border:1px solid rgba(139,111,71,.1); cursor:pointer; transition:all .35s ease;
    background:#fff;
  }
  .bk-addon-item:hover{ border-color:rgba(92,10,22,.2); background:var(--crimson-dim); }
  .bk-addon-item.checked{ border-color:var(--crimson); background:var(--crimson-dim); }
  .bk-addon-checkbox{ width:16px; height:16px; border:1.5px solid rgba(92,10,22,.3); display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px; transition:all .3s ease; }
  .bk-addon-item.checked .bk-addon-checkbox{ background:var(--crimson); border-color:var(--crimson); }
  .bk-addon-name{ font-family:'Jost',sans-serif; font-size:.84rem; color:var(--brand-dark); font-weight:400; margin-bottom:3px; }
  .bk-addon-price{ font-family:'Cinzel',serif; font-size:8px; letter-spacing:.28em; color:var(--gold); text-transform:uppercase; }

  /* ── PRICE TICKER ── */
  .bk-price-bar{
    background:var(--crimson); color:#fff; padding:18px 28px;
    display:flex; justify-content:space-between; align-items:center;
    margin:-1px; margin-top:32px; position:relative; overflow:hidden;
  }
  .bk-price-bar::before{ content:''; position:absolute; inset:0; background:repeating-linear-gradient(90deg,rgba(212,175,55,.06) 0,rgba(212,175,55,.06) 1px,transparent 1px,transparent 80px); }
  .bk-price-bar-lbl{ font-family:'Cinzel',serif; font-size:9px; letter-spacing:.38em; text-transform:uppercase; color:rgba(255,255,255,.6); position:relative; z-index:1; }
  .bk-price-bar-val{ font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:300; color:var(--gold); position:relative; z-index:1; }

  /* ── FORM FIELDS ── */
  .bk-form-grid-2{ display:grid; grid-template-columns:1fr 1fr; gap:24px; }
  @media(max-width:600px){ .bk-form-grid-2{grid-template-columns:1fr} }
  .bk-field{ margin-bottom:24px; }
  .bk-field-full{ margin-bottom:24px; }
  .bk-label{ font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.38em; text-transform:uppercase; color:var(--brand-dark); display:block; margin-bottom:10px; }
  .bk-input,.bk-textarea,.bk-select{
    width:100%; border:none; border-bottom:1.5px solid rgba(139,111,71,.22);
    padding:12px 0; font-family:'Jost',sans-serif; font-size:.95rem;
    color:var(--brand-dark); background:transparent; outline:none;
    transition:border-color .35s ease; font-weight:300; appearance:none; -webkit-appearance:none;
  }
  .bk-input::placeholder,.bk-textarea::placeholder{ color:rgba(90,65,45,.3); font-weight:300; }
  .bk-input:focus,.bk-textarea:focus,.bk-select:focus{ border-bottom-color:var(--crimson); }
  .bk-textarea{ resize:none; padding-top:12px; line-height:1.7; }
  .bk-field-bar{ height:1px; background:var(--crimson); transform:scaleX(0); transform-origin:left; transition:transform .4s ease; margin-top:-1px; }
  .bk-input:focus ~ .bk-field-bar,
  .bk-textarea:focus ~ .bk-field-bar,
  .bk-select:focus ~ .bk-field-bar{ transform:scaleX(1); }

  /* ── STEP BUTTONS ── */
  .bk-step-footer{ display:flex; justify-content:space-between; align-items:center; padding-top:36px; border-top:1px solid rgba(139,111,71,.1); margin-top:40px; }
  .bk-btn-next{
    background:var(--crimson); color:#fff;
    padding:15px 44px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.34em; text-transform:uppercase; font-weight:700;
    border:none; cursor:pointer; position:relative; overflow:hidden;
    transition:all .4s ease; box-shadow:0 6px 24px rgba(92,10,22,.28);
    display:flex; align-items:center; gap:10px;
  }
  .bk-btn-next::before{ content:''; position:absolute; inset:0; background:rgba(0,0,0,.15); opacity:0; transition:opacity .3s ease; }
  .bk-btn-next:hover{ transform:translateY(-3px); box-shadow:0 12px 36px rgba(92,10,22,.38); }
  .bk-btn-next:hover::before{ opacity:1; }
  .bk-btn-next span{ position:relative; z-index:1; }
  .bk-btn-back{
    border:1.5px solid rgba(92,10,22,.3); color:var(--crimson);
    padding:15px 36px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.3em; text-transform:uppercase; font-weight:600;
    background:none; cursor:pointer; transition:all .35s ease;
    display:flex; align-items:center; gap:8px;
  }
  .bk-btn-back:hover{ background:var(--crimson); color:#fff; border-color:var(--crimson); transform:translateY(-2px); }

  /* ── REVIEW STEP ── */
  .bk-review-box{ background:var(--crimson-dim); border:1px solid rgba(92,10,22,.1); padding:32px 36px; margin-bottom:20px; }
  .bk-review-section-label{ font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.38em; text-transform:uppercase; color:var(--crimson); display:block; margin-bottom:16px; border-bottom:1px solid rgba(92,10,22,.1); padding-bottom:10px; }
  .bk-review-row{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; gap:16px; }
  .bk-review-key{ font-family:'Cinzel',serif; font-size:8px; letter-spacing:.3em; text-transform:uppercase; color:var(--muted); white-space:nowrap; }
  .bk-review-val{ font-family:'Cormorant Garamond',serif; font-size:1.05rem; color:var(--brand-dark); font-weight:400; text-align:right; }
  .bk-review-total-row{ display:flex; justify-content:space-between; align-items:center; padding-top:18px; border-top:1px solid rgba(92,10,22,.15); margin-top:6px; }
  .bk-review-total-lbl{ font-family:'Cinzel',serif; font-size:10px; letter-spacing:.4em; color:var(--brand-dark); text-transform:uppercase; }
  .bk-review-total-val{ font-family:'Cormorant Garamond',serif; font-size:2.6rem; color:var(--crimson); font-weight:300; line-height:1; }
  .bk-contact-box{ background:var(--smoke); border:1px solid rgba(139,111,71,.12); padding:28px 36px; margin-bottom:20px; }
  .bk-terms-row{ display:flex; align-items:flex-start; gap:14px; padding:18px 0; border-top:1px solid rgba(139,111,71,.1); border-bottom:1px solid rgba(139,111,71,.1); margin:20px 0; }
  .bk-terms-checkbox{ width:18px; height:18px; border:1.5px solid rgba(92,10,22,.35); flex-shrink:0; margin-top:2px; display:flex; align-items:center; justify-content:center; transition:all .3s ease; cursor:pointer; }
  .bk-terms-checkbox.checked{ background:var(--crimson); border-color:var(--crimson); }
  .bk-terms-text{ font-family:'Jost',sans-serif; font-size:.82rem; color:var(--muted); line-height:1.75; font-weight:300; }
  .bk-terms-link{ color:var(--crimson); text-decoration:underline; cursor:pointer; }
  .bk-confirm-btn{
    width:100%; background:var(--crimson); color:#fff;
    padding:20px 32px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.38em; text-transform:uppercase; font-weight:700;
    border:none; cursor:pointer; position:relative; overflow:hidden;
    transition:all .45s ease; box-shadow:0 8px 28px rgba(92,10,22,.32);
    display:flex; align-items:center; justify-content:center; gap:12px;
    animation:bkGlow 3s ease-in-out infinite;
  }
  .bk-confirm-btn::before{ content:''; position:absolute; inset:0; background:rgba(0,0,0,.15); opacity:0; transition:opacity .35s ease; }
  .bk-confirm-btn:hover:not(:disabled){ transform:translateY(-3px); box-shadow:0 16px 44px rgba(92,10,22,.42); }
  .bk-confirm-btn:hover:not(:disabled)::before{ opacity:1; }
  .bk-confirm-btn:disabled{ opacity:.5; cursor:not-allowed; }
  .bk-confirm-btn span{ position:relative; z-index:1; }
  .bk-login-gate{
    text-align:center; padding:40px 28px;
    border:1.5px dashed rgba(92,10,22,.2);
    background:var(--crimson-dim);
  }
  .bk-login-gate-p{ font-size:.9rem; color:var(--muted); margin-bottom:28px; font-weight:300; font-family:'Jost',sans-serif; line-height:1.75; }
  .bk-login-gate-btns{ display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }
  .bk-back-link{ display:block; text-align:center; margin-top:16px; font-family:'Cinzel',serif; font-size:8px; letter-spacing:.34em; text-transform:uppercase; color:var(--muted); background:none; border:none; cursor:pointer; transition:color .3s ease; padding:6px; }
  .bk-back-link:hover{ color:var(--crimson); }

  /* ── WHY US STRIP ── */
  .bk-why-sec{ background:var(--brand-dark); padding:clamp(72px,8vw,110px) clamp(24px,5vw,64px); position:relative; overflow:hidden; }
  .bk-why-sec::before{ content:'CHAPTER'; position:absolute; bottom:-20px; right:-8px; font-family:'Cormorant Garamond',serif; font-size:180px; font-weight:700; color:rgba(201,169,110,.025); white-space:nowrap; pointer-events:none; }
  .bk-why-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:3px; max-width:1100px; margin:0 auto; position:relative; z-index:1; }
  .bk-why-card{ padding:44px 32px; background:rgba(255,255,255,.03); border:1px solid rgba(201,169,110,.08); transition:all .4s ease; position:relative; }
  .bk-why-card:hover{ background:rgba(255,255,255,.07); transform:translateY(-5px); border-color:rgba(201,169,110,.22); }
  .bk-why-card::before{ content:''; position:absolute; top:0; left:0; right:0; height:1.5px; background:linear-gradient(90deg,transparent,var(--gold),transparent); transform:scaleX(0); transform-origin:left; transition:transform .5s ease; }
  .bk-why-card:hover::before{ transform:scaleX(1); }
  .bk-why-num{ font-family:'Cormorant Garamond',serif; font-size:4rem; color:rgba(201,169,110,.1); font-weight:300; display:block; line-height:1; margin-bottom:16px; }
  .bk-why-title{ font-family:'Cormorant Garamond',serif; font-size:1.3rem; color:var(--gold); font-weight:400; margin-bottom:10px; }
  .bk-why-text{ font-size:.84rem; color:rgba(253,248,243,.48); font-weight:300; line-height:1.82; }

  /* ── VENUES STRIP ── */
  .bk-venues-sec{ padding:clamp(72px,8vw,110px) clamp(24px,5vw,64px); background:var(--smoke); }
  .bk-venues-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:3px; max-width:1100px; margin:0 auto; }
  .bk-venue-card{ position:relative; overflow:hidden; min-height:280px; display:flex; align-items:flex-end; cursor:pointer; }
  .bk-venue-img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform .8s cubic-bezier(.23,1,.32,1); filter:saturate(.82) contrast(1.05); }
  .bk-venue-card:hover .bk-venue-img{ transform:scale(1.07); }
  .bk-venue-grad{ position:absolute; inset:0; background:linear-gradient(to top,rgba(28,16,8,.88) 0%,rgba(28,16,8,.2) 60%,transparent 100%); }
  .bk-venue-info{ position:relative; z-index:1; padding:26px; }
  .bk-venue-tag{ font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.38em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:5px; }
  .bk-venue-name{ font-family:'Cormorant Garamond',serif; font-size:1.55rem; color:#fff; font-weight:300; line-height:1.15; }
  .bk-venue-cap{ font-size:.78rem; color:rgba(253,248,243,.42); margin-top:4px; font-weight:300; }

  /* ── CTA ── */
  .bk-cta-sec{ background:var(--brand-dark); padding:clamp(80px,10vw,140px) clamp(24px,5vw,64px); text-align:center; position:relative; overflow:hidden; border-top:1px solid rgba(201,169,110,.14); }
  .bk-cta-ring{ position:absolute; border-radius:50%; border:1px solid rgba(201,169,110,.07); top:50%; left:50%; pointer-events:none; }
  .bk-cta-h2{ font-family:'Cormorant Garamond',serif; font-size:clamp(2.4rem,5.5vw,4.6rem); font-weight:300; color:#fff; line-height:1.1; margin-bottom:18px; position:relative; z-index:1; }
  .bk-cta-h2 em{ font-style:italic; color:var(--gold); }
  .bk-cta-sub{ max-width:480px; margin:0 auto 44px; color:rgba(255,255,255,.5); font-size:.98rem; font-weight:300; line-height:1.9; position:relative; z-index:1; }
  .bk-cta-btns{ display:flex; gap:16px; justify-content:center; flex-wrap:wrap; position:relative; z-index:1; }
  .bk-btn-gold{ background:var(--gold); color:var(--crimson); padding:17px 46px; font-family:'Cinzel',serif; font-size:10px; letter-spacing:.32em; text-transform:uppercase; font-weight:700; display:inline-block; text-decoration:none; transition:all .4s ease; box-shadow:0 6px 24px rgba(201,169,110,.35); }
  .bk-btn-gold:hover{ background:#fff; color:var(--crimson); transform:translateY(-3px); }
  .bk-btn-wht{ border:1.5px solid rgba(255,255,255,.35); color:#fff; padding:17px 46px; font-family:'Cinzel',serif; font-size:10px; letter-spacing:.32em; text-transform:uppercase; font-weight:600; display:inline-block; text-decoration:none; transition:all .4s ease; }
  .bk-btn-wht:hover{ border-color:var(--gold); color:var(--gold); transform:translateY(-3px); }
  .bk-est{ margin-top:64px; opacity:.26; }
  .bk-est p{ font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em; color:rgba(253,248,243,.9); text-transform:uppercase; margin-top:14px; }

  /* ── LOADING SPIN ── */
  .bk-spin{ width:16px; height:16px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:bkSpinRing .8s linear infinite; }
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

function Reveal({ children, delay = 0, dir = 'up' }) {
  const [ref, inView] = useInView();
  const map = { up:'bkFadeUp', left:'bkSlideL', right:'bkSlideR', plain:'bkFadeIn' };
  return (
    <div ref={ref} style={{
      animation: inView ? `${map[dir]} .88s ${delay}s cubic-bezier(.23,1,.32,1) both` : 'none',
      opacity: inView ? undefined : 0,
    }}>{children}</div>
  );
}

function Ornament() {
  return (
    <div className="bk-ornament">
      <div className="bk-ornament-line" />
      <div className="bk-ornament-gem" />
      <div className="bk-ornament-line r" />
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
      style={{ transition: 'transform .35s ease' }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────────────────────── */
const tickerItems = ['Book Your Date', 'Wedding Chapter', 'Limited Dates', 'Premium Packages', 'Banquet Venues', 'Photography', 'Cinematic Films', 'Floral Design'];

const whyPoints = [
  { num:'01', title:'Verified & Trusted',    text:'Every partner, venue, and vendor on our platform is personally vetted. You book with full confidence, zero guesswork.' },
  { num:'02', title:'30% to Hold Your Date', text:'A simple 30% advance secures your date immediately. Transparent milestone payments follow — no hidden costs.' },
  { num:'03', title:'Dedicated Coordinator', text:'From booking to your last dance, a single coordinator is your point of contact for every question and every detail.' },
  { num:'04', title:'Refund Assurance',       text:'Life is unpredictable. Our fair cancellation policy protects your investment in the rare event you need to reschedule.' },
];

const venues = [
  { tag:'Flagship Hall',   name:'The Grand Rosewood', cap:'Up to 1,200 guests  ·  Mumbai', img:'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80' },
  { tag:'Rooftop Garden',  name:'Sky Garden Terrace',  cap:'Up to 300 guests  ·  Delhi',   img:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80' },
  { tag:'Heritage Estate', name:'The Ivory Manor',     cap:'Up to 500 guests  ·  Jaipur',  img:'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80' },
];

/* Step icon SVGs (replaces emojis) */
const StepIcons = {
  1: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><rect x="2" y="3" width="20" height="18" rx="1"/><path d="M8 7h8M8 11h5M8 15h3"/></svg>,
  2: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  3: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="1"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  4: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
};

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT  —  ALL original logic 100% preserved
───────────────────────────────────────────────────────────── */
export default function Booking() {
  /* ── original state ── */
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState({ type: '', text: '' });
  const [agreed, setAgreed]   = useState(false);

  /* ── original DATA CONSTANTS ── */
  const packages = [
    { id: 'Essential', price: 75000,  desc: 'Perfect for intimate celebrations' },
    { id: 'Premium',   price: 150000, desc: 'Our most popular choice', popular: true },
    { id: 'Luxury',    price: 250000, desc: 'The ultimate package' },
  ];

  const addonsList = [
    { id: 'Pre-Wedding Shoot',    price: 25000 },
    { id: 'Engagement Session',   price: 15000 },
    { id: 'Drone Coverage',       price: 15000 },
    { id: 'Same-Day Edit',        price: 20000 },
    { id: 'Extra Photographer',   price: 20000 },
    { id: 'Additional Album',     price: 30000 },
  ];

  /* ── original FORM STATE ── */
  const [formData, setFormData] = useState({
    package_name:     'Premium',
    addons:           [],
    couple_name:      user?.name  || '',
    phone:            user?.phone || '',
    email:            user?.email || '',
    event_type:       'Wedding',
    event_date:       '',
    start_time:       '',
    venue_name:       '',
    venue_address:    '',
    special_requests: '',
    total_price:      150000,
  });

  /* ── original LOGIC ── */
  const updatePrice = (pkgName, currentAddons) => {
    const pkgPrice    = packages.find(p => p.id === pkgName).price;
    const addonPrice  = addonsList
      .filter(a => currentAddons.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0);
    return pkgPrice + addonPrice;
  };

  const handlePackageSelect = (id) => {
    const newPrice = updatePrice(id, formData.addons);
    setFormData({ ...formData, package_name: id, total_price: newPrice });
  };

  const handleAddonToggle = (id) => {
    const newAddons = formData.addons.includes(id)
      ? formData.addons.filter(a => a !== id)
      : [...formData.addons, id];
    const newPrice = updatePrice(formData.package_name, newAddons);
    setFormData({ ...formData, addons: newAddons, total_price: newPrice });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!agreed) {
      setStatus({ type: 'error', text: 'Please agree to the terms and conditions.' });
      return;
    }
    setLoading(true);
    try {
      await axios.post('https://weddings-backend.onrender.com/api/bookings', {
        package_name: formData.package_name,
        addons:       formData.addons,
        total_price:  formData.total_price,
        event_date:   formData.event_date,
        event_location: `${formData.venue_name}, ${formData.venue_address}`,
      }, { withCredentials: true });
      setStatus({ type: 'success', text: 'Booking Confirmed! Your love story is in good hands.' });
      setTimeout(() => navigate({ to: '/dashboard/bookings' }), 2000);
    } catch (err) {
      setStatus({ type: 'error', text: 'System busy. Please try again in a moment.' });
    } finally {
      setLoading(false);
    }
  };

  /* ─── step labels ─── */
  const steps = [
    { n: 1, t: 'Select Package' },
    { n: 2, t: 'Your Details' },
    { n: 3, t: 'Event Info' },
    { n: 4, t: 'Review & Confirm' },
  ];

  return (
    <>
      <style>{STYLES}</style>

      {/* ══ HERO ══ */}
      <section className="bk-hero">
        <div className="bk-hero-bg" style={{ backgroundImage:"url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85')" }} />
        <div className="bk-hero-overlay" />
        <div className="bk-hero-grain" />
        <div className="bk-hero-content">
          <div className="bk-hero-pill">Ready to Book?</div>
          <h1 className="bk-hero-h1">
            Book Your Session
            <span className="gold-italic">Reserve Your Date</span>
          </h1>
          <p className="bk-hero-sub">
            Reserve your date and let us capture your beautiful moments with elegance, precision, and a touch of pure magic.
          </p>
        </div>
        <div className="bk-scroll-cue">
          <div className="bk-scroll-track" />
          <span className="bk-scroll-lbl">Scroll</span>
        </div>
      </section>

      {/* ══ TICKER ══ */}
      <div className="bk-ticker">
        <div className="bk-ticker-inner">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="bk-ticker-item">{item}<span className="bk-ticker-dot" /></span>
          ))}
        </div>
      </div>

      {/* ══ MAIN FORM AREA ══ */}
      <div className="bk-outer">
        <div className="bk-inner">

          {/* ── STEPPER  (original step logic preserved) ── */}
          <div className="bk-stepper-wrap">
            {steps.map((s, i) => (
              <div key={s.n} className="bk-step-item">
                <div className={`bk-step-num ${step > s.n ? 'done' : step === s.n ? 'active' : 'inactive'}`}>
                  {step > s.n
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    : s.n}
                </div>
                <span className={`bk-step-label ${step > s.n ? 'done' : step === s.n ? 'active' : 'inactive'}`}>{s.t}</span>
                {s.n < 4 && (
                  <div className={`bk-step-connector ${step > s.n ? 'done' : 'inactive'}`} />
                )}
              </div>
            ))}
          </div>

          {/* ── FORM CARD ── */}
          <div className="bk-card" key={step}>

            {/* status */}
            {status.text && (
              <div className={`bk-status ${status.type}`}>{status.text}</div>
            )}

            {/* ══════════ STEP 1 ══════════ */}
            {step === 1 && (
              <div>
                <div className="bk-card-step-hdr">
                  <div className="bk-card-step-icon">{StepIcons[1]}</div>
                  <div>
                    <span className="bk-card-step-num-badge">Step 01 of 04</span>
                    <h2 className="bk-card-step-title">Select Your Package</h2>
                  </div>
                </div>

                {/* packages — original onClick logic preserved */}
                <div className="bk-pkg-grid">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => handlePackageSelect(pkg.id)}
                      className={`bk-pkg-card${formData.package_name === pkg.id ? ' selected' : ''}`}
                    >
                      {pkg.popular && <div className="bk-pkg-popular">Most Popular</div>}
                      {formData.package_name === pkg.id && (
                        <div className="bk-pkg-check">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                      <h3 className="bk-pkg-name">{pkg.id}</h3>
                      <span className="bk-pkg-desc">{pkg.desc}</span>
                      <div className="bk-pkg-price">₹{pkg.price.toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                {/* addons — original onChange logic preserved */}
                <span className="bk-addons-label">Add-On Services (Optional)</span>
                <div className="bk-addons-grid">
                  {addonsList.map((addon) => (
                    <label
                      key={addon.id}
                      className={`bk-addon-item${formData.addons.includes(addon.id) ? ' checked' : ''}`}
                    >
                      <div className="bk-addon-checkbox">
                        {formData.addons.includes(addon.id) && (
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="bk-addon-name">{addon.id}</p>
                        <span className="bk-addon-price">+ ₹{addon.price.toLocaleString()}</span>
                      </div>
                      <input
                        type="checkbox"
                        style={{ display:'none' }}
                        checked={formData.addons.includes(addon.id)}
                        onChange={() => handleAddonToggle(addon.id)}
                      />
                    </label>
                  ))}
                </div>

                {/* live price bar */}
                <div className="bk-price-bar">
                  <span className="bk-price-bar-lbl">Current Total</span>
                  <span className="bk-price-bar-val">₹{formData.total_price.toLocaleString()}</span>
                </div>

                <div className="bk-step-footer" style={{ justifyContent:'flex-end' }}>
                  <button onClick={() => setStep(2)} className="bk-btn-next">
                    <span>Continue</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* ══════════ STEP 2 ══════════ */}
            {step === 2 && (
              <div>
                <div className="bk-card-step-hdr">
                  <div className="bk-card-step-icon">{StepIcons[2]}</div>
                  <div>
                    <span className="bk-card-step-num-badge">Step 02 of 04</span>
                    <h2 className="bk-card-step-title">Your Details</h2>
                  </div>
                </div>

                {/* original fields — name, value, onChange unchanged */}
                <div className="bk-field">
                  <label className="bk-label">Couple's Names *</label>
                  <input name="couple_name" value={formData.couple_name} onChange={handleInputChange} className="bk-input" placeholder="e.g. Priya & Arjun" />
                  <div className="bk-field-bar" />
                </div>
                <div className="bk-form-grid-2">
                  <div className="bk-field">
                    <label className="bk-label">Email Address *</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} className="bk-input" placeholder="hello@example.com" />
                    <div className="bk-field-bar" />
                  </div>
                  <div className="bk-field">
                    <label className="bk-label">Phone Number *</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} className="bk-input" placeholder="+91 98765 43210" />
                    <div className="bk-field-bar" />
                  </div>
                </div>

                <div className="bk-step-footer">
                  <button onClick={() => setStep(1)} className="bk-btn-back">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                    Back
                  </button>
                  <button onClick={() => setStep(3)} className="bk-btn-next"><span>Continue</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
                </div>
              </div>
            )}

            {/* ══════════ STEP 3 ══════════ */}
            {step === 3 && (
              <div>
                <div className="bk-card-step-hdr">
                  <div className="bk-card-step-icon">{StepIcons[3]}</div>
                  <div>
                    <span className="bk-card-step-num-badge">Step 03 of 04</span>
                    <h2 className="bk-card-step-title">Event Information</h2>
                  </div>
                </div>

                {/* original fields — all name/value/onChange preserved */}
                <div className="bk-form-grid-2">
                  <div className="bk-field">
                    <label className="bk-label">Event Type</label>
                    <select name="event_type" value={formData.event_type} onChange={handleInputChange} className="bk-select">
                      <option>Wedding</option>
                      <option>Engagement</option>
                      <option>Pre-Wedding</option>
                      <option>Reception</option>
                    </select>
                    <div className="bk-field-bar" />
                  </div>
                  <div className="bk-field">
                    <label className="bk-label">Event Date *</label>
                    <input type="date" name="event_date" value={formData.event_date} onChange={handleInputChange} className="bk-input" />
                    <div className="bk-field-bar" />
                  </div>
                  <div className="bk-field">
                    <label className="bk-label">Event Start Time</label>
                    <input type="time" name="start_time" value={formData.start_time} onChange={handleInputChange} className="bk-input" />
                    <div className="bk-field-bar" />
                  </div>
                  <div className="bk-field">
                    <label className="bk-label">Venue Name *</label>
                    <input name="venue_name" value={formData.venue_name} onChange={handleInputChange} placeholder="e.g. Grand Plaza Hotel" className="bk-input" />
                    <div className="bk-field-bar" />
                  </div>
                </div>
                <div className="bk-field-full">
                  <label className="bk-label">Venue Address</label>
                  <textarea name="venue_address" value={formData.venue_address} onChange={handleInputChange} rows="2" placeholder="Full venue address..." className="bk-textarea" />
                  <div className="bk-field-bar" />
                </div>
                <div className="bk-field-full">
                  <label className="bk-label">Special Requests</label>
                  <textarea name="special_requests" value={formData.special_requests} onChange={handleInputChange} rows="3" placeholder="Any special requirements or notes..." className="bk-textarea" />
                  <div className="bk-field-bar" />
                </div>

                <div className="bk-step-footer">
                  <button onClick={() => setStep(2)} className="bk-btn-back">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                    Back
                  </button>
                  <button onClick={() => setStep(4)} className="bk-btn-next"><span>Continue</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
                </div>
              </div>
            )}

            {/* ══════════ STEP 4 ══════════ */}
            {step === 4 && (
              <div>
                <div className="bk-card-step-hdr">
                  <div className="bk-card-step-icon">{StepIcons[4]}</div>
                  <div>
                    <span className="bk-card-step-num-badge">Step 04 of 04</span>
                    <h2 className="bk-card-step-title">Review Your Booking</h2>
                  </div>
                </div>

                {/* booking summary — original formData fields preserved */}
                <div className="bk-review-box">
                  <span className="bk-review-section-label">Booking Summary</span>
                  {[
                    { k:'Package',    v: formData.package_name },
                    { k:'Event',      v: formData.event_type },
                    { k:'Date',       v: formData.event_date },
                    { k:'Venue',      v: formData.venue_name },
                    { k:'Add-ons',    v: formData.addons.length > 0 ? formData.addons.join(', ') : 'None' },
                  ].map(({ k, v }) => (
                    <div className="bk-review-row" key={k}>
                      <span className="bk-review-key">{k}</span>
                      <span className="bk-review-val">{v}</span>
                    </div>
                  ))}
                  <div className="bk-review-total-row">
                    <span className="bk-review-total-lbl">Total</span>
                    <span className="bk-review-total-val">₹{formData.total_price.toLocaleString()}</span>
                  </div>
                </div>

                {/* contact info */}
                <div className="bk-contact-box">
                  <span className="bk-review-section-label">Contact Information</span>
                  {[
                    { k:'Name',  v: formData.couple_name },
                    { k:'Email', v: formData.email },
                    { k:'Phone', v: formData.phone },
                  ].map(({ k, v }) => (
                    <div className="bk-review-row" key={k}>
                      <span className="bk-review-key">{k}</span>
                      <span className="bk-review-val">{v}</span>
                    </div>
                  ))}
                </div>

                {/* terms — original agreed/setAgreed preserved */}
                <div className="bk-terms-row">
                  <div
                    className={`bk-terms-checkbox${agreed ? ' checked' : ''}`}
                    onClick={() => setAgreed(!agreed)}
                  >
                    {agreed && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <p className="bk-terms-text">
                    I agree to the <span className="bk-terms-link">terms and conditions</span> and understand that a 30% advance payment is required to confirm the booking.
                    <input
                      type="checkbox"
                      style={{ display:'none' }}
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                  </p>
                </div>

                {/* auth gate or confirm — original user check preserved */}
                {!user ? (
                  <div className="bk-login-gate">
                    <p className="bk-login-gate-p">You must be logged in to finalize your booking.</p>
                    <div className="bk-login-gate-btns">
                      <Link to="/login"  style={{ background:'var(--crimson)', color:'#fff', padding:'14px 36px', fontFamily:"'Cinzel',serif", fontSize:'9px', letterSpacing:'.36em', textTransform:'uppercase', fontWeight:700, textDecoration:'none', display:'inline-block' }}>Login to Confirm</Link>
                      <Link to="/signup" style={{ border:'1.5px solid var(--crimson)', color:'var(--crimson)', padding:'14px 36px', fontFamily:"'Cinzel',serif", fontSize:'9px', letterSpacing:'.36em', textTransform:'uppercase', fontWeight:600, textDecoration:'none', display:'inline-block' }}>Sign Up</Link>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bk-confirm-btn"
                  >
                    {loading
                      ? <><div className="bk-spin" /><span>Processing...</span></>
                      : <>
                          <span>Confirm Booking</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </>
                    }
                  </button>
                )}

                {/* original back link preserved */}
                <button onClick={() => setStep(3)} className="bk-back-link">
                  Wait, I need to check something
                </button>
              </div>
            )}

          </div>{/* /bk-card */}
        </div>{/* /bk-inner */}
      </div>{/* /bk-outer */}

      {/* ══ WHY BOOK WITH US ══ */}
      <section className="bk-why-sec">
        <Reveal>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <span className="bk-eyebrow" style={{ color:'var(--gold)' }}>Why Wedding Chapter</span>
            <Ornament />
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2.2rem,4vw,3.4rem)', fontWeight:300, color:'#fff' }}>
              Booking with <em style={{ fontStyle:'italic', color:'var(--gold)' }}>Confidence</em>
            </h2>
          </div>
        </Reveal>
        <div className="bk-why-grid">
          {whyPoints.map(({ num, title, text }, i) => (
            <Reveal key={i} delay={i * 0.08} dir="plain">
              <TiltCard className="bk-why-card">
                <span className="bk-why-num">{num}</span>
                <h3 className="bk-why-title">{title}</h3>
                <p className="bk-why-text">{text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ FEATURED VENUES ══ */}
      <section className="bk-venues-sec">
        <Reveal>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <span className="bk-eyebrow">Available Venues</span>
            <Ornament />
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2.2rem,4vw,3.4rem)', fontWeight:300, color:'var(--brand-dark)' }}>
              Iconic <em style={{ fontStyle:'italic', color:'var(--brand)' }}>Spaces to Celebrate</em>
            </h2>
          </div>
        </Reveal>
        <div className="bk-venues-grid">
          {venues.map(({ tag, name, cap, img }, i) => (
            <Reveal key={i} delay={i * 0.09} dir="plain">
              <div className="bk-venue-card">
                <img src={img} alt={name} className="bk-venue-img" loading="lazy" />
                <div className="bk-venue-grad" />
                <div className="bk-venue-info">
                  <span className="bk-venue-tag">{tag}</span>
                  <h3 className="bk-venue-name">{name}</h3>
                  <p className="bk-venue-cap">{cap}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="bk-cta-sec">
        {[200, 380, 560, 740].map((size, i) => (
          <div key={i} className="bk-cta-ring" style={{
            width:size, height:size, marginLeft:-size/2, marginTop:-size/2,
            animation:`bkPulseRing ${3+i*.7}s ${i*.8}s ease-out infinite`,
          }} />
        ))}
        <Reveal>
          <span className="bk-eyebrow" style={{ color:'var(--gold)' }}>Limited Dates</span>
          <Ornament />
          <h2 className="bk-cta-h2">
            Questions Before<br /><em>You Book?</em>
          </h2>
          <p className="bk-cta-sub">
            Our team is available Monday to Friday, 10am to 6pm. Reach out and we will guide you through every option.
          </p>
          <div className="bk-cta-btns">
            <Link to="/contact" className="bk-btn-gold">Get In Touch</Link>
            <Link to="/vendors" className="bk-btn-wht">Browse Vendors</Link>
          </div>
          <div className="bk-est">
            <Ornament />
            <p>Est. 2017 &nbsp;&bull;&nbsp; Mumbai, India &nbsp;&bull;&nbsp; Wedding Chapter Collective</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}