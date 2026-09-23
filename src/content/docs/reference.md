---
title: Cheat sheet
description: Every Claude Code customisation file, command and key setting on one page, plus a starter .claude folder and settings file to copy.
section: reference
order: 1
sources:
  - label: Explore the .claude directory
    url: https://code.claude.com/docs/en/claude-directory
  - label: Memory and CLAUDE.md files
    url: https://code.claude.com/docs/en/memory
  - label: Settings
    url: https://code.claude.com/docs/en/settings
  - label: Configure permissions
    url: https://code.claude.com/docs/en/permissions
lastVerified: 2026-09-23
---

A quick reference to everything covered in these docs. Follow the links for details.

## Files

| File | What it is for | Commit it? | Guide |
| --- | --- | --- | --- |
| `CLAUDE.md` or `.claude/CLAUDE.md` | Project instructions loaded every session | Yes | [Writing a CLAUDE.md](/docs/claude-md/) |
| `CLAUDE.local.md` | Your personal notes for this project | No | [Writing a CLAUDE.md](/docs/claude-md/) |
| `~/.claude/CLAUDE.md` | Your personal instructions for every project | Not in a project | [Writing a CLAUDE.md](/docs/claude-md/) |
| `.claude/rules/*.md` | Topic rules, optionally limited with `paths` | Yes | [Project rule files](/docs/rule-files/) |
| `~/.claude/rules/*.md` | Your personal rules for every project | Not in a project | [Project rule files](/docs/rule-files/) |
| `.claude/settings.json` | Team permissions, hooks and settings | Yes | [Settings and permissions](/docs/permissions/) |
| `.claude/settings.local.json` | Your overrides for this project | No | [Settings and permissions](/docs/permissions/) |
| `~/.claude/settings.json` | Your settings for every project | Not in a project | [Settings and permissions](/docs/permissions/) |
| `.claude/hooks/` | Scripts that your hooks run | Yes | [Hooks](/docs/hooks/) |
| `.claude/skills/<name>/SKILL.md` | A reusable workflow, run as `/<name>` | Yes | [Skills, subagents and MCP](/docs/extending/) |
| `.claude/agents/<name>.md` | A specialised subagent | Yes | [Skills, subagents and MCP](/docs/extending/) |
| `.mcp.json` | MCP servers shared with the team | Yes | [Skills, subagents and MCP](/docs/extending/) |

## Commands inside Claude Code

| Command | What it does |
| --- | --- |
| `/init` | Drafts a `CLAUDE.md` from your codebase, or suggests improvements to an existing one |
| `/memory` | Opens your instruction files and manages auto memory |
| `/context` | Shows what is loaded into the session, including instruction files |
| `/permissions` | Views, adds and removes permission rules |
| `/hooks` | Lists configured hooks by event |
| `/config` | Opens the settings menu |
| `/compact` | Summarises the conversation to free up context |

## Terminal commands

| Command | What it does |
| --- | --- |
| `claude --debug` | Starts with debug output, useful for hooks and rule files that do not load |
| `claude mcp add ...` | Adds an MCP server; add `--scope project` to save it to `.mcp.json` |
| `claude mcp list` | Lists MCP servers and their status |

## Key settings

| Setting | Purpose |
| --- | --- |
| `permissions.allow` / `ask` / `deny` | Which tools and commands run freely, ask first or are blocked |
| `permissions.defaultMode` | The permission mode sessions start in, such as `plan` or `acceptEdits` |
| `hooks` | Commands to run automatically at set events |
| `env` | Environment variables for every session in this scope |
| `claudeMdExcludes` | `CLAUDE.md` or rule files to skip, useful in monorepos |
| `disableAllHooks` | Turns hooks off; hooks from managed settings keep running unless it is set there too |

## Rule-checking order

- Permission rules: **deny, then ask, then allow**. The first match wins, and a deny at any settings level cannot be overridden.
- Settings: **managed, then command line, then `settings.local.json`, then `settings.json`, then user settings**. Lists combine across levels.
- Instruction files: all found files are **combined**, read from the top of the filesystem down, so the most specific file is read last.

## Starter layout

```text
your-project/
├── CLAUDE.md
├── .mcp.json
└── .claude/
    ├── settings.json
    ├── rules/
    │   ├── design-guide.md
    │   └── testing.md
    ├── hooks/
    │   └── protect-files.sh
    ├── skills/
    │   └── release-notes/
    │       └── SKILL.md
    └── agents/
        └── code-reviewer.md
```

Add `CLAUDE.local.md` and `.claude/settings.local.json` to your `.gitignore`.

## Starter settings file

A minimal `.claude/settings.json` to adapt:

```json
{
  "permissions": {
    "allow": ["Bash(npm run test *)", "Bash(npm run lint *)"],
    "ask": ["Bash(git commit *)", "Bash(git push *)"],
    "deny": ["Bash(rm -rf *)", "Read(./.env)", "Read(./.env.*)"]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/protect-files.sh" }
        ]
      }
    ]
  }
}
```
