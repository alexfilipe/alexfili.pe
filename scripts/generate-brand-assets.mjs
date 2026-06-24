import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const iconsDir = path.join(publicDir, "icons");

process.env.XDG_CACHE_HOME ??= path.join(tmpdir(), "alexfilipe-font-cache");
await mkdir(process.env.XDG_CACHE_HOME, { recursive: true });

const { default: sharp } = await import("sharp");

const COLORS = {
  bg: "#050504",
  ivory: "#f0ede6",
  ivoryBright: "#f7f4ed",
  gold: "#c8a96e"
};

const PHI = (1 + Math.sqrt(5)) / 2;
const INV_PHI = 1 / PHI;
const DODECAHEDRON_VERTICES = [
  ...signedTriples(1, 1, 1),
  ...signedTriples(0, INV_PHI, PHI),
  ...signedTriples(INV_PHI, PHI, 0),
  ...signedTriples(PHI, 0, INV_PHI)
].map(normalize);
const DODECAHEDRON_EDGES = shortestEdges(DODECAHEDRON_VERTICES);
const DODECAHEDRON_FACES = [
  [0, 8, 4, 14, 12],
  [0, 8, 10, 2, 16],
  [0, 12, 1, 17, 16],
  [1, 9, 5, 14, 12],
  [1, 9, 11, 3, 17],
  [2, 10, 6, 15, 13],
  [2, 13, 3, 17, 16],
  [3, 11, 7, 15, 13],
  [4, 8, 10, 6, 18],
  [4, 14, 5, 19, 18],
  [5, 9, 11, 7, 19],
  [6, 15, 7, 19, 18]
];
const DODECAHEDRON_TILT_45 = { x: (-58 * Math.PI) / 180, y: 0, z: (-26 * Math.PI) / 180 };

function signedTriples(x, y, z) {
  const xs = x === 0 ? [0] : [-x, x];
  const ys = y === 0 ? [0] : [-y, y];
  const zs = z === 0 ? [0] : [-z, z];
  const triples = [];

  for (const sx of xs) {
    for (const sy of ys) {
      for (const sz of zs) {
        triples.push([sx, sy, sz]);
      }
    }
  }

  return triples;
}

function normalize([x, y, z]) {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
}

function shortestEdges(vertices) {
  const distances = [];
  for (let a = 0; a < vertices.length; a += 1) {
    for (let b = a + 1; b < vertices.length; b += 1) {
      distances.push(distance(vertices[a], vertices[b]));
    }
  }

  const edgeLength = Math.min(...distances.filter((value) => value > 0.001));
  const edges = [];

  for (let a = 0; a < vertices.length; a += 1) {
    for (let b = a + 1; b < vertices.length; b += 1) {
      if (Math.abs(distance(vertices[a], vertices[b]) - edgeLength) < 0.01) {
        edges.push([a, b]);
      }
    }
  }

  return edges;
}

function distance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function rotate([x, y, z], rotation) {
  let rx = x;
  let ry = y * Math.cos(rotation.x) - z * Math.sin(rotation.x);
  let rz = y * Math.sin(rotation.x) + z * Math.cos(rotation.x);

  const yx = rx * Math.cos(rotation.y) + rz * Math.sin(rotation.y);
  const yz = -rx * Math.sin(rotation.y) + rz * Math.cos(rotation.y);
  rx = yx;
  rz = yz;

  const zx = rx * Math.cos(rotation.z) - ry * Math.sin(rotation.z);
  const zy = rx * Math.sin(rotation.z) + ry * Math.cos(rotation.z);

  return [zx, zy, rz];
}

