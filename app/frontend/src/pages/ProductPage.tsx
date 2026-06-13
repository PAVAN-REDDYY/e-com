import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductBySlug } from '@/api/products';
import { useAsync } from '@/hooks/useAsync';
import { useCart } from '@/hooks/useCart';
import { formatMoney } from '@/lib/format';
import { SizeSelector } from '@/components/product/SizeSelector';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { CATEGORY_LABELS } from '@/types/product';

export function ProductPage() {
  const { slug = '' } = useParams();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  const { data: product, isLoading, error, reload } = useAsync(
    () => getProductBySlug(slug),
    [slug],
  );

  if (isLoading) {
    return (
      <div className="container-content">
        <LoadingState label="Loading product…" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-content">
        <ErrorState
          title="Product not found"
          message={error?.message ?? 'This piece may have sold out or moved.'}
          onRetry={reload}
        />
        <div className="text-center">
          <Link to="/shop" className="text-sm text-clay hover:underline">
            ← Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addItem(product, selectedSize, 1);
  };

  const image = product.images[0];

  return (
    <div className="container-content py-10">
      <nav className="mb-6 text-sm text-stone-400">
        <Link to="/shop" className="hover:text-clay">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-clay">
          {CATEGORY_LABELS[product.category]}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-600">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-stone-100">
          <img src={image?.url} alt={image?.alt ?? product.name} className="h-full w-full object-cover" />
          {product.badge && (
            <span className="absolute left-4 top-4">
              <Badge>{product.badge}</Badge>
            </span>
          )}
        </div>

        <div className="lg:py-4">
          <h1 className="text-3xl font-semibold text-ink">{product.name}</h1>
          <p className="mt-2 text-lg text-stone-500">{product.tagline}</p>
          <p className="mt-4 text-2xl font-medium text-ink tabular-nums">
            {formatMoney(product.priceCents, product.currency)}
          </p>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-stone-700">Select size</span>
              <button className="text-sm text-stone-400 hover:text-clay">Size guide</button>
            </div>
            <SizeSelector
              sizes={product.sizes}
              selected={selectedSize}
              onSelect={(s) => {
                setSelectedSize(s);
                setSizeError(false);
              }}
            />
            {sizeError && <p className="mt-2 text-xs text-red-600">Please choose a size first.</p>}
          </div>

          <Button size="lg" fullWidth className="mt-8" onClick={handleAdd}>
            Add to cart
          </Button>

          <div className="mt-10 border-t border-stone-200 pt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">Details</h2>
            <p className="mt-3 leading-relaxed text-stone-600">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
