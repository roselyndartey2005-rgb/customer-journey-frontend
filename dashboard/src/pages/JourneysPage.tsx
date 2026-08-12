import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { useJourneys } from '../hooks/useJourneys';
import { Card, CardHeader } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';

const ITEMS_PER_PAGE = 12;

export function JourneysPage() {
  const { data: journeys, isLoading } = useJourneys();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);

  const stages = useMemo(() => {
    if (!journeys) return [];
    const unique = [...new Set(journeys.map((j) => j.currentStageName))];
    return unique.sort();
  }, [journeys]);

  const filtered = useMemo(() => {
    if (!journeys) return [];
    return journeys.filter((j) => {
      const matchSearch = !search || j.customerEmail.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || j.status === statusFilter;
      const matchStage = stageFilter === 'ALL' || j.currentStageName === stageFilter;
      return matchSearch && matchStatus && matchStage;
    });
  }, [journeys, search, statusFilter, stageFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (isLoading) {
    return <TableSkeleton rows={10} />;
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Filters - responsive layout */}
      <div className="flex flex-col gap-3">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by customer email..."
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] placeholder:text-[var(--color-text-tertiary)] transition-colors"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full sm:w-auto h-10 pl-8 pr-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] appearance-none cursor-pointer transition-colors"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ABANDONED">Abandoned</option>
            </select>
          </div>
          <select
            value={stageFilter}
            onChange={(e) => { setStageFilter(e.target.value); setPage(1); }}
            className="flex-1 sm:flex-initial h-10 px-3 pr-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] appearance-none cursor-pointer transition-colors"
          >
            <option value="ALL">All Stages</option>
            {stages.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <Card>
        <CardHeader title={`Journeys (${filtered.length})`} description="All customer journeys" />
        {paginated.length === 0 ? (
          <EmptyState title="No journeys found" description="Try adjusting your filters or search query." />
        ) : (
          <>
            {/* Desktop table view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Customer Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Stage</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Started</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Ended</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((j) => (
                    <tr
                      key={j.journeyId}
                      onClick={() => navigate(`/journeys/${j.journeyId}`)}
                      className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-3.5 text-[var(--color-text-primary)] font-medium">{j.customerEmail}</td>
                      <td className="px-6 py-3.5 text-[var(--color-text-secondary)]">{j.currentStageName}</td>
                      <td className="px-6 py-3.5"><StatusBadge status={j.status} /></td>
                      <td className="px-6 py-3.5 text-[var(--color-text-secondary)]">{new Date(j.startedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-3.5 text-[var(--color-text-secondary)]">{j.endedAt ? new Date(j.endedAt).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="sm:hidden p-4 space-y-3">
              {paginated.map((j) => (
                <div
                  key={j.journeyId}
                  onClick={() => navigate(`/journeys/${j.journeyId}`)}
                  className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] active:scale-[0.98] cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="font-medium text-[var(--color-text-primary)] text-sm truncate flex-1">{j.customerEmail}</p>
                    <StatusBadge status={j.status} />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-tertiary)]">Stage</span>
                      <span className="text-[var(--color-text-secondary)] font-medium">{j.currentStageName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-tertiary)]">Started</span>
                      <span className="text-[var(--color-text-secondary)]">{new Date(j.startedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-tertiary)]">Ended</span>
                      <span className="text-[var(--color-text-secondary)]">{j.endedAt ? new Date(j.endedAt).toLocaleDateString() : '-'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-[var(--color-border)]">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex-1 sm:flex-initial h-9 px-4 text-sm font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex-1 sm:flex-initial h-9 px-4 text-sm font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
