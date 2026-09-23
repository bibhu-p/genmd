import { describe, expect, it } from 'vitest';
import { createDefaultFormState } from '../src/data/defaults';
import { formStateFromData } from '../src/lib/generator/form-data';

function formData(entries: [string, string][]): FormData {
  const data = new FormData();
  for (const [name, value] of entries) data.append(name, value);
  return data;
}

describe('formStateFromData', () => {
  it('reads text, multi-value and nested permission fields', () => {
    const state = formStateFromData(
      formData([
        ['projectName', 'Acme'],
        ['stage', 'existing'],
        ['framework', 'other'],
        ['frameworkOther', 'Qwik'],
        ['testingTools', 'vitest'],
        ['testingTools', 'playwright'],
        ['codingPreferences', 'simple-solutions'],
        ['permissions.git', 'prohibit'],
        ['permissions.deployment', 'allow'],
        ['verification', 'includeTesting'],
      ]),
    );

    expect(state.projectName).toBe('Acme');
    expect(state.stage).toBe('existing');
    expect(state.framework).toBe('other');
    expect(state.frameworkOther).toBe('Qwik');
    expect(state.testingTools).toEqual(['vitest', 'playwright']);
    expect(state.codingPreferences).toEqual(['simple-solutions']);
    expect(state.permissions.git).toBe('prohibit');
    expect(state.permissions.deployment).toBe('allow');
    expect(state.permissions.packageManager).toBe('ask');
  });

  it('treats unchecked verification boxes as false', () => {
    const state = formStateFromData(formData([['verification', 'includeLint']]));
    expect(state.verification).toEqual({
      includeTesting: false,
      includeTypeCheck: false,
      includeLint: true,
      includeBuild: false,
      requireDocUpdates: false,
      includeDefinitionOfDone: false,
    });
  });

  it('falls back to defaults for unknown closed-set values', () => {
    const defaults = createDefaultFormState();
    const state = formStateFromData(
      formData([
        ['stage', 'bogus'],
        ['tsStrictness', 'loose'],
        ['permissions.git', 'maybe'],
        ['codingPreferences', 'not-a-preference'],
      ]),
    );

    expect(state.stage).toBe(defaults.stage);
    expect(state.tsStrictness).toBe(defaults.tsStrictness);
    expect(state.permissions.git).toBe(defaults.permissions.git);
    expect(state.codingPreferences).toEqual([]);
  });

  it('returns empty strings for missing text fields', () => {
    const state = formStateFromData(new FormData());
    expect(state.projectName).toBe('');
    expect(state.customInstructions).toBe('');
  });
});
