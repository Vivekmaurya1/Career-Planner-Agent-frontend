import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(formData.email, formData.password);
    setLoading(false);
    if (result.success) {
      navigate("/generate");
    } else {
      setError(result.message || "Invalid email or password.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: #060912;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden; position: relative;
        }

        .orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.18;
          animation: drift 12s ease-in-out infinite alternate;
          pointer-events: none;
        }
        .orb-1 { width:520px; height:520px; background:radial-gradient(circle,#7c3aed,#4f46e5); top:-120px; left:-100px; animation-duration:14s; }
        .orb-2 { width:400px; height:400px; background:radial-gradient(circle,#0ea5e9,#06b6d4); bottom:-80px; right:-80px; animation-duration:10s; animation-delay:-5s; }
        .orb-3 { width:260px; height:260px; background:radial-gradient(circle,#f43f5e,#ec4899); top:50%; right:20%; animation-duration:16s; animation-delay:-3s; opacity:0.1; }
        @keyframes drift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(40px,30px) scale(1.06); }
        }

        .grid-overlay {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .card {
          position: relative; z-index: 10;
          width: 420px; padding: 48px 44px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          backdrop-filter: blur(32px);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 80px rgba(0,0,0,0.6);
          animation: cardIn 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes cardIn {
          from { opacity:0; transform:translateY(28px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }

        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px;
          background: rgba(124,58,237,0.2); border: 1px solid rgba(124,58,237,0.35);
          border-radius: 99px; color: #a78bfa;
          font-size: 11.5px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
          margin-bottom: 24px;
          animation: cardIn 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both;
        }
        .badge-dot {
          width: 6px; height: 6px; background: #7c3aed; border-radius: 50%;
          box-shadow: 0 0 8px #7c3aed; animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.8); }
        }

        .heading {
          font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800;
          color: #f8fafc; line-height: 1.1; margin-bottom: 6px;
          animation: cardIn 0.7s 0.15s cubic-bezier(0.16,1,0.3,1) both;
        }
        .subheading {
          font-size: 14px; color: rgba(255,255,255,0.38);
          margin-bottom: 36px; font-weight: 300;
          animation: cardIn 0.7s 0.2s cubic-bezier(0.16,1,0.3,1) both;
        }

        .field { margin-bottom: 16px; }
        .field-1 { animation: cardIn 0.7s 0.25s cubic-bezier(0.16,1,0.3,1) both; }
        .field-2 { animation: cardIn 0.7s 0.30s cubic-bezier(0.16,1,0.3,1) both; }

        .field-label {
          display: block; font-size: 12px; font-weight: 500;
          letter-spacing: 0.05em; text-transform: uppercase;
          color: rgba(255,255,255,0.45); margin-bottom: 8px;
        }
        .field-wrap { position: relative; }
        .field-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.25); pointer-events: none; transition: color 0.2s;
          display: flex; align-items: center;
        }
        .field-wrap.focused .field-icon { color: #7c3aed; }

        .field-input {
          width: 100%; padding: 13px 16px 13px 42px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px; color: #f1f5f9; font-size: 15px;
          font-family: 'DM Sans', sans-serif; outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.2); }
        .field-input:focus {
          border-color: rgba(124,58,237,0.6);
          background: rgba(124,58,237,0.07);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
        }

        .error-msg {
          display: flex; align-items: center; gap: 7px;
          background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.25);
          border-radius: 10px; padding: 10px 14px;
          color: #fda4af; font-size: 13px; margin-bottom: 16px;
          animation: shake 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes shake {
          0%,100% { transform:translateX(0); }
          25%      { transform:translateX(-6px); }
          75%      { transform:translateX(6px); }
        }

        .forgot-row {
          display: flex; justify-content: flex-end;
          margin: -4px 0 24px;
          animation: cardIn 0.7s 0.32s cubic-bezier(0.16,1,0.3,1) both;
        }
        .forgot-link {
          font-size: 13px; color: rgba(167,139,250,0.7);
          cursor: pointer; text-decoration: none; transition: color 0.2s;
        }
        .forgot-link:hover { color: #a78bfa; }

        .btn {
          width: 100%; padding: 14px; border: none; border-radius: 12px;
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          letter-spacing: 0.03em; cursor: pointer;
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
          color: #fff; box-shadow: 0 4px 24px rgba(124,58,237,0.4);
          transition: transform 0.15s, box-shadow 0.15s;
          animation: cardIn 0.7s 0.36s cubic-bezier(0.16,1,0.3,1) both;
        }
        .btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(124,58,237,0.55); }
        .btn:active:not(:disabled) { transform: translateY(1px); }
        .btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .btn-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
          transform: translateX(-100%);
        }
        .btn:hover:not(:disabled) .btn-shimmer { animation: shimmer 0.6s ease forwards; }
        @keyframes shimmer { to { transform: translateX(100%); } }
        .btn-inner { display: flex; align-items: center; justify-content: center; gap: 8px; position: relative; z-index: 1; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex; align-items: center; gap: 12px; margin: 24px 0;
          animation: cardIn 0.7s 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .divider-text { font-size: 12px; color: rgba(255,255,255,0.2); }

        .footer {
          text-align: center; font-size: 13.5px; color: rgba(255,255,255,0.3);
          animation: cardIn 0.7s 0.44s cubic-bezier(0.16,1,0.3,1) both;
        }
        .footer a {
          color: #a78bfa; text-decoration: none; font-weight: 500;
          cursor: pointer; transition: color 0.2s;
        }
        .footer a:hover { color: #c4b5fd; }
      `}</style>

      <div className="login-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />

        <div className="card">
          <div className="badge">
            <span className="badge-dot" />
            Secure Login
          </div>

          <h1 className="heading">Welcome back</h1>
          <p className="subheading">Sign in to continue to your workspace</p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-msg">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <div className="field field-1">
              <label className="field-label">Email address</label>
              <div className={`field-wrap${focused === "email" ? " focused" : ""}`}>
                <span className="field-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.75"/>
                    <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  type="email" name="email" placeholder="you@example.com"
                  className="field-input"
                  value={formData.email} onChange={handleChange}
                  onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                  required
                />
              </div>
            </div>

            <div className="field field-2">
              <label className="field-label">Password</label>
              <div className={`field-wrap${focused === "password" ? " focused" : ""}`}>
                <span className="field-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.75"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  type="password" name="password" placeholder="••••••••"
                  className="field-input"
                  value={formData.password} onChange={handleChange}
                  onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
                  required
                />
              </div>
            </div>

            <div className="forgot-row">
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button className="btn" type="submit" disabled={loading}>
              <span className="btn-shimmer" />
              <span className="btn-inner">
                {loading ? (
                  <><span className="spinner" /> Signing in…</>
                ) : (
                  <>
                    Sign in
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">or</span>
            <div className="divider-line" />
          </div>

          <p className="footer">
            Don't have an account?{" "}
            <a onClick={() => navigate("/register")}>Create one free</a>
          </p>
        </div>
      </div>
    </>
  );
}