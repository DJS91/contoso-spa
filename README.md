# Task Tracker

A client-only React 19 + TypeScript SPA built with Vite. Add tasks, mark them
complete or incomplete, and delete them. No backend or account is required.

## Setup

Use Node.js 26 (the development runtime used for this app) and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Existing `.github` and `plan` folders are
preserved alongside the root app.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm test` | Run Vitest in watch mode. |
| `npm test -- --run` | Run all tests once. |
| `npm run test:run` | Alternative one-shot test command. |
| `npm run lint` | Run the Vite template's Oxlint checks. |
| `npm run build` | Type-check and create production output in `dist`. |
| `npm run preview` | Serve the production output locally. |

Tests use jsdom, React Testing Library, jest-dom, and user-event. They cover
routing, keyboard interactions, task actions, reload-equivalent remounts,
storage validation, and failed persistence.

## Routes and hosting

- `/`: Tasks.
- `/about`: About and storage limitations.

Navigation uses React Router's `BrowserRouter`. Production hosting must serve
`dist` and rewrite app-route requests such as `/about` to `index.html`; otherwise
direct navigation and refresh on that route may return a host-level 404.
Vite's dev and preview servers support this SPA fallback.

For IIS, install the IIS URL Rewrite module and deploy the contents of `dist`
as the site's root. Vite copies [public/web.config](public/web.config) to
`dist/web.config` during the build. Its fallback rewrites requests that are not
existing files or directories to `index.html`, enabling direct navigation and
refresh on `/about` while leaving static assets unchanged. No `.webmanifest`
MIME map is included because the app does not use a web manifest.

## Storage

Tasks are stored under `task-tracker.tasks.v1` in localStorage. They are local
to this origin, browser, profile, and device; there is no cross-device or
cross-tab synchronization. Clearing browser data removes them. Private browsing
may discard them when the session ends.

Missing storage starts an empty list. Malformed JSON or invalid tasks show an
error and are not overwritten on mount. Adding a task after that warning
replaces the malformed data. Read/write failures show an explicit unsaved
warning while the app remains usable in memory. A later successful task action
saves the current list; otherwise unsaved changes are lost on route exit,
reload, or tab closure. Do not store sensitive information on shared devices.

## Structure

- [App](src/App.tsx): shared layout and two routes.
- [Tasks page](src/pages/TasksPage.tsx): page title and feature composition.
- [Tasks feature](src/components/features/Tasks/): container/presentation split.
  `useTasks.tsx` owns state, persistence, event handling, and focus; `index.tsx`
  connects it to stateless `presentation.tsx`. `types.ts` defines the contract.
  Dependencies point from the feature toward storage; no UI-to-feature imports.
- [Storage](src/taskStorage.ts): task type and validated localStorage boundary.
- [Plan](plan/spa-v1.md): two-phase checklist and verification status.

Usage:

```tsx
import Tasks from './components/features/Tasks'

export default function TasksPage() {
  return <Tasks />
}
```

The Tasks feature is classified as `features` because it owns state, storage
effects, and task rules. Its CSS module uses Sass and shared color tokens.
Native HTML controls avoid the need for a UI-library dependency.
Presentation-only CSF stories cover Default, Empty, Error, and StorageError.
Storybook tooling is not configured and story execution has not been verified.

The initial dependency audit reported a high-severity development-tool advisory
for transitive `picomatch` (GHSA-fc5q-39xc-vjpf); no patched version was available
from the configured registry. Do not apply forced major-version downgrades.
Review `npm audit` and upgrade when a compatible patched version is available.

## Accessibility checks

The app includes labels, native controls, inline validation, a skip link, active
navigation, visible focus, route focus management, live status feedback, and
predictable focus after deletion. Completion is conveyed by text and checkbox
state, not color alone.

Before release, check keyboard-only use, screen-reader announcements, 320px
reflow, 200% zoom, and real-browser reload persistence. Unit tests are not a
substitute for these browser and assistive-technology checks.

Implementation verification: 25 tests, lint, and the production build pass.
An isolated headless Edge check also passed task actions, real reload
persistence, direct `/about` refresh, skip-link/Enter keyboard use, focus,
320px reflow with a long unbroken task, and 200% text resizing. Actual
screen-reader announcement quality and browser UI 200% zoom remain manual checks.
