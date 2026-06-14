# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────────────────────────────────────
# order-service — production image
#
# Single-stage slim Python image. Installs the Postgres driver so the same image
# runs against either SQLite (local) or Postgres (compose/production), chosen at
# runtime via DATABASE_URL. The entrypoint runs Alembic migrations, then Uvicorn.
# ─────────────────────────────────────────────────────────────────────────────

FROM python:3.12-slim AS runtime

# - PYTHONDONTWRITEBYTECODE: no .pyc files in the image
# - PYTHONUNBUFFERED: logs stream straight to the console
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8002

WORKDIR /app

# Install deps first for better layer caching (asyncpg needs build tools).
COPY requirements.txt requirements-postgres.txt ./
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc \
    && pip install --no-cache-dir -r requirements.txt -r requirements-postgres.txt \
    && apt-get purge -y gcc \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Application source.
COPY . .

# Run as a non-root user.
RUN adduser --disabled-password --gecos "" appuser \
    && chown -R appuser:appuser /app \
    && chmod +x docker-entrypoint.sh
USER appuser

EXPOSE 8002

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://localhost:8002/api/health').status==200 else 1)" || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
