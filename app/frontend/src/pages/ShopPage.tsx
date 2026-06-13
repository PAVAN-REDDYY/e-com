import { useSearchParams } from 'react-router-dom';
import { listProducts } from '@/api/products';
import { useAsync } from '@/hooks/useAsync';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CategoryFilter } from '@/components/product/CategoryFilter';
import { LoadingState } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { CATEGORY_LABELS, CATEGORY_ORDER, type ProductCategory } from '@/types/product';

function parseCategory(value: string | null): ProductCategory | null {
  return value && (CATEGORY_ORDER as string[]).includes(value)
    ? (value as ProductCategory)
    : null;
}

/**
 * Shop page. Category lives in the URL (?category=) so filters are shareable and
 * back/forward works as expected. Refetches whenever the category changes.
 */
export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = parseCategory(searchParams.get('category'));

  const { data: products, isLoading, error, reload } = useAsync(
    () => listProducts(category ? { category } : {}),
    [category],
  );

  const setCategory = (next: ProductCategory | null) => {
    if (next) setSearchParams({ category: next });
    else setSearchParams({});
  };

  const heading = category ? CATEGORY_LABELS[category] : 'Shop all';

  return (
    <div className="container-content py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">{heading}</h1>
        <p className="mt-2 text-stone-500">
          Everything we make, built to be worn for years.
        </p>
      </header>

      <div className="mb-10">
        <CategoryFilter active={category} onChange={setCategory} />
      </div>

      {isLoading && <LoadingState label="Loading products…" />}
      {error && <ErrorState message={error.message} onRetry={reload} />}
      {products && products.length === 0 && (
        <EmptyState
          title="Nothing here yet"
          description="There are no products in this category right now. Check back soon."
          icon="🧵"
        />
      )}
      {products && products.length > 0 && <ProductGrid products={products} />}
    </div>
  );
}
