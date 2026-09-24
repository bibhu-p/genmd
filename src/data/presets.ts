import type { CodingPreferenceId, Preset } from '../types/generator';
import { CODING_PREFERENCES } from './rules';

/** The default coding preferences plus `extra`, in the order they appear in the form. */
function preferencesWith(...extra: CodingPreferenceId[]): CodingPreferenceId[] {
  return CODING_PREFERENCES.filter((pref) => pref.defaultSelected || extra.includes(pref.id)).map((pref) => pref.id);
}

/**
 * Starting points for common stacks. Applying one fills in steps 2, 3 and 5;
 * anything a preset leaves out goes back to its default. Values are option
 * values from `frameworks.ts` and `rules.ts`.
 */
export const PRESETS: readonly Preset[] = [
  {
    id: 'astro-static',
    label: 'Astro static site',
    description: 'TypeScript, Astro, npm, Tailwind CSS and Vitest.',
    values: {
      projectType: 'static-site',
      language: 'typescript',
      framework: 'astro',
      packageManager: 'npm',
      database: 'none',
      styling: 'tailwind',
      testingTools: ['vitest'],
      codingPreferences: preferencesWith('performance-aware'),
      accessibilityLevel: 'wcag-aa',
    },
  },
  {
    id: 'nextjs-fullstack',
    label: 'Next.js full-stack app',
    description: 'TypeScript, Next.js, pnpm, PostgreSQL, Tailwind CSS, Vitest and Playwright.',
    values: {
      projectType: 'fullstack',
      language: 'typescript',
      framework: 'nextjs',
      packageManager: 'pnpm',
      database: 'postgresql',
      styling: 'tailwind',
      testingTools: ['vitest', 'playwright'],
      codingPreferences: preferencesWith('component-organization'),
      dependencyPolicy: 'pragmatic',
    },
  },
  {
    id: 'react-spa',
    label: 'React single-page app',
    description: 'TypeScript, React with Vite, npm, CSS Modules, Vitest and Testing Library.',
    values: {
      projectType: 'web-app',
      language: 'typescript',
      framework: 'react-vite',
      packageManager: 'npm',
      database: 'none',
      styling: 'css-modules',
      testingTools: ['vitest', 'testing-library'],
      codingPreferences: preferencesWith('component-organization'),
    },
  },
  {
    id: 'node-api',
    label: 'Node.js REST API',
    description: 'TypeScript, Express, npm, PostgreSQL and Vitest.',
    values: {
      projectType: 'api',
      language: 'typescript',
      framework: 'express',
      packageManager: 'npm',
      database: 'postgresql',
      styling: 'none',
      testingTools: ['vitest'],
      dependencyPolicy: 'pragmatic',
      accessibilityLevel: 'not-applicable',
    },
  },
  {
    id: 'python-fastapi',
    label: 'Python FastAPI service',
    description: 'Python, FastAPI, uv, PostgreSQL and pytest.',
    values: {
      projectType: 'api',
      language: 'python',
      framework: 'fastapi',
      packageManager: 'uv',
      database: 'postgresql',
      styling: 'none',
      testingTools: ['pytest'],
      dependencyPolicy: 'pragmatic',
      accessibilityLevel: 'not-applicable',
    },
  },
  {
    id: 'django-web',
    label: 'Django web app',
    description: 'Python, Django, Poetry, PostgreSQL, plain CSS and pytest.',
    values: {
      projectType: 'fullstack',
      language: 'python',
      framework: 'django',
      packageManager: 'poetry',
      database: 'postgresql',
      styling: 'plain-css',
      testingTools: ['pytest'],
      dependencyPolicy: 'pragmatic',
    },
  },
  {
    id: 'go-api',
    label: 'Go API service',
    description: 'Go, Gin, Go modules, PostgreSQL and go test.',
    values: {
      projectType: 'api',
      language: 'go',
      framework: 'gin',
      packageManager: 'go-modules',
      database: 'postgresql',
      styling: 'none',
      testingTools: ['go-test'],
      accessibilityLevel: 'not-applicable',
    },
  },
  {
    id: 'rust-cli',
    label: 'Rust command-line tool',
    description: 'Rust, no framework, Cargo and cargo test.',
    values: {
      projectType: 'cli',
      language: 'rust',
      framework: 'none',
      packageManager: 'cargo',
      database: 'none',
      styling: 'none',
      testingTools: ['cargo-test'],
      codingPreferences: preferencesWith('performance-aware'),
      accessibilityLevel: 'not-applicable',
    },
  },
];

export function findPreset(id: string): Preset | undefined {
  return PRESETS.find((preset) => preset.id === id);
}
