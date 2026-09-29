# Frontend setup

## Routing

Next.js reads routes from `src/app`. A folder becomes a public page when it contains `page.tsx`.

- `src/app/page.tsx` → `/`, redirects to `/login`.
- `src/app/(auth)/login/page.tsx` → `/login`.
- `src/app/(admin)/dashboard/page.tsx` → `/dashboard`.
- Parenthesized route groups organize layouts without adding URL segments.
- `layout.tsx` wraps its descendant pages. `src/app/layout.tsx` is the root.
- `next.config.ts` configures Next.js; `src/constants/navigation.ts` defines menu links, not routes.
- Framework package and version: `node_modules/next`, `package.json`.

## Mock authentication

Use **admin@mans.vn / admin123**. Credentials are compared as exact strings in `src/features/auth/actions.ts` on the server. Successful login creates a signed, HttpOnly, SameSite=Lax cookie lasting eight hours. Logout deletes it.

`src/proxy.ts` guards every current admin route, the admin layout also checks the session, and the dashboard service checks before reading data. Add future admin paths to the proxy matcher and authenticate future services/actions at their data boundary.

This is a demo account, not production authentication. Replace the string comparison and demo signing secret with a real identity backend and a private `AUTH_SECRET` before using real data. Employees receive provisioned accounts; public registration is removed. Password reset remains a placeholder.

## Components and charts

- `src/components/ui/Card.tsx`: shared presentation shell.
- `src/features/dashboard/components/StatCard.tsx`: dashboard-specific statistics.
- `src/features/dashboard/components/DashboardCharts.tsx`: interactive line/bar charts with keyboard support.
- Animation uses CSS, replays after changing reporting period or clicking Replay, and honors `prefers-reduced-motion`.
- No shadcn/Recharts dependency added. Adopt chart primitives when richer chart types, axes, legends or zoom are needed.

## Theme and typography

Edit `src/styles/tokens.css` for dark/light semantic colors, font families and type scale. `src/app/globals.css` maps these into Tailwind v4 utilities.

```tsx
<section className="bg-surface text-foreground border-border font-sans">
  <h2 className="font-display text-title">Title</h2>
  <p className="text-muted text-body">Description</p>
</section>
```

CSS modules can use `color: var(--foreground)` and `font-family: var(--font-heading)`.

## i18n

`src/i18n/messages.ts` contains Vietnamese translations; English source messages serve as fallback. In client components, use `const { t, locale } = usePreferences()` and `t("Sign In")`. Format numbers with `Intl.NumberFormat(locale)` or `toLocaleString(locale)`.

Theme and locale controls appear only inside the application sidebar. With no saved override, locale follows the browser (Vietnamese/English, otherwise English) and colors follow the system using CSS light-dark() before hydration. Explicit choices persist in cookies for one year and override system defaults on future visits, including login and logout. Automatically detected defaults are not saved as overrides. URL paths stay unchanged; this is an internal dictionary setup, not next-intl or locale-prefixed routing. Extend the dictionary as features are added.

## Validation

Run `npm run lint`, `npm run typecheck`, and `npm run build`. For browser smoke tests, start the dev server on port 3000, install Python Playwright (`python -m pip install playwright`) and Chrome, then run `python -X utf8 tests/smoke.py`. Tests cover protected routes, valid/invalid login, session tampering, logout, preference persistence, chart controls, reduced motion, and mobile overflow.

## Feature architecture

Authentication UI lives in `features/auth/components`, form behavior in `hooks/useAuthForm.ts`, contracts in `types.ts`, static copy in `constants.ts`, and demo credentials in `mocks/auth.mock.ts`. Server actions still validate credentials and manage sessions. Shared preference behavior lives in `features/preferences/hooks`, separate from its rendering components and types.

Required project conventions: [MANS frontend skill](skills/mans-frontend/SKILL.md). Read `docs/agent-handoff.md` when resuming unfinished work.
