"""Data-access layer for products.

The repository is the *only* place that knows about SQLAlchemy queries. Services
depend on this interface, which keeps query logic testable and swappable (e.g. a
read replica or cache in v2) without touching business logic.
"""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product


class ProductRepository:
    def __init__(self, session: AsyncSession):
        self._session = session

    async def list(
        self,
        *,
        category: str | None = None,
        featured: bool | None = None,
    ) -> list[Product]:
        stmt = select(Product).order_by(Product.created_at.asc())
        if category is not None:
            stmt = stmt.where(Product.category == category)
        if featured is not None:
            stmt = stmt.where(Product.featured.is_(featured))
        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_slug(self, slug: str) -> Product | None:
        result = await self._session.execute(select(Product).where(Product.slug == slug))
        return result.scalar_one_or_none()

    async def get_by_id(self, product_id: str) -> Product | None:
        return await self._session.get(Product, product_id)

    async def get_by_id_or_slug(self, identifier: str) -> Product | None:
        """Resolve by primary id first (used by the order service), then slug
        (used by the frontend's product pages)."""
        found = await self.get_by_id(identifier)
        if found is not None:
            return found
        return await self.get_by_slug(identifier)

    async def count(self) -> int:
        result = await self._session.execute(select(Product.id))
        return len(result.scalars().all())

    async def add_all(self, products: list[Product]) -> None:
        self._session.add_all(products)
        await self._session.commit()
