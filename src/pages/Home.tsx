import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Logo from "@/components/Logo";

interface HomeProps {
  onPlay: () => void;
}

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        padding: "5px 12px",
        borderRadius: 20,
        background: "rgba(74,222,128,0.1)",
        color: "#4ade80",
        border: "1px solid rgba(74,222,128,0.22)",
        marginBottom: 14,
      }}
    >
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 28,
        fontWeight: 900,
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
        marginBottom: 14,
        color: "#fff",
      }}
    >
      {children}
    </h2>
  );
}

function Card({ children, glow = false }: { children: ReactNode; glow?: boolean }) {
  return (
    <div
      style={{
        background: glow
          ? "linear-gradient(135deg,rgba(74,222,128,0.07),rgba(74,222,128,0.02))"
          : "rgba(255,255,255,0.035)",
        border: glow ? "1px solid rgba(74,222,128,0.18)" : "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "16px 18px",
      }}
    >
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: 1,
        background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)",
        margin: "0 20px",
      }}
    />
  );
}

export default function Home({ onPlay }: HomeProps) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div
      style={{
        background: "#060c18",
        color: "#fff",
        fontFamily: "Inter, system-ui, sans-serif",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "10px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(6,12,24,0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <Logo size="sm" />
        <button
          onClick={onPlay}
          style={{
            background: "linear-gradient(135deg,#16a34a,#4ade80)",
            color: "#fff",
            border: "none",
            borderRadius: 50,
            padding: "8px 20px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            boxShadow: "0 0 18px rgba(74,222,128,0.3)",
          }}
        >
          Play Free
        </button>
      </nav>

      {/* ===== HERO ===== */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 20px 60px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Background glow blobs */}
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 80% 50% at 50% 20%,rgba(74,222,128,0.07) 0%,transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: "38%", pointerEvents: "none",
            background: "linear-gradient(180deg,transparent,rgba(10,50,26,0.55))",
          }}
        />
        {/* Floodlight dots */}
        <div style={{ position: "absolute", top: 80, left: 18, width: 8, height: 8, borderRadius: "50%", background: "#fffde7", boxShadow: "0 0 20px 8px rgba(255,253,200,0.3)" }} />
        <div style={{ position: "absolute", top: 80, right: 18, width: 8, height: 8, borderRadius: "50%", background: "#fffde7", boxShadow: "0 0 20px 8px rgba(255,253,200,0.3)" }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 360, width: "100%" }}>
          <div style={{ marginBottom: 20 }}>
            <Logo size="xl" />
          </div>

          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "5px 14px",
              borderRadius: 20,
              background: "rgba(74,222,128,0.1)",
              color: "#4ade80",
              border: "1px solid rgba(74,222,128,0.22)",
              marginBottom: 20,
            }}
          >
            Free to Play in Your Browser
          </span>

          <h1
            style={{
              fontSize: 38,
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              marginBottom: 16,
            }}
          >
            The Ultimate{" "}
            <span style={{ color: "#4ade80" }}>Penalty Kick</span>{" "}
            Experience
          </h1>

          <p
            style={{
              fontSize: 15,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.58)",
              marginBottom: 28,
            }}
          >
            Step up to the spot. Pick your corner. Beat the goalkeeper. No
            downloads, no sign-ups. Pure football skill in your browser.
          </p>

          <button
            onClick={onPlay}
            style={{
              display: "block",
              width: "100%",
              background: "linear-gradient(135deg,#16a34a,#22c55e,#4ade80)",
              color: "#fff",
              border: "none",
              borderRadius: 16,
              padding: "18px 0",
              fontSize: 17,
              fontWeight: 900,
              letterSpacing: "0.05em",
              cursor: "pointer",
              boxShadow: "0 8px 40px rgba(74,222,128,0.4),0 0 0 1px rgba(74,222,128,0.18)",
              marginBottom: 10,
            }}
          >
            PLAY FREE NOW
          </button>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)" }}>
            No account needed. Instant play. 100% free.
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
            width: "100%",
            maxWidth: 360,
            marginTop: 32,
          }}
        >
          {[
            { v: "5", l: "Kicks" },
            { v: "AI", l: "Goalkeeper" },
            { v: "0s", l: "Load Time" },
          ].map((s) => (
            <div
              key={s.l}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "14px 8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 900, color: "#4ade80", lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: 5 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{ position: "relative", zIndex: 2, marginTop: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>Scroll to explore</span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ animation: "bounce 2s infinite" }}>
            <path d="M9 3v11M4 10l5 5 5-5" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      <Divider />

      {/* ===== ABOUT ===== */}
      <section id="about" style={{ padding: "56px 20px", maxWidth: 480, margin: "0 auto" }}>
        <Reveal>
          <Tag>About</Tag>
          <SectionTitle>
            Born for the <span style={{ color: "#ffd700" }}>Beautiful Game</span>
          </SectionTitle>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.58)", marginBottom: 14 }}>
            Kickoff 2026 is a free browser penalty kick game built to celebrate the world's most beloved sport. Inspired by the electric atmosphere of international football tournaments, we put you right on the penalty spot inside a floodlit night stadium.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.58)", marginBottom: 28 }}>
            Every detail was designed with realism in mind: curved ball physics, intelligent goalkeeper AI, authentic stadium visuals, and instant result feedback. No installs, no accounts, just pure football.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { icon: "⚽", t: "Realistic Physics", d: "Ball curves naturally based on where you aim." },
            { icon: "🧤", t: "Smart Goalkeeper", d: "The keeper reads your direction and dives to save." },
            { icon: "🏟️", t: "Stadium Night Match", d: "Floodlights, crowd atmosphere and pitch markings." },
            { icon: "🎯", t: "Precision Aiming", d: "Click anywhere inside the goal to set your target." },
          ].map((f, i) => (
            <Reveal key={f.t} delay={i * 70}>
              <Card>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{f.t}</div>
                <div style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.48)" }}>{f.d}</div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <Divider />

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" style={{ padding: "56px 20px", maxWidth: 480, margin: "0 auto" }}>
        <Reveal>
          <Tag>How It Works</Tag>
          <SectionTitle>
            Score in <span style={{ color: "#4ade80" }}>5 Simple Steps</span>
          </SectionTitle>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          {[
            { n: 1, icon: "▶", t: "Tap Play Free Now", d: "Jump straight into the game. No sign-up, no loading screen, no waiting." },
            { n: 2, icon: "👁", t: "Read the Goalkeeper", d: "Watch the keeper shift his weight and decide which corner to target." },
            { n: 3, icon: "🎯", t: "Move Into the Goal Area", d: "A yellow crosshair appears when you hover over the goal. That is your aim point." },
            { n: 4, icon: "🖱", t: "Click to Shoot", d: "Click your chosen spot inside the goal. The ball launches with realistic curve and pace." },
            { n: 5, icon: "🏆", t: "Complete 5 Penalties", d: "Score as many as you can to earn your final rating from Need Practice to Outstanding." },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 60}>
              <Card glow>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div
                    style={{
                      flexShrink: 0,
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: 16,
                      background: "linear-gradient(135deg,#16a34a,#4ade80)",
                      color: "#fff",
                    }}
                  >
                    {s.n}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                      <span style={{ fontSize: 16 }}>{s.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{s.t}</span>
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.52)" }}>{s.d}</p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={350}>
          <button
            onClick={onPlay}
            style={{
              display: "block",
              width: "100%",
              background: "linear-gradient(135deg,#16a34a,#4ade80)",
              color: "#fff",
              border: "none",
              borderRadius: 14,
              padding: "16px 0",
              fontSize: 15,
              fontWeight: 900,
              letterSpacing: "0.04em",
              cursor: "pointer",
              boxShadow: "0 4px 24px rgba(74,222,128,0.32)",
            }}
          >
            Try It Now
          </button>
        </Reveal>
      </section>

      <Divider />

      {/* ===== RATINGS ===== */}
      <section style={{ padding: "56px 20px", maxWidth: 480, margin: "0 auto" }}>
        <Reveal>
          <Tag>Your Rating</Tag>
          <SectionTitle>
            Can You Get <span style={{ color: "#ffd700" }}>Outstanding?</span>
          </SectionTitle>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
            Your final rating depends on how many of your 5 kicks find the back of the net.
          </p>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { s: "5 / 5", l: "Outstanding!", c: "#ffd700", w: 100 },
            { s: "4 / 5", l: "Great!", c: "#4ade80", w: 80 },
            { s: "3 / 5", l: "Not Bad", c: "#fb923c", w: 60 },
            { s: "0-2 / 5", l: "Need Practice", c: "#f87171", w: 38 },
          ].map((r, i) => (
            <Reveal key={r.l} delay={i * 55}>
              <Card>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: r.c, minWidth: 52, flexShrink: 0 }}>{r.s}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: r.c, marginBottom: 8 }}>{r.l}</div>
                    <div style={{ height: 5, borderRadius: 4, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${r.w}%`, borderRadius: 4, background: r.c }} />
                    </div>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section style={{ padding: "10px 20px 56px", maxWidth: 480, margin: "0 auto" }}>
        <Reveal>
          <div
            style={{
              borderRadius: 24,
              padding: "36px 24px",
              textAlign: "center",
              background: "linear-gradient(135deg,rgba(13,51,32,0.95),rgba(15,61,38,0.95))",
              border: "1px solid rgba(74,222,128,0.2)",
              boxShadow: "0 0 50px rgba(74,222,128,0.08) inset",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "radial-gradient(ellipse at 50% 0%,rgba(74,222,128,0.1),transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>⚽</div>
              <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>Ready to Score?</h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 22, lineHeight: 1.65 }}>
                The goalkeeper is waiting. The crowd is watching. Step up and take your shot.
              </p>
              <button
                onClick={onPlay}
                style={{
                  background: "linear-gradient(135deg,#16a34a,#4ade80)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 14,
                  padding: "15px 40px",
                  fontSize: 16,
                  fontWeight: 900,
                  cursor: "pointer",
                  boxShadow: "0 4px 28px rgba(74,222,128,0.45)",
                  letterSpacing: "0.04em",
                }}
              >
                PLAY FREE NOW
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      <Divider />

      {/* ===== LEGAL ===== */}
      <section id="legal" style={{ padding: "56px 20px", maxWidth: 480, margin: "0 auto" }}>
        <Reveal>
          <Tag>Legal</Tag>
          <SectionTitle>Terms of Use</SectionTitle>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
            By using Kickoff 2026 you agree to these terms. We have kept them short and clear.
          </p>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { t: "Free Entertainment Only", b: "Kickoff 2026 is provided entirely free of charge as a browser-based entertainment product. No real money, gambling, or wagering is involved at any stage of gameplay." },
            { t: "No Account Required", b: "You do not need to create an account, provide any personal information, or agree to any subscription to play. The game runs entirely in your browser." },
            { t: "Intellectual Property", b: "All game artwork, code, and branding associated with Kickoff 2026 are the property of their respective creators. Unauthorized reproduction or redistribution is not permitted." },
            { t: "Service Availability", b: "We strive to keep the game available at all times but cannot guarantee uninterrupted access. The service may be updated, modified, or temporarily unavailable without prior notice." },
            { t: "Limitation of Liability", b: "Kickoff 2026 is provided as-is with no warranties of any kind, express or implied. Your use of the service is at your own risk." },
          ].map((item, i) => (
            <Reveal key={item.t} delay={i * 45}>
              <Card>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 7 }}>{item.t}</div>
                <div style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.48)" }}>{item.b}</div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <Divider />

      {/* ===== COOKIES ===== */}
      <section id="cookies" style={{ padding: "56px 20px", maxWidth: 480, margin: "0 auto" }}>
        <Reveal>
          <Tag>Privacy</Tag>
          <SectionTitle>Cookie Policy</SectionTitle>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
            We believe your data belongs to you. Here is exactly how Kickoff 2026 handles information about your visit.
          </p>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "✅", t: "No Tracking Cookies", b: "We do not set advertising cookies, cross-site tracking pixels, or any technology designed to follow you around the web. Your browsing is your own business.", hi: true },
            { icon: "⚙️", t: "Functional Only", b: "Your browser may store session data to keep the game running smoothly. This data never leaves your device and is not transmitted to any third-party server.", hi: false },
            { icon: "📊", t: "Basic Analytics", b: "We may collect anonymous, aggregated statistics such as page views to understand how many people are playing. This data contains no personally identifiable information.", hi: false },
            { icon: "🔒", t: "Your Control", b: "You can clear all locally stored data at any time through your browser settings. Doing so will not affect your ability to play the game.", hi: false },
          ].map((item, i) => (
            <Reveal key={item.t} delay={i * 55}>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "16px 18px",
                  borderRadius: 16,
                  background: item.hi ? "rgba(74,222,128,0.06)" : "rgba(255,255,255,0.03)",
                  border: item.hi ? "1px solid rgba(74,222,128,0.18)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{item.t}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.48)" }}>{item.b}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={280}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", lineHeight: 1.7, marginTop: 20 }}>
            Last updated: June 2026. If you have any questions about our privacy practices please review this page at any time.
          </p>
        </Reveal>
      </section>

      <Divider />

      {/* ===== FOOTER ===== */}
      <footer
        style={{
          background: "linear-gradient(180deg,rgba(0,0,0,0.3),rgba(3,7,15,0.95))",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          marginTop: 8,
        }}
      >
        {/* Top footer — columns */}
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: "48px 24px 36px",
          }}
        >
          {/* Brand column */}
          <div style={{ marginBottom: 36 }}>
            <Logo size="md" />
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.7,
                marginTop: 14,
                maxWidth: 280,
              }}
            >
              The free browser penalty kick game for football fans everywhere.
              Step up to the spot, pick your corner, and beat the keeper.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                marginTop: 14,
                padding: "6px 12px",
                borderRadius: 20,
                background: "rgba(74,222,128,0.08)",
                border: "1px solid rgba(74,222,128,0.18)",
              }}
            >
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#4ade80" }}>
                Live at kickoff2026.fun
              </span>
            </div>
          </div>

          {/* Link columns — side by side on mobile */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "28px 16px",
              marginBottom: 36,
            }}
          >
            {/* Play */}
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#4ade80",
                  marginBottom: 14,
                }}
              >
                Play
              </div>
              {[
                { label: "Play Free Now", fn: onPlay },
                { label: "How It Works", fn: () => go("how-it-works") },
                { label: "Your Rating", fn: () => go("ratings") },
              ].map((l) => (
                <button
                  key={l.label}
                  onClick={l.fn}
                  style={{
                    display: "block",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.55)",
                    padding: "6px 0",
                    textAlign: "left",
                    width: "100%",
                    transition: "color 0.2s",
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* About */}
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#4ade80",
                  marginBottom: 14,
                }}
              >
                About
              </div>
              {[
                { label: "About the Game", fn: () => go("about") },
                { label: "Game Features", fn: () => go("about") },
                { label: "Stadium Mode", fn: () => go("about") },
              ].map((l) => (
                <button
                  key={l.label}
                  onClick={l.fn}
                  style={{
                    display: "block",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.55)",
                    padding: "6px 0",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Legal */}
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: 14,
                }}
              >
                Legal
              </div>
              {[
                { label: "Terms of Use", fn: () => go("legal") },
                { label: "Limitation of Liability", fn: () => go("legal") },
                { label: "Intellectual Property", fn: () => go("legal") },
              ].map((l) => (
                <button
                  key={l.label}
                  onClick={l.fn}
                  style={{
                    display: "block",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.55)",
                    padding: "6px 0",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Privacy */}
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: 14,
                }}
              >
                Privacy
              </div>
              {[
                { label: "Cookie Policy", fn: () => go("cookies") },
                { label: "No Tracking", fn: () => go("cookies") },
                { label: "Your Data Rights", fn: () => go("cookies") },
              ].map((l) => (
                <button
                  key={l.label}
                  onClick={l.fn}
                  style={{
                    display: "block",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.55)",
                    padding: "6px 0",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Play CTA in footer */}
          <button
            onClick={onPlay}
            style={{
              display: "block",
              width: "100%",
              background: "linear-gradient(135deg,#16a34a,#4ade80)",
              color: "#fff",
              border: "none",
              borderRadius: 14,
              padding: "15px 0",
              fontSize: 15,
              fontWeight: 900,
              letterSpacing: "0.05em",
              cursor: "pointer",
              boxShadow: "0 4px 24px rgba(74,222,128,0.3)",
              marginBottom: 0,
            }}
          >
            PLAY FREE NOW
          </button>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "18px 24px",
            maxWidth: 480,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.22)" }}>
              2026 Kickoff2026.fun
            </span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.12)" }}>|</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.22)" }}>All rights reserved</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.12)" }}>|</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.22)" }}>
              Celebrating FIFA World Cup 2026
            </span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </div>
  );
}
