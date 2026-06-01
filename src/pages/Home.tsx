import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Logo from "@/components/Logo";

interface HomeProps {
  onPlay: () => void;
}

/* ─── tiny helpers ─────────────────────────────────────────── */
function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="kf-tag">{children}</span>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="kf-section-title">{children}</h2>
  );
}

function Card({ children, glow = false }: { children: ReactNode; glow?: boolean }) {
  return (
    <div className={glow ? "kf-card kf-card--glow" : "kf-card"}>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="kf-divider" />;
}

/* ─── main component ────────────────────────────────────────── */
export default function Home({ onPlay }: HomeProps) {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // close menu on outside click
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const NAV_LINKS = [
    { label: "About",        id: "about" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Ratings",      id: "ratings" },
  ];

  return (
    <div className="kf-root">

      {/* ══════════════════════════════════════
          NAV
      ══════════════════════════════════════ */}
      <nav className={`kf-nav${scrolled ? " kf-nav--scrolled" : ""}`} ref={menuRef}>
        <div className="kf-nav-inner">
          {/* Logo */}
          <Logo size="sm" />

          {/* Desktop links */}
          <div className="kf-nav-links">
            {NAV_LINKS.map(l => (
              <button key={l.id} className="kf-nav-link" onClick={() => go(l.id)}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="kf-nav-right">
            <button className="kf-btn-play kf-btn-play--sm" onClick={onPlay}>
              Play Free
            </button>
            {/* Hamburger */}
            <button
              className={`kf-hamburger${menuOpen ? " kf-hamburger--open" : ""}`}
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div className={`kf-mobile-menu${menuOpen ? " kf-mobile-menu--open" : ""}`}>
          {NAV_LINKS.map(l => (
            <button key={l.id} className="kf-mobile-link" onClick={() => go(l.id)}>
              {l.label}
            </button>
          ))}
          <button className="kf-btn-play kf-btn-play--full" onClick={() => { setMenuOpen(false); onPlay(); }}>
            ▶ Play Free Now
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="kf-hero">
        {/* bg glows */}
        <div className="kf-hero-glow" />
        <div className="kf-hero-fade" />
        {/* floodlights */}
        <div className="kf-floodlight kf-floodlight--left" />
        <div className="kf-floodlight kf-floodlight--right" />

        <div className="kf-hero-content">
          <div className="kf-hero-logo">
            <Logo size="xl" />
          </div>

          <span className="kf-badge">Free to Play in Your Browser</span>

          <h1 className="kf-hero-title">
            The Ultimate{" "}
            <span className="kf-green">Penalty Kick</span>{" "}
            Experience
          </h1>

          <p className="kf-hero-sub">
            Step up to the spot. Pick your corner. Beat the goalkeeper.
            No downloads, no sign-ups. Pure football skill in your browser.
          </p>

          <button className="kf-btn-play kf-btn-play--hero" onClick={onPlay}>
            PLAY FREE NOW
          </button>
          <p className="kf-hero-note">No account needed · Instant play · 100% free</p>
        </div>

        {/* Stats */}
        <div className="kf-stats">
          {[
            { v: "5", l: "Kicks" },
            { v: "AI", l: "Goalkeeper" },
            { v: "0s", l: "Load Time" },
          ].map(s => (
            <div key={s.l} className="kf-stat">
              <div className="kf-stat-val">{s.v}</div>
              <div className="kf-stat-lbl">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="kf-scroll-hint">
          <span>Scroll to explore</span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="kf-bounce">
            <path d="M9 3v11M4 10l5 5 5-5" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          ABOUT
      ══════════════════════════════════════ */}
      <section id="about" className="kf-section">
        <Tag>About</Tag>
        <SectionTitle>
          Born for the <span className="kf-gold">Beautiful Game</span>
        </SectionTitle>
        <p className="kf-body-text" style={{ marginBottom: 12 }}>
          Kickoff 2026 is a free browser penalty kick game built to celebrate the world's most
          beloved sport. Inspired by the electric atmosphere of international football tournaments,
          we put you right on the penalty spot inside a floodlit night stadium.
        </p>
        <p className="kf-body-text" style={{ marginBottom: 28 }}>
          Every detail was designed with realism in mind: curved ball physics, intelligent
          goalkeeper AI, authentic stadium visuals, and instant result feedback. No installs,
          no accounts, just pure football.
        </p>

        <div className="kf-grid-2">
          {[
            { icon: "⚽", t: "Realistic Physics",    d: "Ball curves naturally based on where you aim." },
            { icon: "🧤", t: "Smart Goalkeeper",     d: "The keeper reads your direction and dives to save." },
            { icon: "🏟️", t: "Stadium Night Match",  d: "Floodlights, crowd atmosphere and pitch markings." },
            { icon: "🎯", t: "Precision Aiming",     d: "Click anywhere inside the goal to set your target." },
          ].map(f => (
            <Card key={f.t}>
              <div className="kf-feature-icon">{f.icon}</div>
              <div className="kf-feature-title">{f.t}</div>
              <div className="kf-feature-body">{f.d}</div>
            </Card>
          ))}
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section id="how-it-works" className="kf-section">
        <Tag>How It Works</Tag>
        <SectionTitle>
          Score in <span className="kf-green">5 Simple Steps</span>
        </SectionTitle>

        <div className="kf-steps">
          {[
            { n: 1, icon: "▶", t: "Tap Play Free Now",         d: "Jump straight into the game. No sign-up, no loading screen, no waiting." },
            { n: 2, icon: "👁", t: "Read the Goalkeeper",       d: "Watch the keeper shift his weight and decide which corner to target." },
            { n: 3, icon: "🎯", t: "Move Into the Goal Area",   d: "A yellow crosshair appears when you hover over the goal. That is your aim point." },
            { n: 4, icon: "🖱", t: "Click to Shoot",            d: "Click your chosen spot inside the goal. The ball launches with realistic curve and pace." },
            { n: 5, icon: "🏆", t: "Complete 5 Penalties",      d: "Score as many as you can to earn your final rating from Need Practice to Outstanding." },
          ].map(s => (
            <Card key={s.n} glow>
              <div className="kf-step-row">
                <div className="kf-step-num">{s.n}</div>
                <div>
                  <div className="kf-step-head">
                    <span className="kf-step-icon">{s.icon}</span>
                    <span className="kf-step-title">{s.t}</span>
                  </div>
                  <p className="kf-step-body">{s.d}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <button className="kf-btn-play kf-btn-play--full" style={{ marginTop: 8 }} onClick={onPlay}>
          Try It Now
        </button>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          RATINGS
      ══════════════════════════════════════ */}
      <section id="ratings" className="kf-section">
        <Tag>Your Rating</Tag>
        <SectionTitle>
          Can You Get <span className="kf-gold">Outstanding?</span>
        </SectionTitle>
        <p className="kf-body-text" style={{ marginBottom: 24 }}>
          Your final rating depends on how many of your 5 kicks find the back of the net.
        </p>

        <div className="kf-ratings">
          {[
            { s: "5 / 5", l: "Outstanding!", c: "#ffd700", w: 100 },
            { s: "4 / 5", l: "Great!",        c: "#4ade80", w: 80  },
            { s: "3 / 5", l: "Not Bad",        c: "#fb923c", w: 60  },
            { s: "0–2 / 5", l: "Need Practice", c: "#f87171", w: 38  },
          ].map(r => (
            <Card key={r.l}>
              <div className="kf-rating-row">
                <div className="kf-rating-score" style={{ color: r.c }}>{r.s}</div>
                <div style={{ flex: 1 }}>
                  <div className="kf-rating-label" style={{ color: r.c }}>{r.l}</div>
                  <div className="kf-rating-bar">
                    <div className="kf-rating-fill" style={{ width: `${r.w}%`, background: r.c }} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <section className="kf-section" style={{ paddingTop: 10 }}>
        <div className="kf-cta-banner">
          <div className="kf-cta-glow" />
          <div style={{ position: "relative" }}>
            <div className="kf-cta-ball">⚽</div>
            <h2 className="kf-cta-title">Ready to Score?</h2>
            <p className="kf-cta-body">
              The goalkeeper is waiting. The crowd is watching. Step up and take your shot.
            </p>
            <button className="kf-btn-play kf-btn-play--cta" onClick={onPlay}>
              PLAY FREE NOW
            </button>
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          LEGAL
      ══════════════════════════════════════ */}
      <section id="legal" className="kf-section">
        <Tag>Legal</Tag>
        <SectionTitle>Terms of Use</SectionTitle>
        <p className="kf-body-text" style={{ marginBottom: 24 }}>
          By using Kickoff 2026 you agree to these terms. We have kept them short and clear.
        </p>
        <div className="kf-stack">
          {[
            { t: "Free Entertainment Only",   b: "Kickoff 2026 is provided entirely free of charge as a browser-based entertainment product. No real money, gambling, or wagering is involved at any stage of gameplay." },
            { t: "No Account Required",        b: "You do not need to create an account, provide any personal information, or agree to any subscription to play. The game runs entirely in your browser." },
            { t: "Intellectual Property",      b: "All game artwork, code, and branding associated with Kickoff 2026 are the property of their respective creators. Unauthorized reproduction or redistribution is not permitted." },
            { t: "Service Availability",       b: "We strive to keep the game available at all times but cannot guarantee uninterrupted access. The service may be updated, modified, or temporarily unavailable without prior notice." },
            { t: "Limitation of Liability",    b: "Kickoff 2026 is provided as-is with no warranties of any kind, express or implied. Your use of the service is at your own risk." },
          ].map(item => (
            <Card key={item.t}>
              <div className="kf-legal-title">{item.t}</div>
              <div className="kf-legal-body">{item.b}</div>
            </Card>
          ))}
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          COOKIES
      ══════════════════════════════════════ */}
      <section id="cookies" className="kf-section">
        <Tag>Privacy</Tag>
        <SectionTitle>Cookie Policy</SectionTitle>
        <p className="kf-body-text" style={{ marginBottom: 24 }}>
          We believe your data belongs to you. Here is exactly how Kickoff 2026 handles information about your visit.
        </p>
        <div className="kf-stack">
          {[
            { icon: "✅", t: "No Tracking Cookies", b: "We do not set advertising cookies, cross-site tracking pixels, or any technology designed to follow you around the web. Your browsing is your own business.", hi: true },
            { icon: "⚙️", t: "Functional Only",     b: "Your browser may store session data to keep the game running smoothly. This data never leaves your device and is not transmitted to any third-party server.", hi: false },
            { icon: "📊", t: "Basic Analytics",     b: "We may collect anonymous, aggregated statistics such as page views to understand how many people are playing. This data contains no personally identifiable information.", hi: false },
            { icon: "🔒", t: "Your Control",        b: "You can clear all locally stored data at any time through your browser settings. Doing so will not affect your ability to play the game.", hi: false },
          ].map(item => (
            <div key={item.t} className={`kf-cookie-row${item.hi ? " kf-cookie-row--hi" : ""}`}>
              <span className="kf-cookie-icon">{item.icon}</span>
              <div>
                <div className="kf-legal-title">{item.t}</div>
                <div className="kf-legal-body">{item.b}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="kf-fine-print">
          Last updated: June 2026. If you have any questions about our privacy practices please review this page at any time.
        </p>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="kf-footer">
        <div className="kf-footer-inner">

          {/* Brand */}
          <div className="kf-footer-brand">
            <Logo size="md" />
            <p className="kf-footer-tagline">
              The free browser penalty kick game for football fans everywhere.
              Step up to the spot, pick your corner, and beat the keeper.
            </p>
            <div className="kf-live-badge">
              <div className="kf-live-dot" />
              <span>Live at kickoff2026.fun</span>
            </div>

            {/* Orynth badge */}
            <div className="kf-orynth-badge">
              <a
                href="https://orynth.dev/projects/kickoff-2026"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://orynth.dev/api/badge/kickoff-2026?theme=dark&style=default"
                  alt="Featured on Orynth"
                  width="200"
                  height="62"
                  style={{ display: "block" }}
                />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="kf-footer-cols">
            {/* Play */}
            <div>
              <div className="kf-footer-col-head kf-green">Play</div>
              {[
                { label: "Play Free Now",  fn: onPlay },
                { label: "How It Works",   fn: () => go("how-it-works") },
                { label: "Your Rating",    fn: () => go("ratings") },
              ].map(l => (
                <button key={l.label} className="kf-footer-link" onClick={l.fn}>
                  {l.label}
                </button>
              ))}
            </div>

            {/* About */}
            <div>
              <div className="kf-footer-col-head kf-green">About</div>
              {[
                { label: "About the Game", fn: () => go("about") },
                { label: "Game Features",  fn: () => go("about") },
                { label: "Stadium Mode",   fn: () => go("about") },
              ].map(l => (
                <button key={l.label} className="kf-footer-link" onClick={l.fn}>
                  {l.label}
                </button>
              ))}
            </div>

            {/* Legal */}
            <div>
              <div className="kf-footer-col-head" style={{ color: "rgba(255,255,255,0.35)" }}>Legal</div>
              {[
                { label: "Terms of Use",          fn: () => go("legal") },
                { label: "Limitation of Liability", fn: () => go("legal") },
                { label: "Intellectual Property",  fn: () => go("legal") },
              ].map(l => (
                <button key={l.label} className="kf-footer-link" onClick={l.fn}>
                  {l.label}
                </button>
              ))}
            </div>

            {/* Privacy */}
            <div>
              <div className="kf-footer-col-head" style={{ color: "rgba(255,255,255,0.35)" }}>Privacy</div>
              {[
                { label: "Cookie Policy",    fn: () => go("cookies") },
                { label: "No Tracking",      fn: () => go("cookies") },
                { label: "Your Data Rights", fn: () => go("cookies") },
              ].map(l => (
                <button key={l.label} className="kf-footer-link" onClick={l.fn}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Play CTA in footer */}
          <button className="kf-btn-play kf-btn-play--full" onClick={onPlay}>
            PLAY FREE NOW
          </button>
        </div>

        {/* Bottom bar */}
        <div className="kf-footer-bottom">
          <span>© 2026 Kickoff2026.fun</span>
          <span className="kf-footer-sep">|</span>
          <span>All rights reserved</span>
          <span className="kf-footer-sep">|</span>
          <span>Celebrating FIFA World Cup 2026</span>
        </div>
      </footer>

      {/* ══════════════════════════════════════
          GLOBAL STYLES
      ══════════════════════════════════════ */}
      <style>{`
        /* ── Reset ── */
        .kf-root * { box-sizing: border-box; }

        /* ── Root ── */
        .kf-root {
          background: #060c18;
          color: #fff;
          font-family: Inter, system-ui, sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── Tag ── */
        .kf-tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 20px;
          background: rgba(74,222,128,0.1);
          color: #4ade80;
          border: 1px solid rgba(74,222,128,0.22);
          margin-bottom: 14px;
        }

        /* ── Section title ── */
        .kf-section-title {
          font-size: clamp(22px, 6vw, 28px);
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 14px;
          color: #fff;
        }

        /* ── Color helpers ── */
        .kf-green { color: #4ade80; }
        .kf-gold  { color: #ffd700; }

        /* ── Divider ── */
        .kf-divider {
          height: 1px;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);
          margin: 0 20px;
        }

        /* ── Card ── */
        .kf-card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 16px 18px;
        }
        .kf-card--glow {
          background: linear-gradient(135deg,rgba(74,222,128,0.07),rgba(74,222,128,0.02));
          border-color: rgba(74,222,128,0.18);
        }

        /* ── Section ── */
        .kf-section {
          padding: 48px 20px;
          max-width: 600px;
          margin: 0 auto;
          width: 100%;
        }

        /* ── Body text ── */
        .kf-body-text {
          font-size: 14px;
          line-height: 1.75;
          color: rgba(255,255,255,0.58);
        }

        /* ── Stack (vertical gap) ── */
        .kf-stack { display: flex; flex-direction: column; gap: 10px; }

        /* ── 2-col grid ── */
        .kf-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* ── Feature card internals ── */
        .kf-feature-icon  { font-size: 26px; margin-bottom: 8px; }
        .kf-feature-title { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 6px; }
        .kf-feature-body  { font-size: 12px; line-height: 1.6; color: rgba(255,255,255,0.48); }

        /* ── Steps ── */
        .kf-steps { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
        .kf-step-row   { display: flex; gap: 14px; align-items: flex-start; }
        .kf-step-num   {
          flex-shrink: 0; width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 16px;
          background: linear-gradient(135deg,#16a34a,#4ade80); color: #fff;
        }
        .kf-step-head  { display: flex; align-items: center; gap: 7px; margin-bottom: 5px; }
        .kf-step-icon  { font-size: 16px; }
        .kf-step-title { font-size: 14px; font-weight: 700; color: #fff; }
        .kf-step-body  { font-size: 13px; line-height: 1.65; color: rgba(255,255,255,0.52); }

        /* ── Ratings ── */
        .kf-ratings      { display: flex; flex-direction: column; gap: 10px; }
        .kf-rating-row   { display: flex; align-items: center; gap: 14px; }
        .kf-rating-score { font-size: 18px; font-weight: 900; min-width: 52px; flex-shrink: 0; }
        .kf-rating-label { font-size: 13px; font-weight: 700; margin-bottom: 8px; }
        .kf-rating-bar   { height: 5px; border-radius: 4px; background: rgba(255,255,255,0.07); overflow: hidden; }
        .kf-rating-fill  { height: 100%; border-radius: 4px; }

        /* ── CTA banner ── */
        .kf-cta-banner {
          border-radius: 24px; padding: 36px 24px; text-align: center;
          background: linear-gradient(135deg,rgba(13,51,32,0.95),rgba(15,61,38,0.95));
          border: 1px solid rgba(74,222,128,0.2);
          box-shadow: 0 0 50px rgba(74,222,128,0.08) inset;
          position: relative; overflow: hidden;
        }
        .kf-cta-glow {
          position: absolute; top: 0; left: 0; right: 0; height: 50%; pointer-events: none;
          background: radial-gradient(ellipse at 50% 0%,rgba(74,222,128,0.1),transparent 70%);
        }
        .kf-cta-ball  { font-size: 40px; margin-bottom: 10px; }
        .kf-cta-title { font-size: 22px; font-weight: 900; margin-bottom: 10px; }
        .kf-cta-body  { font-size: 13px; color: rgba(255,255,255,0.55); margin-bottom: 22px; line-height: 1.65; }

        /* ── Legal / cookie ── */
        .kf-legal-title { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 7px; }
        .kf-legal-body  { font-size: 13px; line-height: 1.7; color: rgba(255,255,255,0.48); }
        .kf-cookie-row  {
          display: flex; gap: 14px; padding: 16px 18px; border-radius: 16px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
        }
        .kf-cookie-row--hi {
          background: rgba(74,222,128,0.06); border-color: rgba(74,222,128,0.18);
        }
        .kf-cookie-icon { font-size: 22px; flex-shrink: 0; }
        .kf-fine-print  { font-size: 12px; color: rgba(255,255,255,0.28); line-height: 1.7; margin-top: 20px; }

        /* ── Buttons ── */
        .kf-btn-play {
          background: linear-gradient(135deg,#16a34a,#22c55e,#4ade80);
          color: #fff; border: none; cursor: pointer;
          font-weight: 900; letter-spacing: 0.04em;
          transition: box-shadow 0.2s, transform 0.15s;
        }
        .kf-btn-play:hover {
          box-shadow: 0 0 28px rgba(74,222,128,0.5);
          transform: scale(1.03);
        }
        .kf-btn-play--sm {
          border-radius: 50px; padding: 8px 18px;
          font-size: 13px;
          box-shadow: 0 0 16px rgba(74,222,128,0.3);
        }
        .kf-btn-play--hero {
          display: block; width: 100%; border-radius: 16px;
          padding: 18px 0; font-size: 17px;
          box-shadow: 0 8px 40px rgba(74,222,128,0.4), 0 0 0 1px rgba(74,222,128,0.18);
          margin-bottom: 10px;
        }
        .kf-btn-play--full {
          display: block; width: 100%; border-radius: 14px;
          padding: 16px 0; font-size: 15px;
          box-shadow: 0 4px 24px rgba(74,222,128,0.32);
        }
        .kf-btn-play--cta {
          border-radius: 14px; padding: 15px 40px;
          font-size: 16px;
          box-shadow: 0 4px 28px rgba(74,222,128,0.45);
        }

        /* ════════════════════════════════════
           NAV
        ════════════════════════════════════ */
        .kf-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: all 0.3s ease;
        }
        .kf-nav--scrolled {
          background: rgba(6,12,24,0.92);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .kf-nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 20px; max-width: 1200px; margin: 0 auto;
          gap: 12px;
        }
        /* Desktop nav links — hidden on mobile */
        .kf-nav-links {
          display: none;
          align-items: center; gap: 4px; flex: 1; justify-content: center;
        }
        .kf-nav-link {
          background: none; border: none; cursor: pointer;
          font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.6); padding: 6px 10px; border-radius: 8px;
          transition: color 0.2s;
        }
        .kf-nav-link:hover { color: #fff; }

        /* Right side: play btn + hamburger */
        .kf-nav-right {
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
        }

        /* Hamburger — shown on mobile */
        .kf-hamburger {
          display: flex; flex-direction: column; justify-content: center;
          gap: 5px; background: none; border: none; cursor: pointer;
          padding: 6px; border-radius: 8px; width: 38px; height: 38px;
        }
        .kf-hamburger span {
          display: block; height: 2px; border-radius: 2px;
          background: rgba(255,255,255,0.75);
          transition: transform 0.25s, opacity 0.25s;
          transform-origin: center;
        }
        .kf-hamburger--open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .kf-hamburger--open span:nth-child(2) { opacity: 0; }
        .kf-hamburger--open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile drawer */
        .kf-mobile-menu {
          display: flex; flex-direction: column; gap: 4px;
          padding: 0 16px;
          max-height: 0; overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
          background: rgba(6,12,24,0.97);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .kf-mobile-menu--open {
          max-height: 400px;
          padding: 12px 16px 20px;
        }
        .kf-mobile-link {
          background: none; border: none; cursor: pointer;
          font-size: 16px; font-weight: 600;
          color: rgba(255,255,255,0.75); padding: 12px 8px;
          text-align: left; border-radius: 10px;
          transition: background 0.15s, color 0.15s;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .kf-mobile-link:hover { background: rgba(255,255,255,0.05); color: #fff; }

        /* ════════════════════════════════════
           HERO
        ════════════════════════════════════ */
        .kf-hero {
          position: relative; min-height: 100svh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 90px 20px 60px; text-align: center; overflow: hidden;
        }
        .kf-hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 80% 50% at 50% 20%,rgba(74,222,128,0.07) 0%,transparent 70%);
        }
        .kf-hero-fade {
          position: absolute; bottom: 0; left: 0; right: 0; height: 38%; pointer-events: none;
          background: linear-gradient(180deg,transparent,rgba(10,50,26,0.55));
        }
        .kf-floodlight {
          position: absolute; top: 80px; width: 8px; height: 8px; border-radius: 50%;
          background: #fffde7; box-shadow: 0 0 20px 8px rgba(255,253,200,0.3);
        }
        .kf-floodlight--left  { left: 18px; }
        .kf-floodlight--right { right: 18px; }
        .kf-hero-content {
          position: relative; z-index: 2; max-width: 400px; width: 100%;
        }
        .kf-hero-logo   { margin-bottom: 20px; display: flex; justify-content: center; }
        .kf-badge {
          display: inline-block; font-size: 11px; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 20px;
          background: rgba(74,222,128,0.1); color: #4ade80;
          border: 1px solid rgba(74,222,128,0.22); margin-bottom: 20px;
        }
        .kf-hero-title {
          font-size: clamp(30px, 9vw, 42px); font-weight: 900;
          line-height: 1.15; letter-spacing: -0.025em; margin-bottom: 16px;
        }
        .kf-hero-sub {
          font-size: 15px; line-height: 1.65; color: rgba(255,255,255,0.58); margin-bottom: 28px;
        }
        .kf-hero-note { font-size: 12px; color: rgba(255,255,255,0.28); }

        .kf-stats {
          position: relative; z-index: 2;
          display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;
          width: 100%; max-width: 400px; margin-top: 32px;
        }
        .kf-stat {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 14px 8px; text-align: center;
        }
        .kf-stat-val { font-size: 26px; font-weight: 900; color: #4ade80; line-height: 1; }
        .kf-stat-lbl {
          font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(255,255,255,0.4); margin-top: 5px;
        }
        .kf-scroll-hint {
          position: relative; z-index: 2; margin-top: 36px;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          font-size: 11px; color: rgba(255,255,255,0.28);
        }
        .kf-bounce { animation: kfBounce 2s infinite; }

        /* ════════════════════════════════════
           FOOTER
        ════════════════════════════════════ */
        .kf-footer {
          background: linear-gradient(180deg,rgba(0,0,0,0.3),rgba(3,7,15,0.95));
          border-top: 1px solid rgba(255,255,255,0.07);
          margin-top: 8px;
        }
        .kf-footer-inner {
          max-width: 600px; margin: 0 auto; padding: 48px 24px 36px;
        }
        .kf-footer-brand  { margin-bottom: 36px; }
        .kf-footer-tagline {
          font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.7;
          margin-top: 14px; max-width: 280px;
        }
        .kf-live-badge {
          display: inline-flex; align-items: center; gap: 7px; margin-top: 14px;
          padding: 6px 12px; border-radius: 20px;
          background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.18);
          font-size: 11px; font-weight: 600; color: #4ade80;
        }
        .kf-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #4ade80; box-shadow: 0 0 6px #4ade80;
        }
        .kf-orynth-badge { margin-top: 20px; }
        .kf-orynth-badge img { border-radius: 10px; opacity: 0.9; transition: opacity 0.2s; }
        .kf-orynth-badge img:hover { opacity: 1; }

        .kf-footer-cols {
          display: grid; grid-template-columns: 1fr 1fr; gap: 28px 16px; margin-bottom: 36px;
        }
        .kf-footer-col-head {
          font-size: 10px; font-weight: 800; letter-spacing: 0.18em;
          text-transform: uppercase; margin-bottom: 14px;
        }
        .kf-footer-link {
          display: block; background: none; border: none; cursor: pointer;
          font-size: 14px; color: rgba(255,255,255,0.55); padding: 6px 0;
          text-align: left; width: 100%; transition: color 0.2s;
        }
        .kf-footer-link:hover { color: #fff; }
        .kf-footer-sep { color: rgba(255,255,255,0.12); }

        .kf-footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 18px 24px; max-width: 600px; margin: 0 auto;
          display: flex; align-items: center; flex-wrap: wrap;
          justify-content: center; gap: 8px;
          font-size: 11px; color: rgba(255,255,255,0.22);
        }

        /* ════════════════════════════════════
           KEYFRAMES
        ════════════════════════════════════ */
        @keyframes kfBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }

        /* ════════════════════════════════════
           RESPONSIVE — tablet & up (≥640px)
        ════════════════════════════════════ */
        @media (min-width: 640px) {
          /* Show desktop nav links, hide hamburger */
          .kf-nav-links    { display: flex; }
          .kf-hamburger    { display: none; }
          .kf-mobile-menu  { display: none !important; }

          .kf-section      { padding: 64px 32px; }
          .kf-footer-cols  { grid-template-columns: repeat(4, 1fr); }
          .kf-footer-inner { padding: 56px 32px 40px; }
          .kf-hero         { padding: 100px 32px 80px; }
          .kf-hero-content { max-width: 480px; }
          .kf-stats        { max-width: 480px; }
        }
      `}</style>
    </div>
  );
}
