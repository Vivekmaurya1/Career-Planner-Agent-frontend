import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import LoadingAnimation from "../components/loading";

function Field({ label, children, delay = 0 }) {
  return (
    <div style={{
      animation: `fieldIn 0.5s ${delay}s cubic-bezier(0.22,1,0.36,1) both`,
      display: "flex", flexDirection: "column", gap: 7,
    }}>
      <label style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#475569",
      }}>{label}</label>
      {children}
    </div>
  );
}

export default function Generate() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [level, setLevel] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focuses, setFocuses] = useState({});

  const setFocus = (k, v) => setFocuses(p => ({ ...p, [k]: v }));

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 14, padding: "13px 16px",
    color: "#f1f5f9", fontFamily: "'Outfit', sans-serif",
    fontSize: 15, outline: "none", width: "100%",
    transition: "border-color 0.25s, box-shadow 0.25s, background 0.25s",
  };
  const focusedStyle = (k) => focuses[k] ? {
    ...inputStyle,
    borderColor: "rgba(139,92,246,0.5)",
    boxShadow: "0 0 0 3px rgba(109,40,217,0.12)",
    background: "rgba(255,255,255,0.06)",
  } : inputStyle;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role.trim()) return setError("Please enter a target role");
    if (!level) return setError("Please select your experience level");
    if (!time.trim()) return setError("Please enter your daily study time");

    setError(""); setLoading(true);

    try {
      const response = await axios.post("/api/roadmap/generate", {
        role, level, timePerDay: time, duration,
      });
      const data = response.data;
      if (!data.roadmap) throw new Error("No roadmap in response");

      // ✅ Pass all data to the roadmap page via router state
      navigate("/roadmap/view", {
        state: { roadmap: data.roadmap, role, level, time, duration, id: data.id },
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { background: #060610; }

        .gen-page {
          min-height: 100vh; background: #060610;
          font-family: 'Outfit', sans-serif;
          position: relative; overflow-x: hidden;
        }
        .gen-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 70% 50% at 15% 5%, rgba(109,40,217,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 60% 60% at 85% 90%, rgba(37,99,235,0.08) 0%, transparent 60%);
        }
        .gen-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.02;
          background-image: linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .gen-form-wrap {
          display: flex; align-items: center; justify-content: center;
          min-height: 100vh; padding: 80px 20px;
          position: relative; z-index: 1;
        }
        .gen-card {
          width: 100%; max-width: 500px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px; padding: 48px 44px;
          backdrop-filter: blur(30px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07);
          position: relative; overflow: hidden;
          animation: cardIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        .gen-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(96,165,250,0.3), transparent);
        }
        .gen-card-orb {
          position: absolute; width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(109,40,217,0.12), transparent 70%);
          top: -100px; right: -100px; pointer-events: none;
          animation: orbFloat 6s ease-in-out infinite;
        }
        .gen-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          color: #7c3aed; margin-bottom: 8px;
          display: flex; align-items: center; gap: 7px;
          animation: fieldIn 0.5s 0s ease both;
        }
        .gen-eyebrow-line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(124,58,237,0.4), transparent); }
        .gen-title {
          font-size: 30px; font-weight: 800; color: #f8fafc;
          letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 32px;
          animation: fieldIn 0.5s 0.05s ease both;
        }
        .gen-title span { background: linear-gradient(135deg, #a78bfa, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        .gen-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        select option { background: #0f0f1e; color: #f1f5f9; }

        .gen-error {
          background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2);
          border-radius: 12px; padding: 11px 15px;
          font-size: 13px; color: #fca5a5;
          display: flex; align-items: center; gap: 8px;
          animation: shake 0.4s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }

        .gen-submit {
          width: 100%; padding: 16px;
          background: linear-gradient(135deg, #6d28d9, #4f46e5);
          border: none; border-radius: 16px; color: white;
          font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 700;
          cursor: pointer; letter-spacing: -0.01em;
          position: relative; overflow: hidden;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
          margin-top: 8px; box-shadow: 0 8px 30px rgba(109,40,217,0.3);
          animation: fieldIn 0.5s 0.35s ease both;
        }
        .gen-submit:hover { transform: translateY(-2px) scale(1.01); box-shadow: 0 14px 40px rgba(109,40,217,0.4); }
        .gen-submit:active { transform: scale(0.98); }
        .gen-submit::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          border-radius: 16px;
        }
        .gen-submit span { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 8px; }

        .gen-loading {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          min-height: 100vh; gap: 24px; position: relative; z-index: 1;
        }
        .gen-loading-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; letter-spacing: 0.15em; color: #7c3aed; text-transform: uppercase;
        }
        .gen-loading-sub { font-size: 14px; color: #334155; margin-top: -16px; }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fieldIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes orbFloat {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(-15px, 15px); }
        }
      `}</style>

      <div className="gen-page">
        <div className="gen-bg" />
        <div className="gen-grid" />

        {loading ? (
          <div className="gen-loading">
            <LoadingAnimation />
            <div className="gen-loading-text">Generating your roadmap…</div>
            <div className="gen-loading-sub">Crafting your personalised learning path</div>
          </div>
        ) : (
          <div className="gen-form-wrap">
            <div className="gen-card">
              <div className="gen-card-orb" />

              <div className="gen-eyebrow">
                AI-Powered <div className="gen-eyebrow-line" />
              </div>
              <h2 className="gen-title">Build Your <span>Learning Path</span></h2>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Field label="Target Role" delay={0.1}>
                  <input
                    type="text" value={role}
                    placeholder="e.g. Frontend Developer, Data Scientist"
                    onChange={e => setRole(e.target.value)}
                    onFocus={() => setFocus("role", true)} onBlur={() => setFocus("role", false)}
                    style={focusedStyle("role")}
                  />
                </Field>

                <Field label="Experience Level" delay={0.15}>
                  <select value={level} onChange={e => setLevel(e.target.value)}
                    onFocus={() => setFocus("level", true)} onBlur={() => setFocus("level", false)}
                    style={{ ...focusedStyle("level"), appearance: "none" }}
                  >
                    <option value="">Select your level…</option>
                    <option value="Beginner">🌱 Beginner — just starting out</option>
                    <option value="Intermediate">⚡ Intermediate — some experience</option>
                    <option value="Advanced">🔥 Advanced — want to specialise</option>
                  </select>
                </Field>

                <div className="gen-row">
                  <Field label="Daily Time" delay={0.2}>
                    <input type="text" value={time} placeholder="e.g. 2 hours"
                      onChange={e => setTime(e.target.value)}
                      onFocus={() => setFocus("time", true)} onBlur={() => setFocus("time", false)}
                      style={focusedStyle("time")}
                    />
                  </Field>
                  <Field label="Duration" delay={0.25}>
                    <input type="text" value={duration} placeholder="e.g. 3 months"
                      onChange={e => setDuration(e.target.value)}
                      onFocus={() => setFocus("dur", true)} onBlur={() => setFocus("dur", false)}
                      style={focusedStyle("dur")}
                    />
                  </Field>
                </div>

                {error && (
                  <div className="gen-error">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="#f87171" strokeWidth="1.2"/>
                      <path d="M7 4v3M7 9.5v.5" stroke="#f87171" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                    {error}
                  </div>
                )}

                <button type="submit" className="gen-submit">
                  <span>
                    Generate My Roadmap
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}