// Minimal Worker entry for static-assets hosting (Cloudflare Workers, not Pages).
// The [assets] binding in wrangler.toml serves everything in dist/ automatically;
// this fetch handler exists as the place to add the /api/signup Turnstile+Supabase
// route (see attachment spec step 4) once Turnstile + SMTP are configured — the
// marketing site itself does not need a custom route today because signup.astro
// calls Supabase Auth directly from the browser using the public anon key.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Placeholder for a future server-side route, e.g. Turnstile verification
    // that a client can't safely do itself. Not wired yet.
    if (url.pathname === '/api/signup') {
      return new Response('Not implemented — signup is handled client-side today.', { status: 501 });
    }

    return env.ASSETS.fetch(request);
  },
};
