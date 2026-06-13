import { cn } from '@/lib/cn';
import type { DeliveryMode } from '@/types/order';

interface DeliveryModeToggleProps {
  value: DeliveryMode;
  onChange: (mode: DeliveryMode) => void;
}

const OPTIONS: Array<{ mode: DeliveryMode; title: string; description: string; icon: string }> = [
  {
    mode: 'self',
    title: 'Deliver to me',
    description: 'Ship this order to your own address.',
    icon: '📦',
  },
  {
    mode: 'gift',
    title: 'Send as a gift',
    description: "Ship to someone else with a note — prices hidden.",
    icon: '🎁',
  },
];

/** Segmented card selector that switches the checkout between self and gift flows. */
export function DeliveryModeToggle({ value, onChange }: DeliveryModeToggleProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Delivery mode">
      {OPTIONS.map((opt) => {
        const isActive = value === opt.mode;
        return (
          <button
            key={opt.mode}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(opt.mode)}
            className={cn(
              'flex items-start gap-3 rounded-2xl border p-4 text-left transition',
              isActive ? 'border-ink bg-white shadow-sm' : 'border-stone-300 hover:border-stone-400',
            )}
          >
            <span className="text-2xl">{opt.icon}</span>
            <span>
              <span className="block font-medium text-ink">{opt.title}</span>
              <span className="mt-0.5 block text-sm text-stone-500">{opt.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
