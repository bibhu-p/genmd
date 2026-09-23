---
title: Using GenMD Studio
description: How the six-step generator builds your CLAUDE.md, what each command permission policy means, and how your answers stay in your browser.
section: start
order: 2
---

GenMD Studio turns a short questionnaire into a structured `CLAUDE.md`. It works entirely in your browser from templates: there is no account, no AI service and nothing is uploaded.

## The six steps

1. **Project basics:** name, description, goals and project stage, plus optional target users and constraints.
2. **Technology stack:** project type, language, framework, package manager, database, styling and testing tools. Choosing a language narrows the other lists, and "Other" lets you type anything that is not listed.
3. **Development preferences:** coding standards, TypeScript strictness (for TypeScript projects), how cautious to be with dependencies, and accessibility expectations.
4. **Command permissions:** whether Claude may run Git, package manager, destructive, database and deployment commands.
5. **Testing and documentation:** which checks to include, whether documentation updates are required, and whether to add a Definition of Done checklist.
6. **Review and export:** check your answers, add custom instructions, then edit, preview, copy or download the file.

You can move back to any completed step. After editing an earlier answer, **Return to review** takes you straight back without clicking through every step.

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

> **Guidance, not enforcement:** permission rules in `CLAUDE.md` describe how you want Claude to behave. They do not technically block anything. To enforce them, add matching permission rules to `.claude/settings.json` as well; [Settings and permissions](/docs/permissions/#from-claudemd-to-enforced-rules) shows how.

## Using the file

1. Download `CLAUDE.md` and save it in the root of your project.
2. Read it through and adjust anything that does not fit. You know your project better than any template.
3. Commit it so everyone on the team, and every Claude Code session, uses the same instructions.
4. Update it as the project changes. A short, accurate file works better than a long, outdated one.

## Privacy

Your answers stay in the page. Generation happens in your browser, nothing is sent to a server, and nothing is stored after you close or reload the page. Your only saved preference is the light or dark theme, if you choose one.

## Limitations

- The output is built from templates. GenMD Studio does not read or analyse your codebase.
- Answers are not saved between visits, so download the file before leaving the page.
- The generated file is a starting point. Review it before relying on it.
