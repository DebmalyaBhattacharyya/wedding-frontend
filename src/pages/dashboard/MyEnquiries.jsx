import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';

/* ─── Keyframe Animations (injected once) ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Didact+Gothic&display=swap');

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes floatY {
    0%, 100% { transform: translateY(0px) rotate(-1deg); }
    50%       { transform: translateY(-12px) rotate(1deg); }
  }
  @keyframes floatX {
    0%, 100% { transform: translateX(0px); }
    50%       { transform: translateX(10px); }
  }
  @keyframes pulseRing {
    0%   { transform: scale(1); opacity: 0.4; }
    100% { transform: scale(1.6); opacity: 0; }
  }
  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes lineExpand {
    from { width: 0; }
    to   { width: 100%; }
  }
  @keyframes counterUp {
    from { opacity: 0; transform: translateY(10px) scale(0.9); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(48px) rotateX(8deg); }
    to   { opacity: 1; transform: translateY(0) rotateX(0deg); }
  }
  @keyframes ribbonSlide {
    from { transform: translateX(-100%); opacity: 0; }
    to   { transform: translateX(0); opacity: 1; }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(168, 131, 91, 0.15); }
    50%       { box-shadow: 0 0 24px 8px rgba(168, 131, 91, 0.15); }
  }
  @keyframes borderTrace {
    0%   { clip-path: inset(0 100% 100% 0); }
    25%  { clip-path: inset(0 0 100% 0); }
    50%  { clip-path: inset(0 0 0 0); }
    100% { clip-path: inset(0 0 0 0); }
  }
  @keyframes tilt3d {
    0%, 100% { transform: perspective(800px) rotateY(0deg) rotateX(0deg); }
    25%       { transform: perspective(800px) rotateY(3deg) rotateX(2deg); }
    75%       { transform: perspective(800px) rotateY(-3deg) rotateX(-2deg); }
  }
  @keyframes particleFloat {
    0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
    33%  { transform: translateY(-20px) translateX(8px) scale(1.1); opacity: 1; }
    66%  { transform: translateY(-8px) translateX(-6px) scale(0.95); opacity: 0.8; }
    100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
  }

  .enq-font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .enq-font-body    { font-family: 'Didact Gothic', sans-serif; }

  .enq-hero-img {
    transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .enq-hero-img:hover {
    transform: scale(1.04);
  }

  .enq-card-3d {
    transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1),
                box-shadow 0.45s ease;
    transform-style: preserve-3d;
    perspective: 1000px;
  }
  .enq-card-3d:hover {
    transform: perspective(1000px) rotateY(-2deg) rotateX(2deg) translateY(-6px);
    box-shadow: 0 32px 64px -12px rgba(120, 85, 45, 0.18),
                0 8px 24px -4px rgba(120, 85, 45, 0.1);
  }

  .enq-stat-card {
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }
  .enq-stat-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 20px 48px -8px rgba(120, 85, 45, 0.14);
  }

  .enq-shimmer-loading {
    background: linear-gradient(90deg, #f5f0ea 25%, #ede6da 50%, #f5f0ea 75%);
    background-size: 400px 100%;
    animation: shimmer 1.4s infinite linear;
  }

  .enq-status-pending {
    position: relative;
    overflow: hidden;
  }
  .enq-status-pending::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 999px;
    animation: pulseRing 1.8s ease-out infinite;
    border: 2px solid rgb(180, 120, 30);
    opacity: 0;
  }

  .enq-vendor-img-wrap {
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
  }
  .enq-vendor-img-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(200,165,110,0.12) 0%, transparent 60%);
    pointer-events: none;
  }

  .enq-progress-bar {
    height: 3px;
    background: linear-gradient(90deg, var(--brand, #a8835b), #d4a96a);
    border-radius: 2px;
    transition: width 1.2s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .enq-section-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(168,131,91,0.35), transparent);
    margin: 2rem 0;
  }

  .enq-timeline-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--brand, #a8835b);
    box-shadow: 0 0 0 3px rgba(168,131,91,0.2);
    flex-shrink: 0;
  }

  .enq-bg-pattern {
    background-image:
      radial-gradient(circle at 20% 50%, rgba(168,131,91,0.04) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(212,169,106,0.06) 0%, transparent 40%);
  }

  .enq-reveal { animation: fadeSlideUp 0.7s cubic-bezier(0.23, 1, 0.32, 1) both; }
  .enq-reveal-d1 { animation-delay: 0.1s; }
  .enq-reveal-d2 { animation-delay: 0.2s; }
  .enq-reveal-d3 { animation-delay: 0.3s; }
  .enq-reveal-d4 { animation-delay: 0.4s; }
  .enq-reveal-d5 { animation-delay: 0.5s; }

  .enq-float { animation: floatY 6s ease-in-out infinite; }
  .enq-float-alt { animation: floatY 8s ease-in-out infinite reverse; }

  .enq-particle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .enq-particle-1 { animation: particleFloat 4s ease-in-out infinite; }
  .enq-particle-2 { animation: particleFloat 6s ease-in-out infinite 1.5s; }
  .enq-particle-3 { animation: particleFloat 5s ease-in-out infinite 3s; }

  .enq-line-anim {
    position: relative;
  }
  .enq-line-anim::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0;
    height: 1px;
    background: linear-gradient(90deg, var(--brand, #a8835b), #d4a96a);
    animation: lineExpand 1.2s cubic-bezier(0.23, 1, 0.32, 1) 0.5s both;
  }

  .enq-img-tilt {
    animation: tilt3d 10s ease-in-out infinite;
  }
`;

/* ─── Unsplash image map per category ─── */
const CATEGORY_IMAGES = {
  Catering:      'https://images.unsplash.com/photo-1555244162-803834f70033?w=120&h=120&fit=crop&q=80',
  Photography:   'https://images.unsplash.com/photo-1519741347686-c1e331f54536?w=120&h=120&fit=crop&q=80',
  Decoration:    'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=120&h=120&fit=crop&q=80',
  Music:         'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&h=120&fit=crop&q=80',
  Venue:         'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=120&h=120&fit=crop&q=80',
  Floral:        'https://images.unsplash.com/photo-1490750967868-88df5691cc34?w=120&h=120&fit=crop&q=80',
  Transport:     'https://images.unsplash.com/photo-1549439602-43ebca2327af?w=120&h=120&fit=crop&q=80',
  Makeup:        'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=120&h=120&fit=crop&q=80',
  default:       'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=120&h=120&fit=crop&q=80',
};

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&h=500&fit=crop&q=85',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&h=500&fit=crop&q=85',
  'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=900&h=500&fit=crop&q=85',
];

