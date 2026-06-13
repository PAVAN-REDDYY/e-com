"""Product endpoints — the public catalogue contract.

    GET /api/products?category=&featured=    → list
    GET /api/products/{id_or_slug}           → single product (404 if missing)
"""

from __future__ import annotations

from fastapi import APIRouter, Query

from app.api.deps import CatalogServiceDep
from app.schemas.product import ProductRead

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductRead])
async def list_products(
    service: CatalogServiceDep,
    category: str | None = Query(default=None, description="Filter by category slug."),
    featured: bool | None = Query(default=None, description="Only featured products."),
) -> list[ProductRead]:
    products = await service.list_products(category=category, featured=featured)
    return [ProductRead.model_validate(p) for p in products]


@router.get("/{identifier}", response_model=ProductRead)
async def get_product(identifier: str, service: CatalogServiceDep) -> ProductRead:
    product = await service.get_product(identifier)
    return ProductRead.model_validate(product)
