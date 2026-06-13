/*
 * COOKIE CHAIN — StreamCanvas
 * Live particle stream animation — bezier curve paths with glowing particles
 * Colors: ice-blue (0, 180, 255) + violet (123, 47, 190) + electric-blue (37, 99, 235)
 * NO opacity overlays. Full vibrancy, always.
 */

import { useEffect, useRef } from "react";

interface StreamCanvasProps {
  className?: string;
  style?: React.CSSProperties;
  maxStreams?: number;
  spawnRate?: number;
}

const CONFIG = {
  MAX_STREAMS: 14,
  SPAWN_RATE: 0.018,
  MIN_STREAM_LENGTH_PERCENT: 0.35,

  CURVE_PROBABILITY: 1,
  HORIZONTAL_BIAS: 0.75,
  CURVE_INTENSITY_MIN: 0.15,
  CURVE_INTENSITY_MAX: 0.55,

  PARTICLES_PER_STREAM_MIN: 4,
  PARTICLES_PER_STREAM_MAX: 10,
  PARTICLE_SIZE_MIN: 3,
  PARTICLE_SIZE_MAX: 7,
  PARTICLE_GLOW_MIN: 30,
  PARTICLE_GLOW_MAX: 60,
  PARTICLE_SPEED_MIN: 0.00025,
  PARTICLE_SPEED_MAX: 0.00075,
  PARTICLE_SPACING: 0.14,

  LINE_WIDTH_MIN: 1.5,
  LINE_WIDTH_MAX: 3.5,
  LINE_OPACITY_MIN: 0.55,
  LINE_OPACITY_MAX: 0.85,
  LINE_GLOW_MIN: 14,
  LINE_GLOW_MAX: 32,

  FADE_IN_TIME: 700,
  LIFETIME_MIN: 4500,
  LIFETIME_MAX: 9500,
  FADE_OUT_TIME: 1100,

  // Ice-blue, violet, electric-blue — full saturation, no muting
  COLORS: [
    "0, 180, 255",    // ice-blue
    "123, 47, 190",   // deep violet
    "96, 165, 250",   // sky-blue
    "167, 139, 250",  // lavender-violet
    "37, 99, 235",    // electric-blue
  ],
};

interface Particle {
  progress: number;
  size: number;
  glow: number;
}

interface Stream {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isCurved: boolean;
  color: string;
  lineWidth: number;
  lineOpacity: number;
  lineGlow: number;
  particles: Particle[];
  particleSpeed: number;
  createdAt: number;
  fadeInTime: number;
  lifetime: number;
  fadeOutTime: number;
  state: "fadingIn" | "active" | "fadingOut" | "dead";
  alpha: number;
  fadeOutStartTime?: number;
  cp1X?: number;
  cp1Y?: number;
  cp2X?: number;
  cp2Y?: number;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}
function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}

function createStream(width: number, height: number): Stream {
  const color = CONFIG.COLORS[Math.floor(Math.random() * CONFIG.COLORS.length)];
  const minLength = width * CONFIG.MIN_STREAM_LENGTH_PERCENT;

  let startX = 0, startY = 0, endX = 0, endY = 0;
  let attempts = 0;
  do {
    if (Math.random() < CONFIG.HORIZONTAL_BIAS) {
      if (Math.random() > 0.5) {
        startX = rand(-50, width * 0.1);
        endX = rand(width * 0.9, width + 50);
      } else {
        startX = rand(width * 0.9, width + 50);
        endX = rand(-50, width * 0.1);
      }
      startY = rand(height * 0.05, height * 0.95);
      endY = rand(height * 0.05, height * 0.95);
    } else {
      startX = rand(-50, width + 50);
      startY = rand(-50, height + 50);
      endX = rand(-50, width + 50);
      endY = rand(-50, height + 50);
    }
    const dx = endX - startX;
    const dy = endY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist >= minLength) break;
    attempts++;
  } while (attempts < 20);

  const particleCount = randInt(CONFIG.PARTICLES_PER_STREAM_MIN, CONFIG.PARTICLES_PER_STREAM_MAX);
  const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
    progress: i * CONFIG.PARTICLE_SPACING,
    size: rand(CONFIG.PARTICLE_SIZE_MIN, CONFIG.PARTICLE_SIZE_MAX),
    glow: rand(CONFIG.PARTICLE_GLOW_MIN, CONFIG.PARTICLE_GLOW_MAX),
  }));

  const stream: Stream = {
    startX, startY, endX, endY,
    isCurved: true,
    color,
    lineWidth: rand(CONFIG.LINE_WIDTH_MIN, CONFIG.LINE_WIDTH_MAX),
    lineOpacity: rand(CONFIG.LINE_OPACITY_MIN, CONFIG.LINE_OPACITY_MAX),
    lineGlow: rand(CONFIG.LINE_GLOW_MIN, CONFIG.LINE_GLOW_MAX),
    particles,
    particleSpeed: rand(CONFIG.PARTICLE_SPEED_MIN, CONFIG.PARTICLE_SPEED_MAX),
    createdAt: Date.now(),
    fadeInTime: CONFIG.FADE_IN_TIME,
    lifetime: rand(CONFIG.LIFETIME_MIN, CONFIG.LIFETIME_MAX),
    fadeOutTime: CONFIG.FADE_OUT_TIME,
    state: "fadingIn",
    alpha: 0,
  };

  // Bezier control points
  const curvature = rand(CONFIG.CURVE_INTENSITY_MIN, CONFIG.CURVE_INTENSITY_MAX);
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const dx = endX - startX;
  const dy = endY - startY;
  const perpX = -dy * curvature;
  const perpY = dx * curvature;
  stream.cp1X = midX + perpX * (Math.random() - 0.5) * 2;
  stream.cp1Y = midY + perpY * (Math.random() - 0.5) * 2;
  stream.cp2X = midX - perpX * (Math.random() - 0.5) * 2;
  stream.cp2Y = midY - perpY * (Math.random() - 0.5) * 2;

  return stream;
}

