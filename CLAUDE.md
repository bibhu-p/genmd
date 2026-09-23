# CLAUDE.md

# GenMD — Project Development Instructions

## 1. Project Overview

### Project Name

GenMD

### Product Description

Build an Astro.js and TypeScript-based web application that helps developers generate a project-specific `CLAUDE.md` file through a guided questionnaire.

The application should collect project requirements, technology choices, coding preferences, workflow rules, command permission policies, testing expectations, and documentation preferences. It should then generate a structured Markdown file that users can review, edit, copy, and download.

The goal is to make it easier for developers to create useful Claude Code instructions without needing to manually determine what should be included in a `CLAUDE.md` file.

### Target Users

Initial target users:

- Individual developers
- Freelancers
- Developers starting new projects
- Developers who want reusable Claude Code instruction templates

### MVP Product Direction

The MVP must be template-based and should not require an AI API.

The architecture should remain modular enough to support optional AI-assisted refinement in a future version, but AI integration is not part of the initial implementation unless explicitly approved.

### Core MVP Capabilities

The MVP should support:

- Guided multi-step questionnaire
- Project information collection
- Technology stack selection
- Development preference selection
- Command permission configuration
- Testing and documentation preferences
- Conditional Markdown generation
- Generated Markdown preview
- Editable generated output
- Copy-to-clipboard
- Download as `CLAUDE.md`
- Client-side validation
- Responsive and accessible UI

---

## 2. Product Scope

### In Scope

The initial release should include:

1. Landing page
2. Generator page
3. Multi-step questionnaire
4. Form state management
5. Form validation
6. Project configuration data model
7. Reusable Markdown section generators
8. Conditional section inclusion
9. Markdown preview or editable output area
10. Copy functionality
11. File download functionality
12. Basic documentation
13. Responsive layout
14. Accessibility checks
15. Unit or functional tests for core generation logic where practical

### Out of Scope for MVP

Do not implement the following unless explicitly approved:

- User accounts
- Authentication
- Cloud storage
- Database integration
- Team collaboration
- GitHub repository access
- Automatic repository scanning
- Automatic codebase analysis
- AI API integration
- Subscription or payment functionality
- Admin dashboard
- Multi-user project management
- Automatic deployment workflows

These features may be documented as future opportunities but should not be implemented as part of the initial MVP.

---

## 3. Technology Stack

### Required Stack

- Framework: Astro.js
- Language: TypeScript
- Styling: Use the project's selected styling solution, preferring a simple and maintainable approach
- Rendering: Static-first Astro architecture
- Generation: Client-side TypeScript template functions
- Storage: In-memory state for the initial MVP
- Output: Markdown string
- Deployment: Suitable static hosting platform

### Technology Principles

- Prefer Astro's native capabilities when they are sufficient.
- Use TypeScript for application logic and data models.
- Avoid unnecessary dependencies.
- Do not introduce a framework or library without a clear reason.
- Use a client-side interactive component only where interactivity is required.
- Keep static pages and interactive generator logic separated.
- Preserve the selected package manager and existing project configuration.

### Package Manager

Use the package manager already configured for the project.

Do not switch package managers without explicit user permission.

---

## 4. Development Workflow

Follow this workflow for meaningful tasks.

### Step 1: Understand

Before making changes:

- Read this file completely.
- Inspect the current project structure.
- Review existing configuration files.
- Identify the relevant files and dependencies.
- Confirm the task scope.

Do not assume that a file or dependency exists without checking.

### Step 2: Plan

For non-trivial tasks:

- Explain your understanding of the task.
- Identify the files that will be created or modified.
- Describe the implementation approach.
- Identify risks, trade-offs, and dependencies.
- Ask for approval before major architectural changes or scope expansion.

For small, unambiguous changes, a short plan is sufficient.

### Step 3: Implement

- Implement only the approved scope.
- Keep changes focused.
- Follow existing conventions.
- Avoid unrelated refactoring.
- Prefer small, reviewable changes.
- Keep the application functional after each meaningful phase.

