import type {
  AccessibilityLevel,
  CodingPreferenceId,
  DependencyPolicy,
  PermissionCategory,
  PermissionPolicy,
  SelectOption,
  TsStrictness,
  VerificationPreferences,
} from '../types/generator';

export interface CodingPreference {
  id: CodingPreferenceId;
  label: string;
  description: string;
  defaultSelected: boolean;
}

export const CODING_PREFERENCES: readonly CodingPreference[] = [
  {
    id: 'clean-code',
    label: 'Clean, maintainable code',
    description: 'Favour readability and maintainability over cleverness.',
    defaultSelected: true,
  },
  {
    id: 'simple-solutions',
    label: 'Simple solutions first',
    description: 'Avoid abstractions until they are clearly needed.',
    defaultSelected: true,
  },
  {
    id: 'small-changes',
    label: 'Small, focused changes',
    description: 'Keep each change reviewable and avoid unrelated refactoring.',
    defaultSelected: true,
  },
  {
    id: 'follow-conventions',
    label: 'Follow existing conventions',
    description: 'Match the naming, structure and idioms already in the codebase.',
    defaultSelected: true,
  },
  {
    id: 'descriptive-naming',
    label: 'Descriptive naming',
    description: 'Use clear names for variables, functions and files.',
    defaultSelected: false,
  },
  {
    id: 'component-organization',
    label: 'Organised components',
    description: 'Keep components small and grouped by feature or responsibility.',
    defaultSelected: false,
  },
  {
    id: 'explicit-error-handling',
    label: 'Explicit error handling',
    description: 'Handle failures deliberately and surface useful messages.',
    defaultSelected: true,
  },
  {
    id: 'performance-aware',
    label: 'Performance-aware',
    description: 'Avoid unnecessary work, dependencies and client-side code.',
    defaultSelected: false,
  },
];

/** Only shown when the language is TypeScript; otherwise the config resolves to "not-applicable". */
export const TS_STRICTNESS_OPTIONS: readonly SelectOption<TsStrictness>[] = [
  { value: 'strict', label: 'Strict', description: 'Strict mode, no `any`, no unsafe assertions.' },
  { value: 'standard', label: 'Standard', description: 'Typed code, with `any` allowed when documented.' },
];

export const DEPENDENCY_POLICY_OPTIONS: readonly SelectOption<DependencyPolicy>[] = [
  {
    value: 'minimal',
    label: 'Minimal',
    description: 'Prefer built-in APIs. Ask before adding any dependency.',
  },
  {
    value: 'pragmatic',
    label: 'Pragmatic',
    description: 'Well-maintained dependencies are fine when they clearly help.',
  },
];

export const ACCESSIBILITY_OPTIONS: readonly SelectOption<AccessibilityLevel>[] = [
  {
    value: 'baseline',
    label: 'Baseline',
    description: 'Semantic HTML, labelled controls, keyboard access, visible focus.',
  },
  { value: 'wcag-aa', label: 'WCAG 2.2 AA', description: 'Target WCAG 2.2 level AA conformance.' },
  { value: 'not-applicable', label: 'Not applicable', description: 'No user interface.' },
];

export interface PermissionCategoryDefinition {
  id: PermissionCategory;
  label: string;
  description: string;
  examples: string;
}

export const PERMISSION_CATEGORIES: readonly PermissionCategoryDefinition[] = [
  {
    id: 'git',
    label: 'Git commands',
    description: 'Commits, pushes, branch changes and anything that rewrites history.',
    examples: 'git commit, git push, git checkout, git reset',
  },
  {
    id: 'packageManager',
    label: 'Package manager commands',
    description: 'Installing, removing or updating packages and running project scripts.',
    examples: 'npm install, pnpm add, npm run build',
  },
  {
    id: 'destructiveOperations',
    label: 'Destructive operations',
    description: 'Deleting files or directories and overwriting important files.',
    examples: 'rm -rf, moving directories, overwriting config',
  },
  {
    id: 'database',
    label: 'Database operations',
    description: 'Migrations, seeding, resets and direct data changes.',
    examples: 'migrate, db reset, DROP TABLE',
  },
  {
    id: 'deployment',
    label: 'Deployment',
    description: 'Publishing or deploying to any environment.',
    examples: 'vercel deploy, npm publish, pushing to a release branch',
  },
];

export const POLICY_OPTIONS: readonly SelectOption<PermissionPolicy>[] = [
  { value: 'allow', label: 'Allow', description: 'Claude may run these without asking.' },
  { value: 'ask', label: 'Ask first', description: 'Claude explains the command and waits for approval.' },
  { value: 'prohibit', label: 'Never', description: 'Claude should not run these at all.' },
];

export interface VerificationOption {
  id: keyof VerificationPreferences;
  label: string;
  description: string;
}

export const VERIFICATION_OPTIONS: readonly VerificationOption[] = [
  {
    id: 'includeTesting',
    label: 'Testing instructions',
    description: 'What to test and when tests should be run.',
  },
  {
    id: 'includeTypeCheck',
    label: 'Type checking',
    description: 'Run the type checker before calling a task done.',
  },
  { id: 'includeLint', label: 'Linting', description: 'Run the linter and fix reported issues.' },
  {
    id: 'includeBuild',
    label: 'Build verification',
    description: 'Confirm the project still builds after changes.',
  },
  {
    id: 'requireDocUpdates',
    label: 'Documentation updates',
    description: 'Update docs when setup, architecture or behaviour changes.',
  },
  {
    id: 'includeDefinitionOfDone',
    label: 'Definition of Done',
    description: 'A checklist Claude works through before reporting completion.',
  },
];
