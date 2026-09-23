---
title: Writing a CLAUDE.md
description: What belongs in a CLAUDE.md, how to structure it, where the file lives, how imports work, and how to keep Claude following it.
section: instructions
order: 1
sources:
  - label: How Claude remembers your project (CLAUDE.md files)
    url: https://code.claude.com/docs/en/memory
lastVerified: 2026-09-23
---

`CLAUDE.md` is a Markdown file of instructions that Claude Code reads at the start of every session. Think of it as the briefing you would give a capable new teammate: how to run the project, how the code is organised, and the rules everyone follows.

It is **context, not configuration**. Claude reads it and tries to follow it, but nothing forces it to. Clear, specific instructions are followed far more reliably than vague ones, and anything that must be guaranteed belongs in [settings](/docs/permissions/) or [hooks](/docs/hooks/) as well.

## When to add something

A good test is whether you would otherwise have to explain it again. Add an instruction when:

- Claude makes the same mistake twice.
- A code review catches something Claude should have known about the codebase.
- You find yourself typing the same correction you typed in a previous session.
- A new teammate would need the same information to be productive.

## What to include and what to leave out

Keep `CLAUDE.md` for facts Claude needs in **every** session.

| Include | Leave out |
| --- | --- |
| Build, run, test and lint commands | Anything Claude can work out by reading the code, such as a full folder listing or dependency list |
| Conventions that differ from common defaults | Long step-by-step procedures (use a [skill](/docs/extending/) instead) |
| Where key code lives, briefly | Detailed rules for one area, such as design or API style (use a rule file) |
| Workflow expectations, such as "run tests before finishing" | Personal preferences (use `CLAUDE.local.md` or `~/.claude/CLAUDE.md`) |
| Pitfalls and the reasons behind unusual rules | Secrets, tokens or internal URLs you would not want committed |

## A structure that works

Most good `CLAUDE.md` files share a similar shape. Copy this skeleton and replace each `<placeholder>`; delete any section you do not need.

```markdown
# <Project name>

<One or two sentences: what the project is and who it is for.>

## Commands

- Install: `<install command>`
- Dev server: `<dev command>`
- Tests: `<test command>`
- Lint and type check: `<check command>`

## Project structure

- `<folder>/`: <what lives here>
- `<folder>/`: <what lives here>

## Conventions

- <A concrete rule, for example "Use named exports, never default exports">
- <A concrete rule>

## Workflow

- <For example "Run the tests and type check before saying a task is done">
- <For example "Ask before adding a new dependency">

## Avoid

- <For example "Never edit files in `generated/`; they are rebuilt on every build">
```

> **Tip:** GenMD Studio generates a full version of this structure from a short questionnaire, including permissions, testing rules and a Definition of Done.

## Writing instructions Claude follows

**Be specific enough to check.** If you cannot tell whether an instruction was followed, Claude cannot either.

| Vague | Specific |
| --- | --- |
| Format code properly | Use 2-space indentation |
| Test your changes | Run `npm test` before committing |
| Keep files organised | API handlers live in `src/api/handlers/` |
| Be careful with the database | Never run migrations without asking first |

**Keep it short.** Aim for under 200 lines per file. Every line is loaded into every session, and long files make individual rules easier to miss. Move detail into [rule files](/docs/rule-files/), which can load only when relevant.

**Use structure.** Headings and bullet points are easier to follow than paragraphs, for Claude as much as for people.

**Avoid contradictions.** If two instructions conflict, including across different `CLAUDE.md` or rule files, Claude may follow either one. Review your files now and then and remove anything outdated.

**Explain unusual rules.** A short reason ("we pin React 18 because the charting library breaks on 19") helps Claude apply the rule sensibly in situations you did not anticipate.

## Where CLAUDE.md files live

You can have several instruction files at different levels. They are listed here from broadest to most specific.

| Scope | Location | Use it for | Shared with |
| --- | --- | --- | --- |
| Organisation | Managed policy location set by IT (for example `/etc/claude-code/CLAUDE.md` on Linux) | Company-wide standards and policies | Everyone in the organisation |
| You, everywhere | `~/.claude/CLAUDE.md` | Your personal preferences in every project | Only you |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team conventions for this project | Your team, via git |
| You, this project | `./CLAUDE.local.md` | Personal notes such as your sandbox URLs (add it to `.gitignore`) | Only you |

### How they load

- Claude Code loads `CLAUDE.md` and `CLAUDE.local.md` from the directory you start it in **and every directory above it**.
- Files are **combined, not overridden**. They are read from the top of the filesystem down, so instructions closer to where you started Claude are read last. At each level, `CLAUDE.local.md` comes after `CLAUDE.md`.
- `CLAUDE.md` files in **subdirectories** are not loaded at startup. They are picked up when Claude reads files in that subdirectory, which makes them useful for per-package instructions in a larger repository.

To check what actually loaded in a session, run `/context` and look under **Memory files**.

## Importing other files

A `CLAUDE.md` can pull in other files with `@` followed by a path:

```markdown
See @README.md for the project overview and @package.json for available scripts.

## Git workflow

- Follow the steps in @docs/git-workflow.md
```

- Paths are relative to the file that contains the import, not to where you started Claude. Absolute paths and `~` paths work too.
- Imported files can import others, up to four levels deep.
- An `@path` inside backticks or a code block is left as plain text, so you can mention a file without importing it.
- The first time a project imports a file from **outside** the project folder, Claude Code asks you to approve it.

> **Note:** imports help you organise instructions, but they do not save space: imported files load at startup along with the `CLAUDE.md` that references them. To load instructions only when they are relevant, use path-scoped [rule files](/docs/rule-files/) instead.

## Notes for humans

HTML comments such as `<!-- ask Priya before changing the release steps -->` are removed before the file reaches Claude. Use them for maintainer notes without spending context on them.

## Useful commands

| Command | What it does |
| --- | --- |
| `/init` | Analyses your codebase and drafts a `CLAUDE.md`. If one already exists, it suggests improvements instead of overwriting it. |
| `/memory` | Lists your instruction files, opens them in your editor (creating them if needed) and lets you manage auto memory. |
| `/context` | Shows what is loaded into the current session, including which instruction files were found. |

You can also ask Claude directly, for example "add this rule to CLAUDE.md". Asking it to "remember" something saves it to Claude's **auto memory** instead, a separate set of notes Claude keeps for itself, which you can browse through `/memory`.

## When Claude is not following it

1. **Check it loaded.** Run `/context` and look for the file under **Memory files**. A file Claude never read cannot be followed.
2. **Check the location.** Make sure the file is somewhere that loads for your session (see the table above).
3. **Make the instruction more specific.** Replace general advice with a concrete, checkable rule.
4. **Look for conflicts** between your `CLAUDE.md`, `CLAUDE.local.md`, subdirectory files and rule files.
5. **Use a [hook](/docs/hooks/) for anything that must always happen**, such as formatting after every edit. Hooks run automatically at fixed points, whatever Claude decides.

After `/compact`, the project-root `CLAUDE.md` is read again from disk, so its instructions survive. Instructions you only gave in conversation do not, so add anything important to the file.

## Large repositories and monorepos

In a monorepo, `CLAUDE.md` files from other teams higher up the tree may load even though they are not relevant to you. The `claudeMdExcludes` setting skips them by path or glob pattern. Put it in `.claude/settings.local.json` to keep the exclusion to your machine:

```json
{
  "claudeMdExcludes": ["**/monorepo/CLAUDE.md", "/home/you/monorepo/other-team/.claude/rules/**"]
}
```

Organisation-level managed policy files cannot be excluded.
