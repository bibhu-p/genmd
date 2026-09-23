/** Sidebar groups for the docs, in display order. */
export const DOC_SECTION_IDS = ['start', 'instructions', 'rules', 'configuration', 'reference'] as const;

export type DocSectionId = (typeof DOC_SECTION_IDS)[number];

export const DOC_SECTION_LABELS: Record<DocSectionId, string> = {
  start: 'Start here',
  instructions: 'Instructions',
  rules: 'Rule file guides',
  configuration: 'Configuration',
  reference: 'Reference',
};
