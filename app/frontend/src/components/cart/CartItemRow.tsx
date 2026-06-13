import { Link } from 'react-router-dom';
import type { CartItem } from '@/types/cart';
import { formatMoney } from '@/lib/format';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { useCart } from '@/hooks/useCart';

interface CartItemRowProps {
  item: CartItem;
  /** Compact variant for the drawer; roomier for the cart page. */
  compact?: boolean;
}

export function CartItemRow({ item, compact = false }: CartItemRowProps) {
  const { setQuantity, removeItem } = useCart();
  const { product, size, quantity } = item;
  const image = product.images[0];

  return (
    <div className="flex gap-4 py-4">
      <Link to={`/product/${product.slug}`} className="shrink-0">
        <img
          src={image?.url}
          alt={image?.alt ?? product.name}
          loading="lazy"
          className={`${compact ? 'h-20 w-16' : 'h-28 w-24'} rounded-xl object-cover`}
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/product/${product.slug}`} className="font-medium text-ink hover:text-clay">
              {product.name}
            </Link>
            <p className="text-sm text-stone-500">Size {size}</p>
          </div>
          <p className="font-medium text-ink tabular-nums">
            {formatMoney(product.priceCents * quantity, product.currency)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <QuantityStepper value={quantity} onChange={(q) => setQuantity(item.key, q)} />
          <button
            type="button"
            onClick={() => removeItem(item.key)}
            className="text-sm text-stone-400 underline-offset-2 hover:text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
