# Architecture

This document records the main design decisions behind GenMD Studio and how the code is organised. For setup and usage, see the [README](../README.md).

## Overview

GenMD Studio is a static Astro site: a landing page, the generator and a multi-page docs section. The landing and docs pages are static HTML and CSS, plus small scripts for the theme toggle and, in the docs, copy buttons and the "On this page" highlight. The generator page adds one bundled TypeScript module that drives the questionnaire and produces the Markdown.

```text
                 ┌──────────────────────── browser ────────────────────────┐
 Form (HTML) ──► FormData ──► formStateFromData ──► FormState
                                                        │
                                   validateStep ◄───────┤  (per step)
                                   summarize    ◄───────┤  (review screen)
                                                        ▼
                                                   normalize
                                                        │
                                                        ▼
                                                  ProjectConfig
                                                        │
                                                        ▼
                                   generateClaudeMd (section functions)
                                                        │
                                                        ▼
                                  Markdown string ──► editor / preview / copy / download
                 └──────────────────────────────────────────────────────────┘
```

Nothing leaves the browser. There is no backend, storage or network call involved in generation.

## Why template-based generation

The MVP deliberately avoids an AI API:

- **Privacy:** project details never leave the user's machine.
- **Cost and setup:** no API keys, rate limits or server to run.
- **Predictability:** the same answers always produce the same file, which makes the output testable and reviewable.
- **Quality control:** the wording is written and reviewed once, in one place, instead of varying per request.

The trade-off is that the output cannot adapt to details the questionnaire does not ask about. Custom instructions cover the gaps.

## Two data shapes

Defined in `src/types/generator.ts`.

- **`FormState`** mirrors the raw form: option values such as `"other"`, the free-text boxes behind them, goals as one multi-line string, and so on. `formStateFromData` builds it from the form's `FormData`, falling back to defaults for any unknown closed-set value so the result is always well-typed.
- **`ProjectConfig`** is the resolved input to the generator: "Other" is replaced by the user's text, "None" and blanks become `undefined`, lists are split and trimmed, and TypeScript strictness becomes `not-applicable` for non-TypeScript projects. `normalize` converts one into the other.

Keeping these separate means the generator never deals with raw form quirks, and validation and the review summary work on exactly what the user entered.

## Questionnaire

- **All steps stay in the DOM.** Steps are shown and hidden with the `hidden` attribute, so input survives navigation without any state syncing. The form itself is the source of truth; state is read with `new FormData(form)` whenever it is needed.
- **Steps are Astro components** (`src/components/generator/`) built from shared controls in `src/components/ui/`. They render static HTML with ids and `data-*` hooks that follow the conventions in `lib/generator/field-ids.ts`.
- **`controller.ts`** is the only module that coordinates the page: navigation, the stepper, validation feedback and the review step. DOM details are split into `lib/generator/dom/`: `errors.ts` (inline errors and the error summary), `conditional.ts` ("Other" boxes, language filtering, TypeScript-only questions), `summary-view.ts` and `output.ts`.
- **Validation** (`validation.ts`) is a pure function per step. Moving forward via the stepper or "Return to review" re-validates every step in between.
- **Option data** (`src/data/`) is plain typed arrays. Language-specific options carry a `languages` list, rendered as `data-languages` so filtering needs no data duplication in the client.

## Markdown generation

- **One function per section** in `lib/generator/sections.ts`, each typed `(config: ProjectConfig) => string | null`. Returning `null` leaves the section out.
- **Order is declared once** in `generate.ts`, which runs the sections, drops the `null`s and joins the rest with blank lines.
- **Wording lives in `src/data/templates.ts`**, separate from logic, so copy can be reviewed and edited on its own.
- **Optional sections are driven by the config:** Command Permissions appears only if some category is not "Allow" (and database rules only if there is a database); Testing, Documentation and Definition of Done follow the verification toggles; the TypeScript and Accessibility subsections follow the preferences; Additional Instructions appears when custom text is present.
- **Avoiding duplication:** each rule has one home. For example, the error-handling preference feeds the Error Handling and Security section rather than Coding Standards, and the Definition of Done checklist is built from the same toggles as the testing rules.
- **User text safety** (`markdown.ts`): one-line values have whitespace collapsed; multi-line values have heading-like lines escaped so they cannot change the document structure; typed list markers on goals are stripped. Custom instructions are inserted verbatim by design.

