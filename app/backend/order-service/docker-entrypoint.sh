#!/bin/sh
# ─────────────────────────────────────────────────────────────────────────────
# order-service container entrypoint
#
# 1. Apply database migrations (Alembic) so the schema is up to date.
# 2. Launch the API server (Uvicorn).
#
# Running migrations here keeps "deploy" and "migrate" together for simple
# setups. In larger production systems migrations often run as a separate
# one-off job/init-container instead.
# ─────────────────────────────────────────────────────────────────────────────
set -e

echo "[entrypoint] Running database migrations..."
alembic upgrade head

echo "[entrypoint] Starting order-service on port ${PORT:-8002}..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8002}"
