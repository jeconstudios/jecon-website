# JECON Website

Marketing site for JECON LLC (jeconllc.com), rebuilt as a multi-page Astro site
per the JECON Platform build plan. Deployed via Cloudflare Workers (static
assets), backed by Supabase for account signup.

## Structure

- `/` — Home: platform-first hero, audience router, services credibility strip.
- `/platform` — Module B (Logistics Management, launch) and Module A (Fleet Ops, early access).
- `/solutions` — one section per audience: Government, Carrier/Fleet, Commercial, Individual.
- `/pricing` — Free / Starter / Professional / Enterprise-Gov tiers.
- `/services` — JECON's existing federal program management & logistics content.
- `/contact` — contact form + FAQ.
- `/signup`, `/signin`, `/set-password` — Supabase Auth flows (see below).
- `/privacy`, `/terms` — updated for the platform (AI-assist disclosure, no-CUI notice, account data handling).

## Local setup

```bash
npm install
cp .env.example .env      # already has the real Supabase project URL + public anon key
npm run dev                # http://localhost:4321
npm run build               # outputs to dist/
```

This session's sandbox could not run `npm install` — outbound access to
`registry.npmjs.org` is blocked by this environment's network egress policy
(a `Host not in allowlist` error, unrelated to GitHub). Run the install and
build on your own machine, where normal internet access works.

## Signup flow — how it works (and one decision I made)

The spec calls for a 4-field signup form (name, email, organization, account
type) with no approval gate. Supabase Auth's standard `signUp()` needs a
password, so **`/signup` submits a random throwaway password behind the
scenes** and sends the user a verification email. Clicking that link logs
them in and lands them on `/set-password`, where they choose their real
password. This keeps the form at exactly 4 fields while still using real
Supabase Auth accounts. Flag this for review — a magic-link/OTP flow would
avoid the throwaway-password step entirely if you'd rather do it that way.

`services_of_interest` (which turns on Module A vs. B entitlements in the
`platform` schema) isn't one of the 4 fields either. Right now the form
guesses from account type (`carrier` → Fleet Ops, everything else → Logistics
Management). This should really be a choice made inside the app after
signup — flagging as an open item once app.jeconllc.com exists.

## Environment variables

See `.env.example`. The Supabase URL and publishable/anon key are already
filled in for the live `jecon-platform` Supabase project — both are meant to
be public (Row Level Security is what actually protects data, not secrecy of
these values). `PUBLIC_TURNSTILE_SITE_KEY` is blank until you create a
Turnstile widget in the Cloudflare dashboard; until it's set, the signup form
simply doesn't render the Turnstile widget or pass a captcha token (Supabase's
Auth CAPTCHA setting should stay **off** until then, or signup will fail).

## Deploying to Cloudflare Workers (static assets)

1. `npm run build`
2. `npx wrangler login`
3. `npx wrangler deploy`

`wrangler.toml` is already set up for static-assets hosting (not Pages), per
spec. `worker/entry.js` is a placeholder for a future `/api/signup` route —
not required today since `/signup` calls Supabase directly from the browser.

To get automatic deploys on every push to `main`, connect this GitHub repo in
the Cloudflare dashboard under Workers & Pages → your worker → Settings →
Builds, and set the build command to `npm run build` with output directory
`dist`. That also gives you preview URLs on other branches before merging to
main, as the spec asks for.

## Not done yet in this pass

- Cloudflare DNS/zone wiring for jeconllc.com and the app.jeconllc.com CNAME slot.
- Turnstile widget creation + wiring Supabase Auth's CAPTCHA provider.
- Custom SMTP (Postmark/SendGrid) for Supabase Auth emails — currently using Supabase's default sender, which the spec says not to rely on for production.
- Stripe Checkout wiring for Free/Starter/Professional (Stripe is connected in **live mode** — build and test this with real review before it's reachable by customers).
- PO/invoice manual-billing flow for Enterprise/Gov.
