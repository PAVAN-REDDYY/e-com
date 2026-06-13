import { cn } from '@/lib/cn';
import { CATEGORY_LABELS, CATEGORY_ORDER, type ProductCategory } from '@/types/product';

interface CategoryFilterProps {
  /** `null` means "All". */
  active: ProductCategory | null;
  onChange: (category: ProductCategory | null) => void;
}

/** Pill row used on the shop page to filter by category. */
export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const pill = (isActive: boolean) =>
    cn(
      'rounded-full border px-4 py-2 text-sm transition',
      isActive
        ? 'border-ink bg-ink text-bone'
        : 'border-stone-300 text-stone-600 hover:border-ink hover:text-ink',
    );

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={() => onChange(null)} className={pill(active === null)}>
        All
      </button>
      {CATEGORY_ORDER.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={pill(active === cat)}
        >
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  );
}
