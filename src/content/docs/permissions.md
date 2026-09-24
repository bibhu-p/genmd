---
title: Settings and permissions
description: How Claude Code settings files work, how to write allow, ask and deny permission rules, and how to turn the rules in your CLAUDE.md into ones that are enforced.
section: configuration
order: 1
sources:
  - label: Settings
    url: https://code.claude.com/docs/en/settings
  - label: Configure permissions
    url: https://code.claude.com/docs/en/permissions
lastVerified: 2026-09-23
---

Instructions in `CLAUDE.md` shape what Claude *tries* to do. **Settings are different: Claude Code itself applies them.** Permission rules in a settings file decide which tools and commands run freely, which ask you first and which are blocked, whatever the instructions say.

## Settings files

Settings are JSON files. There are four you can use, plus settings your organisation may manage centrally.

| File | Applies to | Use it for |
| --- | --- | --- |
| `~/.claude/settings.json` | You, in every project on this machine | Personal defaults and your own permission rules |
| `.claude/settings.json` | Everyone working in this project, once committed | Team permissions, hooks and project environment variables |
| `.claude/settings.local.json` | You, in this project only | Personal overrides and trying rules before sharing them |
| Managed settings | Everyone your organisation deploys them to | Security and compliance policy; cannot be overridden |

### Which one wins

When the same setting appears in more than one place, the higher level wins:

1. Managed settings
2. Command line flags for the current session
3. `.claude/settings.local.json`
4. `.claude/settings.json`
5. `~/.claude/settings.json`

Lists such as `permissions.allow` are **combined** across files rather than replaced, so each file can add rules. And for permissions, **a deny rule at any level wins**: if your user settings allow something and the project denies it, it is denied.

### Keeping personal settings out of git

When you answer a permission prompt with "Yes, and don't ask again", Claude Code saves an allow rule to `.claude/settings.local.json`. When Claude Code creates that file itself, it also keeps it out of your commits. If you create it by hand, add it to `.gitignore` yourself.

> **Note:** allow rules committed in `.claude/settings.json` only take effect once you trust the folder, which Claude Code asks about when you open a project. This stops a cloned repository from quietly granting itself permissions. Committed `deny` and `ask` rules apply straight away.

## Permission rules

Rules go in a `permissions` object with three lists:

```json
{
  "permissions": {
    "allow": ["Bash(npm run test *)"],
    "ask": ["Bash(git push *)"],
    "deny": ["Read(./.env)"]
  }
}
```

- **allow:** Claude may use the tool without asking.
- **ask:** Claude Code asks you every time.
- **deny:** the tool use is blocked.

### How rules are checked

Rules are checked in a fixed order: **deny, then ask, then allow**. The first match decides, and a more specific rule does not change the order. That means a narrow allow rule cannot make an exception to a broad deny rule: if `Bash(aws *)` is denied, `Bash(aws s3 ls)` is denied too.

Anything that matches no rule falls back to the normal behaviour for the current permission mode, which usually means asking you.

### Writing rules

A rule is a tool name, optionally followed by a specifier in brackets:

| Rule | Matches |
| --- | --- |
| `Bash` | Every shell command |
| `Bash(npm run build)` | Exactly `npm run build` |
| `Bash(npm run *)` | Any `npm run` command |
| `Read(./.env)` | Reading `.env` in the project |
| `Edit(src/**)` | Editing anything under `src/` |
| `WebFetch(domain:example.com)` | Fetching pages from `example.com` |
| `mcp__github` | Every tool from the MCP server named `github` |

### Shell command patterns

- **Put the `*` after the subcommand.** `Bash(git log *)` allows only `git log` commands, while `Bash(git *)` allows every Git command.
- **A trailing ` *` also matches the bare command.** `Bash(ls *)` matches `ls` and `ls -la`.
- **The space matters.** `Bash(ls *)` does not match `lsof`, but `Bash(ls*)` does.
- **Chained commands are checked piece by piece.** An allow rule for `npm test` does not approve `npm test && rm -rf build`; each part must be allowed on its own, and a deny or ask rule applies if *any* part matches.

### File path patterns

`Read` and `Edit` rules use `.gitignore`-style patterns. Pay attention to the start of the path:

| Pattern | Means | Example |
| --- | --- | --- |
| `//path` | An absolute path | `Read(//Users/alice/secrets/**)` |
| `~/path` | A path in your home directory | `Read(~/.aws/**)` |
| `/path` | Relative to the settings file's project | `Edit(/src/**/*.ts)` |
| `path` or `./path` | Relative to the current directory | `Read(./.env)` |

> **Watch out:** a single leading slash is *not* an absolute path. `/Users/alice/file` means "`Users/alice/file` inside the project". Use two slashes for absolute paths.

Use `Edit` rules for anything that changes files and `Read` rules for anything that reads them; a `Read` deny also blocks editing that path.

## Know the limits

Permission rules are strong, but they match what Claude writes, not what a program ultimately does:

- **Shell rules match command text.** A deny rule for `Bash(rm *)` stops `rm -rf build/` but not `/bin/rm -rf build/` or `bash -c 'rm -rf build/'`, and `Bash(git push *)` does not stop `git -C . push`. Treat shell deny rules as a strong guard rail, not a security boundary.
- **File rules cover Claude's own tools** and common file commands such as `cat` and `sed`. They do not stop a script that opens files by itself.

For anything that must never happen, add a **hook** that inspects commands before they run, or use Claude Code's **sandboxing** for operating-system-level limits on files and network access.

## Permission modes

The permission mode sets the overall behaviour. Switch modes during a session, or set a starting mode with `permissions.defaultMode` in your settings. For safety, `auto` and `bypassPermissions` only take effect as a default from your user settings or managed settings, never from a project's files.

| Mode | Behaviour |
| --- | --- |
| `default` (Manual) | Asks the first time each tool is used |
| `acceptEdits` | Accepts file edits and common file commands in your working directory without asking |
| `plan` | Explores and reads but does not edit your source files |
| `auto` | Approves actions automatically, with background safety checks |
| `dontAsk` | Denies anything that would need a prompt; only pre-approved actions run |
| `bypassPermissions` | Skips permission prompts. Only use it in an isolated environment such as a container |

Run `/permissions` inside Claude Code to see every active rule, which file it comes from, and to add or remove rules on the spot.

## From CLAUDE.md to enforced rules

The permission policies in a GenMD Studio `CLAUDE.md` (or any CLAUDE.md) are guidance. To enforce them, mirror each policy in `.claude/settings.json`:

| Policy in CLAUDE.md | Settings list |
| --- | --- |
| Allow | `allow` |
| Ask first | `ask` |
| Never | `deny` |

**GenMD Studio can write this file for you.** On the [generator's](/generator/) review step, open *Enforce these rules with .claude/settings.json* for rules built from your answers, with commands matched to your stack. The template below shows the same idea if you prefer to start by hand.

### A starting point

A template for a typical JavaScript project. Replace the commands with the ones your project uses and delete what you do not need.

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run test *)",
      "Bash(npm run lint *)",
      "Bash(npm run build)"
    ],
    "ask": [
      "Bash(git commit *)",
      "Bash(git push *)",
      "Bash(npm install *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  }
}
```

- **Allow only specific scripts.** `Bash(npm run *)` would also allow `npm run deploy`; listing scripts one by one keeps risky ones behind a prompt.
- **Protect secrets with `Read` deny rules**, and keep secrets out of the repository in the first place.
- **Test changes locally first** in `.claude/settings.local.json`, then move them to `.claude/settings.json` when they work.
- **Pair deny rules with a hook** for commands that must never run; see [Hooks](/docs/hooks/).
