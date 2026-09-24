/**
 * Wording used in the generated CLAUDE.md. Kept apart from the section
 * functions so the copy can be reviewed and edited without touching logic.
 * Rules are written as instructions addressed to Claude.
 */
import type {
  AccessibilityLevel,
  CodingPreferenceId,
  DependencyPolicy,
  PermissionCategory,
  ProjectStage,
  TsStrictness,
} from '../types/generator';

export const INTRO =
  'This file gives Claude Code the context and working rules for this project. Read it before starting any task and follow it throughout.';

export const STAGE_DESCRIPTIONS: Record<ProjectStage, string> = {
  new: 'New project. There is no existing code to preserve, so establish clear conventions from the start.',
  existing: 'Existing project. Learn the conventions already in the codebase and follow them.',
  migration:
    'Migration in progress. Keep the project working throughout and confirm the migration approach before large changes.',
};

export const PACKAGE_MANAGER_RULE = (name: string) =>
  `Use ${name} for all dependency and script commands. Do not switch package managers or add a second lockfile.`;

export const EMPTY_STACK =
  'No technology choices have been recorded yet. Ask before choosing frameworks, libraries or tools.';

export const ARCHITECTURE_RULES = {
  newProject:
    'The project structure is still being established. Propose a directory layout before creating it, and keep it as simple as the project allows.',
  existingProject:
    'Inspect the existing structure before making changes, and place new code where similar code already lives.',
  separation:
    'Keep responsibilities separate: presentation, business logic, data access and shared utilities belong in different modules.',
  componentOrganization:
    'Keep components and modules small, each with one clear responsibility, and group them by feature.',
  migration:
    'Migrate incrementally. Keep old and new code paths working until each part of the migration is complete.',
  noUnapprovedChanges:
    'Do not change the overall architecture, reorganise directories or rename widely used modules without discussing it first.',
} as const;

export const WORKFLOW_INTRO =
  'Follow this workflow for every task. For small, unambiguous changes, a short plan is enough.';

export const WORKFLOW_STEPS = {
  understand:
    '**Understand.** Read the relevant code and configuration before changing anything. Do not assume a file, function or dependency exists without checking.',
  plan: '**Plan.** For non-trivial tasks, outline the approach and the files you will change. Ask for approval before architectural changes or anything outside the requested scope.',
  implement:
    '**Implement.** Make focused changes that stay within the agreed scope, and keep the project working after each step.',
  verifyWithChecks: '**Verify.** Run the checks described under Testing and Verification, and review your own diff.',
  verifyManually: '**Verify.** Review your own diff and confirm the change behaves as expected.',
  report: '**Report.** Summarise what changed, what you verified and anything left unfinished.',
} as const;

/** Preferences listed under "General". The other two feed Architecture and Error Handling. */
export type GeneralPreferenceId = Exclude<CodingPreferenceId, 'component-organization' | 'explicit-error-handling'>;

export const GENERAL_CODING_RULES: Record<GeneralPreferenceId, string> = {
  'clean-code': 'Write clean, maintainable code. Prefer readability over cleverness.',
  'simple-solutions':
    'Choose the simplest solution that works. Do not add abstractions, layers or configuration before they are needed.',
  'small-changes': 'Keep changes small and focused, and do not refactor unrelated code as part of a task.',
  'follow-conventions': 'Follow the naming, structure and patterns already used in the codebase.',
  'descriptive-naming': 'Use clear, descriptive names for variables, functions, files and components.',
  'performance-aware':
    'Avoid unnecessary work, network requests and client-side code. Consider the performance cost of each change.',
};

export const TS_RULES: Record<Exclude<TsStrictness, 'not-applicable'>, readonly string[]> = {
  strict: [
    'Keep TypeScript `strict` mode enabled.',
    'Do not use `any`. Use `unknown` and narrow the type instead.',
    'Avoid type assertions (`as`) and non-null assertions (`!`) unless there is no safe alternative, and explain why when you use one.',
    'Define explicit types for public functions, component props and shared data.',
  ],
  standard: [
    'Define explicit types for public functions, component props and shared data.',
    'Avoid `any`. If it is genuinely needed, add a comment explaining why.',
  ],
};

export const DEPENDENCY_RULES: Record<DependencyPolicy, readonly string[]> = {
  minimal: [
    'Prefer built-in language and platform features over new dependencies.',
    'Do not add a dependency for something that can be written clearly in a few lines.',
    'Ask before adding any dependency, and explain why it is needed.',
  ],
  pragmatic: [
    'Well-maintained, widely used dependencies are fine when they clearly simplify the code.',
    'Explain why each new dependency is needed, and consider its size and maintenance cost.',
  ],
};

const BASELINE_ACCESSIBILITY = [
  'Use semantic HTML and give every form control a label.',
  'Make every interactive element usable with a keyboard, with a visible focus state.',
  'Do not rely on colour alone to convey meaning.',
];

