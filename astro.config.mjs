import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://alexfili.pe",
  integrations: [react(), mdx(), sitemap()],
  prefetch: true,
  output: "static",
  vite: {
    build: {
      chunkSizeWarningLimit: 650
    },
    ssr: {
      noExternal: ["three"]
    }
  }
});
