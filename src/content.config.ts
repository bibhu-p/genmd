import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { DOC_SECTION_IDS } from './data/docs-sections';

/**
 * Documentation pages, written in Markdown under src/content/docs/.
 * The entry id comes from the file path: `rules/design-guide.md` becomes
 * `rules/design-guide`, served at /docs/rules/design-guide/.
 */
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    /** Used for the meta description and the page intro; keep it under ~160 characters. */
    description: z.string().max(170),
    section: z.enum(DOC_SECTION_IDS),
    /** Position within the section. */
    order: z.number(),
    /** Official pages the content was checked against. */
    sources: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    /** When the content was last checked against the sources (YYYY-MM-DD). */
    lastVerified: z.coerce.date().optional(),
  }),
});

export const collections = { docs };
