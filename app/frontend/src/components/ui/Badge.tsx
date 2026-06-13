import { cn } from '@/lib/cn';

interface BadgeProps {
  children: React.ReactNode;
  tone?: 'accent' | 'neutral';
  className?: string;
}

/** Small pill used for product flags like "New" or "Last few". */
export function Badge({ children, tone = 'accent', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide',
        tone === 'accent' ? 'bg-clay/15 text-clay' : 'bg-stone-100 text-stone-600',
        className,
      )}
    >
      {children}
    </span>
  );
}
