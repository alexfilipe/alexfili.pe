## Browser QA policy

Do not open or use the browser for visual QA after every change.

For small, targeted changes, especially copy, CSS, typography, spacing, metadata, or static HTML edits:

- make the requested change

- run only lightweight validation if appropriate

- summarize what changed

- do not launch the browser unless explicitly asked

Use browser QA only when:

- I explicitly ask for visual QA

- the change affects layout, responsive behavior, interactions, screenshots, animations, or JavaScript behavior

- you need to debug a visual issue that cannot be verified from the code

- the change is large enough that visual regression risk is meaningful

When browser QA is not performed, say:

"Browser QA skipped per project instructions."

Never spend extra time taking screenshots or checking the page visually for tiny CSS/copy-only edits unless I request it.

## Deployment

Two independent targets — see the Deployment section of `README.md` for the full process.

- **`alpha.alexfili.pe`** (full Astro site): auto-deploys via git-connected Cloudflare Pages on every push to `main`. No manual step.
- **`alexfili.pe` / `www.alexfili.pe`** (production placeholder): served by the `alexfilipe-placeholder` Worker (`scripts/placeholder-worker.js`), which proxies `launch-placeholder.html` + `public/` assets from a pinned commit. Deploy is **manual** — bump `RAW_BASE` to the new commit SHA and `SOURCE_VERSION`, push, then `npx wrangler deploy scripts/placeholder-worker.js --name alexfilipe-placeholder --compatibility-date <today>`.

Pushing to `main` does **not** update the production placeholder.

## SEO and IndexNow

Keep page metadata and social preview metadata separate. If asked to update only
OpenGraph or Twitter/X descriptions, do not change titles or normal
`<meta name="description">` values.

For IndexNow on the current production placeholder:

- Generate a fresh 32-hex-character key with `openssl rand -hex 16`.
- Save it as `public/<key>.txt` containing exactly the key; verify `wc -c`
  reports `32`.
- Add only the active `/<key>.txt` root path to `STATIC_ASSETS` in
  `scripts/placeholder-worker.js` with `text/plain; charset=UTF-8`.
- Commit/push the source change, then repin `RAW_BASE` to that source commit,
  bump `SOURCE_VERSION`, commit/push again, and deploy
  `alexfilipe-placeholder`.
- Verify `https://alexfili.pe/<key>.txt` and `https://alexfili.pe/robots.txt`
  return `200` as bare text files before pinging IndexNow.
- Verify an unknown placeholder path still redirects to `https://alexfili.pe/`.
- Only after the production key file is live, ping
  `https://api.indexnow.org/indexnow?url=https://alexfili.pe/&key=<key>`.

Do **not** ping IndexNow for `alpha.alexfili.pe`.
