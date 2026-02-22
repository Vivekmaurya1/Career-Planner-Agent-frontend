import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import RoadmapFlow from "../components/RoadmapFlow";

export default function RoadmapView() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // If someone navigates here directly without state, redirect to generate
  useEffect(() => {
    if (!state?.roadmap) navigate("/generate", { replace: true });
  }, [state, navigate]);

  if (!state?.roadmap) return null;

  const { roadmap, role, level, time, duration } = state;

  const levelColors = {
    Beginner:     { bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.25)",  text: "#86efac" },
    Intermediate: { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.25)", text: "#fde68a" },
    Advanced:     { bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.25)",  text: "#fca5a5" },
  };
  const lc = levelColors[level] || levelColors.Beginner;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { background: #060610; margin: 0; }

        .rv-page {
          min-height: 100vh; background: #060610;
          font-family: 'Outfit', sans-serif;
          position: relative; overflow-x: hidden;
        }
        .rv-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 60% 40% at 80% 10%, rgba(109,40,217,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 20% 90%, rgba(37,99,235,0.07) 0%, transparent 60%);
        }
        .rv-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.018;
          background-image: linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* ── HEADER ── */
        .rv-header {
          position: relative; z-index: 10;
          padding: 80px 40px 0;
          max-width: 1400px; margin: 0 auto;
          animation: slideDown 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }

        .rv-nav-row {
          display: flex; align-items: center; gap: 12px; margin-bottom: 36px;
        }
        .rv-back {
          display: flex; align-items: center; gap: 7px;
          color: #475569; font-size: 12px; cursor: pointer;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 99px; padding: 7px 14px;
          font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em;
          transition: all 0.25s; user-select: none;
        }
        .rv-back:hover { color: #c084fc; border-color: rgba(192,132,252,0.3); background: rgba(109,40,217,0.08); }

        .rv-new {
          display: flex; align-items: center; gap: 7px;
          margin-left: auto;
          color: #475569; font-size: 12px; cursor: pointer;
          background: rgba(109,40,217,0.08);
          border: 1px solid rgba(139,92,246,0.2);
          border-radius: 99px; padding: 7px 16px;
          font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em;
          transition: all 0.25s; user-select: none;
        }
        .rv-new:hover { color: #a78bfa; border-color: rgba(139,92,246,0.4); background: rgba(109,40,217,0.15); }

        /* Hero section */
        .rv-hero {
          display: flex; align-items: flex-start; justify-content: space-between;
          flex-wrap: wrap; gap: 24px; margin-bottom: 40px;
        }
        .rv-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          color: #7c3aed; margin-bottom: 10px;
          display: flex; align-items: center; gap: 8px;
        }
        .rv-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #7c3aed;
          box-shadow: 0 0 8px #7c3aed;
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

        .rv-title {
          font-size: clamp(28px, 4vw, 44px); font-weight: 800; color: #f8fafc;
          letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 6px;
        }
        .rv-title-role {
          background: linear-gradient(135deg, #a78bfa, #60a5fa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .rv-subtitle { font-size: 14px; color: #475569; margin-top: 4px; }

        /* Meta pills */
        .rv-meta {
          display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
          align-self: flex-end;
        }
        .rv-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 99px; font-size: 12px; font-weight: 500;
          font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .rv-pill-level {
          background: ${lc.bg}; border: 1px solid ${lc.border}; color: ${lc.text};
        }
        .rv-pill-time {
          background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.2); color: #93c5fd;
        }
        .rv-pill-dur {
          background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.2); color: #c4b5fd;
        }

        /* Divider */
        .rv-divider {
          height: 1px; margin-bottom: 32px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.2), rgba(96,165,250,0.15), transparent);
        }

        /* ── ROADMAP AREA ── */
        .rv-roadmap-wrap {
          position: relative; z-index: 1;
          padding: 0 40px 80px;
          max-width: 1400px; margin: 0 auto;
          animation: fadeUp 0.7s 0.2s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .rv-header, .rv-roadmap-wrap { padding-left: 20px; padding-right: 20px; }
          .rv-header { padding-top: 70px; }
        }
      `}</style>

      <div className="rv-page">
        <div className="rv-bg" />
        <div className="rv-grid" />

        {/* ── HEADER ── */}
        <div className="rv-header">
          <div className="rv-nav-row">
            <button className="rv-back" onClick={() => navigate(-1)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>

            <button className="rv-new" onClick={() => navigate("/generate")}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Roadmap
            </button>
          </div>

          <div className="rv-hero">
            <div>
              <div className="rv-eyebrow">
                <span className="rv-eyebrow-dot" />
                Career Roadmap
              </div>
              <h1 className="rv-title">
                Your Path to <br />
                <span className="rv-title-role">{role}</span>
              </h1>
              <p className="rv-subtitle">
                Personalised learning path generated just for you
              </p>
            </div>

            <div className="rv-meta">
              {level && (
                <span className="rv-pill rv-pill-level">
                  <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {level}
                </span>
              )}
              {time && (
                <span className="rv-pill rv-pill-time">
                  <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {time}/day
                </span>
              )}
              {duration && (
                <span className="rv-pill rv-pill-dur">
                  <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {duration}
                </span>
              )}
            </div>
          </div>

          <div className="rv-divider" />
        </div>

        {/* ── ROADMAP ── */}
        <div className="rv-roadmap-wrap">
          <RoadmapFlow roadmap={roadmap} />
        </div>
      </div>
    </>
  );
}