---
title: Hooks
description: Run your own commands automatically at set points in a Claude Code session to format code, block risky actions or send notifications, every single time.
section: configuration
order: 2
sources:
  - label: Automate actions with hooks
    url: https://code.claude.com/docs/en/hooks-guide
  - label: Hooks reference
    url: https://code.claude.com/docs/en/hooks
lastVerified: 2026-09-23
---

Instructions in `CLAUDE.md` are followed most of the time. **Hooks run every time.** A hook is a command that Claude Code runs automatically when something happens, such as before a tool is used or after a file is edited. Use hooks for anything that must always happen, or must never happen, rather than hoping Claude remembers.

## When to use a hook

| Use an instruction when | Use a hook when |
| --- | --- |
| Claude should use judgement | The action must happen every single time |
| The rule is a preference or convention | Breaking the rule would cause real damage |
| Examples: naming, structure, tone | Examples: formatting after edits, blocking edits to `.env`, notifications |

A common pattern is to keep a rule in `CLAUDE.md` so Claude understands it, and back it up with a hook so it is enforced.

## Where hooks are configured

Hooks live in the `hooks` object of a settings file:

| File | Scope | Shared? |
| --- | --- | --- |
| `~/.claude/settings.json` | All your projects | No |
| `.claude/settings.json` | This project | Yes, when committed |
| `.claude/settings.local.json` | This project, just you | No |

Keep hook scripts in `.claude/hooks/` and commit them with the project. Run `/hooks` inside Claude Code to see every configured hook, grouped by event.

## How a hook is written

Each hook names an **event**, an optional **matcher** and the **command** to run:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/format.sh" }
        ]
      }
    ]
  }
}
```

- **Event:** when the hook runs, here after a tool succeeds.
- **Matcher:** which tools it applies to. `"Edit|Write"` matches either tool; an empty string matches everything.
- **Command:** what to run. `$CLAUDE_PROJECT_DIR` points to your project root, so the path works wherever Claude is started.

To add hooks for several events, put each event name as a separate key inside the one `hooks` object.

### Useful events

| Event | Runs |
| --- | --- |
| `SessionStart` | When a session starts or resumes |
| `UserPromptSubmit` | When you send a prompt, before Claude reads it |
| `PreToolUse` | Before a tool runs; **can block it** |
| `PostToolUse` | After a tool succeeds |
| `Notification` | When Claude Code sends a notification, such as needing your input |
| `Stop` | When Claude finishes responding |
| `InstructionsLoaded` | When a `CLAUDE.md` or rule file loads; handy for debugging rules |
| `SessionEnd` | When a session ends |

There are many more events, including ones for subagents, compaction and configuration changes; the official hooks reference lists them all.

### What a hook receives and returns

- Claude Code passes details about the event to your command as **JSON on standard input**, for example the tool name and its input, such as the file path being edited or the command about to run.
- The **exit code** tells Claude Code what to do next:
  - **0:** no objection. For `PreToolUse` this does not approve anything; normal permission rules still apply.
  - **2:** block the action. Write the reason to standard error; for tool events, Claude receives it as feedback and can change its approach.
  - **Anything else:** reported as a non-blocking error, and the action continues.

## Example: format files after every edit

Run Prettier on each file Claude edits. This one-liner uses `jq` to read the file path from the hook input:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write" }
        ]
      }
    ]
  }
}
```

## Example: protect sensitive files

Block edits to `.env`, lock files and the `.git` folder. First, save this script as `.claude/hooks/protect-files.sh`:

```bash
#!/bin/bash
# Blocks edits to protected files. Exit code 2 stops the edit.
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

PROTECTED=(".env" "package-lock.json" ".git/")

for pattern in "${PROTECTED[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "Blocked: $FILE_PATH is a protected file ($pattern)" >&2
    exit 2
  fi
done

exit 0
```

Make it executable on macOS and Linux:

```bash
chmod +x .claude/hooks/protect-files.sh
```

Then register it in `.claude/settings.json` so it runs before every edit:

```json
{
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

To test it, ask Claude to add a comment to your `.env` file. The edit is blocked and Claude is told why.

## Example: get notified when Claude needs you

On macOS, show a desktop notification whenever Claude is waiting for input. This is a personal preference, so it belongs in `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude Code needs your attention\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

## Use hooks safely

- **Hooks run commands automatically with your user's permissions.** Read the hooks in any project you clone before starting Claude Code in it, just as you would read a script before running it.
- **Keep scripts small and focused.** One job per script is easier to review and debug.
- **Quote paths**, as in `"$CLAUDE_PROJECT_DIR"`, so folders with spaces still work.

## When a hook does not work

1. Run `/hooks` and check that the hook is listed under the right event.
2. Check the matcher matches the tool name exactly, for example `Edit`, not `edit`.
3. Make sure the script is executable and any tools it uses, such as `jq`, are installed.
4. Start Claude Code with `claude --debug` to see hook output and errors.

To switch hooks off temporarily, set `"disableAllHooks": true` in a settings file. Hooks from your organisation's managed settings keep running unless it is set there too.
