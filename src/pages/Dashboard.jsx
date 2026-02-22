import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRoadmaps } from "../api/roadmapApi";

export default function Dashboard() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserRoadmaps();

      // ✅ Handle both { data: [...] } and plain array responses
      const list = Array.isArray(data) ? data : data?.data ?? data?.roadmaps ?? [];
      setRoadmaps(list);
    } catch (err) {
      console.error("Error fetching roadmaps:", err);
      setError(
        err?.response?.data?.message ||
        err?.response?.statusText ||
        err?.message ||
        "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── LOADING ── */
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
          .db-root { font-family: 'DM Sans', sans-serif; }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse-ring {
            0% { transform: scale(0.85); opacity: 1; }
            100% { transform: scale(1.3); opacity: 0; }
          }
        `}</style>
        <div className="db-root min-h-screen flex flex-col items-center justify-center bg-[#060912] gap-5">
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "2px solid rgba(139,92,246,0.3)",
              animation: "pulse-ring 1.2s ease-out infinite"
            }} />
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              border: "2.5px solid rgba(255,255,255,0.06)",
              borderTopColor: "#8b5cf6",
              animation: "spin 0.8s linear infinite"
            }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
            Loading your roadmaps…
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .db-root {
          min-height: 100vh;
          background: #060912;
          font-family: 'DM Sans', sans-serif;
          color: #f1f5f9;
          padding: 120px 40px 60px;
          position: relative;
          overflow-x: hidden;
        }

        /* Background orbs */
        .db-orb {
          position: fixed; border-radius: 50%;
          filter: blur(90px); pointer-events: none; opacity: 0.12;
        }
        .db-orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, #7c3aed, #4f46e5); top: -100px; left: -120px; }
        .db-orb-2 { width: 360px; height: 360px; background: radial-gradient(circle, #0ea5e9, #06b6d4); bottom: 0; right: -80px; opacity: 0.08; }

        /* Header */
        .db-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 48px; flex-wrap: wrap; gap: 16px; }
        .db-title { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; letter-spacing: -0.03em;
          background: linear-gradient(135deg, #f8fafc 40%, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .db-subtitle { font-size: 14px; color: rgba(255,255,255,0.35); margin-top: 4px; }

        .db-new-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 22px; border: none; border-radius: 14px; cursor: pointer;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
          box-shadow: 0 4px 20px rgba(124,58,237,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative; overflow: hidden;
        }
        .db-new-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(124,58,237,0.55); }
        .db-new-btn:active { transform: scale(0.97); }

        /* Error banner */
        .db-error {
          display: flex; align-items: flex-start; gap: 12px;
          background: rgba(244,63,94,0.08); border: 1px solid rgba(244,63,94,0.2);
          border-radius: 16px; padding: 16px 20px; margin-bottom: 32px;
        }
        .db-error-text { font-size: 13.5px; color: #fca5a5; line-height: 1.5; }
        .db-error-label { font-weight: 600; color: #f87171; margin-bottom: 2px; }
        .db-retry { margin-top: 8px; background: rgba(244,63,94,0.15); border: 1px solid rgba(244,63,94,0.25);
          color: #fca5a5; border-radius: 8px; padding: 6px 14px; font-size: 12.5px;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background 0.2s; }
        .db-retry:hover { background: rgba(244,63,94,0.25); }

        /* Empty state */
        .db-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          min-height: 360px; gap: 16px; text-align: center;
          border: 1px dashed rgba(255,255,255,0.08); border-radius: 24px;
          background: rgba(255,255,255,0.02);
        }
        .db-empty-icon {
          width: 64px; height: 64px; border-radius: 20px;
          background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.2);
          display: flex; align-items: center; justify-content: center;
        }
        .db-empty-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: #e2e8f0; }
        .db-empty-sub { font-size: 14px; color: rgba(255,255,255,0.3); max-width: 280px; line-height: 1.6; }
        .db-empty-btn {
          margin-top: 8px; padding: 11px 24px; border: none; border-radius: 12px; cursor: pointer;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
          box-shadow: 0 4px 16px rgba(124,58,237,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .db-empty-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(124,58,237,0.5); }

        /* Grid */
        .db-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }

        /* Card */
        .db-card {
          cursor: pointer;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 24px;
          position: relative; overflow: hidden;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s, box-shadow 0.2s;
          animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .db-card:hover {
          transform: translateY(-4px);
          border-color: rgba(124,58,237,0.35);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.15);
        }
        .db-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .db-card:hover::before { opacity: 1; }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .db-card-role {
          font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700;
          color: #f1f5f9; margin-bottom: 10px; line-height: 1.3;
        }
        .db-card-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 99px; font-size: 11.5px; font-weight: 500;
          background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.25);
          color: #a78bfa; margin-bottom: 14px;
        }
        .db-card-date { font-size: 11.5px; color: rgba(255,255,255,0.25); }

        .db-card-arrow {
          position: absolute; top: 22px; right: 22px;
          color: rgba(255,255,255,0.15); transition: color 0.2s, transform 0.2s;
        }
        .db-card:hover .db-card-arrow { color: #a78bfa; transform: translateX(2px); }

        .db-card-footer {
          margin-top: 16px; padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: space-between;
        }
        .db-card-view {
          font-size: 12.5px; color: rgba(139,92,246,0.7); font-weight: 500;
          transition: color 0.2s;
        }
        .db-card:hover .db-card-view { color: #a78bfa; }

        /* Stats bar */
        .db-stats {
          display: flex; gap: 20px; margin-bottom: 36px; flex-wrap: wrap;
        }
        .db-stat {
          padding: 14px 20px; border-radius: 14px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; gap: 12px;
        }
        .db-stat-num { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #f1f5f9; }
        .db-stat-label { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 1px; }

        @media (max-width: 640px) {
          .db-root { padding: 100px 20px 40px; }
          .db-title { font-size: 26px; }
          .db-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="db-root">
        <div className="db-orb db-orb-1" />
        <div className="db-orb db-orb-2" />

        {/* Header */}
        <div className="db-header">
          <div>
            <h1 className="db-title">Your Roadmaps</h1>
            <p className="db-subtitle">Track and continue your career journeys</p>
          </div>
          <button className="db-new-btn" onClick={() => navigate("/generate")}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Generate New
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="db-error">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" style={{ color: "#f87171", flexShrink: 0, marginTop: 2 }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75"/>
              <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div className="db-error-text">
              <div className="db-error-label">Failed to load roadmaps</div>
              <div>{error}</div>
              <button className="db-retry" onClick={fetchData}>↺ Retry</button>
            </div>
          </div>
        )}

        {/* Stats */}
        {roadmaps.length > 0 && (
          <div className="db-stats">
            <div className="db-stat">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ color: "#a78bfa" }}>
                <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
              <div>
                <div className="db-stat-num">{roadmaps.length}</div>
                <div className="db-stat-label">Total Roadmaps</div>
              </div>
            </div>
            <div className="db-stat">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ color: "#60a5fa" }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
              <div>
                <div className="db-stat-num">
                  {new Date(Math.max(...roadmaps.map(r => new Date(r.createdAt)))).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
                <div className="db-stat-label">Latest Activity</div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!error && roadmaps.length === 0 && (
          <div className="db-empty">
            <div className="db-empty-icon">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" style={{ color: "#a78bfa" }}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="db-empty-title">No roadmaps yet</div>
            <p className="db-empty-sub">Generate your first career roadmap and start building your future today.</p>
            <button className="db-empty-btn" onClick={() => navigate("/generate")}>
              🚀 Generate your first roadmap
            </button>
          </div>
        )}

        {/* Grid */}
        {roadmaps.length > 0 && (
          <div className="db-grid">
            {roadmaps.map((roadmap, i) => (
              <div
                key={roadmap.id}
                className="db-card"
                style={{ animationDelay: `${i * 0.06}s` }}
                onClick={() => navigate(`/roadmap/${roadmap.id}`)}
              >
                <svg className="db-card-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <div className="db-card-role">{roadmap.role}</div>

                <div className="db-card-badge">
                  <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {roadmap.level}
                </div>

                <div className="db-card-footer">
                  <div className="db-card-date">
                    🗓 {new Date(roadmap.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </div>
                  <div className="db-card-view">View roadmap →</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}