"""Order endpoints.

    POST /api/orders          → create an order (prices resolved from catalogue)
    GET  /api/orders/{id}      → fetch an order (confirmation page / support)
"""

from __future__ import annotations

from fastapi import APIRouter, status

from app.api.deps import OrderServiceDep
from app.schemas.order import CreateOrderRequest, OrderRead

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
async def create_order(payload: CreateOrderRequest, service: OrderServiceDep) -> OrderRead:
    order = await service.create_order(payload)
    return OrderRead.model_validate(order)


@router.get("/{order_id}", response_model=OrderRead)
async def get_order(order_id: str, service: OrderServiceDep) -> OrderRead:
    order = await service.get_order(order_id)
    return OrderRead.model_validate(order)
