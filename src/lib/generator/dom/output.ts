import { downloadTextFile } from '../../download';

export interface OutputView {
  /** Regenerates the output unless the user has edited it; then flags it as out of date instead. */
  sync(): void;
}

export interface OutputOptions {
  filename: string;
  mimeType: string;
  generate: () => string;
  /** Returns a problem with the content, or null. Shown as a warning; copy and download still work. */
  check?: (content: string) => string | null;
}

type Tone = 'success' | 'error';
type Renderer = (source: string) => string;

/**
 * Wires up one editable output file: copy, download, regenerate and, when the
 * markup includes them, Edit/Preview tabs and a content warning. User edits
 * are never overwritten without confirmation.
 */
export function setupOutput(root: HTMLElement, options: OutputOptions): OutputView {
  const { filename, mimeType, generate, check } = options;
  const editor = root.querySelector<HTMLTextAreaElement>('[data-output-editor]');
  const preview = root.querySelector<HTMLElement>('[data-output-preview]');
  const status = root.querySelector<HTMLElement>('[data-output-status]');
  const staleNotice = root.querySelector<HTMLElement>('[data-stale-notice]');
  const warning = root.querySelector<HTMLElement>('[data-output-warning]');
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  if (!editor || !status || !staleNotice) return { sync: () => {} };

  let lastGenerated = '';
  let renderer: Renderer | null = null;

  const isEdited = () => editor.value !== lastGenerated;

  function announce(message: string, tone: Tone = 'success'): void {
    status!.textContent = message;
    status!.dataset.tone = tone;
  }

  function checkContent(): void {
    if (!check || !warning) return;
    const problem = editor!.value.trim() ? check(editor!.value) : null;
    warning.textContent = problem ?? '';
    warning.hidden = problem === null;
  }

  async function renderPreview(): Promise<void> {
    if (!preview) return;
    try {
      renderer ??= (await import('../markdown-preview')).renderMarkdown;
      // Safe: the renderer escapes raw HTML and rejects unsafe links.
      preview.innerHTML = renderer(editor!.value);
    } catch {
      preview.textContent = 'The preview could not be loaded. Check your connection and try again.';
    }
  }

  function apply(content: string): void {
    editor!.value = content;
    lastGenerated = content;
    staleNotice!.hidden = true;
    checkContent();
    if (preview && !preview.hidden) void renderPreview();
  }

  function sync(): void {
    const content = generate();
    if (!isEdited()) apply(content);
    else staleNotice!.hidden = content === lastGenerated;
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
    downloadTextFile(filename, editor!.value, mimeType);
    announce(`Downloaded ${filename}.`);
  }

  editor.addEventListener('input', checkContent);

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
