"""Reusable FastAPI dependencies that wire the request-scoped object graph:
session → repository → service. Routes depend on the service only.
"""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.repositories.product import ProductRepository
from app.services.catalog import CatalogService

SessionDep = Annotated[AsyncSession, Depends(get_session)]


def get_catalog_service(session: SessionDep) -> CatalogService:
    return CatalogService(ProductRepository(session))


CatalogServiceDep = Annotated[CatalogService, Depends(get_catalog_service)]
