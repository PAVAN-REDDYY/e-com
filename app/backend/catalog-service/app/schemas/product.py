"""API (Pydantic) schemas for the catalogue.

These define the wire contract consumed by the frontend (`src/types/product.ts`)
and the order service. Field names are camelCase on the wire to match the
TypeScript client, while the ORM uses snake_case — bridged via aliases.
"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """Base that serialises to camelCase and accepts either case on input."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class ProductImage(CamelModel):
    url: str
    alt: str


class ProductSize(CamelModel):
    label: str
    in_stock: bool = True


class ProductRead(CamelModel):
    id: str
    slug: str
    name: str
    category: str
    tagline: str
    description: str
    price_cents: int = Field(..., ge=0)
    currency: str
    images: list[ProductImage]
    sizes: list[ProductSize]
    badge: str | None = None
    featured: bool = False
