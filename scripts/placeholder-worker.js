const RAW_BASE = "https://raw.githubusercontent.com/alexfilipe/alexfili.pe/573daa38dd3e1299ff7125d9e6c5c139ea016f5a";
const SOURCE_VERSION = "20260704-seo-refresh";
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
  "/icons/favicon-16.png": ["public/icons/favicon-16.png", "image/png"],
  "/icons/favicon-32.png": ["public/icons/favicon-32.png", "image/png"],
  "/icons/favicon-48.png": ["public/icons/favicon-48.png", "image/png"],
  "/icons/icon-192.png": ["public/icons/icon-192.png", "image/png"],
  "/icons/icon-512.png": ["public/icons/icon-512.png", "image/png"],
  "/icons/maskable-512.png": ["public/icons/maskable-512.png", "image/png"],
};

const GENERATED_ASSETS = {
  "/robots.txt": {
    body: "User-agent: *\nAllow: /\n\nSitemap: https://alexfili.pe/sitemap.xml\n",
    contentType: "text/plain; charset=UTF-8",
  },
  "/sitemap.xml": {
    body: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://alexfili.pe/</loc>\n  </url>\n</urlset>\n',
    contentType: "application/xml; charset=UTF-8",
  },
};

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.protocol === "http:" || url.hostname === "www.alexfili.pe") {
    url.protocol = "https:";
    url.hostname = "alexfili.pe";
    if (shouldCollapseToHome(url.pathname)) {
      url.pathname = "/";
      url.search = "";
    }
    return Response.redirect(url.toString(), 308);
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { allow: "GET, HEAD" },
    });
  }

  if (shouldCollapseToHome(url.pathname)) {
    return Response.redirect("https://alexfili.pe/", 308);
  }

  const generatedAsset = GENERATED_ASSETS[url.pathname];
  if (generatedAsset) {
    return new Response(generatedAsset.body, {
      headers: {
        "content-type": generatedAsset.contentType,
        "cache-control": "public, max-age=300",
      },
    });
  }

  const asset = resolveAsset(url.pathname);
  const upstream = await fetch(RAW_BASE + "/" + asset.path + "?v=" + SOURCE_VERSION, {
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

function shouldCollapseToHome(pathname) {
  return pathname !== "/" && !STATIC_ASSETS[pathname] && !GENERATED_ASSETS[pathname];
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
