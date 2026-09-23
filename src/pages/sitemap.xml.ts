import type { APIRoute } from 'astro';

/** Indexable pages. Keep in sync when adding routes. */
const PAGES = ['/', '/generator/', '/docs/'];

export const GET: APIRoute = ({ site }) => {
  // Sitemap URLs must be absolute; without `site` configured, publish an empty sitemap.
  const urls = site
    ? PAGES.map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`).join('\n')
    : '';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
