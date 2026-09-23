import {
  DATABASES,
  FRAMEWORKS,
  LANGUAGES,
  PACKAGE_MANAGERS,
  PROJECT_TYPES,
  STYLING_OPTIONS,
  TESTING_TOOLS,
} from '../../data/frameworks';
import { PROJECT_STAGES } from '../../data/project';
import {
  ACCESSIBILITY_OPTIONS,
  CODING_PREFERENCES,
  DEPENDENCY_POLICY_OPTIONS,
  PERMISSION_CATEGORIES,
  POLICY_OPTIONS,
  TS_STRICTNESS_OPTIONS,
  VERIFICATION_OPTIONS,
} from '../../data/rules';
import { STEPS } from '../../data/steps';
import type { FormState, StepId } from '../../types/generator';
import { displayChoice, labelOf, splitLines, splitList } from './options';

export interface SummaryItem {
  label: string;
  value: string;
  /** True when the user left this blank; `value` then holds a placeholder. */
  isEmpty: boolean;
}

export interface SummaryGroup {
  step: StepId;
  title: string;
  items: SummaryItem[];
}

export const NOT_SPECIFIED = 'Not specified';

function item(label: string, value: string | undefined): SummaryItem {
  const trimmed = value?.trim();
  return trimmed ? { label, value: trimmed, isEmpty: false } : { label, value: NOT_SPECIFIED, isEmpty: true };
}

function group(step: StepId, items: SummaryItem[]): SummaryGroup {
  const title = STEPS.find((definition) => definition.id === step)?.title ?? step;
  return { step, title, items };
}

/** A read-only overview of the answers, grouped by step, for the review screen. */
export function summarize(state: FormState): SummaryGroup[] {
  const testingTools = [
    ...TESTING_TOOLS.filter((tool) => state.testingTools.includes(tool.value)).map((tool) => tool.label),
    ...splitList(state.testingToolsOther),
  ];

  const codingPreferences = CODING_PREFERENCES.filter((pref) =>
    state.codingPreferences.includes(pref.id),
  ).map((pref) => pref.label);

  const included = VERIFICATION_OPTIONS.filter((option) => state.verification[option.id]);
  const leftOut = VERIFICATION_OPTIONS.filter((option) => !state.verification[option.id]);

  return [
    group('basics', [
      item('Project name', state.projectName),
      item('Description', state.description),
      item('Goals', splitLines(state.goals).join('\n')),
      item('Stage', labelOf(PROJECT_STAGES, state.stage)),
      item('Target users', state.targetUsers),
      item('Special constraints', state.constraints),
    ]),
    group('stack', [
      item('Project type', displayChoice(PROJECT_TYPES, state.projectType, state.projectTypeOther)),
      item('Language', displayChoice(LANGUAGES, state.language, state.languageOther)),
      item('Framework', displayChoice(FRAMEWORKS, state.framework, state.frameworkOther)),
      item('Package manager', displayChoice(PACKAGE_MANAGERS, state.packageManager, state.packageManagerOther)),
      item('Database', displayChoice(DATABASES, state.database, state.databaseOther)),
      item('Styling', displayChoice(STYLING_OPTIONS, state.styling, state.stylingOther)),
      item('Testing tools', testingTools.join(', ')),
    ]),
    group('preferences', [
      item('Coding standards', codingPreferences.join(', ')),
      ...(state.language === 'typescript'
        ? [item('TypeScript strictness', labelOf(TS_STRICTNESS_OPTIONS, state.tsStrictness))]
        : []),
      item('Dependencies', labelOf(DEPENDENCY_POLICY_OPTIONS, state.dependencyPolicy)),
      item('Accessibility', labelOf(ACCESSIBILITY_OPTIONS, state.accessibilityLevel)),
      item('Performance notes', state.performanceNotes),
    ]),
    group(
      'permissions',
      PERMISSION_CATEGORIES.map((category) =>
        item(category.label, labelOf(POLICY_OPTIONS, state.permissions[category.id])),
      ),
    ),
    group('verification', [
      item('Included', included.map((option) => option.label).join(', ')),
      item('Left out', leftOut.map((option) => option.label).join(', ')),
    ]),
  ];
}
