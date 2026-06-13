"""Seed catalogue — the canonical product list.

Mirrors the frontend's former mock fixtures so the live API returns the same
catalogue the UI was built against. Replace image URLs with real product
photography before launch.
"""

from __future__ import annotations

_STANDARD_SIZES = [
    {"label": "XS", "inStock": True},
    {"label": "S", "inStock": True},
    {"label": "M", "inStock": True},
    {"label": "L", "inStock": True},
    {"label": "XL", "inStock": False},
]

SEED_PRODUCTS: list[dict] = [
    {
        "id": "tee-terra",
        "slug": "terra-organic-tee",
        "name": "Terra Organic Tee",
        "category": "tshirts",
        "tagline": "Heavyweight organic cotton, garment-dyed.",
        "description": (
            "A 240gsm organic cotton tee, garment-dyed for a soft, lived-in feel from the "
            "first wear. Boxy modern fit with a ribbed crew neck. Pre-shrunk and built to hold "
            "its shape."
        ),
        "price_cents": 4500,
        "currency": "USD",
        "images": [
            {"url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80", "alt": "Terra organic tee, front"}
        ],
        "sizes": _STANDARD_SIZES,
        "badge": "New",
        "featured": True,
    },
    {
        "id": "tee-ash",
        "slug": "ash-everyday-tee",
        "name": "Ash Everyday Tee",
        "category": "tshirts",
        "tagline": "The one you reach for first.",
        "description": (
            "Mid-weight 180gsm combed cotton with a classic regular fit. Breathable, durable, "
            "and endlessly versatile. Designed to layer or stand alone."
        ),
        "price_cents": 3500,
        "currency": "USD",
        "images": [
            {"url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80", "alt": "Ash everyday tee"}
        ],
        "sizes": _STANDARD_SIZES,
        "badge": None,
        "featured": True,
    },
    {
        "id": "shirt-linen",
        "slug": "harvest-linen-shirt",
        "name": "Harvest Linen Shirt",
        "category": "shirts",
        "tagline": "Breathable European linen, relaxed cut.",
        "description": (
            "Cut from 100% European flax linen with a relaxed silhouette and a soft camp "
            "collar. Corozo buttons and a single chest pocket. Gets better with every wash."
        ),
        "price_cents": 8900,
        "currency": "USD",
        "images": [
            {"url": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=80", "alt": "Harvest linen shirt"}
        ],
        "sizes": _STANDARD_SIZES,
        "badge": None,
        "featured": True,
    },
    {
        "id": "shirt-oxford",
        "slug": "cellar-oxford-shirt",
        "name": "Cellar Oxford Shirt",
        "category": "shirts",
        "tagline": "A considered take on the everyday oxford.",
        "description": (
            "Woven from soft brushed oxford cotton with a button-down collar and a "
            "tailored-but-easy fit. The shirt that works at the desk and the dinner table."
        ),
        "price_cents": 7500,
        "currency": "USD",
        "images": [
            {"url": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900&q=80", "alt": "Cellar oxford shirt"}
        ],
        "sizes": _STANDARD_SIZES,
        "badge": None,
        "featured": False,
    },
    {
        "id": "hoodie-fog",
        "slug": "fog-heavy-hoodie",
        "name": "Fog Heavy Hoodie",
        "category": "hoodies",
        "tagline": "480gsm brushed-back fleece.",
        "description": (
            "A substantial 480gsm loopback fleece hoodie, brushed on the inside for warmth. "
            "Double-layer hood, ribbed cuffs, and a kangaroo pocket. The definition of cosy."
        ),
        "price_cents": 9800,
        "currency": "USD",
        "images": [
            {"url": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=80", "alt": "Fog heavy hoodie"}
        ],
        "sizes": _STANDARD_SIZES,
        "badge": "Last few",
        "featured": True,
    },
    {
        "id": "hoodie-dune",
        "slug": "dune-zip-hoodie",
        "name": "Dune Zip Hoodie",
        "category": "hoodies",
        "tagline": "Full-zip, mid-weight, everyday warmth.",
        "description": (
            "A 340gsm full-zip hoodie in a clean, minimal cut. YKK zip, split kangaroo "
            "pockets, and a soft brushed interior. Layers neatly under a jacket."
        ),
        "price_cents": 8800,
        "currency": "USD",
        "images": [
            {"url": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900&q=80", "alt": "Dune zip hoodie"}
        ],
        "sizes": _STANDARD_SIZES,
        "badge": None,
        "featured": False,
    },
    {
        "id": "jacket-timber",
        "slug": "timber-chore-jacket",
        "name": "Timber Chore Jacket",
        "category": "jackets",
        "tagline": "Garment-washed cotton canvas.",
        "description": (
            "A workwear-inspired chore jacket in 10oz garment-washed cotton canvas. Three "
            "utility pockets, corozo buttons, and a square, layer-friendly fit. Ages beautifully."
        ),
        "price_cents": 14800,
        "currency": "USD",
        "images": [
            {"url": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=80", "alt": "Timber chore jacket"}
        ],
        "sizes": _STANDARD_SIZES,
        "badge": "New",
        "featured": True,
    },
    {
        "id": "jacket-ridge",
        "slug": "ridge-quilted-jacket",
        "name": "Ridge Quilted Jacket",
        "category": "jackets",
        "tagline": "Lightweight diamond-quilted warmth.",
        "description": (
            "A lightly insulated, diamond-quilted jacket with a stand collar and snap front. "
            "Wind-resistant shell and a packable, go-anywhere build for the in-between seasons."
        ),
        "price_cents": 16800,
        "currency": "USD",
        "images": [
            {"url": "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=900&q=80", "alt": "Ridge quilted jacket"}
        ],
        "sizes": _STANDARD_SIZES,
        "badge": None,
        "featured": False,
    },
]
