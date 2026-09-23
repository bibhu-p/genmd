import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Production URL. Used for canonical links, social preview URLs and the sitemap.
  site: 'https://genmd01.netlify.app',
  vite: {
    plugins: [tailwindcss()]
  }
});
