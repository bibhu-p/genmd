---
title: Using GenMD Studio
description: How the six-step generator builds your CLAUDE.md and settings.json, how starter presets work, and how your answers stay in your browser.
section: start
order: 2
---

GenMD Studio turns a short questionnaire into a structured `CLAUDE.md`. It works entirely in your browser from templates: there is no account, no AI service and nothing is uploaded.

## The six steps

1. **Project basics:** name, description, goals and project stage, plus optional target users and constraints. You can also start from a preset here (see below).
2. **Technology stack:** project type, language, framework, package manager, database, styling and testing tools. Choosing a language narrows the other lists, and "Other" lets you type anything that is not listed.
3. **Development preferences:** coding standards, TypeScript strictness (for TypeScript projects), how cautious to be with dependencies, and accessibility expectations.
4. **Command permissions:** whether Claude may run Git, package manager, destructive, database and deployment commands.
5. **Testing and documentation:** which checks to include, whether documentation updates are required, and whether to add a Definition of Done checklist.
6. **Review and export:** check your answers, add custom instructions, then edit, preview, copy or download the file. An optional panel below it gives you a matching `.claude/settings.json`.

You can move back to any completed step. After editing an earlier answer, **Return to review** takes you straight back without clicking through every step.

## Starting from a preset

At the top of step 1, **Start from a preset** fills in steps 2 to 5 for a common setup: Astro static site, Next.js full-stack app, React single-page app, Node.js REST API, Python FastAPI service, Django web app, Go API service or Rust command-line tool. Choose one and select **Apply preset**.

- A preset sets the technology stack, development preferences and checks. It never changes your project details or command permissions, which start at *Ask first*.
- Everything it fills in stays editable. If you have already changed any of those steps yourself, you are asked before anything is replaced.
- Choosing **Blank** and applying it puts steps 2 to 5 back to their defaults.
- You can link straight to a preset: `/generator/?preset=nextjs-fullstack` opens the generator with it applied. The cards under "Popular starting points" on the home page work this way.

## What the generated file contains

The file always includes a project overview, technology stack, architecture guidance, development workflow, coding standards, error handling and security, and scope management. Other sections appear only when your answers call for them:

- **Command Permissions**, when at least one category is not set to *Allow*.
- **Testing and Verification**, when you include any checks.
- **Documentation** and **Definition of Done**, when you turn them on.
- **Additional Instructions**, when you write custom instructions. These are added exactly as you typed them.

## Command permission policies

For each category of command you choose one policy:

| Policy | What Claude is told |
| --- | --- |
| **Allow** | It may run these without asking. |
| **Ask first** | It must explain the command and wait for your approval. |
| **Never** | It must not run these at all, and should tell you what is needed instead. |

The categories are **Git commands** (commits, pushes, branch changes), **package manager commands** (installing packages and running scripts), **destructive operations** (deleting or overwriting files), **database operations** (migrations, resets, direct data changes) and **deployment** (publishing to any environment). Database rules are only included when your project has a database.

> **Guidance, not enforcement:** permission rules in `CLAUDE.md` describe how you want Claude to behave. They do not technically block anything. To enforce them, use the settings file described below.

## Enforcing permissions with settings.json

On the review step, open **Enforce these rules with .claude/settings.json**. It contains permission rules that Claude Code applies itself, built from the same answers:

| Policy | Settings list |
| --- | --- |
| **Allow** | `allow` |
| **Ask first** | `ask` |
| **Never** | `deny` |

- The commands match your stack: your package manager's install and script commands, your database's client and your framework's migration commands, common deploy tools and your package manager's publish command.
- Read-only Git commands such as `git status` and `git diff` are always allowed, as the `CLAUDE.md` says.
- Rules that stop Claude reading `.env` and `.env.*` files are always included. That also covers `.env.example`; because deny rules always win, an allow rule cannot make an exception, so edit or remove the `.env.*` rule if Claude needs to read it.
- Tools you typed under "Other" get no rules; add your own.

The file is editable, and a warning appears if your edits break the JSON. Download it and save it as `.claude/settings.json` to share it with your team, or as `.claude/settings.local.json` to keep it to yourself.

> **A guard rail, not a sandbox:** shell rules match the command text, so a command run another way (for example through `bash -c`) can get past them. [Settings and permissions](/docs/permissions/#know-the-limits) explains the limits and what to add for commands that must never run.

## Using the file

1. Download `CLAUDE.md` and save it in the root of your project. If you want the permissions enforced, save `settings.json` in the project's `.claude/` folder too.
2. Read it through and adjust anything that does not fit. You know your project better than any template.
3. Commit it so everyone on the team, and every Claude Code session, uses the same instructions.
4. Update it as the project changes. A short, accurate file works better than a long, outdated one.

## Privacy

Your answers stay in the page. Generation happens in your browser, nothing is sent to a server, and nothing is stored after you close or reload the page. Your only saved preference is the light or dark theme, if you choose one.

## Limitations

- The output is built from templates. GenMD Studio does not read or analyse your codebase.
- Answers are not saved between visits, so download the file before leaving the page.
- The generated file is a starting point. Review it before relying on it.
