import { describe, expect, it } from 'vitest';
import { createDefaultFormState } from '../src/data/defaults';
import {
  DATABASES,
  FRAMEWORKS,
  LANGUAGES,
  OTHER_VALUE,
  optionsForLanguage,
  PACKAGE_MANAGERS,
  PROJECT_TYPES,
  STYLING_OPTIONS,
  TESTING_TOOLS,
} from '../src/data/frameworks';
import { findPreset, PRESETS } from '../src/data/presets';
import { CODING_PREFERENCES } from '../src/data/rules';
import { createSampleFormState } from '../src/data/sample';
import { generateClaudeMd } from '../src/lib/generator/generate';
import { normalize } from '../src/lib/generator/normalize';
import { applyPreset, samePresetFields, wouldOverwriteChoices } from '../src/lib/generator/presets';
import { checkSettingsJson, generateSettingsJson } from '../src/lib/generator/settings';
import { validateStep } from '../src/lib/generator/validation';
import type { FormState, SelectOption } from '../src/types/generator';

const values = (options: readonly SelectOption[]) => options.map((option) => option.value);

/** True when `list` follows the same order as `reference`. */
function inOrder(list: readonly string[], reference: readonly string[]): boolean {
  const positions = list.map((item) => reference.indexOf(item));
  return positions.every((position, index) => index === 0 || position > positions[index - 1]);
}

const presetCases = PRESETS.map((preset) => [preset.id, preset] as const);

const basics: Partial<FormState> = {
  projectName: 'Acme',
  description: 'An internal tool.',
  goals: 'Ship it',
};

describe('PRESETS: data', () => {
  it('has unique, URL-safe ids', () => {
    const ids = PRESETS.map((preset) => preset.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it.each(presetCases)('%s uses real options that fit its language', (_, preset) => {
    const { values: v } = preset;
    const language = v.language ?? '';

    expect(values(PROJECT_TYPES)).toContain(v.projectType);
    expect(values(LANGUAGES)).toContain(language);
    expect(values(optionsForLanguage(FRAMEWORKS, language))).toContain(v.framework);
    expect(values(optionsForLanguage(PACKAGE_MANAGERS, language))).toContain(v.packageManager);
    expect(values(DATABASES)).toContain(v.database);
    expect(values(STYLING_OPTIONS)).toContain(v.styling);

    const tools = v.testingTools ?? [];
    expect(values(optionsForLanguage(TESTING_TOOLS, language))).toEqual(expect.arrayContaining(tools));
    // The form reports checked boxes in DOM order, so presets must match it.
    expect(inOrder(tools, values(TESTING_TOOLS))).toBe(true);
    expect(inOrder(v.codingPreferences ?? [], CODING_PREFERENCES.map((pref) => pref.id))).toBe(true);

    expect(Object.values(v)).not.toContain(OTHER_VALUE);
  });
});

describe('findPreset', () => {
  it('finds a preset by id', () => {
    expect(findPreset('rust-cli')?.label).toBe('Rust command-line tool');
  });

  it('returns undefined for an unknown id', () => {
    expect(findPreset('cobol-mainframe')).toBeUndefined();
  });
});

describe('applyPreset', () => {
  const nextjs = findPreset('nextjs-fullstack')!;

  it('keeps project basics, permissions and custom instructions', () => {
    const state = { ...createSampleFormState(), customInstructions: 'Use British English.' };
    const applied = applyPreset(state, findPreset('go-api')!);
    expect(applied.projectName).toBe(state.projectName);
    expect(applied.goals).toBe(state.goals);
    expect(applied.permissions).toEqual(state.permissions);
    expect(applied.customInstructions).toBe('Use British English.');
  });

  it('sets the preset values', () => {
    const applied = applyPreset(createDefaultFormState(), nextjs);
    expect(applied).toMatchObject(nextjs.values);
  });

  it('resets fields the preset leaves out, including "Other" text', () => {
    const state: FormState = {
      ...createDefaultFormState(),
      framework: OTHER_VALUE,
      frameworkOther: 'Remix',
      performanceNotes: 'Keep bundles small.',
      verification: { ...createDefaultFormState().verification, includeLint: false },
    };
    const applied = applyPreset(state, nextjs);
    expect(applied.frameworkOther).toBe('');
    expect(applied.performanceNotes).toBe('');
    expect(applied.verification.includeLint).toBe(true);
  });

  it('does not share arrays with the preset', () => {
    const applied = applyPreset(createDefaultFormState(), nextjs);
    applied.testingTools.push('jest');
    expect(nextjs.values.testingTools).toEqual(['vitest', 'playwright']);
  });

  it.each(presetCases)('%s passes stack validation and generates both files', (_, preset) => {
    const state = applyPreset({ ...createDefaultFormState(), ...basics }, preset);
    expect(validateStep('stack', state)).toEqual([]);

    const config = normalize(state);
    expect(generateClaudeMd(config)).toContain(config.stack.framework ?? config.stack.language ?? '');
    expect(checkSettingsJson(generateSettingsJson(config))).toBeNull();
  });
});

describe('wouldOverwriteChoices', () => {
  const astro = findPreset('astro-static')!;
  const rust = findPreset('rust-cli')!;

  it('is false for the defaults', () => {
    expect(wouldOverwriteChoices(createDefaultFormState())).toBe(false);
  });

  it('ignores changes outside the preset fields', () => {
    expect(wouldOverwriteChoices({ ...createDefaultFormState(), ...basics })).toBe(false);
  });

  it('is true once the user changes a preset field', () => {
    expect(wouldOverwriteChoices({ ...createDefaultFormState(), styling: 'sass' })).toBe(true);
  });

  it('is false when switching between presets without editing', () => {
    const applied = applyPreset(createDefaultFormState(), astro);
    expect(wouldOverwriteChoices(applied, applied)).toBe(false);
    expect(samePresetFields(applyPreset(applied, rust), applyPreset(createDefaultFormState(), rust))).toBe(true);
  });

  it('is true after editing an applied preset', () => {
    const applied = applyPreset(createDefaultFormState(), astro);
    expect(wouldOverwriteChoices({ ...applied, packageManager: 'pnpm' }, applied)).toBe(true);
  });
});
