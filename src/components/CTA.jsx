import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CTA() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <section id="cta" style={{ padding:"120px 32px", position:"relative", overflow:"hidden" }}>
      <style>{`
        @keyframes ctaOrb { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        .cta-btn { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1) !important; }
        .cta-btn:hover { transform: translateY(-3px) scale(1.02) !important; box-shadow: 0 20px 60px rgba(109,40,217,0.5) !important; }
        .cta-btn:active { transform: scale(0.97) !important; }
      `}</style>

      {/* Center glow */}
      <div style={{ position:"absolute", width:800, height:800, borderRadius:"50%", background:"radial-gradient(circle,rgba(109,40,217,0.1),transparent 65%)", top:"50%", left:"50%", transform:"translate(-50%,-50%)", animation:"ctaOrb 6s ease-in-out infinite", pointerEvents:"none" }} />

      <motion.div initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}
        style={{ maxWidth:700, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}
      >
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(139,92,246,0.2)", borderRadius:28, padding:"64px 48px", position:"relative", overflow:"hidden", backdropFilter:"blur(20px)", boxShadow:"0 40px 100px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
          {/* Top glow */}
          <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:1, background:"linear-gradient(90deg,transparent,rgba(139,92,246,0.6),transparent)" }} />

          {/* Corner accents */}
          {[0,1,2,3].map((i) => (
            <div key={i} style={{
              position:"absolute",
              top: i < 2 ? 0 : "auto",
              bottom: i >= 2 ? 0 : "auto",
              left: i % 2 === 0 ? 0 : "auto",
              right: i % 2 === 1 ? 0 : "auto",
              width: 40, height: 40,
              borderTop: i < 2 ? "1px solid rgba(139,92,246,0.3)" : undefined,
              borderBottom: i >= 2 ? "1px solid rgba(139,92,246,0.3)" : undefined,
              borderLeft: i % 2 === 0 ? "1px solid rgba(139,92,246,0.3)" : undefined,
              borderRight: i % 2 === 1 ? "1px solid rgba(139,92,246,0.3)" : undefined,
              borderRadius: i===0?"8px 0 0 0": i===1?"0 8px 0 0": i===2?"0 0 0 8px":"0 0 8px 0",
            }} />
          ))}

          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration:20, repeat:Infinity, ease:"linear" }}
            style={{ position:"absolute", inset:0, borderRadius:28, border:"1px dashed rgba(139,92,246,0.07)", pointerEvents:"none" }}
          />

          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(109,40,217,0.12)", border:"1px solid rgba(139,92,246,0.25)", borderRadius:99, padding:"6px 16px", marginBottom:28 }}>
            <span style={{ fontSize:14 }}>🚀</span>
            <span style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#a78bfa" }}>Start for Free</span>
          </div>

          <h2 style={{ fontSize:"clamp(30px,4vw,48px)", fontWeight:900, letterSpacing:"-0.03em", lineHeight:1.1, marginBottom:20 }}>
            Your career path<br />
            <span style={{ background:"linear-gradient(135deg,#a78bfa 0%,#60a5fa 50%,#34d399 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              starts right now
            </span>
          </h2>

          <p style={{ fontSize:17, color:"#475569", lineHeight:1.7, maxWidth:440, margin:"0 auto 40px" }}>
            Join thousands of engineers, designers, and data scientists who used CareerAI to navigate their next career move.
          </p>

          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button
              className="cta-btn"
              onClick={() => navigate("/generate")}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{ display:"flex", alignItems:"center", gap:10, background:"linear-gradient(135deg,#6d28d9,#4f46e5)", border:"none", borderRadius:16, padding:"16px 32px", color:"white", fontFamily:"var(--font)", fontSize:16, fontWeight:700, cursor:"pointer", letterSpacing:"-0.01em", boxShadow:"0 10px 40px rgba(109,40,217,0.35)", position:"relative", overflow:"hidden" }}
            >
              <span style={{ position:"relative", zIndex:1 }}>Generate My Roadmap</span>
              <motion.svg
                animate={{ x: hovered ? 3 : 0 }}
                transition={{ type:"spring", stiffness:400 }}
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                style={{ position:"relative", zIndex:1 }}
              >
                <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(255,255,255,0.1),transparent)" }} />
            </button>
          </div>

          <p style={{ marginTop:28, fontSize:12, color:"#1e293b", fontFamily:"var(--mono)", letterSpacing:"0.06em" }}>
            No signup required · Free to generate · 30 sec setup
          </p>
        </div>
      </motion.div>
    </section>
  );
}