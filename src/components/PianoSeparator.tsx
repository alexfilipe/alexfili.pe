import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const NATURAL_OFFSETS = [0, 2, 4, 5, 7, 9, 11];
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const BLACK_KEY_AFTER = new Set([0, 2, 5, 7, 9]);
const SOUNDING_OCTAVE_SHIFT = 12;
const RAINBOW_HEX = [0xff2a2a, 0xff7e18, 0xffe220, 0x30ee58, 0x19cbff, 0x5b4eff, 0xe236ff];

function blendHex(left: number, right: number, amount = 0.5) {
  const leftColor = new THREE.Color(left);
  const rightColor = new THREE.Color(right);
  return leftColor.lerp(rightColor, amount).getHex();
}

function midiToFrequency(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function midiToNoteName(midi: number) {
  const name = NOTE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
}

function whiteMidiFromCenterDelta(delta: number) {
  const octaveShift = Math.floor(delta / 7);
  const noteIndex = ((delta % 7) + 7) % 7;
  return 60 + octaveShift * 12 + NATURAL_OFFSETS[noteIndex];
}

function hasBlackKeyAfter(midi: number) {
  return BLACK_KEY_AFTER.has(((midi % 12) + 12) % 12);
}

function createKeyTexture(bright: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 384;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  if (bright) {
    gradient.addColorStop(0, "rgba(255,255,255,0.72)");
    gradient.addColorStop(0.38, "rgba(190,184,170,0.32)");
    gradient.addColorStop(0.62, "rgba(255,251,236,0.54)");
    gradient.addColorStop(1, "rgba(105,99,86,0.34)");
  } else {
    gradient.addColorStop(0, "rgba(255,247,221,0.12)");
    gradient.addColorStop(0.42, "rgba(255,255,255,0.025)");
    gradient.addColorStop(0.68, "rgba(199,169,110,0.08)");
    gradient.addColorStop(1, "rgba(0,0,0,0.34)");
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < 40; index += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const length = 18 + Math.random() * 85;
    ctx.strokeStyle = bright ? "rgba(255,255,255,0.12)" : "rgba(200,169,110,0.08)";
    ctx.lineWidth = 0.35 + Math.random() * 0.9;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length * 0.22, y + length);
    ctx.stroke();
  }

  for (let index = 0; index < 26; index += 1) {
    ctx.fillStyle = bright ? "rgba(255,255,255,0.08)" : "rgba(240,237,230,0.035)";
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 8 + Math.random() * 38);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createSparkleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }

  const center = canvas.width / 2;
  const glow = ctx.createRadialGradient(center, center, 0, center, center, center);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(0.18, "rgba(255,255,255,0.82)");
  glow.addColorStop(0.46, "rgba(255,255,255,0.18)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255,255,255,0.92)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(center, 10);
  ctx.lineTo(center, 86);
  ctx.moveTo(10, center);
  ctx.lineTo(86, center);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

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
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(Math.min(5600, Math.max(900, freq * 9)), now);
    filter.frequency.exponentialRampToValueAtTime(Math.min(2600, Math.max(480, freq * 5)), now + 1.2);
    filter.Q.value = 0.7;
    masterGain.connect(filter);
    filter.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.18, now + 0.006);
    masterGain.gain.exponentialRampToValueAtTime(0.09, now + 0.16);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

    const addOscillator = (type: OscillatorType, frequency: number, gainValue: number) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now);
      gain.gain.value = gainValue;
      oscillator.connect(gain);
      gain.connect(masterGain);
      oscillator.start(now);
      oscillator.stop(now + 1.9);
    };

    addOscillator("triangle", freq, 0.55);
    addOscillator("sine", freq * 2, 0.18);
    addOscillator("sine", freq * 3, 0.07);
    addOscillator("sine", freq * 0.5, 0.1);
  } catch {
    // Browsers can decline audio creation before a gesture; the visual piano still works.
  }
}

type PianoKeyMesh = THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
type SparkleSprite = THREE.Sprite;

type PerspectivePianoProps = {
  hovered: string | null;
  flash: string | null;
  onEnter: (note: string, freq: number, playHover: boolean) => void;
  onPlay: (note: string, freq: number) => void;
  onLeave: (note: string) => void;
};

