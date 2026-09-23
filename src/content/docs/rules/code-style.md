---
title: Code style
description: A rule file template for how code in your project is written, covering naming, file layout, imports, functions, types, comments and error handling.
section: rules
order: 5
sources:
  - label: Path-specific rules
    url: https://code.claude.com/docs/en/memory
lastVerified: 2026-09-23
---

Formatters and linters handle spacing and punctuation. A code style file covers what they cannot: how things are named, where code goes, and the patterns your team prefers. It makes Claude's code read like the rest of the codebase.

## When to use it

- Your team has naming or structure conventions that tools do not enforce.
- Claude's code works but looks different from the code around it.
- Code reviews keep asking for the same style changes.

## Where to save it

Save it as `.claude/rules/code-style.md`. Scope it with `paths` to your source files, for example `src/**/*.{ts,tsx}`, or leave `paths` out if it applies to every file.

## What to include

- **Formatting:** which tool formats code, so Claude does not hand-format.
- **Naming:** files, components, functions, variables and constants.
- **Files and structure:** where new code goes and how large files should get.
- **Imports:** order and style.
- **Functions and types:** preferred patterns.
- **Comments:** when to write them.
- **Error handling:** the pattern your code uses.

## Template

```markdown
---
paths:
  - "<source files, e.g. src/**/*.{ts,tsx}>"
---

# Code style

## Formatting

- <Tool> formats code on save. Do not hand-format or fight its output.

## Naming

- Files: <e.g. kebab-case.ts>
- Components: <e.g. PascalCase>
- Functions and variables: <e.g. camelCase, verbs for functions>
- Constants: <e.g. UPPER_SNAKE_CASE>
- Booleans: <e.g. prefix with is, has or should>

## Files and structure

- <Where new code goes>
- <One component or module per file>
- <Size guideline>

## Imports

- <Order, e.g. packages, then internal aliases, then relative>
- <Style, e.g. named exports only>

## Functions and types

- <Preferred patterns>

## Comments

- <When to write comments>

## Error handling

- <The pattern to follow>

## Never

- <Rule>
```

## Example

A filled-in file for a TypeScript and React codebase:

```markdown
---
paths:
  - "src/**/*.{ts,tsx}"
---

# Code style

## Formatting

- Prettier formats code on save. Do not hand-format or fight its output.

## Naming

- Files: kebab-case, for example `order-summary.tsx`
- Components and types: PascalCase
- Functions and variables: camelCase; functions start with a verb (`getOrder`, `formatPrice`)
- Constants: UPPER_SNAKE_CASE for module-level values
- Booleans: prefix with `is`, `has` or `should`

## Files and structure

- Feature code lives in `src/features/<feature>/`; shared code in `src/lib/`
- One component per file
- Split a file once it passes about 300 lines

## Imports

- Order: packages, then `@/` aliases, then relative imports
- Named exports only; no default exports

## Functions and types

- Prefer small pure functions; keep side effects at the edges
- Type function parameters and return values explicitly
- Use `type` for object shapes; no `any`

## Comments

- Explain why, not what; delete commented-out code

## Error handling

- Throw `AppError` from `src/lib/errors.ts` with a code; never throw plain strings

## Never

- Never leave `console.log` in committed code; use the logger in `src/lib/logger.ts`
```

## Tips

- **Do not repeat what your tools enforce.** If ESLint already bans something, mentioning the tool is enough.
- **Point to good examples.** "Follow the style of `src/features/orders/`" is a quick way to show many conventions at once.
- **Explain the unusual ones.** A rule that goes against common practice needs a short reason, or it may be applied inconsistently.
- **Keep it short.** A dozen rules that matter beat fifty that nobody checks.
