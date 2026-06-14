"""Order orchestration — the heart of the service.

create_order:
  1. validates the gift contract (recipient required when sending as a gift)
  2. fetches authoritative prices from catalog-service (never trusts the client)
  3. computes line totals, subtotal, shipping, and grand total
  4. persists an immutable order snapshot and returns it

Prices are always re-derived server-side from the catalogue, so a tampered or
stale client price can never affect what is charged.
"""

from __future__ import annotations

import secrets

from app.clients.catalog import CatalogClient
from app.core.errors import InvalidOrderError, NotFoundError
from app.models.order import Order, OrderItem
from app.repositories.order import OrderRepository
from app.schemas.order import CreateOrderRequest
from app.services.pricing import compute_shipping_cents, compute_total_cents

_ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # no ambiguous chars (0/O, 1/I)


def _generate_order_id() -> str:
    suffix = "".join(secrets.choice(_ID_ALPHABET) for _ in range(6))
    return f"FS-{suffix}"


class OrderService:
    def __init__(self, repository: OrderRepository, catalog: CatalogClient):
        self._repo = repository
        self._catalog = catalog

    async def create_order(self, payload: CreateOrderRequest) -> Order:
        if payload.delivery_mode == "gift" and payload.gift is None:
            raise InvalidOrderError(
                "Gift details are required when sending as a gift.",
                code="gift_details_required",
            )

        # Build priced line items from authoritative catalogue data.
        line_items: list[OrderItem] = []
        subtotal = 0
        currency = "USD"

        for item in payload.items:
            product = await self._catalog.get_product(item.product_id)
            line_total = product.price_cents * item.quantity
            subtotal += line_total
            currency = product.currency
            line_items.append(
                OrderItem(
                    product_id=product.id,
                    name=product.name,
                    size=item.size,
                    quantity=item.quantity,
                    unit_price_cents=product.price_cents,
                    line_total_cents=line_total,
                )
            )

        shipping = compute_shipping_cents(subtotal)
        total = compute_total_cents(subtotal, shipping)

        order = Order(
            id=_generate_order_id(),
            status="confirmed",
            delivery_mode=payload.delivery_mode,
            email=str(payload.contact.email),
            currency=currency,
            subtotal_cents=subtotal,
            shipping_cents=shipping,
            total_cents=total,
            shipping_address=payload.shipping_address.model_dump(),
            gift=payload.gift.model_dump() if payload.gift else None,
            items=line_items,
        )
        return await self._repo.add(order)

    async def get_order(self, order_id: str) -> Order:
        order = await self._repo.get(order_id)
        if order is None:
            raise NotFoundError(f"Order '{order_id}' was not found.", code="order_not_found")
        return order
