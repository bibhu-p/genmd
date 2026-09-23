import { describe, expect, it } from 'vitest';
import { createDefaultFormState } from '../src/data/defaults';
import { createSampleFormState } from '../src/data/sample';
import { generateClaudeMd } from '../src/lib/generator/generate';
import { normalize } from '../src/lib/generator/normalize';
import type { FormState, PermissionPolicies } from '../src/types/generator';

const MINIMAL: Partial<FormState> = {
  projectName: 'Tiny Site',
  description: 'A one-page portfolio.',
  goals: 'Launch quickly',
  projectType: 'static-site',
};

function generate(overrides: Partial<FormState> = {}): string {
  return generateClaudeMd(normalize({ ...createDefaultFormState(), ...MINIMAL, ...overrides }));
}

function headings(markdown: string): string[] {
  return markdown.split('\n').filter((line) => /^#{1,6} /.test(line));
}

const allowAll: PermissionPolicies = {
  git: 'allow',
  packageManager: 'allow',
  destructiveOperations: 'allow',
  database: 'allow',
  deployment: 'allow',
};

const noChecks = {
  includeTesting: false,
  includeTypeCheck: false,
  includeLint: false,
  includeBuild: false,
  requireDocUpdates: false,
  includeDefinitionOfDone: false,
};

describe('generateClaudeMd: structure', () => {
  it('produces a single H1 followed by H2 sections', () => {
    const lines = headings(generate());
    expect(lines[0]).toBe('# Tiny Site');
    expect(lines.filter((line) => line.startsWith('# '))).toHaveLength(1);
  });

  it('includes the core sections for a minimal configuration', () => {
    const sections = headings(generate()).filter((line) => line.startsWith('## '));
    expect(sections).toEqual(
      expect.arrayContaining([
        '## Project Overview',
        '## Technology Stack',
        '## Project Architecture',
        '## Development Workflow',
        '## Coding Standards',
        '## Error Handling and Security',
        '## Scope Management',
      ]),
    );
  });

  it('never leaks placeholder values or stray blank lines', () => {
    const markdown = generate();
    expect(markdown).not.toMatch(/undefined|null|\[object Object\]/);
    expect(markdown).not.toMatch(/\n{3,}/);
    expect(markdown.endsWith('\n')).toBe(true);
    expect(markdown.endsWith('\n\n')).toBe(false);
  });

  it('is deterministic and reflects configuration changes', () => {
    expect(generate()).toBe(generate());
    expect(generate({ projectName: 'Renamed' })).not.toBe(generate());
  });

  it('includes every optional section for a full configuration', () => {
    const markdown = generateClaudeMd(
      normalize({ ...createSampleFormState(), constraints: 'Must run on the intranet.', customInstructions: 'Be nice.' }),
    );
    for (const heading of [
      '## Command Permissions',
      '## Testing and Verification',
      '## Documentation',
      '## Definition of Done',
      '## Additional Instructions',
      '### Constraints',
      '### TypeScript',
      '### Accessibility',
    ]) {
      expect(markdown).toContain(heading);
    }
  });
});

describe('generateClaudeMd: permissions', () => {
  it('omits the section when every command is allowed', () => {
    expect(generate({ permissions: allowAll })).not.toContain('## Command Permissions');
  });

  it('groups categories by policy and adds the enforcement note', () => {
    const markdown = generate({ permissions: { ...allowAll, git: 'prohibit', packageManager: 'ask' } });
    expect(markdown).toContain('### Never run');
    expect(markdown).toContain('### Ask first');
    expect(markdown).toContain('### Allowed');
    expect(markdown).toMatch(/### Never run[\s\S]*Git commands that change the repository/);
    expect(markdown).toContain('does not technically enforce them');
  });

  it('uses example commands for the chosen package manager', () => {
    const markdown = generate({ packageManager: 'pnpm', permissions: { ...allowAll, packageManager: 'ask' } });
    expect(markdown).toContain('`pnpm add`');
  });

  it('leaves out database rules when there is no database', () => {
    const permissions = { ...allowAll, database: 'ask' as const, git: 'ask' as const };
    expect(generate({ permissions })).not.toContain('Database operations');
    expect(generate({ permissions, database: 'postgresql' })).toContain('Database operations');
  });
});

describe('generateClaudeMd: optional sections', () => {
  it('omits testing, documentation and Definition of Done when disabled', () => {
    const markdown = generate({ verification: noChecks });
    expect(markdown).not.toContain('## Testing and Verification');
    expect(markdown).not.toContain('## Documentation');
    expect(markdown).not.toContain('## Definition of Done');
  });

  it('builds testing rules and the checklist from the enabled checks', () => {
    const markdown = generate({
      verification: { ...noChecks, includeLint: true, includeDefinitionOfDone: true },
    });
    expect(markdown).toContain('Run the linter');
    expect(markdown).not.toContain('Run the type checker');
    expect(markdown).toContain('- [ ] Linting passes.');
    expect(markdown).not.toContain('- [ ] Type checking passes.');
  });

  it('only adds TypeScript rules for TypeScript projects', () => {
    expect(generate({ language: 'python' })).not.toContain('### TypeScript');
    expect(generate({ language: 'typescript' })).toContain('### TypeScript');
  });
});

describe('generateClaudeMd: user content', () => {
  it('keeps custom instructions exactly as written', () => {
    const custom = '## Deploy notes\n\nUse the `release` branch.\n- Never touch prod on Fridays';
    expect(generate({ customInstructions: custom })).toContain(`## Additional Instructions\n\n${custom}`);
  });

  it('stops user text in paragraphs from creating headings', () => {
    const markdown = generate({ description: 'First line\n# Not a heading\n---' });
    expect(markdown).toContain('\\# Not a heading');
    expect(markdown).toContain('\\---');
    expect(headings(markdown)).not.toContain('# Not a heading');
  });

  it('omits optional overview details that were left blank', () => {
    const markdown = generate();
    expect(markdown).not.toContain('Target users');
    expect(markdown).not.toContain('### Constraints');
  });
});