function getCategoryImage(category) {
  if (!category) return CATEGORY_IMAGES.default;
  const key = Object.keys(CATEGORY_IMAGES).find(k =>
    category.toLowerCase().includes(k.toLowerCase())
  );
  return key ? CATEGORY_IMAGES[key] : CATEGORY_IMAGES.default;
}

/* ─── Stat Card ─── */
function StatCard({ label, value, note, delay }) {
  return (
    <div
      className="enq-stat-card enq-reveal enq-bg-pattern bg-white border border-brand/10 rounded-2xl p-6 flex flex-col items-center text-center"
      style={{ animationDelay: `${delay}s` }}
    >
      <span
        className="enq-font-display text-5xl font-light text-brand-dark mb-1"
        style={{ animation: 'counterUp 0.7s cubic-bezier(0.23,1,0.32,1) both', animationDelay: `${delay + 0.2}s` }}
      >
        {value}
      </span>
      <span className="enq-font-body text-[10px] uppercase tracking-[0.18em] text-brand font-medium">{label}</span>
      {note && <span className="text-[10px] text-gray-400 mt-1 enq-font-body">{note}</span>}
    </div>
  );
}

/* ─── Timeline Step ─── */
function TimelineStep({ step, label, active, delay }) {
  return (
    <div
      className="flex items-center gap-3 enq-reveal"
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        className="enq-timeline-dot"
        style={active ? {} : { background: '#e0d5c8', boxShadow: 'none' }}
      />
      <span className={`enq-font-body text-xs uppercase tracking-widest ${active ? 'text-brand-dark font-medium' : 'text-gray-400'}`}>
        {step}. {label}
      </span>
    </div>
  );
}

