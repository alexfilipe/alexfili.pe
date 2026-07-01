const TARGET_ORIGIN = "https://alexfili.pe";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

function handleRequest(request) {
  const url = new URL(request.url);
  const location = TARGET_ORIGIN + url.pathname + url.search;

  return new Response(null, {
    status: 308,
    headers: {
      location,
      "cache-control": "public, max-age=3600",
    },
  });
}
