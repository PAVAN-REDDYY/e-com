/**
 * Tiny className combiner. Filters falsy values so you can write:
 *   cn('base', isActive && 'active', error && 'border-red-500')
 *
 * Kept dependency-free on purpose (no clsx/tailwind-merge) to stay lean;
 * swap in tailwind-merge later if class conflicts become a problem.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
