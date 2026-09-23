import type { SelectOption, StackOption } from '../types/generator';

/** Sentinel value for "Other", which reveals a free-text input. */
export const OTHER_VALUE = 'other';
/** Sentinel value for "None / not applicable". */
export const NONE_VALUE = 'none';

const JS_FAMILY = ['typescript', 'javascript'] as const;

export const PROJECT_TYPES: readonly SelectOption[] = [
  { value: 'web-app', label: 'Web application' },
  { value: 'static-site', label: 'Static website' },
  { value: 'fullstack', label: 'Full-stack application' },
  { value: 'api', label: 'API or backend service' },
  { value: 'cli', label: 'Command-line tool' },
  { value: 'library', label: 'Library or package' },
  { value: 'mobile', label: 'Mobile app' },
  { value: 'desktop', label: 'Desktop app' },
  { value: OTHER_VALUE, label: 'Other' },
];

export const LANGUAGES: readonly SelectOption[] = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: OTHER_VALUE, label: 'Other' },
];

export const FRAMEWORKS: readonly StackOption[] = [
  { value: 'astro', label: 'Astro', languages: JS_FAMILY },
  { value: 'nextjs', label: 'Next.js', languages: JS_FAMILY },
  { value: 'react-vite', label: 'React (Vite)', languages: JS_FAMILY },
  { value: 'nuxt', label: 'Nuxt', languages: JS_FAMILY },
  { value: 'vue-vite', label: 'Vue (Vite)', languages: JS_FAMILY },
  { value: 'sveltekit', label: 'SvelteKit', languages: JS_FAMILY },
  { value: 'express', label: 'Express', languages: JS_FAMILY },
  { value: 'nestjs', label: 'NestJS', languages: ['typescript'] },
  { value: 'fastapi', label: 'FastAPI', languages: ['python'] },
  { value: 'django', label: 'Django', languages: ['python'] },
  { value: 'flask', label: 'Flask', languages: ['python'] },
  { value: 'gin', label: 'Gin', languages: ['go'] },
  { value: 'axum', label: 'Axum', languages: ['rust'] },
  { value: 'spring-boot', label: 'Spring Boot', languages: ['java'] },
  { value: 'aspnet-core', label: 'ASP.NET Core', languages: ['csharp'] },
  { value: 'laravel', label: 'Laravel', languages: ['php'] },
  { value: 'rails', label: 'Ruby on Rails', languages: ['ruby'] },
  { value: NONE_VALUE, label: 'No framework' },
  { value: OTHER_VALUE, label: 'Other' },
];

export const PACKAGE_MANAGERS: readonly StackOption[] = [
  { value: 'npm', label: 'npm', languages: JS_FAMILY, commands: ['npm install', 'npm run build'] },
  { value: 'pnpm', label: 'pnpm', languages: JS_FAMILY, commands: ['pnpm add', 'pnpm run build'] },
  { value: 'yarn', label: 'Yarn', languages: JS_FAMILY, commands: ['yarn add', 'yarn build'] },
  { value: 'bun', label: 'Bun', languages: JS_FAMILY, commands: ['bun add', 'bun run build'] },
  { value: 'pip', label: 'pip', languages: ['python'], commands: ['pip install'] },
  { value: 'uv', label: 'uv', languages: ['python'], commands: ['uv add', 'uv run'] },
  { value: 'poetry', label: 'Poetry', languages: ['python'], commands: ['poetry add', 'poetry run'] },
  { value: 'go-modules', label: 'Go modules', languages: ['go'], commands: ['go get', 'go mod tidy'] },
  { value: 'cargo', label: 'Cargo', languages: ['rust'], commands: ['cargo add', 'cargo build'] },
  { value: 'maven', label: 'Maven', languages: ['java'], commands: ['mvn install'] },
  { value: 'gradle', label: 'Gradle', languages: ['java'], commands: ['gradle build'] },
  { value: 'nuget', label: 'NuGet', languages: ['csharp'], commands: ['dotnet add package'] },
  { value: 'composer', label: 'Composer', languages: ['php'], commands: ['composer require'] },
  { value: 'bundler', label: 'Bundler', languages: ['ruby'], commands: ['bundle add', 'bundle exec'] },
  { value: OTHER_VALUE, label: 'Other' },
];

export const DATABASES: readonly SelectOption[] = [
  { value: NONE_VALUE, label: 'No database' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'redis', label: 'Redis' },
  { value: 'supabase', label: 'Supabase' },
  { value: 'firebase', label: 'Firebase' },
  { value: OTHER_VALUE, label: 'Other' },
];

export const STYLING_OPTIONS: readonly SelectOption[] = [
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'plain-css', label: 'Plain CSS' },
  { value: 'css-modules', label: 'CSS Modules' },
  { value: 'sass', label: 'Sass / SCSS' },
  { value: 'css-in-js', label: 'CSS-in-JS' },
  { value: NONE_VALUE, label: 'Not applicable' },
  { value: OTHER_VALUE, label: 'Other' },
];

/** Multi-select; free-text extras go in `testingToolsOther`. */
export const TESTING_TOOLS: readonly StackOption[] = [
  { value: 'vitest', label: 'Vitest', languages: JS_FAMILY },
  { value: 'jest', label: 'Jest', languages: JS_FAMILY },
  { value: 'testing-library', label: 'Testing Library', languages: JS_FAMILY },
  { value: 'playwright', label: 'Playwright', languages: JS_FAMILY },
  { value: 'cypress', label: 'Cypress', languages: JS_FAMILY },
  { value: 'pytest', label: 'pytest', languages: ['python'] },
  { value: 'go-test', label: 'go test', languages: ['go'] },
  { value: 'cargo-test', label: 'cargo test', languages: ['rust'] },
  { value: 'junit', label: 'JUnit', languages: ['java'] },
  { value: 'xunit', label: 'xUnit', languages: ['csharp'] },
  { value: 'phpunit', label: 'PHPUnit', languages: ['php'] },
  { value: 'rspec', label: 'RSpec', languages: ['ruby'] },
];

/**
 * Returns the options that apply to `language`. Unscoped options are always
 * included, and an empty or "Other" language shows everything.
 */
export function optionsForLanguage(
  options: readonly StackOption[],
  language: string,
): StackOption[] {
  if (!language || language === OTHER_VALUE) return [...options];
  return options.filter((option) => !option.languages || option.languages.includes(language));
}
