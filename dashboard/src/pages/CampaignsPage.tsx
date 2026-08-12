import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign } from '../hooks/useCampaigns';
import { useChannels } from '../hooks/useChannels';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton, TableSkeleton } from '../components/ui/Skeleton';
import type { CampaignResponse, CampaignCreateRequest, CampaignUpdateRequest } from '../types';

type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'accent';

function getStatusColor(status: CampaignStatus): BadgeVariant {
  switch (status) {
    case 'ACTIVE': return 'success';
    case 'COMPLETED': return 'accent';
    case 'PAUSED': return 'warning';
    case 'DRAFT': return 'neutral';
    case 'CANCELLED': return 'danger';
    default: return 'neutral';
  }
}

interface CampaignFormProps {
  campaign?: CampaignResponse;
  onClose: () => void;
  onSubmit: (data: CampaignCreateRequest | CampaignUpdateRequest) => void;
  isLoading: boolean;
}

function CampaignForm({ campaign, onClose, onSubmit, isLoading }: CampaignFormProps) {
  const { data: channels } = useChannels();
  const [name, setName] = useState(campaign?.name || '');
  const [channelId, setChannelId] = useState(campaign?.channelId || 0);
  const [startDate, setStartDate] = useState(campaign?.startDate || '');
  const [endDate, setEndDate] = useState(campaign?.endDate || '');
  const [budget, setBudget] = useState(campaign?.budget?.toString() || '');
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatus>(campaign?.campaignStatus || 'DRAFT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: CampaignCreateRequest | CampaignUpdateRequest = campaign
      ? { name, startDate: startDate || undefined, endDate: endDate || undefined, budget: budget ? Number(budget) : undefined, campaignStatus }
      : { channelId, name, startDate: startDate || undefined, endDate: endDate || undefined, budget: budget ? Number(budget) : undefined, campaignStatus };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!campaign && (
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Channel</label>
          <select
            value={channelId}
            onChange={(e) => setChannelId(Number(e.target.value))}
            required
            className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-colors"
          >
            <option value={0}>Select a channel</option>
            {channels?.map((ch) => (
              <option key={ch.channelId} value={ch.channelId}>{ch.name}</option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] placeholder:text-[var(--color-text-tertiary)] transition-colors"
          placeholder="Summer Campaign"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Budget</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          min="0"
          step="0.01"
          className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] placeholder:text-[var(--color-text-tertiary)] transition-colors"
          placeholder="10000"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Status</label>
        <select
          value={campaignStatus}
          onChange={(e) => setCampaignStatus(e.target.value as CampaignStatus)}
          required
          className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-colors"
        >
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {campaign ? 'Update Campaign' : 'Create Campaign'}
        </Button>
      </div>
    </form>
  );
}

export function CampaignsPage() {
  const { data: campaigns, isLoading } = useCampaigns();
  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();
  const deleteMutation = useDeleteCampaign();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignResponse | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<CampaignResponse | null>(null);

  const handleCreate = async (data: CampaignCreateRequest | CampaignUpdateRequest) => {
    try {
      await createMutation.mutateAsync(data as CampaignCreateRequest);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const handleUpdate = async (data: CampaignCreateRequest | CampaignUpdateRequest) => {
    if (!editingCampaign) return;
    try {
      await updateMutation.mutateAsync({ campaignId: editingCampaign.campaignId, payload: data as CampaignUpdateRequest });
      setEditingCampaign(null);
    } catch (error) {
      console.error('Failed to update campaign:', error);
    }
  };

  const handleDelete = async () => {
    if (!deletingCampaign) return;
    try {
      await deleteMutation.mutateAsync(deletingCampaign.campaignId);
      setDeletingCampaign(null);
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">Campaigns</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage marketing campaigns across channels</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
          <Plus size={16} />
          New Campaign
        </Button>
      </div>

      <Card>
        <CardHeader title="All Campaigns" description={`${campaigns?.length || 0} total campaigns`} />
        {!campaigns || campaigns.length === 0 ? (
          <EmptyState
            title="No campaigns yet"
            description="Create your first campaign to get started."
            action={
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus size={16} />
                Create Campaign
              </Button>
            }
          />
        ) : (
          <>
            {/* Desktop table view */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Channel</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Start Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">End Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Budget</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.campaignId} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-hover)] transition-colors">
                      <td className="px-6 py-3.5 text-[var(--color-text-primary)] font-medium">{campaign.name}</td>
                      <td className="px-6 py-3.5 text-[var(--color-text-secondary)]">{campaign.channelName}</td>
                      <td className="px-6 py-3.5">
                        <Badge variant={getStatusColor(campaign.campaignStatus)}>{campaign.campaignStatus}</Badge>
                      </td>
                      <td className="px-6 py-3.5 text-[var(--color-text-secondary)]">{campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-3.5 text-[var(--color-text-secondary)]">{campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-3.5 text-[var(--color-text-secondary)]">{campaign.budget ? `$${campaign.budget.toLocaleString()}` : '-'}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingCampaign(campaign)}
                            className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                            aria-label="Edit campaign"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeletingCampaign(campaign)}
                            className="p-2 rounded-lg hover:bg-[var(--color-danger-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-colors"
                            aria-label="Delete campaign"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet card view */}
            <div className="lg:hidden p-4 space-y-3">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.campaignId}
                  className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--color-text-primary)] text-sm truncate">{campaign.name}</h3>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{campaign.channelName}</p>
                    </div>
                    <Badge variant={getStatusColor(campaign.campaignStatus)}>{campaign.campaignStatus}</Badge>
                  </div>
                  <div className="space-y-2 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-tertiary)]">Start Date</span>
                      <span className="text-[var(--color-text-secondary)]">{campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-tertiary)]">End Date</span>
                      <span className="text-[var(--color-text-secondary)]">{campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-tertiary)]">Budget</span>
                      <span className="text-[var(--color-text-secondary)] font-medium">{campaign.budget ? `$${campaign.budget.toLocaleString()}` : '-'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-[var(--color-border)]">
                    <button
                      onClick={() => setEditingCampaign(campaign)}
                      className="flex-1 flex items-center justify-center gap-2 h-9 px-3 rounded-lg text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingCampaign(campaign)}
                      className="flex-1 flex items-center justify-center gap-2 h-9 px-3 rounded-lg text-sm font-medium text-[var(--color-danger)] bg-[var(--color-danger-light)] hover:bg-[var(--color-danger-light)]/80 transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      <Modal isOpen={showCreateModal} title="Create Campaign" onClose={() => setShowCreateModal(false)}>
        <CampaignForm onClose={() => setShowCreateModal(false)} onSubmit={handleCreate} isLoading={createMutation.isPending} />
      </Modal>

      <Modal isOpen={!!editingCampaign} title="Edit Campaign" onClose={() => setEditingCampaign(null)}>
        {editingCampaign && (
          <CampaignForm campaign={editingCampaign} onClose={() => setEditingCampaign(null)} onSubmit={handleUpdate} isLoading={updateMutation.isPending} />
        )}
      </Modal>

      <Modal isOpen={!!deletingCampaign} title="Delete Campaign" onClose={() => setDeletingCampaign(null)}>
        {deletingCampaign && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Are you sure you want to delete the campaign <strong>{deletingCampaign.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="danger" onClick={handleDelete} isLoading={deleteMutation.isPending} className="flex-1">
                Delete
              </Button>
              <Button variant="secondary" onClick={() => setDeletingCampaign(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
