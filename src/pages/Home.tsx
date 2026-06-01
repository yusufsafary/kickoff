import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Logo from "@/components/Logo";

interface HomeProps {
  onPlay: () => void;
}

/* ─────────────────────────────────────────────────────────
   Scroll progress bar
───────────────────────────────────────────────────────── */
function ProgressBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 200,
      background: "rgba(255,255,255,0.06)",
    }}>
      <div style={{
        height: "100%", width: `${pct}%`,
        background: "linear-gradient(90deg,#16a34a,#4ade80)",
        transition: "width 0.08s linear",
        boxShadow: "0 0 8px rgba(74,222,128,0.7)",
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Tiny reusables
───────────────────────────────────────────────────────── */
function Tag({ children }: { children: ReactNode }) {
  return <span className="kf-tag">{children}</span>;
}
function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="kf-section-title">{children}</h2>;
}
function Card({ children, glow = false }: { children: ReactNode; glow?: boolean }) {
  return <div className={`kf-card${glow ? " kf-card--glow" : ""}`}>{children}</div>;
}
function Divider() {
  return <div className="kf-divider" />;
}

/* ─────────────────────────────────────────────────────────
   Main
───────────────────────────────────────────────────────── */
export default function Home({ onPlay }: HomeProps) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const NAV = [
    { label: "Gameplay", id: "gameplay" },
    { label: "How to Play", id: "how-to-play" },
    { label: "Ratings",  id: "ratings" },
  ];

  return (
    <div className="kf-root">
      <ProgressBar />

      {/* ══════════════════════════════════════
          NAV
      ══════════════════════════════════════ */}
      <nav className={`kf-nav${scrolled ? " kf-nav--scrolled" : ""}`} ref={menuRef}>
        <div className="kf-nav-inner">
          <Logo size="sm" />

          <div className="kf-nav-links">
            {NAV.map(l => (
              <button key={l.id} className="kf-nav-link" onClick={() => go(l.id)}>
                {l.label}
              </button>
            ))}
          </div>

          <div className="kf-nav-right">
            <button className="kf-btn kf-btn--sm" onClick={onPlay}>Play Free</button>
            <button
              className={`kf-hamburger${menuOpen ? " kf-hamburger--open" : ""}`}
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        <div className={`kf-drawer${menuOpen ? " kf-drawer--open" : ""}`}>
          {NAV.map(l => (
            <button key={l.id} className="kf-drawer-link" onClick={() => go(l.id)}>
              {l.label}
            </button>
          ))}
          <button className="kf-btn kf-btn--full" style={{ marginTop: 8 }}
            onClick={() => { setMenuOpen(false); onPlay(); }}>
            ▶ Play Free Now
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          HERO — no logo repeat, visceral copy
      ══════════════════════════════════════ */}
      <section className="kf-hero">
        <div className="kf-hero-bg" />
        <div className="kf-hero-fade" />
        <div className="kf-floodlight kf-floodlight--l" />
        <div className="kf-floodlight kf-floodlight--r" />

        <div className="kf-hero-inner">

          {/* Pill */}
          <span className="kf-pill">Free · In-browser · No account</span>

          {/* Headline */}
          <h1 className="kf-hero-h1">
            5 kicks.<br />
            One&nbsp;chance.<br />
            <span className="kf-green">No&nbsp;excuses.</span>
          </h1>

          {/* Sub */}
          <p className="kf-hero-sub">
            Pick your corner. Read the keeper's dive. Click.
            <br className="kf-br-hide" />
            The stadium's watching. World Cup 2026 awaits.
          </p>

          <button className="kf-btn kf-btn--hero" onClick={onPlay}>
            Take the penalty
          </button>

          {/* 3 quick truths — not marketing stats */}
          <div className="kf-truths">
            <div className="kf-truth">
              <span className="kf-truth-n">118<span className="kf-truth-unit">ms</span></span>
              <span className="kf-truth-l">keeper reaction</span>
            </div>
            <div className="kf-truth-sep" />
            <div className="kf-truth">
              <span className="kf-truth-n">64</span>
              <span className="kf-truth-l">aim zones</span>
            </div>
            <div className="kf-truth-sep" />
            <div className="kf-truth">
              <span className="kf-truth-n">5</span>
              <span className="kf-truth-l">kicks per round</span>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div className="kf-scroll-hint">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="kf-bounce-icon">
            <path d="M10 4v10M5 11l5 5 5-5" stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          GAMEPLAY — replaces generic "About"
      ══════════════════════════════════════ */}
      <section id="gameplay" className="kf-section">
        <Tag>The Game</Tag>
        <SectionTitle>
          It's just you,<br />the keeper, and the <span className="kf-green">back of the net.</span>
        </SectionTitle>
        <p className="kf-body">
          Kickoff 2026 puts you on the penalty spot of a floodlit night stadium.
          The crowd is silent. The keeper is shifting weight. You have one click to decide.
        </p>

        <div className="kf-grid-2" style={{ marginTop: 24 }}>
          {[
            {
              icon: "🎯",
              t: "Click to aim",
              d: "Hover over the goal — a crosshair locks on. Click anywhere inside to shoot. No sliders, no meters, no fuss.",
            },
            {
              icon: "🧤",
              t: "Keeper reads you",
              d: "The goalkeeper AI tracks your movement history. Predictable shooters get saved. Mix it up.",
            },
            {
              icon: "🌀",
              t: "Ball curves",
              d: "Off-center clicks add real curl. A shot to the top corner bends differently than a planted low drive.",
            },
            {
              icon: "🏟️",
              t: "Night stadium",
              d: "Floodlights, pitch lines, crowd noise. Feels like you're really there at 90+4.",
            },
          ].map(f => (
            <Card key={f.t}>
              <div className="kf-feat-icon">{f.icon}</div>
              <div className="kf-feat-title">{f.t}</div>
              <div className="kf-feat-body">{f.d}</div>
            </Card>
          ))}
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          HOW TO PLAY — 3 steps, tight
      ══════════════════════════════════════ */}
      <section id="how-to-play" className="kf-section">
        <Tag>How to Play</Tag>
        <SectionTitle>
          Three moves.<br /><span className="kf-green">That's all it takes.</span>
        </SectionTitle>

        <div className="kf-steps">
          {[
            {
              n: "01",
              t: "Tap Play Free",
              d: "No account, no download, no ad wall. You're live in under a second.",
            },
            {
              n: "02",
              t: "Hover → click to shoot",
              d: "Move your cursor over the goal. A crosshair appears. Click your spot. That's your kick.",
            },
            {
              n: "03",
              t: "Score 5, get rated",
              d: "5 penalties per session. Every goal counts. Every miss hurts. See where you rank.",
            },
          ].map(s => (
            <div key={s.n} className="kf-step">
              <div className="kf-step-n">{s.n}</div>
              <div>
                <div className="kf-step-t">{s.t}</div>
                <div className="kf-step-d">{s.d}</div>
              </div>
            </div>
          ))}
        </div>

        <button className="kf-btn kf-btn--full" style={{ marginTop: 24 }} onClick={onPlay}>
          Try it now — it's free
        </button>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          RATINGS
      ══════════════════════════════════════ */}
      <section id="ratings" className="kf-section">
        <Tag>Your Rating</Tag>
        <SectionTitle>
          Where do you <span className="kf-gold">actually</span> rank?
        </SectionTitle>
        <p className="kf-body" style={{ marginBottom: 24 }}>
          Don't lie to yourself. Five shots tells the truth.
        </p>

        <div className="kf-ratings">
          {[
            { s: "5/5", l: "Outstanding", sub: "Flawless. Send this to your group chat.", c: "#ffd700", w: 100 },
            { s: "4/5", l: "Clinical",    sub: "Pro-level finishing. One slip.",          c: "#4ade80", w: 80  },
            { s: "3/5", l: "Decent",      sub: "Goalkeeper is still wary of you.",        c: "#fb923c", w: 60  },
            { s: "0–2/5", l: "Needs Work", sub: "The keeper is starting to enjoy this.", c: "#f87171", w: 30  },
          ].map(r => (
            <div key={r.l} className="kf-rating-card">
              <div className="kf-rating-score" style={{ color: r.c }}>{r.s}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="kf-rating-label" style={{ color: r.c }}>{r.l}</div>
                <div className="kf-rating-sub">{r.sub}</div>
                <div className="kf-rating-bar">
                  <div className="kf-rating-fill" style={{ width: `${r.w}%`, background: r.c }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA — one final push
      ══════════════════════════════════════ */}
      <section className="kf-section" style={{ paddingTop: 0 }}>
        <div className="kf-cta">
          <div className="kf-cta-glow" />
          <p className="kf-cta-eyebrow">The penalty spot is empty.</p>
          <h2 className="kf-cta-h2">Step up.</h2>
          <button className="kf-btn kf-btn--cta" onClick={onPlay}>
            Take the penalty — free
          </button>
          <p className="kf-cta-note">kickoff2026.fun · World Cup 2026</p>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          FOOTER — Legal + Cookie live here only
      ══════════════════════════════════════ */}
      <footer className="kf-footer">
        <div className="kf-footer-inner">

          {/* Brand */}
          <div className="kf-footer-brand">
            <Logo size="md" />
            <p className="kf-footer-tag">
              Free browser penalty kicks for football fans everywhere.
              No installs. No accounts. Just football.
            </p>
            <div className="kf-live-pill">
              <div className="kf-live-dot" />
              Live at kickoff2026.fun
            </div>
            <div style={{ marginTop: 20 }}>
              <a
                href="https://orynth.dev/projects/kickoff-2026"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://orynth.dev/api/badge/kickoff-2026?theme=dark&style=default"
                  alt="Featured on Orynth"
                  width="180"
                  height="56"
                  style={{ display: "block", borderRadius: 10, opacity: 0.9 }}
                />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="kf-footer-cols">
            <div>
              <div className="kf-col-head kf-green">Play</div>
              {[
                { l: "Play Free Now",   fn: onPlay },
                { l: "How to Play",     fn: () => go("how-to-play") },
                { l: "Ratings Guide",   fn: () => go("ratings") },
              ].map(x => (
                <button key={x.l} className="kf-footer-link" onClick={x.fn}>{x.l}</button>
              ))}
            </div>

            <div>
              <div className="kf-col-head kf-green">Game</div>
              {[
                { l: "Gameplay",    fn: () => go("gameplay") },
                { l: "Features",    fn: () => go("gameplay") },
                { l: "Stadium",     fn: () => go("gameplay") },
              ].map(x => (
                <button key={x.l} className="kf-footer-link" onClick={x.fn}>{x.l}</button>
              ))}
            </div>

            <div>
              <div className="kf-col-head" style={{ color: "rgba(255,255,255,0.3)" }}>Legal &amp; Privacy</div>
              {[
                { l: "Terms of Use",   fn: () => go("footer-legal") },
                { l: "Cookie Policy",  fn: () => go("footer-legal") },
                { l: "No Tracking",    fn: () => go("footer-legal") },
              ].map(x => (
                <button key={x.l} className="kf-footer-link" onClick={x.fn}>{x.l}</button>
              ))}
            </div>
          </div>

          {/* Play CTA */}
          <button className="kf-btn kf-btn--full" style={{ marginTop: 8 }} onClick={onPlay}>
            PLAY FREE NOW
          </button>

          {/* ── Legal & Privacy — compact, footer-only ── */}
          <div id="footer-legal" className="kf-legal-block">
            <div className="kf-legal-row">
              <span className="kf-legal-head">Terms of Use</span>
              <span className="kf-legal-text">
                Kickoff 2026 is free entertainment. No gambling, no real money, no wagering.
                All artwork and code are property of their creators — unauthorized redistribution
                is not permitted. Service is provided as-is with no warranties.
              </span>
            </div>
            <div className="kf-legal-row">
              <span className="kf-legal-head">Privacy &amp; Cookies</span>
              <span className="kf-legal-text">
                We don't set tracking or advertising cookies. Your browser may store session data
                locally — it never leaves your device. We may collect anonymous page-view counts.
                Clear browser data any time with no effect on gameplay.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="kf-footer-bottom">
          <span>© 2026 Kickoff2026.fun</span>
          <span className="kf-sep">·</span>
          <span>All rights reserved</span>
          <span className="kf-sep">·</span>
          <span>Celebrating FIFA World Cup 2026</span>
        </div>
      </footer>

      {/* ══════════════════════════════════════
          STYLES
      ══════════════════════════════════════ */}
      <style>{`
        /* reset */
        .kf-root * { box-sizing: border-box; }

        /* root */
        .kf-root {
          background: #060c18;
          color: #fff;
          font-family: Inter, system-ui, sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* colours */
        .kf-green { color: #4ade80; }
        .kf-gold  { color: #ffd700; }

        /* divider */
        .kf-divider {
          height: 1px;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);
          margin: 0 24px;
        }

        /* tag */
        .kf-tag {
          display: inline-block; font-size: 10px; font-weight: 800;
          letter-spacing: 0.18em; text-transform: uppercase;
          padding: 4px 12px; border-radius: 20px;
          background: rgba(74,222,128,0.1); color: #4ade80;
          border: 1px solid rgba(74,222,128,0.2); margin-bottom: 14px;
        }

        /* section title */
        .kf-section-title {
          font-size: clamp(24px, 7vw, 32px); font-weight: 900;
          letter-spacing: -0.025em; line-height: 1.15;
          margin-bottom: 14px; color: #fff;
        }

        /* section */
        .kf-section {
          padding: 52px 20px;
          max-width: 560px; margin: 0 auto; width: 100%;
        }

        /* body text */
        .kf-body {
          font-size: 14px; line-height: 1.75; color: rgba(255,255,255,0.55);
        }

        /* card */
        .kf-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 18px;
        }
        .kf-card--glow {
          background: linear-gradient(135deg,rgba(74,222,128,0.06),rgba(74,222,128,0.01));
          border-color: rgba(74,222,128,0.15);
        }

        /* feature cards */
        .kf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .kf-feat-icon  { font-size: 28px; margin-bottom: 10px; }
        .kf-feat-title { font-size: 13px; font-weight: 800; color: #fff; margin-bottom: 6px; }
        .kf-feat-body  { font-size: 12px; line-height: 1.65; color: rgba(255,255,255,0.45); }

        /* steps */
        .kf-steps { display: flex; flex-direction: column; gap: 0; }
        .kf-step {
          display: flex; gap: 18px; align-items: flex-start;
          padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .kf-step:last-child { border-bottom: none; }
        .kf-step-n {
          font-size: 13px; font-weight: 900; color: #4ade80;
          letter-spacing: 0.05em; flex-shrink: 0; width: 28px; padding-top: 2px;
        }
        .kf-step-t { font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 5px; }
        .kf-step-d { font-size: 13px; line-height: 1.65; color: rgba(255,255,255,0.5); }

        /* ratings */
        .kf-ratings { display: flex; flex-direction: column; gap: 10px; }
        .kf-rating-card {
          display: flex; gap: 16px; align-items: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 14px 16px;
        }
        .kf-rating-score {
          font-size: 20px; font-weight: 900; min-width: 52px;
          flex-shrink: 0; letter-spacing: -0.02em;
        }
        .kf-rating-label { font-size: 14px; font-weight: 800; margin-bottom: 3px; }
        .kf-rating-sub { font-size: 11px; color: rgba(255,255,255,0.4); margin-bottom: 8px; }
        .kf-rating-bar { height: 4px; border-radius: 4px; background: rgba(255,255,255,0.07); overflow: hidden; }
        .kf-rating-fill { height: 100%; border-radius: 4px; }

        /* CTA */
        .kf-cta {
          border-radius: 24px; padding: 40px 24px; text-align: center;
          background: radial-gradient(ellipse 100% 80% at 50% 0%, rgba(22,163,74,0.12) 0%, transparent 70%),
                      linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(74,222,128,0.15);
          position: relative; overflow: hidden;
        }
        .kf-cta-glow {
          position: absolute; top: -1px; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg,transparent,rgba(74,222,128,0.5),transparent);
        }
        .kf-cta-eyebrow {
          font-size: 12px; font-weight: 600; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.4); text-transform: uppercase; margin-bottom: 10px;
        }
        .kf-cta-h2 {
          font-size: clamp(36px,12vw,64px); font-weight: 900;
          letter-spacing: -0.04em; color: #fff; margin-bottom: 24px;
          line-height: 1;
        }
        .kf-cta-note {
          margin-top: 14px; font-size: 11px; color: rgba(255,255,255,0.25);
          letter-spacing: 0.05em;
        }

        /* buttons */
        .kf-btn {
          background: linear-gradient(135deg,#16a34a,#22c55e,#4ade80);
          color: #fff; border: none; cursor: pointer;
          font-family: inherit; font-weight: 800; letter-spacing: 0.03em;
          transition: filter 0.2s, transform 0.15s;
        }
        .kf-btn:hover  { filter: brightness(1.12); transform: scale(1.03); }
        .kf-btn:active { transform: scale(0.98); }
        .kf-btn--sm    { border-radius: 50px; padding: 8px 18px; font-size: 13px; box-shadow: 0 0 16px rgba(74,222,128,0.25); }
        .kf-btn--hero  {
          display: block; width: 100%; border-radius: 16px;
          padding: 18px; font-size: 18px; letter-spacing: 0.05em;
          box-shadow: 0 8px 36px rgba(74,222,128,0.4);
          margin-bottom: 10px;
        }
        .kf-btn--full  { display: block; width: 100%; border-radius: 14px; padding: 15px; font-size: 15px; }
        .kf-btn--cta   { border-radius: 14px; padding: 16px 40px; font-size: 17px; box-shadow: 0 4px 32px rgba(74,222,128,0.35); }

        /* ────────────── NAV ────────────── */
        .kf-nav {
          position: fixed; top: 3px; left: 0; right: 0; z-index: 100;
          transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s;
        }
        .kf-nav--scrolled {
          background: rgba(6,12,24,0.9);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .kf-nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 20px; gap: 10px;
        }
        .kf-nav-links { display: none; align-items: center; gap: 4px; }
        .kf-nav-link {
          background: none; border: none; cursor: pointer;
          font-size: 13px; font-weight: 600; font-family: inherit;
          color: rgba(255,255,255,0.55); padding: 7px 11px; border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }
        .kf-nav-link:hover { color: #fff; background: rgba(255,255,255,0.05); }
        .kf-nav-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .kf-hamburger {
          display: flex; flex-direction: column; justify-content: center; gap: 5px;
          background: none; border: none; cursor: pointer;
          padding: 6px; width: 38px; height: 38px; border-radius: 8px;
        }
        .kf-hamburger span {
          display: block; height: 2px; border-radius: 2px; background: rgba(255,255,255,0.7);
          transition: transform 0.25s, opacity 0.2s;
        }
        .kf-hamburger--open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .kf-hamburger--open span:nth-child(2) { opacity: 0; }
        .kf-hamburger--open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* mobile drawer */
        .kf-drawer {
          background: rgba(4,10,20,0.98);
          border-top: 1px solid rgba(255,255,255,0.06);
          max-height: 0; overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
          display: flex; flex-direction: column; gap: 2px;
          padding: 0 16px;
        }
        .kf-drawer--open { max-height: 400px; padding: 14px 16px 22px; }
        .kf-drawer-link {
          background: none; border: none; cursor: pointer; font-family: inherit;
          font-size: 17px; font-weight: 600; color: rgba(255,255,255,0.7);
          padding: 13px 8px; text-align: left; border-radius: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: color 0.15s, background 0.15s;
        }
        .kf-drawer-link:hover { color: #fff; background: rgba(255,255,255,0.04); }

        /* ────────────── HERO ────────────── */
        .kf-hero {
          position: relative; min-height: 100svh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 100px 20px 70px; text-align: center; overflow: hidden;
        }
        .kf-hero-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 120% 60% at 50% 0%, rgba(22,163,74,0.09) 0%, transparent 65%),
            radial-gradient(ellipse 60% 40% at 20% 80%, rgba(74,222,128,0.04) 0%, transparent 60%);
        }
        .kf-hero-fade {
          position: absolute; bottom: 0; left: 0; right: 0; height: 35%; pointer-events: none;
          background: linear-gradient(transparent, rgba(6,12,24,0.8));
        }
        .kf-floodlight {
          position: absolute; top: 90px; width: 6px; height: 6px; border-radius: 50%;
          background: #fefce8; box-shadow: 0 0 18px 10px rgba(254,252,200,0.25);
        }
        .kf-floodlight--l { left: 14px; }
        .kf-floodlight--r { right: 14px; }

        .kf-hero-inner { position: relative; z-index: 2; max-width: 440px; width: 100%; }

        .kf-pill {
          display: inline-block; font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 20px;
          background: rgba(74,222,128,0.08); color: rgba(74,222,128,0.9);
          border: 1px solid rgba(74,222,128,0.18); margin-bottom: 24px;
        }

        .kf-hero-h1 {
          font-size: clamp(40px, 13vw, 68px); font-weight: 900;
          line-height: 1.05; letter-spacing: -0.035em;
          margin-bottom: 20px;
        }

        .kf-hero-sub {
          font-size: 15px; line-height: 1.7;
          color: rgba(255,255,255,0.5); margin-bottom: 32px;
        }
        .kf-br-hide { display: none; }

        /* quick truths row */
        .kf-truths {
          display: flex; align-items: center; justify-content: center;
          gap: 0; margin-top: 20px; font-size: 12px;
        }
        .kf-truth { display: flex; flex-direction: column; align-items: center; padding: 0 16px; }
        .kf-truth-n {
          font-size: 22px; font-weight: 900; color: #4ade80;
          line-height: 1; letter-spacing: -0.02em;
        }
        .kf-truth-unit { font-size: 12px; font-weight: 700; opacity: 0.7; }
        .kf-truth-l { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-top: 4px; }
        .kf-truth-sep { width: 1px; height: 32px; background: rgba(255,255,255,0.08); }

        /* scroll hint */
        .kf-scroll-hint {
          position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
          z-index: 2;
        }
        .kf-bounce-icon { animation: kfBounce 2.2s ease-in-out infinite; }

        /* ────────────── FOOTER ────────────── */
        .kf-footer {
          background: linear-gradient(180deg, rgba(0,0,0,0.2), rgba(3,7,15,0.98));
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .kf-footer-inner { max-width: 560px; margin: 0 auto; padding: 48px 20px 36px; }
        .kf-footer-brand { margin-bottom: 40px; }
        .kf-footer-tag { font-size: 13px; color: rgba(255,255,255,0.38); line-height: 1.7; margin-top: 14px; max-width: 260px; }
        .kf-live-pill {
          display: inline-flex; align-items: center; gap: 8px; margin-top: 14px;
          padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 600;
          color: #4ade80; background: rgba(74,222,128,0.07); border: 1px solid rgba(74,222,128,0.16);
        }
        .kf-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 6px #4ade80; flex-shrink: 0; }

        .kf-footer-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 28px 12px; margin-bottom: 32px; }
        .kf-col-head { font-size: 10px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 12px; }
        .kf-footer-link {
          display: block; background: none; border: none; cursor: pointer; font-family: inherit;
          font-size: 14px; color: rgba(255,255,255,0.48); padding: 5px 0; text-align: left;
          transition: color 0.2s;
        }
        .kf-footer-link:hover { color: #fff; }

        /* Legal/Privacy compact block */
        .kf-legal-block {
          margin-top: 40px; padding-top: 32px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column; gap: 24px;
        }
        .kf-legal-row { display: flex; flex-direction: column; gap: 6px; }
        .kf-legal-head { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.35); }
        .kf-legal-text { font-size: 12px; line-height: 1.75; color: rgba(255,255,255,0.3); }

        .kf-footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 16px 20px; max-width: 560px; margin: 0 auto;
          display: flex; flex-wrap: wrap; justify-content: center;
          gap: 8px; font-size: 11px; color: rgba(255,255,255,0.2);
        }
        .kf-sep { color: rgba(255,255,255,0.1); }

        /* ────────────── KEYFRAMES ────────────── */
        @keyframes kfBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(7px); }
        }

        /* ────────────── ≥640px ────────────── */
        @media (min-width: 640px) {
          .kf-nav-links   { display: flex; }
          .kf-hamburger   { display: none; }
          .kf-drawer      { display: none !important; }
          .kf-section     { padding: 64px 32px; }
          .kf-footer-inner { padding: 56px 32px 40px; }
          .kf-footer-cols { grid-template-columns: repeat(3, 1fr); }
          .kf-hero        { padding: 120px 32px 80px; }
          .kf-hero-inner  { max-width: 520px; }
          .kf-hero-h1     { font-size: clamp(48px, 9vw, 72px); }
          .kf-br-hide     { display: block; }
          .kf-cta         { padding: 56px 40px; }
        }
      `}</style>
    </div>
  );
}
