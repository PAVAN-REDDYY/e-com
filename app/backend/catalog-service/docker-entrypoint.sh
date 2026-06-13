#!/bin/sh
# Container entrypoint: bring the schema up to date, optionally seed, then run.
#
# RUN_MIGRATIONS (default "true")  — apply Alembic migrations on boot.
#   On Kubernetes you would instead run migrations as a Job/initContainer and set
#   RUN_MIGRATIONS=false here, so app pods never race each other on schema changes.
# SEED_ON_START (default "false")  — load seed data (idempotent; catalog only).
set -e

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "[entrypoint] Applying database migrations..."
  alembic upgrade head
fi

if [ "${SEED_ON_START:-false}" = "true" ]; then
  echo "[entrypoint] Seeding catalogue (idempotent)..."
  python -m app.db.seed
fi

echo "[entrypoint] Starting application: $*"
exec "$@"
