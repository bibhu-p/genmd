---
title: Custom rule
description: A blank rule file structure for any topic not covered by the other guides, such as security, accessibility, database or copywriting rules.
section: rules
order: 6
sources:
  - label: Organize rules with .claude/rules/
    url: https://code.claude.com/docs/en/memory
lastVerified: 2026-09-23
---

The other guides cover common topics, but your project may need rules nobody else does: how database migrations are written, the tone of user-facing text, security requirements, analytics naming or anything else. This structure works for any topic.

## When to use it

- You keep giving Claude the same instructions about one area of the project.
- The instructions are too detailed for `CLAUDE.md`.
- None of the other templates fit.

## Where to save it

Save it as `.claude/rules/<topic>.md` with a name that says what it covers, such as `database.md`, `security.md` or `copywriting.md`. Add `paths` if the rule only applies to certain files; leave it out if it applies everywhere.

## The structure

A useful rule file answers four questions:

1. **Where does it apply?** The `paths` frontmatter, or nothing if everywhere.
2. **Why does it exist?** One or two sentences of context help Claude handle cases the rules do not mention.
3. **What should Claude do?** Concrete rules, with an example where the right way is not obvious.
4. **What should Claude never do,** and are there exceptions?

## Template

```markdown
---
paths:
  - "<files this applies to, or delete this frontmatter to apply everywhere>"
---

# <Topic>

<One or two sentences: why these rules exist and what they protect.>

## Rules

- <Concrete rule>
- <Concrete rule>
- <Concrete rule>

## Examples

Good:

<a short example of the right way>

Avoid:

<a short example of the wrong way>

## Never

- <Rule>

## Exceptions

- <When a rule does not apply, and who decides>

## Related files

- `<file>`: <why it matters>
```

## Example

A custom rule for database migrations:

```markdown
---
paths:
  - "db/migrations/**"
  - "src/db/**"
---

# Database migrations

The production database serves live customers, so every change must be reversible and safe to run while the app is online.

## Rules

- Create migrations with `npm run db:new <name>`; never write migration files by hand
- Every migration needs a working `down` step
- Add columns as nullable first; backfill in a separate migration; add constraints last
- Add an index for every new foreign key

## Examples

Good: add `status` as a nullable column, backfill it, then make it required in a later migration.

Avoid: adding a required column with no default to a table that already has data.

## Never

- Never edit a migration that has already been merged
- Never run migrations against production; the deploy pipeline does that

## Exceptions

- Emergency fixes may combine steps, but only with approval from the on-call engineer

## Related files

- `src/db/schema.ts`: the source of truth for table definitions
```

## Ideas for custom rules

- **Security:** handling secrets, validating input, logging rules.
- **Accessibility:** your target standard and the checks you expect.
- **Copywriting:** tone of voice, capitalisation and words to avoid in the interface.
- **Performance:** budgets for page weight or response time.
- **Dependencies:** how new packages are evaluated and approved.
- **Internationalisation:** how user-facing text is translated.

## Tips

- **Start from real problems.** The best rules come from mistakes you have already had to correct.
- **Keep the context short.** One or two sentences of "why" is enough.
- **Show, do not just tell.** A small good and bad example removes ambiguity.
- **Review it when the project changes.** Delete rules that no longer apply.
