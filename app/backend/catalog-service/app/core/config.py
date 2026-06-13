"""Centralised, env-driven configuration.

Uses pydantic-settings so every value is validated on startup and the service
fails fast with a clear message if something is missing or malformed — never a
mysterious ``None`` deep in a request handler.

Nothing here is hardcoded: all values come from the environment (or .env locally),
which keeps the service 12-factor and ready for ConfigMaps/Secrets on Kubernetes.
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
    service_name: str = Field(default="catalog-service", alias="SERVICE_NAME")
    api_prefix: str = Field(default="/api", alias="API_PREFIX")

    # Database
    database_url: str = Field(
        default="sqlite+aiosqlite:///./catalog.db",
        alias="DATABASE_URL",
        description="Async SQLAlchemy URL (asyncpg for Postgres, aiosqlite for local).",
    )

    # CORS — comma-separated origins in the env, exposed as a list.
    # NoDecode stops pydantic-settings from JSON-parsing the value so our
    # comma-splitting validator below can handle the plain "a,b,c" form.
    cors_origins: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: ["http://localhost:5173"],
        alias="CORS_ORIGINS",
    )

    # Server
    port: int = Field(default=8001, alias="PORT")
    log_level: str = Field(default="info", alias="LOG_LEVEL")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_cors(cls, value: object) -> object:
        # Allow "a,b,c" from the env to become ["a", "b", "c"].
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
    """Cached accessor so the env is parsed once per process."""
    return Settings()  # type: ignore[call-arg]
