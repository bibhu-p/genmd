import { describe, expect, it } from 'vitest';
import { docHref, groupBySection, neighbours, sortDocs, type DocLike } from '../src/lib/docs-nav';

function doc(id: string, section: DocLike['data']['section'], order: number): DocLike {
  return { id, data: { title: id, section, order } };
}

const unsorted = [
  doc('hooks', 'configuration', 2),
  doc('using-genmd-studio', 'start', 2),
  doc('permissions', 'configuration', 1),
  doc('index', 'start', 1),
  doc('claude-md', 'instructions', 1),
];

describe('docs navigation', () => {
  it('builds URLs, with the index at /docs/', () => {
    expect(docHref('index')).toBe('/docs/');
    expect(docHref('rules/design-guide')).toBe('/docs/rules/design-guide/');
  });

  it('sorts by section order, then page order', () => {
    expect(sortDocs(unsorted).map((entry) => entry.id)).toEqual([
      'index',
      'using-genmd-studio',
      'claude-md',
      'permissions',
      'hooks',
    ]);
  });

  it('groups by section and skips empty sections', () => {
    const groups = groupBySection(sortDocs(unsorted));
    expect(groups.map((group) => group.label)).toEqual(['Start here', 'Instructions', 'Configuration']);
    expect(groups[2]?.entries.map((entry) => entry.id)).toEqual(['permissions', 'hooks']);
  });

  it('finds previous and next pages across sections', () => {
    const sorted = sortDocs(unsorted);
    expect(neighbours(sorted, 'claude-md')).toEqual({ previous: sorted[1], next: sorted[3] });
    expect(neighbours(sorted, 'index').previous).toBeUndefined();
    expect(neighbours(sorted, 'hooks').next).toBeUndefined();
    expect(neighbours(sorted, 'missing')).toEqual({});
  });
});
