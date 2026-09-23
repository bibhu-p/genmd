/**
 * Core domain types for the CLAUDE.md generator.
 *
 * `FormState` mirrors the raw questionnaire inputs, including the free-text
 * boxes behind "Other" choices. `ProjectConfig` is the cleaned, resolved shape
 * that the Markdown generator consumes. A normalization step converts the
 * former into the latter so the generator never deals with raw form values.
 */

export type PermissionPolicy = 'allow' | 'ask' | 'prohibit';
export type ProjectStage = 'new' | 'existing' | 'migration';
export type TsStrictness = 'strict' | 'standard' | 'not-applicable';
export type DependencyPolicy = 'minimal' | 'pragmatic';
export type AccessibilityLevel = 'baseline' | 'wcag-aa' | 'not-applicable';

export type PermissionCategory =
  | 'git'
  | 'packageManager'
  | 'destructiveOperations'
  | 'database'
  | 'deployment';

export type PermissionPolicies = Record<PermissionCategory, PermissionPolicy>;

export type CodingPreferenceId =
  | 'clean-code'
  | 'simple-solutions'
  | 'small-changes'
  | 'follow-conventions'
  | 'descriptive-naming'
  | 'component-organization'
  | 'explicit-error-handling'
  | 'performance-aware';

export type StepId =
  | 'basics'
  | 'stack'
  | 'preferences'
  | 'permissions'
  | 'verification'
  | 'review';

/** A selectable option. `T` narrows the value when the set is closed. */
export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
}

/** A technology option that may only apply to certain languages. */
export interface StackOption extends SelectOption {
  /** Language values this option applies to. Omitted means any language. */
  languages?: readonly string[];
  /** Example commands, used in generated permission rules (package managers only). */
  commands?: readonly string[];
}

// ---------------------------------------------------------------------------
// Resolved configuration (generator input)
// ---------------------------------------------------------------------------

export interface ProjectBasics {
  projectName: string;
  description: string;
  goals: string[];
  stage: ProjectStage;
  targetUsers?: string;
  constraints?: string;
}

/** Display labels, with "Other" already replaced by the user's text. */
export interface TechStack {
  projectType: string;
  language?: string;
  framework?: string;
  packageManager?: string;
  /** Undefined when the project has no database. */
  database?: string;
  styling?: string;
  testingTools: string[];
}

export interface DevelopmentPreferences {
  codingPreferences: CodingPreferenceId[];
  tsStrictness: TsStrictness;
  dependencyPolicy: DependencyPolicy;
  accessibilityLevel: AccessibilityLevel;
  performanceNotes?: string;
}

export interface VerificationPreferences {
  includeTesting: boolean;
  includeTypeCheck: boolean;
  includeLint: boolean;
  includeBuild: boolean;
  requireDocUpdates: boolean;
  includeDefinitionOfDone: boolean;
}

export interface ProjectConfig {
  basics: ProjectBasics;
  stack: TechStack;
  preferences: DevelopmentPreferences;
  permissions: PermissionPolicies;
  verification: VerificationPreferences;
  customInstructions?: string;
}

// ---------------------------------------------------------------------------
// Raw questionnaire state (form input)
// ---------------------------------------------------------------------------

/**
 * Raw values as entered in the questionnaire. Select fields hold option
 * values (for example `"other"`), with the matching `*Other` field holding
 * the free-text alternative. Goals are one per line.
 */
export interface FormState {
  // Step 1: project basics
  projectName: string;
  description: string;
  goals: string;
  stage: ProjectStage;
  targetUsers: string;
  constraints: string;

  // Step 2: technology stack
  projectType: string;
  projectTypeOther: string;
  language: string;
  languageOther: string;
  framework: string;
  frameworkOther: string;
  packageManager: string;
  packageManagerOther: string;
  database: string;
  databaseOther: string;
  styling: string;
  stylingOther: string;
  testingTools: string[];
  testingToolsOther: string;

  // Step 3: development preferences
  codingPreferences: CodingPreferenceId[];
  tsStrictness: TsStrictness;
  dependencyPolicy: DependencyPolicy;
  accessibilityLevel: AccessibilityLevel;
  performanceNotes: string;

  // Step 4: command permissions
  permissions: PermissionPolicies;

  // Step 5: testing and documentation
  verification: VerificationPreferences;

  // Step 6: review
  customInstructions: string;
}
