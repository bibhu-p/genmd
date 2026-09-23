---
title: Skills, subagents and MCP
description: Extend Claude Code with reusable skills, specialised subagents and MCP servers, with starter files for each and guidance on when to use which.
section: configuration
order: 3
sources:
  - label: Extend Claude with skills
    url: https://code.claude.com/docs/en/skills
  - label: Create custom subagents
    url: https://code.claude.com/docs/en/sub-agents
  - label: Connect to tools via MCP
    url: https://code.claude.com/docs/en/mcp
lastVerified: 2026-09-23
---

Once the basics are in place, three features help with repeated work: **skills** package a workflow you run often, **subagents** hand a job to a specialist with its own instructions, and **MCP servers** connect Claude to outside tools and data.

## Which one do you need?

| You want to | Use |
| --- | --- |
| Give Claude facts it needs in every session | `CLAUDE.md` |
| Add detailed rules for one area of the code | A rule file |
| Run the same multi-step procedure on demand, such as a release checklist | A skill |
| Hand a focused task to a specialist, such as reviewing code | A subagent |
| Let Claude use an outside system, such as an issue tracker or database | An MCP server |

## Skills

A skill is a folder containing a `SKILL.md` file. The folder name becomes a command you can type, such as `/release`, and Claude can also use the skill automatically when your request matches its description.

### Where skills live

| Location | Available |
| --- | --- |
| `~/.claude/skills/<name>/SKILL.md` | In all your projects |
| `.claude/skills/<name>/SKILL.md` | In this project; commit it to share with your team |
| `<folder>/.claude/skills/<name>/SKILL.md` | When working in that part of the repository |

Older custom commands in `.claude/commands/<name>.md` still work and behave the same way; skills add optional extras such as supporting files.

### Writing a skill

`SKILL.md` has YAML frontmatter followed by the instructions Claude follows when the skill runs:

```markdown
---
description: <What the skill does and when to use it. Put the main use case first.>
disable-model-invocation: true
---

<Step-by-step instructions for Claude.>

1. <Step>
2. <Step>
3. <Step>
```

- **`description`** is what Claude uses to decide when the skill is relevant. Make it specific.
- **`disable-model-invocation: true`** means only you can start the skill. Use it for anything with side effects, such as deploying or sending messages, so Claude never runs it on its own initiative.
- **`user-invocable: false`** does the opposite: the skill becomes background knowledge only Claude uses.
- **`$ARGUMENTS`** in the instructions is replaced with whatever you type after the command, as in `/fix-issue 123`.
- A line such as `` !`git diff HEAD` `` runs the command first and inserts its output, so the skill starts with live information.

A skill folder can also hold supporting files, such as scripts, templates or reference notes, that the instructions point to.

### Example

A project skill at `.claude/skills/release-notes/SKILL.md`:

```markdown
---
description: Drafts release notes from the commits since the last tag. Use when preparing a release.
disable-model-invocation: true
---

## Commits since the last release

!`git log $(git describe --tags --abbrev=0)..HEAD --oneline`

## Instructions

1. Group the commits above into Features, Fixes and Other.
2. Rewrite each one as a short, user-facing sentence.
3. Leave out commits that only touch tests or tooling.
4. Show the draft and wait for approval before saving it to CHANGELOG.md.
```

## Subagents

A subagent is a specialised assistant with its own instructions, tools and optionally its own model. Claude can hand it a task, and the subagent works on it separately before reporting back, which keeps the main conversation focused.

### Where subagents live

| Location | Available |
| --- | --- |
| `~/.claude/agents/<name>.md` | In all your projects |
| `.claude/agents/<name>.md` | In this project; commit it to share with your team |

### Writing a subagent

A subagent file has YAML frontmatter followed by its instructions:

```markdown
---
name: <short-name>
description: <What this subagent does and when Claude should use it.>
tools: <Comma-separated tools it may use, e.g. Read, Glob, Grep>
model: <sonnet, opus, haiku, or inherit>
---

<Instructions: its role, how to work and what to report back.>
```

- **`name`** and **`description`** are required. Claude uses the description to decide when to delegate.
- **`tools`** limits what the subagent can do. Leave it out to allow the same tools as the main conversation; a read-only list is a good default for reviewers.
- The body becomes the subagent's instructions. It receives only these instructions and basic details such as the working directory, so include everything it needs to know.

### Example

A read-only reviewer at `.claude/agents/code-reviewer.md`:

```markdown
---
name: code-reviewer
description: Reviews changed code for bugs, security issues and readability. Use after finishing a feature or before a commit.
tools: Read, Glob, Grep
model: sonnet
---

You are a careful code reviewer.

1. Read the changed files and the code they call.
2. Look for bugs, missing error handling, security issues and unclear names.
3. Report findings as a list ordered by severity, each with the file, line and a suggested fix.
4. Do not edit any files.
```

To use it, ask Claude directly ("use the code-reviewer subagent on my changes"), or let Claude delegate when a task matches the description.

## MCP servers

The Model Context Protocol (MCP) lets Claude Code use tools from outside systems, such as issue trackers, databases, browsers or internal APIs, through small servers that expose those tools.

### Sharing servers with your team

Project servers go in `.mcp.json` at the root of your repository. Commit it so everyone gets the same servers:

```json
{
  "mcpServers": {
    "<server-name>": {
      "type": "stdio",
      "command": "<command that starts the server>",
      "args": ["<argument>"],
      "env": { "API_KEY": "${API_KEY}" }
    },
    "<remote-server-name>": {
      "type": "http",
      "url": "https://<server-url>/mcp",
      "headers": { "Authorization": "Bearer ${AUTH_TOKEN}" }
    }
  }
}
```

- **`stdio` servers** run as a local program; **`http` servers** are remote.
- **Never commit secrets.** Use `${VAR}` to read a value from each person's environment, or `${VAR:-default}` to provide a fallback.
- **Each person approves project servers** the first time Claude Code finds them, so a repository cannot connect tools without consent.

You can also add servers from the terminal. Adding `--scope project` writes the server to `.mcp.json`:

```bash
claude mcp add --scope project --transport http <server-name> https://<server-url>/mcp
claude mcp list
```

### Choosing servers

- **Only add servers you trust.** An MCP server can see what Claude sends it and can return content Claude will act on.
- **Start small.** Each server adds tools Claude has to choose between; add the ones you actually use.
- **Control access with permissions.** MCP tools follow the same allow, ask and deny rules, for example `mcp__github` for every tool from a server named `github`.
