import { Link, NavLink } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/types/product';
import { cn } from '@/lib/cn';

/** Sticky top navigation with category links and a live cart count. */
export function Header() {
  const { totals, openCart } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-bone/85 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between gap-6">
        <Link to="/" className="text-xl font-display font-semibold tracking-tight text-ink">
          fallseed<span className="text-clay">.</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              cn('text-sm transition hover:text-clay', isActive ? 'text-ink' : 'text-stone-500')
            }
          >
            Shop all
          </NavLink>
          {CATEGORY_ORDER.map((cat) => (
            <NavLink
              key={cat}
              to={`/shop?category=${cat}`}
              className="text-sm text-stone-500 transition hover:text-clay"
            >
              {CATEGORY_LABELS[cat]}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={openCart}
          className="relative flex items-center gap-2 rounded-full px-3 py-2 text-sm text-ink transition hover:bg-stone-100"
          aria-label={`Open cart, ${totals.itemCount} items`}
        >
          <span>Cart</span>
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-ink px-1.5 text-xs font-medium text-bone tabular-nums">
            {totals.itemCount}
          </span>
        </button>
      </div>
    </header>
  );
}
