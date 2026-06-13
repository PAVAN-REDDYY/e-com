"""Catalogue business logic.

Thin today, but the right home for future rules (search ranking, availability,
pricing tiers). Keeping it between the API and the repository means routes stay
declarative and the data layer stays dumb.
"""

from __future__ import annotations

from app.core.errors import NotFoundError
from app.models.product import Product
from app.repositories.product import ProductRepository


class CatalogService:
    def __init__(self, repository: ProductRepository):
        self._repo = repository

    async def list_products(
        self,
        *,
        category: str | None = None,
        featured: bool | None = None,
    ) -> list[Product]:
        return await self._repo.list(category=category, featured=featured)

    async def get_product(self, identifier: str) -> Product:
        product = await self._repo.get_by_id_or_slug(identifier)
        if product is None:
            raise NotFoundError(
                f"Product '{identifier}' was not found.", code="product_not_found"
            )
        return product
