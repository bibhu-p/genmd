import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Production URL. Used for canonical links, social preview URLs and the sitemap.
  site: 'https://genmdstudio.netlify.app',
  markdown: {
    // Dual themes without a default colour: CSS picks light or dark from data-theme.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
