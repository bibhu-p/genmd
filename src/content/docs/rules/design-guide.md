---
title: Design guide
description: A rule file template for your visual design system, covering colours, typography, spacing, components and accessibility, so Claude builds UI that matches your product.
section: rules
order: 1
sources:
  - label: Path-specific rules
    url: https://code.claude.com/docs/en/memory
lastVerified: 2026-09-23
---

Without guidance, Claude picks reasonable-looking colours, sizes and spacing, which slowly drift away from your design system. A design guide gives it your real values and rules, so new UI matches what is already there.

## When to use it

- Your project has a user interface.
- You have brand colours, a type scale or a spacing system, even an informal one.
- Claude keeps inventing new colours, one-off sizes or components that already exist.

## Where to save it

Save it as `.claude/rules/design-guide.md` and limit it to UI files with `paths`, so it only loads when Claude works on interface code. Adjust the patterns to match your project, for example `src/components/**`, `app/**/*.tsx` or `**/*.css`.

## What to include

- **Colours:** each colour's name, value and what it is used for.
- **Typography:** font families and the allowed sizes.
- **Spacing and layout:** the spacing scale, corner radius and breakpoints.
- **Components:** which library or folder to use before building something new, and the icon set.
- **Theming:** whether you support dark mode and where design tokens are defined.
- **Accessibility:** contrast, focus and motion expectations.
- **Always and never:** the handful of rules that matter most.

## Template

Replace each `<placeholder>` and delete any section you do not need.

```markdown
---
paths:
  - "<path to UI components, e.g. src/components/**>"
  - "<path to styles, e.g. **/*.css>"
---

# Design guide

Follow these rules for all user interface work.

## Colours

- **<Name>** `<value>`: <where it is used>
- **<Name>** `<value>`: <where it is used>
- **<Name>** `<value>`: <where it is used>
- Use only the colours above. Ask before adding a new one.

## Typography

- Fonts: <UI font> for interface text, <monospace font> for code
- Sizes: <allowed sizes, e.g. 12 / 14 / 16 / 20 / 24 / 32 px>
- <Heading and body text rules>

## Spacing and layout

- Spacing scale: <values>. Never use values outside the scale.
- Corner radius: <values and where each is used>
- Breakpoints: <names and widths>

## Components

- Use <component library or folder> before building a new component.
- Shared components live in `<folder>`.
- Icons: <icon set>, <default size>

## Theming

- <Light only / light and dark>
- Design tokens are defined in `<file>`. Use tokens, not raw values.

## Accessibility

- <Contrast target, e.g. WCAG 2.2 AA>
- Every interactive element needs a visible focus state.
- <Motion rule, e.g. respect reduced motion>

## Always

- <Rule>

## Never

- <Rule>
```

## Example

A filled-in guide for a dashboard built with Tailwind CSS:

```markdown
---
paths:
  - "src/components/**"
  - "src/pages/**/*.astro"
  - "src/styles/**"
---

# Design guide

Follow these rules for all user interface work.

## Colours

- **Primary** `indigo-600`: primary buttons, links and focus rings
- **Surface** `white` / `slate-900` in dark mode: cards and panels
- **Danger** `red-600`: destructive actions and error messages only
- Use only the colours above. Ask before adding a new one.

## Typography

- Fonts: Inter for interface text, JetBrains Mono for code
- Sizes: Tailwind `text-xs` to `text-3xl` only
- One `h1` per page. Headings use `font-semibold`, never `font-black`.

## Spacing and layout

- Spacing: Tailwind scale steps 1, 2, 3, 4, 6, 8, 12. No arbitrary values such as `p-[13px]`.
- Radius: `rounded-lg` for controls, `rounded-2xl` for cards
- Layout is mobile-first; check every screen at 375px wide.

## Components

- Use components from `src/components/ui/` before building new ones.
- Icons: Heroicons, 20px solid by default

## Theming

- Light and dark. Colours come from CSS variables in `src/styles/global.css`.

## Accessibility

- Meet WCAG 2.2 AA contrast.
- Every interactive element needs a visible focus state.
- Respect `prefers-reduced-motion`; no animation longer than 300ms.

## Always

- Reuse an existing component before creating a new one.

## Never

- Never use colour alone to show state; pair it with text or an icon.
- Never use inline `style` attributes for colours or spacing.
```

## Tips

- **Name colours by purpose, not appearance.** "Danger" tells Claude when to use a colour; "red" does not.
- **Point to the source of truth.** If tokens live in a file, name the file so Claude reads real values instead of guessing.
- **Keep it to rules, not a full design document.** Link long reference material with an `@` import only if Claude genuinely needs it.
- **Update it when the design changes.** An outdated guide produces confidently wrong UI.
