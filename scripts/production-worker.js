const CANONICAL_HOST = "alexfili.pe";
const WWW_HOST = "www.alexfili.pe";
const PERMANENT_REDIRECT = 308;
const SOFT_REDIRECT = 302;
const LABSTOCKER_HOSTS = new Set(["labstocker.com", "www.labstocker.com"]);
const LABSTOCKER_TARGET = "https://alexfili.pe/projects/labstocker";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname.toLowerCase();

    if (LABSTOCKER_HOSTS.has(hostname)) {
      return Response.redirect(LABSTOCKER_TARGET, SOFT_REDIRECT);
    }

    if (url.protocol === "http:" || hostname === WWW_HOST) {
      url.protocol = "https:";
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), PERMANENT_REDIRECT);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { allow: "GET, HEAD" },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
