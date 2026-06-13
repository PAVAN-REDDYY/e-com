import type { Product } from '@/types/product';

/**
 * Local catalogue fixtures used while the backend does not exist yet
 * (VITE_USE_MOCK_API=true). Shape matches the future API response exactly, so
 * swapping to the live endpoint is a one-line change in the service layer.
 *
 * Images use Unsplash source URLs as neutral placeholders — replace with your
 * own product photography before launch.
 */

const SIZES_STANDARD = [
  { label: 'XS', inStock: true },
  { label: 'S', inStock: true },
  { label: 'M', inStock: true },
  { label: 'L', inStock: true },
  { label: 'XL', inStock: false },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'tee-terra',
    slug: 'terra-organic-tee',
    name: 'Terra Organic Tee',
    category: 'tshirts',
    tagline: 'Heavyweight organic cotton, garment-dyed.',
    description:
      'A 240gsm organic cotton tee, garment-dyed for a soft, lived-in feel from the first wear. Boxy modern fit with a ribbed crew neck. Pre-shrunk and built to hold its shape.',
    priceCents: 4500,
    currency: 'USD',
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80', alt: 'Terra organic tee, front' },
    ],
    sizes: SIZES_STANDARD,
    badge: 'New',
    featured: true,
  },
  {
    id: 'tee-ash',
    slug: 'ash-everyday-tee',
    name: 'Ash Everyday Tee',
    category: 'tshirts',
    tagline: 'The one you reach for first.',
    description:
      'Mid-weight 180gsm combed cotton with a classic regular fit. Breathable, durable, and endlessly versatile. Designed to layer or stand alone.',
    priceCents: 3500,
    currency: 'USD',
    images: [
      { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80', alt: 'Ash everyday tee' },
    ],
    sizes: SIZES_STANDARD,
    featured: true,
  },
  {
    id: 'shirt-linen',
    slug: 'harvest-linen-shirt',
    name: 'Harvest Linen Shirt',
    category: 'shirts',
    tagline: 'Breathable European linen, relaxed cut.',
    description:
      'Cut from 100% European flax linen with a relaxed silhouette and a soft camp collar. Corozo buttons and a single chest pocket. Gets better with every wash.',
    priceCents: 8900,
    currency: 'USD',
    images: [
      { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=80', alt: 'Harvest linen shirt' },
    ],
    sizes: SIZES_STANDARD,
    featured: true,
  },
  {
    id: 'shirt-oxford',
    slug: 'cellar-oxford-shirt',
    name: 'Cellar Oxford Shirt',
    category: 'shirts',
    tagline: 'A considered take on the everyday oxford.',
    description:
      'Woven from soft brushed oxford cotton with a button-down collar and a tailored-but-easy fit. The shirt that works at the desk and the dinner table.',
    priceCents: 7500,
    currency: 'USD',
    images: [
      { url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900&q=80', alt: 'Cellar oxford shirt' },
    ],
    sizes: SIZES_STANDARD,
  },
  {
    id: 'hoodie-fog',
    slug: 'fog-heavy-hoodie',
    name: 'Fog Heavy Hoodie',
    category: 'hoodies',
    tagline: '480gsm brushed-back fleece.',
    description:
      'A substantial 480gsm loopback fleece hoodie, brushed on the inside for warmth. Double-layer hood, ribbed cuffs, and a kangaroo pocket. The definition of cosy.',
    priceCents: 9800,
    currency: 'USD',
    images: [
      { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=80', alt: 'Fog heavy hoodie' },
    ],
    sizes: SIZES_STANDARD,
    badge: 'Last few',
    featured: true,
  },
  {
    id: 'hoodie-dune',
    slug: 'dune-zip-hoodie',
    name: 'Dune Zip Hoodie',
    category: 'hoodies',
    tagline: 'Full-zip, mid-weight, everyday warmth.',
    description:
      'A 340gsm full-zip hoodie in a clean, minimal cut. YKK zip, split kangaroo pockets, and a soft brushed interior. Layers neatly under a jacket.',
    priceCents: 8800,
    currency: 'USD',
    images: [
      { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900&q=80', alt: 'Dune zip hoodie' },
    ],
    sizes: SIZES_STANDARD,
  },
  {
    id: 'jacket-timber',
    slug: 'timber-chore-jacket',
    name: 'Timber Chore Jacket',
    category: 'jackets',
    tagline: 'Garment-washed cotton canvas.',
    description:
      'A workwear-inspired chore jacket in 10oz garment-washed cotton canvas. Three utility pockets, corozo buttons, and a square, layer-friendly fit. Ages beautifully.',
    priceCents: 14800,
    currency: 'USD',
    images: [
      { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=80', alt: 'Timber chore jacket' },
    ],
    sizes: SIZES_STANDARD,
    badge: 'New',
    featured: true,
  },
  {
    id: 'jacket-ridge',
    slug: 'ridge-quilted-jacket',
    name: 'Ridge Quilted Jacket',
    category: 'jackets',
    tagline: 'Lightweight diamond-quilted warmth.',
    description:
      'A lightly insulated, diamond-quilted jacket with a stand collar and snap front. Wind-resistant shell and a packable, go-anywhere build for the in-between seasons.',
    priceCents: 16800,
    currency: 'USD',
    images: [
      { url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=900&q=80', alt: 'Ridge quilted jacket' },
    ],
    sizes: SIZES_STANDARD,
  },
];
