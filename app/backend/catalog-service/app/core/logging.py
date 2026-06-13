"""Minimal structured logging setup.

Emits single-line JSON logs so they're greppable and ready for log aggregation
(CloudWatch, Azure Monitor, Loki) on Kubernetes without extra parsing. Kept
dependency-free; swap for structlog in v2 if richer context is needed.
"""

from __future__ import annotations

import json
import logging
import sys
from datetime import datetime, timezone


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "ts": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if record.exc_info:
            payload["exc"] = self.formatException(record.exc_info)
        # Allow callers to attach structured fields via `extra={"context": {...}}`.
        context = getattr(record, "context", None)
        if context:
            payload["context"] = context
        return json.dumps(payload, default=str)


def configure_logging(level: str = "info") -> None:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())

    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(level.upper())

    # Tame uvicorn's access logger duplication; keep errors visible.
    logging.getLogger("uvicorn.access").handlers.clear()
