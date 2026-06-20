import { useEffect, useRef } from "react";
import type { SVGProps } from "react";
import { ArrowUpRight, BookOpen, Mail, Music } from "lucide-react";
import PianoSeparator from "@/components/PianoSeparator";
import { profile } from "@/data/profile";

const ACCENT = "#c8a96e";
const FG_BRIGHT = "rgba(240,237,230,0.9)";

type BrandIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function GitHubIcon({ size = 16, ...props }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 1.9c-5.6 0-10.1 4.5-10.1 10.1 0 4.5 2.9 8.2 6.9 9.6.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.9.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1.1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.8 1 .8-.2 1.6-.3 2.5-.3s1.7.1 2.5.3c1.9-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7.7.7 1.1 1.6 1.1 2.7 0 3.9-2.4 4.8-4.6 5 .4.3.7 1 .7 2v2.9c0 .3.2.6.7.5 4-1.3 6.9-5.1 6.9-9.6C22.1 6.4 17.6 1.9 12 1.9Z" />
    </svg>
  );
}

function LinkedInIcon({ size = 16, ...props }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M5.2 8.8h3.1v10H5.2v-10Zm1.6-5c1 0 1.8.8 1.8 1.7 0 1-.8 1.8-1.8 1.8S5 6.5 5 5.5c0-.9.8-1.7 1.8-1.7Zm3.5 5h3v1.4h.1c.4-.8 1.5-1.6 3-1.6 3.2 0 3.8 2.1 3.8 4.8v5.4h-3.1V14c0-1.2 0-2.7-1.6-2.7s-1.9 1.3-1.9 2.6v4.9h-3.1v-10Z" />
    </svg>
  );
}

const PHI = (1 + Math.sqrt(5)) / 2;
const INORM = 1 / Math.sqrt(1 + PHI * PHI);
const RAW_VERTS: [number, number, number][] = [
  [0, 1, PHI],
  [0, -1, PHI],
  [0, 1, -PHI],
  [0, -1, -PHI],
  [1, PHI, 0],
  [-1, PHI, 0],
  [1, -PHI, 0],
  [-1, -PHI, 0],
  [PHI, 0, 1],
  [-PHI, 0, 1],
  [PHI, 0, -1],
  [-PHI, 0, -1]
];
const VERTS = RAW_VERTS.map(([x, y, z]) => [x * INORM, y * INORM, z * INORM] as [number, number, number]);

const EDGES: [number, number][] = [
  [0, 1],
  [0, 4],
  [0, 5],
  [0, 8],
  [0, 9],
  [1, 6],
  [1, 7],
  [1, 8],
  [1, 9],
  [2, 3],
  [2, 4],
  [2, 5],
  [2, 10],
  [2, 11],
  [3, 6],
  [3, 7],
  [3, 10],
  [3, 11],
  [4, 5],
  [4, 8],
  [4, 10],
  [5, 9],
  [5, 11],
  [6, 7],
  [6, 8],
  [6, 10],
  [7, 9],
  [7, 11],
  [8, 10],
  [9, 11]
];

const FACES: [number, number, number][] = [
  [0, 1, 8],
  [0, 8, 4],
  [0, 4, 5],
  [0, 5, 9],
  [0, 9, 1],
  [3, 2, 10],
  [3, 10, 6],
  [3, 6, 7],
  [3, 7, 11],
  [3, 11, 2],
  [1, 6, 8],
  [6, 10, 8],
  [8, 10, 4],
  [4, 10, 2],
  [4, 2, 5],
  [5, 2, 11],
  [5, 11, 9],
  [9, 11, 7],
  [9, 7, 1],
  [1, 7, 6]
];

const NEURAL: [number, number][] = [
  [0, 3],
  [1, 2],
  [4, 7],
  [5, 6],
  [8, 11],
  [9, 10],
  [0, 10],
  [1, 11],
  [2, 6],
  [3, 9],
  [4, 9],
  [5, 8]
];

