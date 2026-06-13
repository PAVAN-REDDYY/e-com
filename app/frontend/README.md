# Fallseed — Storefront (Frontend)

The customer-facing storefront for **fallseed.com**, a minimalist apparel shop
(t-shirts, shirts, hoodies, jackets — with room for new categories). Customers can
browse, add to a persistent cart, and check out with the order **delivered to
themselves** or **sent as a gift** to someone else (with a note and hidden prices).

Built as a **decoupled service**: it talks to the backend only over HTTP via a
configurable base URL, so it containerises and deploys to Kubernetes independently
of the API.

> **Status:** Wired to the live backend. The two FastAPI microservices
> (`catalog-service` :8001, `order-service` :8002) are built — set
> `VITE_USE_MOCK_API=false` (the default in `.env.example`) to use them, or flip it
> to `true` to run the storefront standalone on the built-in mock data layer.

---

## Tech stack

| Concern        | Choice                                  |
| -------------- | --------------------------------------- |
| Framework      | React 18 + TypeScript                   |
| Build tool     | Vite 5                                   |
| Styling        | Tailwind CSS 3                           |
| Routing        | React Router 6                          |
| State          | React Context + `useReducer` (cart)     |
| Data layer     | `fetch` wrapper with typed errors        |

No global state library, no UI kit — kept lean and dependency-light on purpose so
v2 can add only what it needs.

---

## Quick start

```bash
cd frontend

# 1. Configure environment (never commit the real .env)
cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env

# 2. Install dependencies
npm install

# 3. Run the dev server (http://localhost:5173)
npm run dev
```

Other scripts:

```bash
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build locally
npm run lint       # eslint
npm run typecheck  # tsc, no emit
```

---

## Configuration

All configuration is environment-driven (see `.env.example`). **Only `VITE_`-prefixed
variables reach the browser — never put secrets in them.**

| Variable                     | Purpose                                                | Default                     |
| ---------------------------- | ------------------------------------------------------ | --------------------------- |
| `VITE_CATALOG_API_BASE_URL`  | catalog-service base URL (no trailing slash)           | `http://localhost:8001/api` |
| `VITE_ORDERS_API_BASE_URL`   | order-service base URL (no trailing slash)             | `http://localhost:8002/api` |
| `VITE_USE_MOCK_API`          | `true` = local fixtures; `false` = call the services   | `false`                     |
| `VITE_STORE_NAME`          | Display name                                         | `Fallseed`                  |
| `VITE_STORE_CURRENCY`      | ISO currency code for price formatting               | `USD`                       |
| `VITE_STORE_SUPPORT_EMAIL` | Contact email shown in UI                            | `hello@fallseed.com`        |
| `FRONTEND_PORT`            | Dev/preview server port                              | `5173`                      |

> Vite inlines `VITE_*` vars **at build time**. In Kubernetes, set them in the build
> step (or use a runtime-config entrypoint) — changing them after `npm run build`
> has no effect on an already-built bundle.

---

## Project structure

Small files, clear separation of concerns — designed to extend into v2.

```
src/
├─ config/        env.ts — validated, centralised env access
├─ lib/           framework-free helpers (money formatting, classnames)
├─ types/         domain models (Product, Cart, Order) — mirror the API contract
├─ data/          mock product fixtures (used while the backend is absent)
├─ api/           client.ts (fetch + typed errors) + service modules (products, orders)
├─ context/       cart state (provider, reducer, totals)
├─ hooks/         useCart, useAsync
├─ components/
│  ├─ ui/         primitives: Button, Input, Badge, Spinner, error/empty states…
│  ├─ layout/     Header, Footer, Layout
│  ├─ product/    ProductCard, ProductGrid, CategoryFilter, SizeSelector
│  ├─ cart/       CartDrawer, CartItemRow
│  └─ system/     ErrorBoundary
├─ features/
│  └─ checkout/   delivery-mode toggle, address/gift fields, validation, summary
└─ pages/         Home, Shop, Product, Cart, Checkout, OrderConfirmation, NotFound
```

