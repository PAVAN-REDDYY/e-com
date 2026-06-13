import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

/** Neutral placeholder for empty lists (no products in a category, empty cart, …). */
export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-20 text-center">
      {icon && <div className="text-3xl">{icon}</div>}
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      {description && <p className="text-sm text-stone-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
