import { createDefaultFormState } from '../../data/defaults';
import type { FormState, Preset } from '../../types/generator';

/**
 * Everything a preset replaces: steps 2, 3 and 5, including the free-text
 * fields. Project basics, permissions and custom instructions are kept.
 */
const PRESET_FIELDS = [
  'projectType',
  'projectTypeOther',
  'language',
  'languageOther',
  'framework',
  'frameworkOther',
  'packageManager',
  'packageManagerOther',
  'database',
  'databaseOther',
  'styling',
  'stylingOther',
  'testingTools',
  'testingToolsOther',
  'codingPreferences',
  'tsStrictness',
  'dependencyPolicy',
  'accessibilityLevel',
  'performanceNotes',
  'verification',
] as const satisfies readonly (keyof FormState)[];

function copyField<K extends keyof FormState>(target: FormState, source: FormState, key: K): void {
  target[key] = source[key];
}

/** Returns `state` with every field a preset controls set back to its default. */
function resetPresetFields(state: FormState): FormState {
  const defaults = createDefaultFormState();
  const next = { ...state };
  for (const field of PRESET_FIELDS) copyField(next, defaults, field);
  return next;
}

/** Applies a preset on top of the defaults for the fields it controls, keeping everything else. */
export function applyPreset(state: FormState, preset: Preset): FormState {
  return { ...resetPresetFields(state), ...structuredClone(preset.values) };
}

/** True when both states agree on every field a preset controls. */
export function samePresetFields(a: FormState, b: FormState): boolean {
  return PRESET_FIELDS.every((field) => JSON.stringify(a[field]) === JSON.stringify(b[field]));
}

/**
 * True when applying a preset would discard choices the user made: the preset
 * fields differ from the defaults and from the last preset applied, if any.
 */
export function wouldOverwriteChoices(state: FormState, lastApplied?: FormState): boolean {
  if (samePresetFields(state, resetPresetFields(state))) return false;
  return !lastApplied || !samePresetFields(state, lastApplied);
}
