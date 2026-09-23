import type { FormState } from '../types/generator';
import { CODING_PREFERENCES } from './rules';

/** Returns a fresh default form state. A new object each call, so it is safe to mutate. */
export function createDefaultFormState(): FormState {
  return {
    projectName: '',
    description: '',
    goals: '',
    stage: 'new',
    targetUsers: '',
    constraints: '',

    projectType: '',
    projectTypeOther: '',
    language: '',
    languageOther: '',
    framework: '',
    frameworkOther: '',
    packageManager: '',
    packageManagerOther: '',
    database: '',
    databaseOther: '',
    styling: '',
    stylingOther: '',
    testingTools: [],
    testingToolsOther: '',

    codingPreferences: CODING_PREFERENCES.filter((pref) => pref.defaultSelected).map((pref) => pref.id),
    tsStrictness: 'strict',
    dependencyPolicy: 'minimal',
    accessibilityLevel: 'baseline',
    performanceNotes: '',

    permissions: {
      git: 'ask',
      packageManager: 'ask',
      destructiveOperations: 'ask',
      database: 'ask',
      deployment: 'ask',
    },

    verification: {
      includeTesting: true,
      includeTypeCheck: true,
      includeLint: true,
      includeBuild: true,
      requireDocUpdates: true,
      includeDefinitionOfDone: true,
    },

    customInstructions: '',
  };
}
