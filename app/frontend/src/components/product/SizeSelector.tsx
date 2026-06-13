import { cn } from '@/lib/cn';
import type { ProductSize } from '@/types/product';

interface SizeSelectorProps {
  sizes: ProductSize[];
  selected: string | null;
  onSelect: (size: string) => void;
}

/** Size picker that disables out-of-stock options. */
export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const isSelected = selected === size.label;
        return (
          <button
            key={size.label}
            type="button"
            disabled={!size.inStock}
            onClick={() => onSelect(size.label)}
            aria-pressed={isSelected}
            className={cn(
              'flex h-11 min-w-11 items-center justify-center rounded-xl border px-3 text-sm font-medium transition',
              !size.inStock && 'cursor-not-allowed border-stone-200 text-stone-300 line-through',
              size.inStock && isSelected && 'border-ink bg-ink text-bone',
              size.inStock && !isSelected && 'border-stone-300 text-ink hover:border-ink',
            )}
          >
            {size.label}
          </button>
        );
      })}
    </div>
  );
}
