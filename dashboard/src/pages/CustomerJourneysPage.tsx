import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, User } from 'lucide-react';
import { useCustomerJourneys } from '../hooks/useJourneys';
import { Card, CardHeader } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';

export function CustomerJourneysPage() {
  const { customerId } = useParams();
  const id = customerId ? Number(customerId) : undefined;
  const { data: journeys, isLoading } = useCustomerJourneys(id);
  const navigate = useNavigate();

  if (isLoading) {
    return <TableSkeleton rows={6} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
        <Link to="/journeys" className="hover:text-[var(--color-accent)]">Journeys</Link>
        <ChevronRight size={14} />
        <span className="text-[var(--color-text-primary)] font-medium">Customer #{customerId}</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center">
          <User size={18} className="text-[var(--color-accent)]" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Customer #{customerId}</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">{journeys?.length || 0} journeys</p>
        </div>
      </div>

      <Card>
        <CardHeader title="All Journeys" description={`Journeys for customer #${customerId}`} />
        {!journeys || journeys.length === 0 ? (
          <EmptyState title="No journeys" description="No journeys found for this customer." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Journey ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Stage</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Started</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Ended</th>
                </tr>
              </thead>
              <tbody>
                {journeys.map((j) => (
                  <tr
                    key={j.journeyId}
                    onClick={() => navigate(`/journeys/${j.journeyId}`)}
                    className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-3 text-[var(--color-text-primary)] font-mono text-xs">#{j.journeyId}</td>
                    <td className="px-6 py-3 text-[var(--color-text-primary)] font-medium">{j.customerEmail}</td>
                    <td className="px-6 py-3 text-[var(--color-text-secondary)]">{j.currentStageName}</td>
                    <td className="px-6 py-3"><StatusBadge status={j.status} /></td>
                    <td className="px-6 py-3 text-[var(--color-text-secondary)]">{new Date(j.startedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-[var(--color-text-secondary)]">{j.endedAt ? new Date(j.endedAt).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
