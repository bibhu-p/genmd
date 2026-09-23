---
title: Project rule files
description: Split detailed instructions into topic files in .claude/rules/, and use paths frontmatter so each rule only loads when Claude works on matching files.
section: instructions
order: 2
sources:
  - label: Organize rules with .claude/rules/
    url: https://code.claude.com/docs/en/memory
lastVerified: 2026-09-23
---

As a project grows, a single `CLAUDE.md` becomes long and hard to maintain. **Rule files** let you move each topic, such as your design system, API conventions or testing strategy, into its own Markdown file. Rules can also be **scoped to certain files**, so a design guide only loads when Claude is working on UI code, keeping every other session lean.

## CLAUDE.md, rule files or skills?

| Use | For | Loads |
| --- | --- | --- |
| `CLAUDE.md` | Facts needed in every session: commands, structure, core conventions | Every session |
| Rule file without `paths` | A topic that applies everywhere but deserves its own file, such as your Git workflow | Every session |
| Rule file with `paths` | Rules for one part of the codebase, such as components or API routes | When Claude reads a matching file |
| [Skill](/docs/extending/) | A multi-step procedure you run occasionally, such as a release checklist | When you run it, or when Claude decides it is relevant |

## Setting up rule files

Create a `.claude/rules/` folder in your project and add one Markdown file per topic. Use descriptive names; Claude Code finds every `.md` file in the folder, including in subfolders.

```text
your-project/
├── CLAUDE.md
└── .claude/
    └── rules/
        ├── design-guide.md
        ├── api-conventions.md
        ├── testing.md
        └── backend/
            └── database.md
```

Commit the folder so your whole team shares the same rules.

## Always-on or path-scoped

A rule file **without** frontmatter loads at the start of every session, just like `CLAUDE.md`.

To limit a rule to certain files, add a `paths` list in YAML frontmatter at the very top of the file:

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API rules

- Validate every request body before using it.
- Return errors in the standard error format.
```

A path-scoped rule is added when Claude **reads** a file that matches one of the patterns, not on every action. After `/compact`, it comes back the next time Claude reads a matching file.

### Writing path patterns

Patterns use glob syntax and are matched against paths in your project:

| Pattern | Matches |
| --- | --- |
| `**/*.ts` | Every TypeScript file, in any folder |
| `src/**/*` | Everything under `src/` |
| `*.md` | Markdown files in the project root only |
| `src/components/*.tsx` | `.tsx` files directly in `src/components/` |
| `src/**/*.{ts,tsx}` | `.ts` and `.tsx` files anywhere under `src/` |

- **Quote every pattern.** In YAML, a value starting with `*` has a special meaning, so `"**/*.ts"` is safe where `**/*.ts` is not.
- **List several patterns** to cover related areas, for example components and their stylesheets.
- To match a literal `[` in a filename, escape it as `\[`.

> **Watch out:** `paths` is the only frontmatter field rule files use; other fields are ignored. If the frontmatter is not valid YAML, it is ignored completely and the rule loads in **every** session. Run `claude --debug` to see the parsing error.

## Personal rules

Rules in `~/.claude/rules/` in your home directory apply to every project on your machine. Use them for personal habits, such as how you like commit messages worded. They load before project rules, but neither overrides the other, so avoid giving the two conflicting instructions.

## Sharing rules between projects

The `.claude/rules/` folder supports symlinks, so several projects can link to one shared set of rules:

```bash
ln -s ~/shared-claude-rules .claude/rules/shared
```

A link that points outside the project is treated like an import from outside the project: it needs your approval before it loads. Rules kept in `~/.claude/rules/` load without that step.

## Alternative: importing from CLAUDE.md

You can also keep a guide anywhere in your repository, for example `docs/design-guide.md`, and pull it into `CLAUDE.md` with an import:

```markdown
## Design

- Follow @docs/design-guide.md for all UI work.
```

This is handy when the guide doubles as documentation for people. The trade-off is that imported files always load at startup; they cannot be limited to certain paths.

## Writing a good rule file

- **One topic per file.** A focused file is easier to keep accurate.
- **Concrete rules only.** "Use the spacing scale 4, 8, 12, 16, 24, 32" works; "keep spacing consistent" does not.
- **Say what to do and what never to do.** A short "Always" and "Never" list makes intent unmistakable.
- **Delete what does not apply.** Empty or placeholder sections add noise without helping.
- **Check it loaded** with `/context` while working on a matching file.

## Templates

The rule file guides give you a template and a filled-in example for common topics:

- [Design guide](/docs/rules/design-guide/)
- [API conventions](/docs/rules/api-conventions/)
- [Testing strategy](/docs/rules/testing-strategy/)
- [Git workflow](/docs/rules/git-workflow/)
- [Code style](/docs/rules/code-style/)
- [Custom rule](/docs/rules/custom-rule/), a blank structure for any other topic
