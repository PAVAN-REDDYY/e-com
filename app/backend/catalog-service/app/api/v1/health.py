"""Liveness & readiness probes for Kubernetes.

- /health  → liveness: process is up. Cheap, no dependencies.
- /ready   → readiness: can serve traffic, i.e. the database is reachable.

Splitting them lets K8s restart a wedged pod (liveness) separately from holding
traffic until dependencies are warm (readiness).
"""

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
    # A trivial query proves the DB connection/pool is alive.
    await session.execute(text("SELECT 1"))
    return {"status": "ready"}
