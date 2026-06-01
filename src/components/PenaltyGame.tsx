import { useRef, useEffect, useState, useCallback } from "react";

type GameState = "menu" | "aim" | "shooting" | "result" | "gameover";
type ResultType = "goal" | "save" | "miss" | null;

interface Ball {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  spin: number;
}

interface Keeper {
  x: number;
  targetX: number;
  diveDir: number;
  divePower: number;
  diving: boolean;
  diveY: number;
  saved: boolean;
}

interface AimMarker {
  x: number;
  y: number;
  visible: boolean;
}

const W = 800;
const H = 500;

const GOAL_LEFT = W * 0.28;
const GOAL_RIGHT = W * 0.72;
const GOAL_TOP = H * 0.18;
const GOAL_BOTTOM = H * 0.44;
const GOAL_W = GOAL_RIGHT - GOAL_LEFT;
const GOAL_H = GOAL_BOTTOM - GOAL_TOP;

const BALL_START_X = W / 2;
const BALL_START_Y = H * 0.82;
const BALL_START_Z = 0;

// Perspective projection
function project(x3d: number, y3d: number, z3d: number) {
  const fov = 500;
  const cameraY = 1.2;
  const cameraZ = -3.5;
  const relZ = z3d - cameraZ;
  const scale = fov / (fov + relZ * 60);
  const px = W / 2 + (x3d - W / 2) * scale;
  const py = H * 0.85 - (y3d - cameraY) * 180 * scale - relZ * 15 * scale;
  return { px, py, scale };
}

interface PenaltyGameProps {
  onBack?: () => void;
}

