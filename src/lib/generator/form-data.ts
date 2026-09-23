import { createDefaultFormState } from '../../data/defaults';
import { PROJECT_STAGES } from '../../data/project';
import {
  ACCESSIBILITY_OPTIONS,
  CODING_PREFERENCES,
  DEPENDENCY_POLICY_OPTIONS,
  PERMISSION_CATEGORIES,
  POLICY_OPTIONS,
  TS_STRICTNESS_OPTIONS,
} from '../../data/rules';
import type { FormState, SelectOption } from '../../types/generator';

/** Returns `value` if it is one of the option values, otherwise `fallback`. */
function pick<T extends string>(value: string, options: readonly SelectOption<T>[], fallback: T): T {
  return options.find((option) => option.value === value)?.value ?? fallback;
}

/**
 * Builds a `FormState` from the questionnaire's `FormData`. Text is kept as
 * entered; closed-set values that are missing or unknown fall back to the
 * defaults, so the result is always well-typed.
 */
export function formStateFromData(data: FormData): FormState {
  const defaults = createDefaultFormState();

  const text = (name: string): string => {
    const value = data.get(name);
    return typeof value === 'string' ? value : '';
  };
  const list = (name: string): string[] =>
    data.getAll(name).filter((value): value is string => typeof value === 'string');

  const selectedPreferences = list('codingPreferences');
  const verification = list('verification');

  const permissions = { ...defaults.permissions };
  for (const category of PERMISSION_CATEGORIES) {
    permissions[category.id] = pick(
      text(`permissions.${category.id}`),
      POLICY_OPTIONS,
      defaults.permissions[category.id],
    );
  }

  return {
    projectName: text('projectName'),
    description: text('description'),
    goals: text('goals'),
    stage: pick(text('stage'), PROJECT_STAGES, defaults.stage),
    targetUsers: text('targetUsers'),
    constraints: text('constraints'),

    projectType: text('projectType'),
    projectTypeOther: text('projectTypeOther'),
    language: text('language'),
    languageOther: text('languageOther'),
    framework: text('framework'),
    frameworkOther: text('frameworkOther'),
    packageManager: text('packageManager'),
    packageManagerOther: text('packageManagerOther'),
    database: text('database'),
    databaseOther: text('databaseOther'),
    styling: text('styling'),
    stylingOther: text('stylingOther'),
    testingTools: list('testingTools'),
    testingToolsOther: text('testingToolsOther'),

    codingPreferences: CODING_PREFERENCES.filter((pref) => selectedPreferences.includes(pref.id)).map(
      (pref) => pref.id,
    ),
    tsStrictness: pick(text('tsStrictness'), TS_STRICTNESS_OPTIONS, defaults.tsStrictness),
    dependencyPolicy: pick(text('dependencyPolicy'), DEPENDENCY_POLICY_OPTIONS, defaults.dependencyPolicy),
    accessibilityLevel: pick(text('accessibilityLevel'), ACCESSIBILITY_OPTIONS, defaults.accessibilityLevel),
    performanceNotes: text('performanceNotes'),

    permissions,

    verification: {
      includeTesting: verification.includes('includeTesting'),
      includeTypeCheck: verification.includes('includeTypeCheck'),
      includeLint: verification.includes('includeLint'),
      includeBuild: verification.includes('includeBuild'),
      requireDocUpdates: verification.includes('requireDocUpdates'),
      includeDefinitionOfDone: verification.includes('includeDefinitionOfDone'),
    },

    customInstructions: text('customInstructions'),
  };
}
