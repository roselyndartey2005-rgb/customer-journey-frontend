import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Eye, MousePointerClick, FileText, ShoppingCart, Mail,
  Megaphone, MessageSquare, LogOut as BounceIcon, HelpCircle,
  ChevronDown, ChevronRight, Clock, Monitor, Globe, Download
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useJourneyMap, useTouchpointSummary, useConversionFunnel, useRawEvents } from '../hooks/useJourneys';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CardSkeleton, ChartSkeleton, TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import api from '../lib/api';
import type { TouchpointResponse, TouchpointType } from '../types';

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#f97316'];

const touchpointIcons: Record<TouchpointType, React.ElementType> = {
  PAGE_VIEW: Eye,
  CLICK: MousePointerClick,
  FORM_SUBMIT: FileText,
  PURCHASE: ShoppingCart,
  EMAIL_OPEN: Mail,
  AD_IMPRESSION: Megaphone,
  SUPPORT_CHAT: MessageSquare,
  BOUNCE: BounceIcon,
  UNKNOWN: HelpCircle,
};

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

function TouchpointTimeline({ touchpoints }: { touchpoints: TouchpointResponse[] }) {
  const sorted = [...touchpoints].sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());

  return (
    <div className="space-y-0">
      {sorted.map((tp, idx) => {
        const Icon = touchpointIcons[tp.touchpointType] || HelpCircle;
        const isLast = idx === sorted.length - 1;
        return (
          <div key={tp.touchpointId} className={`relative flex gap-4 ${tp.noise ? 'opacity-50' : ''}`}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${tp.noise ? 'bg-[var(--color-bg-tertiary)]' : 'bg-[var(--color-accent-light)]'}`}>
                <Icon size={14} className={tp.noise ? 'text-[var(--color-text-tertiary)]' : 'text-[var(--color-accent)]'} />
              </div>
              {!isLast && <div className="w-px h-full bg-[var(--color-border)] min-h-[24px]" />}
            </div>
            <div className="pb-6 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {tp.touchpointType.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-[var(--color-text-tertiary)]">on {tp.channelName}</span>
                {tp.noise && <Badge variant="neutral">noise</Badge>}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{tp.stageName}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-text-tertiary)]">
                <span className="flex items-center gap-1"><Clock size={10} />{new Date(tp.occurredAt).toLocaleString()}</span>
                <span className="flex items-center gap-1"><Monitor size={10} />{tp.device}</span>
                {tp.durationSeconds > 0 && <span>{formatDuration(tp.durationSeconds)}</span>}
                {tp.country && <span className="flex items-center gap-1"><Globe size={10} />{tp.country}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function JourneyDetailPage() {
  const { journeyId } = useParams();
  const id = journeyId ? Number(journeyId) : undefined;
  const { data: journeyMap, isLoading: mapLoading } = useJourneyMap(id);
  const { data: summary, isLoading: summaryLoading } = useTouchpointSummary(id);
  const { data: funnel, isLoading: funnelLoading } = useConversionFunnel(id);
  const { data: rawEvents, isLoading: eventsLoading } = useRawEvents(id);
  const [showRawEvents, setShowRawEvents] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!id) return;
    setIsExporting(true);
    try {
      const response = await api.get(`/api/export/journeys/${id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `journey-${id}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export journey:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (mapLoading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (!journeyMap) {
    return <EmptyState title="Journey not found" description="This journey may have been deleted or does not exist." />;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
        <Link to="/journeys" className="hover:text-[var(--color-accent)]">Journeys</Link>
        <ChevronRight size={14} />
        <span className="text-[var(--color-text-primary)] font-medium">#{journeyMap.journeyId}</span>
      </div>

      {/* Journey Info Header */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{journeyMap.customerEmail}</h2>
              <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                Customer #{journeyMap.customerId} &middot; Current stage: <span className="font-medium">{journeyMap.currentStageName}</span>
              </p>
              <Link
                to={`/customer/${journeyMap.customerId}`}
                className="text-xs text-[var(--color-accent)] hover:underline mt-1 inline-block"
              >
                View all journeys for this customer
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={handleExport} isLoading={isExporting}>
                <Download size={16} />
                Export CSV
              </Button>
              <StatusBadge status={journeyMap.status} />
              <div className="text-right text-xs text-[var(--color-text-secondary)]">
                <p>Started: {new Date(journeyMap.startedAt).toLocaleDateString()}</p>
                {journeyMap.endedAt && <p>Ended: {new Date(journeyMap.endedAt).toLocaleDateString()}</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Touchpoint Timeline */}
      <Card>
        <CardHeader title="Journey Timeline" description={`${journeyMap.touchpoints.length} touchpoints`} />
        <CardContent>
          {journeyMap.touchpoints.length === 0 ? (
            <EmptyState title="No touchpoints" description="No touchpoints have been recorded for this journey yet." />
          ) : (
            <TouchpointTimeline touchpoints={journeyMap.touchpoints} />
          )}
        </CardContent>
      </Card>

      {/* Conversions */}
      {journeyMap.conversions.length > 0 && (
        <Card>
          <CardHeader title="Conversions" description={`${journeyMap.conversions.length} conversion events`} />
          <CardContent>
            <div className="space-y-3">
              {journeyMap.conversions.map((c) => (
                <div key={c.conversionId} className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]">
                  <div>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{c.conversionType}</span>
                    <p className="text-xs text-[var(--color-text-secondary)]">{new Date(c.occurredAt).toLocaleString()}</p>
                  </div>
                  <span className="text-sm font-semibold text-[var(--color-success)]">${c.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Touchpoint Summary Donut */}
        <Card>
          <CardHeader title="Touchpoint Breakdown" description="Distribution by type" />
          <CardContent>
            {summaryLoading ? (
              <div className="h-48 skeleton rounded-lg" />
            ) : summary && summary.breakdown.length > 0 ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={summary.breakdown}
                      dataKey="count"
                      nameKey="touchpointType"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {summary.breakdown.map((_, idx) => (
                        <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-2 text-xs text-[var(--color-text-secondary)]">
                  <span>Meaningful: {summary.meaningfulTouchpoints}</span>
                  <span>Noise: {summary.noiseTouchpoints}</span>
                </div>
              </div>
            ) : (
              <EmptyState title="No data" description="Touchpoint summary is not available." />
            )}
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader title="Conversion Funnel" description={funnel ? `${funnel.conversionRate.toFixed(1)}% overall conversion` : 'Stage progression'} />
          <CardContent>
            {funnelLoading ? (
              <div className="h-48 skeleton rounded-lg" />
            ) : funnel && funnel.steps.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={[...funnel.steps].sort((a, b) => a.sortOrder - b.sortOrder)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="stageName" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(value) => [`${value} touchpoints`, 'Count']}
                  />
                  <Bar dataKey="touchpointCount" fill="var(--color-accent)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No funnel data" description="Conversion funnel data is not available for this journey." />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Raw Events */}
      <Card>
        <div
          className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors"
          onClick={() => setShowRawEvents(!showRawEvents)}
        >
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Raw Events</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">Underlying event data</p>
          </div>
          <ChevronDown size={18} className={`text-[var(--color-text-secondary)] transition-transform ${showRawEvents ? 'rotate-180' : ''}`} />
        </div>
        {showRawEvents && (
          <div className="border-t border-[var(--color-border)]">
            {eventsLoading ? (
              <div className="p-6"><TableSkeleton rows={4} /></div>
            ) : rawEvents && rawEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="text-left px-4 py-2 text-[var(--color-text-secondary)] font-medium">Event ID</th>
                      <th className="text-left px-4 py-2 text-[var(--color-text-secondary)] font-medium">Type</th>
                      <th className="text-left px-4 py-2 text-[var(--color-text-secondary)] font-medium">Device</th>
                      <th className="text-left px-4 py-2 text-[var(--color-text-secondary)] font-medium">Browser</th>
                      <th className="text-left px-4 py-2 text-[var(--color-text-secondary)] font-medium">Country</th>
                      <th className="text-left px-4 py-2 text-[var(--color-text-secondary)] font-medium">Source</th>
                      <th className="text-left px-4 py-2 text-[var(--color-text-secondary)] font-medium">Occurred</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawEvents.map((ev) => (
                      <tr key={ev.eventId} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-hover)]">
                        <td className="px-4 py-2 text-[var(--color-text-primary)] font-mono">{ev.eventId}</td>
                        <td className="px-4 py-2 text-[var(--color-text-primary)]">{ev.eventType}</td>
                        <td className="px-4 py-2 text-[var(--color-text-secondary)]">{ev.device}</td>
                        <td className="px-4 py-2 text-[var(--color-text-secondary)]">{ev.browser}</td>
                        <td className="px-4 py-2 text-[var(--color-text-secondary)]">{ev.country}</td>
                        <td className="px-4 py-2 text-[var(--color-text-secondary)]">{ev.sourceSystem}</td>
                        <td className="px-4 py-2 text-[var(--color-text-secondary)]">{new Date(ev.occurredAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6">
                <EmptyState title="No raw events" description="No raw event data is available for this journey." />
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
