# alexfili.pe

Personal website for Álex Filipe Santos: a static Astro site with a cinematic editorial design, an interactive Three.js hero, a Figma-inspired piano separator, music and writing pages, typed content collections, and Cloudflare Pages deployment.

## Stack

- Astro 6 with TypeScript
- React islands for the interactive hero and music filters
- MDX content collections for essays and recordings
- Three.js for the intelligence geometry and piano separator
- Self-hosted fonts through Fontsource: Fraunces and Instrument Sans
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

The production home page ports the Figma Make composition into maintainable Astro/React components: black editorial canvas, Fraunces display identity, Instrument Sans body/UI, antique-gold accent, piano motif, and intelligence geometry. The implementation keeps Astro routing and content collections rather than shipping the generated Vite wrapper wholesale.

## Deployment

There are two independent deploy targets. Pushing to `main` only updates the
alpha site; the production placeholder is deployed manually.

### Alpha site — `alpha.alexfili.pe` (automatic)

The full Astro site is deployed by a git-connected Cloudflare Pages project.

- Framework preset: Astro
- Build output directory: `dist`
- Production branch: `main`

Every push to `main` triggers a Pages build automatically — no manual step is
required. To force a rebuild without code changes, push an empty commit
(`git commit --allow-empty -m "Trigger alpha Pages deployment"`).

### Production placeholder — `alexfili.pe` and `www.alexfili.pe` (manual)

The apex domain is served by the `alexfilipe-placeholder` Cloudflare Worker
(`scripts/placeholder-worker.js`), *not* by Pages. The worker proxies
`launch-placeholder.html` plus the icon/preview assets in `public/` from a
**pinned GitHub commit** (`RAW_BASE`) and redirects `www` → apex.

Because the worker reads from a pinned commit, editing the placeholder is not
enough — you must repin and redeploy the worker:

1. Edit `launch-placeholder.html` / `public/` assets, then commit and push to
   `main` so the new content is available on GitHub raw.
2. In `scripts/placeholder-worker.js`, set `RAW_BASE` to the new commit SHA and
   bump `SOURCE_VERSION` (this busts the Cloudflare edge cache so the new HTML
   actually serves). Commit and push.
3. Authenticate once: `npx wrangler login`.
4. Deploy:

   ```bash
   npx wrangler deploy scripts/placeholder-worker.js \
     --name alexfilipe-placeholder \
     --compatibility-date <today>
   ```

5. Verify: `curl -sI https://alexfili.pe/` returns `200`, and
   `curl -s https://alexfili.pe/ | grep -i '<title>'` shows the expected copy.

Notes:

- The worker is service-worker format, so `--compatibility-date` is required.
- There is no `wrangler.toml`; without one, each deploy re-enables the
  `workers.dev` subdomain and Preview URLs by default. Add a minimal
  `wrangler.toml` (`name`, `compatibility_date`, `workers_dev = false`) if you
  want reproducible deploys.
- The `alexfili.pe` / `www.alexfili.pe` custom-domain routes live in the
  Cloudflare dashboard. `wrangler deploy --name` only updates worker code and
  leaves those routes untouched.

### SEO metadata and IndexNow

Keep normal page metadata and social preview metadata separate:

- Page titles and `<meta name="description">` live in `src/data/profile.ts`,
  `src/layouts/BaseLayout.astro`, and `launch-placeholder.html`.
- OpenGraph and Twitter/X preview text uses `profile.homeSeo.socialDescription`
  in the Astro site and explicit `og:description` / `twitter:description` tags
  in `launch-placeholder.html`.
- Do not change page titles or normal page meta descriptions when the requested
  update is only for OpenGraph and Twitter/X descriptions.

IndexNow should only be pinged for the production apex URL after the key file is
live at `https://alexfili.pe/<key>.txt`. Do **not** ping
`alpha.alexfili.pe`.

Current placeholder flow:

1. Generate a fresh 32-character hex key:

   ```bash
   openssl rand -hex 16
   ```

2. Save it as `public/<key>.txt` containing exactly the key. Avoid a trailing
   newline; `wc -c public/<key>.txt` should report `32`.
3. In `scripts/placeholder-worker.js`, add `"/<key>.txt"` to `STATIC_ASSETS`
   with the source path `public/<key>.txt` and content type
   `text/plain; charset=UTF-8`. Remove any old IndexNow key mapping/file unless
   there is a reason to keep it active.
4. Run lightweight checks:

   ```bash
   node --check scripts/placeholder-worker.js
   npm run check
   npm run build
   ```

5. Commit the source changes and push them to `main`.
6. Update `RAW_BASE` in `scripts/placeholder-worker.js` to the source commit
   SHA that contains `public/<key>.txt`, bump `SOURCE_VERSION`, then commit and
   push that repin.
7. Deploy the placeholder worker:

   ```bash
   npx wrangler deploy scripts/placeholder-worker.js \
     --name alexfilipe-placeholder \
     --compatibility-date <today>
   ```

8. Verify production before pinging IndexNow:

   ```bash
   curl -i https://alexfili.pe/<key>.txt
   curl -i https://alexfili.pe/robots.txt
   curl -I https://alexfili.pe/some-missing-path
   ```

   The key file and `robots.txt` should return `200` as bare text files. A
   missing placeholder path should still redirect to `https://alexfili.pe/`.

9. After the key file is verified live, send the one-time IndexNow signal:

   ```bash
   curl -i "https://api.indexnow.org/indexnow?url=https://alexfili.pe/&key=<key>"
   ```

   A successful submission usually returns `202`.

When the full Astro site is promoted to production, keep the same IndexNow
rules: serve `public/<key>.txt` at the apex root, verify it at
`https://alexfili.pe/<key>.txt`, and ping only
`https://api.indexnow.org/indexnow?url=https://alexfili.pe/&key=<key>` after the
production apex deploy is live.

### Restoring the full site to production

- `npm run build` currently publishes only `launch-placeholder.html` as
  `dist/index.html`; `npm run build:site` builds the full Astro site.
- To promote the full site, point the production domain at the Pages project
  (or change `build` in `package.json` back to `build:site`) and retire the
  placeholder worker.

## QA Notes

Verified locally:

- `npm run check`
- `npm run build`
- Static route generation for `/`, `/music/`, `/essays/`, writing detail pages, and `/404.html`
- Sitemap generation
- Draft writing exclusion from `dist`

Rendered browser automation was attempted with the in-app Browser first, then bundled Playwright. The in-app browser runtime failed in this sandbox, and the Playwright Chromium download timed out. Manual browser QA should be run from `npm run preview` before deployment.
