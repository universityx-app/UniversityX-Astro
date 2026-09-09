// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || process.env.SITE_URL || 'https://universityx.app',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});