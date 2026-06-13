import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Visually hide the label but keep it for screen readers. */
  hideLabel?: boolean;
}

/**
 * Accessible labelled input with inline error rendering. Errors are wired to the
 * field via aria-describedby so screen readers announce them.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hideLabel, id, className, required, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className={cn(
          'text-sm font-medium text-stone-700',
          hideLabel && 'sr-only',
        )}
      >
        {label}
        {required && <span className="ml-0.5 text-clay">*</span>}
      </label>
      <input
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'h-11 rounded-xl border bg-white px-4 text-sm text-ink placeholder:text-stone-400 transition-colors',
          error ? 'border-red-400 focus:ring-red-400' : 'border-stone-300 focus:border-ink',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});
