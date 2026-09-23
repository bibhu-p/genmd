/**
 * One function per CLAUDE.md section. Each takes the resolved configuration
 * and returns the section's Markdown, or null when the section should be left
 * out. Wording lives in `data/templates.ts`.
 */
import { PACKAGE_MANAGERS } from '../../data/frameworks';
import { PERMISSION_CATEGORIES } from '../../data/rules';
import {
  ACCESSIBILITY_RULES,
  ARCHITECTURE_RULES,
  DATABASE_SECURITY_RULE,
  DEFINITION_OF_DONE,
  DEPENDENCY_RULES,
  DOCUMENTATION_RULES,
  EMPTY_STACK,
  ERROR_HANDLING_RULES,
  GENERAL_CODING_RULES,
  type GeneralPreferenceId,
  INTRO,
  PACKAGE_MANAGER_ACTION,
  PACKAGE_MANAGER_RULE,
  PERMISSION_ACTIONS,
  PERMISSION_TEXT,
  SCOPE_RULES,
  SECURITY_RULES,
  STAGE_DESCRIPTIONS,
  TESTING_RULES,
  TS_RULES,
  WORKFLOW_INTRO,
  WORKFLOW_STEPS,
} from '../../data/templates';
import type {
  CodingPreferenceId,
  PermissionCategory,
  PermissionPolicy,
  ProjectConfig,
} from '../../types/generator';
import { block, bulletList, checklist, joinBlocks, numberedList } from './markdown';

export type SectionGenerator = (config: ProjectConfig) => string | null;

function hasPreference(config: ProjectConfig, id: CodingPreferenceId): boolean {
  return config.preferences.codingPreferences.includes(id);
}

function hasAnyCheck(config: ProjectConfig): boolean {
  const { includeTesting, includeTypeCheck, includeLint, includeBuild } = config.verification;
  return includeTesting || includeTypeCheck || includeLint || includeBuild;
}

export const titleSection: SectionGenerator = (config) =>
  joinBlocks([`# ${config.basics.projectName}`, INTRO]);

export const overviewSection: SectionGenerator = ({ basics, stack }) =>
  joinBlocks([
    '## Project Overview',
    block(basics.description),
    bulletList([
      `**Project type:** ${stack.projectType}`,
      `**Stage:** ${STAGE_DESCRIPTIONS[basics.stage]}`,
      basics.targetUsers && `**Target users:** ${basics.targetUsers}`,
    ]),
    ...(basics.goals.length > 0 ? ['### Goals', bulletList(basics.goals)] : []),
    ...(basics.constraints ? ['### Constraints', block(basics.constraints)] : []),
  ]);

export const techStackSection: SectionGenerator = ({ stack }) => {
  const rows = bulletList([
    stack.language && `**Language:** ${stack.language}`,
    stack.framework && `**Framework:** ${stack.framework}`,
    stack.packageManager && `**Package manager:** ${stack.packageManager}`,
    stack.database && `**Database:** ${stack.database}`,
    stack.styling && `**Styling:** ${stack.styling}`,
    stack.testingTools.length > 0 && `**Testing:** ${stack.testingTools.join(', ')}`,
  ]);

  return joinBlocks([
    '## Technology Stack',
    rows || EMPTY_STACK,
    stack.packageManager && PACKAGE_MANAGER_RULE(stack.packageManager),
  ]);
};

export const architectureSection: SectionGenerator = (config) => {
  const { stage } = config.basics;
  return joinBlocks([
    '## Project Architecture',
    bulletList([
      stage === 'new' ? ARCHITECTURE_RULES.newProject : ARCHITECTURE_RULES.existingProject,
      stage === 'migration' && ARCHITECTURE_RULES.migration,
      ARCHITECTURE_RULES.separation,
      hasPreference(config, 'component-organization') && ARCHITECTURE_RULES.componentOrganization,
      ARCHITECTURE_RULES.noUnapprovedChanges,
    ]),
  ]);
};

export const workflowSection: SectionGenerator = (config) =>
  joinBlocks([
    '## Development Workflow',
    WORKFLOW_INTRO,
    numberedList([
      WORKFLOW_STEPS.understand,
      WORKFLOW_STEPS.plan,
      WORKFLOW_STEPS.implement,
      hasAnyCheck(config) ? WORKFLOW_STEPS.verifyWithChecks : WORKFLOW_STEPS.verifyManually,
      WORKFLOW_STEPS.report,
    ]),
  ]);

function isGeneralPreference(id: CodingPreferenceId): id is GeneralPreferenceId {
  return id in GENERAL_CODING_RULES;
}

