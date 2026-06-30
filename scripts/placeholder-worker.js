const RAW_BASE = "https://raw.githubusercontent.com/alexfilipe/alexfili.pe/main";
const HTML_ASSET = {
  path: "launch-placeholder.html",
  contentType: "text/html; charset=UTF-8",
  cacheControl: "no-store",
  cacheTtl: 0,
};

const STATIC_ASSETS = {
  "/favicon.ico": ["public/favicon.ico", "image/x-icon"],
  "/favicon.svg": ["public/favicon.svg", "image/svg+xml; charset=UTF-8"],
  "/favicon-16x16.png": ["public/favicon-16x16.png", "image/png"],
  "/favicon-32x32.png": ["public/favicon-32x32.png", "image/png"],
  "/apple-touch-icon.png": ["public/apple-touch-icon.png", "image/png"],
  "/og-image.png": ["public/og-image.png", "image/png"],
  "/site.webmanifest": ["public/site.webmanifest", "application/manifest+json; charset=UTF-8"],
  "/icons/icon-192.png": ["public/icons/icon-192.png", "image/png"],
  "/icons/icon-512.png": ["public/icons/icon-512.png", "image/png"],
  "/icons/maskable-512.png": ["public/icons/maskable-512.png", "image/png"],
};

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { allow: "GET, HEAD" },
    });
  }

  const url = new URL(request.url);
  const asset = resolveAsset(url.pathname);
  const upstream = await fetch(`${RAW_BASE}/${asset.path}`, {
    cf: {
      cacheEverything: true,
      cacheTtl: asset.cacheTtl,
    },
  });

  if (!upstream.ok) {
    return new Response("Asset unavailable", { status: 502 });
  }

  const headers = new Headers(upstream.headers);
  headers.set("content-type", asset.contentType);
  headers.set("cache-control", asset.cacheControl);
  headers.delete("content-security-policy");

  return new Response(request.method === "HEAD" ? null : upstream.body, {
    status: upstream.status,
    headers,
  });
}

function resolveAsset(pathname) {
  const staticAsset = STATIC_ASSETS[pathname];

  if (!staticAsset) {
    return HTML_ASSET;
  }

  return {
    path: staticAsset[0],
    contentType: staticAsset[1],
    cacheControl: "public, max-age=300",
    cacheTtl: 300,
  };
}
