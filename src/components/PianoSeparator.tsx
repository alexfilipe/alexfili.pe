import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const WHITE_KEYS = [
  { note: "C4", freq: 261.63 },
  { note: "D4", freq: 293.66 },
  { note: "E4", freq: 329.63 },
  { note: "F4", freq: 349.23 },
  { note: "G4", freq: 392.0 },
  { note: "A4", freq: 440.0 },
  { note: "B4", freq: 493.88 },
  { note: "C5", freq: 523.25 },
  { note: "D5", freq: 587.33 },
  { note: "E5", freq: 659.25 },
  { note: "F5", freq: 698.46 },
  { note: "G5", freq: 783.99 },
  { note: "A5", freq: 880.0 },
  { note: "B5", freq: 987.77 }
];

let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (audioContext) {
    return audioContext;
  }

  const AudioContextConstructor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  audioContext = new AudioContextConstructor();
  return audioContext;
}

function playNote(freq: number) {
  try {
    const ctx = getAudioContext();
    if (!ctx) {
      return;
    }

    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.2, now + 0.007);
    masterGain.gain.exponentialRampToValueAtTime(0.1, now + 0.14);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

    const addOscillator = (type: OscillatorType, frequency: number, gainValue: number) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.value = gainValue;
      oscillator.connect(gain);
      gain.connect(masterGain);
      oscillator.start(now);
      oscillator.stop(now + 1.6);
    };

    addOscillator("triangle", freq, 0.55);
    addOscillator("sine", freq * 2, 0.22);
    addOscillator("sine", freq * 3, 0.08);
    addOscillator("sine", freq * 0.5, 0.18);
  } catch {
    // Browsers can decline audio creation before a gesture; the visual piano still works.
  }
}

type PianoKeyMesh = THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;

type PerspectivePianoProps = {
  hovered: string | null;
  flash: string | null;
  onEnter: (note: string, freq: number) => void;
  onLeave: (note: string) => void;
};

