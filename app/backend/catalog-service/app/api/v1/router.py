"""Aggregates all v1 routers into one, mounted under the API prefix in main.py."""

from __future__ import annotations

from fastapi import APIRouter

from app.api.v1 import health, products

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(products.router)
