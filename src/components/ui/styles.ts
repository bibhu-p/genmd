/** Shared class lists for form controls, so every field looks and behaves the same. */

export const labelClass = 'block text-sm font-semibold text-ink';

export const hintClass = 'mt-1 text-sm text-ink-muted';

export const errorClass = 'mt-2 text-sm font-medium text-danger';

// The marker text carries its own leading space, since Astro drops whitespace-only
// text between expressions. A real space keeps accessible names readable.
export const optionalMarkClass = 'font-normal text-ink-subtle';

const controlClass =
  'block w-full rounded-lg border border-line-strong bg-surface px-3.5 py-2.5 text-base text-ink shadow-xs transition-[border-color,box-shadow] placeholder:text-ink-subtle hover:border-ink-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 focus:outline-none aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/20';

export const inputClass = `mt-2 ${controlClass}`;

export const selectClass = `select-control ${controlClass} pr-10`;

export const choiceCardClass =
  'flex h-full cursor-pointer gap-3 rounded-xl border border-line bg-surface p-3.5 transition-colors hover:border-line-strong has-checked:border-brand-500 has-checked:bg-accent-soft has-[input:focus-visible]:ring-4 has-[input:focus-visible]:ring-brand-500/25';

export const choiceInputClass = 'choice-input';