/* ─── Enquiry Card ─── */
function EnquiryCard({ enquiry, index }) {
  const imgSrc = getCategoryImage(enquiry.category);
  const isPending = enquiry.status === 'Pending';

  return (
    <div
      className="enq-card-3d enq-reveal bg-white border border-brand/10 rounded-2xl overflow-hidden"
      style={{ animationDelay: `${0.1 + index * 0.12}s` }}
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{
          background: isPending
            ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
            : 'linear-gradient(90deg, #10b981, #34d399)',
        }}
      />

      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Vendor image */}
        <div className="enq-vendor-img-wrap rounded-xl w-20 h-20 md:w-28 md:h-28 shadow-md border border-brand/10">
          <img
            src={imgSrc}
            alt={enquiry.category}
            className="enq-hero-img w-full h-full object-cover"
            onError={(e) => { e.target.src = CATEGORY_IMAGES.default; }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="enq-font-body bg-brand/8 text-brand px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.14em] border border-brand/15">
              {enquiry.category || 'General'}
            </span>
            {isPending && (
              <span className="enq-status-pending enq-font-body bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Awaiting Response
              </span>
            )}
            {!isPending && (
              <span className="enq-font-body bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Responded
              </span>
            )}
          </div>

          <h3 className="enq-font-display text-2xl text-brand-dark leading-tight mb-1">
            {enquiry.business_name}
          </h3>
          <p className="enq-font-body text-xs text-gray-400 uppercase tracking-widest mb-4">
            Vendor Enquiry Submitted
          </p>

          {/* Message quote */}
          <blockquote className="relative pl-4 border-l-2 border-brand/30 bg-stone-50/70 rounded-r-xl p-4">
            <p className="enq-font-display italic text-gray-600 text-base leading-relaxed">
              "{enquiry.message}"
            </p>
          </blockquote>

          {/* Details row */}
          <div className="flex flex-wrap gap-6 mt-4">
            <div>
              <p className="enq-font-body text-[9px] uppercase tracking-[0.18em] text-gray-400 mb-0.5">Event Date</p>
              <p className="enq-font-display text-brand-dark text-sm font-medium">
                {new Date(enquiry.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="enq-font-body text-[9px] uppercase tracking-[0.18em] text-gray-400 mb-0.5">Sent On</p>
              <p className="enq-font-display text-brand-dark text-sm font-medium">
                {new Date(enquiry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="enq-font-body text-[9px] uppercase tracking-[0.18em] text-gray-400 mb-0.5">Response Time</p>
              <p className="enq-font-display text-brand-dark text-sm font-medium">
                {isPending ? 'Within 24 hrs' : 'Completed'}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex justify-between mb-1">
              <span className="enq-font-body text-[9px] uppercase tracking-widest text-gray-400">Enquiry Progress</span>
              <span className="enq-font-body text-[9px] text-brand">{isPending ? '50%' : '100%'}</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1 overflow-hidden">
              <div
                className="enq-progress-bar"
                style={{ width: isPending ? '50%' : '100%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className="enq-bg-pattern border-t border-brand/8 px-6 md:px-8 py-3 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: isPending ? '#f59e0b' : '#10b981',
              boxShadow: `0 0 6px ${isPending ? '#fbbf24' : '#34d399'}`,
            }}
          />
          <span className="enq-font-body text-[10px] uppercase tracking-widest text-gray-500">
            {isPending ? 'Vendor notified — awaiting confirmation' : 'Vendor has confirmed your enquiry'}
          </span>
        </div>
        <span className="enq-font-body text-[10px] text-brand uppercase tracking-widest cursor-pointer hover:text-brand-dark transition-colors">
          View Details &rsaquo;
        </span>
      </div>
    </div>
  );
}

/* ─── Loading Skeleton ─── */
function LoadingSkeleton() {
  return (
    <DashboardLayout>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="space-y-6">
        <div className="pb-6 border-b border-brand/20">
          <div className="enq-shimmer-loading h-10 w-72 rounded-lg mb-3" />
          <div className="enq-shimmer-loading h-4 w-48 rounded" />
        </div>
        <div className="enq-shimmer-loading h-56 rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="enq-shimmer-loading h-28 rounded-2xl" />
          ))}
        </div>
        {[1,2].map(i => (
          <div key={i} className="enq-shimmer-loading h-52 rounded-2xl" />
        ))}
      </div>
    </DashboardLayout>
  );
}

