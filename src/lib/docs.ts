import { getCollection, type CollectionEntry } from 'astro:content';
import { sortDocs } from './docs-nav';

export type DocEntry = CollectionEntry<'docs'>;

/** All docs pages in reading order. */
export async function getSortedDocs(): Promise<DocEntry[]> {
  return sortDocs(await getCollection('docs'));
}