## Output panel

- The editor is a plain `<textarea>`. It updates automatically until the user edits it; after that, changed answers show an "out of date" notice instead of overwriting, and Regenerate asks for confirmation.
- **The preview** uses markdown-it with `html: false` (raw HTML is escaped), its built-in link validation (rejects `javascript:` and similar), and images disabled (no network requests). The parser is dynamically imported, so its roughly 40 KB (gzipped) only loads when the preview is first opened.
- Copy uses the Clipboard API, falling back to selecting the text with instructions. Download uses a `Blob` and a temporary object URL.

## Docs

- **Content collection.** Each page is a Markdown file in `src/content/docs/`, loaded with Astro's `glob` loader. `src/content.config.ts` validates the frontmatter (title, description length, section, order, sources, last-checked date), so a malformed page fails the build instead of rendering badly.
- **Routing.** `src/pages/docs/index.astro` renders the landing page (`index.md`) plus an "All guides" grid built from the collection. `src/pages/docs/[...slug].astro` renders every other page; the file path becomes the URL.
- **Navigation.** `lib/docs-nav.ts` sorts pages by section (defined in `data/docs-sections.ts`) and `order`, groups them for the sidebar and finds previous/next pages. It has no `astro:content` import so it can be unit-tested; `lib/docs.ts` is the thin wrapper that loads the collection.
- **Layout.** `layouts/DocsLayout.astro` provides the sidebar (a collapsible menu on mobile), breadcrumbs, the "On this page" list with scroll highlighting, the sources box and previous/next links. It also adds a Copy button to every code block.
- **Code highlighting.** Shiki (built into Astro) emits both GitHub light and dark colours as CSS variables (`defaultColor: false`), and `global.css` picks one from `data-theme`, so code follows the site theme without re-rendering.
- **Accuracy.** Pages are written in our own words, checked against the official Claude Code documentation, and list their sources with a last-checked date, because Claude Code changes often.

## Styling and theming

- Tailwind CSS 4 with design tokens in `src/styles/global.css`. Components use semantic colour tokens (`canvas`, `surface`, `ink`, `line`, `accent`, `danger`...) rather than raw palette colours, and the dark theme redefines those tokens under `[data-theme="dark"]`. The `dark:` variant follows the same attribute.
- An inline script in the layout sets the theme before first paint to avoid a flash: a choice saved with the toggle wins, otherwise the system `prefers-color-scheme` setting is followed (including live changes), with light as the fallback.
- Radios and checkboxes are custom-drawn (with a forced-colors fallback to native controls). Selects use `appearance: base-select` where supported and a styled native control elsewhere.

## Testing

Unit tests in `tests/` cover the pure modules: form parsing, validation, normalization, the review summary and Markdown generation (structure, optional sections, permissions, user-content handling and determinism). DOM behaviour is verified manually in the browser.

## Adding AI refinement later

If optional AI refinement is approved in future, it should sit **after** the deterministic generator rather than replace it:

```text
ProjectConfig ──► generateClaudeMd ──► Markdown ──► (optional) refine(markdown) ──► editor
```

- Keep `generateClaudeMd` unchanged as the default, offline path and as the input to any refinement.
- Put the provider call behind a small server endpoint, so API keys never reach the client.
- Make refinement opt-in, with a clear notice about what is sent, and show the result as a proposed change the user can accept or discard.

Because the generator is a pure function with no UI coupling, this can be added without touching the questionnaire or section code.


## Rules builder (future idea)

A possible follow-up, not part of the MVP: a form-driven builder that generates `.claude/rules/<topic>.md` files, starting with the rule file guides already in the docs.

- **Templates as data.** Each rule type (design guide, API conventions, testing strategy...) would be a typed definition in `src/data/`: its fields (text, lists, colour lists, choices, file patterns) and the Markdown it produces. Adding a rule type means adding data, not code.
- **One form engine.** A single component would render any template's fields, adding a repeatable-row control for lists such as colours or rules.
- **Pure generator functions,** mirroring `generateClaudeMd`: they build the `paths:` frontmatter (quoting glob patterns so the YAML stays valid) and the sections, and are unit-tested.
- **Reuse.** The existing output panel (edit, preview, copy, download) would take a per-template filename, and the pages would be static routes generated from the template list.
