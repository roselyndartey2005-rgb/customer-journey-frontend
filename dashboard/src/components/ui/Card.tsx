import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-xl border bg-[var(--color-surface)] border-[var(--color-border)] shadow-[var(--shadow-xs)] transition-shadow ${className}`}
      style={{ boxShadow: 'var(--shadow-xs)' }}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function CardHeader({ title, description, action }: CardHeaderProps) {
  return (
    <div className="flex items-start sm:items-center justify-between px-5 sm:px-6 py-4 border-b border-[var(--color-border)]">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)] truncate">{title}</h3>
        {description && (
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  );
}

export function CardContent({ children, className = '' }: CardProps) {
  return <div className={`p-5 sm:p-6 ${className}`}>{children}</div>;
}