export default function PenaltyGame({ onBack }: PenaltyGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef<GameState>("menu");
  const ballRef = useRef<Ball>({ x: BALL_START_X, y: 0, z: BALL_START_Z, vx: 0, vy: 0, vz: 0, spin: 0 });
  const keeperRef = useRef<Keeper>({ x: W / 2, targetX: W / 2, diveDir: 0, divePower: 0, diving: false, diveY: 0, saved: false });
  const aimRef = useRef<AimMarker>({ x: W / 2, y: (GOAL_TOP + GOAL_BOTTOM) / 2, visible: false });
  const resultRef = useRef<ResultType>(null);
  const resultTimerRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const scoreRef = useRef({ goals: 0, attempts: 0, total: 5 });
  const shootDataRef = useRef({ targetX: 0, targetY: 0 });
  const ballRotRef = useRef(0);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string }>>([]);
  const cameraShakeRef = useRef({ x: 0, y: 0, intensity: 0 });
  const menuAnimRef = useRef(0);

  const [uiState, setUiState] = useState<GameState>("menu");
  const [result, setResult] = useState<ResultType>(null);
  const [score, setScore] = useState({ goals: 0, attempts: 0 });
  const [showCursor, setShowCursor] = useState(true);

  const spawnGoalParticles = (cx: number, cy: number) => {
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      particlesRef.current.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: `hsl(${Math.random() * 60 + 30}, 100%, 60%)`
      });
    }
  };

  const resetBall = () => {
    ballRef.current = { x: BALL_START_X, y: 0, z: BALL_START_Z, vx: 0, vy: 0, vz: 0, spin: 0 };
    keeperRef.current = { x: W / 2, targetX: W / 2, diveDir: 0, divePower: 0, diving: false, diveY: 0, saved: false };
    frameRef.current = 0;
    particlesRef.current = [];
    ballRotRef.current = 0;
  };

  const shoot = useCallback((targetX: number, targetY: number) => {
    if (stateRef.current !== "aim") return;
    stateRef.current = "shooting";
    setUiState("shooting");

    const ball = ballRef.current;
    const keeper = keeperRef.current;

    // Map aim coords to 3D goal position
    const goalX3d = targetX;
    const goalY3d = ((GOAL_BOTTOM - targetY) / GOAL_H) * 2.1;
    const goalZ3d = 8;

    const frames = 35;
    ball.vx = (goalX3d - ball.x) / frames;
    ball.vy = goalY3d / frames + 0.04;
    ball.vz = goalZ3d / frames;
    ball.spin = (targetX - W / 2) * 0.003;

    shootDataRef.current = { targetX, targetY };

    // Keeper reaction with bias
    const norm = (targetX - GOAL_LEFT) / GOAL_W;
    const keeperBias = Math.random();
    let diveSide: number;

    if (keeperBias < 0.65) {
      // Keeper guesses correctly
      diveSide = norm < 0.4 ? -1 : norm > 0.6 ? 1 : 0;
    } else {
      // Keeper guesses wrong
      diveSide = norm < 0.5 ? 1 : -1;
    }

    keeper.diveDir = diveSide;
    keeper.divePower = 0.6 + Math.random() * 0.5;

    // High shots keeper stays more central
    const isHigh = targetY < GOAL_TOP + GOAL_H * 0.35;
    if (isHigh) keeper.divePower *= 0.5;

    setTimeout(() => {
      keeper.diving = true;
    }, 180);
  }, []);

  const drawStadium = (ctx: CanvasRenderingContext2D, frame: number) => {
    const shake = cameraShakeRef.current;

    ctx.save();
    ctx.translate(shake.x, shake.y);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.55);
    sky.addColorStop(0, "#0a1628");
    sky.addColorStop(0.5, "#0d2040");
    sky.addColorStop(1, "#102035");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H * 0.55);

    // Stars
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    const stars = [[120, 30], [200, 50], [350, 20], [500, 45], [650, 25], [720, 55], [80, 70], [450, 15], [580, 40]];
    for (const [sx, sy] of stars) {
      const twinkle = 0.4 + 0.3 * Math.sin(frame * 0.03 + sx * 0.1);
      ctx.globalAlpha = twinkle;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Stadium stands — left
    ctx.fillStyle = "#1a2535";
    ctx.beginPath();
    ctx.moveTo(0, H * 0.1);
    ctx.lineTo(W * 0.3, H * 0.1);
    ctx.lineTo(W * 0.28, H * 0.45);
    ctx.lineTo(0, H * 0.55);
    ctx.closePath();
    ctx.fill();

    // Stadium stands — right
    ctx.fillStyle = "#1a2535";
    ctx.beginPath();
    ctx.moveTo(W, H * 0.1);
    ctx.lineTo(W * 0.7, H * 0.1);
    ctx.lineTo(W * 0.72, H * 0.45);
    ctx.lineTo(W, H * 0.55);
    ctx.closePath();
    ctx.fill();

    // Stadium stands — top
    ctx.fillStyle = "#151e2e";
    ctx.fillRect(W * 0.28, H * 0.05, W * 0.44, H * 0.14);

    // Crowd dots (simplified)
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 40; col++) {
        const baseX = W * 0.295 + col * (W * 0.42 / 40);
        const baseY = H * 0.065 + row * 11;
        const colors = ["#e53e3e", "#3182ce", "#38a169", "#d69e2e", "#805ad5", "#e2e8f0"];
        ctx.fillStyle = colors[(row * 7 + col * 3) % colors.length];
        ctx.globalAlpha = 0.7 + 0.1 * Math.sin(frame * 0.05 + col * 0.3 + row * 0.7);
        ctx.beginPath();
        ctx.arc(baseX, baseY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // Side crowd
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 12; col++) {
        const colors = ["#e53e3e", "#3182ce", "#e2e8f0", "#d69e2e"];
        ctx.fillStyle = colors[(row + col) % colors.length];
        ctx.globalAlpha = 0.6;
        // left
        ctx.beginPath();
        ctx.arc(col * 21 + 15, H * 0.15 + row * 12, 4, 0, Math.PI * 2);
        ctx.fill();
        // right
        ctx.beginPath();
        ctx.arc(W - col * 21 - 15, H * 0.15 + row * 12, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // Floodlights
    const lightPos = [[W * 0.28, H * 0.07], [W * 0.72, H * 0.07], [W * 0.05, H * 0.12], [W * 0.95, H * 0.12]];
    for (const [lx, ly] of lightPos) {
      // Light glow
      const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, 40);
      glow.addColorStop(0, "rgba(255,240,180,0.5)");
      glow.addColorStop(1, "rgba(255,240,180,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(lx, ly, 40, 0, Math.PI * 2);
      ctx.fill();
      // Light cone
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx - 30, H * 0.45);
      ctx.lineTo(lx + 30, H * 0.45);
      ctx.closePath();
      const cone = ctx.createLinearGradient(lx, ly, lx, H * 0.45);
      cone.addColorStop(0, "rgba(255,250,200,0.08)");
      cone.addColorStop(1, "rgba(255,250,200,0)");
      ctx.fillStyle = cone;
      ctx.fill();
      ctx.restore();
      // Bulb
      ctx.fillStyle = "#fff9c4";
      ctx.beginPath();
      ctx.arc(lx, ly, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pitch
    const pitchGrad = ctx.createLinearGradient(0, H * 0.45, 0, H);
    pitchGrad.addColorStop(0, "#1a4a2e");
    pitchGrad.addColorStop(0.3, "#1e5534");
    pitchGrad.addColorStop(0.6, "#226038");
    pitchGrad.addColorStop(1, "#1a4a2e");
    ctx.fillStyle = pitchGrad;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.45);
    ctx.lineTo(W, H * 0.45);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    // Pitch stripes (perspective)
    for (let i = 0; i < 6; i++) {
      const t = i / 6;
      const y1 = H * 0.45 + t * H * 0.55;
      const y2 = H * 0.45 + (t + 1 / 6) * H * 0.55;
      if (i % 2 === 0) {
        ctx.fillStyle = "rgba(0,0,0,0.06)";
        ctx.fillRect(0, y1, W, y2 - y1);
      }
    }

    // Pitch markings
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1.5;

    // Center circle (perspective ellipse)
    ctx.beginPath();
    ctx.ellipse(W / 2, H * 0.78, 80, 20, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Penalty box (perspective trapezoid)
    ctx.beginPath();
    ctx.moveTo(W * 0.25, H * 0.62);
    ctx.lineTo(W * 0.75, H * 0.62);
    ctx.lineTo(W * 0.85, H);
    ctx.lineTo(W * 0.15, H);
    ctx.closePath();
    ctx.stroke();

    // Goal box inner
    ctx.beginPath();
    ctx.moveTo(W * 0.35, H * 0.55);
    ctx.lineTo(W * 0.65, H * 0.55);
    ctx.lineTo(W * 0.7, H * 0.62);
    ctx.lineTo(W * 0.3, H * 0.62);
    ctx.closePath();
    ctx.stroke();

    // Penalty spot
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.arc(W / 2, H * 0.73, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const drawGoal = (ctx: CanvasRenderingContext2D) => {
    const shake = cameraShakeRef.current;
    ctx.save();
    ctx.translate(shake.x, shake.y);

    const postW = 6;
    const shadowDepth = 18;

    // Net background (depth)
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(GOAL_LEFT - 2, GOAL_TOP - 2, GOAL_W + 4, GOAL_H + shadowDepth);

    // Net pattern
    ctx.strokeStyle = "rgba(200,220,255,0.18)";
    ctx.lineWidth = 0.8;
    // Vertical net lines
    for (let nx = 0; nx <= 14; nx++) {
      const nx2 = GOAL_LEFT + (nx / 14) * GOAL_W;
      ctx.beginPath();
      ctx.moveTo(nx2, GOAL_TOP);
      ctx.lineTo(nx2 + (nx2 - W / 2) * 0.06, GOAL_BOTTOM + shadowDepth);
      ctx.stroke();
    }
    // Horizontal net lines
    for (let ny = 0; ny <= 8; ny++) {
      const ny2 = GOAL_TOP + (ny / 8) * (GOAL_H + shadowDepth * 0.7);
      ctx.beginPath();
      ctx.moveTo(GOAL_LEFT, ny2);
      ctx.lineTo(GOAL_RIGHT, ny2);
      ctx.stroke();
    }

    // Left post
    const postGradL = ctx.createLinearGradient(GOAL_LEFT - postW, 0, GOAL_LEFT + postW, 0);
    postGradL.addColorStop(0, "#b0bec5");
    postGradL.addColorStop(0.4, "#ffffff");
    postGradL.addColorStop(1, "#78909c");
    ctx.fillStyle = postGradL;
    ctx.fillRect(GOAL_LEFT - postW, GOAL_TOP - 3, postW * 2, GOAL_H + 3);

    // Right post
    const postGradR = ctx.createLinearGradient(GOAL_RIGHT - postW, 0, GOAL_RIGHT + postW, 0);
    postGradR.addColorStop(0, "#78909c");
    postGradR.addColorStop(0.6, "#ffffff");
    postGradR.addColorStop(1, "#b0bec5");
    ctx.fillStyle = postGradR;
    ctx.fillRect(GOAL_RIGHT - postW, GOAL_TOP - 3, postW * 2, GOAL_H + 3);

    // Crossbar
    const crossGrad = ctx.createLinearGradient(0, GOAL_TOP - postW, 0, GOAL_TOP + postW);
    crossGrad.addColorStop(0, "#b0bec5");
    crossGrad.addColorStop(0.5, "#ffffff");
    crossGrad.addColorStop(1, "#607d8b");
    ctx.fillStyle = crossGrad;
    ctx.fillRect(GOAL_LEFT - postW, GOAL_TOP - postW, GOAL_W + postW * 2, postW * 2);

    // Post shadows
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(GOAL_LEFT + postW, GOAL_TOP, 4, GOAL_H);
    ctx.fillRect(GOAL_RIGHT - postW - 4, GOAL_TOP, 4, GOAL_H);

    ctx.restore();
  };

  const drawKeeper = (ctx: CanvasRenderingContext2D, frame: number) => {
    const keeper = keeperRef.current;
    const shake = cameraShakeRef.current;
    ctx.save();
    ctx.translate(shake.x, shake.y);

    // Animate keeper position
    if (keeper.diving) {
      const diveProgress = Math.min(frameRef.current * 0.07, 1);
      const eased = 1 - Math.pow(1 - diveProgress, 3);
      const diveX = keeper.diveDir * keeper.divePower * GOAL_W * 0.52 * eased;
      const diveY = Math.abs(diveX) * 0.25 * eased;
      keeper.x = W / 2 + diveX;
      keeper.diveY = diveY;
    } else {
      // Idle sway
      keeper.x = W / 2 + Math.sin(frame * 0.04) * 8;
    }

    const kx = keeper.x;
    const ky = GOAL_BOTTOM - 2 - keeper.diveY;
    const scale = 0.85;

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(kx, GOAL_BOTTOM + 4, 22 * scale, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(kx, ky);

    if (keeper.diving) {
      const diveAngle = keeper.diveDir * Math.min(frameRef.current * 0.05, 0.8);
      ctx.rotate(diveAngle);
    }

    // Body (jersey)
    ctx.fillStyle = "#1a6b3c";
    ctx.beginPath();
    ctx.roundRect(-14 * scale, -52 * scale, 28 * scale, 34 * scale, 4);
    ctx.fill();

    // Jersey stripes
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-6 * scale, -52 * scale);
    ctx.lineTo(-6 * scale, -18 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6 * scale, -52 * scale);
    ctx.lineTo(6 * scale, -18 * scale);
    ctx.stroke();

    // Shorts
    ctx.fillStyle = "#0d3d20";
    ctx.beginPath();
    ctx.roundRect(-14 * scale, -20 * scale, 28 * scale, 16 * scale, 2);
    ctx.fill();

    // Legs
    ctx.strokeStyle = "#d4a574";
    ctx.lineWidth = 9 * scale;
    ctx.lineCap = "round";
    // Left leg
    ctx.beginPath();
    ctx.moveTo(-8 * scale, -6 * scale);
    ctx.lineTo(-12 * scale, 12 * scale);
    ctx.stroke();
    // Right leg
    ctx.beginPath();
    ctx.moveTo(8 * scale, -6 * scale);
    ctx.lineTo(12 * scale, 12 * scale);
    ctx.stroke();

    // Boots
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 10 * scale;
    ctx.beginPath();
    ctx.moveTo(-12 * scale, 10 * scale);
    ctx.lineTo(-16 * scale, 16 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(12 * scale, 10 * scale);
    ctx.lineTo(16 * scale, 16 * scale);
    ctx.stroke();

    // Arms
    ctx.strokeStyle = "#d4a574";
    ctx.lineWidth = 8 * scale;
    ctx.lineCap = "round";

    if (keeper.diving) {
      // Arms reaching
      const reachDirL = keeper.diveDir > 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(-14 * scale, -42 * scale);
      ctx.lineTo((-14 - reachDirL * 20) * scale, (-42 - 15) * scale);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(14 * scale, -42 * scale);
      ctx.lineTo((14 + reachDirL * 30) * scale, (-42 - 10) * scale);
      ctx.stroke();

      // Gloves
      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.arc((-14 - reachDirL * 20) * scale, (-42 - 15) * scale, 7 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc((14 + reachDirL * 30) * scale, (-42 - 10) * scale, 7 * scale, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Idle arms
      ctx.beginPath();
      ctx.moveTo(-14 * scale, -42 * scale);
      ctx.lineTo(-22 * scale, -26 * scale);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(14 * scale, -42 * scale);
      ctx.lineTo(22 * scale, -26 * scale);
      ctx.stroke();

      // Gloves
      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.arc(-22 * scale, -26 * scale, 7 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(22 * scale, -26 * scale, 7 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // Head
    ctx.fillStyle = "#d4a574";
    ctx.beginPath();
    ctx.arc(0, -60 * scale, 14 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = "#2c1810";
    ctx.beginPath();
    ctx.arc(0, -68 * scale, 11 * scale, Math.PI, 0);
    ctx.fill();

    // Eyes
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(-5 * scale, -60 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.arc(5 * scale, -60 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(-5 * scale, -60 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.arc(5 * scale, -60 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  };

  const drawBall = (ctx: CanvasRenderingContext2D) => {
    const ball = ballRef.current;
    const state = stateRef.current;
    const shake = cameraShakeRef.current;
    ctx.save();
    ctx.translate(shake.x, shake.y);

    let bx: number, by: number, bscale: number;

    if (state === "aim" || state === "menu") {
      bx = BALL_START_X;
      by = H * 0.82;
      bscale = 1;
    } else {
      const proj = project(ball.x, ball.y, ball.z);
      bx = proj.px;
      by = proj.py;
      bscale = proj.scale;
    }

    const br = 14 * bscale;

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(bx, H * 0.86 + 2, br * 1.1, br * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ball base
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(ballRotRef.current);

    const ballGrad = ctx.createRadialGradient(-br * 0.3, -br * 0.35, br * 0.1, 0, 0, br);
    ballGrad.addColorStop(0, "#ffffff");
    ballGrad.addColorStop(0.4, "#e8e8e8");
    ballGrad.addColorStop(0.8, "#c8c8c8");
    ballGrad.addColorStop(1, "#888");
    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(0, 0, br, 0, Math.PI * 2);
    ctx.fill();

    // Pentagon patches
    ctx.fillStyle = "#1a1a1a";
    const patchAngles = [0, 72, 144, 216, 288].map(a => a * Math.PI / 180);
    for (const angle of patchAngles) {
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      const pr = br * 0.32;
      for (let i = 0; i < 5; i++) {
        const pa = (i * 72 - 90) * Math.PI / 180;
        if (i === 0) ctx.moveTo(Math.cos(pa) * pr, Math.sin(pa) * pr);
        else ctx.lineTo(Math.cos(pa) * pr, Math.sin(pa) * pr);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Top patch
    ctx.beginPath();
    const topPr = br * 0.32;
    for (let i = 0; i < 5; i++) {
      const pa = (i * 72 - 90) * Math.PI / 180;
      if (i === 0) ctx.moveTo(Math.cos(pa) * topPr, Math.sin(pa) * topPr - br * 0.35);
      else ctx.lineTo(Math.cos(pa) * topPr, Math.sin(pa) * topPr - br * 0.35);
    }
    ctx.closePath();
    ctx.fill();

    // Shine
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.ellipse(-br * 0.3, -br * 0.35, br * 0.22, br * 0.15, -0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  };

  const drawAimReticle = (ctx: CanvasRenderingContext2D, frame: number) => {
    const aim = aimRef.current;
    if (!aim.visible) return;

    const shake = cameraShakeRef.current;
    ctx.save();
    ctx.translate(shake.x, shake.y);

    const pulse = 0.8 + 0.2 * Math.sin(frame * 0.12);
    ctx.save();
    ctx.translate(aim.x, aim.y);

    // Outer ring
    ctx.strokeStyle = `rgba(255,220,50,${pulse * 0.9})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 20 * pulse, 0, Math.PI * 2);
    ctx.stroke();

    // Inner dot
    ctx.fillStyle = `rgba(255,220,50,${pulse})`;
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    // Crosshairs
    ctx.strokeStyle = `rgba(255,220,50,${pulse * 0.7})`;
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      const angle = (i * 90) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
      ctx.lineTo(Math.cos(angle) * 18 * pulse, Math.sin(angle) * 18 * pulse);
      ctx.stroke();
    }

    ctx.restore();
    ctx.restore();
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current;
    for (const p of particles) {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4 * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const drawResultOverlay = (ctx: CanvasRenderingContext2D, res: ResultType, frame: number) => {
    if (!res) return;
    const age = frame - resultTimerRef.current;
    const opacity = Math.min(age / 15, 1) * Math.max(1 - (age - 60) / 20, 0);
    if (opacity <= 0) return;

    ctx.save();
    ctx.globalAlpha = opacity;

    if (res === "goal") {
      ctx.textAlign = "center";
      ctx.font = `bold ${80 + Math.sin(age * 0.2) * 8}px Impact, Arial Black`;
      ctx.fillStyle = "#ffd700";
      ctx.shadowColor = "#ff8c00";
      ctx.shadowBlur = 20;
      ctx.fillText("GOOOAL!", W / 2, H / 2 - 20);
      ctx.font = "bold 32px Arial";
      ctx.fillStyle = "#fff";
      ctx.shadowBlur = 0;
      ctx.fillText("Perfect shot!", W / 2, H / 2 + 25);
    } else if (res === "save") {
      ctx.textAlign = "center";
      ctx.font = `bold 70px Impact, Arial Black`;
      ctx.fillStyle = "#ff4444";
      ctx.shadowColor = "#cc0000";
      ctx.shadowBlur = 20;
      ctx.fillText("SAVED!", W / 2, H / 2 - 20);
      ctx.font = "bold 28px Arial";
      ctx.fillStyle = "#fff";
      ctx.shadowBlur = 0;
      ctx.fillText("Goalkeeper saved it!", W / 2, H / 2 + 25);
    } else if (res === "miss") {
      ctx.textAlign = "center";
      ctx.font = `bold 70px Impact, Arial Black`;
      ctx.fillStyle = "#ff8800";
      ctx.shadowColor = "#cc5500";
      ctx.shadowBlur = 20;
      ctx.fillText("MISSED!", W / 2, H / 2 - 20);
      ctx.font = "bold 28px Arial";
      ctx.fillStyle = "#fff";
      ctx.shadowBlur = 0;
      ctx.fillText("Ball went wide!", W / 2, H / 2 + 25);
    }

    ctx.restore();
  };

  const drawHUD = (ctx: CanvasRenderingContext2D, state: GameState) => {
    const sc = scoreRef.current;

    // Score box
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.beginPath();
    ctx.roundRect(W / 2 - 80, 12, 160, 44, 8);
    ctx.fill();

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 22px Arial";
    ctx.fillText(`${sc.goals} / ${sc.attempts}`, W / 2, 30);

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "13px Arial";
    ctx.fillText(`Kick ${sc.attempts} / ${sc.total}`, W / 2, 50);

    // Attempt dots
    const dotSpacing = 24;
    const dotsStart = W / 2 - ((sc.total - 1) * dotSpacing) / 2;
    for (let i = 0; i < sc.total; i++) {
      const dx = dotsStart + i * dotSpacing;
      const dy = 68;
      ctx.beginPath();
      ctx.arc(dx, dy, 7, 0, Math.PI * 2);
      if (i < sc.attempts) {
        // Used attempt — check color based on would-need-goal tracking
        ctx.fillStyle = "#4ade80";
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.25)";
      }
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (state === "aim") {
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "bold 15px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Click inside the goal area to shoot!", W / 2, H - 15);
    }
  };

  const updatePhysics = () => {
    const ball = ballRef.current;
    const keeper = keeperRef.current;
    const state = stateRef.current;
    if (state !== "shooting") return;

    const { targetX, targetY } = shootDataRef.current;

    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.z += ball.vz;
    ball.vy -= 0.035; // gravity
    ball.vx += ball.spin * 0.5; // curve
    ball.vz *= 0.995;

    // Rotate ball
    ballRotRef.current += (Math.abs(ball.vx) + Math.abs(ball.vz)) * 0.12;

    frameRef.current++;

    // Update camera shake decay
    const cam = cameraShakeRef.current;
    if (cam.intensity > 0) {
      cam.x = (Math.random() - 0.5) * cam.intensity;
      cam.y = (Math.random() - 0.5) * cam.intensity;
      cam.intensity *= 0.85;
      if (cam.intensity < 0.1) { cam.intensity = 0; cam.x = 0; cam.y = 0; }
    }

    // Update particles
    const particles = particlesRef.current;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life -= 0.025;
    }
    particlesRef.current = particles.filter(p => p.life > 0);

    // Check if ball reached goal zone
    if (ball.z > 7 && frameRef.current > 10) {
      // Project ball to screen
      const proj = project(ball.x, ball.y, ball.z);

      // Check if ball is in goal
      const inGoalX = proj.px > GOAL_LEFT && proj.px < GOAL_RIGHT;
      const inGoalY = proj.py > GOAL_TOP && proj.py < GOAL_BOTTOM;

      // Check keeper collision
      const keeperX = keeper.x;
      const keeperY = GOAL_BOTTOM - 50 - keeper.diveY;
      const distToKeeper = Math.sqrt(
        Math.pow(proj.px - keeperX, 2) + Math.pow(proj.py - keeperY, 2)
      );

      if (distToKeeper < 38 && keeper.diving && ball.z > 6) {
        // Saved!
        keeper.saved = true;
        stateRef.current = "result";
        resultRef.current = "save";
        resultTimerRef.current = frameRef.current;
        scoreRef.current.attempts++;
        cameraShakeRef.current.intensity = 6;
        setResult("save");
        setScore({ ...scoreRef.current });
        scheduleNext();
        return;
      }

      if (inGoalX && inGoalY && ball.z > 7.5) {
        // GOAL!
        stateRef.current = "result";
        resultRef.current = "goal";
        resultTimerRef.current = frameRef.current;
        scoreRef.current.goals++;
        scoreRef.current.attempts++;
        cameraShakeRef.current.intensity = 12;
        spawnGoalParticles(proj.px, proj.py);
        setResult("goal");
        setScore({ ...scoreRef.current });
        scheduleNext();
        return;
      }

      if (!inGoalX && ball.z > 8) {
        // Miss
        stateRef.current = "result";
        resultRef.current = "miss";
        resultTimerRef.current = frameRef.current;
        scoreRef.current.attempts++;
        setResult("miss");
        setScore({ ...scoreRef.current });
        scheduleNext();
        return;
      }
    }

    // Ball went too far without goal check
    if (ball.z > 14) {
      stateRef.current = "result";
      resultRef.current = "miss";
      resultTimerRef.current = frameRef.current;
      scoreRef.current.attempts++;
      setResult("miss");
      setScore({ ...scoreRef.current });
      scheduleNext();
    }
  };

  const scheduleNext = () => {
    const sc = scoreRef.current;
    setTimeout(() => {
      if (sc.attempts >= sc.total) {
        stateRef.current = "gameover";
        setUiState("gameover");
      } else {
        resetBall();
        resultRef.current = null;
        stateRef.current = "aim";
        aimRef.current.visible = false;
        setResult(null);
        setUiState("aim");
      }
    }, 2200);
  };

  const drawMenuScreen = (ctx: CanvasRenderingContext2D, frame: number) => {
    menuAnimRef.current = frame;
    // Dark overlay
    ctx.fillStyle = "rgba(0,10,25,0.75)";
    ctx.fillRect(0, 0, W, H);

    // Title glow
    ctx.save();
    ctx.textAlign = "center";

    const glow = 0.7 + 0.3 * Math.sin(frame * 0.05);
    ctx.shadowColor = "#4ade80";
    ctx.shadowBlur = 30 * glow;
    ctx.fillStyle = "#4ade80";
    ctx.font = "bold 62px Impact, Arial Black";
    ctx.fillText("PENALTY KICK", W / 2, H / 2 - 70);

    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 26px Arial";
    ctx.fillText("Realistic Penalty Kick Game", W / 2, H / 2 - 20);

    // Animated start button
    const btnPulse = 0.95 + 0.05 * Math.sin(frame * 0.08);
    ctx.save();
    ctx.translate(W / 2, H / 2 + 55);
    ctx.scale(btnPulse, btnPulse);

    ctx.fillStyle = "#16a34a";
    ctx.beginPath();
    ctx.roundRect(-100, -28, 200, 56, 12);
    ctx.fill();

    ctx.strokeStyle = "#4ade80";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PLAY NOW", 0, 10);
    ctx.restore();

    // Instructions
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "15px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Click on the goal to shoot • 5 kicks", W / 2, H / 2 + 120);

    ctx.restore();
  };

  const drawGameOverScreen = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "rgba(0,10,25,0.85)";
    ctx.fillRect(0, 0, W, H);

    const sc = scoreRef.current;
    const pct = (sc.goals / sc.total) * 100;
    const rating = pct >= 80 ? "Outstanding!" : pct >= 60 ? "Great!" : pct >= 40 ? "Not Bad" : "Need Practice";
    const ratingColor = pct >= 80 ? "#ffd700" : pct >= 60 ? "#4ade80" : pct >= 40 ? "#fb923c" : "#f87171";

    ctx.textAlign = "center";

    ctx.fillStyle = "#fff";
    ctx.font = "bold 38px Impact, Arial Black";
    ctx.fillText("FINAL SCORE", W / 2, H / 2 - 100);

    // Score display
    ctx.fillStyle = "#4ade80";
    ctx.font = "bold 72px Impact";
    ctx.fillText(`${sc.goals} / ${sc.total}`, W / 2, H / 2 - 25);

    ctx.fillStyle = ratingColor;
    ctx.font = "bold 32px Arial";
    ctx.fillText(rating, W / 2, H / 2 + 25);

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "18px Arial";
    ctx.fillText(`${sc.goals} goals from ${sc.total} kicks`, W / 2, H / 2 + 65);

    // Restart button
    ctx.fillStyle = "#1d4ed8";
    ctx.beginPath();
    ctx.roundRect(W / 2 - 100, H / 2 + 100, 200, 50, 10);
    ctx.fill();
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px Arial";
    ctx.fillText("PLAY AGAIN", W / 2, H / 2 + 133);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let localFrame = 0;

    const loop = () => {
      localFrame++;
      ctx.clearRect(0, 0, W, H);

      const state = stateRef.current;
      drawStadium(ctx, localFrame);
      drawGoal(ctx);
      drawKeeper(ctx, localFrame);
      drawBall(ctx);

      if (state === "aim") {
        drawAimReticle(ctx, localFrame);
        drawHUD(ctx, state);
      } else if (state === "shooting") {
        updatePhysics();
        drawHUD(ctx, state);
        drawResultOverlay(ctx, resultRef.current, localFrame);
      } else if (state === "result") {
        updatePhysics();
        drawParticles(ctx);
        drawHUD(ctx, state);
        drawResultOverlay(ctx, resultRef.current, localFrame);
      } else if (state === "menu") {
        drawMenuScreen(ctx, localFrame);
      } else if (state === "gameover") {
        drawHUD(ctx, state);
        drawGameOverScreen(ctx);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;

    const state = stateRef.current;

    if (state === "menu") {
      // Check if click is on start button
      const btnX = W / 2, btnY = H / 2 + 55;
      if (cx > btnX - 100 && cx < btnX + 100 && cy > btnY - 28 && cy < btnY + 28) {
        stateRef.current = "aim";
        setUiState("aim");
      }
      return;
    }

    if (state === "gameover") {
      const btnX = W / 2, btnY = H / 2 + 125;
      if (cx > btnX - 100 && cx < btnX + 100 && cy > btnY - 25 && cy < btnY + 25) {
        scoreRef.current = { goals: 0, attempts: 0, total: 5 };
        resetBall();
        resultRef.current = null;
        stateRef.current = "aim";
        aimRef.current.visible = false;
        setResult(null);
        setUiState("aim");
        setScore({ goals: 0, attempts: 0 });
      }
      return;
    }

    if (state === "aim") {
      // Only allow shooting within or near goal area
      const margin = 30;
      if (
        cx > GOAL_LEFT - margin && cx < GOAL_RIGHT + margin &&
        cy > GOAL_TOP - margin && cy < GOAL_BOTTOM + margin
      ) {
        // Clamp to goal
        const tx = Math.max(GOAL_LEFT + 10, Math.min(GOAL_RIGHT - 10, cx));
        const ty = Math.max(GOAL_TOP + 5, Math.min(GOAL_BOTTOM - 5, cy));
        aimRef.current = { x: tx, y: ty, visible: true };
        shoot(tx, ty);
      }
    }
  }, [shoot]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (stateRef.current !== "aim") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;

    const inGoal =
      cx > GOAL_LEFT - 20 && cx < GOAL_RIGHT + 20 &&
      cy > GOAL_TOP - 20 && cy < GOAL_BOTTOM + 20;

    setShowCursor(!inGoal);

    if (inGoal) {
      aimRef.current = {
        x: Math.max(GOAL_LEFT + 5, Math.min(GOAL_RIGHT - 5, cx)),
        y: Math.max(GOAL_TOP + 5, Math.min(GOAL_BOTTOM - 5, cy)),
        visible: true
      };
    } else {
      aimRef.current.visible = false;
    }
  }, []);

  return (
    <div className="game-container">
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: "fixed",
            top: 14,
            left: 14,
            zIndex: 100,
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
            borderRadius: 10,
            padding: "6px 14px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>&#8592;</span> Home
        </button>
      )}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        style={{
          width: "min(100vw, 160vh)",
          height: "auto",
          cursor: showCursor ? "default" : "crosshair",
          borderRadius: "8px",
          boxShadow: "0 0 60px rgba(0,0,0,0.8)"
        }}
      />
    </div>
  );
}