**The API boundary is one file deep.** Components call `src/api/*`; those modules
decide between mock and live based on `VITE_USE_MOCK_API`. Going live = flip the env
var. No component changes.

---

## Live backend vs. mock data

The app talks to **two microservices** (`catalog-service` :8001, `order-service`
:8002 — see `../backend/`). To run fully live:

1. Start both backend services (catalog first). See `../backend/README.md`.
2. In `.env`: `VITE_USE_MOCK_API=false` and confirm the two
   `VITE_*_API_BASE_URL` values point at them (defaults already do).
3. Restart `npm run dev`.

To run the storefront **standalone** (no backend), set `VITE_USE_MOCK_API=true`.
The mock fixtures in `src/data/products.ts` match the live API response shape
(`Product`, `Order` types in `src/types/`), so the contract is identical either way.
The service boundary is one file deep: `src/api/products.ts` → catalog,
`src/api/orders.ts` → orders (each bound via `createClient(baseUrl)`).

---

## Troubleshooting

Common pitfalls and how to clear them quickly.

### CORS errors
> *Symptom:* console shows `... has been blocked by CORS policy` or requests fail
> with no HTTP status; the app shows "We couldn't reach our servers."

- The **backend** must allow this origin. In FastAPI, add the frontend origin to
  `CORSMiddleware` `allow_origins` (env-driven — e.g. `CORS_ORIGINS=http://localhost:5173`).
- Confirm `VITE_API_BASE_URL` points at the API's real host/port, scheme included.
- A thrown `fetch` (vs an HTTP error) almost always means CORS, wrong URL, or the
  server is down — `src/api/client.ts` raises a `NetworkError` with the exact URL
  it tried, so read that message first.

### Environment misconfiguration
> *Symptom:* app crashes on load with `[config] Missing required environment variable`.

- You didn't create `.env` (or it's missing `VITE_API_BASE_URL`). Run
  `cp .env.example .env`.
- You renamed a var without the `VITE_` prefix — then it won't reach the browser.
- You changed `.env` but the running dev server cached the old value — **restart**
  `npm run dev` (Vite reads env at startup).

### Port conflicts
> *Symptom:* `Port 5173 is already in use` or the app opens on an unexpected port.

- Set `FRONTEND_PORT` in `.env` to a free port, or stop the other process.
- `strictPort` is off, so Vite will auto-pick the next free port and print it —
  read the terminal for the actual URL.
- Windows: find the offender with `netstat -ano | findstr :5173`, then
  `taskkill /PID <pid> /F`.

### Frontend ↔ backend connection issues
> *Symptom:* product lists are empty or checkout fails once `VITE_USE_MOCK_API=false`.

- Is the backend actually running and reachable at `VITE_API_BASE_URL`? Test it:
  `curl http://localhost:8000/api/products`.
- Mismatched path: the client prefixes the base URL, so the base should include any
  shared prefix (e.g. `/api`) and routes should **not** repeat it.
- Still seeing mock data? `VITE_USE_MOCK_API` is still `true`, or the dev server
  wasn't restarted after the change.

### Database / migration failures
> Not applicable to the frontend — these surface in the **backend** service. The UI's
> job is to render them clearly: API errors are shown via `ErrorState`/inline messages
> with the backend's `detail` text, and a "Try again" affordance.

### Blank white screen
- Check the browser console. A render crash is caught by the app-level
  `ErrorBoundary` (`src/components/system/ErrorBoundary.tsx`), which shows a recovery
  screen instead of a blank page — if you see a true blank, the failure is likely in
  bootstrap (`main.tsx`) or a missing `#root` in `index.html`.

---

## Roadmap (v2 hooks already in place)

- Swap `useAsync` for TanStack Query without changing call sites.
- Add auth tokens centrally in `src/api/client.ts`.
- New product categories: extend `ProductCategory` in `src/types/product.ts`.
- Runtime config (instead of build-time) via an injected `config.js` for true
  build-once-deploy-anywhere Kubernetes images.
