import { FileX } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 min-h-[300px] sm:min-h-[400px]">
      {/* Icon */}
      <div className="mb-4 sm:mb-5 text-[var(--color-text-tertiary)] opacity-60">
        {icon || <FileX size={56} strokeWidth={1.5} />}
      </div>

      {/* Text content */}
      <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] text-center max-w-sm mb-5 sm:mb-6 leading-relaxed">
        {description}
      </p>

      {/* Action button */}
      {action && <div className="w-full sm:w-auto">{action}</div>}
    </div>
  );
}
