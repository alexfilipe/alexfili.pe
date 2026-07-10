# alexfili.pe

Personal website for Álex Filipe Santos: a static Astro site with a cinematic editorial design, an interactive Three.js hero, a Figma-inspired piano separator, music and writing pages, typed content collections, and Cloudflare Pages deployment.

## Stack

- Astro 6 with TypeScript
- React islands for the interactive hero and music filters
- MDX content collections for essays and recordings
- Three.js for the intelligence geometry and piano separator
- Self-hosted fonts through Fontsource: Fraunces and Instrument Sans
- Static output for Cloudflare Pages and Cloudflare Workers Static Assets

## Local Development

```bash
npm install
npm run dev
```

The local dev server will print a URL, usually `http://localhost:4321/`.

Useful commands:

```bash
npm run check
npm run build:site
npm run build:production
npm run build # placeholder fallback build
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
alpha site; production is promoted manually.

### Alpha site — `alpha.alexfili.pe` (automatic)

The full Astro site is deployed by a git-connected Cloudflare Pages project.

- Framework preset: Astro
- Build output directory: `dist`
- Production branch: `main`

Every push to `main` triggers a Pages build automatically — no manual step is
required. To force a rebuild without code changes, push an empty commit
(`git commit --allow-empty -m "Trigger alpha Pages deployment"`).

### Production site — `alexfili.pe` and `www.alexfili.pe` (manual)

The full Astro site is promoted to the apex domain by the manual GitHub Actions
workflow `.github/workflows/deploy-production.yml`.

The workflow builds the site with `PUBLIC_SITE_URL=https://alexfili.pe`, then
deploys `dist/` as Cloudflare Workers Static Assets through
`wrangler.production.jsonc`. It intentionally reuses the existing
`alexfilipe-placeholder` Worker name so the `alexfili.pe` / `www.alexfili.pe`
routes already configured in the Cloudflare dashboard remain attached.

Required GitHub secrets, preferably on the `production` environment:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

Create the API token in Cloudflare with permission to edit the production
Worker. Do not commit Cloudflare credentials to the repo.

To deploy production:

1. Push the commit you want to deploy.
2. In GitHub, open **Actions** → **Deploy alexfili.pe production**.
3. Click **Run workflow**, choose the branch/ref, and type `alexfili.pe` in the
   confirmation field.
4. Wait for the `production` environment deployment to finish.

Local production checks:

```bash
npm run build:production
npm run deploy:production:dry-run
```

The dry run compiles the Worker and assets without publishing. It requires
Wrangler credentials locally if Wrangler asks for them.

After deploy, verify:

```bash
curl -sI https://alexfili.pe/
curl -sI https://www.alexfili.pe/
curl -s https://alexfili.pe/robots.txt
```

`www` should redirect to the apex host, and `robots.txt` / `sitemap.xml` should
reference `https://alexfili.pe`.

### Production placeholder fallback — manual only

The old launch placeholder still exists as an intentional fallback path:
`scripts/placeholder-worker.js` proxies `launch-placeholder.html` plus selected
assets in `public/` from a pinned GitHub commit (`RAW_BASE`).

Deploying the placeholder Worker will replace the full production site with the
placeholder. Only use this when you intentionally want the apex domain to return
to the launch page.

To update and deploy the placeholder:

1. Edit `launch-placeholder.html` / `public/` assets, then commit and push to
   `main` so the new content is available on GitHub raw.
2. In `scripts/placeholder-worker.js`, set `RAW_BASE` to the new commit SHA and
   bump `SOURCE_VERSION` to bust the Cloudflare edge cache. Commit and push.
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
- The full-site production deploy uses `wrangler.production.jsonc`; the
  placeholder fallback keeps using the explicit CLI flags above.
- The `alexfili.pe` / `www.alexfili.pe` custom-domain routes live in the
  Cloudflare dashboard. The production Wrangler config deliberately omits
  `route` / `routes` so deploys update Worker code/assets without taking route
  ownership away from the dashboard.

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

Current production full-site flow:

1. Generate a fresh 32-character hex key:

   ```bash
   openssl rand -hex 16
   ```

2. Save it as `public/<key>.txt` containing exactly the key. Avoid a trailing
   newline; `wc -c public/<key>.txt` should report `32`.
3. Remove any old IndexNow key file unless there is a reason to keep it active.
4. Run lightweight checks:

   ```bash
   npm run check
   npm run build:production
   ```

5. Commit the source changes and push them to `main`.
6. Run the **Deploy alexfili.pe production** workflow for that commit.
7. Verify production before pinging IndexNow:

   ```bash
   curl -i https://alexfili.pe/<key>.txt
   curl -i https://alexfili.pe/robots.txt
   ```

   The key file and `robots.txt` should return `200` as bare text files.

8. After the key file is verified live, send the one-time IndexNow signal:

   ```bash
   curl -i "https://api.indexnow.org/indexnow?url=https://alexfili.pe/&key=<key>"
   ```

   A successful submission usually returns `202`.

For the placeholder fallback, also add the active `/<key>.txt` root path to
`STATIC_ASSETS` in `scripts/placeholder-worker.js`, repin `RAW_BASE`, bump
`SOURCE_VERSION`, deploy the placeholder Worker, and verify an unknown
placeholder path still redirects to `https://alexfili.pe/`.

## QA Notes

Verified locally for the full Astro site:

- `npm run check`
- `npm run build:site`
- `npm run build:production`
- Static route generation for `/`, `/music`, `/essays`, writing detail pages, and `/404.html`
- Sitemap generation
- Draft writing exclusion from `dist`

Rendered browser automation was attempted with the in-app Browser first, then bundled Playwright. The in-app browser runtime failed in this sandbox, and the Playwright Chromium download timed out. Manual browser QA should be run from `npm run preview` before deployment.
