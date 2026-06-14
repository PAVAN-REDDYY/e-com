"""Env-driven configuration for order-service.

Same philosophy as catalog-service: validated on startup, nothing hardcoded,
12-factor for Kubernetes ConfigMaps/Secrets. Adds the upstream catalog URL and
the shipping business rules (kept in sync with the storefront cart).
"""

from __future__ import annotations

from functools import lru_cache
from typing import Annotated

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Identity & environment
    env: str = Field(default="local", alias="ENV")
    service_name: str = Field(default="order-service", alias="SERVICE_NAME")
    api_prefix: str = Field(default="/api", alias="API_PREFIX")

    # Database (orders have their own DB — no shared schema with the catalogue)
    database_url: str = Field(
        default="sqlite+aiosqlite:///./orders.db",
        alias="DATABASE_URL",
    )

    # Upstream: catalog-service
    catalog_service_url: str = Field(
        default="http://localhost:8001/api", alias="CATALOG_SERVICE_URL"
    )
    catalog_timeout_seconds: float = Field(default=5.0, alias="CATALOG_TIMEOUT_SECONDS")

    # CORS
    cors_origins: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: ["http://localhost:5173"],
        alias="CORS_ORIGINS",
    )

    # Server
    port: int = Field(default=8002, alias="PORT")
    log_level: str = Field(default="info", alias="LOG_LEVEL")

    # Business rules (mirror frontend src/context/cart-utils.ts)
    free_shipping_threshold_cents: int = Field(
        default=15000, alias="FREE_SHIPPING_THRESHOLD_CENTS"
    )
    flat_shipping_cents: int = Field(default=700, alias="FLAT_SHIPPING_CENTS")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_cors(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def is_local(self) -> bool:
        return self.env.lower() == "local"

    @property
    def is_sqlite(self) -> bool:
        return self.database_url.startswith("sqlite")


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]
