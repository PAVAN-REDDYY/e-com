"""Domain exceptions + handlers for order-service.

Consistent error envelope ``{"detail", "code"}`` — same contract as
catalog-service so the frontend handles errors from either service identically.
Adds order-specific errors: invalid order input and upstream (catalog) failures.
"""

from __future__ import annotations

import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("order.errors")


class AppError(Exception):
    status_code: int = 500
    code: str = "internal_error"

    def __init__(self, detail: str, *, code: str | None = None, status_code: int | None = None):
        super().__init__(detail)
        self.detail = detail
        if code is not None:
            self.code = code
        if status_code is not None:
            self.status_code = status_code


class NotFoundError(AppError):
    status_code = 404
    code = "not_found"


class InvalidOrderError(AppError):
    """Client sent an order we can't fulfil (empty cart, unknown product…)."""

    status_code = 422
    code = "invalid_order"


class UpstreamServiceError(AppError):
    """A dependency (catalog-service) was unreachable or errored."""

    status_code = 502
    code = "upstream_unavailable"


def _json(status_code: int, detail: str, code: str) -> JSONResponse:
    return JSONResponse(status_code=status_code, content={"detail": detail, "code": code})


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def _handle_app_error(_: Request, exc: AppError) -> JSONResponse:
        return _json(exc.status_code, exc.detail, exc.code)

    @app.exception_handler(RequestValidationError)
    async def _handle_validation(_: Request, exc: RequestValidationError) -> JSONResponse:
        first = exc.errors()[0] if exc.errors() else {}
        loc = ".".join(str(p) for p in first.get("loc", []) if p != "body")
        msg = first.get("msg", "Invalid request.")
        detail = f"{loc}: {msg}" if loc else msg
        return _json(422, detail, "validation_error")

    @app.exception_handler(StarletteHTTPException)
    async def _handle_http(_: Request, exc: StarletteHTTPException) -> JSONResponse:
        return _json(exc.status_code, str(exc.detail), "http_error")

    @app.exception_handler(Exception)
    async def _handle_unexpected(_: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled error: %s", exc)
        return _json(500, "An unexpected error occurred. Please try again.", "internal_error")
