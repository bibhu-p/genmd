import type { ProjectStage, SelectOption } from '../types/generator';

export const PROJECT_STAGES: readonly SelectOption<ProjectStage>[] = [
  { value: 'new', label: 'New project', description: 'Starting from scratch.' },
  { value: 'existing', label: 'Existing project', description: 'Adding to a codebase that already exists.' },
  { value: 'migration', label: 'Migration', description: 'Moving to a new stack, framework or architecture.' },
];
