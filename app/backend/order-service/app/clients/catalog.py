"""HTTP client for the catalog-service (service-to-service call).

This is the inter-service boundary that makes these two genuinely independent
microservices: order-service never touches the catalogue database — it asks the
catalog API for authoritative product data over HTTP.

Failure handling is explicit and mapped to clear errors:
  - product missing      → InvalidOrderError (422): the client ordered something gone.
  - catalog down/timeout → UpstreamServiceError (502): our dependency is unavailable.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass

import httpx

from app.core.config import get_settings
from app.core.errors import InvalidOrderError, UpstreamServiceError

logger = logging.getLogger("order.catalog_client")


@dataclass(frozen=True)
class CatalogProduct:
    """The slice of a product the order service needs for pricing."""

    id: str
    name: str
    price_cents: int
    currency: str


class CatalogClient:
    def __init__(self, base_url: str | None = None, timeout: float | None = None):
        settings = get_settings()
        self._base_url = (base_url or settings.catalog_service_url).rstrip("/")
        self._timeout = timeout or settings.catalog_timeout_seconds

    async def get_product(self, identifier: str) -> CatalogProduct:
        url = f"{self._base_url}/products/{identifier}"
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                response = await client.get(url)
        except httpx.RequestError as exc:
            # Network-level failure: DNS, connection refused, timeout.
            logger.error("Catalog request failed: %s", exc, extra={"context": {"url": url}})
            raise UpstreamServiceError(
                "The catalogue service is currently unreachable. Please try again shortly."
            ) from exc

        if response.status_code == 404:
            raise InvalidOrderError(
                f"Product '{identifier}' is no longer available.",
                code="product_unavailable",
            )
        if response.status_code >= 500:
            raise UpstreamServiceError(
                "The catalogue service returned an error. Please try again shortly."
            )
        if response.status_code != 200:
            raise UpstreamServiceError(
                f"Unexpected catalogue response ({response.status_code})."
            )

        data = response.json()
        return CatalogProduct(
            id=data["id"],
            name=data["name"],
            price_cents=data["priceCents"],
            currency=data["currency"],
        )


def get_catalog_client() -> CatalogClient:
    """FastAPI dependency factory — easy to override in tests."""
    return CatalogClient()
