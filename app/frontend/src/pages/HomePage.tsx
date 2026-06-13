import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '@/api/products';
import { useAsync } from '@/hooks/useAsync';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';

export function HomePage() {
  const { data: featured, isLoading, error, reload } = useAsync(() => getFeaturedProducts(), []);

  return (
    <div>
      {/* Hero */}
      <section className="container-content grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-clay">
            New season · Considered apparel
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
            Made to last. <br />
            Made to keep.
          </h1>
          <p className="mt-5 text-lg text-stone-500">
            Tees, shirts, hoodies and jackets — quietly designed, honestly built, and ready to be
            worn for years or gifted to someone who'll do the same.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop">
              <Button size="lg">Shop the collection</Button>
            </Link>
            <Link to="/shop?category=jackets">
              <Button size="lg" variant="secondary">
                New in jackets
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-stone-100">
          <img
            src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&q=80"
            alt="Fallseed apparel laid flat"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Category strip */}
      <section className="container-content grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CATEGORY_ORDER.map((cat) => (
          <Link
            key={cat}
            to={`/shop?category=${cat}`}
            className="surface flex items-center justify-between px-5 py-6 transition hover:border-ink"
          >
            <span className="font-medium text-ink">{CATEGORY_LABELS[cat]}</span>
            <span className="text-clay">→</span>
          </Link>
        ))}
      </section>

      {/* Featured */}
      <section className="container-content py-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-ink sm:text-3xl">Featured pieces</h2>
          <Link to="/shop" className="text-sm text-stone-500 hover:text-clay">
            View all →
          </Link>
        </div>

        {isLoading && <LoadingState label="Loading featured pieces…" />}
        {error && <ErrorState message={error.message} onRetry={reload} />}
        {featured && <ProductGrid products={featured} />}
      </section>

      {/* Gift band */}
      <section className="container-content">
        <div className="overflow-hidden rounded-3xl bg-ink px-8 py-14 text-bone sm:px-14">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold sm:text-3xl">Send it as a gift</h2>
            <p className="mt-3 text-stone-300">
              Shipping to someone else? Add their address and a handwritten-style note at checkout —
              we'll leave the prices off the packing slip. Thoughtful, done in two clicks.
            </p>
            <Link to="/shop">
              <Button variant="secondary" size="lg" className="mt-6">
                Find a gift
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
