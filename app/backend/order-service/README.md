# order-service

Order placement and pricing for **fallseed.com**. A small, self-contained
FastAPI microservice that owns the **orders** database and calls **catalog-service**
over HTTP for authoritative product prices.

It is deliberately independent: it never touches the catalogue database — it asks
the catalog API for product data, enforcing a clean service boundary.

---

## Tech stack

| Concern          | Choice                                  |
|------------------|-----------------------------------------|
| Web framework    | FastAPI                                 |
| Server           | Uvicorn                                 |
| Config           | pydantic-settings (12-factor env vars)  |
| ORM / migrations | SQLAlchemy (async) + Alembic            |
| Database         | SQLite (local) · PostgreSQL (prod)      |
| Upstream call    | httpx → catalog-service                 |

---

## API

Base path: `/api`

| Method | Path                 | Description                          |
|--------|----------------------|--------------------------------------|
| GET    | `/api/health`        | Liveness probe                       |
| GET    | `/api/ready`         | Readiness probe (checks the DB)      |
| POST   | `/api/orders`        | Place an order                       |
| GET    | `/api/orders/{id}`   | Fetch an order by id                 |

Interactive docs (when running): `http://localhost:8002/docs`

---

## Local development

```bash
# 1. Create & activate a virtual environment
python -m venv .venv
.venv\Scripts\activate          # PowerShell:  .venv\Scripts\Activate.ps1

# 2. Install dependencies
pip install -r requirements-dev.txt

# 3. Create your local env file from the template
copy .env.example .env          # macOS/Linux: cp .env.example .env

# 4. Run the API (defaults to SQLite — orders.db is created automatically)
uvicorn app.main:app --reload --port 8002
```

> `catalog-service` must be running (default `http://localhost:8001/api`) for
> order placement to succeed, since prices are fetched live.

---

## Database migrations (Alembic)

```bash
alembic upgrade head            # apply migrations
alembic revision --autogenerate -m "describe change"   # create a new migration
```

In local mode the schema is also auto-created on startup for convenience;
production relies solely on migrations.

---

## Running with Docker

```bash
docker build -t fallseed-order-service .
docker run --rm -p 8002:8002 --env-file .env fallseed-order-service
```

The image installs the Postgres driver, so the same image runs against SQLite or
Postgres depending on `DATABASE_URL`. The entrypoint runs `alembic upgrade head`
before starting Uvicorn.

For Postgres, point `DATABASE_URL` at your instance:

```
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/orders
```

---

## Configuration

All configuration is via environment variables — see [`.env.example`](.env.example)
for the full annotated list. Key variables:

| Variable                        | Default                              | Purpose                          |
|---------------------------------|--------------------------------------|----------------------------------|
| `DATABASE_URL`                  | `sqlite+aiosqlite:///./orders.db`    | Orders database                  |
| `CATALOG_SERVICE_URL`           | `http://localhost:8001/api`          | Upstream catalog API             |
| `CATALOG_TIMEOUT_SECONDS`       | `5`                                  | Upstream request timeout         |
| `CORS_ORIGINS`                  | `http://localhost:5173,...`          | Allowed browser origins          |
| `PORT`                          | `8002`                               | Server port                      |
| `FREE_SHIPPING_THRESHOLD_CENTS` | `15000`                              | Free-shipping threshold          |
| `FLAT_SHIPPING_CENTS`           | `700`                                | Flat shipping fee                |

> **Never commit your real `.env`** — commit only `.env.example` with placeholders.
