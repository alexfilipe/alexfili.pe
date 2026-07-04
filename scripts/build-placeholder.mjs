import { copyFile, mkdir, rm } from "node:fs/promises";
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
  "robots.txt",
  "sitemap.xml",
  "site.webmanifest",
];

for (const asset of staticAssets) {
  await copyFile(join(root, "public", asset), join(outDir, asset));
}

await mkdir(join(outDir, "icons"), { recursive: true });
for (const icon of ["icon-192.png", "icon-512.png", "maskable-512.png"]) {
  await copyFile(join(root, "public", "icons", icon), join(outDir, "icons", icon));
}

console.log(`Built temporary site: ${relative(root, source)} -> ${relative(root, outFile)}`);
