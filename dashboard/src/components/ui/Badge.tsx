interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'neutral' | 'accent';
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeProps['variant'], string> = {
  success: 'bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success-border)]',
  warning: 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border border-[var(--color-warning-border)]',
  danger: 'bg-[var(--color-danger-light)] text-[var(--color-danger)] border border-[var(--color-danger-border)]',
  neutral: 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
  accent: 'bg-[var(--color-accent-bg)] text-[var(--color-accent)] border border-[var(--color-accent-border)]',
};

export function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED' }) {
  const config: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    ACTIVE: { variant: 'success', label: 'Active' },
    COMPLETED: { variant: 'accent', label: 'Completed' },
    ABANDONED: { variant: 'danger', label: 'Abandoned' },
  };
  const { variant, label } = config[status] || { variant: 'neutral' as const, label: status };
  return <Badge variant={variant}>{label}</Badge>;
}
