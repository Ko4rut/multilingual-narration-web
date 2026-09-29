---
name: mans-frontend
description: Implement and review changes in the MANS employee admin frontend using its feature architecture, mock data, i18n and style tokens. Use for work in this repository.
---

# MANS frontend conventions

Paths below are relative to the repository root. Apply these rules to new and changed modules; do not expand a task into an unrelated whole-project refactor.

## Before editing

- Read root `AGENTS.md` and any more specific instructions. Consult the relevant installed Next.js guides in `node_modules/next/dist/docs/` before writing framework code.
- Inspect the owning feature and its callers before choosing where code belongs.
- Read `src/i18n/messages.ts`, `src/i18n/types.ts`, the preferences hooks, `src/styles/tokens.css`, and the relevant styles before changing UI. Reuse existing translations and semantic tokens.
- If `docs/agent-handoff.md` exists, read it and verify its status against the working tree before continuing. Preserve user changes and prior accepted requirements.

## Module responsibilities

Organize domain code in `src/features/<feature>/`:

- `components/`: render markup from props and hooks. Bind event handlers supplied by hooks; do not embed authentication, request orchestration, storage, validation workflows or effects in a rendering component. Simple event-to-value bindings are fine.
- `hooks/`: client state, effects, event handlers, form coordination and interaction logic. Hooks call services or server actions; they do not contain JSX or server secrets.
- `types.ts` or `types/`: props, domain models, action states and shared contracts. Import types with `import type`; avoid declaring domain/props types inside component files.
- `services/`: data access adapters and non-UI operations. Keep server authentication and authorization at each protected data/action boundary, even when routes are guarded.
- `actions.ts`: Next.js server actions for mutations, server-side validation and session changes. A client hook does not replace server credential verification.
- `mocks/`: typed mock records/factories when real API integration has not been explicitly requested. Keep mocks separate from components and hooks and label demo behavior honestly. Do not add a real API or database implicitly.
- `constants.ts` and `utils/`: static feature configuration and reusable pure helpers when needed.

Create only folders that contain useful code. Keep `src/app` pages/layouts thin: routing, metadata, server composition. Feature-specific cards/charts stay in that feature. Reusable visual primitives belong in `src/components/ui`; cross-feature layout belongs in `src/components/layout`. Do not duplicate shared UI in individual features.

## Product, i18n and styles

- Employee accounts are provisioned by the application. Do not add public registration unless explicitly requested.
- Login has no locale/theme picker. Default to browser language (supported: Vietnamese and English, otherwise English) and system color scheme. Explicit preferences chosen inside the application override system defaults and persist across reloads and future visits, including login/logout.
- Do not save automatically detected defaults as explicit preferences. Until the user chooses an override, follow browser/system changes. Render system colors with CSS before hydration to avoid a flash of the wrong theme; use the request language for server rendering and centralize client detection in the preferences hook.
- Read translations through `usePreferences()` / `t(...)`, add Vietnamese messages centrally, and use the selected locale for number/date formatting. Do not scatter translated text or duplicate locale detection in components.
- Use semantic CSS variables from `src/styles/tokens.css` and the utilities exposed by `src/app/globals.css`. Extend tokens centrally when necessary; do not introduce arbitrary repeated colors, font families or typography values in new UI. Check both light/dark themes and reduced-motion behavior for animation changes.

## Verification and handoff

- Run lint, TypeScript/build and focused behavior checks appropriate to the change. Auth changes must exercise rejected/accepted login, protected routes and logout. Preference changes must exercise clean-browser defaults and saved overrides.
- Keep setup documentation and affected tests aligned with final behavior. Report checks actually run and any unresolved failures.
- If context or token capacity is nearly exhausted while work remains, write/update `docs/agent-handoff.md` **before** losing context. Include: original objective; accepted decisions and constraints; completed changes with paths; remaining tasks in order; commands/checks and results; active processes/ports; blockers and exact next action. Do not include passwords, cookies, tokens or other secrets.
- State clearly that work remains; do not mark an incomplete task finished. On resume, read the handoff, inspect the working tree and continue from the next action rather than restarting. When the work completes, mark the handoff complete and clear stale pending items.
