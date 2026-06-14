"""Shipping/total calculation — pure functions, no IO.

Kept separate and side-effect-free so the money math is trivially unit-testable
and stays identical to the storefront cart (src/context/cart-utils.ts).
"""

from __future__ import annotations

from app.core.config import get_settings


def compute_shipping_cents(subtotal_cents: int) -> int:
    settings = get_settings()
    if subtotal_cents <= 0 or subtotal_cents >= settings.free_shipping_threshold_cents:
        return 0
    return settings.flat_shipping_cents


def compute_total_cents(subtotal_cents: int, shipping_cents: int) -> int:
    return subtotal_cents + shipping_cents
