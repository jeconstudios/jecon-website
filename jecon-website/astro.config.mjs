import { defineConfig } from 'astro/config';

// Static output — deployed as static assets on Cloudflare Workers (not Pages, not SSR).
export default defineConfig({
  site: 'https://jeconllc.com',
  output: 'static',
  build: {
    format: 'directory',
  },
});
