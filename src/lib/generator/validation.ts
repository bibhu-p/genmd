import { OTHER_VALUE } from '../../data/frameworks';
import type { FormState, StepId } from '../../types/generator';
import { stripListMarker } from './markdown';
import { splitLines } from './options';

export interface FieldError {
  /** The form control name the error belongs to. */
  field: string;
  message: string;
}

export const MAX_LENGTH = {
  projectName: 100,
  description: 1000,
  shortText: 300,
  longText: 2000,
  customInstructions: 10000,
} as const;

/** Keys of `FormState` whose values are plain strings. */
type TextField = {
  [K in keyof FormState]: FormState[K] extends string ? K : never;
}[keyof FormState];

interface TextRule {
  label: string;
  max: number;
  /** Message shown when the field is blank. Omit for optional fields. */
  requiredMessage?: string;
}

function checkText(state: FormState, field: TextField, rule: TextRule): FieldError | null {
  const value = state[field].trim();
  if (!value) {
    return rule.requiredMessage ? { field, message: rule.requiredMessage } : null;
  }
  if (value.length > rule.max) {
    return { field, message: `${rule.label} must be ${rule.max} characters or fewer.` };
  }
  return null;
}

/** Select fields with an "Other" option, paired with their free-text field. */
const OTHER_FIELDS: readonly { select: TextField; other: TextField; label: string }[] = [
  { select: 'projectType', other: 'projectTypeOther', label: 'Project type' },
  { select: 'language', other: 'languageOther', label: 'Language' },
  { select: 'framework', other: 'frameworkOther', label: 'Framework' },
  { select: 'packageManager', other: 'packageManagerOther', label: 'Package manager' },
  { select: 'database', other: 'databaseOther', label: 'Database' },
  { select: 'styling', other: 'stylingOther', label: 'Styling' },
];

function validateBasics(state: FormState): (FieldError | null)[] {
  // Count goals the same way the generator does, so a line with only "-" is not a goal.
  const goals = splitLines(state.goals).map(stripListMarker).filter((goal) => goal.trim());
  const goalsError: FieldError | null =
    goals.length === 0 ? { field: 'goals', message: 'Add at least one goal.' } : null;

  return [
    checkText(state, 'projectName', {
      label: 'Project name',
      max: MAX_LENGTH.projectName,
      requiredMessage: 'Enter a project name.',
    }),
    checkText(state, 'description', {
      label: 'Description',
      max: MAX_LENGTH.description,
      requiredMessage: 'Describe the project in a sentence or two.',
    }),
    goalsError ?? checkText(state, 'goals', { label: 'Goals', max: MAX_LENGTH.longText }),
    checkText(state, 'targetUsers', { label: 'Target users', max: MAX_LENGTH.shortText }),
    checkText(state, 'constraints', { label: 'Special constraints', max: MAX_LENGTH.longText }),
  ];
}

function validateStack(state: FormState): (FieldError | null)[] {
  const projectTypeError: FieldError | null = state.projectType
    ? null
    : { field: 'projectType', message: 'Choose a project type.' };

  const otherErrors = OTHER_FIELDS.map(({ select, other, label }) =>
    state[select] === OTHER_VALUE
      ? checkText(state, other, {
          label,
          max: MAX_LENGTH.shortText,
          requiredMessage: `Enter the ${label.toLowerCase()}, or choose one from the list.`,
        })
      : null,
  );

  return [
    projectTypeError,
    ...otherErrors,
    checkText(state, 'testingToolsOther', { label: 'Other testing tools', max: MAX_LENGTH.shortText }),
  ];
}

const STEP_VALIDATORS: Record<StepId, (state: FormState) => (FieldError | null)[]> = {
  basics: validateBasics,
  stack: validateStack,
  preferences: (state) => [
    checkText(state, 'performanceNotes', { label: 'Performance notes', max: MAX_LENGTH.longText }),
  ],
  // Radio groups and checkboxes always hold valid values once parsed.
  permissions: () => [],
  verification: () => [],
  review: (state) => [
    checkText(state, 'customInstructions', {
      label: 'Custom instructions',
      max: MAX_LENGTH.customInstructions,
    }),
  ],
};

/** Validates one questionnaire step. Returns an empty array when the step is valid. */
export function validateStep(step: StepId, state: FormState): FieldError[] {
  return STEP_VALIDATORS[step](state).filter((error): error is FieldError => error !== null);
}
