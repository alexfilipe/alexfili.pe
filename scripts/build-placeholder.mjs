import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "launch-placeholder.html");
const outDir = join(root, "dist");
const outFile = join(outDir, "index.html");

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await copyFile(source, outFile);

const staticAssets = [
  "favicon.ico",
  "favicon.svg",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "apple-touch-icon.png",
  "og-image.png",
  "site.webmanifest",
];

for (const asset of staticAssets) {
  await copyFile(join(root, "public", asset), join(outDir, asset));
}

await mkdir(join(outDir, "icons"), { recursive: true });
for (const icon of [
  "favicon-16.png",
  "favicon-32.png",
  "favicon-48.png",
  "icon-192.png",
  "icon-512.png",
  "maskable-512.png"
]) {
  await copyFile(join(root, "public", "icons", icon), join(outDir, "icons", icon));
}

await writeFile(
  join(outDir, "robots.txt"),
  "User-agent: *\nAllow: /\n\nSitemap: https://alexfili.pe/sitemap.xml\n"
);
await writeFile(
  join(outDir, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://alexfili.pe/</loc>\n  </url>\n</urlset>\n'
);

console.log(`Built temporary site: ${relative(root, source)} -> ${relative(root, outFile)}`);
