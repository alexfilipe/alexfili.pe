const siteUrl = (process.env.PUBLIC_SITE_URL ?? "https://alexfili.pe").replace(/\/$/, "");

export function GET() {
  return new Response(`User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap-index.xml
`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
