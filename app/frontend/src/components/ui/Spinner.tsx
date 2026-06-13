import { cn } from '@/lib/cn';

/** Inline loading spinner. Use within buttons or centred loading states. */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-ink',
        className,
      )}
    />
  );
}

/** Full-section centred loading state. */
export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-stone-500">
      <Spinner />
      <p className="text-sm">{label}</p>
    </div>
  );
}
