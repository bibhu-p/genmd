/** Small helpers for composing Markdown safely from user-provided text. */

type Part = string | null | undefined | false;

/** Collapses all whitespace, including new lines, into single spaces. For one-line values. */
export function inline(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Prepares multi-line user text for use as a paragraph. Lines that Markdown
 * would read as headings or heading underlines are escaped so user text
 * cannot change the document structure.
 */
export function block(text: string): string {
  return text
    .replace(/\r\n?/g, '\n')
    .trim()
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.replace(/^(\s*)(#|-{2,}\s*$|={2,}\s*$)/, '$1\\$2'))
    .join('\n');
}

/** Removes a leading list marker the user may have typed, such as "- " or "1. ", including a bare marker. */
export function stripListMarker(text: string): string {
  return text.replace(/^([-*+]|\d+[.)])(\s+|$)/, '');
}

function present(parts: readonly Part[]): string[] {
  return parts.filter((part): part is string => typeof part === 'string' && part.length > 0);
}

/** Joins blocks with blank lines, skipping empty ones. */
export function joinBlocks(parts: readonly Part[]): string {
  return present(parts).join('\n\n');
}

export function bulletList(items: readonly Part[]): string {
  return present(items)
    .map((item) => `- ${item}`)
    .join('\n');
}

export function numberedList(items: readonly Part[]): string {
  return present(items)
    .map((item, index) => `${index + 1}. ${item}`)
    .join('\n');
}

export function checklist(items: readonly Part[]): string {
  return present(items)
    .map((item) => `- [ ] ${item}`)
    .join('\n');
}
