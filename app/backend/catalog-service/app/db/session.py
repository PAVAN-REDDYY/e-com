"""Async engine + session factory and the FastAPI session dependency.

One engine per process (connection pooling lives here). ``get_session`` yields a
request-scoped ``AsyncSession`` and guarantees it is closed afterwards.
"""

from __future__ import annotations

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import get_settings

_settings = get_settings()

# SQLite needs check_same_thread off for async; Postgres ignores it.
_connect_args = {"check_same_thread": False} if _settings.is_sqlite else {}

engine = create_async_engine(
    _settings.database_url,
    echo=False,
    future=True,
    pool_pre_ping=True,  # transparently recycle dead connections (K8s/cloud DBs)
    connect_args=_connect_args,
)

SessionFactory = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autoflush=False,
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency: yields a session, always closes it."""
    async with SessionFactory() as session:
        yield session
