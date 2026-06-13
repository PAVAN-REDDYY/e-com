"""Application factory for catalog-service.

Wiring lives here and nowhere else: logging, CORS, exception handlers, the
versioned router, and a lifespan that (in local dev only) auto-creates tables and
seeds data so a fresh clone runs with zero manual migration steps. In
staging/production, schema is owned by Alembic migrations run as a job.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.errors import register_exception_handlers
from app.core.logging import configure_logging

settings = get_settings()
logger = logging.getLogger("catalog.main")


@asynccontextmanager
async def lifespan(_: FastAPI):
    configure_logging(settings.log_level)
    logger.info("Starting %s (env=%s)", settings.service_name, settings.env)

    if settings.is_local:
        # Dev convenience: create schema + seed without a manual migration step.
        # Production relies on Alembic (`alembic upgrade head`) instead.
        from app.db.base import Base
        from app.db.session import engine
        from app.db.seed import seed
        from app import models  # noqa: F401  (ensure models are registered)

        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        await seed()

    yield
    logger.info("Shutting down %s", settings.service_name)


def create_app() -> FastAPI:
    app = FastAPI(
        title="Fallseed · Catalog Service",
        version="0.1.0",
        description="Product catalogue for fallseed.com.",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)
    app.include_router(api_router, prefix=settings.api_prefix)

    return app


app = create_app()
