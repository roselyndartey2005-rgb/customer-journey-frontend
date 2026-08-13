import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className = '', hover = false, glow = false }: CardProps) {
  return (
    <div
      className={`
        rounded-xl border bg-[var(--color-surface-elevated)] border-[var(--color-border-subtle)]
        transition-all duration-200
        ${hover ? 'hover:shadow-md hover:border-[var(--color-border)] hover:-translate-y-0.5' : 'shadow-sm'}
        ${glow ? 'hover-glow' : ''}
        ${className}
      `}
      style={{ boxShadow: hover ? undefined : 'var(--shadow-sm)' }}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function CardHeader({ title, description, action, icon, className = '' }: CardHeaderProps) {
  return (
    <div className={`flex items-start sm:items-center justify-between px-6 py-5 border-b border-[var(--color-border-subtle)] ${className}`}>
      <div className="flex-1 min-w-0 flex items-center gap-3">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-accent)]/10 to-[var(--color-accent)]/5 flex items-center justify-center text-[var(--color-accent)]">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] truncate">{title}</h3>
          {description && (
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  );
}

export function CardContent({ children, className = '' }: CardProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

// Stat Card variant
interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function StatCard({ label, value, change, changeType, icon, color = 'primary', className = '' }: StatCardProps) {
  const colorClasses = {
    primary: 'from-indigo-500/10 to-indigo-500/5 text-indigo-600 dark:text-indigo-400',
    success: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600 dark:text-emerald-400',
    warning: 'from-amber-500/10 to-amber-500/5 text-amber-600 dark:text-amber-400',
    danger: 'from-red-500/10 to-red-500/5 text-red-600 dark:text-red-400',
    info: 'from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400',
  };

  const changeColorClasses = {
    increase: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
    decrease: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30',
    neutral: 'text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/30',
  };

  return (
    <Card hover className={`relative overflow-hidden ${className}`}>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">{label}</p>
            <p className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">{value}</p>
            {change && changeType && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${changeColorClasses[changeType]}`}>
                {changeType === 'increase' && '↑'}
                {changeType === 'decrease' && '↓'}
                {changeType === 'neutral' && '→'}
                <span className="ml-1">{change}</span>
              </span>
            )}
          </div>
          {icon && (
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-sm`}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
