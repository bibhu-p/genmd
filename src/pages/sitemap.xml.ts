import type { APIRoute } from 'astro';
import { docHref } from '../lib/docs-nav';
import { getSortedDocs } from '../lib/docs';

/** Indexable pages outside the docs collection. Keep in sync when adding routes. */
const PAGES = ['/', '/generator/'];

export const GET: APIRoute = async ({ site }) => {
  // Docs pages are added automatically from the content collection.
  const docs = await getSortedDocs();
  const paths = [...PAGES, ...docs.map((entry) => docHref(entry.id))];

  // Sitemap URLs must be absolute; without `site` configured, publish an empty sitemap.
  const urls = site
    ? paths.map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`).join('\n')
    : '';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
