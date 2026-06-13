import { Button } from './Button';

interface ErrorStateProps {
  /** Human-friendly headline. */
  title?: string;
  /** Actionable detail — pass the caught error's message. */
  message: string;
  onRetry?: () => void;
}

/**
 * Reusable, actionable error display. Always pairs a plain-language message with
 * a retry affordance so users (and you, while debugging) get a clear next step.
 */
export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl">
        ⚠️
      </span>
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p className="text-sm text-stone-500">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
