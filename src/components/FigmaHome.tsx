import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode, SVGProps } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import PianoSeparator from "@/components/PianoSeparator";
import { musicDisciplines } from "@/data/music";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { essays } from "@/data/essays";

const ACCENT = "#c8a96e";

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
      <path d="M20.4 3.1H3.6c-.8 0-1.4.6-1.4 1.4v15c0 .8.6 1.4 1.4 1.4h16.8c.8 0 1.4-.6 1.4-1.4v-15c0-.8-.6-1.4-1.4-1.4ZM8.1 18H5.4V9.5h2.7V18ZM6.7 8.3c-.9 0-1.5-.6-1.5-1.4s.6-1.4 1.6-1.4c.9 0 1.5.6 1.5 1.4s-.6 1.4-1.6 1.4ZM18.7 18H16v-4.6c0-1.1-.4-1.9-1.4-1.9-.8 0-1.2.5-1.4 1-.1.2-.1.5-.1.7V18h-2.7V9.5h2.7v1.2c.4-.6 1-1.4 2.5-1.4 1.8 0 3.1 1.2 3.1 3.7V18Z" />
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
  [255, 42, 42],
  [255, 126, 24],
  [255, 226, 32],
  [48, 238, 88],
  [25, 203, 255],
  [91, 78, 255],
  [226, 54, 255]
] as const;
const TARGET_FRAME_MS = 1000 / 60;
const MAX_FRAME_SCALE = 3;

function rgbaColor([r, g, b]: readonly [number, number, number], alpha: number) {
  return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}

