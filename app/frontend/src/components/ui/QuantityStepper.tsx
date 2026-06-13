import { cn } from '@/lib/cn';

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

/** Accessible +/- quantity control used in the cart. */
export function QuantityStepper({ value, onChange, min = 1, max = 99, className }: QuantityStepperProps) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className={cn('inline-flex items-center rounded-full border border-stone-300', className)}>
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-stone-600 transition hover:text-ink disabled:opacity-30"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-stone-600 transition hover:text-ink disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
