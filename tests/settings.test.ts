import { describe, expect, it } from 'vitest';
import { createDefaultFormState } from '../src/data/defaults';
import { OTHER_VALUE, PACKAGE_MANAGERS } from '../src/data/frameworks';
import { PACKAGE_MANAGER_PATTERNS, PUBLISH_PATTERNS, SETTINGS_SCHEMA_URL } from '../src/data/permission-patterns';
import { createSampleFormState } from '../src/data/sample';
import { normalize } from '../src/lib/generator/normalize';
import { buildPermissionRules, generateSettingsJson } from '../src/lib/generator/settings';
import type { FormState, PermissionPolicies } from '../src/types/generator';

const BASE: Partial<FormState> = {
  projectName: 'Tiny API',
  description: 'A small service.',
  goals: 'Ship it',
  projectType: 'api',
  language: 'typescript',
  packageManager: 'pnpm',
};

function config(overrides: Partial<FormState> = {}) {
  return normalize({ ...createDefaultFormState(), ...BASE, ...overrides });
}

function rules(overrides: Partial<FormState> = {}) {
  return buildPermissionRules(config(overrides));
}

function policies(policy: PermissionPolicies['git']): PermissionPolicies {
  return { git: policy, packageManager: policy, destructiveOperations: policy, database: policy, deployment: policy };
}

describe('generateSettingsJson', () => {
  it('produces valid JSON with the schema and a permissions object', () => {
    const parsed: unknown = JSON.parse(generateSettingsJson(config()));
    expect(parsed).toMatchObject({ $schema: SETTINGS_SCHEMA_URL, permissions: expect.any(Object) });
  });

  it('is deterministic', () => {
    expect(generateSettingsJson(config())).toBe(generateSettingsJson(config()));
  });

  it('ends with a single newline', () => {
    expect(generateSettingsJson(config())).toMatch(/\}\n$/);
  });

  it('leaves out empty lists', () => {
    const parsed = JSON.parse(generateSettingsJson(config({ permissions: policies('allow') })));
    expect(Object.keys(parsed.permissions)).toEqual(['allow', 'deny']);
  });

  it('works for the sample project', () => {
    const settings = generateSettingsJson(normalize(createSampleFormState()));
    expect(settings).toContain('"Bash(pnpm add *)"');
    expect(settings).toContain('"Bash(psql *)"');
  });
});

describe('buildPermissionRules: policies', () => {
  it('maps Allow, Ask first and Never to allow, ask and deny', () => {
    const result = rules({
      permissions: {
        git: 'ask',
        packageManager: 'allow',
        destructiveOperations: 'prohibit',
        database: 'ask',
        deployment: 'prohibit',
      },
    });
    expect(result.ask).toContain('Bash(git commit *)');
    expect(result.allow).toContain('Bash(pnpm add *)');
    expect(result.deny).toContain('Bash(rm *)');
    expect(result.deny).toContain('Bash(vercel *)');
  });

  it('never puts a rule in more than one list', () => {
    for (const policy of ['allow', 'ask', 'prohibit'] as const) {
      const { allow, ask, deny } = rules({ database: 'postgresql', permissions: policies(policy) });
      const all = [...allow, ...ask, ...deny];
      expect(new Set(all).size).toBe(all.length);
    }
  });
});

describe('buildPermissionRules: Git', () => {
  it('always allows read-only Git commands', () => {
    for (const git of ['ask', 'prohibit'] as const) {
      const result = rules({ permissions: { ...createDefaultFormState().permissions, git } });
      expect(result.allow).toEqual(
        expect.arrayContaining(['Bash(git status *)', 'Bash(git diff *)', 'Bash(git log *)']),
      );
    }
  });

  it('lists Git commands that change the repository individually when not allowed', () => {
    const result = rules({ permissions: { ...createDefaultFormState().permissions, git: 'prohibit' } });
    expect(result.deny).toEqual(expect.arrayContaining(['Bash(git push *)', 'Bash(git reset *)']));
    expect(result.deny).not.toContain('Bash(git *)');
  });

  it('uses a single broad rule when Git is allowed', () => {
    const result = rules({ permissions: { ...createDefaultFormState().permissions, git: 'allow' } });
    expect(result.allow).toContain('Bash(git *)');
    expect(result.allow).not.toContain('Bash(git status *)');
  });
});

describe('buildPermissionRules: stack', () => {
  it('has command patterns for every listed package manager', () => {
    for (const manager of PACKAGE_MANAGERS.filter((option) => option.value !== OTHER_VALUE)) {
      expect(PACKAGE_MANAGER_PATTERNS[manager.value], manager.value).toBeDefined();
    }
  });

  it('uses the chosen package manager', () => {
    const result = rules({ packageManager: 'uv', language: 'python' });
    expect(result.ask).toContain('Bash(uv add *)');
    expect(result.ask.some((rule) => rule.startsWith('Bash(pnpm'))).toBe(false);
  });

  it('adds no package manager or publish rules for "Other"', () => {
    const result = rules({ packageManager: OTHER_VALUE, packageManagerOther: 'pixi' });
    const all = [...result.allow, ...result.ask, ...result.deny];
    const known = Object.values({ ...PACKAGE_MANAGER_PATTERNS, ...PUBLISH_PATTERNS }).flat();
    expect(all.filter((rule) => known.some((pattern) => rule === `Bash(${pattern})`))).toEqual([]);
  });

  it('adds the package manager publish command to deployment', () => {
    expect(rules({ permissions: policies('prohibit') }).deny).toContain('Bash(pnpm publish *)');
  });
});

describe('buildPermissionRules: database', () => {
  it('leaves out database rules when there is no database', () => {
    const result = rules({ database: 'none' });
    const all = [...result.allow, ...result.ask, ...result.deny];
    expect(all.some((rule) => /psql|prisma|drizzle/.test(rule))).toBe(false);
  });

  it('adds client and ORM rules with the package manager runner', () => {
    const result = rules({ database: 'postgresql' });
    expect(result.ask).toEqual(
      expect.arrayContaining(['Bash(psql *)', 'Bash(pnpm exec prisma migrate *)', 'Bash(pnpm exec drizzle-kit *)']),
    );
  });

  it('adds framework migration commands', () => {
    const result = rules({ language: 'python', framework: 'django', packageManager: 'pip', database: 'postgresql' });
    expect(result.ask).toEqual(expect.arrayContaining(['Bash(python manage.py migrate *)', 'Bash(alembic upgrade *)']));
  });
});

describe('buildPermissionRules: secrets', () => {
  it('always denies reading environment files', () => {
    for (const policy of ['allow', 'ask', 'prohibit'] as const) {
      expect(rules({ permissions: policies(policy) }).deny).toEqual(
        expect.arrayContaining(['Read(./.env)', 'Read(./.env.*)']),
      );
    }
  });
});
