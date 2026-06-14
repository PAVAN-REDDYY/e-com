"""Request-scoped dependency wiring: session + catalog client → service."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.clients.catalog import CatalogClient, get_catalog_client
from app.db.session import get_session
from app.repositories.order import OrderRepository
from app.services.orders import OrderService

SessionDep = Annotated[AsyncSession, Depends(get_session)]
CatalogClientDep = Annotated[CatalogClient, Depends(get_catalog_client)]


def get_order_service(session: SessionDep, catalog: CatalogClientDep) -> OrderService:
    return OrderService(OrderRepository(session), catalog)


OrderServiceDep = Annotated[OrderService, Depends(get_order_service)]
