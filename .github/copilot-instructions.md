# GitHub Copilot Instructions

## Project context and sources

This repository is Task Tracker: a client-only React 19 +
TypeScript single-page app built with Vite at the repository root.

The app implements [the two-phase plan](../plan/spa-v1.md). Inspect the manifest,
lockfile, source, and configuration before changing code. Do not claim commands
pass until verified.

Before making changes:

1. Read the plan and applicable files in [instructions](instructions/).
   [Accessibility guidance](instructions/a11y.instructions.md) applies globally;
   [JavaScript/Vitest guidance](instructions/nodejs-javascript-vitest.instructions.md)
   applies to its declared JavaScript file patterns.
2. Read relevant `.github/copilot/` context files if they are added later.
3. Inspect the current source and configuration for established conventions.
   Reuse matching patterns rather than introducing competing abstractions.
4. Keep changes focused on the request. Preserve `.github`, the plan, and
   unrelated work. Do not implement extra features or phases implicitly.

## Technology and version compatibility

- React 19 is the user-specified target. Keep React, React DOM, and their type
  packages compatible with that major version.
- Use TypeScript, Vite, React Router, Vitest, and React Testing Library as
  specified in the plan. Read exact installed versions from `package-lock.json`.
- Before scaffolding or changing dependencies, inspect `package.json`, the
  lockfile, TypeScript/Vite configuration, and any runtime-version files if
  present. Respect declared ranges, resolved versions, compiler targets, and
  runtime requirements; do not assume the latest version is compatible.
- Once available, treat the manifest and lockfile as version evidence. Use only
  APIs supported by the installed versions and follow the configured package
  manager. Do not invent Node.js, TypeScript, Router, or Vite version numbers.
- Preserve the scaffold's TypeScript and lint configuration. Do not weaken
  checks or use unsafe casts to hide errors.

## Architecture and scope

Follow the two phases in the plan: build the app and persistence, then test,
verify, and document.

| File | Responsibility |
| --- | --- |
| `src/main.tsx` | Mount React and `BrowserRouter`. |
| `src/App.tsx` | Shared navigation and route definitions. |
| `src/pages/TasksPage.tsx` | Page metadata and Tasks feature composition. |
| `src/components/features/Tasks/index.tsx` | Connect the stateful hook to presentation. |
| `src/components/features/Tasks/useTasks.tsx` | Task state, storage actions, event handling, and focus. |
| `src/components/features/Tasks/presentation.tsx` | Render-only form and list, receiving callbacks through `types.ts`. |
| `src/components/features/Tasks/presentation.module.scss` | Feature styles using `src/styles/theme.scss` color tokens. |
| `src/pages/AboutPage.tsx` | App purpose and browser-local storage limitations. |
| `src/taskStorage.ts` | Shared `Task` type, serialization, validation, and localStorage load/save. |
| `src/index.css` | Responsive layout and visible focus styles. |

- Keep exactly the planned routes: `/` for Tasks and `/about` for About.
- Keep React state authoritative for rendering and localStorage access inside
  the storage module. Keep storage independent of page rendering.
- Use the planned task shape:
  `type Task = { id: string; title: string; completed: boolean }`.
- Generate stable IDs with `crypto.randomUUID()`. Append tasks in creation
  order, trim titles, and reject blank input with an associated inline error.
- Support listing, adding, completing/uncompleting, and deleting tasks.
- Do not add a backend, authentication, deployment infrastructure, task editing,
  filtering, extra routes, or an additional state-management framework.
- Follow the existing function components, explicit return types, type aliases,
  single quotes, and semicolon-free formatting. Keep state and business logic
  in the feature hook, not presentation. Never import features from a UI layer.
- Use native HTML controls; no UI-library dependency is needed. Presentation CSF
  stories exist, but Storybook tooling is not configured.

## Persistence and error handling

- Use the planned key `task-tracker.tasks.v1`.
- Load stored tasks on initialization. A missing key represents an empty list.
  Validate parsed data at runtime against the task shape.
- Save additions, completion toggles, and deletions through the storage module.
- Distinguish missing data from malformed JSON, invalid shapes, unavailable
  storage, and failed writes. Surface failures visibly and accessibly; never
  silently report failed persistence as success.
- Permit in-memory use on persistence failure with an explicit unsaved warning.
  Do not overwrite malformed stored data on initialization or from an initial
  mount effect.

## Accessibility and UI

Follow the repository's WCAG 2.2 AA instructions:

- Use semantic landmarks, active-route navigation, a skip link, one page heading,
  and a descriptive document title per route.
- Use a visibly labeled input, native completion checkboxes, and native buttons
  with task-specific delete names. Prefer native semantics over custom ARIA.
- Keep all actions keyboard-operable with visible, unobscured focus. Restore
  focus predictably after deletion and announce task action results.
- Associate validation messages with inputs and expose errors and status
  feedback to assistive technology. Provide a helpful empty state.
- Verify contrast, 320px reflow, and 200% zoom. Do not rely on color alone.

## Testing and verification

The test stack is Vitest + jsdom, React Testing Library,
`@testing-library/jest-dom`, and `@testing-library/user-event`.

- Colocate focused tests: `src/taskStorage.test.ts`,
  `src/pages/TasksPage.test.tsx`, and `src/App.test.tsx`.
- Cover storage round trips, missing data, malformed JSON, invalid task shapes,
  and read/write failures.
- Cover restored and empty lists, trimmed additions, blank rejection, completion
  toggles, deletion, persistence after remount, and visible persistence failures.
  Verify malformed storage is not overwritten on initial render.
- Test both routes and navigation with `MemoryRouter`, including active state.
- Use accessible role/label queries and user-event interactions. Isolate
  localStorage between tests; avoid snapshots and implementation-detail tests.
- Run `npm test -- --run` (or `npm run test:run`), `npm run lint`, and
  `npm run build`. Lint uses the Vite template's Oxlint configuration. Report
  failures explicitly; do not weaken compiler or lint checks to hide them.
- Manually verify keyboard use, focus after deletion, announced feedback,
  responsive layout, zoom, and real-browser reload persistence.
- Do not add an end-to-end testing framework for this scope.

## Documentation and maintenance

- Keep the root README consistent with implemented setup, development, tests,
  lint, build/preview, routes, and localStorage limitations.
- Document that production hosting must rewrite SPA requests such as `/about`
  to `index.html` for direct navigation and refresh.
- Keep code self-explanatory; comment only non-obvious behavior. Follow existing
  naming and formatting once source is present.
- No release-versioning, changelog, or commit-message convention is evidenced
  yet. Do not invent one.