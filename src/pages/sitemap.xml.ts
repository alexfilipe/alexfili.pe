import type { APIRoute } from "astro";
import { DEFAULT_SITE_URL, indexableSeoEntries, makeAbsoluteUrl } from "@/data/seo";

export const prerender = true;

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET: APIRoute = () => {
  const site = process.env.PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  const urls = indexableSeoEntries
    .map((entry) => {
      const loc = escapeXml(makeAbsoluteUrl(entry.path, site));
      const lastmod = escapeXml(entry.lastmod);
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
    })
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
