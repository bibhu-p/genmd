import { downloadTextFile } from '../../download';

export interface OutputView {
  /** Regenerates the output unless the user has edited it; then flags it as out of date instead. */
  sync(): void;
}

type Tone = 'success' | 'error';
type Renderer = (source: string) => string;

const FILENAME = 'CLAUDE.md';

/**
 * Wires up the editable output: Edit/Preview tabs, copy, download and
 * regenerate. User edits are never overwritten without confirmation.
 */
export function setupOutput(root: HTMLElement, generate: () => string): OutputView {
  const editor = root.querySelector<HTMLTextAreaElement>('[data-output-editor]');
  const preview = root.querySelector<HTMLElement>('[data-output-preview]');
  const status = root.querySelector<HTMLElement>('[data-output-status]');
  const staleNotice = root.querySelector<HTMLElement>('[data-stale-notice]');
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  if (!editor || !preview || !status || !staleNotice) return { sync: () => {} };

  let lastGenerated = '';
  let renderer: Renderer | null = null;

  const isEdited = () => editor.value !== lastGenerated;

  function announce(message: string, tone: Tone = 'success'): void {
    status!.textContent = message;
    status!.dataset.tone = tone;
  }

  async function renderPreview(): Promise<void> {
    try {
      renderer ??= (await import('../markdown-preview')).renderMarkdown;
      // Safe: the renderer escapes raw HTML and rejects unsafe links.
      preview!.innerHTML = renderer(editor!.value);
    } catch {
      preview!.textContent = 'The preview could not be loaded. Check your connection and try again.';
    }
  }

  function apply(markdown: string): void {
    editor!.value = markdown;
    lastGenerated = markdown;
    staleNotice!.hidden = true;
    if (!preview!.hidden) void renderPreview();
  }

  function sync(): void {
    const markdown = generate();
    if (!isEdited()) apply(markdown);
    else staleNotice!.hidden = markdown === lastGenerated;
  }

  function regenerate(): void {
    if (isEdited() && !window.confirm('Regenerating replaces the edits you made to the file. Continue?')) return;
    apply(generate());
    announce('Regenerated from your answers.');
  }

  function selectTab(name: string, moveFocus = false): void {
    for (const tab of tabs) {
      const selected = tab.dataset.tab === name;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');
      if (panel) panel.hidden = !selected;
      if (selected && moveFocus) tab.focus();
    }
    if (name === 'preview') void renderPreview();
  }

  async function copy(): Promise<void> {
    if (!editor!.value.trim()) {
      announce('There is nothing to copy yet.', 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(editor!.value);
      announce('Copied to clipboard.');
    } catch {
      selectTab('edit');
      editor!.focus();
      editor!.select();
      announce('Could not copy automatically. The text is selected: press Ctrl+C (or Cmd+C on a Mac).', 'error');
    }
  }

  function download(): void {
    if (!editor!.value.trim()) {
      announce('There is nothing to download yet.', 'error');
      return;
    }
    downloadTextFile(FILENAME, editor!.value);
    announce(`Downloaded ${FILENAME}.`);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab.dataset.tab ?? 'edit'));
    tab.addEventListener('keydown', (event) => {
      const last = tabs.length - 1;
      const target =
        event.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
        : event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
        : event.key === 'Home' ? 0
        : event.key === 'End' ? last
        : -1;
      if (target < 0) return;
      event.preventDefault();
      selectTab(tabs[target]?.dataset.tab ?? 'edit', true);
    });
  });

  root.addEventListener('click', (event) => {
    const trigger = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-output-action]') : null;
    switch (trigger?.dataset.outputAction) {
      case 'copy':
        void copy();
        break;
      case 'download':
        download();
        break;
      case 'regenerate':
        regenerate();
        break;
    }
  });

  return { sync };
}
