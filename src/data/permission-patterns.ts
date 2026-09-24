/**
 * Shell command patterns for the generated `.claude/settings.json`. Each entry
 * is the text inside a `Bash(...)` rule; the settings generator wraps it.
 * Tables are keyed by option values from `frameworks.ts`. A choice with no
 * entry (including anything typed under "Other") produces no rules.
 *
 * A trailing ` *` also matches the bare command, so `git push *` covers
 * `git push`. See the permissions docs page for the full rule syntax.
 */

/** Always allowed: they only read repository state. */
export const GIT_READ_ONLY = ['git status *', 'git diff *', 'git log *', 'git show *'] as const;

/** Git commands that change the repository, its history or the working tree. */
export const GIT_WRITE = [
  'git init *',
  'git add *',
  'git rm *',
  'git mv *',
  'git commit *',
  'git push *',
  'git pull *',
  'git fetch *',
  'git merge *',
  'git rebase *',
  'git cherry-pick *',
  'git revert *',
  'git reset *',
  'git restore *',
  'git checkout *',
  'git switch *',
  'git branch *',
  'git stash *',
  'git clean *',
  'git tag *',
] as const;

/** Used instead of `GIT_WRITE` when Git is allowed outright. */
export const GIT_ALL = 'git *';

/** Installing, removing and updating packages and running project scripts. */
export const PACKAGE_MANAGER_PATTERNS: Readonly<Record<string, readonly string[]>> = {
  npm: ['npm install *', 'npm ci *', 'npm uninstall *', 'npm update *', 'npm run *', 'npm test *', 'npx *'],
  pnpm: [
    'pnpm add *',
    'pnpm install *',
    'pnpm remove *',
    'pnpm update *',
    'pnpm run *',
    'pnpm test *',
    'pnpm exec *',
    'pnpm dlx *',
  ],
  yarn: [
    'yarn add *',
    'yarn install *',
    'yarn remove *',
    'yarn up *',
    'yarn upgrade *',
    'yarn run *',
    'yarn test *',
    'yarn dlx *',
  ],
  bun: ['bun add *', 'bun install *', 'bun remove *', 'bun update *', 'bun run *', 'bun test *', 'bunx *'],
  pip: ['pip install *', 'pip uninstall *', 'pip3 install *', 'pip3 uninstall *'],
  uv: ['uv add *', 'uv remove *', 'uv sync *', 'uv lock *', 'uv pip *', 'uv run *', 'uvx *'],
  poetry: ['poetry add *', 'poetry remove *', 'poetry install *', 'poetry update *', 'poetry lock *', 'poetry run *'],
  'go-modules': ['go get *', 'go mod *', 'go install *', 'go run *', 'go test *', 'go build *'],
  cargo: [
    'cargo add *',
    'cargo remove *',
    'cargo update *',
    'cargo install *',
    'cargo run *',
    'cargo test *',
    'cargo build *',
  ],
  maven: ['mvn *', './mvnw *'],
  gradle: ['gradle *', './gradlew *'],
  nuget: ['dotnet add *', 'dotnet remove *', 'dotnet restore *', 'dotnet run *', 'dotnet test *', 'dotnet build *'],
  composer: ['composer require *', 'composer remove *', 'composer install *', 'composer update *', 'composer run *'],
  bundler: ['bundle add *', 'bundle remove *', 'bundle install *', 'bundle update *', 'bundle exec *'],
};

/** Deleting files and directories. `git clean` is covered by the Git rules. */
export const DESTRUCTIVE_PATTERNS = ['rm *', 'rmdir *', 'unlink *'] as const;

/** Database clients and admin tools, keyed by database. */
export const DATABASE_PATTERNS: Readonly<Record<string, readonly string[]>> = {
  postgresql: ['psql *', 'createdb *', 'dropdb *', 'pg_restore *'],
  mysql: ['mysql *', 'mysqladmin *'],
  sqlite: ['sqlite3 *'],
  mongodb: ['mongosh *', 'mongorestore *'],
  redis: ['redis-cli *'],
  supabase: ['supabase db *', 'supabase migration *'],
  firebase: ['firebase firestore:delete *', 'firebase database:*'],
};

/** Framework migration and data commands, keyed by framework. */
export const FRAMEWORK_DATABASE_PATTERNS: Readonly<Record<string, readonly string[]>> = {
  django: ['python manage.py migrate *', 'python manage.py flush *', 'python manage.py loaddata *'],
  rails: ['bin/rails db:*', 'rails db:*'],
  laravel: ['php artisan migrate*', 'php artisan db:*'],
};

/** Migration tools that work with any framework in a language family, keyed by language. */
export const LANGUAGE_DATABASE_TOOLS: Readonly<Record<string, readonly string[]>> = {
  typescript: ['prisma migrate *', 'prisma db *', 'drizzle-kit *'],
  javascript: ['prisma migrate *', 'prisma db *', 'drizzle-kit *'],
  python: ['alembic upgrade *', 'alembic downgrade *'],
};

/**
 * How each package manager runs a locally installed tool. The language tools
 * above are prefixed with it, for example `pnpm exec prisma migrate *`.
 */
export const TOOL_RUNNERS: Readonly<Record<string, string>> = {
  npm: 'npx',
  pnpm: 'pnpm exec',
  yarn: 'yarn',
  bun: 'bunx',
  uv: 'uv run',
  poetry: 'poetry run',
};

/** Hosting and deployment CLIs, included for every project. */
export const DEPLOYMENT_PATTERNS = [
  'vercel *',
  'netlify deploy *',
  'firebase deploy *',
  'wrangler deploy *',
  'fly deploy *',
] as const;

/** Publishing a package to a registry, keyed by package manager. */
export const PUBLISH_PATTERNS: Readonly<Record<string, readonly string[]>> = {
  npm: ['npm publish *'],
  pnpm: ['pnpm publish *'],
  yarn: ['yarn publish *', 'yarn npm publish *'],
  bun: ['bun publish *'],
  pip: ['twine upload *'],
  uv: ['uv publish *'],
  poetry: ['poetry publish *'],
  cargo: ['cargo publish *'],
  maven: ['mvn deploy *'],
  gradle: ['gradle publish *'],
  nuget: ['dotnet nuget push *'],
  bundler: ['gem push *'],
};

/** File rules that keep environment files out of reach, whatever the policies. */
export const SECRET_FILE_RULES = ['Read(./.env)', 'Read(./.env.*)'] as const;

export const SETTINGS_SCHEMA_URL = 'https://json.schemastore.org/claude-code-settings.json';