### Step 4: Verify

After implementation:

- Run relevant checks only after obtaining the required permission.
- Review the changed files.
- Verify expected behavior.
- Report which checks were run and their results.
- Clearly report checks that could not be run.

Never claim that a test, build, lint, or type check passed unless it was actually executed successfully.

### Step 5: Document

Update documentation when:

- Project setup changes
- Architecture changes
- New configuration is introduced
- User-facing behavior changes
- Important technical decisions are made

---

## 5. Permission and Command Safety

Permission rules are an important part of this project.

### General Rule

Do not run potentially impactful commands without explicit user permission.

When permission is needed:

1. Explain the command.
2. Explain why it is required.
3. Explain any expected side effects.
4. Wait for explicit approval before running it.

Do not interpret a general request to build the project as permission to run every available command.

### Git Commands

Do not run Git commands without explicit user permission.

This includes, but is not limited to:

- `git init`
- `git add`
- `git commit`
- `git push`
- `git pull`
- `git fetch`
- `git merge`
- `git rebase`
- `git reset`
- `git checkout`
- `git switch`
- `git branch`
- `git branch -D`
- `git clean`
- `git tag`

Do not:

- Create commits
- Push changes
- Change branches
- Modify Git history
- Delete tracked or untracked files through Git
- Reset the working tree

without explicit approval.

You may inspect files and explain Git commands without executing them, subject to the user's command permission policy.

### Package Manager Commands

Do not run npm, pnpm, yarn, or bun commands without explicit user permission.

This includes:

- Installing packages
- Removing packages
- Updating packages
- Running scripts
- Running development servers
- Running builds
- Running tests
- Running lint commands
- Running formatting commands
- Publishing packages
- Updating lockfiles

Before requesting permission, explain the exact command and its purpose.

Do not modify dependency versions or lockfiles through package manager commands without permission.

### Shell Commands

Do not execute destructive or potentially impactful shell commands without explicit permission.

Examples include:

- `rm`
- Recursive deletion
- Overwriting important files
- Moving project directories
- Changing system configuration
- Modifying environment-wide settings
- Database reset or destructive migration commands
- Deployment commands

Reading files, searching source code, and inspecting project structure are allowed unless another instruction explicitly restricts them.

### Secrets and Credentials

Never:

- Request unnecessary secrets.
- Hardcode API keys or credentials.
- Print secrets into logs.
- Commit `.env` files containing secrets.
- Expose private configuration in generated output.

Use environment variables for sensitive configuration when such configuration is introduced in a future feature.

---

## 6. Project Architecture

Use a modular architecture that separates questionnaire data, generation logic, UI, and utilities.

### Suggested Structure

```text
project-root/
├── CLAUDE.md
├── README.md
├── package.json
├── astro.config.ts
├── tsconfig.json
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── generator/
│   │   │   ├── ProjectBasics.astro
│   │   │   ├── TechnologyStack.astro
│   │   │   ├── DevelopmentRules.astro
│   │   │   ├── PermissionRules.astro
│   │   │   ├── TestingRules.astro
│   │   │   └── ReviewStep.astro
│   │   └── ui/
│   ├── layouts/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── generator.astro
│   │   └── docs/
│   ├── data/
│   │   ├── frameworks.ts
│   │   ├── rules.ts
│   │   └── templates.ts
│   ├── lib/
│   │   ├── generator/
│   │   │   ├── generate.ts
│   │   │   ├── sections.ts
│   │   │   └── validation.ts
│   │   └── download.ts
│   ├── types/
│   │   └── generator.ts
│   └── styles/
└── tests/
```

This structure is a starting point, not a rigid requirement. Adjust it if the actual implementation benefits from a simpler or more appropriate organization.

### Separation of Responsibilities

- UI components handle presentation and user interaction.
- Type definitions describe form data and generated configuration.
- Data files contain selectable options and reusable presets.
- Generator functions produce Markdown sections.
- Validation functions validate user input.
- Download utilities handle file export.
- Static pages should not contain unnecessary generator business logic.

