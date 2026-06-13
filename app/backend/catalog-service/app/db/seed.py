"""Idempotent seeding routine.

Run as a script (``python -m app.db.seed``) or invoked on startup in local dev.
Safe to run repeatedly: it no-ops if products already exist.
"""

from __future__ import annotations

import asyncio
import logging

from app.db.seed_data import SEED_PRODUCTS
from app.db.session import SessionFactory
from app.models.product import Product
from app.repositories.product import ProductRepository

logger = logging.getLogger("catalog.seed")


async def seed() -> int:
    """Insert seed products if the table is empty. Returns the count inserted."""
    async with SessionFactory() as session:
        repo = ProductRepository(session)
        if await repo.count() > 0:
            logger.info("Catalogue already seeded; skipping.")
            return 0
        products = [Product(**row) for row in SEED_PRODUCTS]
        await repo.add_all(products)
        logger.info("Seeded %d products.", len(products))
        return len(products)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    inserted = asyncio.run(seed())
    print(f"Seed complete. Inserted {inserted} products.")
