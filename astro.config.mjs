import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? "https://alexfili.pe",
  integrations: [react(), mdx()],
  prefetch: true,
  devToolbar: {
    enabled: false
  },
  output: "static",
  vite: {
    server: {
      allowedHosts: ["dev.alexfili.pe"]
    },
    optimizeDeps: {
      include: ["@astrojs/react/client.js", "lucide-react", "react", "react-dom/client", "three"]
    },
    build: {
      chunkSizeWarningLimit: 650
    },
    ssr: {
      noExternal: ["three"]
    }
  }
});
