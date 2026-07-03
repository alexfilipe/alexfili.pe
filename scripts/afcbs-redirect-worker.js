const TARGET_URL = "https://alexfili.pe/";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

function handleRequest(request) {
  return new Response(null, {
    status: 301,
    headers: {
      location: TARGET_URL,
      "cache-control": "no-store, max-age=0",
    },
  });
}
