---
title: Customising Claude Code
description: A practical guide to the files that shape how Claude Code works in your project, what to put in each one, and templates to start from.
section: start
order: 1
sources:
  - label: Memory and CLAUDE.md files
    url: https://code.claude.com/docs/en/memory
  - label: The .claude directory
    url: https://code.claude.com/docs/en/claude-directory
  - label: Settings
    url: https://code.claude.com/docs/en/settings
lastVerified: 2026-09-23
---

Claude Code learns how your project works from plain files that live next to your code. Some of them are **instructions** that Claude reads and follows, like a briefing for a new teammate. Others are **configuration** that Claude Code itself enforces, such as which commands need your approval.

These docs explain each file, what belongs in it, and how to write it well. The rule file guides include templates you can copy and fill in with your own details. GenMD Studio generates your `CLAUDE.md`; everything here helps you take it further.

## The files at a glance

A project that uses every customisation option looks like this. Most projects only need a few of them.

```text
your-project/
├── CLAUDE.md                 # Project instructions, shared with the team
├── CLAUDE.local.md           # Your personal notes for this project (keep out of git)
├── .mcp.json                 # MCP servers shared with the team
└── .claude/
    ├── settings.json         # Permissions, hooks and other settings (shared)
    ├── settings.local.json   # Your personal overrides (keep out of git)
    ├── rules/                # Topic rule files, optionally limited to certain paths
    │   └── design-guide.md
    ├── skills/               # Reusable workflows, run as /skill-name
    │   └── release/
    │       └── SKILL.md
    ├── agents/               # Custom subagents with their own instructions
    │   └── code-reviewer.md
    └── hooks/                # Scripts that hooks in settings.json run
```

The project `CLAUDE.md` can also live at `.claude/CLAUDE.md` if you prefer to keep everything inside the `.claude` folder.

## Instructions or configuration?

The most useful distinction to keep in mind is whether a file **guides** Claude or **enforces** something.

| File | What it does | Enforced? |
| --- | --- | --- |
| `CLAUDE.md` | Project context, conventions and working rules | No, Claude follows it as guidance |
| `.claude/rules/*.md` | Detailed rules for one topic, such as design or testing | No, guidance |
| `.claude/settings.json` | Permissions, hooks, environment and other settings | Yes, applied by Claude Code |
| Hooks | Scripts that run automatically at set points, such as before a command | Yes, they always run |
| Skills and subagents | Reusable workflows and specialised helpers | No, Claude uses them when relevant or when you ask |

> **Rule of thumb:** write preferences and conventions as instructions. Anything that must *never* happen, such as deleting files or pushing to production, also belongs in configuration, because instructions can be misread or forgotten.

## Shared or personal?

Decide who each file is for before you write it.

- **Commit to git (shared with your team):** `CLAUDE.md`, `.claude/settings.json`, `.claude/rules/`, `.claude/skills/`, `.claude/agents/` and `.mcp.json`.
- **Keep out of git (just for you, in this project):** `CLAUDE.local.md` and `.claude/settings.local.json`. Add `CLAUDE.local.md` to your `.gitignore`. Claude Code keeps `settings.local.json` out of your commits when it creates the file; if you create it by hand, add it too.
- **Just for you, in every project:** `~/.claude/CLAUDE.md` and `~/.claude/settings.json` in your home directory.

## Where to start

1. **Create a `CLAUDE.md`.** Generate one with GenMD Studio, or run `/init` inside Claude Code to have it draft one from your codebase. Then trim it so it only contains what Claude needs in every session.
2. **Move detailed topics into rule files.** Design systems, API conventions and testing strategy are easier to maintain as separate files in `.claude/rules/`.
3. **Enforce the non-negotiables.** Use [permission rules](/docs/permissions/) in `.claude/settings.json`, and [hooks](/docs/hooks/) for anything that must always or never happen.
4. **Automate repeated workflows** with [skills, subagents or MCP servers](/docs/extending/) once you notice yourself giving Claude the same multi-step instructions.
