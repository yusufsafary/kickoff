import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";

interface HomeProps {
  onPlay: () => void;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4 rounded-2xl"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <span className="text-3xl font-black" style={{ color: "#4ade80" }}>{value}</span>
      <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</span>
    </div>
  );
}

function StepCard({ num, title, desc, icon }: { num: number; title: string; desc: string; icon: string }) {
  return (
    <div className="flex gap-4 items-start p-4 rounded-2xl"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(74,222,128,0.12)" }}>
      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg"
        style={{ background: "linear-gradient(135deg, #16a34a, #4ade80)", color: "#fff" }}>
        {num}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{icon}</span>
          <h3 className="font-bold text-white text-base">{title}</h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{desc}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="p-5 rounded-2xl flex flex-col gap-3"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(8px)",
      }}>
      <div className="text-3xl">{icon}</div>
      <h3 className="font-bold text-white text-base">{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{desc}</p>
    </div>
  );
}

export default function Home({ onPlay }: HomeProps) {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "#050a14", color: "#fff", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>

      {/* Sticky Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: navScrolled ? "rgba(5,10,20,0.92)" : "transparent",
          backdropFilter: navScrolled ? "blur(16px)" : "none",
          borderBottom: navScrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
          padding: "12px 20px",
        }}>
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Logo size="sm" />
          <button
            onClick={onPlay}
            className="font-bold text-sm px-5 py-2 rounded-full transition-all"
            style={{
              background: "linear-gradient(135deg, #16a34a, #4ade80)",
              color: "#fff",
              boxShadow: "0 0 20px rgba(74,222,128,0.35)",
            }}>
            Play Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-5 pt-24 pb-16 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #050a14 0%, #071220 50%, #050a14 100%)" }}>

        {/* Ambient lights */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(74,222,128,0.07) 0%, transparent 70%)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", top: "20%", left: "10%", width: 200, height: 200, background: "radial-gradient(ellipse, rgba(255,215,0,0.05) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", top: "20%", right: "10%", width: 200, height: 200, background: "radial-gradient(ellipse, rgba(255,215,0,0.05) 0%, transparent 70%)" }} />
        </div>

        {/* Stadium silhouette */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "45%" }}>
          <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="pitchGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a4a2e" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0d2e1a" stopOpacity="1" />
              </linearGradient>
            </defs>
            {/* Pitch */}
            <path d="M0,60 Q200,30 400,60 L400,200 L0,200 Z" fill="url(#pitchGrad)" />
            {/* Pitch lines */}
            <ellipse cx="200" cy="150" rx="70" ry="20" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <line x1="110" y1="85" x2="290" y2="85" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
            <line x1="130" y1="85" x2="270" y2="105" stroke="rgba(255,255,255,0.07)" strokeWidth="0.6" />
            {/* Goal */}
            <rect x="160" y="55" width="80" height="30" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
            {/* Net lines */}
            {[0,1,2,3,4].map(i => (
              <line key={i} x1={165 + i*15} y1="55" x2={165 + i*15} y2="85" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            ))}
            {/* Stands suggestion */}
            <path d="M0,0 L0,65 Q200,35 400,65 L400,0 Z" fill="rgba(10,15,30,0.6)" />
            {/* Crowd dots */}
            {Array.from({length: 40}, (_, i) => (
              <circle key={i} cx={i * 10 + 5} cy={8 + (i % 4) * 7} r="2.5"
                fill={["#e53e3e","#3182ce","#48bb78","#d69e2e","#fff"][i % 5]}
                opacity={0.5 + 0.3 * Math.sin(i * 1.3)} />
            ))}
            {/* Floodlights */}
            <line x1="45" y1="0" x2="45" y2="45" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <circle cx="45" cy="0" r="4" fill="#fff9c4" />
            <line x1="355" y1="0" x2="355" y2="45" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <circle cx="355" cy="0" r="4" fill="#fff9c4" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-sm mx-auto">
          <div className="mb-6">
            <Logo size="xl" />
          </div>

          <div
            className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" }}>
            Free to Play in Your Browser
          </div>

          <h1 className="text-4xl font-black leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
            The Ultimate<br />
            <span style={{ color: "#4ade80" }}>Penalty Kick</span><br />
            Experience
          </h1>

          <p className="text-base mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            Step up to the spot. Pick your corner. Beat the goalkeeper. No downloads, no sign-ups. Pure football skill in your browser.
          </p>

          <button
            onClick={onPlay}
            className="w-full max-w-xs font-black text-lg py-5 rounded-2xl mb-4 transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #4ade80 100%)",
              color: "#fff",
              boxShadow: "0 8px 40px rgba(74,222,128,0.45), 0 0 0 1px rgba(74,222,128,0.2)",
              letterSpacing: "0.05em",
            }}>
            PLAY FREE NOW
          </button>

          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            No account needed. Instant play. 100% free.
          </p>
        </div>

        {/* Stats row */}
        <div className="relative z-10 w-full max-w-sm mx-auto mt-10 grid grid-cols-3 gap-3">
          <StatCard value="5" label="Kicks" />
          <StatCard value="AI" label="Goalkeeper" />
          <StatCard value="0s" label="Load time" />
        </div>

        {/* Scroll hint */}
        <div className="relative z-10 mt-10 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Scroll to explore</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M5 11l5 5 5-5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-5 py-16 max-w-lg mx-auto">
        <FadeIn>
          <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}>
            About the Game
          </div>
          <h2 className="text-3xl font-black mb-4" style={{ letterSpacing: "-0.02em" }}>
            Born for the<br /><span style={{ color: "#ffd700" }}>Beautiful Game</span>
          </h2>
          <p className="text-base leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
            Kickoff 2026 is a free browser-based penalty kick game built to celebrate the world's most beloved sport. Inspired by the electric atmosphere of international football tournaments, we put you right on the penalty spot inside a floodlit stadium.
          </p>
          <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>
            Every detail was designed with realism in mind: curved ball physics, intelligent goalkeeper AI that reads your shot, authentic stadium visuals with roaring crowd, and instant result feedback. No installs, no accounts, just pure football adrenaline.
          </p>
        </FadeIn>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "⚽", title: "Realistic Physics", desc: "Ball curves naturally based on where you aim and the spin applied." },
            { icon: "🧤", title: "Smart Goalkeeper", desc: "The keeper reads your direction and dives with convincing animations." },
            { icon: "🏟️", title: "Stadium Atmosphere", desc: "Night match setting with floodlights, crowd, and pitch markings." },
            { icon: "🎯", title: "Precision Aiming", desc: "Click anywhere in the goal to set your exact target before shooting." },
          ].map((f, i) => (
            <FadeIn key={i} delay={i * 80}>
              <FeatureCard {...f} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-5 py-16"
        style={{ background: "linear-gradient(180deg, transparent, rgba(74,222,128,0.03), transparent)" }}>
        <div className="max-w-lg mx-auto">
          <FadeIn>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}>
              How It Works
            </div>
            <h2 className="text-3xl font-black mb-8" style={{ letterSpacing: "-0.02em" }}>
              Score in<br /><span style={{ color: "#4ade80" }}>5 Simple Steps</span>
            </h2>
          </FadeIn>

          <div className="flex flex-col gap-3">
            {[
              { num: 1, icon: "▶", title: "Tap Play Free Now", desc: "Jump straight into the game. No sign-up, no loading screen, no waiting. You are on the pitch in under a second." },
              { num: 2, icon: "👁", title: "Read the Goalkeeper", desc: "Watch the keeper shift his weight. Is he leaning left? Time your shot to the opposite corner." },
              { num: 3, icon: "🎯", title: "Move Your Cursor Into the Goal", desc: "A yellow crosshair appears when you hover over the goal area. This is your target zone." },
              { num: 4, icon: "🖱", title: "Click to Shoot", desc: "Click on your chosen spot inside the goal. The ball launches with realistic curve and pace toward your target." },
              { num: 5, icon: "🏆", title: "Score 5 Penalties", desc: "Each round gives you 5 kicks. Score as many as you can to earn your rating from Not Bad to Outstanding." },
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 70}>
                <StepCard {...step} />
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={400}>
            <button
              onClick={onPlay}
              className="w-full font-black text-base py-4 rounded-2xl mt-8 transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #16a34a, #4ade80)",
                color: "#fff",
                boxShadow: "0 4px 24px rgba(74,222,128,0.35)",
              }}>
              Try It Now
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Ratings Section */}
      <section className="px-5 py-16 max-w-lg mx-auto">
        <FadeIn>
          <h2 className="text-2xl font-black mb-2" style={{ letterSpacing: "-0.01em" }}>
            Can You Get <span style={{ color: "#ffd700" }}>Outstanding?</span>
          </h2>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
            Your final rating depends on how many of your 5 kicks find the net.
          </p>
        </FadeIn>
        <div className="flex flex-col gap-3">
          {[
            { score: "5 / 5", label: "Outstanding!", color: "#ffd700", bar: 100 },
            { score: "4 / 5", label: "Great!", color: "#4ade80", bar: 80 },
            { score: "3 / 5", label: "Not Bad", color: "#fb923c", bar: 60 },
            { score: "0-2 / 5", label: "Need Practice", color: "#f87171", bar: 40 },
          ].map((r, i) => (
            <FadeIn key={i} delay={i * 60}>
              <div className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-xl font-black w-16 flex-shrink-0" style={{ color: r.color }}>{r.score}</div>
                <div className="flex-1">
                  <div className="text-sm font-bold mb-1" style={{ color: r.color }}>{r.label}</div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${r.bar}%`, background: r.color }} />
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-5 py-10">
        <FadeIn>
          <div className="max-w-lg mx-auto rounded-3xl p-8 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0d3320 0%, #0f3d26 50%, #0d3320 100%)",
              border: "1px solid rgba(74,222,128,0.2)",
              boxShadow: "0 0 60px rgba(74,222,128,0.1) inset",
            }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.12) 0%, transparent 60%)" }} />
            <div className="relative z-10">
              <div className="text-4xl mb-3">⚽</div>
              <h2 className="text-2xl font-black mb-3">Ready to Score?</h2>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
                The goalkeeper is waiting. The crowd is watching. Step up and take your shot.
              </p>
              <button
                onClick={onPlay}
                className="font-black text-lg px-10 py-4 rounded-2xl transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #4ade80)",
                  color: "#fff",
                  boxShadow: "0 4px 30px rgba(74,222,128,0.5)",
                }}>
                PLAY FREE NOW
              </button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Legal Section */}
      <section id="legal" className="px-5 py-14 max-w-lg mx-auto">
        <FadeIn>
          <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
            Legal
          </div>
          <h2 className="text-2xl font-black mb-5">Terms of Use</h2>
        </FadeIn>

        <div className="flex flex-col gap-4">
          {[
            { title: "Free Entertainment Only", body: "Kickoff 2026 is provided entirely free of charge as a browser-based entertainment product. No real money, gambling, or wagering is involved at any stage of gameplay." },
            { title: "No Account Required", body: "You do not need to create an account, provide any personal information, or agree to any subscription to play. The game runs entirely in your browser." },
            { title: "Intellectual Property", body: "All game artwork, code, sound design, and branding associated with Kickoff 2026 are the property of their respective creators. Unauthorized reproduction or redistribution is not permitted." },
            { title: "Availability", body: "We strive to keep the game available at all times but cannot guarantee uninterrupted access. The service may be updated, modified, or temporarily unavailable without prior notice." },
            { title: "Limitation of Liability", body: "Kickoff 2026 is provided as-is. We make no warranties of any kind, express or implied. Your use of the service is at your own risk." },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 50}>
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h3 className="font-bold text-sm mb-2 text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{item.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Cookies Section */}
      <section id="cookies" className="px-5 py-14 max-w-lg mx-auto">
        <FadeIn>
          <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
            Cookie Policy
          </div>
          <h2 className="text-2xl font-black mb-3">Cookies and Privacy</h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            We believe your data belongs to you. Here is exactly how Kickoff 2026 handles information about your visit.
          </p>
        </FadeIn>

        <div className="flex flex-col gap-4">
          {[
            {
              icon: "✅",
              title: "No Tracking Cookies",
              body: "We do not set advertising cookies, cross-site tracking pixels, or any technology designed to follow you around the web. Your browsing is your own business.",
              accent: "rgba(74,222,128,0.1)",
              border: "rgba(74,222,128,0.15)",
            },
            {
              icon: "⚙️",
              title: "Functional Only",
              body: "Your browser may store session data to keep the game running smoothly. This data never leaves your device and is not transmitted to any third-party server.",
              accent: "rgba(74,222,128,0.05)",
              border: "rgba(74,222,128,0.1)",
            },
            {
              icon: "📊",
              title: "Basic Analytics",
              body: "We may collect anonymous, aggregated statistics such as page views and general geographic regions to understand how many people are playing. This data contains no personally identifiable information.",
              accent: "rgba(255,255,255,0.03)",
              border: "rgba(255,255,255,0.07)",
            },
            {
              icon: "🔒",
              title: "Your Control",
              body: "You can clear all locally stored data at any time through your browser settings. Doing so will not affect your ability to play the game.",
              accent: "rgba(255,255,255,0.03)",
              border: "rgba(255,255,255,0.07)",
            },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 60}>
              <div className="flex gap-4 p-4 rounded-xl"
                style={{ background: item.accent, border: `1px solid ${item.border}` }}>
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-sm mb-1.5 text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{item.body}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={300}>
          <p className="text-xs mt-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
            Last updated: June 2026. If you have any questions about our privacy practices, the absence of tracking cookies, or how your data is handled, you are welcome to review this page at any time. We keep things simple because the game is what matters.
          </p>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer
        className="px-5 py-10 mt-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.3)" }}>
        <div className="max-w-lg mx-auto">
          <div className="flex flex-col items-center gap-6 text-center">
            <Logo size="md" />

            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              The browser penalty kick game for football fans everywhere. Pick your corner. Beat the keeper.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: "Play Now", action: onPlay },
                { label: "About", action: () => scrollTo("about") },
                { label: "How It Works", action: () => scrollTo("how-it-works") },
                { label: "Legal", action: () => scrollTo("legal") },
                { label: "Cookies", action: () => scrollTo("cookies") },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.45)" }}>
                  {link.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#4ade80" }} />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Celebrating FIFA World Cup 2026</span>
              </div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                2026 Kickoff2026.fun. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
