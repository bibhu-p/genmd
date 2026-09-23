/**
 * Ordering and navigation helpers for the docs. Kept free of `astro:content`
 * imports so they can be unit-tested.
 */
import { DOC_SECTION_IDS, DOC_SECTION_LABELS, type DocSectionId } from '../data/docs-sections';

/** The minimal shape of a docs entry these helpers need. */
export interface DocLike {
  id: string;
  data: { title: string; section: DocSectionId; order: number };
}

export interface DocGroup<T extends DocLike> {
  id: DocSectionId;
  label: string;
  entries: T[];
}

/** The id of the docs landing page (src/content/docs/index.md). */
export const DOCS_INDEX_ID = 'index';

export function docHref(id: string): string {
  return id === DOCS_INDEX_ID ? '/docs/' : `/docs/${id}/`;
}

/** Sorts by section order, then `order`, then id, so the result is stable. */
export function sortDocs<T extends DocLike>(entries: readonly T[]): T[] {
  return [...entries].sort(
    (a, b) =>
      DOC_SECTION_IDS.indexOf(a.data.section) - DOC_SECTION_IDS.indexOf(b.data.section) ||
      a.data.order - b.data.order ||
      a.id.localeCompare(b.id),
  );
}

/** Groups sorted entries by section, skipping empty sections. */
export function groupBySection<T extends DocLike>(sorted: readonly T[]): DocGroup<T>[] {
  return DOC_SECTION_IDS.map((id) => ({
    id,
    label: DOC_SECTION_LABELS[id],
    entries: sorted.filter((entry) => entry.data.section === id),
  })).filter((group) => group.entries.length > 0);
}

/** Previous and next pages in reading order. */
export function neighbours<T extends DocLike>(sorted: readonly T[], id: string): { previous?: T; next?: T } {
  const index = sorted.findIndex((entry) => entry.id === id);
  if (index < 0) return {};
  return { previous: sorted[index - 1], next: sorted[index + 1] };
}
