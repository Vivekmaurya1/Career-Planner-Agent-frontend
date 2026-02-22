import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [hovered, setHovered] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const indicatorRef = useRef(null);
    const navLinksRef = useRef({});
    const profileRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const isLanding = location.pathname === "/";

    // Links adapt based on current route
    const landingLinks = [
        { label: "Features",     key: "features", action: () => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" }) },
        { label: "How It Works", key: "how",      action: () => document.querySelector("#how")?.scrollIntoView({ behavior: "smooth" }) },
        { label: "Get Started",  key: "cta",      action: () => document.querySelector("#cta")?.scrollIntoView({ behavior: "smooth" }) },
    ];

    const appLinks = [
        { label: "Dashboard", key: "dashboard", action: () => navigate("/dashboard") },
        { label: "Generate",  key: "generate",  action: () => navigate("/generate") },
    ];

    const links = isLanding ? landingLinks : (user ? appLinks : landingLinks);

    // Sync active key to route when not on landing
    useEffect(() => {
        if (!isLanding) {
            const path = location.pathname.replace("/", "");
            setActive(path);
        } else {
            setActive("");
        }
    }, [location.pathname, isLanding]);

    useEffect(() => {
        setTimeout(() => setMounted(true), 50);
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        const key = hovered || active;
        const el = navLinksRef.current[key];
        const ind = indicatorRef.current;
        if (el && ind) {
            const wrap = el.closest(".nav-links-wrap");
            if (!wrap) return;
            const rect = el.getBoundingClientRect();
            const parentRect = wrap.getBoundingClientRect();
            ind.style.width = rect.width + "px";
            ind.style.left = rect.left - parentRect.left + "px";
            ind.style.opacity = "1";
        } else if (ind) {
            ind.style.opacity = "0";
        }
    }, [hovered, active]);

    const getInitials = () => {
        if (!user) return "";
        if (user.name) return user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
        if (user.email) return user.email[0].toUpperCase();
        return "U";
    };

    const avatarColors = [
        ["#7c3aed", "#4f46e5"],
        ["#0ea5e9", "#06b6d4"],
        ["#f43f5e", "#ec4899"],
        ["#f97316", "#eab308"],
        ["#22c55e", "#10b981"],
    ];
    const colorIdx = user ? (user.email?.charCodeAt(0) || 0) % avatarColors.length : 0;
    const [c1, c2] = avatarColors[colorIdx];

    const handleLogoClick = () => {
        if (isLanding) window.scrollTo({ top: 0, behavior: "smooth" });
        else navigate("/");
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        .nav-root {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          font-family: 'Outfit', sans-serif;
          transition: padding 0.4s ease;
        }
        .nav-root::before {
          content: '';
          position: absolute; top: 0; left: 20%; right: 20%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(96,165,250,0.4), transparent);
          opacity: 0; transition: opacity 0.4s;
        }
        .nav-root.scrolled::before { opacity: 1; }

        /* Always show glass bg on non-landing pages */
        .nav-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 32px;
          background: rgba(6,6,16,0);
          transition: background 0.4s ease, padding 0.4s ease, box-shadow 0.4s ease;
        }
        .nav-root.scrolled .nav-inner,
        .nav-root.app-page .nav-inner {
          background: rgba(6,6,16,0.88);
          backdrop-filter: blur(24px) saturate(180%);
          padding: 10px 32px;
          box-shadow: 0 1px 0 rgba(255,255,255,0.06), 0 8px 40px rgba(0,0,0,0.4);
        }
        .nav-root.app-page::before { opacity: 1; }

        /* ── LOGO ── */
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          cursor: pointer; user-select: none;
          opacity: 0; transform: translateY(-8px);
          transition: opacity 0.5s, transform 0.5s;
        }
        .nav-logo.mounted { opacity: 1; transform: translateY(0); }
        .nav-logo-mark {
          width: 32px; height: 32px; border-radius: 10px;
          background: linear-gradient(135deg, #6d28d9, #4f46e5);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          box-shadow: 0 4px 16px rgba(109,40,217,0.4);
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
        }
        .nav-logo:hover .nav-logo-mark {
          transform: scale(1.1) rotate(-4deg);
          box-shadow: 0 6px 24px rgba(109,40,217,0.6);
        }
        .nav-logo-mark::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
        }
        .nav-logo-mark svg { position: relative; z-index: 1; }
        .nav-logo-text {
          font-size: 18px; font-weight: 800; letter-spacing: -0.03em;
          background: linear-gradient(135deg, #f8fafc 30%, #a78bfa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          transition: filter 0.3s;
        }
        .nav-logo:hover .nav-logo-text { filter: brightness(1.2); }
        .nav-logo-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px; letter-spacing: 0.1em;
          background: rgba(109,40,217,0.2); border: 1px solid rgba(139,92,246,0.3);
          color: #a78bfa; border-radius: 5px; padding: 2px 5px;
          align-self: flex-start; margin-top: 2px;
        }

        /* ── BREADCRUMB (non-landing) ── */
        .nav-breadcrumb {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: rgba(255,255,255,0.3);
          margin-left: 4px;
        }
        .nav-breadcrumb-sep { opacity: 0.3; }
        .nav-breadcrumb-page {
          color: rgba(255,255,255,0.7); font-weight: 500;
          text-transform: capitalize;
        }

        /* ── NAV LINKS ── */
        .nav-links-wrap {
          position: relative;
          display: flex; align-items: center; gap: 4px;
        }
        .nav-indicator {
          position: absolute; bottom: -2px; height: 2px; border-radius: 99px;
          background: linear-gradient(90deg, #8b5cf6, #60a5fa);
          box-shadow: 0 0 10px rgba(139,92,246,0.5);
          transition: left 0.3s cubic-bezier(0.34,1.4,0.64,1),
                      width 0.3s cubic-bezier(0.34,1.4,0.64,1),
                      opacity 0.2s;
          pointer-events: none;
        }
        .nav-link {
          position: relative;
          font-size: 14px; font-weight: 500; color: #64748b;
          text-decoration: none; padding: 8px 14px; border-radius: 10px;
          background: none; border: none; cursor: pointer; font-family: 'Outfit', sans-serif;
          transition: color 0.25s, background 0.25s;
          white-space: nowrap;
          opacity: 0; transform: translateY(-6px);
        }
        .nav-link.mounted {
          opacity: 1; transform: translateY(0);
          transition: color 0.25s, background 0.25s, opacity 0.4s, transform 0.4s;
        }
        .nav-link:hover { color: #f1f5f9; background: rgba(255,255,255,0.05); }
        .nav-link.active-link {
          color: #f1f5f9;
          background: rgba(139,92,246,0.08);
        }

        /* ── LOGIN BUTTON ── */
        .nav-login {
          position: relative; overflow: hidden;
          display: flex; align-items: center; gap: 7px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          color: #e2e8f0; border-radius: 12px;
          padding: 9px 20px;
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; letter-spacing: -0.01em;
          opacity: 0; transform: translateY(-8px);
          white-space: nowrap;
          transition: border-color 0.25s, color 0.25s, box-shadow 0.25s, transform 0.2s;
        }
        .nav-login.mounted {
          opacity: 1; transform: translateY(0);
          transition: border-color 0.25s, color 0.25s, box-shadow 0.25s,
                      transform 0.2s cubic-bezier(0.34,1.56,0.64,1),
                      opacity 0.5s 0.2s, transform 0.5s 0.2s cubic-bezier(0.22,1,0.36,1);
        }
        .nav-login::before {
          content: ''; position: absolute; inset: 0; border-radius: 12px;
          background: linear-gradient(135deg, rgba(109,40,217,0.15), rgba(79,70,229,0.1));
          opacity: 0; transition: opacity 0.25s;
        }
        .nav-login:hover {
          border-color: rgba(139,92,246,0.5); color: #f1f5f9;
          box-shadow: 0 0 20px rgba(109,40,217,0.2), inset 0 1px 0 rgba(255,255,255,0.08);
          transform: translateY(-1px);
        }
        .nav-login:hover::before { opacity: 1; }
        .nav-login:active { transform: scale(0.97); }
        .nav-login span { position: relative; z-index: 1; }
        .nav-login svg { position: relative; z-index: 1; transition: transform 0.25s; }
        .nav-login:hover svg { transform: translateX(2px); }

        /* ── PROFILE ── */
        .nav-profile-wrap {
          position: relative;
          opacity: 0; transform: translateY(-8px);
          transition: opacity 0.5s 0.2s, transform 0.5s 0.2s cubic-bezier(0.22,1,0.36,1);
        }
        .nav-profile-wrap.mounted { opacity: 1; transform: translateY(0); }
        .nav-profile-btn {
          display: flex; align-items: center; gap: 9px;
          padding: 5px 12px 5px 5px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 99px; cursor: pointer;
          transition: background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        .nav-profile-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(139,92,246,0.4);
          box-shadow: 0 0 16px rgba(109,40,217,0.2);
          transform: translateY(-1px);
        }
        .nav-profile-btn.open {
          background: rgba(109,40,217,0.12);
          border-color: rgba(139,92,246,0.45);
          box-shadow: 0 0 20px rgba(109,40,217,0.25);
        }
        .nav-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #fff;
          flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          position: relative;
        }
        .nav-avatar::after {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
        }
        .nav-avatar-dot {
          position: absolute; bottom: 0; right: 0;
          width: 8px; height: 8px; border-radius: 50%;
          background: #22c55e; border: 1.5px solid #060912;
          box-shadow: 0 0 6px rgba(34,197,94,0.6);
        }
        .nav-profile-name {
          font-size: 13px; font-weight: 600; color: #e2e8f0;
          max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .nav-profile-chevron {
          color: rgba(255,255,255,0.4);
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), color 0.2s;
        }
        .nav-profile-btn.open .nav-profile-chevron { transform: rotate(180deg); color: #a78bfa; }

        /* Dropdown */
        .nav-profile-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          width: 220px;
          background: rgba(8,8,20,0.97);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px; padding: 6px;
          backdrop-filter: blur(30px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(109,40,217,0.08);
          transform-origin: top right;
          animation: dropIn 0.25s cubic-bezier(0.22,1,0.36,1) both;
          z-index: 200;
        }
        .nav-profile-dropdown::before {
          content: ''; position: absolute; top: 0; left: 20%; right: 20%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent);
        }
        @keyframes dropIn {
          from { opacity: 0; transform: scale(0.92) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .nav-dd-header {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 4px;
        }
        .nav-dd-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #fff;
          flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.3); position: relative;
        }
        .nav-dd-avatar::after {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
        }
        .nav-dd-info { overflow: hidden; }
        .nav-dd-name { font-size: 13px; font-weight: 600; color: #f1f5f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .nav-dd-email { font-size: 11px; color: rgba(255,255,255,0.3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
        .nav-dd-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 12px;
          color: rgba(255,255,255,0.55);
          font-size: 13.5px; font-weight: 500;
          cursor: pointer; border: none; background: none; width: 100%;
          text-align: left; font-family: 'Outfit', sans-serif;
          transition: background 0.18s, color 0.18s;
        }
        .nav-dd-item:hover { background: rgba(255,255,255,0.06); color: #f1f5f9; }
        .nav-dd-item svg { flex-shrink: 0; opacity: 0.6; transition: opacity 0.18s; }
        .nav-dd-item:hover svg { opacity: 1; }
        .nav-dd-item.active-dd { background: rgba(139,92,246,0.1); color: #c4b5fd; }
        .nav-dd-item.active-dd svg { opacity: 1; color: #a78bfa; }
        .nav-dd-item.danger { color: rgba(248,113,113,0.7); }
        .nav-dd-item.danger:hover { background: rgba(244,63,94,0.1); color: #fca5a5; }
        .nav-dd-sep { height: 1px; background: rgba(255,255,255,0.05); margin: 4px 6px; }

        /* ── HAMBURGER ── */
        .nav-hamburger {
          display: none;
          flex-direction: column; justify-content: center; align-items: center;
          width: 36px; height: 36px; gap: 5px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; cursor: pointer; transition: background 0.2s;
        }
        .nav-hamburger:hover { background: rgba(255,255,255,0.1); }
        .nav-hamburger span {
          width: 16px; height: 1.5px; border-radius: 99px; background: #94a3b8;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s, width 0.3s;
          transform-origin: center;
        }
        .nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); width: 18px; }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); width: 18px; }

        /* ── MOBILE MENU ── */
        .nav-mobile {
          position: fixed; top: 60px; left: 12px; right: 12px;
          background: rgba(8,8,20,0.97);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 16px;
          backdrop-filter: blur(30px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(109,40,217,0.08);
          transform-origin: top center;
          animation: mobileIn 0.3s cubic-bezier(0.22,1,0.36,1) both;
          overflow: hidden; z-index: 99;
        }
        .nav-mobile::before {
          content: ''; position: absolute; top: 0; left: 20%; right: 20%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent);
        }
        .nav-mobile-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 16px; border-radius: 12px;
          color: #64748b; font-size: 15px; font-weight: 500;
          text-decoration: none; background: none; border: none; width: 100%;
          font-family: 'Outfit', sans-serif; cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .nav-mobile-link:hover,
        .nav-mobile-link.active { background: rgba(255,255,255,0.05); color: #f1f5f9; }
        .nav-mobile-link.active { background: rgba(139,92,246,0.08); color: #c4b5fd; }
        .nav-mobile-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 8px 0; }
        .nav-mobile-user {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px; margin-bottom: 4px;
          background: rgba(109,40,217,0.08); border: 1px solid rgba(139,92,246,0.15);
          border-radius: 14px;
        }
        .nav-mobile-user-info { flex: 1; overflow: hidden; }
        .nav-mobile-user-name { font-size: 14px; font-weight: 600; color: #f1f5f9; }
        .nav-mobile-user-email { font-size: 11.5px; color: rgba(255,255,255,0.3); margin-top: 1px; }
        .nav-mobile-login {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, rgba(109,40,217,0.2), rgba(79,70,229,0.15));
          border: 1px solid rgba(139,92,246,0.25);
          border-radius: 14px; color: #c4b5fd;
          font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600;
          cursor: pointer; margin-top: 4px; transition: background 0.2s, border-color 0.2s;
        }
        .nav-mobile-login:hover {
          background: linear-gradient(135deg, rgba(109,40,217,0.35), rgba(79,70,229,0.25));
          border-color: rgba(139,92,246,0.4);
        }
        .nav-mobile-logout {
          width: 100%; padding: 12px;
          background: rgba(244,63,94,0.08); border: 1px solid rgba(244,63,94,0.2);
          border-radius: 14px; color: #fca5a5;
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; margin-top: 4px; transition: background 0.2s, border-color 0.2s;
        }
        .nav-mobile-logout:hover { background: rgba(244,63,94,0.15); border-color: rgba(244,63,94,0.35); }

        @keyframes mobileIn {
          from { opacity: 0; transform: scaleY(0.9) translateY(-8px); }
          to { opacity: 1; transform: scaleY(1) translateY(0); }
        }

        @media (max-width: 768px) {
          .nav-links-wrap, .nav-login, .nav-profile-wrap { display: none !important; }
          .nav-hamburger { display: flex; }
          .nav-inner { padding: 14px 20px; }
        }
        @media (min-width: 769px) { .nav-mobile { display: none; } }
      `}</style>

            <nav className={`nav-root${scrolled ? " scrolled" : ""}${!isLanding ? " app-page" : ""}`}>
                <div className="nav-inner">

                    {/* ── LOGO + BREADCRUMB ── */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className={`nav-logo${mounted ? " mounted" : ""}`} onClick={handleLogoClick}>
                            <div className="nav-logo-mark">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" fillOpacity="0.9" />
                                    <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" fillOpacity="0.25" />
                                </svg>
                            </div>
                            <span className="nav-logo-text">CareerAI</span>
                            <span className="nav-logo-badge">BETA</span>
                        </div>

                        {/* Breadcrumb on inner pages */}
                        {!isLanding && (
                            <div className="nav-breadcrumb">
                                <span className="nav-breadcrumb-sep">/</span>
                                <span className="nav-breadcrumb-page">
                                    {location.pathname.replace("/", "") || "home"}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* ── DESKTOP LINKS ── */}
                    <div className="nav-links-wrap" onMouseLeave={() => setHovered(null)}>
                        <div ref={indicatorRef} className="nav-indicator" />
                        {links.map((link, i) => (
                            <button
                                key={link.key}
                                ref={el => navLinksRef.current[link.key] = el}
                                className={`nav-link${mounted ? " mounted" : ""}${active === link.key ? " active-link" : ""}`}
                                style={{ transitionDelay: mounted ? `${0.05 + i * 0.06}s` : "0s" }}
                                onMouseEnter={() => setHovered(link.key)}
                                onClick={() => { link.action(); setActive(link.key); }}
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>

                    {/* ── AUTH AREA ── */}
                    {!user ? (
                        <button onClick={() => navigate("/login")} className={`nav-login${mounted ? " mounted" : ""}`}>
                            <span>Login</span>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M5 7h6M8 4.5L10.5 7 8 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3 2.5H2a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    ) : (
                        <div ref={profileRef} className={`nav-profile-wrap${mounted ? " mounted" : ""}`}>
                            <button className={`nav-profile-btn${profileOpen ? " open" : ""}`} onClick={() => setProfileOpen(o => !o)}>
                                <div className="nav-avatar" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                                    {getInitials()}
                                    <span className="nav-avatar-dot" />
                                </div>
                                <span className="nav-profile-name">
                                    {user.name ? user.name.split(" ")[0] : user.email?.split("@")[0]}
                                </span>
                                <svg className="nav-profile-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M3.5 5.5L7 9l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            {profileOpen && (
                                <div className="nav-profile-dropdown">
                                    <div className="nav-dd-header">
                                        <div className="nav-dd-avatar" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                                            {getInitials()}
                                        </div>
                                        <div className="nav-dd-info">
                                            <div className="nav-dd-name">{user.name || "User"}</div>
                                            <div className="nav-dd-email">{user.email}</div>
                                        </div>
                                    </div>

                                    {[
                                        { path: "/dashboard", label: "Dashboard", icon: <><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75"/></> },
                                        { path: "/generate",  label: "Generate",  icon: <path d="M12 3v3M12 18v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M3 12h3M18 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/> },
                                        { path: "/profile",   label: "Profile",   icon: <><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75"/><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></> },
                                        { path: "/settings",  label: "Settings",  icon: <><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></> },
                                    ].map(({ path, label, icon }) => (
                                        <button
                                            key={path}
                                            className={`nav-dd-item${location.pathname === path ? " active-dd" : ""}`}
                                            onClick={() => { navigate(path); setProfileOpen(false); }}
                                        >
                                            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">{icon}</svg>
                                            {label}
                                            {location.pathname === path && (
                                                <svg width="6" height="6" style={{ marginLeft: "auto" }} viewBox="0 0 6 6">
                                                    <circle cx="3" cy="3" r="3" fill="#a78bfa"/>
                                                </svg>
                                            )}
                                        </button>
                                    ))}

                                    <div className="nav-dd-sep" />
                                    <button className="nav-dd-item danger" onClick={() => { logout(); navigate("/"); setProfileOpen(false); }}>
                                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── HAMBURGER ── */}
                    <div className={`nav-hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(o => !o)}>
                        <span /><span /><span />
                    </div>
                </div>

                {/* ── MOBILE MENU ── */}
                {menuOpen && (
                    <div className="nav-mobile">
                        {user && (
                            <>
                                <div className="nav-mobile-user">
                                    <div className="nav-avatar" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})`, width: 36, height: 36, fontSize: 13 }}>
                                        {getInitials()}
                                        <span className="nav-avatar-dot" />
                                    </div>
                                    <div className="nav-mobile-user-info">
                                        <div className="nav-mobile-user-name">{user.name || "User"}</div>
                                        <div className="nav-mobile-user-email">{user.email}</div>
                                    </div>
                                </div>
                                <div className="nav-mobile-divider" />
                            </>
                        )}

                        {links.map(link => (
                            <button
                                key={link.key}
                                className={`nav-mobile-link${active === link.key ? " active" : ""}`}
                                onClick={() => { link.action(); setMenuOpen(false); setActive(link.key); }}
                            >
                                {link.label}
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        ))}

                        <div className="nav-mobile-divider" />

                        {!user ? (
                            <button className="nav-mobile-login" onClick={() => { navigate("/login"); setMenuOpen(false); }}>Login →</button>
                        ) : (
                            <button className="nav-mobile-logout" onClick={() => { logout(); navigate("/"); setMenuOpen(false); }}>
                                Sign out
                            </button>
                        )}
                    </div>
                )}
            </nav>
        </>
    );
}