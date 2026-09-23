import { errorIdFor } from '../field-ids';
import type { FieldError } from '../validation';

function controlsNamed(form: HTMLFormElement, name: string): HTMLElement[] {
  return Array.from(form.querySelectorAll<HTMLElement>(`[name="${CSS.escape(name)}"]`));
}

function setFieldError(form: HTMLFormElement, name: string, message: string): void {
  const messageElement = document.getElementById(errorIdFor(name));
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.hidden = false;
  }
  controlsNamed(form, name).forEach((control) => control.setAttribute('aria-invalid', 'true'));
}

export function clearFieldError(form: HTMLFormElement, name: string): void {
  const messageElement = document.getElementById(errorIdFor(name));
  if (messageElement) {
    // Emptied as well as hidden: aria-describedby can still read hidden text.
    messageElement.textContent = '';
    messageElement.hidden = true;
  }
  controlsNamed(form, name).forEach((control) => control.removeAttribute('aria-invalid'));
}

export function clearStepErrors(panel: HTMLElement): void {
  panel.querySelectorAll<HTMLElement>('[data-field-error]').forEach((message) => {
    message.textContent = '';
    message.hidden = true;
  });
  panel.querySelectorAll('[aria-invalid]').forEach((control) => control.removeAttribute('aria-invalid'));

  const summary = panel.querySelector<HTMLElement>('[data-error-summary]');
  if (summary) {
    summary.hidden = true;
    summary.replaceChildren();
  }
}

/**
 * Shows inline errors plus an error summary at the top of the step, then
 * moves focus to the summary so screen reader users hear what went wrong.
 * Each summary entry links to its field.
 */
export function showStepErrors(
  form: HTMLFormElement,
  panel: HTMLElement,
  errors: readonly FieldError[],
): void {
  clearStepErrors(panel);
  errors.forEach((error) => setFieldError(form, error.field, error.message));

  const summary = panel.querySelector<HTMLElement>('[data-error-summary]');
  const firstControl = errors[0] ? controlsNamed(form, errors[0].field)[0] : undefined;
  if (!summary) {
    firstControl?.focus();
    return;
  }

  const heading = document.createElement('h3');
  heading.className = 'font-semibold text-danger';
  heading.textContent =
    errors.length === 1 ? 'There is a problem on this step' : `There are ${errors.length} problems on this step`;

  const list = document.createElement('ul');
  list.className = 'mt-2 list-disc space-y-1 pl-5 text-sm';
  for (const error of errors) {
    const control = controlsNamed(form, error.field)[0];
    const link = document.createElement('a');
    link.href = control ? `#${control.id}` : '#';
    link.className = 'font-medium text-danger underline underline-offset-2';
    link.textContent = error.message;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      control?.focus();
    });
    const entry = document.createElement('li');
    entry.append(link);
    list.append(entry);
  }

  summary.append(heading, list);
  summary.hidden = false;
  summary.focus();
}
