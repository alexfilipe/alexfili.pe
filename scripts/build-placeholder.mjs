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

console.log(`Built temporary site: ${relative(root, source)} -> ${relative(root, outFile)}`);
