import { describe, expect, it } from 'vitest';
import { createDefaultFormState } from '../src/data/defaults';
import { MAX_LENGTH, validateStep } from '../src/lib/generator/validation';
import type { FormState } from '../src/types/generator';

function stateWith(overrides: Partial<FormState>): FormState {
  return { ...createDefaultFormState(), ...overrides };
}

const validBasics: Partial<FormState> = {
  projectName: 'Acme',
  description: 'An internal dashboard.',
  goals: 'Replace the spreadsheet',
};

describe('validateStep: basics', () => {
  it('reports every missing required field on the default state', () => {
    const fields = validateStep('basics', createDefaultFormState()).map((error) => error.field);
    expect(fields).toEqual(['projectName', 'description', 'goals']);
  });

  it('passes with the required fields filled in', () => {
    expect(validateStep('basics', stateWith(validBasics))).toEqual([]);
  });

  it('treats whitespace-only text as missing', () => {
    const errors = validateStep('basics', stateWith({ ...validBasics, projectName: '   ' }));
    expect(errors).toEqual([{ field: 'projectName', message: 'Enter a project name.' }]);
  });

  it('requires at least one non-blank goal line', () => {
    const errors = validateStep('basics', stateWith({ ...validBasics, goals: '\n  \n' }));
    expect(errors.map((error) => error.field)).toEqual(['goals']);
  });

  it('does not count bare list markers as goals', () => {
    const errors = validateStep('basics', stateWith({ ...validBasics, goals: '-\n* \n1.' }));
    expect(errors.map((error) => error.field)).toEqual(['goals']);
  });

  it('enforces maximum lengths', () => {
    const errors = validateStep(
      'basics',
      stateWith({ ...validBasics, projectName: 'x'.repeat(MAX_LENGTH.projectName + 1) }),
    );
    expect(errors).toEqual([{ field: 'projectName', message: 'Project name must be 100 characters or fewer.' }]);
  });
});

describe('validateStep: stack', () => {
  it('requires a project type', () => {
    expect(validateStep('stack', createDefaultFormState()).map((error) => error.field)).toEqual(['projectType']);
  });

  it('requires the free-text value when "Other" is chosen', () => {
    const errors = validateStep('stack', stateWith({ projectType: 'web-app', framework: 'other' }));
    expect(errors.map((error) => error.field)).toEqual(['frameworkOther']);
  });

  it('accepts "Other" with text', () => {
    const state = stateWith({ projectType: 'other', projectTypeOther: 'Browser extension' });
    expect(validateStep('stack', state)).toEqual([]);
  });

  it('ignores leftover "Other" text when a listed option is chosen', () => {
    const state = stateWith({ projectType: 'web-app', framework: 'astro', frameworkOther: '' });
    expect(validateStep('stack', state)).toEqual([]);
  });

  it('does not require optional stack fields', () => {
    expect(validateStep('stack', stateWith({ projectType: 'static-site' }))).toEqual([]);
  });
});

describe('validateStep: other steps', () => {
  it('always accepts permissions and verification', () => {
    const state = createDefaultFormState();
    expect(validateStep('permissions', state)).toEqual([]);
    expect(validateStep('verification', state)).toEqual([]);
  });

  it('limits custom instructions length', () => {
    const state = stateWith({ customInstructions: 'x'.repeat(MAX_LENGTH.customInstructions + 1) });
    expect(validateStep('review', state).map((error) => error.field)).toEqual(['customInstructions']);
  });
});
