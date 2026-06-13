# syntax=docker/dockerfile:1

# ──────────────────────────────────────────────────────────────────────────────
# catalog-service — production image
#
# Multi-stage: a builder installs dependencies into an isolated virtualenv, and a
# slim runtime image copies only that venv + the app. Result: a small, compiler-
# free final image that runs as a non-root user.
#
# Pinned to Python 3.12 (stable, full wheel coverage incl. asyncpg). Note: local
# dev may use 3.14, but the production image deliberately pins a known-good version.
# ──────────────────────────────────────────────────────────────────────────────

############################
# Stage 1 — build deps
############################
FROM python:3.12-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Isolated virtualenv we can copy wholesale into the runtime stage.
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app
COPY requirements.txt requirements-postgres.txt ./
# Runtime deps + the PostgreSQL driver (asyncpg ships manylinux wheels → no compiler).
RUN pip install -r requirements-postgres.txt

############################
# Stage 2 — runtime
############################
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH" \
    ENV=production

# Non-root system user.
RUN groupadd --system app && useradd --system --gid app --home-dir /app app

WORKDIR /app

# Bring in the prebuilt virtualenv.
COPY --from=builder /opt/venv /opt/venv

# Application code + migrations + entrypoint.
COPY app ./app
COPY alembic ./alembic
COPY alembic.ini ./alembic.ini
COPY docker-entrypoint.sh ./docker-entrypoint.sh

# Normalise potential CRLF (Windows checkouts) and set ownership/permissions.
RUN sed -i 's/\r$//' ./docker-entrypoint.sh \
    && chmod +x ./docker-entrypoint.sh \
    && chown -R app:app /app

USER app

EXPOSE 8001

# Liveness baked into the image. slim has no curl, so use Python's stdlib.
HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
    CMD python -c "import urllib.request,sys; r=urllib.request.urlopen('http://localhost:8001/api/health'); sys.exit(0 if r.status==200 else 1)"

ENTRYPOINT ["./docker-entrypoint.sh"]
# One uvicorn process per container; scale with replicas (K8s), not in-process workers.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
