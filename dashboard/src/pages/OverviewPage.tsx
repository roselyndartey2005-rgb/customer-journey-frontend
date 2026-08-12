import { useNavigate } from 'react-router-dom';
import { Activity, Route, Target, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { useJourneys } from '../hooks/useJourneys';
import { useAnalyticsOverview } from '../hooks/useAnalytics';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { CardSkeleton, TableSkeleton, ChartSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import type { JourneyResponse } from '../types';

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#f97316'];

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: React.ElementType; color: string }) {
  return (
    <Card className="hover-lift">
      <CardContent className="!p-5 sm:!p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] truncate">
              {value}
            </p>
          </div>
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
            <Icon size={20} strokeWidth={2.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getJourneysOverTime(journeys: JourneyResponse[]) {
  const counts: Record<string, number> = {};
  journeys.forEach((j) => {
    const date = j.startedAt?.split('T')[0];
    if (date) {
      counts[date] = (counts[date] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, count]) => ({ date: date.slice(5), count }));
}

export function OverviewPage() {
  const { data: journeys, isLoading: journeysLoading } = useJourneys();
  const { data: analytics, isLoading: analyticsLoading } = useAnalyticsOverview();
  const navigate = useNavigate();

  const isLoading = journeysLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <ChartSkeleton />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  const data = journeys || [];
  const totalJourneys = analytics?.totalJourneys || 0;
  const activeJourneys = analytics?.activeJourneys || 0;
  const completedJourneys = analytics?.completedJourneys || 0;
  const conversionRate = analytics?.overallConversionRate || 0;
  const recentJourneys = [...data].sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()).slice(0, 8);
  const chartData = getJourneysOverTime(data);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Stat cards grid - responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Journeys" value={totalJourneys} icon={Route} color="bg-[var(--color-accent-bg)] text-[var(--color-accent)]" />
        <StatCard title="Active Journeys" value={activeJourneys} icon={Activity} color="bg-[var(--color-success-light)] text-[var(--color-success)]" />
        <StatCard title="Completed" value={completedJourneys} icon={Target} color="bg-[var(--color-warning-light)] text-[var(--color-warning)]" />
        <StatCard title="Conversion Rate" value={`${conversionRate.toFixed(1)}%`} icon={TrendingUp} color="bg-[var(--color-accent-bg)] text-[var(--color-accent)]" />
      </div>

      {/* Channel Breakdown & Stage Drop-offs - responsive grid */}
      {analytics && (analytics.channelBreakdown.length > 0 || analytics.stageDropOffs.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* Channel Breakdown */}
          {analytics.channelBreakdown.length > 0 && (
            <Card>
              <CardHeader title="Channel Breakdown" description="Touchpoints by channel" />
              <CardContent>
                <div className="h-56 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.channelBreakdown}
                        dataKey="touchpointCount"
                        nameKey="channelName"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                      >
                        {analytics.channelBreakdown.map((_, idx) => (
                          <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stage Drop-offs */}
          {analytics.stageDropOffs.length > 0 && (
            <Card>
              <CardHeader title="Stage Drop-off Rates" description="Journey progression by stage" />
              <CardContent>
                <div className="h-56 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[...analytics.stageDropOffs].sort((a, b) => a.sortOrder - b.sortOrder)}
                      margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                      <XAxis
                        dataKey="stageName"
                        tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                        formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Drop-off Rate']}
                      />
                      <Bar dataKey="dropOffRate" fill="var(--color-warning)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Journeys over time chart */}
      {chartData.length > 1 && (
        <Card>
          <CardHeader title="Journeys Over Time" description="New journeys started per day (last 14 days)" />
          <CardContent>
            <div className="h-48 sm:h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    labelStyle={{ color: 'var(--color-text-primary)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-accent)"
                    fill="url(#colorCount)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent journeys table/cards */}
      <Card>
        <CardHeader title="Recent Journeys" description="Latest customer journeys" />
        {recentJourneys.length === 0 ? (
          <EmptyState title="No journeys yet" description="Customer journeys will appear here once data starts flowing in." />
        ) : (
          <>
            {/* Desktop table view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Customer</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Stage</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Started</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJourneys.map((j) => (
                    <tr
                      key={j.journeyId}
                      onClick={() => navigate(`/journeys/${j.journeyId}`)}
                      className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-3.5 text-[var(--color-text-primary)] font-medium">{j.customerEmail}</td>
                      <td className="px-6 py-3.5 text-[var(--color-text-secondary)]">{j.currentStageName}</td>
                      <td className="px-6 py-3.5"><StatusBadge status={j.status} /></td>
                      <td className="px-6 py-3.5 text-[var(--color-text-secondary)]">{new Date(j.startedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="sm:hidden p-4 space-y-3">
              {recentJourneys.map((j) => (
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
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