function smoothStep(edge0: number, edge1: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function easeAccelerate(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t;
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

function GeometricArtifact({ onReady }: { onReady?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasReportedReadyRef = useRef(false);
  const isInteractingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const cursorTargetRef = useRef({ x: 0, y: 0 });
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0 });
  const scrollVelocityRef = useRef(0);
  const supportsHoverRef = useRef(false);

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
    supportsHoverRef.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
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
      reverse: boolean;
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
    let t = 0;
    let ryCurrent = 0;
    let rxCurrent = 0.22;
    let animId = 0;
    let lastScrollY = window.scrollY;
    let lastFrameTime = 0;

    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      scrollVelocityRef.current += (nextScrollY - lastScrollY) * 0.0014;
      lastScrollY = nextScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const draw = (time = 0) => {
      const frameDelta = lastFrameTime
        ? Math.min(50, Math.max(0, time - lastFrameTime))
        : TARGET_FRAME_MS;
      const frameScale = Math.min(MAX_FRAME_SCALE, frameDelta / TARGET_FRAME_MS);
      lastFrameTime = time;

      ctx.clearRect(0, 0, size, size);

      ryCurrent += scrollVelocityRef.current * frameScale;
      ryCurrent += rotationVelocityRef.current.y * frameScale;
      rxCurrent += rotationVelocityRef.current.x * frameScale;
      scrollVelocityRef.current *= Math.pow(0.84, frameScale);
      rotationVelocityRef.current.x *= Math.pow(0.91, frameScale);
      rotationVelocityRef.current.y *= Math.pow(0.91, frameScale);
      rxCurrent = Math.max(-1.05, Math.min(1.16, rxCurrent));

      if (supportsHoverRef.current && isInteractingRef.current && !isDraggingRef.current) {
        const targetRy = cursorTargetRef.current.x * 0.86;
        const targetRx = 0.22 - cursorTargetRef.current.y * 0.56;
        const hoverEase = 1 - Math.pow(0.88, frameScale);
        ryCurrent += (targetRy - ryCurrent) * hoverEase;
        rxCurrent += (targetRx - rxCurrent) * hoverEase;
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
      sortedFaces.forEach(([a, b, c], faceIndex) => {
        const avgZ = (proj[a].z + proj[b].z + proj[c].z) / 3;
        const opacity = Math.max(0.042, (avgZ + 1) * 0.044 + 0.022);
        const centerX = (proj[a].x + proj[b].x + proj[c].x) / 3;
        const centerY = (proj[a].y + proj[b].y + proj[c].y) / 3;
        const faceGradient = ctx.createLinearGradient(centerX - size * 0.08, centerY - size * 0.08, centerX + size * 0.1, centerY + size * 0.12);
        faceGradient.addColorStop(0, `rgba(248,248,242,${(opacity * 0.5).toFixed(3)})`);
        faceGradient.addColorStop(0.38, `rgba(168,168,158,${(opacity * 0.2).toFixed(3)})`);
        faceGradient.addColorStop(1, `rgba(48,49,47,${(opacity * 0.36).toFixed(3)})`);

        ctx.beginPath();
        ctx.moveTo(proj[a].x, proj[a].y);
        ctx.lineTo(proj[b].x, proj[b].y);
        ctx.lineTo(proj[c].x, proj[c].y);
        ctx.closePath();
        ctx.fillStyle = faceGradient;
        ctx.fill();

        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.clip();
        const gloss = ctx.createLinearGradient(centerX - size * 0.12, centerY - size * 0.14, centerX + size * 0.05, centerY + size * 0.04);
        gloss.addColorStop(0, `rgba(255,255,250,${(opacity * 0.42).toFixed(3)})`);
        gloss.addColorStop(0.28, `rgba(250,250,240,${(opacity * 0.12).toFixed(3)})`);
        gloss.addColorStop(0.62, `rgba(220,220,210,${(opacity * 0.04).toFixed(3)})`);
        gloss.addColorStop(1, "rgba(220,220,210,0)");
        ctx.fillStyle = gloss;
        ctx.fillRect(centerX - size * 0.16, centerY - size * 0.16, size * 0.32, size * 0.32);

        ctx.strokeStyle = `rgba(255,255,248,${(opacity * 0.22).toFixed(3)})`;
        ctx.lineWidth = 0.24;
        ctx.beginPath();
        ctx.moveTo(proj[a].x, proj[a].y);
        ctx.lineTo(proj[b].x, proj[b].y);
        ctx.lineTo(proj[c].x, proj[c].y);
        ctx.closePath();
        ctx.stroke();

        if (avgZ > -0.25 && faceIndex % 3 === 0) {
          ctx.lineCap = "square";
          ctx.strokeStyle = `rgba(255,255,248,${(opacity * 0.72).toFixed(3)})`;
          ctx.lineWidth = 0.22;
          ctx.beginPath();
          ctx.moveTo(centerX - size * 0.09, centerY - size * 0.035);
          ctx.lineTo(centerX + size * 0.085, centerY - size * 0.085);
          ctx.stroke();

          ctx.strokeStyle = `rgba(255,255,248,${(opacity * 0.38).toFixed(3)})`;
          ctx.lineWidth = 0.18;
          ctx.beginPath();
          ctx.moveTo(centerX - size * 0.06, centerY + size * 0.055);
          ctx.lineTo(centerX + size * 0.095, centerY + size * 0.01);
          ctx.stroke();
        }
        ctx.restore();
      });

      ctx.setLineDash([1, 4.5]);
      NEURAL.forEach(([a, b]) => {
        const avg = (proj[a].z + proj[b].z) / 2;
        const opacity = Math.max(0.12, (avg + 1) * 0.13 + 0.07);
        ctx.strokeStyle = `rgba(228,218,194,${opacity.toFixed(3)})`;
        ctx.lineWidth = 0.42;
        ctx.lineCap = "butt";
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
        const [edgeA, edgeB] = beamEdges[pulse.edge];
        const a = pulse.reverse ? edgeB : edgeA;
        const b = pulse.reverse ? edgeA : edgeB;
        const beamColor = BEAM_COLORS[pulse.colorIndex % BEAM_COLORS.length];
        const charge = 0.14 + smoothStep(0.08, 0.48, pulse.progress) * 0.86;
        const visibleWidth = pulse.width * (0.18 + charge * 0.82);
        const start = Math.max(0, pulse.progress - visibleWidth);
        const end = Math.min(1, pulse.progress);
        if (end <= 0 || start >= 1) {
          return;
        }

        const easedStart = easeAccelerate(start);
        const easedEnd = easeAccelerate(end);
        const from = {
          x: proj[a].x + (proj[b].x - proj[a].x) * easedStart,
          y: proj[a].y + (proj[b].y - proj[a].y) * easedStart
        };
        const head = {
          x: proj[a].x + (proj[b].x - proj[a].x) * easedEnd,
          y: proj[a].y + (proj[b].y - proj[a].y) * easedEnd
        };
        const gradient = ctx.createLinearGradient(from.x, from.y, head.x, head.y);
        gradient.addColorStop(0, rgbaColor(beamColor, 0));
        gradient.addColorStop(0.38, rgbaColor(beamColor, 0.52 * charge));
        gradient.addColorStop(0.78, rgbaColor(beamColor, 0.76 * charge));
        gradient.addColorStop(1, rgbaColor(beamColor, 0.82 * charge));

        ctx.setLineDash([]);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.48 + charge * 0.82;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(head.x, head.y);
        ctx.stroke();

        ctx.fillStyle = rgbaColor(beamColor, 0.16 + charge * 0.38);
        ctx.beginPath();
        ctx.arc(head.x, head.y, 0.36 + charge * 0.58, 0, Math.PI * 2);
        ctx.fill();
      });

      VISUAL_VERTS.forEach((_, index) => {
        const point = proj[index];
        const targetBurst = vertexBurstTargets[index];
        const previousBurst = vertexBursts[index];
        const burstEase = targetBurst > previousBurst ? 0.16 : 0.075;
        const burstFrameEase = 1 - Math.pow(1 - burstEase, frameScale);
        const burst = previousBurst + (targetBurst - previousBurst) * burstFrameEase;
        const baseOpacity = Math.max(0.1, (point.z + 1) * 0.28 + 0.1);
        const burstColor = BEAM_COLORS[vertexBurstColorIndexes[index] % BEAM_COLORS.length];

        if (burst > 0.008) {
          const haloRadius = 4.2 + burst * 9.5;
          const halo = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, haloRadius);
          halo.addColorStop(0, rgbaColor(burstColor, burst * 0.4));
          halo.addColorStop(0.28, rgbaColor(burstColor, burst * 0.28));
          halo.addColorStop(0.66, rgbaColor(burstColor, burst * 0.1));
          halo.addColorStop(1, rgbaColor(burstColor, 0));
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(point.x, point.y, haloRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        const pointOpacity = Math.min(0.96, baseOpacity + burst * 0.3);
        const pointRadius = 1.55 + burst * 1.9;
        ctx.fillStyle = `rgba(240,237,230,${pointOpacity.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);
        ctx.fill();

        vertexBursts[index] = burst > 0.006 ? burst : 0;
        vertexBurstTargets[index] = targetBurst > 0.006 ? targetBurst * Math.pow(0.91, frameScale) : 0;
      });

      for (let index = pulses.length - 1; index >= 0; index -= 1) {
        const pulse = pulses[index];
        pulse.progress += pulse.speed * frameScale;
        if (!pulse.hitFired && pulse.progress >= 1) {
          const [edgeA, edgeB] = beamEdges[pulse.edge];
          const target = pulse.reverse ? edgeA : edgeB;
          vertexBurstTargets[target] = Math.max(vertexBurstTargets[target], 0.86);
          vertexBurstColorIndexes[target] = pulse.colorIndex;
          pulse.hitFired = true;
        }

        if (pulse.progress > 1.1) {
          pulses.splice(index, 1);
        }
      }

      nextPulse -= frameScale;
      if (nextPulse <= 0) {
        if (pulses.length < 6) {
          pulses.push({
            edge: Math.floor(Math.random() * beamEdges.length),
            reverse: Math.random() < 0.5,
            progress: 0,
            speed: 0.018 + Math.random() * 0.018,
            width: 0.11 + Math.random() * 0.09,
            hitFired: false,
            colorIndex: Math.floor(Math.random() * BEAM_COLORS.length)
          });
        }

        nextPulse = 24 + Math.floor(Math.random() * 68);
      }

      t += 0.004 * frameScale;
      if (!reduceMotion) {
        animId = requestAnimationFrame(draw);
      }
    };

    draw();
    if (!hasReportedReadyRef.current) {
      hasReportedReadyRef.current = true;
      onReady?.();
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, [onReady]);

  const updateCursorTarget = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    cursorTargetRef.current = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2
    };
  };

  return (
    <div
      className="figma-artifact-hit-area"
      onPointerEnter={(event) => {
        isInteractingRef.current = true;
        updateCursorTarget(event);
        lastPointerRef.current = { x: event.clientX, y: event.clientY };
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
          lastPointerRef.current = { x: event.clientX, y: event.clientY };
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
        updateCursorTarget(event);
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
    >
      <canvas ref={canvasRef} className="figma-artifact-canvas" />
    </div>
  );
}

const socialLinks = [
  { href: profile.github, Icon: GitHubIcon, label: "GitHub" },
  { href: profile.linkedin, Icon: LinkedInIcon, label: "LinkedIn" },
  { href: `mailto:${profile.email}`, Icon: Mail, label: "Email" }
];

const SCROLL_EDGE_EPSILON = 2;

type CarouselScrollState = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
};

function IntroContactRow() {
  const links = [
    { href: profile.github, label: "GitHub" },
    { href: profile.linkedin, label: "LinkedIn" },
    { href: `mailto:${profile.email}`, label: "Email" }
  ];

  return (
    <nav className="figma-intro-contact" aria-label="Contact links">
      {links.map(({ href, label }) => (
        <a key={label} href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          <span>{label}</span>
          <span aria-hidden="true">↗</span>
        </a>
      ))}
    </nav>
  );
}

function CarouselControls({ children, label, controlLabel }: { children: ReactNode; label: string; controlLabel: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<CarouselScrollState>({
    canScrollLeft: false,
    canScrollRight: false
  });

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const maxScrollLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const nextState = {
      canScrollLeft: scroller.scrollLeft > SCROLL_EDGE_EPSILON,
      canScrollRight: scroller.scrollLeft < maxScrollLeft - SCROLL_EDGE_EPSILON
    };

    setScrollState((currentState) =>
      currentState.canScrollLeft === nextState.canScrollLeft && currentState.canScrollRight === nextState.canScrollRight
        ? currentState
        : nextState
    );
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    updateScrollState();
    const handleScroll = () => updateScrollState();
    scroller.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);

    let resizeObserver: ResizeObserver | undefined;
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(updateScrollState);
      resizeObserver.observe(scroller);
      Array.from(scroller.children).forEach((child) => resizeObserver?.observe(child));
    }

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollState);
      resizeObserver?.disconnect();
    };
  }, [updateScrollState]);

  const scrollByDirection = useCallback(
    (direction: -1 | 1) => {
      const scroller = scrollerRef.current;
      if (!scroller) {
        return;
      }

      const firstCard = scroller.querySelector<HTMLElement>(".figma-carousel-card");
      const columnGap = Number.parseFloat(window.getComputedStyle(scroller).columnGap || "0") || 0;
      const scrollAmount = firstCard ? firstCard.offsetWidth + columnGap : scroller.clientWidth * 0.82;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      scroller.scrollBy({
        left: direction * scrollAmount,
        behavior: reduceMotion ? "auto" : "smooth"
      });

      window.setTimeout(updateScrollState, reduceMotion ? 0 : 260);
    },
    [updateScrollState]
  );

  return (
    <div
      className="figma-carousel-shell"
      data-can-scroll-left={scrollState.canScrollLeft ? "true" : "false"}
      data-can-scroll-right={scrollState.canScrollRight ? "true" : "false"}
    >
      <div ref={scrollerRef} className="figma-carousel" role="list" aria-label={label}>
        {children}
      </div>
      <button
        type="button"
        className="figma-carousel-control figma-carousel-control--left"
        aria-label={`Scroll ${controlLabel} left`}
        disabled={!scrollState.canScrollLeft}
        onClick={() => scrollByDirection(-1)}
      >
        <ArrowLeft size={15} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="figma-carousel-control figma-carousel-control--right"
        aria-label={`Scroll ${controlLabel} right`}
        disabled={!scrollState.canScrollRight}
        onClick={() => scrollByDirection(1)}
      >
        <ArrowRight size={15} aria-hidden="true" />
      </button>
    </div>
  );
}

function SectionHeader({ id, title }: { id: string; title: string }) {
  return (
    <header className="figma-section-header">
      <h2 id={id} className="figma-section-title">
        {title}
      </h2>
    </header>
  );
}

function ArtworkFrame({ children }: { children: ReactNode }) {
  return (
    <span className="figma-carousel-media" aria-hidden="true">
      <span className="figma-carousel-art">{children}</span>
    </span>
  );
}

function ProjectArtwork() {
  return (
    <ArtworkFrame>
      <svg viewBox="0 0 44 44" focusable="false">
        <rect x="11" y="11" width="22" height="22" rx="1" transform="rotate(45 22 22)" />
        <circle cx="22" cy="22" r="7.5" />
      </svg>
    </ArtworkFrame>
  );
}

function MusicArtwork({ title }: { title: string }) {
  if (title === "Conducting") {
    return (
      <ArtworkFrame>
        <svg viewBox="0 0 64 64" focusable="false">
          <path d="M14 43c10-9 21-16 35-22" />
          <path d="M18 26c8 6 18 9 30 9" />
          <path d="M18 49c9-3 20-3 32 1" />
          <circle cx="18" cy="43" r="2.5" />
        </svg>
      </ArtworkFrame>
    );
  }

  if (title === "Piano") {
    return (
      <ArtworkFrame>
        <svg viewBox="0 0 44 44" focusable="false">
          <path d="M8 12h28v20H8z" />
          <path d="M14 12v20M20 12v20M26 12v20M32 12v20" />
          <path d="M11 12v11M17 12v11M29 12v11" />
        </svg>
      </ArtworkFrame>
    );
  }

  return (
    <ArtworkFrame>
      <svg viewBox="0 0 64 64" focusable="false">
        <path d="M34 12c6 5 8 12 5 20-3 9-12 13-19 10" />
        <path d="M27 17c-5 7-7 15-4 23 2 6 7 10 14 12" />
        <path d="M42 10 19 54" />
        <path d="M17 17c7-3 14-3 21 0" />
        <circle cx="39" cy="12" r="2.5" />
      </svg>
    </ArtworkFrame>
  );
}

function WritingArtwork() {
  return (
    <ArtworkFrame>
      <svg viewBox="0 0 44 44" focusable="false">
        <path d="M11 13h22" />
        <path d="M11 21h17" />
        <path d="M11 29h22" />
        <path d="M31 10v24" />
      </svg>
    </ArtworkFrame>
  );
}

function FeaturedWorkSection() {
  return (
    <section id="projects" className="figma-section figma-featured-work" aria-labelledby="featured-work-title">
      <SectionHeader id="featured-work-title" title="Things I’ve Built" />

      <CarouselControls label="Featured projects" controlLabel="projects">
        {projects.map((project) => {
          const external = project.href?.startsWith("http");
          return (
          <a
            key={project.title}
            href={project.href ?? "#"}
            className="figma-carousel-card"
            role="listitem"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <ProjectArtwork />
            <span className="figma-carousel-copy">
              <span className="figma-carousel-meta">
                {project.period.start}&mdash;{project.period.end}
              </span>
              <span className="figma-carousel-title">{project.title}</span>
              <span className="figma-carousel-description">{project.description}</span>
            </span>
            <ArrowUpRight size={16} className="figma-carousel-arrow" aria-hidden="true" />
          </a>
          );
        })}
      </CarouselControls>
    </section>
  );
}

function MusicSection() {
  return (
    <section id="music" className="figma-section figma-music" aria-labelledby="music-title">
      <SectionHeader id="music-title" title="Music" />

      <CarouselControls label="Music" controlLabel="music">
        {musicDisciplines.map((discipline) => (
          <a key={discipline.title} href={discipline.href} className="figma-carousel-card" role="listitem">
            <MusicArtwork title={discipline.title} />
            <span className="figma-carousel-copy">
              <span className="figma-carousel-title">{discipline.title}</span>
              <span className="figma-carousel-description">{discipline.description}</span>
            </span>
            <ArrowUpRight size={16} className="figma-carousel-arrow" aria-hidden="true" />
          </a>
        ))}
      </CarouselControls>
    </section>
  );
}

function EssaysSection() {
  return (
    <section id="essays" className="figma-section figma-essays" aria-labelledby="essays-title">
      <SectionHeader id="essays-title" title="Essays" />

      <CarouselControls label="Essays" controlLabel="essays">
        {essays.map((writing) => (
          <a key={writing.title} href={writing.href} className="figma-carousel-card" role="listitem">
            <WritingArtwork />
            <span className="figma-carousel-copy">
              <span className="figma-carousel-meta">{writing.legend}</span>
              <span className="figma-carousel-title">{writing.title}</span>
              <span className="figma-carousel-description">{writing.summary}</span>
            </span>
            <ArrowUpRight size={16} className="figma-carousel-arrow" aria-hidden="true" />
          </a>
        ))}
      </CarouselControls>
    </section>
  );
}

export default function FigmaHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [showNav, setShowNav] = useState(false);

  const handleArtifactReady = useCallback(() => {
    window.setTimeout(() => setIsLoading(false), 520);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= 260) {
        setShowNav(false);
      } else if (y > lastY + 2) {
        setShowNav(true);
      } else if (y < lastY - 2) {
        setShowNav(false);
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
      return;
    }

    const timeout = window.setTimeout(() => setShowLoader(false), 620);
    return () => window.clearTimeout(timeout);
  }, [isLoading]);

  return (
    <div className={`figma-home${isLoading ? " is-loading" : ""}`}>
      {showLoader && (
        <div className={`figma-loader${!isLoading ? " is-exiting" : ""}`} role="status" aria-live="polite" aria-label="Loading site">
          <div className="figma-loader-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p>Building</p>
        </div>
      )}
      <header className={`figma-navbar${showNav ? " is-visible" : ""}`}>
        <nav className="figma-navbar-inner" aria-label="Primary">
          <a className="figma-navbar-brand" href="#top" aria-label={`${profile.name} — home`}>
            <img src="/logo-mark.svg" alt="" className="figma-navbar-logo" width={28} height={28} aria-hidden="true" />
            <span className="figma-navbar-name">{profile.name}</span>
          </a>
          <div className="figma-navbar-links">
            <a href="#projects">Projects</a>
            <a href="#music">Music</a>
            <a href="#essays">Essays</a>
          </div>
        </nav>
      </header>
      <div className="figma-home-main" id="top">
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

            <p className="figma-role">
              <strong>Software & AI Engineer</strong> guided by mathematical thought{" "}
              <span className="figma-role-keep">and classical musicianship.</span>
            </p>
          </div>

          <div className="figma-artifact-wrap" aria-label="Interactive intelligence geometry">
            <div className="figma-artifact-scale">
              <div className="figma-artifact-inner-scale">
                <GeometricArtifact onReady={handleArtifactReady} />
              </div>
            </div>
          </div>
        </section>

        <div className="figma-piano-wrap">
          <PianoSeparator />
        </div>

        <section className="figma-bio" aria-label="Biography">
          <p>
            <strong>My name is Álex</strong>. Brazilian by birth and San Franciscan by heart, I build intelligent systems where thoughtful
            design matters as much as technical execution.
          </p>
          <p>
            Classical music has shaped the way I listen. Through piano, violin, and conducting, I keep returning to the
            same question that draws me to systems built with care: <strong>what makes structure feel meaningful</strong>.
          </p>
        </section>

        <IntroContactRow />

        <FeaturedWorkSection />
        <MusicSection />
        <EssaysSection />

        <nav className="figma-socials" aria-label="Social links">
          {socialLinks.map(({ href, Icon, label }) => (
            <a key={label} href={href} className="figma-social-link" {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              <Icon size={16} className="figma-social-icon" aria-hidden="true" />
              <span>{label}</span>
              <ArrowUpRight size={14} className="figma-social-arrow" aria-hidden="true" />
            </a>
          ))}
        </nav>

        <footer className="figma-home-footnote">
          This site is an AI-first experiment in front-end interaction, design systems, and agentic workflows.
        </footer>

        <p className="figma-home-copyright">© {new Date().getFullYear()} Álex Filipe Santos</p>
      </div>
    </div>
  );
}
