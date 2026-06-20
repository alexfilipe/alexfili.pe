import { useEffect, useRef } from "react";
import {
  AmbientLight,
  BufferGeometry,
  DirectionalLight,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer
} from "three";

function createIntelligenceGeometry() {
  const group = new Group();
  const geometry = new IcosahedronGeometry(2.2, 1);
  const wire = new LineSegments(
    new EdgesGeometry(geometry),
    new LineBasicMaterial({
      color: "#f5f0e8",
      transparent: true,
      opacity: 0.3
    })
  );

  const nodePositions = geometry.getAttribute("position");
  const pointsGeometry = new BufferGeometry();
  const points = [];
  for (let index = 0; index < nodePositions.count; index += 4) {
    points.push(nodePositions.getX(index), nodePositions.getY(index), nodePositions.getZ(index));
  }
  pointsGeometry.setAttribute("position", new Float32BufferAttribute(points, 3));

  const nodes = new Points(
    pointsGeometry,
    new PointsMaterial({
      color: "#f5f0e8",
      transparent: true,
      opacity: 0.58,
      size: 0.07
    })
  );

  const dustGeometry = new BufferGeometry();
  const dust = [];
  for (let index = 0; index < 160; index += 1) {
    const radius = 1.9 * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    dust.push(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );
  }
  dustGeometry.setAttribute("position", new Float32BufferAttribute(dust, 3));
  const dustPoints = new Points(
    dustGeometry,
    new PointsMaterial({
      color: "#d3b270",
      transparent: true,
      opacity: 0.15,
      size: 0.025
    })
  );

  group.add(wire, nodes, dustPoints);
  group.position.set(2.1, 1.36, -3.1);
  group.rotation.set(0.4, 0.15, -0.2);
  return group;
}

export default function HeroScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new Scene();
    const camera = new PerspectiveCamera(38, 1, 0.1, 100);
    const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    const geometry = createIntelligenceGeometry();
    const pointer = new Vector3(0, 0, 0);

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.domElement.className = "hero-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    camera.position.set(0, 0.15, 8.2);
    scene.add(new AmbientLight("#f5f0e8", 1.25));
    const keyLight = new DirectionalLight("#f5f0e8", 2.1);
    keyLight.position.set(-3, 5, 5);
    scene.add(keyLight);
    const goldLight = new DirectionalLight("#d3b270", 1.3);
    goldLight.position.set(4, 1.5, 3);
    scene.add(goldLight);
    scene.add(geometry);

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const width = Math.max(320, rect.width);
      const height = Math.max(320, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      if (width < 700) {
        geometry.position.set(0.15, 1.15, -3.1);
        geometry.scale.setScalar(0.78);
      } else {
        geometry.position.set(2.1, 1.36, -3.1);
        geometry.scale.setScalar(1);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
      pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    host.addEventListener("pointermove", onPointerMove, { passive: true });
    resize();

    let frameId = 0;
    const render = (time = 0) => {
      const t = time * 0.001;
      const scroll = Math.min(1.5, window.scrollY / Math.max(1, window.innerHeight));
      geometry.rotation.x = 0.38 + t * 0.11 + pointer.y * 0.16;
      geometry.rotation.y = t * 0.16 + pointer.x * 0.28 + scroll * 0.18;
      geometry.rotation.z = -0.2 + Math.sin(t * 0.5) * 0.05;

      renderer.render(scene, camera);
      if (!reduceMotion) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      renderer.domElement.remove();
      scene.traverse((object) => {
        if (object instanceof LineSegments || object instanceof Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    };
  }, []);

  return (
    <div ref={hostRef} className="hero-scene" aria-label="Interactive intelligence geometry">
      <div className="hero-fallback">
        <svg width="300" height="220" viewBox="0 0 300 220" aria-hidden="true">
          <path d="M150 18 250 73l-18 104-106 26-76-76 28-93 72-16Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m78 34 154 143M50 127l200-54M126 203 150 18" fill="none" stroke="currentColor" strokeOpacity=".45" />
        </svg>
      </div>
    </div>
  );
}