const VISUAL_VERTS = VERTS;
const DENSE_EDGES = EDGES;
const BEAM_COLORS = [
  [255, 78, 78],
  [255, 151, 54],
  [255, 213, 79],
  [91, 220, 119],
  [71, 200, 255],
  [117, 117, 255],
  [207, 98, 255]
] as const;

function rgbaColor([r, g, b]: readonly [number, number, number], alpha: number) {
  return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}

function normalizeVector([x, y, z]: [number, number, number]): [number, number, number] {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
}

function crossVector(
  [ax, ay, az]: [number, number, number],
  [bx, by, bz]: [number, number, number]
): [number, number, number] {
  return [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
}

function rotateY(v: [number, number, number], angle: number): [number, number, number] {
  const [x, y, z] = v;
  return [x * Math.cos(angle) + z * Math.sin(angle), y, -x * Math.sin(angle) + z * Math.cos(angle)];
}

function rotateX(v: [number, number, number], angle: number): [number, number, number] {
  const [x, y, z] = v;
  return [x, y * Math.cos(angle) - z * Math.sin(angle), y * Math.sin(angle) + z * Math.cos(angle)];
}

function GeometricArtifact() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInteractingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const cursorTargetRef = useRef({ x: 0, y: 0 });
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0 });
  const scrollVelocityRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const size = 200;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.scale(dpr, dpr);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const beamEdges = [...DENSE_EDGES, ...NEURAL];
    const vertexMotion = VISUAL_VERTS.map((vertex, index) => {
      const radialAxis = normalizeVector(vertex);
      const seedAxis: [number, number, number] = Math.abs(radialAxis[1]) > 0.82 ? [1, 0, 0] : [0, 1, 0];
      const tangentA = normalizeVector(crossVector(radialAxis, seedAxis));
      const tangentB = normalizeVector(crossVector(radialAxis, tangentA));
      const direction = index % 2 === 0 ? 1 : -1;

      return {
        phase: Math.random() * Math.PI * 2,
        secondaryPhase: Math.random() * Math.PI * 2,
        orbitPhase: Math.random() * Math.PI * 2,
        driftPhaseX: Math.random() * Math.PI * 2,
        driftPhaseY: Math.random() * Math.PI * 2,
        driftPhaseZ: Math.random() * Math.PI * 2,
        amp: 0.075 + Math.random() * 0.08,
        orbitAmp: 0.085 + Math.random() * 0.075,
        drift: 0.006 + Math.random() * 0.012,
        speed: 1.05 + Math.random() * 1.35,
        orbitSpeed: (1.05 + Math.random() * 1.1) * direction,
        breatheSpeed: 0.7 + Math.random() * 0.55,
        driftSpeed: 0.7 + Math.random() * 0.82,
        tangentA,
        tangentB
      };
    });
    const pulses: {
      edge: number;
      progress: number;
      speed: number;
      width: number;
      hitFired: boolean;
      colorIndex: number;
    }[] = [];
    const vertexBursts = VISUAL_VERTS.map(() => 0);
    const vertexBurstTargets = VISUAL_VERTS.map(() => 0);
    const vertexBurstColorIndexes = VISUAL_VERTS.map(() => 0);
    let nextPulse = 18;
    let nextPulseColorIndex = 0;
    let t = 0;
    let ryCurrent = 0;
    let rxCurrent = 0.22;
    let animId = 0;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      scrollVelocityRef.current += (nextScrollY - lastScrollY) * 0.0014;
      lastScrollY = nextScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      ryCurrent += scrollVelocityRef.current;
      ryCurrent += rotationVelocityRef.current.y;
      rxCurrent += rotationVelocityRef.current.x;
      scrollVelocityRef.current *= 0.84;
      rotationVelocityRef.current.x *= 0.91;
      rotationVelocityRef.current.y *= 0.91;
      rxCurrent = Math.max(-1.05, Math.min(1.16, rxCurrent));

      if (isInteractingRef.current && !isDraggingRef.current) {
        const targetRy = cursorTargetRef.current.x * 1.15;
        const targetRx = 0.22 - cursorTargetRef.current.y * 0.75;
        ryCurrent += (targetRy - ryCurrent) * 0.12;
        rxCurrent += (targetRx - rxCurrent) * 0.12;
      }

      const ry = ryCurrent + t * 0.2;
      const rx = rxCurrent + Math.sin(t * 0.11) * 0.18;
      const movingVerts = VISUAL_VERTS.map(([x, y, z], index) => {
        const motion = vertexMotion[index];
        const radial =
          1 +
          Math.sin(t * motion.speed + motion.phase) * motion.amp +
          Math.sin(t * motion.speed * 0.45 + motion.secondaryPhase) * 0.038;
        const orbitAngle = t * motion.orbitSpeed + motion.orbitPhase;
        const orbitRadius = motion.orbitAmp * (0.78 + Math.sin(t * motion.breatheSpeed + motion.phase) * 0.22);
        const orbitA = Math.cos(orbitAngle) * orbitRadius;
        const orbitB = Math.sin(orbitAngle) * orbitRadius;
        return [
          x * radial +
            motion.tangentA[0] * orbitA +
            motion.tangentB[0] * orbitB +
            Math.sin(t * motion.driftSpeed + motion.driftPhaseX) * motion.drift,
          y * radial +
            motion.tangentA[1] * orbitA +
            motion.tangentB[1] * orbitB +
            Math.sin(t * motion.driftSpeed + motion.driftPhaseY) * motion.drift,
          z * radial +
            motion.tangentA[2] * orbitA +
            motion.tangentB[2] * orbitB +
            Math.sin(t * motion.driftSpeed + motion.driftPhaseZ) * motion.drift
        ] as [number, number, number];
      });
      const proj = movingVerts.map((v) => {
        const r = rotateX(rotateY(v, ry), rx);
        const fov = 2.8;
        const z = r[2] + fov;
        return {
          x: (r[0] / z) * size * 0.68 + size / 2,
          y: (-r[1] / z) * size * 0.68 + size / 2,
          z: r[2]
        };
      });

      const sortedFaces = [...FACES].sort((a, b) => {
        const za = (proj[a[0]].z + proj[a[1]].z + proj[a[2]].z) / 3;
        const zb = (proj[b[0]].z + proj[b[1]].z + proj[b[2]].z) / 3;
        return za - zb;
      });

      ctx.setLineDash([]);
      sortedFaces.forEach(([a, b, c]) => {
        const avgZ = (proj[a].z + proj[b].z + proj[c].z) / 3;
        const opacity = Math.max(0.01, (avgZ + 1) * 0.03);
        ctx.fillStyle = `rgba(240,237,230,${opacity.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(proj[a].x, proj[a].y);
        ctx.lineTo(proj[b].x, proj[b].y);
        ctx.lineTo(proj[c].x, proj[c].y);
        ctx.closePath();
        ctx.fill();
      });

      ctx.setLineDash([1.5, 5]);
      NEURAL.forEach(([a, b]) => {
        const avg = (proj[a].z + proj[b].z) / 2;
        const opacity = Math.max(0, (avg + 1) * 0.09 + 0.03);
        ctx.strokeStyle = `rgba(200,169,110,${opacity.toFixed(3)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(proj[a].x, proj[a].y);
        ctx.lineTo(proj[b].x, proj[b].y);
        ctx.stroke();
      });

      ctx.setLineDash([]);
      DENSE_EDGES.forEach(([a, b]) => {
        const avg = (proj[a].z + proj[b].z) / 2;
        const baseOpacity = Math.max(0.06, (avg + 1) * 0.22 + 0.08);

        ctx.strokeStyle = `rgba(240,237,230,${baseOpacity.toFixed(3)})`;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(proj[a].x, proj[a].y);
        ctx.lineTo(proj[b].x, proj[b].y);
        ctx.stroke();
      });

      pulses.forEach((pulse) => {
        const [a, b] = beamEdges[pulse.edge];
        const beamColor = BEAM_COLORS[pulse.colorIndex % BEAM_COLORS.length];
        const start = Math.max(0, pulse.progress - pulse.width);
        const end = Math.min(1, pulse.progress);
        if (end <= 0 || start >= 1) {
          return;
        }

        const from = {
          x: proj[a].x + (proj[b].x - proj[a].x) * start,
          y: proj[a].y + (proj[b].y - proj[a].y) * start
        };
        const head = {
          x: proj[a].x + (proj[b].x - proj[a].x) * end,
          y: proj[a].y + (proj[b].y - proj[a].y) * end
        };
        const gradient = ctx.createLinearGradient(from.x, from.y, head.x, head.y);
        gradient.addColorStop(0, rgbaColor(beamColor, 0));
        gradient.addColorStop(0.45, rgbaColor(beamColor, 0.42));
        gradient.addColorStop(1, rgbaColor(beamColor, 0.94));

        ctx.setLineDash([]);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(head.x, head.y);
        ctx.stroke();

        ctx.fillStyle = rgbaColor(beamColor, 0.78);
        ctx.beginPath();
        ctx.arc(head.x, head.y, 1.45, 0, Math.PI * 2);
        ctx.fill();
      });

      VISUAL_VERTS.forEach((_, index) => {
        const point = proj[index];
        const targetBurst = vertexBurstTargets[index];
        const previousBurst = vertexBursts[index];
        const burstEase = targetBurst > previousBurst ? 0.16 : 0.075;
        const burst = previousBurst + (targetBurst - previousBurst) * burstEase;
        const baseOpacity = Math.max(0.1, (point.z + 1) * 0.28 + 0.1);
        const burstColor = BEAM_COLORS[vertexBurstColorIndexes[index] % BEAM_COLORS.length];

        if (burst > 0.008) {
          const haloRadius = 5.2 + burst * 14.5;
          const halo = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, haloRadius);
          halo.addColorStop(0, rgbaColor(burstColor, burst * 0.3));
          halo.addColorStop(0.28, rgbaColor(burstColor, burst * 0.2));
          halo.addColorStop(0.66, rgbaColor(burstColor, burst * 0.072));
          halo.addColorStop(1, rgbaColor(burstColor, 0));
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(point.x, point.y, haloRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        const pointOpacity = Math.min(0.96, baseOpacity + burst * 0.36);
        const pointRadius = 1.55 + burst * 2.8;
        ctx.fillStyle = `rgba(240,237,230,${pointOpacity.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);
        ctx.fill();

        vertexBursts[index] = burst > 0.006 ? burst : 0;
        vertexBurstTargets[index] = targetBurst > 0.006 ? targetBurst * 0.91 : 0;
      });

      for (let index = pulses.length - 1; index >= 0; index -= 1) {
        const pulse = pulses[index];
        pulse.progress += pulse.speed;
        if (!pulse.hitFired && pulse.progress >= 1) {
          const [, target] = beamEdges[pulse.edge];
          vertexBurstTargets[target] = Math.max(vertexBurstTargets[target], 1.08);
          vertexBurstColorIndexes[target] = pulse.colorIndex;
          pulse.hitFired = true;
        }

        if (pulse.progress > 1.1) {
          pulses.splice(index, 1);
        }
      }

      nextPulse -= 1;
      if (nextPulse <= 0) {
        const colorIndex = nextPulseColorIndex;
        nextPulseColorIndex = (nextPulseColorIndex + 1) % BEAM_COLORS.length;
        pulses.push({
          edge: Math.floor(Math.random() * beamEdges.length),
          progress: 0,
          speed: 0.018 + Math.random() * 0.018,
          width: 0.11 + Math.random() * 0.09,
          hitFired: false,
          colorIndex
        });
        nextPulse = 18 + Math.floor(Math.random() * 34);
      }

      t += 0.004;
      if (!reduceMotion) {
        animId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  const updateCursorTarget = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    cursorTargetRef.current = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2
    };
  };

  return (
    <canvas
      ref={canvasRef}
      className="figma-artifact-canvas"
      onPointerEnter={(event) => {
        isInteractingRef.current = true;
        updateCursorTarget(event);
      }}
      onPointerMove={(event) => {
        isInteractingRef.current = true;
        if (isDraggingRef.current) {
          const dx = event.clientX - lastPointerRef.current.x;
          const dy = event.clientY - lastPointerRef.current.y;
          rotationVelocityRef.current.y += dx * 0.006;
          rotationVelocityRef.current.x += dy * 0.006;
          lastPointerRef.current = { x: event.clientX, y: event.clientY };
        } else {
          updateCursorTarget(event);
        }
      }}
      onPointerLeave={() => {
        if (!isDraggingRef.current) {
          isInteractingRef.current = false;
        }
      }}
      onPointerDown={(event) => {
        isInteractingRef.current = true;
        isDraggingRef.current = true;
        lastPointerRef.current = { x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={(event) => {
        isDraggingRef.current = false;
        isInteractingRef.current = false;
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={(event) => {
        isDraggingRef.current = false;
        isInteractingRef.current = false;
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
    />
  );
}

const navLinks = [
  {
    label: "My Music",
    href: "/music/",
    Icon: Music,
    desc: "Recordings, compositions, and performances"
  },
  {
    label: "My Writings",
    href: "/writings/",
    Icon: BookOpen,
    desc: "Essays on technology, design, and thought"
  },
  {
    label: "Get in Touch",
    href: `mailto:${profile.email}`,
    Icon: Mail,
    desc: "Open to conversations and collaborations"
  }
];

const socialLinks = [
  { href: profile.github, Icon: GitHubIcon, label: "GitHub" },
  { href: profile.linkedin, Icon: LinkedInIcon, label: "LinkedIn" },
  { href: `mailto:${profile.email}`, Icon: Mail, label: "Email" }
];

export default function FigmaHome() {
  return (
    <div className="figma-home">
      <div className="figma-home-main">
        <section className="figma-hero" aria-labelledby="hero-title">
          <div className="figma-hero-copy">
            <h1 id="hero-title" className="figma-hero-title">
              Álex
              <br />
              Filipe
              <br />
              Santos
            </h1>

            <p className="figma-tagline" style={{ color: ACCENT }}>
              {profile.tagline}
            </p>

            <p className="figma-role">{profile.role}</p>
          </div>

          <div className="figma-artifact-wrap" aria-label="Interactive intelligence geometry">
            <div className="figma-artifact-scale">
              <div className="figma-artifact-inner-scale">
                <GeometricArtifact />
              </div>
            </div>
          </div>
        </section>

        <div className="figma-piano-wrap">
          <PianoSeparator />
        </div>

        <section className="figma-bio" aria-label="Biography">
          <p>
            My name is Álex. Brazilian by birth and San Franciscan by heart, I build intelligent systems where thoughtful
            design matters as much as technical execution.
          </p>
          <p>
            Classical music has shaped the way I listen. Through piano, violin, and conducting, I keep returning to the
            same question that draws me to systems built with care: what makes structure feel meaningful.
          </p>
        </section>

        <nav className="figma-link-nav" aria-label="Site navigation">
          {navLinks.map(({ label, href, Icon, desc }) => (
            <a key={label} href={href} className="figma-link-row">
              <div className="figma-link-copy">
                <Icon size={14} className="figma-link-icon" aria-hidden="true" />
                <div>
                  <div className="figma-link-label" style={{ color: FG_BRIGHT }}>
                    {label}
                  </div>
                  <div className="figma-link-desc">{desc}</div>
                </div>
              </div>
              <ArrowUpRight size={13} className="figma-link-arrow" aria-hidden="true" />
            </a>
          ))}
          <div className="figma-link-rule" />
        </nav>

        <div className="figma-socials">
          {socialLinks.map(({ href, Icon, label }) => (
            <a key={label} href={href} aria-label={label} className="figma-social-link">
              <Icon size={16} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
