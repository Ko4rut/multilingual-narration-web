# POI Categories Management (Admin Web)

Page: `/poi-categories`; branch: `feature/poi-category-crud-ui`.

## Web capabilities

- Search/list categories through existing public Catalog API.
- Add a Category with `category_name` and immutable `category_code`.
- View and edit category name (code deliberately read-only because Offline Package
  `package_key` embeds the category code).
- Delete through a typed-code confirmation. No optimistic delete: only a
  successful Backend response removes the category from the screen.
- Display validation, duplicate, auth, conflict and HTTP errors; support
  English and Vietnamese UI preferences.
- Keep the existing POI forms and Mobile category-reading endpoints unchanged.

## Backend dependency (not implemented in reviewed Backend branch)

The frontend connects to these **proposed** Admin Catalog endpoints:

| Method | Path | Body | Expected |
| ------ | ---- | ---- | -------- |
| POST | `/api/v1/admin/catalog/categories` | `{category_name, category_code}` | 201 + Category |
| PATCH | `/api/v1/admin/catalog/categories/{id}` | `{category_name}` | 200 + Category |
| DELETE | `/api/v1/admin/catalog/categories/{id}` | none | 204 |

The current Backend provides only `GET /api/v1/catalog/categories`.
Writes must require authenticated Admin permissions; enforce unique category
name/code, code pattern, and transactional integrity. **DELETE must return
409 and preserve data if the Category is referenced** by `poi_category_mapping`
or `offline_package`. The POI mapping FK is presently CASCADE; do not rely
on that default when implementing category deletion.

Because Category codes are embedded in published Offline Package keys, the
frontend does not allow changing the code once created. The Backend should
also enforce this rule. Creation/editing/deletion must never report success
to the user when the Backend endpoint is not available (404/405).

## Verification

Run `npm ci && npm run typecheck && npm run lint`.
After sign-in visit `http://localhost:3000/poi-categories`. Until the
Backend is extended, listing works but submitting write actions displays
the explicit missing-API error. Runtime end-to-end CRUD with persisted
PostgreSQL remains pending Backend implementation.
