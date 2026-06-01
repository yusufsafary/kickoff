interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: { ball: 28, text: 18, sub: 10 },
  md: { ball: 40, text: 26, sub: 13 },
  lg: { ball: 56, text: 36, sub: 16 },
  xl: { ball: 80, text: 52, sub: 22 },
};

export default function Logo({ size = "md", className = "" }: LogoProps) {
  const s = sizes[size];
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Football SVG */}
      <svg width={s.ball} height={s.ball} viewBox="0 0 80 80" fill="none">
        <defs>
          <radialGradient id="ballGrad" cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#e8e8e8" />
            <stop offset="100%" stopColor="#999" />
          </radialGradient>
          <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Glow */}
        <circle cx="40" cy="42" r="36" fill="url(#glowGrad)" />
        {/* Shadow */}
        <ellipse cx="40" cy="72" rx="22" ry="5" fill="rgba(0,0,0,0.35)" />
        {/* Ball */}
        <circle cx="40" cy="38" r="28" fill="url(#ballGrad)" />
        {/* Pentagon patches */}
        <g fill="#111" opacity="0.85">
          <polygon points="40,14 46,20 44,28 36,28 34,20" />
          <polygon points="57,26 62,33 58,40 50,38 48,30" />
          <polygon points="52,52 47,58 39,56 37,48 44,44" />
          <polygon points="24,52 28,44 36,44 38,52 32,58" />
          <polygon points="20,26 30,26 32,34 26,40 18,36" />
        </g>
        {/* Shine */}
        <ellipse cx="33" cy="28" rx="7" ry="5" fill="rgba(255,255,255,0.55)" transform="rotate(-20,33,28)" />
        {/* Green stripe accent */}
        <circle cx="40" cy="38" r="28" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeOpacity="0.3" />
      </svg>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <div
          className="font-black tracking-tight"
          style={{
            fontSize: s.text,
            background: "linear-gradient(135deg, #ffffff 0%, #d4d4d4 50%, #ffffff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            letterSpacing: "-0.02em",
          }}
        >
          KICKOFF
        </div>
        <div
          className="font-bold tracking-widest"
          style={{
            fontSize: s.sub,
            color: "#4ade80",
            letterSpacing: "0.18em",
          }}
        >
          2026
        </div>
      </div>
    </div>
  );
}
