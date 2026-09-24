import type { FormState } from '../../../types/generator';

function control(form: HTMLFormElement, name: string): Element | RadioNodeList | null {
  return form.elements.namedItem(name);
}

/** Sets a select and fires `change`, so "Other" boxes and language filters update. */
function setSelect(form: HTMLFormElement, name: string, value: string): void {
  const select = control(form, name);
  if (!(select instanceof HTMLSelectElement)) return;
  select.value = value;
  select.dispatchEvent(new Event('change', { bubbles: true }));
}

function setText(form: HTMLFormElement, name: string, value: string): void {
  const field = control(form, name);
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.value = value;
}

/** Checks exactly the checkboxes or radio buttons named `name` whose value is in `values`. */
function setChecked(form: HTMLFormElement, name: string, values: readonly string[]): void {
  form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`).forEach((input) => {
    input.checked = values.includes(input.value);
  });
}

/**
 * Writes the fields a preset controls (steps 2, 3 and 5) into the form.
 * The language goes first: changing it re-filters the framework, package
 * manager and testing tool options, which must happen before those are set.
 */
export function fillPresetFields(form: HTMLFormElement, state: FormState): void {
  setSelect(form, 'language', state.language);
  setSelect(form, 'projectType', state.projectType);
  setSelect(form, 'framework', state.framework);
  setSelect(form, 'packageManager', state.packageManager);
  setSelect(form, 'database', state.database);
  setSelect(form, 'styling', state.styling);

  for (const name of ['projectType', 'language', 'framework', 'packageManager', 'database', 'styling'] as const) {
    setText(form, `${name}Other`, state[`${name}Other`]);
  }
  setChecked(form, 'testingTools', state.testingTools);
  setText(form, 'testingToolsOther', state.testingToolsOther);

  setChecked(form, 'codingPreferences', state.codingPreferences);
  setChecked(form, 'tsStrictness', [state.tsStrictness]);
  setChecked(form, 'dependencyPolicy', [state.dependencyPolicy]);
  setChecked(form, 'accessibilityLevel', [state.accessibilityLevel]);
  setText(form, 'performanceNotes', state.performanceNotes);

  const verification = Object.entries(state.verification)
    .filter(([, enabled]) => enabled)
    .map(([id]) => id);
  setChecked(form, 'verification', verification);
}