export const ACCESSIBILITY_RULES: Record<Exclude<AccessibilityLevel, 'not-applicable'>, readonly string[]> = {
  baseline: BASELINE_ACCESSIBILITY,
  'wcag-aa': [
    'Meet WCAG 2.2 level AA.',
    ...BASELINE_ACCESSIBILITY,
    'Keep text contrast at 4.5:1 or higher (3:1 for large text).',
  ],
};

/** Noun phrases describing each command category; the package manager phrase is built with examples. */
export const PERMISSION_ACTIONS: Record<Exclude<PermissionCategory, 'packageManager'>, string> = {
  git: 'Git commands that change the repository or its history, such as `git add`, `git commit`, `git push`, `git pull`, `git checkout`, `git merge`, `git rebase` or `git reset`',
  destructiveOperations:
    'Destructive file operations, such as deleting files or directories (`rm`, `rm -rf`), overwriting important files or moving project directories',
  database:
    'Database operations, such as running migrations, seeding, resetting or dropping data, or changing data directly',
  deployment:
    'Deployment and publishing, such as deploying to any environment, publishing packages or changing deployment configuration',
};

/** Joins items as "a", "a and b" or "a, b and c". */
export const joinWithAnd = (items: readonly string[], conjunction = 'and') =>
  items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} ${conjunction} ${items.at(-1)}`;

export const PACKAGE_MANAGER_ACTION = (examples: readonly string[]) => {
  const list =
    examples.length > 0 ? ` (for example ${joinWithAnd(examples.map((command) => `\`${command}\``), 'or')})` : '';
  return `Package manager commands${list}, including installing, removing or updating packages and running scripts such as dev servers, builds, tests, linters or formatters`;
};

export const PERMISSION_TEXT = {
  askHeading: '### Ask first',
  askIntro:
    'Before running any of the following, state the exact command, why it is needed and any side effects, then wait for explicit approval:',
  neverHeading: '### Never run',
  neverIntro: 'Do not run these, even if a task seems to need them. Explain what is needed and let the developer run it:',
  allowedHeading: '### Allowed',
  allowedIntro: 'You may run these without asking, but mention them in your report:',
  gitReadOnly: 'Read-only Git commands such as `git status`, `git diff` and `git log` are always fine.',
  noBlanketPermission:
    'A general request to build, fix or finish something is not permission to run every command it might involve.',
  enforcementNote:
    '> These rules describe the intended workflow. This file does not technically enforce them; matching permission rules in `.claude/settings.json` do.',
} as const;

export const TESTING_RULES = {
  writeTests: (tools: readonly string[]) =>
    `Add or update tests for new behaviour and bug fixes${tools.length > 0 ? `, using ${joinWithAnd(tools)}` : ''}.`,
  edgeCases: 'Cover edge cases and error paths, not only the expected path.',
  typeCheck: 'Run the type checker and fix all errors before considering a task complete.',
  lint: 'Run the linter and fix reported problems. Do not disable rules to silence warnings without a documented reason.',
  build: 'Confirm the project still builds successfully after your changes.',
  askForChecks:
    'These checks run through the package manager, so ask before running them as described under Command Permissions.',
  cannotRunChecks: 'You may not run package manager commands, so list the exact checks for the developer to run instead.',
  honesty:
    'Never claim that a test, build, lint or type check passed unless you actually ran it and it succeeded. Report any checks you could not run.',
} as const;

export const ERROR_HANDLING_RULES: readonly string[] = [
  'Handle errors explicitly. Do not silently swallow exceptions or ignore failed operations.',
  'Show users helpful error messages without exposing stack traces or internal details.',
];

export const SECURITY_RULES: readonly string[] = [
  'Never hardcode secrets, API keys or credentials. Read them from environment variables or a secrets manager.',
  'Never commit `.env` files or other files containing secrets, and never print secrets in logs or output.',
  'Treat all external input as untrusted and validate it.',
];

export const DATABASE_SECURITY_RULE =
  "Use parameterised queries or your data layer's query builder. Never build queries by concatenating user input.";

export const DOCUMENTATION_RULES: readonly string[] = [
  'Update the README when setup steps, commands, configuration or user-facing behaviour change.',
  'Record important architectural decisions and the reasons behind them.',
  'Write comments that explain why code exists, not what it does.',
  'Do not create new documentation files for trivial changes.',
];

export const SCOPE_RULES: readonly string[] = [
  'Implement only what was requested. Do not add features that were not asked for.',
  'If you notice a worthwhile improvement outside the task, mention it instead of implementing it.',
  'Ask before changing the architecture or expanding the scope of a task.',
  'If requirements are unclear, ask a focused question rather than guessing.',
];

export const DEFINITION_OF_DONE = {
  intro: 'A task is complete when:',
  implemented: 'The requested change is implemented and stays within scope.',
  tests: 'Tests cover the new or changed behaviour and pass.',
  typeCheck: 'Type checking passes.',
  lint: 'Linting passes.',
  build: 'The project builds successfully.',
  docs: 'Documentation is updated where needed.',
  reported: 'Results are reported accurately, including any checks that could not be run.',
} as const;
