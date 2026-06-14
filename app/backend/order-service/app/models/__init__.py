"""Register models on Base.metadata for Alembic."""

from app.models.order import Order, OrderItem

__all__ = ["Order", "OrderItem"]
