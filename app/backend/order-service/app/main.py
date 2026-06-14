"""Application factory for order-service (mirrors catalog-service's structure)."""

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
logger = logging.getLogger("order.main")


@asynccontextmanager
async def lifespan(_: FastAPI):
    configure_logging(settings.log_level)
    logger.info(
        "Starting %s (env=%s, catalog=%s)",
        settings.service_name,
        settings.env,
        settings.catalog_service_url,
    )

    if settings.is_local:
        # Dev convenience: create schema automatically. Production uses Alembic.
        from app.db.base import Base
        from app.db.session import engine
        from app import models  # noqa: F401

        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    yield
    logger.info("Shutting down %s", settings.service_name)


def create_app() -> FastAPI:
    app = FastAPI(
        title="Fallseed · Order Service",
        version="0.1.0",
        description="Order placement and gifting for fallseed.com.",
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
