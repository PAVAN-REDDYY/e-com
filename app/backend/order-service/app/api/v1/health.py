"""Liveness & readiness probes (same contract as catalog-service)."""

from __future__ import annotations

from fastapi import APIRouter
from sqlalchemy import text

from app.api.deps import SessionDep
from app.core.config import get_settings

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict:
    settings = get_settings()
    return {"status": "ok", "service": settings.service_name, "env": settings.env}


@router.get("/ready")
async def ready(session: SessionDep) -> dict:
    await session.execute(text("SELECT 1"))
    return {"status": "ready"}