/* ─── Main Component ─── */
export default function MyEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImg, setHeroImg] = useState(0);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await axios.get('https://weddings-backend.onrender.com/api/inquiries/my-inquiries', {
          withCredentials: true,
        });
        setEnquiries(res.data);
      } catch (err) {
        console.error('Error fetching enquiries:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImg(prev => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSkeleton />;

  const totalEnquiries = enquiries.length;
  const pendingCount  = enquiries.filter(e => e.status === 'Pending').length;
  const repliedCount  = totalEnquiries - pendingCount;

  return (
    <DashboardLayout>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="enq-font-body space-y-10">

        {/* ── Header ── */}
        <div className="enq-reveal pb-8 border-b border-brand/15 relative overflow-hidden">
          {/* Decorative particles */}
          <div
            className="enq-particle enq-particle-1"
            style={{ top: 12, right: 80, width: 8, height: 8, background: 'rgba(168,131,91,0.25)' }}
          />
          <div
            className="enq-particle enq-particle-2"
            style={{ top: 28, right: 120, width: 5, height: 5, background: 'rgba(212,169,106,0.35)' }}
          />
          <div
            className="enq-particle enq-particle-3"
            style={{ top: 8, right: 160, width: 6, height: 6, background: 'rgba(168,131,91,0.2)' }}
          />

          <p className="enq-font-body text-[10px] uppercase tracking-[0.22em] text-brand mb-2 enq-reveal enq-reveal-d1">
            Wedding Chapter &mdash; Banquet Planning
          </p>
          <h1
            className="enq-font-display enq-line-anim text-5xl md:text-6xl font-light text-brand-dark mb-4 leading-none"
            style={{ letterSpacing: '-0.01em' }}
          >
            My Enquiries
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-[0.18em] font-medium enq-reveal enq-reveal-d2 max-w-lg">
            Track every conversation with your vendors &mdash; from the first message to confirmed booking.
          </p>
        </div>

        {/* ── Hero collage ── */}
        <div
          className="enq-reveal enq-reveal-d2 relative rounded-3xl overflow-hidden shadow-xl border border-brand/10"
          style={{ height: '300px' }}
        >
          {HERO_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Banquet venue"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
              style={{ opacity: i === heroImg ? 1 : 0 }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ))}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(30,20,10,0.55) 0%, rgba(0,0,0,0.2) 50%, rgba(120,85,45,0.4) 100%)',
            }}
          />

          {/* Hero text overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <p className="enq-font-body text-[10px] uppercase tracking-[0.22em] text-amber-200/80 mb-2">
              Your Journey
            </p>
            <h2
              className="enq-font-display text-white text-3xl md:text-4xl font-light leading-tight max-w-md"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}
            >
              Every dream wedding begins<br />
              <em>with a single message</em>
            </h2>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-4 right-6 flex gap-2">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroImg(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === heroImg ? 20 : 6,
                  height: 6,
                  background: i === heroImg ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 gap-4 enq-reveal enq-reveal-d3">
          <StatCard label="Total Sent"     value={totalEnquiries} note="All time"         delay={0.3} />
          <StatCard label="Awaiting Reply" value={pendingCount}   note="Active threads"   delay={0.4} />
          <StatCard label="Confirmed"      value={repliedCount}   note="Vendor responses" delay={0.5} />
        </div>

        {/* ── Planning Journey timeline ── */}
        <div className="enq-reveal enq-reveal-d3 bg-white border border-brand/10 rounded-2xl p-6 md:p-8 enq-bg-pattern">
          <p className="enq-font-body text-[9px] uppercase tracking-[0.2em] text-brand mb-4">Your Planning Journey</p>
          <div className="flex flex-col gap-3">
            <TimelineStep step="01" label="Browse vendors & shortlist"  active={true}  delay={0.35} />
            <TimelineStep step="02" label="Send enquiries to vendors"    active={totalEnquiries > 0} delay={0.42} />
            <TimelineStep step="03" label="Receive vendor confirmations" active={repliedCount > 0}  delay={0.49} />
            <TimelineStep step="04" label="Finalise bookings & payments" active={false} delay={0.56} />
            <TimelineStep step="05" label="Celebrate your perfect day"   active={false} delay={0.63} />
          </div>
        </div>

        {/* ── Section heading ── */}
        <div className="enq-reveal enq-reveal-d3 flex items-center gap-4">
          <div className="enq-section-divider flex-1" />
          <span className="enq-font-body text-[10px] uppercase tracking-[0.22em] text-brand whitespace-nowrap">
            {totalEnquiries > 0 ? `${totalEnquiries} Enquir${totalEnquiries > 1 ? 'ies' : 'y'} Found` : 'No Enquiries Yet'}
          </span>
          <div className="enq-section-divider flex-1" />
        </div>

        {/* ── Empty state ── */}
        {enquiries.length === 0 && (
          <div
            className="enq-reveal enq-reveal-d4 bg-white border border-brand/10 rounded-3xl overflow-hidden shadow-sm"
            style={{ animation: 'glowPulse 3s ease-in-out infinite 1s' }}
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&h=400&fit=crop&q=80"
                alt="Empty venue"
                className="w-full h-full object-cover enq-img-tilt"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0) 30%, rgba(255,255,255,1) 100%)' }}
              />
            </div>
            <div className="p-10 md:p-16 text-center -mt-10 relative z-10">
              <div className="enq-float inline-flex w-20 h-20 bg-brand-light rounded-full border border-brand/20 items-center justify-center mb-6 shadow-lg">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="enq-font-display text-3xl text-brand-dark mb-3">No Enquiries Found</h3>
              <p className="text-gray-500 max-w-sm mx-auto text-sm mb-8 leading-relaxed enq-font-body">
                You haven't contacted any vendors yet. Browse our curated directory of wedding and banquet vendors to begin your planning journey.
              </p>
              <a
                href="/vendors"
                className="enq-font-body inline-block bg-brand-dark text-white px-10 py-3.5 uppercase tracking-[0.18em] text-[10px] font-bold hover:bg-brand transition-all duration-300 rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5"
              >
                Browse Directory
              </a>
            </div>
          </div>
        )}

        {/* ── Enquiry cards ── */}
        {enquiries.length > 0 && (
          <div className="flex flex-col gap-6">
            {enquiries.map((enquiry, idx) => (
              <EnquiryCard key={enquiry.id} enquiry={enquiry} index={idx} />
            ))}
          </div>
        )}

        {/* ── Bottom tip banner ── */}
        {enquiries.length > 0 && (
          <div
            className="enq-reveal enq-reveal-d5 rounded-2xl overflow-hidden relative border border-brand/10"
            style={{ background: 'linear-gradient(135deg, #fdf6ee 0%, #f5ede0 100%)' }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
              <div className="enq-float-alt flex-shrink-0 w-16 h-16 rounded-full border border-brand/20 overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1490750967868-88df5691cc34?w=100&h=100&fit=crop&q=80"
                  alt="Wedding decor"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.background = '#e8d9c5'; }}
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="enq-font-body text-[9px] uppercase tracking-[0.2em] text-brand mb-1">Planning Tip</p>
                <p className="enq-font-display text-brand-dark text-lg font-light leading-snug">
                  Vendors typically respond within <strong className="font-semibold">24&ndash;48 hours.</strong> Send a follow-up if you haven't heard back in two days.
                </p>
              </div>
              <a
                href="/vendors"
                className="enq-font-body flex-shrink-0 border border-brand text-brand px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest hover:bg-brand hover:text-white transition-all duration-300"
              >
                Add Vendors
              </a>
            </div>

            {/* Decorative rotating ring */}
            <div
              className="absolute -right-8 -top-8 w-32 h-32 rounded-full border-2 border-brand/10 pointer-events-none"
              style={{ animation: 'rotateSlow 20s linear infinite' }}
            />
            <div
              className="absolute -right-4 -top-4 w-20 h-20 rounded-full border border-brand/15 pointer-events-none"
              style={{ animation: 'rotateSlow 14s linear infinite reverse' }}
            />
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}