function getPointOnPath(stream: Stream, t: number) {
  const t1 = 1 - t;
  return {
    x: Math.pow(t1, 3) * stream.startX +
       3 * Math.pow(t1, 2) * t * (stream.cp1X ?? stream.startX) +
       3 * t1 * Math.pow(t, 2) * (stream.cp2X ?? stream.endX) +
       Math.pow(t, 3) * stream.endX,
    y: Math.pow(t1, 3) * stream.startY +
       3 * Math.pow(t1, 2) * t * (stream.cp1Y ?? stream.startY) +
       3 * t1 * Math.pow(t, 2) * (stream.cp2Y ?? stream.endY) +
       Math.pow(t, 3) * stream.endY,
  };
}

function updateStream(stream: Stream) {
  const now = Date.now();
  const age = now - stream.createdAt;

  if (stream.state === "fadingIn") {
    stream.alpha = Math.min(1, age / stream.fadeInTime);
    if (age >= stream.fadeInTime) stream.state = "active";
  } else if (stream.state === "active") {
    stream.alpha = 1;
    if (age >= stream.fadeInTime + stream.lifetime) {
      stream.state = "fadingOut";
      stream.fadeOutStartTime = now;
    }
  } else if (stream.state === "fadingOut") {
    const fadeProgress = (now - (stream.fadeOutStartTime ?? now)) / stream.fadeOutTime;
    stream.alpha = Math.max(0, 1 - fadeProgress);
    if (fadeProgress >= 1) stream.state = "dead";
  }

  for (const p of stream.particles) {
    p.progress += stream.particleSpeed;
    if (p.progress > 1 + CONFIG.PARTICLE_SPACING) {
      p.progress = -CONFIG.PARTICLE_SPACING;
    }
  }
}

function drawStream(ctx: CanvasRenderingContext2D, stream: Stream) {
  if (stream.alpha <= 0) return;
  ctx.globalAlpha = stream.alpha;

  ctx.beginPath();
  ctx.moveTo(stream.startX, stream.startY);
  ctx.bezierCurveTo(
    stream.cp1X!, stream.cp1Y!,
    stream.cp2X!, stream.cp2Y!,
    stream.endX, stream.endY
  );
  ctx.strokeStyle = `rgba(${stream.color}, ${stream.lineOpacity})`;
  ctx.lineWidth = stream.lineWidth;
  ctx.shadowBlur = stream.lineGlow;
  ctx.shadowColor = `rgba(${stream.color}, 1)`;
  ctx.stroke();
  // Second pass for extra glow intensity
  ctx.shadowBlur = stream.lineGlow * 1.8;
  ctx.shadowColor = `rgba(${stream.color}, 0.5)`;
  ctx.stroke();

  for (const particle of stream.particles) {
    if (particle.progress >= 0 && particle.progress <= 1) {
      const pos = getPointOnPath(stream, particle.progress);
      ctx.shadowBlur = particle.glow;
      ctx.shadowColor = `rgba(${stream.color}, 1)`;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${stream.color}, 1)`;
      ctx.fill();
    }
  }

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
}

export default function StreamCanvas({ className, style, maxStreams, spawnRate }: StreamCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const max = maxStreams ?? CONFIG.MAX_STREAMS;
    const rate = spawnRate ?? CONFIG.SPAWN_RATE;

    let width = 0;
    let height = 0;
    const streams: Stream[] = [];

    function resize() {
      width = canvas!.offsetWidth;
      height = canvas!.offsetHeight;
      canvas!.width = width;
      canvas!.height = height;
    }

    resize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    };
    window.addEventListener("resize", onResize);

    // Seed initial streams
    for (let i = 0; i < Math.min(4, max); i++) {
      streams.push(createStream(width, height));
    }

    function animate() {
      ctx!.clearRect(0, 0, width, height);

      for (let i = streams.length - 1; i >= 0; i--) {
        updateStream(streams[i]);
        if (streams[i].state === "dead") {
          streams.splice(i, 1);
        } else {
          drawStream(ctx!, streams[i]);
        }
      }

      if (streams.length < max && Math.random() < rate) {
        streams.push(createStream(width, height));
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [maxStreams, spawnRate]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        display: "block",
        ...style,
      }}
    />
  );
}
