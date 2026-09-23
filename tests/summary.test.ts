import { describe, expect, it } from 'vitest';
import { createDefaultFormState } from '../src/data/defaults';
import { NOT_SPECIFIED, summarize } from '../src/lib/generator/summary';
import type { FormState } from '../src/types/generator';

function valueOf(state: FormState, step: string, label: string): string | undefined {
  return summarize(state)
    .find((group) => group.step === step)
    ?.items.find((item) => item.label === label)?.value;
}

describe('summarize', () => {
  it('groups answers by step in questionnaire order', () => {
    const steps = summarize(createDefaultFormState()).map((group) => group.step);
    expect(steps).toEqual(['basics', 'stack', 'preferences', 'permissions', 'verification']);
  });

  it('marks blank answers as not specified', () => {
    const state = createDefaultFormState();
    expect(valueOf(state, 'basics', 'Project name')).toBe(NOT_SPECIFIED);
    expect(valueOf(state, 'stack', 'Framework')).toBe(NOT_SPECIFIED);
  });

  it('resolves "Other" to the user text and keeps "None" labels', () => {
    const state = { ...createDefaultFormState(), framework: 'other', frameworkOther: 'Qwik', database: 'none' };
    expect(valueOf(state, 'stack', 'Framework')).toBe('Qwik');
    expect(valueOf(state, 'stack', 'Database')).toBe('No database');
  });

  it('combines listed and free-text testing tools', () => {
    const state = { ...createDefaultFormState(), testingTools: ['vitest'], testingToolsOther: 'k6, axe' };
    expect(valueOf(state, 'stack', 'Testing tools')).toBe('Vitest, k6, axe');
  });

  it('only shows TypeScript strictness for TypeScript projects', () => {
    const base = createDefaultFormState();
    expect(valueOf(base, 'preferences', 'TypeScript strictness')).toBeUndefined();
    expect(valueOf({ ...base, language: 'typescript' }, 'preferences', 'TypeScript strictness')).toBe('Strict');
  });

  it('splits verification into included and left out', () => {
    const state = createDefaultFormState();
    state.verification.includeLint = false;
    expect(valueOf(state, 'verification', 'Left out')).toBe('Linting');
    expect(valueOf(state, 'verification', 'Included')).not.toContain('Linting');
  });
});
