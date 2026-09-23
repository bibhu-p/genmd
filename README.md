# GenMD

GenMD is a static web app that helps developers write a project-specific `CLAUDE.md` for [Claude Code](https://claude.com/claude-code). A six-step questionnaire collects your project details, stack, coding preferences, command permissions and verification rules, then generates a structured Markdown file you can edit, preview, copy and download.

Everything runs in the browser. There is no backend, no account and no AI API: generation is template-based and deterministic.

## Features

- **Guided questionnaire:** project basics, technology stack, development preferences, command permissions, testing and documentation, then review.
- **Smart fields:** "Other" choices reveal a text box, and picking a language narrows the framework, package manager and testing tool options.
- **Validation:** checks each step before moving on, with an error summary and inline messages linked to each field.
- **Easy navigation:** answers are kept while you move between steps, completed steps can be revisited from the stepper, and "Return to review" skips back after an edit.
- **Conditional output:** optional sections (permissions, testing, documentation, Definition of Done, custom instructions) appear only when your answers call for them.
- **Editable result:** edit the Markdown directly or switch to a rendered preview. Your edits are never overwritten without confirmation.
- **Export:** copy to the clipboard or download as `CLAUDE.md`.
- **Light and dark themes:** light by default, with the choice remembered in `localStorage`.
- **Accessible:** semantic HTML, labelled controls, keyboard support, visible focus states and reduced-motion support.

## Technology stack

| Area | Choice |
| --- | --- |
| Framework | [Astro](https://astro.build) 7, static output |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` |
| Markdown preview | [markdown-it](https://github.com/markdown-it/markdown-it), loaded on demand |
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
│   ├── generator/   # Step components, stepper, review/output step, form shell
│   ├── landing/     # Landing page pieces (editor-style preview)
│   ├── layout/      # Header, footer, theme toggle
│   └── ui/          # Form controls and buttons
├── data/            # Option lists, defaults, sample project, generated-file wording
├── layouts/         # Base HTML layout
├── lib/
│   ├── generator/   # Validation, normalization, section generators, controller
│   │   └── dom/     # DOM-only helpers (errors, conditional fields, output panel)
│   ├── download.ts
│   └── highlight.ts
├── pages/           # /, /generator/, /docs/
├── styles/          # Tailwind entry point and design tokens
└── types/           # Domain types (FormState, ProjectConfig)
tests/               # Vitest unit tests for the pure logic
docs/ARCHITECTURE.md # Design decisions
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how the pieces fit together.

## Development workflow

1. Make a focused change.
2. Run `npm run check`, `npm test` and `npm run build`.
3. Check the affected pages in the browser, in both themes and at mobile width.

Generated-file wording lives in `src/data/templates.ts`, so copy changes rarely need logic changes. When you change the wording or section logic, update `tests/generate.test.ts` to match.

## Building and deploying

`npm run build` produces a fully static site in `dist/`. It needs no server runtime or environment variables. Deploy that folder to any static host, for example:

- **Netlify / Cloudflare Pages / Vercel:** build command `npm run build`, output directory `dist`.
- **GitHub Pages:** publish `dist/` with a Pages workflow. If the site is served from a sub-path (such as `/genmd/`), set `base` (and `site`) in `astro.config.ts` first.

Pages are built as `/<route>/index.html`, which every static host above serves without extra configuration.

### SEO

The production URL is set as `site` in `astro.config.ts` (currently `https://genmd01.netlify.app`). Change it if you deploy elsewhere: canonical links, Open Graph and Twitter preview URLs, `sitemap.xml` and the sitemap line in `robots.txt` are all built from it. If `site` is removed, those URL-based tags are skipped and the sitemap is published empty.

- Page titles, descriptions and social tags are set per page through `BaseLayout` props.
- The home page includes `WebApplication` and `FAQPage` structured data (JSON-LD).
- `sitemap.xml` and `robots.txt` are generated by `src/pages/sitemap.xml.ts` and `src/pages/robots.txt.ts`. Add new routes to the list in the sitemap file.
- The social preview image is `public/og-image.png` (1200×630).
- The 404 page is marked `noindex`.

## Known limitations

- **No persistence.** Answers live in memory only and are lost on reload. Download the file before leaving the page.
- **Guidance, not enforcement.** The generated permission rules tell Claude how to behave; they do not block commands. Real enforcement needs Claude Code's permission settings.
- **Template-based output.** GenMD does not read your codebase, so architecture guidance is general rather than project-specific.
- **Dropdown styling varies by browser.** The closed state is styled everywhere. The open list is fully styled only in browsers that support customizable selects (`appearance: base-select`, currently Chromium-based); Firefox and Safari show their native list.
- **Language filtering is limited to listed languages.** Choosing "Other" as the language shows every framework and tool.
- **English only.**

## Future improvements

These are ideas, not commitments, and are out of scope for the MVP:

- Generate a matching `.claude/settings.json` permissions snippet, so the permission rules can actually be enforced.
- Save and load answers as a JSON file, or keep an optional local draft.
- Starter presets (for example "Astro static site" or "Python API").
- Optional AI-assisted refinement of the generated file (see the architecture notes for how it could be added).
- End-to-end browser tests for the questionnaire flow.
