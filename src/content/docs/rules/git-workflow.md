---
title: Git workflow
description: A rule file template for how your team uses Git, covering branch names, commit messages, pull requests, protected branches and what Claude may do on its own.
section: rules
order: 4
sources:
  - label: Organize rules with .claude/rules/
    url: https://code.claude.com/docs/en/memory
lastVerified: 2026-09-23
---

Every team has its own Git habits: how branches are named, how commit messages are written and what a pull request needs. A Git workflow file tells Claude your conventions, and just as importantly, which Git actions it should never take without you.

## When to use it

- Your team follows a branch or commit message convention.
- You want Claude to prepare commits or pull requests in a consistent format.
- You want clear limits on what Claude does with Git by itself.

## Where to save it

Save it as `.claude/rules/git-workflow.md` **without** `paths`. Git work is not tied to particular files, so this rule should load in every session.

## What to include

- **Branches:** naming and which branch to start from.
- **Commits:** message format and size.
- **Pull requests:** title, description and checklist.
- **Protected branches:** which branches are off limits.
- **What Claude may do alone** and what always needs your approval.

## Template

```markdown
# Git workflow

## Branches

- Start new work from `<main branch>`
- Name branches `<pattern, e.g. type/short-description>`
- <Allowed types, e.g. feat, fix, chore, docs>

## Commits

- Format: <e.g. Conventional Commits: type(scope): summary>
- <Summary rules, e.g. imperative mood, under 72 characters>
- <Size rule, e.g. one logical change per commit>

## Pull requests

- Title: <format>
- Description must include: <e.g. what changed, why, how it was tested>
- Before opening: <checks that must pass>

## Protected branches

- <Branches that must never be committed to directly>

## Permissions

- Claude may: <e.g. check status, view diffs and history>
- Ask first before: <e.g. committing, creating branches>
- Never: <e.g. push, force-push, rewrite history>
```

## Example

A filled-in file for a team using Conventional Commits and pull requests into `main`:

```markdown
# Git workflow

## Branches

- Start new work from an up-to-date `main`
- Name branches `type/short-description`, for example `fix/login-redirect`
- Types: feat, fix, chore, docs, refactor, test

## Commits

- Conventional Commits: `type(scope): summary`, for example `feat(cart): add discount codes`
- Summary in the imperative mood, under 72 characters, no full stop
- One logical change per commit; keep formatting changes in their own commit

## Pull requests

- Title matches the main commit, in Conventional Commits format
- Description covers what changed, why, and how it was tested, with screenshots for UI changes
- Before opening: lint, type check and tests all pass

## Protected branches

- Never commit directly to `main` or `release/*`

## Permissions

- Claude may: run `git status`, `git diff` and `git log`
- Ask first before: committing, creating or switching branches
- Never: push, force-push, rebase shared branches, or delete branches
```

## Tips

- **Give one real example per convention.** A single example commit message is clearer than a paragraph describing the format.
- **Separate "may", "ask first" and "never".** Clear limits prevent surprises such as an unexpected push.
- **Back up the "never" list with settings.** Rule files are guidance only. [Permission rules](/docs/permissions/) in `.claude/settings.json` can require approval for, or block, Git commands such as `git push`.
- **Keep personal habits personal.** How *you* like to word commits can go in `~/.claude/rules/` instead of the shared file.
