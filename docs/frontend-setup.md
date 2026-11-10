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

## Backend authentication

Login gọi `POST /api/v1/auth/login` của MNR Backend qua Server Action. Access token
được giữ trong cookie HttpOnly; sidebar và Profile lấy user hiện tại từ
`GET /api/v1/auth/me`. User Management gọi API thật để đọc role/user và lưu thao
tác tạo, cập nhật vào PostgreSQL.

Khai báo `BACKEND_API_URL` và `AUTH_SECRET` theo `.env.example`. Có thể dùng
`LOCAL_LOGIN_EMAIL`/`LOCAL_LOGIN_PASSWORD` để điền sẵn form trên máy local; không
cấu hình hai biến này ở production.

`src/proxy.ts` guards every current admin route, the admin layout also checks the session, and the dashboard service checks before reading data. Add future admin paths to the proxy matcher and authenticate future services/actions at their data boundary.

`AUTH_SECRET` ký session cookie của Next.js và phải là secret riêng có entropy cao
ở production. Employees receive provisioned accounts; public registration is
removed. Password reset remains a placeholder.

## Components and charts

- `src/components/ui/card.tsx`: shared shadcn/ui presentation shell.
- `src/features/dashboard/components/StatCard.tsx`: dashboard-specific statistics.
- `TrendChart.tsx`, `VisitsChart.tsx` and `VisitorHeatmap.tsx`: focused interactive dashboard visualizations with keyboard support.
- Animation uses CSS, replays after changing reporting period or clicking Replay, and honors `prefers-reduced-motion`.
- Shared controls use shadcn/ui; dashboard charts remain custom SVG/CSS and can adopt richer chart primitives when axes, legends or zoom are needed.

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

Theme and locale controls appear only inside the application sidebar. With no saved override, locale defaults to English and colors follow the system using CSS light-dark() before hydration. Explicit choices persist in cookies for one year and override the defaults on future visits, including login and logout. Defaults are not saved as overrides. URL paths stay unchanged; this is an internal dictionary setup, not next-intl or locale-prefixed routing. Extend the dictionary as features are added.

## Validation

Run `npm run lint`, `npm run typecheck`, and `npm run build`. Auth changes should additionally exercise rejected and accepted login, protected route redirects and logout in a browser. UI changes should be checked in both themes and at mobile/desktop widths.

## Feature architecture

Authentication UI lives in `features/auth/components`, form behavior in
`hooks/use-auth-form.ts`, endpoint adapters in `api/auth.api.ts`, contracts in
`types/auth.types.ts`, and static copy in `constants/auth.constants.ts`. Server
actions manage cookies and call the backend adapter. Shared preference behavior
lives in `features/settings/hooks`, separate from rendering components and types.

Required project conventions: [MANS frontend skill](skills/mans-frontend/SKILL.md). Read `docs/agent-handoff.md` when resuming unfinished work.
