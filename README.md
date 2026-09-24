# GenMD Studio

GenMD Studio is a static web app that helps developers write a project-specific `CLAUDE.md` for [Claude Code](https://claude.com/claude-code). A six-step questionnaire collects your project details, stack, coding preferences, command permissions and verification rules, then generates a structured Markdown file you can edit, preview, copy and download.

Everything runs in the browser. There is no backend, no account and no AI API: generation is template-based and deterministic.

## Features

- **Guided questionnaire:** project basics, technology stack, development preferences, command permissions, testing and documentation, then review.
- **Starter presets:** start from one of eight common stacks (Astro, Next.js, React, Node.js API, FastAPI, Django, Go and Rust), either from Step 1 or with a `/generator/?preset=<id>` link. A preset fills in the stack, preferences and checks, never your project details or permissions.
- **Smart fields:** "Other" choices reveal a text box, and picking a language narrows the framework, package manager and testing tool options.
- **Validation:** checks each step before moving on, with an error summary and inline messages linked to each field.
- **Easy navigation:** answers are kept while you move between steps, completed steps can be revisited from the stepper, and "Return to review" skips back after an edit.
- **Conditional output:** optional sections (permissions, testing, documentation, Definition of Done, custom instructions) appear only when your answers call for them.
- **Editable result:** edit the Markdown directly or switch to a rendered preview. Your edits are never overwritten without confirmation.
- **Export:** copy to the clipboard or download as `CLAUDE.md`.
- **Enforceable permissions:** an optional `.claude/settings.json` whose `allow`, `ask` and `deny` rules mirror your permission choices, with commands matched to your stack, plus rules that stop Claude reading `.env` files.
- **Docs:** a multi-page guide to customising Claude Code (CLAUDE.md, rule files, settings and permissions, hooks, skills, subagents and MCP), with copyable templates for common rule files.
- **Light and dark themes:** follows the system setting by default; choosing a theme with the toggle is remembered in `localStorage`.
- **Accessible:** semantic HTML, labelled controls, keyboard support, visible focus states and reduced-motion support.

## Technology stack

| Area | Choice |
| --- | --- |
| Framework | [Astro](https://astro.build) 7, static output |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` |
| Markdown preview | [markdown-it](https://github.com/markdown-it/markdown-it), loaded on demand |
| Docs | Astro content collections (Markdown) with built-in Shiki highlighting |
| Tests | [Vitest](https://vitest.dev) |
| Package manager | npm |

There is no UI framework. Pages and form steps are Astro components, and the generator is a single bundled TypeScript module.

## Getting started

Requirements: Node.js 22.12 or newer. The repository includes an `.nvmrc` (Node 24).

```sh
nvm use          # optional, picks up .nvmrc
npm install
npm run dev      # http://localhost:4321
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run check` | Type-check Astro and TypeScript files (`astro check`) |
| `npm test` | Run the unit tests once (`vitest run`) |
| `npm run test:watch` | Run the unit tests in watch mode |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Serve the built site locally |

## Project structure

```text
src/
├── components/
│   ├── docs/        # Docs sidebar navigation
│   ├── generator/   # Step components, stepper, review/output step, form shell
│   ├── landing/     # Landing page pieces (editor-style preview)
│   ├── layout/      # Header, footer, theme toggle
│   └── ui/          # Form controls and buttons
├── content/
│   └── docs/        # Docs pages as Markdown (one file per page)
├── content.config.ts # Docs collection schema
├── data/            # Option lists, presets, defaults, sample project, generated-file wording,
│                    # settings.json command patterns, docs sections
├── layouts/         # Base layout and the docs layout
├── lib/
│   ├── generator/   # Validation, normalization, section and settings generators, presets, controller
│   │   └── dom/     # DOM-only helpers (errors, conditional fields, output panels, preset picker)
│   ├── docs.ts      # Loads docs pages in reading order
│   ├── docs-nav.ts  # Docs ordering and navigation helpers
│   ├── download.ts
│   └── highlight.ts
├── pages/           # /, /generator/, /docs/ and /docs/[...slug]
├── styles/          # Tailwind entry point, design tokens, docs typography
└── types/           # Domain types (FormState, ProjectConfig, Preset)
tests/               # Vitest unit tests for the pure logic
docs/ARCHITECTURE.md # Design decisions
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how the pieces fit together.

## Development workflow

1. Make a focused change.
2. Run `npm run check`, `npm test` and `npm run build`.
3. Check the affected pages in the browser, in both themes and at mobile width.

Generated-file wording lives in `src/data/templates.ts`, so copy changes rarely need logic changes. When you change the wording or section logic, update `tests/generate.test.ts` to match.

The shell commands used in the generated `settings.json` live in `src/data/permission-patterns.ts`, keyed by option value. Presets live in `src/data/presets.ts`; `tests/presets.test.ts` checks that every preset uses real options that fit its language, so a typo fails the tests.

### Adding or editing a docs page

Docs pages are Markdown files in `src/content/docs/`. The file path sets the URL: `rules/design-guide.md` is served at `/docs/rules/design-guide/`. Each file needs frontmatter, which the build validates against `src/content.config.ts`:

```yaml
---
title: Page title
description: One sentence, under 170 characters, used for the intro and meta description.
section: instructions   # start, instructions, rules, configuration or reference
order: 3                # position within the section
sources:                # official pages the content was checked against (optional)
  - label: Memory and CLAUDE.md files
    url: https://code.claude.com/docs/en/memory
lastVerified: 2026-09-23 # when it was last checked (optional)
---
```

The sidebar, the "All guides" list on `/docs/`, previous/next links and the sitemap all update automatically. Code blocks get syntax highlighting and a Copy button. Claude Code changes often, so re-check pages against their sources and update `lastVerified` when you do.

## Building and deploying

`npm run build` produces a fully static site in `dist/`. It needs no server runtime or environment variables. Deploy that folder to any static host, for example:

- **Netlify / Cloudflare Pages / Vercel:** build command `npm run build`, output directory `dist`.
- **GitHub Pages:** publish `dist/` with a Pages workflow. If the site is served from a sub-path (such as `/genmd/`), set `base` (and `site`) in `astro.config.ts` first.

Pages are built as `/<route>/index.html`, which every static host above serves without extra configuration.

### SEO

The production URL is set as `site` in `astro.config.ts` (currently `https://genmdstudio.netlify.app`). Change it if you deploy elsewhere: canonical links, Open Graph and Twitter preview URLs, `sitemap.xml` and the sitemap line in `robots.txt` are all built from it. If `site` is removed, those URL-based tags are skipped and the sitemap is published empty.

- Page titles, descriptions and social tags are set per page through `BaseLayout` props.
- The home page includes `WebApplication` and `FAQPage` structured data (JSON-LD).
- `sitemap.xml` and `robots.txt` are generated by `src/pages/sitemap.xml.ts` and `src/pages/robots.txt.ts`. Docs pages are added to the sitemap automatically; add any other new route to the list in the sitemap file.
- The social preview image is `public/og-image.png` (1200×630).
- The 404 page is marked `noindex`.

## Known limitations

- **No persistence.** Answers live in memory only and are lost on reload. Download the file before leaving the page.
- **CLAUDE.md is guidance, not enforcement.** Its permission rules tell Claude how to behave; they do not block commands. The optional `settings.json` export adds enforcement, but its shell rules match command text, so a command run another way (for example through `bash -c`) can get past them. Tools typed under "Other" get no command rules.
- **Command lists are curated.** The `settings.json` rules cover common tools for each listed stack and will miss some. Review the file before committing it.
- **Template-based output.** GenMD Studio does not read your codebase, so architecture guidance is general rather than project-specific.
- **Dropdown styling varies by browser.** The closed state is styled everywhere. The open list is fully styled only in browsers that support customizable selects (`appearance: base-select`, currently Chromium-based); Firefox and Safari show their native list.
- **Language filtering is limited to listed languages.** Choosing "Other" as the language shows every framework and tool.
- **English only.**

## Future improvements

These are ideas, not commitments, and are out of scope for the MVP:

- **Rules builder:** fill in a form (for example a design guide's colours, typography and spacing) and generate a ready-to-save `.claude/rules/<topic>.md` file, reusing the rule file templates from the docs. See the architecture notes for a sketch.
- Save and load answers as a JSON file, or keep an optional local draft.
- Optional AI-assisted refinement of the generated file (see the architecture notes for how it could be added).
- End-to-end browser tests for the questionnaire flow.
