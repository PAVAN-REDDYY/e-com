import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-stone-700">
        {label}
      </label>
      <textarea
        ref={ref}
        id={fieldId}
        className={cn(
          'min-h-[96px] rounded-xl border bg-white px-4 py-3 text-sm text-ink placeholder:text-stone-400 transition-colors',
          error ? 'border-red-400' : 'border-stone-300 focus:border-ink',
          className,
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-stone-400">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});
