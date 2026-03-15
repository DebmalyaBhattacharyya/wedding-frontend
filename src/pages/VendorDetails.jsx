import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from '@tanstack/react-router';

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

  @keyframes vdFadeUp   { from{opacity:0;transform:translateY(52px)} to{opacity:1;transform:translateY(0)} }
  @keyframes vdSlideL   { from{opacity:0;transform:translateX(-64px)} to{opacity:1;transform:translateX(0)} }
  @keyframes vdSlideR   { from{opacity:0;transform:translateX(64px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes vdFadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes vdShimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes vdLineGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes vdKen      { 0%{transform:scale(1.04)} 100%{transform:scale(1.1) translateX(-1%)} }
  @keyframes vdScrollDot{
    0%,100%{transform:translateY(0);opacity:1}
    60%{transform:translateY(14px);opacity:0}
    61%{transform:translateY(-4px);opacity:0}
  }
  @keyframes vdBorderGlow{
    0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,0)}
    50%{box-shadow:0 0 0 10px rgba(201,169,110,0.09)}
  }
  @keyframes vdRotateGem{
    0%,100%{transform:rotate(45deg) scale(1)}
    50%{transform:rotate(45deg) scale(1.4)}
  }
  @keyframes vdPulseRing{
    0%{transform:translate(-50%,-50%) scale(1);opacity:.5}
    100%{transform:translate(-50%,-50%) scale(2.7);opacity:0}
  }
  @keyframes vdTickerScroll{
    from{transform:translateX(0)}
    to{transform:translateX(-50%)}
  }
  @keyframes vdSuccessScale{
    0%{opacity:0;transform:scale(.7) translateY(20px)}
    100%{opacity:1;transform:scale(1) translateY(0)}
  }
  @keyframes vdCheckDraw{
    from{stroke-dashoffset:100}
    to{stroke-dashoffset:0}
  }
  @keyframes vdSpinRing{
    from{transform:rotate(0deg)}
    to{transform:rotate(360deg)}
  }
  @keyframes vdTopBarGrow{
    from{transform:scaleX(0);transform-origin:left}
    to{transform:scaleX(1);transform-origin:left}
  }

  /* Utilities */
  .vd-eyebrow{
    display:block; font-family:'Cinzel',serif; font-size:9.5px;
    letter-spacing:.44em; text-transform:uppercase; color:var(--gold); margin-bottom:16px;
  }
  .vd-ornament{ display:flex; align-items:center; gap:12px; justify-content:center; margin:0 auto 22px; }
  .vd-ornament-line{
    flex:1; max-width:68px; height:1px;
    background:linear-gradient(90deg,transparent,var(--gold));
    transform-origin:left; animation:vdLineGrow .8s ease both;
  }
  .vd-ornament-line.r{ background:linear-gradient(90deg,var(--gold),transparent); transform-origin:right; }
  .vd-ornament-gem{ width:7px; height:7px; background:var(--gold); transform:rotate(45deg); animation:vdRotateGem 4s ease-in-out infinite; }

  /* ── RESTRICTED SCREEN ── */
  .vd-restricted{
    min-height:90vh; display:flex; flex-direction:column;
    align-items:center; justify-content:center; text-align:center;
    padding:80px 24px; position:relative; overflow:hidden;
    background:
      radial-gradient(ellipse at 20% 50%,rgba(139,111,71,.08) 0%,transparent 55%),
      radial-gradient(ellipse at 80% 20%,rgba(201,169,110,.07) 0%,transparent 50%),
      var(--brand-light);
  }
  .vd-restricted-img{
    position:absolute; inset:0; width:100%; height:100%;
    object-fit:cover; opacity:.07; filter:saturate(.5); pointer-events:none;
  }
  .vd-restricted-ring{
    position:absolute; border-radius:50%;
    border:1px solid rgba(201,169,110,.1); top:50%; left:50%; pointer-events:none;
  }
  .vd-restricted-content{ position:relative; z-index:2; max-width:600px; }
  .vd-restricted-badge{
    display:inline-block; font-family:'Cinzel',serif; font-size:9px;
    letter-spacing:.45em; text-transform:uppercase; color:var(--gold);
    border:1px solid rgba(201,169,110,.4); padding:9px 28px; margin-bottom:32px;
    animation:vdFadeUp .7s ease both; position:relative;
  }
  .vd-restricted-badge::before,.vd-restricted-badge::after{
    content:''; position:absolute; width:6px; height:6px;
    border:1px solid var(--gold); transform:rotate(45deg); background:var(--brand-light);
  }
  .vd-restricted-badge::before{top:-4px;left:-4px}
  .vd-restricted-badge::after{bottom:-4px;right:-4px}
  .vd-restricted-h2{
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2.8rem,6vw,5rem); font-weight:300;
    color:var(--brand-dark); line-height:1.08; margin-bottom:20px;
    animation:vdFadeUp .85s .1s ease both;
  }
  .vd-restricted-h2 em{ font-style:italic; color:var(--brand); }
  .vd-restricted-p{
    color:var(--muted); max-width:480px; margin:0 auto 48px;
    font-size:1.05rem; font-weight:300; line-height:1.9;
    animation:vdFadeUp .85s .22s ease both;
  }
  .vd-restricted-btns{
    display:flex; flex-wrap:wrap; gap:16px; justify-content:center;
    animation:vdFadeUp .85s .34s ease both;
  }
  .vd-btn-primary{
    background:var(--brand-dark); color:var(--brand-light);
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none; position:relative; overflow:hidden;
    transition:all .45s cubic-bezier(.23,1,.32,1); box-shadow:0 6px 24px rgba(74,55,40,.28);
  }
  .vd-btn-primary::after{ content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--brand) 0%,var(--gold) 100%); opacity:0; transition:opacity .4s ease; }
  .vd-btn-primary:hover{ transform:translateY(-3px); box-shadow:0 14px 40px rgba(74,55,40,.38); }
  .vd-btn-primary:hover::after{ opacity:1; }
  .vd-btn-primary span{ position:relative; z-index:1; }
  .vd-btn-outline{
    border:1.5px solid var(--brand); color:var(--brand);
    padding:17px 46px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.32em; text-transform:uppercase; font-weight:600;
    display:inline-block; text-decoration:none; transition:all .4s ease;
  }
  .vd-btn-outline:hover{ background:var(--brand); color:var(--brand-light); transform:translateY(-3px); }

  /* ── LOADING ── */
  .vd-loading{
    min-height:70vh; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:24px;
    background:var(--brand-light);
  }
  .vd-loading-spinner{
    width:48px; height:48px; border:1.5px solid rgba(201,169,110,.2);
    border-top-color:var(--gold); border-radius:50%;
    animation:vdSpinRing 1s linear infinite;
  }
  .vd-loading-text{
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em;
    text-transform:uppercase; color:var(--gold);
  }

  /* ── HERO COVER ── */
  .vd-cover{
    position:relative; height:72vh; min-height:520px; overflow:hidden;
  }
  .vd-cover-img{
    width:100%; height:100%; object-fit:cover; display:block;
    animation:vdKen 18s ease-in-out infinite alternate;
    filter:saturate(.88) contrast(1.05);
  }
  .vd-cover-overlay{
    position:absolute; inset:0;
    background:linear-gradient(to bottom,rgba(28,16,8,.38) 0%,rgba(28,16,8,.12) 45%,rgba(28,16,8,.72) 100%);
  }
  .vd-cover-grain{
    position:absolute; inset:0; opacity:.04;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:200px;
  }
  .vd-cover-bottom{
    position:absolute; bottom:0; left:0; right:0; padding:40px clamp(24px,5vw,64px);
    display:flex; justify-content:space-between; align-items:flex-end; z-index:2;
  }
  .vd-cover-name{
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2.6rem,6vw,5.5rem); font-weight:300; color:#fff; line-height:1.02;
    animation:vdFadeUp .85s ease both;
  }
  .vd-cover-name em{
    font-style:italic; display:block;
    background:linear-gradient(90deg,var(--gold),#f0d090,var(--gold),#c8924a,var(--gold));
    background-size:300% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    animation:vdShimmer 5s linear 1s infinite;
  }
  .vd-cover-cat{
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:.45em;
    text-transform:uppercase; color:var(--gold);
    border:1px solid rgba(201,169,110,.42); padding:9px 22px;
    animation:vdFadeIn .85s .3s both;
  }
  .vd-cover-back{
    position:absolute; top:32px; left:clamp(24px,5vw,64px); z-index:3;
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:.38em;
    text-transform:uppercase; color:rgba(255,255,255,.7); text-decoration:none;
    display:flex; align-items:center; gap:10px; transition:color .3s ease;
    animation:vdFadeIn .7s ease both;
  }
  .vd-cover-back:hover{ color:var(--gold); }
  .vd-cover-back svg{ transition:transform .3s ease; }
  .vd-cover-back:hover svg{ transform:translateX(-4px); }
  .vd-scroll-cue{
    position:absolute; bottom:36px; right:clamp(24px,5vw,64px); z-index:2;
    display:flex; flex-direction:column; align-items:center; gap:8px;
    animation:vdFadeIn 1s 1s both;
  }
  .vd-scroll-track{
    width:1px; height:56px;
    background:linear-gradient(to bottom,rgba(201,169,110,.6),transparent);
    position:relative; overflow:hidden;
  }
  .vd-scroll-track::after{
    content:''; position:absolute; top:0; left:0; width:100%; height:35%;
    background:var(--gold); animation:vdScrollDot 2s ease-in-out infinite;
  }
  .vd-scroll-lbl{
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.4em;
    color:rgba(201,169,110,.65); text-transform:uppercase;
    writing-mode:vertical-lr; transform:rotate(180deg);
  }

  /* ── TICKER ── */
  .vd-ticker{
    background:var(--brand-dark); overflow:hidden;
    padding:13px 0; border-top:1px solid rgba(201,169,110,.14);
  }
  .vd-ticker-inner{ display:flex; white-space:nowrap; width:max-content; animation:vdTickerScroll 28s linear infinite; }
  .vd-ticker-item{ font-family:'Cinzel',serif; font-size:9px; letter-spacing:.4em; color:rgba(201,169,110,.52); text-transform:uppercase; padding:0 48px; }
  .vd-ticker-dot{ display:inline-block; width:4px; height:4px; background:var(--gold); transform:rotate(45deg); margin:0 24px; vertical-align:middle; opacity:.45; }

  /* ── META STRIP ── */
  .vd-meta-strip{
    background:var(--brand-dark); display:grid;
    grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
    position:relative; overflow:hidden;
  }
  .vd-meta-strip::before{
    content:''; position:absolute; inset:0;
    background:repeating-linear-gradient(90deg,rgba(201,169,110,.04) 0,rgba(201,169,110,.04) 1px,transparent 1px,transparent 100px);
  }
  .vd-meta-item{ text-align:center; padding:36px 20px; border-right:1px solid rgba(201,169,110,.1); position:relative; z-index:1; }
  .vd-meta-item:last-child{ border-right:none; }
  .vd-meta-label{ font-family:'Cinzel',serif; font-size:8px; letter-spacing:.35em; color:rgba(201,169,110,.5); text-transform:uppercase; display:block; margin-bottom:10px; }
  .vd-meta-value{ font-family:'Cormorant Garamond',serif; font-size:1.3rem; color:#fff; font-weight:300; }
  .vd-meta-value.gold{ color:var(--gold); }

  /* ── MAIN CONTENT ── */
  .vd-main-sec{ padding:clamp(72px,9vw,130px) clamp(24px,5vw,64px); background:var(--brand-light); }
  .vd-main-grid{
    display:grid; grid-template-columns:1.5fr 1fr;
    gap:clamp(40px,5vw,80px); max-width:1280px; margin:0 auto; align-items:start;
  }
  @media(max-width:900px){ .vd-main-grid{grid-template-columns:1fr} }

  /* About panel */
  .vd-about-sec-label{
    font-family:'Cinzel',serif; font-size:9px; letter-spacing:.42em;
    text-transform:uppercase; color:var(--gold); display:inline-block;
    border-bottom:1px solid var(--gold-dim); padding-bottom:4px; margin-bottom:20px;
  }
  .vd-about-h3{
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2rem,3.5vw,2.8rem); font-weight:300;
    color:var(--brand-dark); line-height:1.12; margin-bottom:24px;
  }
  .vd-about-h3 em{ font-style:italic; color:var(--brand); }
  .vd-about-desc{ font-family:'Jost',sans-serif; font-size:1rem; color:var(--muted); line-height:1.95; font-weight:300; margin-bottom:28px; }
  .vd-about-features{ margin-bottom:32px; }
  .vd-about-feature{
    display:flex; align-items:flex-start; gap:12px;
    font-size:.875rem; color:#6b5844; margin-bottom:12px;
    font-family:'Jost',sans-serif; font-weight:300; line-height:1.6;
  }
  .vd-feat-dot{ width:5px; height:5px; background:var(--gold); transform:rotate(45deg); flex-shrink:0; margin-top:5px; }

  /* Gallery thumbs */
  .vd-thumbs{ display:grid; grid-template-columns:repeat(3,1fr); gap:3px; margin-top:32px; }
  .vd-thumb-item{ aspect-ratio:1; overflow:hidden; position:relative; cursor:pointer; }
  .vd-thumb-img{ width:100%; height:100%; object-fit:cover; display:block; transition:transform .7s cubic-bezier(.23,1,.32,1),filter .5s ease; filter:saturate(.7) contrast(1.05); }
  .vd-thumb-item:hover .vd-thumb-img{ transform:scale(1.1); filter:saturate(1) contrast(1.02); }
  .vd-thumb-item::after{ content:''; position:absolute; inset:0; background:rgba(201,169,110,0); transition:background .4s ease; }
  .vd-thumb-item:hover::after{ background:rgba(201,169,110,.08); }

  /* Inquiry card */
  .vd-inquiry-card{
    background:#fff; border:1px solid rgba(139,111,71,.14);
    padding:clamp(36px,5vw,52px); position:sticky; top:32px;
    animation:vdBorderGlow 4s ease-in-out infinite;
  }
  .vd-inquiry-title{
    font-family:'Cormorant Garamond',serif; font-size:1.7rem;
    color:var(--brand-dark); font-weight:300; text-align:center; margin-bottom:8px;
  }
  .vd-inquiry-sub{
    font-family:'Cinzel',serif; font-size:8px; letter-spacing:.36em;
    color:var(--gold); text-transform:uppercase; text-align:center;
    display:block; margin-bottom:32px;
  }
  .vd-status-msg{
    padding:12px 16px; font-size:.84rem; margin-bottom:20px;
    text-align:center; border:1px solid; font-family:'Jost',sans-serif; font-weight:300;
  }
  .vd-status-msg.success{ background:rgba(139,111,71,.06); color:var(--brand-dark); border-color:var(--gold-dim); }
  .vd-status-msg.error{ background:rgba(180,50,50,.04); color:#8b2020; border-color:rgba(180,50,50,.2); }

  /* Form inside card */
  .vd-field{ margin-bottom:22px; }
  .vd-label{ font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.38em; text-transform:uppercase; color:var(--brand-dark); display:block; margin-bottom:10px; }
  .vd-input,.vd-textarea{
    width:100%; border:none; border-bottom:1.5px solid rgba(139,111,71,.22);
    padding:11px 0; font-family:'Jost',sans-serif; font-size:.95rem;
    color:var(--brand-dark); background:transparent; outline:none;
    transition:border-color .35s ease; font-weight:300;
  }
  .vd-input::placeholder,.vd-textarea::placeholder{ color:rgba(90,65,45,.35); font-weight:300; }
  .vd-input:focus,.vd-textarea:focus{ border-bottom-color:var(--gold); }
  .vd-textarea{ resize:none; padding-top:11px; line-height:1.7; }
  .vd-field-bar{ height:1px; background:var(--gold); transform:scaleX(0); transform-origin:left; transition:transform .4s ease; margin-top:-1px; }
  .vd-input:focus ~ .vd-field-bar,
  .vd-textarea:focus ~ .vd-field-bar{ transform:scaleX(1); }
  .vd-submit-btn{
    width:100%; background:var(--brand-dark); color:var(--brand-light);
    padding:17px; font-family:'Cinzel',serif; font-size:10px;
    letter-spacing:.36em; text-transform:uppercase; font-weight:600;
    border:none; cursor:pointer; position:relative; overflow:hidden;
    transition:all .45s cubic-bezier(.23,1,.32,1); margin-top:8px;
    box-shadow:0 6px 22px rgba(74,55,40,.22);
  }
  .vd-submit-btn::before{ content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--brand) 0%,var(--gold) 100%); opacity:0; transition:opacity .4s ease; }
  .vd-submit-btn:hover{ transform:translateY(-3px); box-shadow:0 14px 40px rgba(74,55,40,.3); }
  .vd-submit-btn:hover::before{ opacity:1; }
  .vd-submit-btn span{ position:relative; z-index:1; }
  .vd-success-state{
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    text-align:center; padding:32px 16px;
    animation:vdSuccessScale .7s cubic-bezier(.23,1,.32,1) both;
  }
  .vd-success-icon{
    width:72px; height:72px; border:1.5px solid var(--gold);
    display:flex; align-items:center; justify-content:center; margin-bottom:24px;
    position:relative;
  }
  .vd-success-icon::after{
    content:''; position:absolute; inset:-10px; border:1px solid rgba(201,169,110,.2);
    animation:vdPulseRing 2.5s ease-out infinite;
  }
  .vd-success-check{ stroke-dasharray:100; stroke-dashoffset:100; animation:vdCheckDraw .7s .3s ease both; }
  .vd-success-h{ font-family:'Cormorant Garamond',serif; font-size:2rem; color:var(--brand-dark); font-weight:300; margin-bottom:10px; }
  .vd-success-p{ font-size:.88rem; color:var(--muted); font-weight:300; line-height:1.8; max-width:280px; }

  /* ── SIMILAR VENDORS ── */
  .vd-similar-sec{ padding:clamp(72px,9vw,130px) clamp(24px,5vw,64px); background:var(--smoke); }
  .vd-similar-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:3px; max-width:1200px; margin:0 auto; }
  .vd-sim-card{ position:relative; overflow:hidden; min-height:320px; display:flex; align-items:flex-end; cursor:pointer; }
  .vd-sim-img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform .8s cubic-bezier(.23,1,.32,1); filter:saturate(.82) contrast(1.05); }
  .vd-sim-card:hover .vd-sim-img{ transform:scale(1.07); }
  .vd-sim-grad{ position:absolute; inset:0; background:linear-gradient(to top,rgba(28,16,8,.88) 0%,rgba(28,16,8,.2) 60%,transparent 100%); transition:opacity .5s ease; }
  .vd-sim-card:hover .vd-sim-grad{ opacity:.96; }
  .vd-sim-info{ position:relative; z-index:1; padding:28px; }
  .vd-sim-tag{ font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.38em; color:var(--gold); text-transform:uppercase; display:block; margin-bottom:6px; }
  .vd-sim-name{ font-family:'Cormorant Garamond',serif; font-size:1.55rem; color:#fff; font-weight:300; line-height:1.15; }
  .vd-sim-cap{ font-size:.78rem; color:rgba(253,248,243,.42); margin-top:5px; font-weight:300; }

  /* ── WHY US STRIP ── */
  .vd-why-sec{ background:var(--brand-dark); padding:clamp(72px,9vw,120px) clamp(24px,5vw,64px); position:relative; overflow:hidden; }
  .vd-why-sec::before{ content:'CHAPTER'; position:absolute; bottom:-20px; right:-10px; font-family:'Cormorant Garamond',serif; font-size:200px; font-weight:700; color:rgba(201,169,110,.025); white-space:nowrap; pointer-events:none; }
  .vd-why-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:3px; max-width:1100px; margin:0 auto; position:relative; z-index:1; }
  .vd-why-card{ padding:44px 32px; background:rgba(255,255,255,.03); border:1px solid rgba(201,169,110,.08); transition:all .4s ease; position:relative; }
  .vd-why-card:hover{ background:rgba(255,255,255,.07); transform:translateY(-5px); border-color:rgba(201,169,110,.22); }
  .vd-why-card::before{ content:''; position:absolute; top:0; left:0; right:0; height:1.5px; background:linear-gradient(90deg,transparent,var(--gold),transparent); transform:scaleX(0); transform-origin:left; transition:transform .5s ease; }
  .vd-why-card:hover::before{ transform:scaleX(1); }
  .vd-why-num{ font-family:'Cormorant Garamond',serif; font-size:4rem; color:rgba(201,169,110,.1); font-weight:300; display:block; line-height:1; margin-bottom:16px; }
  .vd-why-title{ font-family:'Cormorant Garamond',serif; font-size:1.3rem; color:var(--gold); font-weight:400; margin-bottom:10px; }
  .vd-why-text{ font-size:.84rem; color:rgba(253,248,243,.48); font-weight:300; line-height:1.82; }

  /* ── CTA ── */
  .vd-cta-sec{
    background:var(--brand-dark); padding:clamp(80px,10vw,140px) clamp(24px,5vw,64px);
    text-align:center; position:relative; overflow:hidden;
    border-top:1px solid rgba(201,169,110,.14);
  }
  .vd-cta-ring{ position:absolute; border-radius:50%; border:1px solid rgba(201,169,110,.07); top:50%; left:50%; pointer-events:none; }
  .vd-cta-h2{ font-family:'Cormorant Garamond',serif; font-size:clamp(2.4rem,5.5vw,4.6rem); font-weight:300; color:#fff; line-height:1.1; margin-bottom:20px; position:relative; z-index:1; }
  .vd-cta-h2 em{ font-style:italic; color:var(--gold); }
  .vd-cta-sub{ max-width:480px; margin:0 auto 48px; color:rgba(255,255,255,.5); font-size:.98rem; font-weight:300; line-height:1.9; position:relative; z-index:1; }
  .vd-cta-btns{ display:flex; gap:16px; justify-content:center; flex-wrap:wrap; position:relative; z-index:1; }
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

function Reveal({ children, delay = 0, dir = 'up', className = '' }) {
  const [ref, inView] = useInView();
  const map = { up:'vdFadeUp', left:'vdSlideL', right:'vdSlideR', plain:'vdFadeIn' };
  return (
    <div ref={ref} className={className} style={{
      animation: inView ? `${map[dir]} .88s ${delay}s cubic-bezier(.23,1,.32,1) both` : 'none',
      opacity: inView ? undefined : 0,
    }}>{children}</div>
  );
}

function Ornament() {
  return (
    <div className="vd-ornament">
      <div className="vd-ornament-line" />
      <div className="vd-ornament-gem" />
      <div className="vd-ornament-line r" />
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
   DATA
───────────────────────────────────────────────────────────── */
const tickerItems = ['Vendor Details','Wedding Chapter','Premium Collective','Request a Quote','Exclusive Access','Banquet Specialists','Limited Availability','Book Your Date'];

const fallbackThumbs = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=75',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=400&q=75',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=75',
  'https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=400&q=75',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=75',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=75',
];

const similarVendors = [
  { tag:'Photography',   name:'The Golden Frame Studio',  cap:'5.0 Rating  ·  Mumbai', img:'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=75' },
  { tag:'Cinematic Film', name:'Reel Stories Production', cap:'4.9 Rating  ·  Delhi',  img:'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=700&q=75' },
  { tag:'Floral Design',  name:'Bloom & Drape Artistry',  cap:'5.0 Rating  ·  Jaipur', img:'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=700&q=75' },
];

const whyPoints = [
  { num:'01', title:'Verified Vendors Only',  text:'Every vendor on Wedding Chapter is personally vetted, site-visited, and approved by our curatorial team before listing.' },
  { num:'02', title:'24-Hour Response',       text:'All inquiry submissions are forwarded directly to the vendor. Our team follows up within 24 hours to confirm receipt.' },
  { num:'03', title:'Transparent Pricing',    text:'Price ranges are updated quarterly. No hidden fees, no surprises — just honest information to help you plan with clarity.' },
  { num:'04', title:'Dedicated Coordinator',  text:'Once booked, a dedicated Wedding Chapter coordinator liaises between you and the vendor until your event is complete.' },
];

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT  —  all original logic 100% untouched
───────────────────────────────────────────────────────────── */
export default function VendorDetails() {
  /* ── original state ── */
  const { vendorId } = useParams({ strict: false });
  const [vendor, setVendor]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [eventDate, setEventDate]   = useState('');
  const [message, setMessage]       = useState('');
  const [submitStatus, setSubmitStatus] = useState({ type: '', text: '' });

  /* ── original auth check ── */
  const user = JSON.parse(localStorage.getItem('user'));

  /* ── original fetch ── */
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetchVendor = async () => {
      try {
        const response = await axios.get(`https://weddings-backend.onrender.com/api/vendors/${vendorId}`);
        setVendor(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vendor details:', error);
        setLoading(false);
      }
    };
    fetchVendor();
  }, [vendorId, user]);

  /* ── original submit ── */
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await axios.post('https://weddings-backend.onrender.com/api/inquiries',
        { vendor_id: vendorId, event_date: eventDate, message: message },
        { withCredentials: true }
      );
      setSubmitStatus({ type: 'success', text: 'Inquiry sent successfully! The vendor will contact you soon.' });
      setEventDate('');
      setMessage('');
    } catch (error) {
      setSubmitStatus({ type: 'error', text: 'Failed to send inquiry. Please try again.' });
    }
  };

  /* ══════════════════════════════════════════
     RESTRICTED SCREEN
  ══════════════════════════════════════════ */
  if (!user) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="vd-restricted">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="vd-restricted-img"
          />
          {[220, 400, 580, 760].map((size, i) => (
            <div key={i} className="vd-restricted-ring" style={{
              width:size, height:size, marginLeft:-size/2, marginTop:-size/2,
              animation:`vdPulseRing ${3+i*.7}s ${i*.8}s ease-out infinite`,
            }} />
          ))}
          <div className="vd-restricted-content">
            <div className="vd-restricted-badge">Exclusive Access</div>
            <h2 className="vd-restricted-h2">
              Vendor Details<br /><em>Restricted</em>
            </h2>
            <p className="vd-restricted-p">
              You must be a registered member to view specific vendor details and send inquiries. Join Wedding Chapter to unlock our full curated collection.
            </p>
            <div className="vd-restricted-btns">
              <Link to="/login" className="vd-btn-primary"><span>Log In</span></Link>
              <Link to="/vendors" className="vd-btn-outline">Back to Vendors</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ══════════════════════════════════════════
     LOADING
  ══════════════════════════════════════════ */
  if (loading) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="vd-loading">
          <div className="vd-loading-spinner" />
          <span className="vd-loading-text">Loading Details</span>
        </div>
      </>
    );
  }

  /* ══════════════════════════════════════════
     NOT FOUND
  ══════════════════════════════════════════ */
  if (!vendor) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="vd-loading">
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.8rem', color:'var(--brand-dark)', fontWeight:300 }}>
            Vendor not found.
          </span>
          <Link to="/vendors" className="vd-btn-outline" style={{ marginTop:16 }}>Back to Vendors</Link>
        </div>
      </>
    );
  }

  /* ══════════════════════════════════════════
     FULL VENDOR DETAIL PAGE
  ══════════════════════════════════════════ */
  const coverImg = vendor.cover_image_url
    || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85';

  return (
    <>
      <style>{STYLES}</style>

      {/* ── COVER ── */}
      <section className="vd-cover">
        <img src={coverImg} alt={vendor.business_name} className="vd-cover-img" />
        <div className="vd-cover-overlay" />
        <div className="vd-cover-grain" />

        <Link to="/vendors" className="vd-cover-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Vendors
        </Link>

        <div className="vd-cover-bottom">
          <div>
            <h1 className="vd-cover-name">
              {vendor.business_name.split(' ').slice(0,-1).join(' ')}
              <em>{vendor.business_name.split(' ').slice(-1)[0]}</em>
            </h1>
          </div>
          <div className="vd-cover-cat">{vendor.category}</div>
        </div>

        <div className="vd-scroll-cue">
          <div className="vd-scroll-track" />
          <span className="vd-scroll-lbl">Scroll</span>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="vd-ticker">
        <div className="vd-ticker-inner">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="vd-ticker-item">{item}<span className="vd-ticker-dot" /></span>
          ))}
        </div>
      </div>

      {/* ── META STRIP ── */}
      <div className="vd-meta-strip">
        {[
          { label:'Category',    value: vendor.category },
          { label:'Location',    value: vendor.location },
          { label:'Price Range', value: vendor.price_range, gold:true },
          { label:'Status',      value: 'Available' },
        ].map(({ label, value, gold }, i) => (
          <div key={i} className="vd-meta-item">
            <span className="vd-meta-label">{label}</span>
            <span className={`vd-meta-value${gold ? ' gold' : ''}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* ── MAIN CONTENT ── */}
      <section className="vd-main-sec">
        <div className="vd-main-grid">

          {/* About */}
          <Reveal dir="left">
            <div>
              <span className="vd-about-sec-label">About the Vendor</span>
              <div className="vd-ornament" style={{ justifyContent:'flex-start' }}>
                <div className="vd-ornament-line" />
                <div className="vd-ornament-gem" />
                <div className="vd-ornament-line r" />
              </div>
              <h3 className="vd-about-h3">
                {vendor.business_name.split(' ').slice(0,-1).join(' ')}&nbsp;
                <em>{vendor.business_name.split(' ').slice(-1)[0]}</em>
              </h3>
              <p className="vd-about-desc">{vendor.description}</p>
              <div className="vd-about-features">
                {[
                  'Fully verified and personally vetted by our team',
                  'Prompt inquiry response within 24 hours',
                  'Flexible packages tailored to your event size',
                  'Dedicated coordinator assigned after booking',
                ].map((feat, i) => (
                  <div className="vd-about-feature" key={i}>
                    <div className="vd-feat-dot" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Thumbnail gallery */}
              <div className="vd-thumbs">
                {fallbackThumbs.map((src, i) => (
                  <div className="vd-thumb-item" key={i}>
                    <img src={src} alt="" className="vd-thumb-img" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Inquiry card */}
          <Reveal dir="right" delay={0.1}>
            <div className="vd-inquiry-card">
              <h3 className="vd-inquiry-title">Request a Quote</h3>
              <span className="vd-inquiry-sub">Respond within 24 hours</span>
              <Ornament />

              {/* original status message */}
              {submitStatus.text && (
                <div className={`vd-status-msg ${submitStatus.type}`}>
                  {submitStatus.text}
                </div>
              )}

              {/* original form — all fields, names, values, handlers unchanged */}
              <form onSubmit={handleInquirySubmit}>
                <div className="vd-field">
                  <label className="vd-label">Event Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="vd-input"
                  />
                  <div className="vd-field-bar" />
                </div>

                <div className="vd-field">
                  <label className="vd-label">Message</label>
                  <textarea
                    rows="5"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your dream wedding..."
                    className="vd-textarea"
                  />
                  <div className="vd-field-bar" />
                </div>

                <button type="submit" className="vd-submit-btn">
                  <span>Send Inquiry</span>
                </button>
              </form>

              {/* trust note */}
              <p style={{ textAlign:'center', marginTop:20, fontFamily:"'Cinzel',sans-serif", fontSize:'8px', letterSpacing:'.28em', color:'var(--muted)', textTransform:'uppercase' }}>
                Your details are never shared without consent
              </p>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ── SIMILAR VENDORS ── */}
      <section className="vd-similar-sec">
        <Reveal>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <span className="vd-eyebrow">More to Explore</span>
            <Ornament />
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2.2rem,4vw,3.4rem)', fontWeight:300, color:'var(--brand-dark)' }}>
              Similar <em style={{ fontStyle:'italic', color:'var(--brand)' }}>Vendors</em>
            </h2>
          </div>
        </Reveal>
        <div className="vd-similar-grid">
          {similarVendors.map(({ tag, name, cap, img }, i) => (
            <Reveal key={i} delay={i * 0.09} dir="plain">
              <div className="vd-sim-card">
                <img src={img} alt={name} className="vd-sim-img" loading="lazy" />
                <div className="vd-sim-grad" />
                <div className="vd-sim-info">
                  <span className="vd-sim-tag">{tag}</span>
                  <h3 className="vd-sim-name">{name}</h3>
                  <p className="vd-sim-cap">{cap}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── WHY WEDDING CHAPTER ── */}
      <section className="vd-why-sec">
        <Reveal>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <span className="vd-eyebrow" style={{ color:'var(--gold)' }}>Why Wedding Chapter</span>
            <Ornament />
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2.2rem,4vw,3.4rem)', fontWeight:300, color:'#fff' }}>
              Booking with <em style={{ fontStyle:'italic', color:'var(--gold)' }}>Confidence</em>
            </h2>
          </div>
        </Reveal>
        <div className="vd-why-grid">
          {whyPoints.map(({ num, title, text }, i) => (
            <Reveal key={i} delay={i * 0.08} dir="plain">
              <TiltCard className="vd-why-card">
                <span className="vd-why-num">{num}</span>
                <h3 className="vd-why-title">{title}</h3>
                <p className="vd-why-text">{text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="vd-cta-sec">
        {[200, 380, 560, 740].map((size, i) => (
          <div key={i} className="vd-cta-ring" style={{
            width:size, height:size, marginLeft:-size/2, marginTop:-size/2,
            animation:`vdPulseRing ${3+i*.7}s ${i*.8}s ease-out infinite`,
          }} />
        ))}
        <Reveal>
          <span className="vd-eyebrow" style={{ color:'var(--gold)' }}>Limited Dates Available</span>
          <Ornament />
          <h2 className="vd-cta-h2">
            Ready to Book<br /><em>Your Perfect Day?</em>
          </h2>
          <p className="vd-cta-sub">
            Secure this vendor before your date is taken. Send an inquiry above or explore our full curated collection.
          </p>
          <div className="vd-cta-btns">
            <Link to="/vendors" className="vd-btn-primary"><span>Browse All Vendors</span></Link>
            <Link to="/contact" className="vd-btn-outline">Contact Us</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}