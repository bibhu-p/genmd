import type { StepId } from '../types/generator';

export interface StepDefinition {
  id: StepId;
  title: string;
  summary: string;
}

export const STEPS: readonly StepDefinition[] = [
  {
    id: 'basics',
    title: 'Project basics',
    summary: 'Name, description, goals and project stage.',
  },
  {
    id: 'stack',
    title: 'Technology stack',
    summary: 'Language, framework, package manager, database, styling and testing tools.',
  },
  {
    id: 'preferences',
    title: 'Development preferences',
    summary: 'Coding standards, TypeScript strictness, dependencies and accessibility.',
  },
  {
    id: 'permissions',
    title: 'Command permissions',
    summary: 'Whether Claude may run Git, package manager, destructive, database and deployment commands.',
  },
  {
    id: 'verification',
    title: 'Testing and documentation',
    summary: 'Which checks to run, and whether docs and a Definition of Done are required.',
  },
  {
    id: 'review',
    title: 'Review and export',
    summary: 'Check your answers, then edit, preview, copy or download CLAUDE.md.',
  },
];
