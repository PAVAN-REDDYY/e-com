"""Product ORM model.

``images`` and ``sizes`` are stored as JSON for v1 simplicity — the catalogue is
read-mostly and these are always fetched with the product. v2 can normalise
``sizes`` into an inventory table without changing the API contract (the read
schema stays the same).
"""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON

from app.db.base import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Product(Base):
    __tablename__ = "products"

    # Stable business id (e.g. "tee-terra"); also used by the order service.
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    slug: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    category: Mapped[str] = mapped_column(String(40), index=True, nullable=False)
    tagline: Mapped[str] = mapped_column(String(240), nullable=False, default="")
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")

    # Money as integer minor units (cents) — never floats.
    price_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="USD")

    # JSON-encoded value objects: [{"url","alt"}] and [{"label","inStock"}].
    images: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    sizes: Mapped[list] = mapped_column(JSON, nullable=False, default=list)

    badge: Mapped[str | None] = mapped_column(String(40), nullable=True)
    featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, onupdate=_utcnow
    )