Avoid placing the entire generator inside one large component or one oversized function.

---

## 7. Generator Data Model

Create a strongly typed configuration model.

The model should support at least:

- Project name
- Project description
- Project goals
- Project stage
- Project type
- Programming language
- Framework
- Package manager
- Database
- Styling approach
- Testing preferences
- Documentation preferences
- Coding standards
- Dependency preferences
- Git permission policy
- Package manager permission policy
- Destructive operation policy
- Deployment permission policy
- Optional custom instructions

Example shape:

```ts
type ProjectConfig = {
  projectName: string;
  description: string;
  goals: string[];
  projectStage: "new" | "existing" | "migration";
  projectType: string;
  language?: string;
  framework?: string;
  packageManager?: string;
  database?: string;
  styling?: string;
  codingPreferences: string[];
  permissionPolicies: {
    git: "allow" | "ask" | "prohibit";
    packageManager: "allow" | "ask" | "prohibit";
    destructiveOperations: "allow" | "ask" | "prohibit";
    deployment: "allow" | "ask" | "prohibit";
  };
  includeTesting: boolean;
  includeDocumentation: boolean;
  customInstructions?: string;
};
```

The exact type can be refined during implementation.

Avoid using untyped objects or `any` for the core generator configuration.

---

## 8. Questionnaire Requirements

### Step 1: Project Basics

Collect:

- Project name
- Project description
- Project goals
- Project stage
- Optional target users
- Optional special constraints

Validate essential fields and provide clear error messages.

### Step 2: Technology Stack

Support configurable options for:

- Project type
- Language
- Framework
- Package manager
- Database
- Styling
- Testing tools

Include an "Other" option where appropriate.

Do not require irrelevant fields. For example, a static website may not need a database.

### Step 3: Development Preferences

Allow users to select or configure:

- Clean and maintainable code
- Simple solutions over unnecessary abstractions
- TypeScript strictness preferences
- Dependency minimization
- Component organization
- Error handling
- Performance expectations
- Accessibility expectations
- Documentation preferences

Use sensible defaults, but allow users to change them.

### Step 4: Command Permissions

Allow users to configure policies for:

- Git commands
- Package manager commands
- Destructive operations
- Database operations
- Deployment operations

Explain each policy clearly.

Do not claim that generated Markdown alone technically enforces permissions in Claude Code. The output should describe the desired project workflow, while actual enforcement depends on Claude Code's permission configuration.

### Step 5: Testing and Documentation

Allow users to choose:

- Whether testing instructions should be included
- Whether type checking should be included
- Whether linting should be included
- Whether build verification should be included
- Whether documentation updates should be required
- Whether a Definition of Done section should be included

### Step 6: Review and Generate

The final step should:

- Summarize the user's selections.
- Generate the Markdown.
- Show the Markdown in an editable interface.
- Allow the user to return to previous steps.
- Allow regeneration after changing inputs.
- Allow copying the Markdown.
- Allow downloading a file named `CLAUDE.md`.

---

## 9. Markdown Generation Rules

### General Rules

- Generate readable and well-structured Markdown.
- Use consistent heading levels.
- Avoid duplicated instructions.
- Include only relevant optional sections.
- Preserve user-provided custom instructions.
- Escape or format user-provided content safely when necessary.
- Do not generate unsupported claims about tools or enforcement.
- Keep the generated document useful rather than unnecessarily verbose.

### Required Sections

The generated file should generally support:

1. Project Overview
2. Technology Stack
3. Project Architecture
4. Development Workflow
5. Coding Standards
6. Command Permissions
7. Testing and Verification
8. Error Handling and Security
9. Documentation
10. Scope Management
11. Definition of Done

Not every section must be included in every output. Optional sections should be controlled by the user's configuration.

### Template Design

Use independent functions for generating sections.

Example:

