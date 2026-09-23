import { describe, expect, it } from 'vitest';
import { createDefaultFormState } from '../src/data/defaults';
import { normalize } from '../src/lib/generator/normalize';
import type { FormState } from '../src/types/generator';

function stateWith(overrides: Partial<FormState>): FormState {
  return { ...createDefaultFormState(), ...overrides };
}

describe('normalize', () => {
  it('resolves option values to labels', () => {
    const config = normalize(stateWith({ projectType: 'web-app', language: 'typescript', framework: 'astro' }));
    expect(config.stack).toMatchObject({ projectType: 'Web application', language: 'TypeScript', framework: 'Astro' });
  });

  it('uses the user text for "Other" and drops blank or "None" choices', () => {
    const config = normalize(
      stateWith({ framework: 'other', frameworkOther: '  Qwik  ', database: 'none', styling: '' }),
    );
    expect(config.stack.framework).toBe('Qwik');
    expect(config.stack.database).toBeUndefined();
    expect(config.stack.styling).toBeUndefined();
  });

  it('falls back to a generic project type if none resolves', () => {
    expect(normalize(stateWith({ projectType: 'other', projectTypeOther: ' ' })).stack.projectType).toBe(
      'Software project',
    );
  });

  it('splits goals, trims them and strips typed list markers', () => {
    const config = normalize(stateWith({ goals: '- Ship the MVP\n\n  2. Keep it fast \n* ' }));
    expect(config.basics.goals).toEqual(['Ship the MVP', 'Keep it fast']);
  });

  it('collapses line breaks in single-line fields', () => {
    expect(normalize(stateWith({ projectName: 'Acme\nDashboard ' })).basics.projectName).toBe('Acme Dashboard');
  });

  it('combines listed and free-text testing tools', () => {
    const config = normalize(stateWith({ testingTools: ['vitest'], testingToolsOther: 'k6, axe-core' }));
    expect(config.stack.testingTools).toEqual(['Vitest', 'k6', 'axe-core']);
  });

  it('only keeps TypeScript strictness for TypeScript projects', () => {
    expect(normalize(stateWith({ language: 'python' })).preferences.tsStrictness).toBe('not-applicable');
    expect(normalize(stateWith({ language: 'typescript', tsStrictness: 'standard' })).preferences.tsStrictness).toBe(
      'standard',
    );
  });

  it('turns blank optional text into undefined', () => {
    const config = normalize(stateWith({ targetUsers: '  ', constraints: '\n', customInstructions: '' }));
    expect(config.basics.targetUsers).toBeUndefined();
    expect(config.basics.constraints).toBeUndefined();
    expect(config.customInstructions).toBeUndefined();
  });
});
