# catalog-service

Owns the **product catalogue** for fallseed.com. Read-mostly, no dependencies on
other services. (See [`../README.md`](../README.md) for the overall architecture
and cross-service troubleshooting.)

## API

| Method | Path                          | Description                                  |
| ------ | ----------------------------- | -------------------------------------------- |
| GET    | `/api/health`                 | Liveness probe                               |
| GET    | `/api/ready`                  | Readiness probe (checks DB)                  |
| GET    | `/api/products`               | List products. Query: `category`, `featured` |
| GET    | `/api/products/{id_or_slug}`  | Single product by **id** or **slug**         |

`GET /products/{id_or_slug}` resolves by primary id first (used by order-service)
then by slug (used by the storefront's product pages), so both callers work.

Interactive docs: `http://localhost:8001/docs`.

## Run

```bash
python -m venv .venv && .venv\Scripts\activate     # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head           # create schema
python -m app.db.seed          # load the 8 seed products (idempotent)
uvicorn app.main:app --reload --port 8001
```

In local dev (`ENV=local`) the schema is auto-created and seeded on startup, so a
fresh clone runs with just `uvicorn ...`. The `alembic`/`seed` commands are the
production path.

## Configuration

See `.env.example`. Key vars: `DATABASE_URL`, `CORS_ORIGINS` (comma-separated),
`API_PREFIX` (default `/api`), `PORT` (default 8001), `ENV`.

## Data model

`products` table; `images` and `sizes` are JSON value objects. Money is stored as
integer **cents** (`price_cents`) — never floats. v2 can normalise `sizes` into an
inventory table without changing the API contract.

## Tests

```bash
pip install -r requirements-dev.txt
pytest
```
