const TARGET_URL = "https://alexfili.pe/";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

function handleRequest(request) {
  return new Response(null, {
    status: 308,
    headers: {
      location: TARGET_URL,
      "cache-control": "public, max-age=3600",
    },
  });
}
