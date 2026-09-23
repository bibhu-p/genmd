import {
  DATABASES,
  FRAMEWORKS,
  LANGUAGES,
  PACKAGE_MANAGERS,
  PROJECT_TYPES,
  STYLING_OPTIONS,
  TESTING_TOOLS,
} from '../../data/frameworks';
import type { FormState, ProjectConfig } from '../../types/generator';
import { inline, stripListMarker } from './markdown';
import { resolveChoice, splitLines, splitList } from './options';

const FALLBACK_PROJECT_TYPE = 'Software project';

function optionalInline(text: string): string | undefined {
  return inline(text) || undefined;
}

function optionalBlock(text: string): string | undefined {
  return text.trim() || undefined;
}

/** Resolves a choice and cleans up any user-typed "Other" text. */
function choice(...args: Parameters<typeof resolveChoice>): string | undefined {
  const resolved = resolveChoice(...args);
  return resolved ? inline(resolved) || undefined : undefined;
}

/**
 * Converts raw questionnaire state into the resolved configuration the
 * generator consumes: "Other" choices are replaced by the user's text,
 * blanks become undefined and lists are split and trimmed.
 */
export function normalize(state: FormState): ProjectConfig {
  const testingTools = [
    ...TESTING_TOOLS.filter((tool) => state.testingTools.includes(tool.value)).map((tool) => tool.label),
    ...splitList(state.testingToolsOther).map(inline),
  ];

  return {
    basics: {
      projectName: inline(state.projectName),
      description: state.description.trim(),
      goals: splitLines(state.goals).map((goal) => inline(stripListMarker(goal))).filter(Boolean),
      stage: state.stage,
      targetUsers: optionalInline(state.targetUsers),
      constraints: optionalBlock(state.constraints),
    },
    stack: {
      projectType: choice(PROJECT_TYPES, state.projectType, state.projectTypeOther) ?? FALLBACK_PROJECT_TYPE,
      language: choice(LANGUAGES, state.language, state.languageOther),
      framework: choice(FRAMEWORKS, state.framework, state.frameworkOther),
      packageManager: choice(PACKAGE_MANAGERS, state.packageManager, state.packageManagerOther),
      database: choice(DATABASES, state.database, state.databaseOther),
      styling: choice(STYLING_OPTIONS, state.styling, state.stylingOther),
      testingTools,
    },
    preferences: {
      codingPreferences: [...state.codingPreferences],
      // The strictness question is only shown for TypeScript projects.
      tsStrictness: state.language === 'typescript' ? state.tsStrictness : 'not-applicable',
      dependencyPolicy: state.dependencyPolicy,
      accessibilityLevel: state.accessibilityLevel,
      performanceNotes: optionalBlock(state.performanceNotes),
    },
    permissions: { ...state.permissions },
    verification: { ...state.verification },
    customInstructions: optionalBlock(state.customInstructions.replace(/\r\n?/g, '\n')),
  };
}
