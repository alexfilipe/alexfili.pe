const CANONICAL_HOST = "alexfili.pe";
const WWW_HOST = "www.alexfili.pe";
const PERMANENT_REDIRECT = 308;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.protocol === "http:" || url.hostname === WWW_HOST) {
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
