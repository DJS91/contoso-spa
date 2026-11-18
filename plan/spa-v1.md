# Task Tracker SPA v1

## Goal and scope

Build a client-only Task Tracker at this repository root using Vite, React,
TypeScript, and React Router. Provide two routes: `/` (Tasks) and `/about`
(About). Users can list, add, complete/uncomplete, and delete tasks, with
localStorage persistence. Use Vitest and React Testing Library for tests.

No backend, authentication, deployment infrastructure, editing, filtering, or
additional routes are included.

## Phase 1 - Build the app and local persistence

- [x] Scaffold Vite's React + TypeScript template directly at the repository root,
  preserving `.github` and this plan. Add React Router and retain the template's
  TypeScript and lint configuration.
- [x] Use a small structure:
  - `src/main.tsx`: mount React and `BrowserRouter`.
  - `src/App.tsx`: shared navigation and route definitions.
  - `src/pages/TasksPage.tsx`: page metadata and Tasks feature composition.
  - `src/components/features/Tasks/`: skill-based container/presentation split;
    `useTasks.tsx` owns state, persistence, actions, and focus; `presentation.tsx`
    renders the form and list. Includes types, SCSS module, and CSF stories.
  - `src/pages/AboutPage.tsx`: purpose and browser-local storage limitations.
  - `src/taskStorage.ts`: `Task` type and localStorage load/save functions.
  - `src/index.css`: responsive layout and visible focus styles.
- [x] Model tasks as `{ id: string; title: string; completed: boolean }`; generate
  stable IDs with `crypto.randomUUID()`. Append newly added tasks in creation
  order, trim titles, and reject blank titles with an associated inline error.
- [x] Read stored tasks once on initialization. Use one namespaced key,
  `task-tracker.tasks.v1`, and keep serialization and runtime shape validation
  inside the storage module. A missing key means an empty task list.
- [x] Keep React state authoritative for rendering; save each successful add,
  completion toggle, and deletion through the storage module.
- [x] Surface malformed stored data, unavailable storage, and failed writes as
  visible, accessible errors. Allow in-memory use when persistence fails,
  explicitly warning that changes are not saved. Do not automatically overwrite
  malformed data during initialization or through an initial mount effect.
- [x] Provide active-route navigation, a skip link, semantic landmarks, one page
  heading, a visibly labeled task input, native completion checkboxes, and
  task-specific accessible names for delete buttons. Show a helpful empty state.
- [x] Support keyboard-only use, announce task action results, and move focus
  predictably after deletion. Set a descriptive document title per route.
  Meet WCAG 2.2 AA contrast and reflow requirements, including at 320px width.

**Exit criteria:** Both routes render and navigation works without a page reload.
Users can add, toggle, and delete tasks; valid changes survive a reload when
storage is available. Empty input and storage errors are visible and accessible.

## Phase 2 - Test, verify, and document

- [x] Add Vitest, jsdom, React Testing Library, `@testing-library/jest-dom`, and
  `@testing-library/user-event` as development dependencies. Configure the Vite
  test environment and a shared test setup; add `test` and `test:run` scripts.
- [x] Add focused tests alongside the implementation:
  - `src/taskStorage.test.ts`: missing storage, valid round-trip data, malformed
    JSON, invalid task shapes, and storage read/write failures.
  - `src/pages/TasksPage.test.tsx`: empty and restored lists, trimmed task
    creation, blank rejection, completion toggling, deletion, and persistence
    after remount. Assert visible feedback on failed persistence and ensure
    malformed data is not overwritten on initial render.
  - `src/App.test.tsx`: render with `MemoryRouter`; verify `/` and `/about`,
    navigation through visible links, and active navigation state.
- [x] Isolate localStorage between tests. Use accessible role/label queries and
  user-event interactions; avoid snapshots and implementation-detail assertions.
- [x] Run `npm test -- --run`, `npm run lint`, and `npm run build`; resolve failures
  introduced by the app. Do not add a separate end-to-end testing framework.
- [ ] Complete browser and assistive-technology verification:
  - [x] Verify keyboard navigation, skip link, Enter submission, route focus,
    and focus after deletion in isolated headless Edge.
  - [x] Verify real-browser reload persistence, task actions, and `/about`
    direct navigation/refresh against the production preview.
  - [x] Verify 320px reflow, including a 160-character unbroken task title,
    and 200% text resizing without horizontal overflow in headless Edge.
  - [x] Verify status/error content in RTL and no uncaught browser runtime errors.
  - [ ] Verify actual screen-reader announcement quality.
  - [ ] Verify browser UI zoom at 200% (text resizing is not equivalent).
- [x] Add a root `README.md` covering setup, development, tests, lint, production
  build/preview, the two routes, and localStorage limitations. Document that a
  production host must rewrite SPA route requests such as `/about` to
  `index.html` for direct navigation and refresh to work.

**Exit criteria:** Tests, lint, and production build pass; manual checks confirm
the required interactions and persistence. The README enables a new contributor
to run and verify the app.

Verification: 25 tests across three files pass with `npm test -- --run`;
`npm run build` and `npm run lint` pass. The Vite template uses Oxlint.
Phase 1 is complete. Phase 2 implementation and automated verification are
complete; the two manual checks above remain open.

Skill-specific notes: Tasks is a `features` component because it owns state,
storage, and task rules. No UI-to-feature dependency direction violations.
Native controls avoid an additional UI-library dependency; Sass supports the
required SCSS module. CSF stories exist, but Storybook tooling/execution was
skipped; no Storybook check is claimed.

Dependency follow-up: npm reports seven high-severity development-tool findings
traced to transitive `picomatch` (GHSA-fc5q-39xc-vjpf). The registry's latest
version is affected; no compatible patch was available. No forced downgrade
or audit suppression was applied.
