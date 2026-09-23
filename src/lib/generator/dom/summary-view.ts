import type { SummaryGroup } from '../summary';

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderGroup(group: SummaryGroup): HTMLElement {
  const section = element('section', 'rounded-lg border border-line p-4 sm:p-5');

  const header = element('div', 'flex items-center justify-between gap-4');
  const edit = element(
    'button',
    'rounded-md px-2 py-1 text-sm font-medium text-accent underline underline-offset-2 hover:bg-accent-soft',
    'Edit',
  );
  edit.type = 'button';
  edit.dataset.stepTarget = group.step;
  edit.append(element('span', 'sr-only', ` ${group.title}`));
  header.append(element('h3', 'font-semibold', group.title), edit);

  const list = element('dl', 'mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[11rem_1fr]');
  for (const item of group.items) {
    list.append(
      element('dt', 'font-medium text-ink-muted', item.label),
      element(
        'dd',
        item.isEmpty ? 'text-ink-subtle italic' : 'break-words whitespace-pre-line text-ink',
        item.value,
      ),
    );
  }

  section.append(header, list);
  return section;
}

/** Renders the review summary. All user text is set via textContent, never as HTML. */
export function renderSummary(container: HTMLElement, groups: readonly SummaryGroup[]): void {
  container.replaceChildren(...groups.map(renderGroup));
}
