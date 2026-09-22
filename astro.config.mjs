// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || process.env.SITE_URL || 'https://universityx.app',
  redirects: {
    '/scholarship': '/cohort/build-and-ship-ai-applications-with-python/scholarship',
    '/paths/ai-data': '/paths/ai-data-science',
    '/paths/ai-data/ai-engineering': '/paths/ai-data-science/ai-engineering',
    '/paths/ai-data/ai-engineering/cohorts': '/paths/ai-data-science/ai-engineering/cohorts',
  },
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/build-and-ship-ai-applications-with-python/enrollment/'),
    }),
  ]
});
