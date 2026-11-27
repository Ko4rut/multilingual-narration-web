# Admin Web — Offline Package Management

Implemented route: `/offline-packages` on
`feature/offline-package-management-ui`. Menu item is under **Content**.

## Implemented against existing Backend API

- `GET /api/v1/admin/offline/packages` (Bearer token, all pages): package
  versions, status, Region/Language/Category IDs and checksums.
- `GET /api/v1/admin/offline/packages/{package_id}/items` (Bearer token):
  membership POI/content/audio, displayed in the details sheet.
- `GET /api/v1/catalog/regions`, `/languages`, `/categories`:
  labels for filters and registration form.

Existing Backend workers automatically build and publish package versions.
An Admin must **not** edit the `category_id` field of an existing published
package; scope is part of the logical `package_key`.

## Backend integration still required

The form submits an authenticated server action to the proposed endpoint:

```
POST /api/v1/admin/offline/package-scopes
{
  "region_id": "region-...",
  "language_id": "lang-...",
  "category_id": null | "category-..."
}
```

**This endpoint does NOT exist in the currently reviewed Backend branch.**
Until it is implemented, the form shows an explicit 404-related error and
does not create fake success state.

Backend implementation should validate Admin create permission; Region,
SUPPORTED Language and Category references; deduplicate the immutable
Region+Language+Category scope; atomically register/enqueue build work; and
let the offline worker publish the resulting manifest. Include a no-eligible-
POIs decision, idempotency, and tests for concurrent requests.

## Local checks

```bash
npm ci
npm run typecheck
npm run lint
npm run dev
```

After login, visit `http://localhost:3000/offline-packages`.
For Backend, set `BACKEND_API_URL=http://localhost:8000/api/v1` in the Web
server environment, or the equivalent reachable origin. Verify:
- Published/base-scope packages, build status and total count
- Search/filter Region, Language, Category and Status
- Click package row to inspect membership
- Invalid or expired Backend token returns an error
- A new registration request fails transparently until the Backend API exists
