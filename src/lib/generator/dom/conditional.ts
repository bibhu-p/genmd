import { OTHER_VALUE } from '../../../data/frameworks';

/** Space-separated language values in `data-languages`; empty means any language. */
function matchesLanguage(languages: string | undefined, language: string): boolean {
  if (!languages || !language || language === OTHER_VALUE) return true;
  return languages.split(' ').includes(language);
}

/** Shows each "Other" text box only while its select has "Other" chosen. */
function setupOtherToggles(form: HTMLFormElement): void {
  form.querySelectorAll<HTMLSelectElement>('select[data-other-target]').forEach((select) => {
    const target = document.getElementById(select.dataset.otherTarget ?? '');
    if (!target) return;
    const sync = () => {
      target.hidden = select.value !== OTHER_VALUE;
    };
    select.addEventListener('change', sync);
    sync();
  });
}

/**
 * Filters language-specific options (frameworks, package managers, testing
 * tools) and shows language-only sections such as TypeScript strictness.
 */
function setupLanguageFilters(form: HTMLFormElement): void {
  const languageSelect = form.querySelector<HTMLSelectElement>('select[name="language"]');
  if (!languageSelect) return;

  // Keep every original option so filtering can be reversed.
  const filteredSelects = Array.from(
    form.querySelectorAll<HTMLSelectElement>('select[data-filter-by-language]'),
  ).map((select) => ({ select, allOptions: Array.from(select.options) }));

  const apply = () => {
    const language = languageSelect.value;

    for (const { select, allOptions } of filteredSelects) {
      const previous = select.value;
      const visible = allOptions.filter((option) => matchesLanguage(option.dataset.languages, language));
      select.replaceChildren(...visible);
      select.value = visible.some((option) => option.value === previous) ? previous : '';
      if (select.value !== previous) select.dispatchEvent(new Event('change', { bubbles: true }));
    }

    form
      .querySelectorAll<HTMLElement>('fieldset[data-filter-by-language] [data-languages]')
      .forEach((entry) => {
        const matches = matchesLanguage(entry.dataset.languages, language);
        entry.hidden = !matches;
        // Do not leave invisible selections behind.
        if (!matches) entry.querySelectorAll('input').forEach((input) => (input.checked = false));
      });

    form.querySelectorAll<HTMLElement>('[data-show-when-language]').forEach((section) => {
      section.hidden = section.dataset.showWhenLanguage !== language;
    });
  };

  languageSelect.addEventListener('change', apply);
  apply();
}

export function setupConditionalFields(form: HTMLFormElement): void {
  setupOtherToggles(form);
  setupLanguageFilters(form);
}
