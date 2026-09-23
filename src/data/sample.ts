import type { FormState } from '../types/generator';
import { createDefaultFormState } from './defaults';

/** A realistic example project, used for the landing page preview and in tests. */
export function createSampleFormState(): FormState {
  return {
    ...createDefaultFormState(),
    projectName: 'Acme Support Dashboard',
    description:
      'An internal dashboard that helps the support team track tickets, response times and customer satisfaction.',
    goals: [
      'Replace the shared support spreadsheet',
      'Give team leads a weekly performance summary',
      'Stay fast on older laptops',
    ].join('\n'),
    stage: 'new',
    targetUsers: 'Support agents and team leads',
    projectType: 'web-app',
    language: 'typescript',
    framework: 'astro',
    packageManager: 'pnpm',
    database: 'postgresql',
    styling: 'tailwind',
    testingTools: ['vitest', 'playwright'],
    accessibilityLevel: 'wcag-aa',
    permissions: {
      git: 'ask',
      packageManager: 'ask',
      destructiveOperations: 'prohibit',
      database: 'ask',
      deployment: 'prohibit',
    },
  };
}
