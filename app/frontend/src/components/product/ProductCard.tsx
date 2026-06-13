import { Link } from 'react-router-dom';
import type { Product } from '@/types/product';
import { formatMoney } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';

/** Catalogue tile. Whole card is a link to the product page. */
export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100">
        <img
          src={image?.url}
          alt={image?.alt ?? product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-soft group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3">
            <Badge>{product.badge}</Badge>
          </span>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-ink">{product.name}</h3>
          <p className="text-sm text-stone-500">{product.tagline}</p>
        </div>
        <p className="shrink-0 font-medium text-ink tabular-nums">
          {formatMoney(product.priceCents, product.currency)}
        </p>
      </div>
    </Link>
  );
}
