## Browser QA policy

Do not open or use the browser for visual QA after every change.

For small, targeted changes, especially copy, CSS, typography, spacing, metadata, or static HTML edits:

- make the requested change

- run only lightweight validation if appropriate

- summarize what changed

- do not launch the browser unless explicitly asked

Use browser QA only when:

- I explicitly ask for visual QA

- you need to debug a visual issue that cannot be verified from the code

- the change is large enough that visual regression risk is meaningful

When browser QA is not performed, say:

"Browser QA skipped per project instructions."

Never spend extra time taking screenshots or checking the page visually for tiny CSS/copy-only edits unless I request it.

## Deployment

Two independent targets — see the Deployment section of `README.md` for the full process.

- **`alpha.alexfili.pe`** (full Astro site): auto-deploys via git-connected Cloudflare Pages on every push to `main`. No manual step.
- **`alexfili.pe` / `www.alexfili.pe`** (full Astro production site): deploys manually through the GitHub Actions workflow **Deploy alexfili.pe production**. The workflow runs `npm run build:production`, then `wrangler deploy --config wrangler.production.jsonc` against the existing `alexfilipe-placeholder` Worker name so dashboard routes stay attached.
- **Production placeholder fallback**: `scripts/placeholder-worker.js` can still be deployed manually to restore the old launch placeholder. Only use it intentionally; deploying it replaces the full production site.

Pushing to `main` does **not** update production.

## SEO and IndexNow

Keep page metadata and social preview metadata separate. If asked to update only
OpenGraph or Twitter/X descriptions, do not change titles or normal
`<meta name="description">` values.

For IndexNow on the current production full site:

- Generate a fresh 32-hex-character key with `openssl rand -hex 16`.
- Save it as `public/<key>.txt` containing exactly the key; verify `wc -c`
  reports `32`.
- Commit/push the source change, then run the GitHub Actions workflow **Deploy
  alexfili.pe production** for that commit.
- Verify `https://alexfili.pe/<key>.txt` and `https://alexfili.pe/robots.txt`
  return `200` as bare text files before pinging IndexNow.
- Only after the production key file is live, ping
  `https://api.indexnow.org/indexnow?url=https://alexfili.pe/&key=<key>`.

If the placeholder fallback is active instead, add only the active `/<key>.txt`
root path to `STATIC_ASSETS` in `scripts/placeholder-worker.js`, repin
`RAW_BASE`, bump `SOURCE_VERSION`, deploy the placeholder Worker, and verify an
unknown placeholder path still redirects to `https://alexfili.pe/`.

Do **not** ping IndexNow for `alpha.alexfili.pe`.
