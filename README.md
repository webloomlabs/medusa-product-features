# Product Features (Medusa v2 plugin)

Adds a reusable **product features** concept to Medusa — the icon + title + subtitle list often shown on a product page (e.g. _"Breathable / No AC, no sweat"_, _"Pockets / Freedom for your hands"_).

- Admins manage a **global catalog** of features from **Settings → Product Features**. Each feature has a **title** (required), an optional **subtitle**, and an optional **icon image** (uploaded via Medusa's File Module).
- On each product page, a **Features** widget lets admins pick features from the catalog and **order them per product**.
- Storefronts read a product's ordered features through a public store API route.

## Screenshots

**Global feature catalog** — managed from Settings → Product Features (create, edit, delete features with title, subtitle, and icon):

![Global feature catalog under Settings](https://raw.githubusercontent.com/webloomlabs/medusa-product-features/main/screenshots/globle-features-list.png)

**Per-product assignment** — pick features from the catalog and order them per product (reorder with the arrows, remove, or add from Available):

![Assigning and ordering features on a product](https://raw.githubusercontent.com/webloomlabs/medusa-product-features/main/screenshots/feature-assignment.png)

## Architecture

- **Module** `productFeatures` (`src/modules/product-features`) — a single `Feature` data model (`title`, `subtitle`, `icon`).
- **Module link** `src/links/product-feature.ts` — many-to-many product ↔ feature with a `rank` extra column holding the per-product order.
- **Workflows** (`src/workflows`) — `createFeature`, `updateFeature`, `deleteFeature`, and `setProductFeatures` (replaces a product's feature links with a new, ordered set).
- **API routes** (`src/api`) — admin CRUD + per-product assignment, and a public store read route.
- **Admin UI** (`src/admin`) — a Settings page for the catalog and a product-detail widget for assignment/ordering.

## Install into a Medusa app

1. Build / publish the plugin locally (e.g. `npx medusa plugin:publish` + `yalc`, or `npm run dev` to watch).
2. Add it to the app's `medusa-config.ts`:
   ```ts
   module.exports = defineConfig({
     plugins: ["product-features"],
   })
   ```
3. In the **app**, run migrations to create the module table **and** the link table:
   ```bash
   npx medusa db:migrate
   ```

### Generating migrations (plugin development)

Migration files ship inside the plugin. Regenerate them after changing the data model — this needs a **running Postgres**:

```bash
npx medusa plugin:db:generate   # generates migrations for all modules in the plugin
```

## API

| Method & path | Auth | Description |
| --- | --- | --- |
| `GET /admin/product-features` | admin | List catalog features |
| `POST /admin/product-features` | admin | Create a feature `{ title, subtitle?, icon? }` |
| `GET /admin/product-features/:id` | admin | Retrieve a feature |
| `POST /admin/product-features/:id` | admin | Update a feature |
| `DELETE /admin/product-features/:id` | admin | Delete a feature |
| `GET /admin/products/:id/features` | admin | A product's features, ordered |
| `POST /admin/products/:id/features` | admin | Set a product's features `{ feature_ids: [] }` (array order = display order) |
| `GET /store/products/:id/features` | publishable key | A product's features, ordered — `{ features: [{ id, title, subtitle, icon }] }` |

Icons are uploaded through the built-in admin upload endpoint (`sdk.admin.upload.create`); the returned URL is stored on the feature.

## Development

```bash
npm install
npm run dev     # medusa plugin:develop
npm run build   # medusa plugin:build
```