```ts
function generateClaudeMd(config: ProjectConfig): string {
  const sections: string[] = [];

  sections.push(generateOverview(config));
  sections.push(generateTechnologyStack(config));
  sections.push(generateWorkflow(config));

  if (hasPermissionRules(config)) {
    sections.push(generatePermissionRules(config));
  }

  if (config.includeTesting) {
    sections.push(generateTestingRules(config));
  }

  if (config.includeDocumentation) {
    sections.push(generateDocumentationRules(config));
  }

  return sections.filter(Boolean).join("\n\n");
}
```

Keep generation logic deterministic for the same configuration.

---

## 10. UI and Design Guidelines

### Design Direction

Build a clean, modern, developer-focused utility.

The interface should be:

- Light-first
- Responsive
- Accessible
- Fast
- Easy to understand
- Focused on the generator workflow
- Free from unnecessary visual complexity

Avoid building an enterprise-style dashboard for the MVP.

### Layout

The initial website should include:

#### Landing Page

- Clear product headline
- Short explanation of the product
- Primary call-to-action
- Brief explanation of the generation workflow
- Example generated output or feature preview

#### Generator Page

- Multi-step form
- Visible progress indicator
- Back and next controls
- Clear validation messages
- Ability to review and edit selections

#### Review and Export

- Generated Markdown preview
- Editable output
- Copy button
- Download button
- Return-to-edit functionality
- Clear success and error states

### Accessibility

- Use semantic HTML.
- Provide labels for form controls.
- Ensure keyboard navigation.
- Maintain sufficient color contrast.
- Do not rely only on color to communicate state.
- Provide accessible names for interactive controls.
- Ensure focus states are visible.
- Support responsive layouts.

### Performance

- Prefer static rendering for static pages.
- Avoid unnecessary client-side JavaScript.
- Avoid large dependencies when native browser capabilities are sufficient.
- Keep interactive code limited to the generator experience.
- Avoid unnecessary network requests.
- Do not add animations that negatively affect usability or performance.

---

## 11. Coding Standards

### General

- Use clear and descriptive names.
- Keep functions focused.
- Avoid unnecessary abstraction.
- Avoid duplicated logic where a reusable solution is clear.
- Prefer maintainability over cleverness.
- Keep changes small and reviewable.
- Follow existing project conventions.

### TypeScript

- Use TypeScript for application logic.
- Avoid `any` unless there is a documented reason.
- Define explicit types for generator configuration and public functions.
- Handle nullable and optional values intentionally.
- Avoid unsafe type assertions.
- Keep type definitions close to the domain they represent.

### Astro

- Use Astro components for static and layout-focused UI.
- Use client-side interactivity only where needed.
- Keep business logic outside large presentation components when practical.
- Follow Astro's recommended patterns.
- Avoid making the entire site unnecessarily client-rendered.

### Forms

- Validate required fields.
- Preserve user input during step navigation.
- Provide clear validation feedback.
- Avoid losing form data when users move backward.
- Support keyboard interaction.
- Avoid deeply nested form state when a simpler structure is sufficient.

### Dependencies

- Prefer native browser APIs when sufficient.
- Do not add a dependency for a small utility that can be implemented clearly without it.
- Review the purpose and maintenance cost of new dependencies.
- Do not install packages without explicit permission.

---

## 12. Testing and Verification

The generator's core logic should be testable independently of the UI.

Test important scenarios such as:

- Minimal valid configuration
- Full configuration with all optional sections
- Git permission policy enabled
- Package manager permission policy enabled
- Testing section enabled
- Documentation section enabled
- Custom instructions included
- Optional fields omitted
- Invalid required fields
- Markdown output structure
- Regeneration after configuration changes
- Copy and download behavior where practical

Before marking a task complete, perform relevant checks after obtaining permission.

Potential checks include:

- Type checking
- Linting
- Unit tests
- Build validation
- Manual browser verification
- Accessibility review

Do not claim that checks passed if they were not run.

---

## 13. Error Handling and Security

