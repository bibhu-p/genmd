---
title: Testing strategy
description: A rule file template for how your project is tested, covering tools, what to test, file locations, mocking, test data and when tests must run.
section: rules
order: 3
sources:
  - label: Path-specific rules
    url: https://code.claude.com/docs/en/memory
lastVerified: 2026-09-23
---

Claude can write tests quickly, but not necessarily the tests *you* want: the right level, the right tools and the right amount of mocking. A testing strategy file spells that out.

## When to use it

- Your project has automated tests, or you want Claude to start writing them consistently.
- You have preferences about unit versus integration tests, mocking or test data.
- Tests written by Claude pass but do not match the style of the rest of the suite.

## Where to save it

Save it as `.claude/rules/testing.md`. Scope it with `paths` to your test files, for example `tests/**` and `**/*.test.ts`. If you also want Claude to remember to *write* tests while working on source files, leave out `paths` so it loads in every session, or keep the key rule ("add tests for new behaviour") in `CLAUDE.md`.

## What to include

- **Tools and commands:** the test runner and how to run all or one test.
- **What to test:** which kinds of tests you expect for which kinds of change.
- **Where tests live and how they are named.**
- **How to write tests:** structure, naming and assertions.
- **Mocking:** what may and may not be mocked.
- **Test data:** fixtures, factories and anything that must never be used.
- **When tests must run** and what counts as passing.

## Template

```markdown
---
paths:
  - "<test folder, e.g. tests/**>"
  - "<test file pattern, e.g. **/*.test.ts>"
---

# Testing strategy

## Tools and commands

- Runner: <test framework>
- Run all tests: `<command>`
- Run one file: `<command> <path>`

## What to test

- <e.g. unit tests for all business logic in src/lib/>
- <e.g. an integration test for every API endpoint>
- <e.g. a regression test for every bug fix>

## Where tests live

- <Location, e.g. next to the source file as name.test.ts>
- <Naming convention for test files and test cases>

## Writing tests

- <Structure, e.g. arrange / act / assert>
- <One behaviour per test>
- <Assertion style>

## Mocking

- Mock: <what may be mocked, e.g. network calls and time>
- Do not mock: <what must be real, e.g. the code under test>

## Test data

- <Where fixtures or factories live>
- <What must never be used, e.g. production data>

## Before finishing

- <e.g. run the full suite and make sure it passes>
- <What to do when a test fails>
```

## Example

A filled-in file for a TypeScript project using Vitest and Playwright:

```markdown
---
paths:
  - "tests/**"
  - "src/**/*.test.ts"
---

# Testing strategy

## Tools and commands

- Unit and integration tests: Vitest. End-to-end tests: Playwright.
- Run all unit tests: `npm test`
- Run one file: `npx vitest run src/lib/pricing.test.ts`
- End-to-end: `npm run test:e2e` (needs the dev server running)

## What to test

- Unit tests for every function in `src/lib/`
- One end-to-end test per critical user journey in `tests/e2e/`
- A regression test for every bug fix, named after the issue

## Where tests live

- Unit tests sit next to the code: `pricing.ts` and `pricing.test.ts`
- Test names describe behaviour: "applies the discount when the basket is over 50"

## Writing tests

- Arrange, act, assert, separated by blank lines
- One behaviour per test; no loops over many cases inside one test (use `it.each`)

## Mocking

- Mock: network requests (with MSW) and the current time (`vi.useFakeTimers`)
- Do not mock: modules in `src/lib/`; test them for real

## Test data

- Build objects with the factories in `tests/factories/`
- Never copy real customer data into tests

## Before finishing

- Run `npm test` and make sure every test passes
- Never delete or skip a failing test to make the suite pass; fix the cause or ask
```

## Tips

- **Give the exact commands**, including how to run a single test. It saves Claude running the whole suite repeatedly.
- **Say what not to mock.** Over-mocked tests pass while the real code is broken.
- **Forbid "fixing" tests by deleting them.** It is worth stating explicitly.
- **Pair it with a check in your workflow.** Rule files are guidance; if tests must always run before a commit, a [hook](/docs/hooks/) can enforce it.
