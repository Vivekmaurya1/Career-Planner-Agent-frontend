const FEATURES = [
  { icon:"🗺️", title:"AI Roadmap Generator", desc:"Describe your goal and get a fully structured learning plan with phases, milestones, and timelines." },
  { icon:"🧩", title:"Prerequisite Breakdown", desc:"Never hit a wall. Every topic links its dependencies so you always know what to learn first." },
  { icon:"🚀", title:"Real Project Suggestions", desc:"Learn by building. Each phase unlocks curated projects that reinforce your new skills." },
  { icon:"📅", title:"Weekly Learning Plan", desc:"Your roadmap auto-schedules into bite-sized weekly goals based on your available time." },
  { icon:"🎯", title:"Interview Prep Guide", desc:"Role-specific question banks, system design primers, and coding patterns — tailored to your level." },
  { icon:"📊", title:"Progress Tracking", desc:"Visual checkpoints and phase completion rings keep you motivated and on pace." },
];

import { motion } from "framer-motion";

export default function Features() {
  return (
    <section id="features" style={{ padding:"120px 32px", position:"relative", overflow:"hidden" }}>
      <style>{`
        .feat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 32px 28px;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, box-shadow 0.3s, background 0.3s;
          position: relative; overflow: hidden; cursor: default;
        }
        .feat-card::before {
          content: ''; position: absolute; inset: 0; border-radius: 20px;
          background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(139,92,246,0.07), transparent 60%);
          opacity: 0; transition: opacity 0.4s;
        }
        .feat-card:hover { transform: translateY(-6px) scale(1.01); border-color: rgba(139,92,246,0.3); box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(109,40,217,0.1); background: rgba(255,255,255,0.05); }
        .feat-card:hover::before { opacity: 1; }
        .feat-icon { font-size: 28px; margin-bottom: 18px; display: inline-block; transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .feat-card:hover .feat-icon { transform: scale(1.2) rotate(-5deg); }
      `}</style>

      {/* Ambient */}
      <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(109,40,217,0.06),transparent 70%)", top:"10%", right:"-10%", pointerEvents:"none" }} />

      <div style={{ maxWidth:1160, margin:"0 auto" }}>
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}
          style={{ textAlign:"center", marginBottom:72 }}
        >
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(109,40,217,0.1)", border:"1px solid rgba(139,92,246,0.2)", borderRadius:99, padding:"6px 14px", marginBottom:20 }}>
            <span style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#7c3aed" }}>What You Get</span>
          </div>
          <h2 style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:800, letterSpacing:"-0.03em", marginBottom:16, lineHeight:1.1 }}>
            Everything you need to<br />
            <span style={{ background:"linear-gradient(135deg,#a78bfa,#60a5fa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>accelerate your career</span>
          </h2>
          <p style={{ color:"#475569", fontSize:17, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>
            Not just a list of resources. A complete, opinionated system designed to get you hired.
          </p>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20 }}>
          {FEATURES.map((f, i) => (
            <motion.div key={i} className="feat-card"
              initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.5, delay:i*0.07 }}
              onMouseMove={e => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${((e.clientX-r.left)/r.width)*100}%`);
                e.currentTarget.style.setProperty("--my", `${((e.clientY-r.top)/r.height)*100}%`);
              }}
            >
              <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(139,92,246,0.2),transparent)", opacity:0, transition:"opacity 0.3s" }} className="feat-top-line" />
              <div className="feat-icon">{f.icon}</div>
              <h3 style={{ fontSize:16, fontWeight:700, color:"#f1f5f9", marginBottom:10, letterSpacing:"-0.01em" }}>{f.title}</h3>
              <p style={{ fontSize:14, color:"#475569", lineHeight:1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