function PerspectivePiano({ hovered, flash, onEnter, onLeave }: PerspectivePianoProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(hovered);
  const flashRef = useRef(flash);
  const onEnterRef = useRef(onEnter);
  const onLeaveRef = useRef(onLeave);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    flashRef.current = flash;
  }, [flash]);

  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);

  useEffect(() => {
    onLeaveRef.current = onLeave;
  }, [onLeave]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 120);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.className = "piano-separator-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const keys: PianoKeyMesh[] = [];
    const edgeLines: THREE.LineSegments[] = [];
    let activeKey: PianoKeyMesh | null = null;
    let raf = 0;

    const ivory = new THREE.Color(0xf0ede6);
    const gold = new THREE.Color(0xc8a96e);
    const blackSurface = new THREE.Color(0x0d0c0a);

    const disposeObject = (obj: THREE.Object3D) => {
      obj.traverse((child) => {
        const disposable = child as THREE.Object3D & {
          geometry?: THREE.BufferGeometry;
          material?: THREE.Material | THREE.Material[];
        };

        disposable.geometry?.dispose();
        const material = disposable.material;
        if (Array.isArray(material)) {
          material.forEach((item) => item.dispose());
        } else {
          material?.dispose();
        }
      });
    };

    const noteForWhite = (index: number) => {
      const base = WHITE_KEYS[index % WHITE_KEYS.length];
      return {
        note: `${base.note}-${index}`,
        freq: base.freq * Math.pow(2, Math.floor(index / WHITE_KEYS.length))
      };
    };

    const blackPattern = [1, 2, 4, 5, 6];
    const blackBase = [
      { note: "Cs4", freq: 277.18 },
      { note: "Ds4", freq: 311.13 },
      { note: "Fs4", freq: 369.99 },
      { note: "Gs4", freq: 415.3 },
      { note: "As4", freq: 466.16 }
    ];

    const makeKey = (
      width: number,
      height: number,
      depth: number,
      x: number,
      y: number,
      z: number,
      note: string,
      freq: number,
      black = false
    ) => {
      const material = new THREE.MeshBasicMaterial({
        color: black ? ivory : blackSurface,
        transparent: true,
        opacity: black ? 0.46 : 0.18,
        depthWrite: true,
        depthTest: true
      });

      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material) as PianoKeyMesh;
      mesh.position.set(x, y, z);
      mesh.userData = { note, freq, black };
      scene.add(mesh);
      keys.push(mesh);

      const hiddenEdgeMaterial = new THREE.LineBasicMaterial({
        color: ivory,
        transparent: true,
        opacity: black ? 0.14 : 0.18,
        depthTest: false
      });
      const hiddenEdges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), hiddenEdgeMaterial);
      hiddenEdges.renderOrder = 1;
      hiddenEdges.position.copy(mesh.position);
      scene.add(hiddenEdges);
      edgeLines.push(hiddenEdges);

      const edgeMaterial = new THREE.LineBasicMaterial({
        color: ivory,
        transparent: true,
        opacity: black ? 0.42 : 0.68,
        depthTest: true
      });
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), edgeMaterial);
      edges.renderOrder = 2;
      edges.position.copy(mesh.position);
      scene.add(edges);
      edgeLines.push(edges);

      mesh.userData.edges = edges;
      mesh.userData.hiddenEdges = hiddenEdges;
      return mesh;
    };

    const rebuild = () => {
      keys.splice(0).forEach((key) => {
        scene.remove(key);
        disposeObject(key);
      });
      edgeLines.splice(0).forEach((edgeLine) => {
        scene.remove(edgeLine);
        disposeObject(edgeLine);
      });

      const width = Math.max(window.innerWidth, mount.clientWidth || 0);
      const height = Math.max(210, Math.min(340, width * 0.18));
      renderer.setSize(width, height, false);
      renderer.domElement.style.width = "100vw";
      renderer.domElement.style.height = `${height}px`;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const whiteWidth = 0.72;
      const whiteDepth = 2.55;
      const whiteZ = 0.34;
      const blackZ = whiteZ - whiteDepth * 0.24;
      const whiteCount = Math.max(30, Math.ceil(width / 30));
      const totalWidth = whiteCount * whiteWidth;
      const startX = -totalWidth / 2 + whiteWidth / 2;

      for (let index = 0; index < whiteCount; index += 1) {
        const note = noteForWhite(index);
        makeKey(
          whiteWidth * 0.96,
          0.58,
          whiteDepth,
          startX + index * whiteWidth,
          -0.25,
          whiteZ,
          note.note,
          note.freq
        );
      }

      for (let octave = 0; octave < Math.ceil(whiteCount / 7); octave += 1) {
        blackPattern.forEach((boundary, index) => {
          const absoluteBoundary = octave * 7 + boundary;
          if (absoluteBoundary >= whiteCount) {
            return;
          }

          const base = blackBase[index];
          const x = startX + absoluteBoundary * whiteWidth - whiteWidth / 2;
          makeKey(
            whiteWidth * 0.48,
            0.16,
            whiteDepth * 0.64,
            x,
            0.18,
            blackZ + whiteDepth * 0.04,
            `${base.note}-${octave}`,
            (base.freq / 2) * Math.pow(2, octave),
            true
          );
        });
      }

      camera.position.set(0, 5.0, 7.8);
      camera.lookAt(0, -0.05, 0.2);
    };

    const updateVisualState = () => {
      keys.forEach((key) => {
        const material = key.material;
        const edges = key.userData.edges as THREE.LineSegments<THREE.EdgesGeometry, THREE.LineBasicMaterial>;
        const hiddenEdges = key.userData.hiddenEdges as THREE.LineSegments<
          THREE.EdgesGeometry,
          THREE.LineBasicMaterial
        >;
        const edgeMaterial = edges.material;
        const hiddenEdgeMaterial = hiddenEdges.material;
        const isHovered = hoveredRef.current === key.userData.note;
        const isFlash = flashRef.current === key.userData.note;
        const isBlack = Boolean(key.userData.black);

        material.color.copy(isFlash ? gold : isBlack ? ivory : blackSurface);
        material.opacity = isFlash
          ? isBlack
            ? 0.72
            : 0.32
          : isHovered
            ? isBlack
              ? 0.62
              : 0.25
            : isBlack
              ? 0.46
              : 0.18;

        edgeMaterial.color.copy(isFlash ? gold : ivory);
        edgeMaterial.opacity = isFlash ? 0.85 : isHovered ? 0.72 : isBlack ? 0.42 : 0.68;
        hiddenEdgeMaterial.color.copy(isFlash ? gold : ivory);
        hiddenEdgeMaterial.opacity = isFlash ? 0.28 : isHovered ? 0.24 : isBlack ? 0.14 : 0.18;

        const restingY = isBlack ? 0.18 : -0.25;
        const pressedY = isBlack ? 0.06 : -0.46;
        const targetY = isHovered || isFlash ? pressedY : restingY;
        key.position.y += (targetY - key.position.y) * 0.22;
        edges.position.copy(key.position);
        hiddenEdges.position.copy(key.position);
      });
    };

    const setPointer = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const pick = (event: PointerEvent, play = false) => {
      setPointer(event);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(keys, false)[0]?.object as PianoKeyMesh | undefined;

      if (hit !== activeKey) {
        if (activeKey) {
          onLeaveRef.current(activeKey.userData.note);
        }
        activeKey = hit ?? null;
        if (activeKey) {
          onEnterRef.current(activeKey.userData.note, activeKey.userData.freq);
        }
      } else if (play && activeKey) {
        onEnterRef.current(activeKey.userData.note, activeKey.userData.freq);
      }
    };

    const clearActive = () => {
      if (activeKey) {
        onLeaveRef.current(activeKey.userData.note);
      }
      activeKey = null;
    };

    const animate = () => {
      updateVisualState();
      renderer.render(scene, camera);
      if (!reduceMotion) {
        raf = window.requestAnimationFrame(animate);
      }
    };

    const handlePointerMove = (event: PointerEvent) => pick(event);
    const handlePointerDown = (event: PointerEvent) => pick(event, true);

    rebuild();
    animate();

    window.addEventListener("resize", rebuild);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointerleave", clearActive);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", rebuild);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerleave", clearActive);
      clearActive();
      keys.forEach((key) => {
        scene.remove(key);
        disposeObject(key);
      });
      edgeLines.forEach((edgeLine) => {
        scene.remove(edgeLine);
        disposeObject(edgeLine);
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div ref={mountRef} className="piano-separator-stage" aria-hidden="true" />
  );
}

export default function PianoSeparator() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const onEnter = useCallback((note: string, freq: number) => {
    setHovered(note);
    playNote(freq);
    setFlash(note);
    clearTimeout(timers.current[note]);
    timers.current[note] = setTimeout(() => {
      setFlash((current) => (current === note ? null : current));
    }, 480);
  }, []);

  const onLeave = useCallback((note: string) => {
    setHovered((current) => (current === note ? null : current));
  }, []);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      Object.values(activeTimers).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="piano-separator" aria-label="Interactive 3D perspective piano keyboard">
      <PerspectivePiano hovered={hovered} flash={flash} onEnter={onEnter} onLeave={onLeave} />
      <div className="piano-separator-fallback" aria-hidden="true">
        {Array.from({ length: 30 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
    </div>
  );
}
