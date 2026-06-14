"""Order API schemas — the wire contract for POST /api/orders.

Mirrors the frontend's `src/types/order.ts`. camelCase on the wire, snake_case in
Python. Input is validated strictly so bad orders are rejected with a clear 422
before any catalogue calls or writes happen.
"""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pydantic.alias_generators import to_camel

DeliveryMode = Literal["self", "gift"]


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


# ── Input ────────────────────────────────────────────────────────────────────
class ContactIn(CamelModel):
    email: EmailStr


class AddressIn(CamelModel):
    full_name: str = Field(..., min_length=1, max_length=160)
    line1: str = Field(..., min_length=1, max_length=200)
    line2: str | None = Field(default=None, max_length=200)
    city: str = Field(..., min_length=1, max_length=100)
    state: str = Field(..., min_length=1, max_length=100)
    postal_code: str = Field(..., min_length=1, max_length=20)
    country: str = Field(..., min_length=1, max_length=100)
    phone: str | None = Field(default=None, max_length=40)


class GiftIn(CamelModel):
    recipient_name: str = Field(..., min_length=1, max_length=160)
    message: str | None = Field(default=None, max_length=400)
    hide_prices: bool = True


class OrderItemIn(CamelModel):
    product_id: str = Field(..., min_length=1, max_length=64)
    size: str = Field(..., min_length=1, max_length=16)
    quantity: int = Field(..., ge=1, le=99)


class CreateOrderRequest(CamelModel):
    contact: ContactIn
    delivery_mode: DeliveryMode
    shipping_address: AddressIn
    gift: GiftIn | None = None
    items: list[OrderItemIn] = Field(..., min_length=1)


# ── Output ───────────────────────────────────────────────────────────────────
class OrderItemRead(CamelModel):
    product_id: str
    name: str
    size: str
    quantity: int
    unit_price_cents: int
    line_total_cents: int


class OrderRead(CamelModel):
    id: str
    status: str
    delivery_mode: DeliveryMode
    email: str
    currency: str
    subtotal_cents: int
    shipping_cents: int
    total_cents: int
    items: list[OrderItemRead]
    gift: GiftIn | None = None
    created_at: datetime
