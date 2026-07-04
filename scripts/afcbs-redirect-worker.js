const TARGET_URL = "https://alexfili.pe/";
const AFCBS_FILE_REDIRECTS = new Map([
  ["/robots.txt", "https://alexfili.pe/robots.txt"],
  ["/sitemap.xml", "https://alexfili.pe/sitemap.xml"],
]);

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

function handleRequest(request) {
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase();
  const fileRedirect = AFCBS_FILE_REDIRECTS.get(url.pathname);

  if ((hostname === "afcbs.me" || hostname === "www.afcbs.me") && fileRedirect) {
    return redirect(fileRedirect);
  }

  return redirect(TARGET_URL);
}

function redirect(location) {
  return new Response(null, {
    status: 301,
    headers: {
      location,
      "cache-control": "no-store, max-age=0",
    },
  });
}
