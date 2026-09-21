const TARGET_ORIGIN = "https://alexfili.pe";

addEventListener("fetch", (event) => {
  const source = new URL(event.request.url);
  const target = new URL(TARGET_ORIGIN);
  target.pathname = source.pathname;
  target.search = source.search;

  event.respondWith(
    new Response(null, {
      status: 301,
      headers: {
        location: target.toString(),
        "cache-control": "no-store, max-age=0",
      },
    }),
  );
});
