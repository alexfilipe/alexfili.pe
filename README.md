# alexfili.pe

Personal website for Álex Filipe Santos: a static Astro site with a cinematic editorial design, an interactive Three.js hero, a Figma-inspired piano separator, music and writing pages, typed content collections, and Cloudflare Pages deployment.

## Stack

- Astro 6 with TypeScript
- React islands for the interactive hero and music filters
- MDX content collections for essays and recordings
- Three.js for the intelligence geometry and piano separator
- Self-hosted Figma fonts through Fontsource: Gloock and Instrument Sans
- Static output for Cloudflare Pages

## Local Development

```bash
npm install
npm run dev
```

The local dev server will print a URL, usually `http://localhost:4321/`.

Useful commands:

```bash
npm run check
npm run build
npm run preview
```

## Content Editing

Profile and project seed data live in:

- `src/data/profile.ts`
- `src/data/projects.ts`

Essays live in `src/content/essays/`. Each entry supports:

- `title`
- `description`
- `publishedAt`
- `updatedAt`
- `tags`
- `featured`
- `draft`

Recordings live in `src/content/recordings/`. Each entry supports:

- `title`
- `instrument`
- `composer`
- `work`
- `year`
- `mediaType`
- `url`
- `featured`

Set `draft: true` to keep a writing out of production routes and indexes.

## Figma Make Source

The original Figma Make project is `e2CcCQY6eQM4ySNtt0fsj3`. Its generated source should be treated as design/reference material, not as an app dependency.

Useful reference files from Figma Make:

- `src/app/App.tsx`
- `src/styles/fonts.css`
- `src/styles/theme.css`
- `src/styles/globals.css`
- generated image assets

The production home page ports the Figma Make composition into maintainable Astro/React components: black editorial canvas, Gloock display identity, Instrument Sans body/UI, antique-gold accent, piano motif, and intelligence geometry. The implementation keeps Astro routing and content collections rather than shipping the generated Vite wrapper wholesale.

## Deployment

Cloudflare Pages settings:

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

Temporary launch mode:

- `npm run build` currently publishes only `launch-placeholder.html` as `dist/index.html`.
- `scripts/placeholder-worker.js` mirrors the temporary Cloudflare Worker currently serving the placeholder and its preview/icon assets.
- `npm run build:site` keeps the full Astro site build available for when the full website is ready.
- To restore the full site deploy, change `build` in `package.json` back to the `build:site` command.

After the first successful deploy:

1. Add `alexfili.pe` as a custom domain in Cloudflare Pages.
2. Point DNS from the VPS to Cloudflare Pages as instructed by Cloudflare.
3. Keep the VPS configuration available as a rollback until HTTPS is active on Cloudflare.
4. Optionally add `www.alexfili.pe` and redirect it to the apex domain.

## QA Notes

Verified locally:

- `npm run check`
- `npm run build`
- Static route generation for `/`, `/music/`, `/essays/`, writing detail pages, and `/404.html`
- Sitemap generation
- Draft writing exclusion from `dist`

Rendered browser automation was attempted with the in-app Browser first, then bundled Playwright. The in-app browser runtime failed in this sandbox, and the Playwright Chromium download timed out. Manual browser QA should be run from `npm run preview` before deployment.
