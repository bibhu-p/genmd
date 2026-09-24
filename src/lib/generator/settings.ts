/**
 * Builds a `.claude/settings.json` whose permission rules mirror the command
 * policies in the generated CLAUDE.md, so Claude Code can enforce them.
 * Command patterns live in `data/permission-patterns.ts`.
 */
import { DATABASES, FRAMEWORKS, LANGUAGES, PACKAGE_MANAGERS } from '../../data/frameworks';
import {
  DATABASE_PATTERNS,
  DEPLOYMENT_PATTERNS,
  DESTRUCTIVE_PATTERNS,
  FRAMEWORK_DATABASE_PATTERNS,
  GIT_ALL,
  GIT_READ_ONLY,
  GIT_WRITE,
  LANGUAGE_DATABASE_TOOLS,
  PACKAGE_MANAGER_PATTERNS,
  PUBLISH_PATTERNS,
  SECRET_FILE_RULES,
  SETTINGS_SCHEMA_URL,
  TOOL_RUNNERS,
} from '../../data/permission-patterns';
import type { PermissionCategory, PermissionPolicy, ProjectConfig } from '../../types/generator';
import { valueOf } from './options';

export interface PermissionRules {
  allow: string[];
  ask: string[];
  deny: string[];
}

const LIST_FOR_POLICY: Record<PermissionPolicy, keyof PermissionRules> = {
  allow: 'allow',
  ask: 'ask',
  prohibit: 'deny',
};

/** Higher is stricter. When two categories produce the same rule, the stricter policy wins. */
const STRICTNESS: Record<PermissionPolicy, number> = { allow: 0, ask: 1, prohibit: 2 };

/** Option values for the stack. Undefined when a choice is empty, "None" or typed under "Other". */
interface StackValues {
  language?: string;
  framework?: string;
  packageManager?: string;
  database?: string;
}

function stackValues(config: ProjectConfig): StackValues {
  const { stack } = config;
  return {
    language: valueOf(LANGUAGES, stack.language),
    framework: valueOf(FRAMEWORKS, stack.framework),
    packageManager: valueOf(PACKAGE_MANAGERS, stack.packageManager),
    database: valueOf(DATABASES, stack.database),
  };
}

function databasePatterns({ language, framework, packageManager }: StackValues): string[] {
  const tools = language ? (LANGUAGE_DATABASE_TOOLS[language] ?? []) : [];
  // JavaScript tools need a runner even when the package manager is unknown; others run directly.
  const runner = (packageManager && TOOL_RUNNERS[packageManager]) ?? (language === 'python' ? undefined : 'npx');
  return [
    ...(framework ? (FRAMEWORK_DATABASE_PATTERNS[framework] ?? []) : []),
    ...tools.map((tool) => (runner ? `${runner} ${tool}` : tool)),
  ];
}

/** Shell patterns for a category. Git is handled separately because its patterns depend on the policy. */
function categoryPatterns(category: Exclude<PermissionCategory, 'git'>, values: StackValues): string[] {
  const { packageManager, database } = values;
  switch (category) {
    case 'packageManager':
      return packageManager ? [...(PACKAGE_MANAGER_PATTERNS[packageManager] ?? [])] : [];
    case 'destructiveOperations':
      return [...DESTRUCTIVE_PATTERNS];
    case 'database':
      return [...(database ? (DATABASE_PATTERNS[database] ?? []) : []), ...databasePatterns(values)];
    case 'deployment':
      return [...DEPLOYMENT_PATTERNS, ...(packageManager ? (PUBLISH_PATTERNS[packageManager] ?? []) : [])];
  }
}

/**
 * Converts the command policies into allow, ask and deny rules. Each rule
 * appears in exactly one list, and the order is stable for the same config.
 */
export function buildPermissionRules(config: ProjectConfig): PermissionRules {
  const { permissions } = config;
  const values = stackValues(config);
  const rules = new Map<string, PermissionPolicy>();

  const add = (patterns: readonly string[], policy: PermissionPolicy) => {
    for (const pattern of patterns) {
      const rule = `Bash(${pattern})`;
      const existing = rules.get(rule);
      if (!existing || STRICTNESS[policy] > STRICTNESS[existing]) rules.set(rule, policy);
    }
  };

  // Read-only Git is always fine, matching the note in the Command Permissions section.
  if (permissions.git === 'allow') {
    add([GIT_ALL], 'allow');
  } else {
    add(GIT_READ_ONLY, 'allow');
    add(GIT_WRITE, permissions.git);
  }

  add(categoryPatterns('packageManager', values), permissions.packageManager);
  add(categoryPatterns('destructiveOperations', values), permissions.destructiveOperations);
  // Database rules only matter when the project has a database, as in the CLAUDE.md.
  if (config.stack.database !== undefined) add(categoryPatterns('database', values), permissions.database);
  add(categoryPatterns('deployment', values), permissions.deployment);

  const result: PermissionRules = { allow: [], ask: [], deny: [] };
  for (const [rule, policy] of rules) result[LIST_FOR_POLICY[policy]].push(rule);
  result.deny.push(...SECRET_FILE_RULES);
  return result;
}

/** Builds the settings.json content. Deterministic: the same config always gives the same output. */
export function generateSettingsJson(config: ProjectConfig): string {
  const { allow, ask, deny } = buildPermissionRules(config);
  const permissions: Partial<PermissionRules> = {
    ...(allow.length > 0 && { allow }),
    ...(ask.length > 0 && { ask }),
    ...(deny.length > 0 && { deny }),
  };
  return `${JSON.stringify({ $schema: SETTINGS_SCHEMA_URL, permissions }, null, 2)}\n`;
}

/** Describes why edited settings content would not load, or returns null when it is a valid JSON object. */
export function checkSettingsJson(content: string): string | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return 'This is not valid JSON, so Claude Code will not be able to read it. Check for missing commas, quotes or brackets.';
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return 'Settings must be a JSON object, starting with { and ending with }.';
  }
  return null;
}
