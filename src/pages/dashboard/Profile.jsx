import { useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

/* ─── Injected Styles ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

  :root {
    --profile-gold: #a8835b;
    --profile-gold-light: #d4a96a;
    --profile-dark: #1e140a;
    --profile-cream: #fdf8f2;
    --profile-stone: #f0e8dc;
  }

  /* ── Keyframes ── */
  @keyframes prof-fadeUp {
    from { opacity: 0; transform: translateY(36px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes prof-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes prof-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  @keyframes prof-float {
    0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
    50%       { transform: translateY(-14px) rotate(0.5deg); }
  }
  @keyframes prof-floatR {
    0%, 100% { transform: translateY(0px) rotate(0.5deg); }
    50%       { transform: translateY(-10px) rotate(-0.5deg); }
  }
  @keyframes prof-rotateSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes prof-rotateSlowR {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }
  @keyframes prof-pulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.06); }
  }
  @keyframes prof-ringPulse {
    0%   { transform: scale(1); opacity: 0.5; }
    100% { transform: scale(1.9); opacity: 0; }
  }
  @keyframes prof-lineGrow {
    from { width: 0; }
    to   { width: 100%; }
  }
  @keyframes prof-slideRight {
    from { transform: translateX(-100%); opacity: 0; }
    to   { transform: translateX(0);     opacity: 1; }
  }
  @keyframes prof-coverReveal {
    0%   { clip-path: inset(0 100% 0 0); }
    100% { clip-path: inset(0 0% 0 0); }
  }
  @keyframes prof-avatarPop {
    0%   { transform: scale(0.6) rotate(-8deg); opacity: 0; }
    70%  { transform: scale(1.06) rotate(1deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes prof-particle {
    0%   { transform: translate(0,0) scale(1); opacity: 0.7; }
    33%  { transform: translate(12px,-18px) scale(1.15); opacity: 1; }
    66%  { transform: translate(-8px,-8px) scale(0.9); opacity: 0.6; }
    100% { transform: translate(0,0) scale(1); opacity: 0.7; }
  }
  @keyframes prof-borderDraw {
    0%   { stroke-dashoffset: 600; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes prof-tilt {
    0%, 100% { transform: perspective(900px) rotateY(0deg) rotateX(0deg); }
    25%       { transform: perspective(900px) rotateY(2.5deg) rotateX(1.5deg); }
    75%       { transform: perspective(900px) rotateY(-2.5deg) rotateX(-1.5deg); }
  }
  @keyframes prof-inputFocus {
    from { box-shadow: 0 0 0 0 rgba(168,131,91,0); }
    to   { box-shadow: 0 0 0 3px rgba(168,131,91,0.18); }
  }
  @keyframes prof-successSlide {
    from { transform: translateY(-16px); opacity: 0; }
    to   { transform: translateY(0);     opacity: 1; }
  }
  @keyframes prof-spinDot {
    0%   { transform: rotate(0deg) translateX(24px); }
    100% { transform: rotate(360deg) translateX(24px); }
  }
  @keyframes prof-modalIn {
    from { transform: scale(0.88) translateY(24px); opacity: 0; }
    to   { transform: scale(1) translateY(0); opacity: 1; }
  }
  @keyframes prof-overlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes prof-cardReveal3d {
    from { opacity: 0; transform: perspective(800px) rotateX(10deg) translateY(40px); }
    to   { opacity: 1; transform: perspective(800px) rotateX(0deg) translateY(0); }
  }

  /* ── Font helpers ── */
  .pf-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .pf-body    { font-family: 'Jost', sans-serif; }

  /* ── Reveal helpers ── */
  .pf-reveal   { animation: prof-fadeUp 0.75s cubic-bezier(0.23,1,0.32,1) both; }
  .pf-d1  { animation-delay: 0.08s; }
  .pf-d2  { animation-delay: 0.18s; }
  .pf-d3  { animation-delay: 0.28s; }
  .pf-d4  { animation-delay: 0.38s; }
  .pf-d5  { animation-delay: 0.48s; }
  .pf-d6  { animation-delay: 0.58s; }
  .pf-d7  { animation-delay: 0.68s; }

  /* ── Card 3-D hover ── */
  .pf-card-3d {
    transition: transform 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.45s ease;
    transform-style: preserve-3d;
  }
  .pf-card-3d:hover {
    transform: perspective(900px) rotateY(-2deg) rotateX(2deg) translateY(-6px);
    box-shadow: 0 36px 72px -16px rgba(100,65,20,0.18), 0 12px 32px -8px rgba(100,65,20,0.1);
  }

  /* ── Input styles ── */
  .pf-input {
    font-family: 'Jost', sans-serif;
    font-size: 0.82rem;
    border: 1px solid rgba(168,131,91,0.2);
    background: #fdf8f2;
    padding: 1rem 1.1rem;
    border-radius: 10px;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
    width: 100%;
    color: #1e140a;
    letter-spacing: 0.02em;
  }
  .pf-input:focus {
    border-color: rgba(168,131,91,0.6);
    background: #fff;
    animation: prof-inputFocus 0.3s forwards;
  }
  .pf-input:disabled {
    background: #f0e8dc;
    color: #b0a090;
    cursor: not-allowed;
    border-color: rgba(168,131,91,0.1);
  }
  .pf-input::placeholder { color: #c0ab92; }

  /* ── Label ── */
  .pf-label {
    font-family: 'Jost', sans-serif;
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: #a8835b;
    font-weight: 500;
    display: block;
    margin-bottom: 0.4rem;
  }

  /* ── Buttons ── */
  .pf-btn-primary {
    font-family: 'Jost', sans-serif;
    background: linear-gradient(135deg, #1e140a 0%, #3a2010 100%);
    color: #fff;
    padding: 0.9rem 2.5rem;
    border-radius: 999px;
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.35s cubic-bezier(0.23,1,0.32,1);
    box-shadow: 0 4px 20px rgba(30,20,10,0.25);
  }
  .pf-btn-primary:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 36px rgba(30,20,10,0.3);
    background: linear-gradient(135deg, #a8835b 0%, #d4a96a 100%);
  }

  .pf-btn-outline {
    font-family: 'Jost', sans-serif;
    background: transparent;
    color: #a8835b;
    padding: 0.6rem 1.4rem;
    border-radius: 999px;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 500;
    border: 1px solid rgba(168,131,91,0.35);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .pf-btn-outline:hover {
    background: rgba(168,131,91,0.08);
    border-color: rgba(168,131,91,0.65);
    transform: translateY(-1px);
  }

  /* ── Section divider ── */
  .pf-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(168,131,91,0.3), transparent);
    margin: 0.5rem 0;
  }

  /* ── Avatar upload ring ── */
  .pf-avatar-ring {
    position: absolute; inset: -5px;
    border-radius: 50%;
    border: 1.5px dashed rgba(168,131,91,0.45);
    animation: prof-rotateSlow 18s linear infinite;
    pointer-events: none;
  }
  .pf-avatar-ring-2 {
    position: absolute; inset: -12px;
    border-radius: 50%;
    border: 1px solid rgba(168,131,91,0.2);
    animation: prof-rotateSlowR 25s linear infinite;
    pointer-events-none;
  }

  /* ── Background mesh ── */
  .pf-mesh {
    background-image:
      radial-gradient(ellipse at 15% 30%, rgba(168,131,91,0.05) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 70%, rgba(212,169,106,0.07) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 0%,  rgba(168,131,91,0.04) 0%, transparent 40%);
  }

  /* ── Status banner ── */
  .pf-status {
    animation: prof-successSlide 0.45s cubic-bezier(0.23,1,0.32,1) both;
  }

  /* ── Hero image ── */
  .pf-hero-img {
    transition: transform 0.9s cubic-bezier(0.23,1,0.32,1);
  }
  .pf-hero-img:hover { transform: scale(1.04); }

  /* ── Stat number ── */
  .pf-stat-num {
    animation: prof-fadeUp 0.7s cubic-bezier(0.23,1,0.32,1) both;
  }

  /* ── Modal ── */
  .pf-modal-overlay { animation: prof-overlayIn 0.3s ease both; }
  .pf-modal-box     { animation: prof-modalIn 0.45s cubic-bezier(0.23,1,0.32,1) both; }

  /* ── Spinning decorative dots ── */
  .pf-spin-orbit {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  /* ── Trust badge hover ── */
  .pf-badge {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .pf-badge:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(168,131,91,0.15);
  }

  /* ── Progress ── */
  .pf-progress-fill {
    transition: width 1.4s cubic-bezier(0.23,1,0.32,1) 0.5s;
  }

  /* ── Scroll fade sections ── */
  .pf-section-3d {
    animation: prof-cardReveal3d 0.8s cubic-bezier(0.23,1,0.32,1) both;
  }
`;

/* ─── Unsplash images ─── */
const BANNER_IMG =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&h=500&fit=crop&q=85&auto=format";
const SIDE_IMG_1 =
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=800&fit=crop&q=80&auto=format";
const SIDE_IMG_2 =
  "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&h=400&fit=crop&q=80&auto=format";
const AVATAR_FALLBACK =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&q=80&auto=format";

/* ─── Field wrapper ─── */
function Field({ label, children }) {
  return (
    <div>
      <label className="pf-label">{label}</label>
      {children}
    </div>
  );
}

/* ─── Stat pill ─── */
function StatPill({ value, label, delay }) {
  return (
    <div
      className="pf-badge pf-reveal pf-mesh bg-white border border-brand/10 rounded-2xl px-6 py-5 text-center flex-1"
      style={{ animationDelay: `${delay}s` }}
    >
      <p
        className="pf-display text-4xl font-light text-brand-dark mb-0.5"
        style={{ animationDelay: `${delay + 0.15}s` }}
      >
        {value}
      </p>
      <p className="pf-body text-[9px] uppercase tracking-[0.2em] text-brand">
        {label}
      </p>
    </div>
  );
}

/* ─── Timeline row ─── */
function TimelineDot({ step, label, done }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="flex flex-col items-center">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] pf-body font-semibold transition-all duration-300 group-hover:scale-110"
          style={{
            background: done
              ? "linear-gradient(135deg,#a8835b,#d4a96a)"
              : "#f0e8dc",
            color: done ? "#fff" : "#b0a090",
            boxShadow: done ? "0 4px 12px rgba(168,131,91,0.3)" : "none",
          }}
        >
          {done ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            step
          )}
        </div>
        {step < 4 && (
          <div
            className="w-px flex-1 mt-1"
            style={{
              background: done ? "rgba(168,131,91,0.35)" : "#e8ddd0",
              minHeight: 28,
            }}
          />
        )}
      </div>
      <div className="pb-5">
        <p
          className={`pf-body text-xs font-medium ${done ? "text-brand-dark" : "text-gray-400"}`}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [status, setStatus] = useState({ type: "", text: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [formData, setFormData] = useState({
    name: storedUser?.name || "",
    phone: storedUser?.phone || "",
    address: storedUser?.address || "",
    profile_image: storedUser?.profile_image || null,
    imageFile: null,
    imagePreview: storedUser?.profile_image
      ? `https://weddings-backend.onrender.com/${storedUser.profile_image}`
      : null,
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    if (formData.imageFile) data.append("profile_image", formData.imageFile);
    try {
      const res = await axios.put(
        "https://weddings-backend.onrender.com/api/auth/update-profile",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );
      localStorage.setItem("user", JSON.stringify(res.data));
      setStatus({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setStatus({ type: "error", text: "Failed to update profile." });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "https://weddings-backend.onrender.com/api/auth/change-password",
        passwords,
        { withCredentials: true },
      );
      setStatus({ type: "success", text: "Password changed successfully!" });
      setShowPasswordModal(false);
    } catch (err) {
      setStatus({ type: "error", text: "Password change failed." });
    }
  };

  const profileComplete = [
    !!formData.name,
    !!storedUser?.email,
    !!formData.phone,
    !!formData.address,
    !!formData.imagePreview,
  ];
  const completionPct = Math.round(
    (profileComplete.filter(Boolean).length / profileComplete.length) * 100,
  );

  return (
    <DashboardLayout>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="pf-body max-w-5xl mx-auto space-y-10 pb-16">
        {/* ── Page header ── */}
        <div className="pf-reveal pf-d1 pb-8 border-b border-brand/15 relative overflow-hidden">
          {/* Decorative particles */}
          {[
            {
              top: 10,
              right: 60,
              size: 7,
              anim: "prof-particle 4s ease-in-out infinite",
              color: "rgba(168,131,91,0.3)",
            },
            {
              top: 28,
              right: 100,
              size: 4.5,
              anim: "prof-particle 6s ease-in-out infinite 2s",
              color: "rgba(212,169,106,0.4)",
            },
            {
              top: 6,
              right: 140,
              size: 5.5,
              anim: "prof-particle 5s ease-in-out infinite 1s",
              color: "rgba(168,131,91,0.2)",
            },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: p.top,
                right: p.right,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: p.color,
                animation: p.anim,
                pointerEvents: "none",
              }}
            />
          ))}
          <p className="pf-body text-[9px] uppercase tracking-[0.24em] text-brand mb-2">
            Wedding Chapter &mdash; Banquet Planning
          </p>
          <h1
            className="pf-display text-5xl md:text-6xl font-light text-brand-dark leading-none mb-4"
            style={{ letterSpacing: "-0.01em", position: "relative" }}
          >
            My Profile
            <span
              style={{
                display: "block",
                position: "absolute",
                bottom: -6,
                left: 0,
                height: 1,
                background:
                  "linear-gradient(90deg, var(--profile-gold), #d4a96a)",
                animation:
                  "prof-lineGrow 1.1s cubic-bezier(0.23,1,0.32,1) 0.4s both",
              }}
            />
          </h1>
          <p className="pf-body text-xs text-gray-500 uppercase tracking-[0.18em] mt-2">
            Manage your personal details and account security.
          </p>
        </div>

        {/* ── Status banner ── */}
        {status.text && (
          <div
            className={`pf-status pf-body rounded-xl px-6 py-4 text-xs border flex items-center gap-3 ${
              status.type === "error"
                ? "bg-red-50 text-red-700 border-red-100"
                : "bg-green-50 text-green-700 border-green-100"
            }`}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: status.type === "error" ? "#fee2e2" : "#dcfce7",
              }}
            >
              {status.type === "error" ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 2l6 6M8 2l-6 6"
                    stroke="#dc2626"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M1.5 5l2.5 2.5 4.5-5"
                    stroke="#16a34a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className="font-medium tracking-wide">{status.text}</span>
          </div>
        )}

        {/* ── Hero banner ── */}
        <div
          className="pf-reveal pf-d2 relative rounded-3xl overflow-hidden border border-brand/10 shadow-xl"
          style={{ height: 260 }}
        >
          <img
            src={BANNER_IMG}
            alt="Wedding venue"
            className="pf-hero-img w-full h-full object-cover"
            onError={(e) => {
              e.target.style.background = "#f0e8dc";
              e.target.style.display = "none";
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(20,10,0,0.62) 0%, rgba(0,0,0,0.22) 55%, rgba(100,65,20,0.45) 100%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <p className="pf-body text-[9px] uppercase tracking-[0.24em] text-amber-200/75 mb-2">
              Your Account
            </p>
            <h2
              className="pf-display text-white text-3xl md:text-4xl font-light leading-snug max-w-lg"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
            >
              Every perfect wedding begins
              <br />
              <em>with the right details.</em>
            </h2>
          </div>

          {/* Decorative rotating ring overlay */}
          <div
            className="pf-spin-orbit"
            style={{
              width: 180,
              height: 180,
              border: "1px solid rgba(255,255,255,0.1)",
              top: -50,
              right: -50,
              animation: "prof-rotateSlow 22s linear infinite",
            }}
          />
          <div
            className="pf-spin-orbit"
            style={{
              width: 110,
              height: 110,
              border: "1.5px solid rgba(255,255,255,0.08)",
              top: -20,
              right: -20,
              animation: "prof-rotateSlowR 15s linear infinite",
            }}
          />
        </div>

        {/* ── Stats row ── */}
        <div className="pf-reveal pf-d3 flex gap-4">
          <StatPill
            value={completionPct + "%"}
            label="Profile Complete"
            delay={0.3}
          />
          <StatPill
            value={storedUser?.enquiries_count ?? "—"}
            label="Enquiries Sent"
            delay={0.4}
          />
          <StatPill
            value={storedUser?.bookings_count ?? "—"}
            label="Bookings Made"
            delay={0.5}
          />
        </div>

        {/* ── Profile completion progress ── */}
        <div className="pf-reveal pf-d3 bg-white border border-brand/10 rounded-2xl p-6 pf-mesh">
          <div className="flex justify-between items-center mb-3">
            <span className="pf-body text-[9px] uppercase tracking-[0.2em] text-brand">
              Profile Strength
            </span>
            <span className="pf-body text-[9px] text-gray-400">
              {completionPct}% complete
            </span>
          </div>
          <div
            className="w-full bg-stone-100 rounded-full overflow-hidden"
            style={{ height: 4 }}
          >
            <div
              className="pf-progress-fill h-full rounded-full"
              style={{
                width: completionPct + "%",
                background: "linear-gradient(90deg, #a8835b, #d4a96a)",
              }}
            />
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {[
              { label: "Name", done: !!formData.name },
              { label: "Email", done: !!storedUser?.email },
              { label: "Phone", done: !!formData.phone },
              { label: "Address", done: !!formData.address },
              { label: "Photo", done: !!formData.imagePreview },
            ].map(({ label, done }) => (
              <span
                key={label}
                className="pf-body text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full border"
                style={{
                  background: done ? "rgba(168,131,91,0.08)" : "#f9f5f0",
                  color: done ? "#a8835b" : "#c0ab92",
                  borderColor: done
                    ? "rgba(168,131,91,0.25)"
                    : "rgba(200,185,165,0.3)",
                }}
              >
                {done ? "✓ " : ""}
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── MAIN FORM ── */}
        <form onSubmit={handleUpdateProfile} className="space-y-8">
          {/* Avatar + identity card */}
          <div
            className="pf-reveal pf-d4 pf-card-3d bg-white border border-brand/10 rounded-3xl overflow-hidden shadow-sm"
            style={{ animationDelay: "0.32s" }}
          >
            {/* Top gold accent */}
            <div
              style={{
                height: 3,
                background: "linear-gradient(90deg, #a8835b, #d4a96a, #a8835b)",
              }}
            />

            <div className="flex flex-col md:flex-row gap-8 p-8 md:p-10 items-center md:items-start">
              {/* Avatar section */}
              <div className="flex flex-col items-center gap-4 flex-shrink-0">
                <div className="relative" style={{ width: 120, height: 120 }}>
                  {/* Spinning rings */}
                  <div className="pf-avatar-ring" />
                  <div className="pf-avatar-ring-2" />

                  {/* Avatar circle */}
                  <div
                    className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl flex items-center justify-center pf-display text-4xl text-white font-light"
                    style={{
                      background: "linear-gradient(135deg, #1e140a, #a8835b)",
                      animation:
                        "prof-avatarPop 0.8s cubic-bezier(0.23,1,0.32,1) 0.3s both",
                    }}
                  >
                    {formData.imagePreview ? (
                      <img
                        src={formData.imagePreview}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = AVATAR_FALLBACK;
                        }}
                        alt="Profile"
                      />
                    ) : (
                      <span>{formData.name?.[0] || "?"}</span>
                    )}
                  </div>

                  {/* Upload button */}
                  <label
                    className="absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-transform duration-200 hover:scale-110"
                    style={{
                      background: "linear-gradient(135deg, #a8835b, #d4a96a)",
                    }}
                    title="Change photo"
                  >
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </label>

                  {/* Pulse ring on avatar */}
                  <div
                    style={{
                      position: "absolute",
                      inset: -4,
                      borderRadius: "50%",
                      border: "2px solid rgba(168,131,91,0.35)",
                      animation: "prof-ringPulse 2.8s ease-out infinite 1s",
                      pointerEvents: "none",
                    }}
                  />
                </div>
                <p className="pf-body text-[9px] uppercase tracking-widest text-gray-400 text-center">
                  Upload Photo
                </p>
              </div>

              {/* Identity info */}
              <div className="flex-1 min-w-0">
                <p className="pf-body text-[9px] uppercase tracking-[0.2em] text-brand mb-1">
                  Member Since 2024
                </p>
                <h2
                  className="pf-display text-3xl font-light text-brand-dark mb-1 leading-tight"
                  style={{
                    animation:
                      "prof-coverReveal 0.8s cubic-bezier(0.23,1,0.32,1) 0.5s both",
                  }}
                >
                  {formData.name || "Your Name"}
                </h2>
                <p className="pf-body text-sm text-gray-400 mb-6">
                  {storedUser?.email}
                </p>

                <div className="pf-divider" />

                {/* Side images collage */}
                <div className="flex gap-3 mt-5">
                  <div
                    className="rounded-xl overflow-hidden border border-brand/10 shadow-sm flex-1"
                    style={{ height: 80 }}
                  >
                    <img
                      src={SIDE_IMG_2}
                      alt="Banquet decor"
                      className="w-full h-full object-cover pf-hero-img"
                      onError={(e) => {
                        e.target.style.background = "#f0e8dc";
                      }}
                    />
                  </div>
                  <div
                    className="rounded-xl overflow-hidden border border-brand/10 shadow-sm flex-1"
                    style={{ height: 80 }}
                  >
                    <img
                      src={SIDE_IMG_1}
                      alt="Wedding venue"
                      className="w-full h-full object-cover pf-hero-img"
                      onError={(e) => {
                        e.target.style.background = "#e8ddd0";
                      }}
                    />
                  </div>
                  <div
                    className="rounded-xl border border-brand/10 flex-1 flex items-center justify-center"
                    style={{
                      height: 80,
                      background: "linear-gradient(135deg,#fdf6ee,#f0e4d0)",
                    }}
                  >
                    <div className="text-center">
                      <p className="pf-display text-2xl font-light text-brand-dark">
                        Ch.
                      </p>
                      <p className="pf-body text-[8px] uppercase tracking-widest text-brand">
                        Wedding
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Personal details form ── */}
          <div
            className="pf-reveal pf-d5 pf-card-3d pf-section-3d bg-white border border-brand/10 rounded-3xl shadow-sm overflow-hidden"
            style={{ animationDelay: "0.42s" }}
          >
            <div
              style={{
                height: 3,
                background:
                  "linear-gradient(90deg, transparent, #a8835b, transparent)",
              }}
            />

            <div className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-7">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#fdf0e0,#f5e0c0)",
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#a8835b"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <p className="pf-body text-[9px] uppercase tracking-[0.2em] text-brand">
                    Section 01
                  </p>
                  <h3 className="pf-display text-xl text-brand-dark font-light">
                    Personal Details
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Full Name">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pf-input"
                    placeholder="Your full name"
                  />
                </Field>
                <Field label="Email Address">
                  <input
                    value={storedUser?.email}
                    disabled
                    className="pf-input"
                    placeholder="Email address"
                  />
                </Field>
                <Field label="Phone Number">
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pf-input"
                    placeholder="+91 00000 00000"
                  />
                </Field>
                <Field label="Address">
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="pf-input"
                    placeholder="Your city or full address"
                  />
                </Field>
              </div>

              <div className="pf-divider mt-8 mb-6" />

              <div className="flex justify-end">
                <button type="submit" className="pf-btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* ── Planning journey sidebar card ── */}
          <div
            className="pf-reveal pf-d5 grid grid-cols-1 md:grid-cols-2 gap-6"
            style={{ animationDelay: "0.52s" }}
          >
            {/* Journey timeline */}
            <div
              className="pf-card-3d bg-white border border-brand/10 rounded-2xl p-7 pf-mesh"
              style={{
                animation:
                  "prof-cardReveal3d 0.8s cubic-bezier(0.23,1,0.32,1) 0.5s both",
              }}
            >
              <p className="pf-body text-[9px] uppercase tracking-[0.2em] text-brand mb-5">
                Your Journey
              </p>
              <TimelineDot
                step={1}
                label="Create your profile"
                done={completionPct > 0}
              />
              <TimelineDot
                step={2}
                label="Browse vendor directory"
                done={false}
              />
              <TimelineDot
                step={3}
                label="Send enquiries to vendors"
                done={false}
              />
              <TimelineDot
                step={4}
                label="Confirm and book your day"
                done={false}
              />
            </div>

            {/* Tips card */}
            <div
              className="pf-card-3d rounded-2xl overflow-hidden relative border border-brand/10 shadow-sm"
              style={{
                background:
                  "linear-gradient(135deg, #1e140a 0%, #3a2010 50%, #5a3018 100%)",
                animation:
                  "prof-cardReveal3d 0.8s cubic-bezier(0.23,1,0.32,1) 0.62s both",
              }}
            >
              <div
                className="pf-spin-orbit"
                style={{
                  width: 200,
                  height: 200,
                  border: "1px solid rgba(255,255,255,0.06)",
                  top: -80,
                  right: -80,
                  animation: "prof-rotateSlow 28s linear infinite",
                }}
              />
              <div
                className="pf-spin-orbit"
                style={{
                  width: 120,
                  height: 120,
                  border: "1px solid rgba(255,255,255,0.04)",
                  top: -40,
                  right: -40,
                  animation: "prof-rotateSlowR 18s linear infinite",
                }}
              />
              <div className="relative z-10 p-7 h-full flex flex-col justify-between">
                <div>
                  <p className="pf-body text-[9px] uppercase tracking-[0.2em] text-amber-300/70 mb-2">
                    Pro Tip
                  </p>
                  <p className="pf-display text-white text-lg font-light leading-snug">
                    A complete profile helps vendors respond faster to your
                    enquiries.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full overflow-hidden border border-white/20 flex-shrink-0"
                    style={{ animation: "prof-float 5s ease-in-out infinite" }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1490750967868-88df5691cc34?w=80&h=80&fit=crop&q=80"
                      alt="decor"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.background = "#3a2010";
                      }}
                    />
                  </div>
                  <div>
                    <p className="pf-body text-white/80 text-[10px] uppercase tracking-widest">
                      Wedding Chapter
                    </p>
                    <p className="pf-body text-white/40 text-[9px]">
                      Banquet Planning Platform
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Security section ── */}
          <div
            className="pf-reveal pf-d6 pf-card-3d bg-white border border-brand/10 rounded-3xl shadow-sm overflow-hidden"
            style={{ animationDelay: "0.58s" }}
          >
            <div
              style={{
                height: 3,
                background:
                  "linear-gradient(90deg, transparent, #a8835b, transparent)",
              }}
            />

            <div className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#fdf0e0,#f5e0c0)",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#a8835b"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <p className="pf-body text-[9px] uppercase tracking-[0.2em] text-brand">
                    Section 02
                  </p>
                  <h3 className="pf-display text-xl text-brand-dark font-light">
                    Account Security
                  </h3>
                </div>
              </div>

              <div className="pf-divider my-5" />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                  <p className="pf-body text-xs text-gray-500 mb-1 uppercase tracking-widest">
                    Password
                  </p>
                  <p className="pf-display text-brand-dark text-lg font-light">
                    &#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;
                  </p>
                  <p className="pf-body text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
                    Last updated — keep your account secure
                  </p>
                </div>

                {/* Security tips */}
                <div className="flex gap-3 flex-wrap">
                  {[
                    { label: "8+ Characters", ok: true },
                    { label: "Uppercase", ok: true },
                    { label: "Number", ok: false },
                    { label: "Symbol", ok: false },
                  ].map(({ label, ok }) => (
                    <span
                      key={label}
                      className="pf-body text-[8px] uppercase tracking-widest px-3 py-1.5 rounded-full border"
                      style={{
                        background: ok ? "rgba(16,185,129,0.06)" : "#fdf6ee",
                        color: ok ? "#059669" : "#c0ab92",
                        borderColor: ok
                          ? "rgba(16,185,129,0.2)"
                          : "rgba(200,185,165,0.25)",
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="pf-btn-outline flex-shrink-0"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* ── Trust badges ── */}
          <div
            className="pf-reveal pf-d7 grid grid-cols-3 gap-4"
            style={{ animationDelay: "0.65s" }}
          >
            {[
              {
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#a8835b"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                label: "Secure & Private",
                sub: "Data encrypted at rest",
              },
              {
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#a8835b"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                ),
                label: "Vendor Support",
                sub: "24-hr response window",
              },
              {
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#a8835b"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ),
                label: "Verified Platform",
                sub: "Trusted since 2022",
              },
            ].map(({ icon, label, sub }) => (
              <div
                key={label}
                className="pf-badge bg-white border border-brand/10 rounded-2xl p-5 flex flex-col items-center text-center gap-2 pf-mesh"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#fdf0e0,#f5e0c0)",
                  }}
                >
                  {icon}
                </div>
                <p className="pf-body text-[9px] uppercase tracking-widest text-brand-dark font-medium">
                  {label}
                </p>
                <p className="pf-body text-[8px] text-gray-400 uppercase tracking-wider">
                  {sub}
                </p>
              </div>
            ))}
          </div>
        </form>
      </div>

      {/* ── Password Modal ── */}
      {showPasswordModal && (
        <div
          className="pf-modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            background: "rgba(20,10,0,0.65)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="pf-modal-box bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md"
            style={{ border: "1px solid rgba(168,131,91,0.2)" }}
          >
            {/* Modal top bar */}
            <div
              style={{
                height: 3,
                background: "linear-gradient(90deg, #a8835b, #d4a96a)",
              }}
            />

            <div className="p-8 md:p-10">
              {/* Decorative rings */}
              <div className="relative flex justify-center mb-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#fdf0e0,#f5e0c0)",
                    animation: "prof-float 5s ease-in-out infinite",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#a8835b"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              </div>

              <p className="pf-body text-[9px] uppercase tracking-[0.22em] text-brand text-center mb-1">
                Account Security
              </p>
              <h2 className="pf-display text-3xl text-brand-dark font-light text-center mb-1">
                Update Password
              </h2>
              <p className="pf-body text-[10px] text-gray-400 text-center uppercase tracking-wider mb-7">
                Choose a strong, unique password
              </p>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <Field label="Current Password">
                  <input
                    type="password"
                    required
                    className="pf-input"
                    placeholder="Enter current password"
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        oldPassword: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field label="New Password">
                  <input
                    type="password"
                    required
                    className="pf-input"
                    placeholder="Enter new password"
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </Field>

                <div className="pf-divider" />

                <div className="flex gap-4 pt-1">
                  <button
                    type="submit"
                    className="pf-btn-primary flex-1 text-center"
                  >
                    Save Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="pf-btn-outline flex-1"
                    style={{ padding: "0.9rem 1.5rem" }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