export const codingStandardsSection: SectionGenerator = ({ preferences }) => {
  const general = preferences.codingPreferences.filter(isGeneralPreference).map((id) => GENERAL_CODING_RULES[id]);
  const { tsStrictness, accessibilityLevel, performanceNotes } = preferences;

  return joinBlocks([
    '## Coding Standards',
    ...(general.length > 0 ? ['### General', bulletList(general)] : []),
    ...(tsStrictness !== 'not-applicable' ? ['### TypeScript', bulletList(TS_RULES[tsStrictness])] : []),
    '### Dependencies',
    bulletList(DEPENDENCY_RULES[preferences.dependencyPolicy]),
    ...(accessibilityLevel !== 'not-applicable'
      ? ['### Accessibility', bulletList(ACCESSIBILITY_RULES[accessibilityLevel])]
      : []),
    ...(performanceNotes ? ['### Performance', block(performanceNotes)] : []),
  ]);
};

function permissionAction(category: PermissionCategory, config: ProjectConfig): string {
  if (category === 'packageManager') {
    const manager = PACKAGE_MANAGERS.find((option) => option.label === config.stack.packageManager);
    return PACKAGE_MANAGER_ACTION(manager?.commands ?? []);
  }
  return PERMISSION_ACTIONS[category];
}

export const permissionsSection: SectionGenerator = (config) => {
  // Database rules only matter when the project has a database.
  const categories = PERMISSION_CATEGORIES.map((category) => category.id).filter(
    (id) => id !== 'database' || config.stack.database !== undefined,
  );
  const actionsFor = (policy: PermissionPolicy) =>
    categories.filter((id) => config.permissions[id] === policy).map((id) => `${permissionAction(id, config)}.`);

  const ask = actionsFor('ask');
  const never = actionsFor('prohibit');
  const allowed = actionsFor('allow');
  if (ask.length === 0 && never.length === 0) return null;

  return joinBlocks([
    '## Command Permissions',
    ...(ask.length > 0 ? [PERMISSION_TEXT.askHeading, PERMISSION_TEXT.askIntro, bulletList(ask)] : []),
    ...(never.length > 0 ? [PERMISSION_TEXT.neverHeading, PERMISSION_TEXT.neverIntro, bulletList(never)] : []),
    ...(allowed.length > 0
      ? [PERMISSION_TEXT.allowedHeading, PERMISSION_TEXT.allowedIntro, bulletList(allowed)]
      : []),
    config.permissions.git !== 'allow' && PERMISSION_TEXT.gitReadOnly,
    PERMISSION_TEXT.noBlanketPermission,
    PERMISSION_TEXT.enforcementNote,
  ]);
};

export const testingSection: SectionGenerator = (config) => {
  if (!hasAnyCheck(config)) return null;
  const { verification, stack, permissions } = config;

  return joinBlocks([
    '## Testing and Verification',
    bulletList([
      verification.includeTesting && TESTING_RULES.writeTests(stack.testingTools),
      verification.includeTesting && TESTING_RULES.edgeCases,
      verification.includeTypeCheck && TESTING_RULES.typeCheck,
      verification.includeLint && TESTING_RULES.lint,
      verification.includeBuild && TESTING_RULES.build,
    ]),
    permissions.packageManager === 'ask' && TESTING_RULES.askForChecks,
    permissions.packageManager === 'prohibit' && TESTING_RULES.cannotRunChecks,
    TESTING_RULES.honesty,
  ]);
};

export const securitySection: SectionGenerator = (config) =>
  joinBlocks([
    '## Error Handling and Security',
    bulletList([
      ...(hasPreference(config, 'explicit-error-handling') ? ERROR_HANDLING_RULES : []),
      ...SECURITY_RULES,
      config.stack.database && DATABASE_SECURITY_RULE,
    ]),
  ]);

export const documentationSection: SectionGenerator = (config) =>
  config.verification.requireDocUpdates ? joinBlocks(['## Documentation', bulletList(DOCUMENTATION_RULES)]) : null;

export const scopeSection: SectionGenerator = () => joinBlocks(['## Scope Management', bulletList(SCOPE_RULES)]);

export const definitionOfDoneSection: SectionGenerator = ({ verification }) => {
  if (!verification.includeDefinitionOfDone) return null;
  return joinBlocks([
    '## Definition of Done',
    DEFINITION_OF_DONE.intro,
    checklist([
      DEFINITION_OF_DONE.implemented,
      verification.includeTesting && DEFINITION_OF_DONE.tests,
      verification.includeTypeCheck && DEFINITION_OF_DONE.typeCheck,
      verification.includeLint && DEFINITION_OF_DONE.lint,
      verification.includeBuild && DEFINITION_OF_DONE.build,
      verification.requireDocUpdates && DEFINITION_OF_DONE.docs,
      DEFINITION_OF_DONE.reported,
    ]),
  ]);
};

/** User text is kept exactly as written. */
export const customInstructionsSection: SectionGenerator = ({ customInstructions }) =>
  customInstructions ? joinBlocks(['## Additional Instructions', customInstructions]) : null;