function project(vertex, options) {
  const rotated = rotate(vertex, options.rotation);
  const perspective = options.camera / (options.camera - rotated[2]);

  return {
    x: options.centerX + rotated[0] * options.scale * perspective,
    y: options.centerY - rotated[1] * options.scale * perspective,
    z: rotated[2]
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function format(value) {
  return Number(value.toFixed(2));
}

function circle({ cx, cy, r, fill, opacity = 1, extra = "" }) {
  return `<circle cx="${format(cx)}" cy="${format(cy)}" r="${format(r)}" fill="${fill}" opacity="${opacity}"${extra} />`;
}

function line({ x1, y1, x2, y2, stroke, width, opacity = 1, extra = "" }) {
  return `<line x1="${format(x1)}" y1="${format(y1)}" x2="${format(x2)}" y2="${format(y2)}" stroke="${stroke}" stroke-width="${format(width)}" stroke-linecap="round" opacity="${opacity}"${extra} />`;
}

function polygon({ points, fill, opacity = 1, extra = "" }) {
  const coordinates = points.map((point) => `${format(point.x)},${format(point.y)}`).join(" ");
  return `<polygon points="${coordinates}" fill="${fill}" opacity="${opacity}"${extra} />`;
}

function renderDodecahedron(options) {
  const projected = DODECAHEDRON_VERTICES.map((vertex) => project(vertex, options));
  const zValues = projected.map((point) => point.z);
  const minZ = Math.min(...zValues);
  const maxZ = Math.max(...zValues);
  const depth = (z) => (z - minZ) / (maxZ - minZ || 1);

  const faces = [...DODECAHEDRON_FACES]
    .sort((a, b) => {
      const za = a.reduce((sum, index) => sum + projected[index].z, 0) / a.length;
      const zb = b.reduce((sum, index) => sum + projected[index].z, 0) / b.length;
      return za - zb;
    })
    .map((face) => {
      const faceDepth = depth(face.reduce((sum, index) => sum + projected[index].z, 0) / face.length);
      return polygon({
        points: face.map((index) => projected[index]),
        fill: COLORS.ivory,
        opacity: clamp((options.faceOpacity ?? 0.055) * (0.72 + faceDepth * 0.75), 0.024, options.maxFaceOpacity ?? 0.095)
      });
    });
  const farEdges = [];
  const nearEdges = [];
  const glowEdges = [];

  for (const [a, b] of DODECAHEDRON_EDGES) {
    const pa = projected[a];
    const pb = projected[b];
    const edgeDepth = depth((pa.z + pb.z) / 2);
    const target = edgeDepth > 0.52 ? nearEdges : farEdges;

    target.push(
      line({
        x1: pa.x,
        y1: pa.y,
        x2: pb.x,
        y2: pb.y,
        stroke: COLORS.ivory,
        width: options.lineWidth * (0.72 + edgeDepth * 0.42),
        opacity: clamp(options.lineOpacity * (0.55 + edgeDepth * 0.52), 0.08, 0.62)
      })
    );

    if (edgeDepth > 0.7) {
      glowEdges.push(
        line({
          x1: pa.x,
          y1: pa.y,
          x2: pb.x,
          y2: pb.y,
          stroke: COLORS.ivoryBright,
          width: options.lineWidth * 0.48,
          opacity: 0.16,
          extra: ` filter="url(#lineGlow)"`
        })
      );
    }
  }

  const nodes = projected
    .map((point) => {
      const pointDepth = depth(point.z);
      const opacity = clamp(options.nodeOpacity * (0.52 + pointDepth * 0.55), 0.28, 0.9);
      const radius = options.nodeRadius * (0.78 + pointDepth * 0.5);
      return circle({ cx: point.x, cy: point.y, r: radius, fill: COLORS.ivory, opacity });
    })
    .join("\n");

  return `
    <g opacity="${options.opacity ?? 1}">
      <g>${faces.join("\n")}</g>
      <g filter="url(#lineGlow)">${glowEdges.join("\n")}</g>
      <g>${farEdges.join("\n")}</g>
      <g>${nearEdges.join("\n")}</g>
      <g>${nodes}</g>
    </g>
  `;
}

function sharedDefs() {
  return `
    <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="nodeGlow" x="-120%" y="-120%" width="340%" height="340%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  `;
}

function iconSvg(size = 512, { maskable = false } = {}) {
  const scale = maskable ? size * 0.265 : size * 0.345;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>${sharedDefs()}</defs>
  <rect width="${size}" height="${size}" fill="${COLORS.bg}" />
  <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.38}" fill="${COLORS.gold}" opacity="0.032" />
  ${renderDodecahedron({
    centerX: size / 2,
    centerY: size / 2,
    scale,
    camera: 7,
    rotation: DODECAHEDRON_TILT_45,
    faceOpacity: 0.046,
    maxFaceOpacity: 0.076,
    lineWidth: size * 0.0135,
    lineOpacity: 0.56,
    nodeRadius: size * 0.0078,
    nodeOpacity: 0.78
  })}
</svg>`;
}

async function fontFace(name, fontPath, { weight = "400" } = {}) {
  const font = await readFile(path.join(rootDir, fontPath));
  const mime = fontPath.endsWith(".woff2") ? "font/woff2" : "font/woff";
  return `@font-face{font-family:'${name}';src:url(data:${mime};base64,${font.toString("base64")}) format('woff2');font-weight:${weight};font-style:normal;font-display:block;}`;
}

function escapeText(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function textLine({ x, y, text, size, family, fill, weight = 400, opacity = 1, extra = "" }) {
  return `<text x="${x}" y="${y}" fill="${fill}" opacity="${opacity}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="0" ${extra}>${escapeText(text)}</text>`;
}

async function ogSvg() {
  const gloock = await fontFace("Gloock", "node_modules/@fontsource/gloock/files/gloock-latin-ext-400-normal.woff2");
  const instrument = await fontFace(
    "Instrument Sans",
    "node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-ext-wght-normal.woff2",
    { weight: "100 900" }
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      ${gloock}
      ${instrument}
      .display{font-family:'Gloock','Didot','Georgia',serif;font-weight:400}
      .sans{font-family:'Instrument Sans','Inter','Helvetica Neue',Arial,sans-serif}
    </style>
    ${sharedDefs()}
  </defs>
  <rect width="1200" height="630" fill="${COLORS.bg}" />
  ${textLine({ x: 132, y: 180, text: "Álex", size: 110, family: "'Gloock','Didot','Georgia',serif", fill: COLORS.ivory, extra: `class="display"` })}
  ${textLine({ x: 132, y: 292, text: "Filipe", size: 110, family: "'Gloock','Didot','Georgia',serif", fill: COLORS.ivory, extra: `class="display"` })}
  ${textLine({ x: 132, y: 404, text: "Santos", size: 110, family: "'Gloock','Didot','Georgia',serif", fill: COLORS.ivory, extra: `class="display"` })}
  ${textLine({ x: 132, y: 506, text: "The architecture of intelligence.", size: 39, family: "'Gloock','Didot','Georgia',serif", fill: COLORS.gold, extra: `class="display"` })}
  <line x1="132" y1="548" x2="132" y2="606" stroke="${COLORS.gold}" stroke-width="1.4" opacity="0.72" />
  <text x="148" y="568" fill="${COLORS.ivory}" opacity="0.7" font-family="'Instrument Sans','Inter','Helvetica Neue',Arial,sans-serif" font-size="21" font-weight="500" letter-spacing="0" class="sans">
    <tspan font-weight="760" opacity="0.82">Software &amp; AI Engineer</tspan><tspan dx="5">guided by mathematical thought and classical</tspan>
    <tspan x="148" dy="34">musicianship.</tspan>
  </text>
  ${renderDodecahedron({
    centerX: 930,
    centerY: 290,
    scale: 181,
    camera: 7,
    rotation: DODECAHEDRON_TILT_45,
    faceOpacity: 0.042,
    maxFaceOpacity: 0.07,
    lineWidth: 4,
    lineOpacity: 0.44,
    nodeRadius: 2.7,
    nodeOpacity: 0.78
  })}
</svg>`;
}

function icoBuffer(entries) {
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + entries.length * entrySize;
  const buffers = [Buffer.alloc(offset)];
  const header = buffers[0];

  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  entries.forEach(({ size, data }, index) => {
    const position = headerSize + index * entrySize;
    header.writeUInt8(size >= 256 ? 0 : size, position);
    header.writeUInt8(size >= 256 ? 0 : size, position + 1);
    header.writeUInt8(0, position + 2);
    header.writeUInt8(0, position + 3);
    header.writeUInt16LE(1, position + 4);
    header.writeUInt16LE(32, position + 6);
    header.writeUInt32LE(data.length, position + 8);
    header.writeUInt32LE(offset, position + 12);
    offset += data.length;
    buffers.push(data);
  });

  return Buffer.concat(buffers);
}

async function icoBitmapEntry(svg, size) {
  const rgba = await sharp(Buffer.from(svg), { density: 256 })
    .resize(size, size, { fit: "contain" })
    .flatten({ background: COLORS.bg })
    .ensureAlpha()
    .raw()
    .toBuffer();
  const header = Buffer.alloc(40);
  const pixels = Buffer.alloc(size * size * 4);
  const maskStride = Math.ceil(size / 32) * 4;
  const mask = Buffer.alloc(maskStride * size);

  header.writeUInt32LE(40, 0);
  header.writeInt32LE(size, 4);
  header.writeInt32LE(size * 2, 8);
  header.writeUInt16LE(1, 12);
  header.writeUInt16LE(32, 14);
  header.writeUInt32LE(0, 16);
  header.writeUInt32LE(pixels.length, 20);
  header.writeInt32LE(0, 24);
  header.writeInt32LE(0, 28);
  header.writeUInt32LE(0, 32);
  header.writeUInt32LE(0, 36);

  for (let y = 0; y < size; y += 1) {
    const sourceY = size - 1 - y;
    for (let x = 0; x < size; x += 1) {
      const source = (sourceY * size + x) * 4;
      const target = (y * size + x) * 4;
      pixels[target] = rgba[source + 2];
      pixels[target + 1] = rgba[source + 1];
      pixels[target + 2] = rgba[source];
      pixels[target + 3] = rgba[source + 3];
    }
  }

  return {
    size,
    data: Buffer.concat([header, pixels, mask])
  };
}

async function pngFromSvg(svg, size) {
  return sharp(Buffer.from(svg), { density: 256 })
    .resize(size, size, { fit: "contain" })
    .flatten({ background: COLORS.bg })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

await mkdir(iconsDir, { recursive: true });

const faviconSourceSvg = iconSvg(512);
const sourceIconSvg = iconSvg(1024);
const maskableSvg = iconSvg(1024, { maskable: true });
const previewSvg = await ogSvg();

await writeFile(path.join(publicDir, "favicon.svg"), faviconSourceSvg);
await writeFile(path.join(publicDir, "og.svg"), previewSvg);
await writeFile(path.join(publicDir, "icon-source.png"), await pngFromSvg(sourceIconSvg, 1024));
await writeFile(path.join(publicDir, "apple-touch-icon.png"), await pngFromSvg(sourceIconSvg, 180));
await writeFile(path.join(publicDir, "favicon-16x16.png"), await pngFromSvg(sourceIconSvg, 16));
await writeFile(path.join(publicDir, "favicon-32x32.png"), await pngFromSvg(sourceIconSvg, 32));
await writeFile(path.join(iconsDir, "favicon-16.png"), await pngFromSvg(sourceIconSvg, 16));
await writeFile(path.join(iconsDir, "favicon-32.png"), await pngFromSvg(sourceIconSvg, 32));
await writeFile(path.join(iconsDir, "favicon-48.png"), await pngFromSvg(sourceIconSvg, 48));
await writeFile(path.join(iconsDir, "icon-192.png"), await pngFromSvg(sourceIconSvg, 192));
await writeFile(path.join(iconsDir, "icon-512.png"), await pngFromSvg(sourceIconSvg, 512));
await writeFile(path.join(iconsDir, "maskable-512.png"), await pngFromSvg(maskableSvg, 512));
await writeFile(
  path.join(publicDir, "og-image.png"),
  await sharp(Buffer.from(previewSvg))
    .resize(1200, 630, { fit: "fill" })
    .png({ compressionLevel: 9 })
    .toBuffer()
);

const icoEntries = await Promise.all([16, 32, 48].map((size) => icoBitmapEntry(sourceIconSvg, size)));
await writeFile(path.join(publicDir, "favicon.ico"), icoBuffer(icoEntries));

console.log(`Generated ${DODECAHEDRON_VERTICES.length} dodecahedron vertices and ${DODECAHEDRON_EDGES.length} edges.`);
console.log("Updated favicon, Apple touch icon, manifest icons, and Open Graph preview image.");