- Do not expose secrets.
- Do not collect unnecessary personal information.
- Do not send form data to an external service in the MVP.
- Keep generation client-side unless a future approved feature requires a backend.
- Handle invalid form state gracefully.
- Avoid injecting untrusted user content as executable HTML.
- Treat custom instructions as user-provided text.
- Ensure generated Markdown does not unexpectedly execute scripts or alter the page.
- Provide useful error messages without exposing internal implementation details.

If AI integration is added in the future:

- Keep provider API keys on the server.
- Do not expose secrets in client-side code.
- Add clear data handling and privacy disclosures.
- Add appropriate usage limits and error handling.
- Do not send project content to an external provider without clear user awareness and appropriate controls.

---

## 14. Scope Management

- Do not implement features outside the approved MVP.
- Do not add authentication or a database without approval.
- Do not add AI integration without approval.
- Do not add GitHub integration without approval.
- Do not introduce unnecessary dependencies.
- Do not refactor unrelated code during feature implementation.
- Do not change the core architecture without discussing the reason.
- If you identify a useful future improvement, document it separately instead of implementing it automatically.

---

## 15. Documentation Requirements

Maintain:

### README.md

Include:

- Project description
- Main features
- Technology stack
- Local setup instructions
- Development workflow
- Build and deployment instructions
- Known limitations
- Future improvements

### Architecture Documentation

Document meaningful architectural decisions, including:

- Why template-based generation was selected for the MVP
- How generator sections are organized
- How configuration data is represented
- How optional sections are included
- How future AI integration could be added without tightly coupling it to the core generator

Do not create unnecessary documentation files for trivial changes.

---

## 16. Definition of Done

A task is complete when:

- [ ] The requested functionality is implemented.
- [ ] The implementation follows this CLAUDE.md.
- [ ] The change stays within the approved scope.
- [ ] Relevant types are defined or updated.
- [ ] Form validation is handled where applicable.
- [ ] The UI is responsive and accessible where applicable.
- [ ] Relevant checks have been run with permission.
- [ ] Test or verification results are reported accurately.
- [ ] No known unintended changes were introduced.
- [ ] Documentation is updated when required.
- [ ] Remaining limitations or follow-up tasks are clearly reported.

---

## 17. Initial Implementation Plan

Implement the project in the following order.

### Phase 1: Project Foundation

1. Inspect the repository and existing files.
2. Confirm the Astro.js project setup.
3. Define the initial data model.
4. Define the generator section architecture.
5. Create the basic page and layout structure.
6. Establish the initial visual design system.

### Phase 2: Questionnaire

1. Implement project basics.
2. Implement technology stack selection.
3. Implement development preferences.
4. Implement command permissions.
5. Implement testing and documentation preferences.
6. Add step navigation and validation.
7. Preserve state between steps.

### Phase 3: Markdown Generator

1. Implement section generation functions.
2. Add conditional section handling.
3. Add custom instruction support.
4. Generate the complete Markdown output.
5. Add editable preview.
6. Add copy functionality.
7. Add download functionality.

### Phase 4: Verification and Refinement

1. Test multiple configuration combinations.
2. Verify generated Markdown quality.
3. Verify responsive layouts.
4. Verify accessibility.
5. Review error states.
6. Update README.md.
7. Document known limitations.
8. Prepare the project for static deployment.

Do not attempt to implement all phases in one large unreviewed change.

---

## 18. First Task

Your first task is to analyze this project instruction file and create a detailed implementation plan.

Do not immediately implement the entire application.

### First Response Requirements

Provide:

1. Your understanding of the product.
2. Proposed project architecture.
3. Proposed data model.
4. Proposed questionnaire flow.
5. Proposed Markdown generation strategy.
6. Proposed component structure.
7. Implementation phases.
8. Potential risks and trade-offs.
9. Questions that require clarification.

### Initial Constraints

- Do not run Git commands without explicit permission.
- Do not run npm, pnpm, yarn, or bun commands without explicit permission.
- Do not install dependencies without permission.
- Do not expand the MVP scope without approval.
- Do not start implementation until the initial plan has been reviewed and approved.

After presenting the plan, wait for user approval.