function PerspectivePiano({ hovered, flash, onEnter, onPlay, onLeave }: PerspectivePianoProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(hovered);
  const flashRef = useRef(flash);
  const onEnterRef = useRef(onEnter);
  const onPlayRef = useRef(onPlay);
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
    onPlayRef.current = onPlay;
  }, [onPlay]);

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
    const whiteKeys: PianoKeyMesh[] = [];
    const edgeLines: THREE.LineSegments[] = [];
    const glints: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>[] = [];
    let activeKey: PianoKeyMesh | null = null;
    let pressedKey: PianoKeyMesh | null = null;
    let raf = 0;
    let lastScrollY = window.scrollY;
    let scrollDistance = 0;
    let scrollDirection = 1;
    let scrollCursor = 0;
    let lastScrollGlowAt = 0;
    let lastFrameTime = 0;

    const ivory = new THREE.Color(0xf0ede6);
    const gold = new THREE.Color(0xc8a96e);
    const warmSurface = new THREE.Color(0x1a1711);
    const darkTexture = createKeyTexture(false);
    const brightTexture = createKeyTexture(true);
    const sparkleTexture = createSparkleTexture();

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

    const makeKey = (
      width: number,
      height: number,
      depth: number,
      x: number,
      y: number,
      z: number,
      note: string,
      freq: number,
      black = false,
      activeColor = RAINBOW_HEX[0]
    ) => {
      const material = new THREE.MeshBasicMaterial({
        color: black ? ivory : warmSurface,
        map: black ? brightTexture : darkTexture,
        transparent: true,
        opacity: black ? 0.62 : 0.23,
        depthWrite: true,
        depthTest: true
      });

      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material) as PianoKeyMesh;
      mesh.position.set(x, y, z);
      mesh.userData = {
        note,
        freq,
        black,
        phase: Math.random() * Math.PI * 2,
        baseOpacity: black ? 0.62 : 0.23,
        scrollGlow: 0,
        depth,
        restingY: y,
        restingZ: z,
        activeColor
      };
      scene.add(mesh);
      keys.push(mesh);
      if (!black) {
        whiteKeys.push(mesh);
      }

      const hiddenEdgeMaterial = new THREE.LineBasicMaterial({
        color: gold,
        transparent: true,
        opacity: black ? 0.22 : 0.28,
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
        opacity: black ? 0.62 : 0.82,
        depthTest: true
      });
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), edgeMaterial);
      edges.renderOrder = 2;
      edges.position.copy(mesh.position);
      scene.add(edges);
      edgeLines.push(edges);

      mesh.userData.edges = edges;
      mesh.userData.hiddenEdges = hiddenEdges;

      const glintMaterial = new THREE.MeshBasicMaterial({
        color: gold,
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const glint = new THREE.Mesh(
        new THREE.BoxGeometry(width * 1.01, 0.012, depth * 1.01),
        glintMaterial
      );
      glint.renderOrder = 3;
      glint.position.set(x, y + height * 0.52, z);
      scene.add(glint);
      glints.push(glint);
      mesh.userData.glint = glint;

      const sparkles: SparkleSprite[] = [];
      const sparkleCount = black ? 4 : 6;
      for (let index = 0; index < sparkleCount; index += 1) {
        const sparkleMaterial = new THREE.SpriteMaterial({
          map: sparkleTexture,
          color: mesh.userData.activeColor as number,
          transparent: true,
          opacity: 0,
          depthTest: false,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });
        const sparkle = new THREE.Sprite(sparkleMaterial);
        const sideOffset = (Math.random() - 0.5) * width * 0.62;
        const lengthOffset = (Math.random() - 0.5) * depth * 0.48;
        const size = (black ? 0.055 : 0.075) + Math.random() * (black ? 0.045 : 0.065);
        sparkle.position.set(sideOffset, height * 0.9 + 0.16 + Math.random() * 0.14, lengthOffset);
        sparkle.scale.setScalar(size);
        sparkle.renderOrder = 5;
        sparkle.userData = {
          baseX: sideOffset,
          baseY: sparkle.position.y,
          baseZ: lengthOffset,
          phase: Math.random() * Math.PI * 2,
          size
        };
        mesh.add(sparkle);
        sparkles.push(sparkle);
      }
      mesh.userData.sparkles = sparkles;
      return mesh;
    };

    const rebuild = () => {
      keys.splice(0).forEach((key) => {
        scene.remove(key);
        disposeObject(key);
      });
      whiteKeys.splice(0);
      edgeLines.splice(0).forEach((edgeLine) => {
        scene.remove(edgeLine);
        disposeObject(edgeLine);
      });
      glints.splice(0).forEach((glint) => {
        scene.remove(glint);
        disposeObject(glint);
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
      const centerWhiteIndex = Math.floor(whiteCount / 2);
      const totalWidth = whiteCount * whiteWidth;
      const startX = -totalWidth / 2 + whiteWidth / 2;

      for (let index = 0; index < whiteCount; index += 1) {
        const midi = whiteMidiFromCenterDelta(index - centerWhiteIndex);
        const soundingMidi = midi + SOUNDING_OCTAVE_SHIFT;
        makeKey(
          whiteWidth * 0.96,
          0.58,
          whiteDepth,
          startX + index * whiteWidth,
          -0.25,
          whiteZ,
          midiToNoteName(soundingMidi),
          midiToFrequency(soundingMidi),
          false,
          RAINBOW_HEX[index % RAINBOW_HEX.length]
        );
      }

      for (let index = 0; index < whiteCount - 1; index += 1) {
        const midi = whiteMidiFromCenterDelta(index - centerWhiteIndex);
        if (hasBlackKeyAfter(midi)) {
          const blackMidi = midi + 1 + SOUNDING_OCTAVE_SHIFT;
          const x = startX + index * whiteWidth + whiteWidth / 2;
          const leftColor = RAINBOW_HEX[index % RAINBOW_HEX.length];
          const rightColor = RAINBOW_HEX[(index + 1) % RAINBOW_HEX.length];
          makeKey(
            whiteWidth * 0.48,
            0.16,
            whiteDepth * 0.64,
            x,
            0.18,
            blackZ + whiteDepth * 0.04,
            midiToNoteName(blackMidi),
            midiToFrequency(blackMidi),
            true,
            blendHex(leftColor, rightColor)
          );
        }
      }

      camera.position.set(0, 5.0, 7.8);
      camera.lookAt(0, -0.05, 0.2);
    };

    const handleScroll = () => {
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      const distance = Math.abs(delta);
      if (distance < 1) {
        return;
      }

      scrollDirection = delta > 0 ? 1 : -1;
      scrollDistance = Math.min(420, scrollDistance + distance);
    };

    const triggerScrollGlow = (time: number) => {
      const triggerDistance = 135;
      const triggerGap = 0.34;
      const pool = whiteKeys.length ? whiteKeys : keys;

      if (!pool.length || scrollDistance < triggerDistance || time - lastScrollGlowAt < triggerGap) {
        return;
      }

      scrollDistance = Math.max(0, scrollDistance - triggerDistance);
      lastScrollGlowAt = time;
      scrollCursor = (scrollCursor + scrollDirection * 3 + pool.length) % pool.length;

      const key = pool[scrollCursor];
      key.userData.scrollGlow = Math.max(Number(key.userData.scrollGlow) || 0, 1);
    };

    const updateVisualState = (time: number) => {
      const frameDelta = lastFrameTime ? Math.min(0.05, time - lastFrameTime) : 0.016;
      lastFrameTime = time;
      const glowDecay = Math.pow(0.988, frameDelta * 60);

      triggerScrollGlow(time);

      keys.forEach((key) => {
        const material = key.material;
        const edges = key.userData.edges as THREE.LineSegments<THREE.EdgesGeometry, THREE.LineBasicMaterial>;
        const hiddenEdges = key.userData.hiddenEdges as THREE.LineSegments<
          THREE.EdgesGeometry,
          THREE.LineBasicMaterial
        >;
        const glint = key.userData.glint as THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
        const sparkles = key.userData.sparkles as SparkleSprite[];
        const edgeMaterial = edges.material;
        const hiddenEdgeMaterial = hiddenEdges.material;
        const glintMaterial = glint.material;
        const isHovered = activeKey === key || hoveredRef.current === key.userData.note;
        const isFlash = flashRef.current === key.userData.note;
        const isPressed = pressedKey === key;
        const isBlack = Boolean(key.userData.black);
        const activeColor = new THREE.Color(Number(key.userData.activeColor) || RAINBOW_HEX[0]);
        const isActive = isHovered || isFlash;
        const scrollGlow = Number(key.userData.scrollGlow) || 0;
        const glintStrength = Math.pow(scrollGlow, 1.35);
        const sparklePulse = Number(key.userData.sparklePulse) || 0;
        key.userData.scrollGlow = scrollGlow > 0.01 ? scrollGlow * glowDecay : 0;
        key.userData.sparklePulse = sparklePulse > 0.015 ? Math.max(0, sparklePulse - frameDelta) : 0;

        material.color.copy(isActive ? activeColor : isBlack ? ivory : warmSurface);
        if (!isFlash && glintStrength > 0.35) {
          material.color.lerp(gold, Math.min(0.2, (glintStrength - 0.35) * 0.18));
        }
        material.opacity = isActive
          ? isBlack
            ? 0.82
            : 0.58
          : Number(key.userData.baseOpacity) + glintStrength * (isBlack ? 0.08 : 0.045);

        edgeMaterial.color.copy(isActive ? activeColor : ivory);
        edgeMaterial.opacity = isActive ? 0.95 : isBlack ? 0.64 : 0.82;
        hiddenEdgeMaterial.color.copy(isActive ? activeColor : ivory);
        hiddenEdgeMaterial.opacity = isActive ? 0.46 : isBlack ? 0.2 : 0.26 + glintStrength * 0.18;
        glintMaterial.color.copy(isActive ? activeColor : gold);
        glintMaterial.opacity = isActive ? (isBlack ? 0.36 : 0.42) : glintStrength * (isBlack ? 0.22 : 0.18);

        const currentSparklePulse = Number(key.userData.sparklePulse) || 0;
        sparkles.forEach((sparkle, sparkleIndex) => {
          const sparkleMaterial = sparkle.material;
          const sparklePhase = Number(sparkle.userData.phase);
          const drift = Math.sin(time * 6.2 + sparklePhase) * 0.025;
          sparkleMaterial.color.copy(activeColor);
          sparkleMaterial.opacity = currentSparklePulse * (0.34 + (sparkleIndex % 3) * 0.11);
          sparkle.position.x = Number(sparkle.userData.baseX) + drift;
          sparkle.position.y = Number(sparkle.userData.baseY) + currentSparklePulse * 0.24;
          sparkle.position.z = Number(sparkle.userData.baseZ) + Math.cos(time * 5.1 + sparklePhase) * 0.018;
          sparkle.scale.setScalar(Number(sparkle.userData.size) * (0.75 + currentSparklePulse * 1.65));
        });

        const restingY = Number(key.userData.restingY);
        const restingZ = Number(key.userData.restingZ);
        const keyDepth = Number(key.userData.depth);
        const wholeKeyDrop = isPressed
          ? isBlack
            ? -0.064
            : -0.112
          : isHovered || isFlash
            ? isBlack
              ? -0.032
              : -0.058
            : 0;
        const targetRotationX = isPressed
          ? isBlack
            ? 0.13
            : 0.185
          : isHovered || isFlash
            ? isBlack
              ? 0.095
              : 0.135
            : 0;
        const targetY = restingY + wholeKeyDrop - Math.sin(targetRotationX) * keyDepth * 0.5;
        const targetZ = restingZ - (1 - Math.cos(targetRotationX)) * keyDepth * 0.5;
        key.position.y += (targetY - key.position.y) * 0.22;
        key.position.z += (targetZ - key.position.z) * 0.22;
        key.rotation.x += (targetRotationX - key.rotation.x) * 0.22;
        edges.position.copy(key.position);
        edges.rotation.copy(key.rotation);
        hiddenEdges.position.copy(key.position);
        hiddenEdges.rotation.copy(key.rotation);
        glint.position.x = key.position.x;
        glint.position.y = key.position.y + (isBlack ? 0.085 : 0.305);
        glint.position.z = key.position.z;
        glint.rotation.copy(key.rotation);
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
          onEnterRef.current(activeKey.userData.note, activeKey.userData.freq, !play);
          activeKey.userData.sparklePulse = 1;
        }
      }

      if (play) {
        pressedKey = activeKey;
        if (pressedKey) {
          onPlayRef.current(pressedKey.userData.note, pressedKey.userData.freq);
          pressedKey.userData.sparklePulse = 1;
        }
      }
    };

    const clearActive = () => {
      if (activeKey) {
        onLeaveRef.current(activeKey.userData.note);
      }
      activeKey = null;
      pressedKey = null;
    };

    const clearPressed = () => {
      pressedKey = null;
    };

    const animate = (time = 0) => {
      updateVisualState(time * 0.001);
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointerup", clearPressed);
    renderer.domElement.addEventListener("pointercancel", clearPressed);
    renderer.domElement.addEventListener("pointerleave", clearActive);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", rebuild);
      window.removeEventListener("scroll", handleScroll);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerup", clearPressed);
      renderer.domElement.removeEventListener("pointercancel", clearPressed);
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
      glints.forEach((glint) => {
        scene.remove(glint);
        disposeObject(glint);
      });
      darkTexture?.dispose();
      brightTexture?.dispose();
      sparkleTexture?.dispose();
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
  const audioActivated = useRef(false);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const triggerFlash = useCallback((note: string) => {
    setFlash(note);
    clearTimeout(timers.current[note]);
    timers.current[note] = setTimeout(() => {
      setFlash((current) => (current === note ? null : current));
    }, 480);
  }, []);

  const onEnter = useCallback((note: string, freq: number, playHover: boolean) => {
    setHovered(note);
    if (audioActivated.current && playHover) {
      playNote(freq);
      triggerFlash(note);
    }
  }, [triggerFlash]);

  const onPlay = useCallback((note: string, freq: number) => {
    audioActivated.current = true;
    setHovered(note);
    playNote(freq);
    triggerFlash(note);
  }, [triggerFlash]);

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
      <PerspectivePiano
        hovered={hovered}
        flash={flash}
        onEnter={onEnter}
        onPlay={onPlay}
        onLeave={onLeave}
      />
      <div className="piano-separator-fallback" aria-hidden="true">
        {Array.from({ length: 30 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
    </div>
  );
}
