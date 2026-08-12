import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useChannels, useCreateChannel, useUpdateChannel, useDeleteChannel } from '../hooks/useChannels';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton, TableSkeleton } from '../components/ui/Skeleton';
import type { ChannelResponse, ChannelCreateRequest, ChannelUpdateRequest } from '../types';

type ChannelCategory = 'PAID' | 'OWNED' | 'EARNED' | 'DIRECT';

interface ChannelFormProps {
  channel?: ChannelResponse;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

function ChannelForm({ channel, onClose, onSubmit, isLoading }: ChannelFormProps) {
  const [name, setName] = useState(channel?.name || '');
  const [category, setCategory] = useState<ChannelCategory>(channel?.category || 'OWNED');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, category });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          placeholder="Email Marketing"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ChannelCategory)}
          required
          className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        >
          <option value="OWNED">Owned</option>
          <option value="PAID">Paid</option>
          <option value="EARNED">Earned</option>
          <option value="DIRECT">Direct</option>
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {channel ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function ChannelsPage() {
  const { data: channels, isLoading } = useChannels();
  const createMutation = useCreateChannel();
  const updateMutation = useUpdateChannel();
  const deleteMutation = useDeleteChannel();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingChannel, setEditingChannel] = useState<ChannelResponse | null>(null);
  const [deletingChannel, setDeletingChannel] = useState<ChannelResponse | null>(null);

  const handleCreate = async (data: ChannelCreateRequest) => {
    try {
      await createMutation.mutateAsync(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create channel:', error);
    }
  };

  const handleUpdate = async (data: ChannelUpdateRequest) => {
    if (!editingChannel) return;
    try {
      await updateMutation.mutateAsync({ channelId: editingChannel.channelId, payload: data });
      setEditingChannel(null);
    } catch (error) {
      console.error('Failed to update channel:', error);
    }
  };

  const handleDelete = async () => {
    if (!deletingChannel) return;
    try {
      await deleteMutation.mutateAsync(deletingChannel.channelId);
      setDeletingChannel(null);
    } catch (error) {
      console.error('Failed to delete channel:', error);
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

  const groupedChannels = channels?.reduce((acc, channel) => {
    if (!acc[channel.category]) acc[channel.category] = [];
    acc[channel.category].push(channel);
    return acc;
  }, {} as Record<string, ChannelResponse[]>) || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Channels</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage marketing and communication channels</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus size={16} />
          New Channel
        </Button>
      </div>

      {!channels || channels.length === 0 ? (
        <Card>
          <EmptyState title="No channels yet" description="Create your first channel to get started." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(['PAID', 'OWNED', 'EARNED', 'DIRECT'] as ChannelCategory[]).map((category) => {
            const categoryChannels = groupedChannels[category] || [];
            if (categoryChannels.length === 0) return null;
            return (
              <Card key={category}>
                <CardHeader
                  title={`${category} (${categoryChannels.length})`}
                  description={`${category.toLowerCase()} channels`}
                />
                <CardContent>
                  <div className="space-y-2">
                    {categoryChannels.map((channel) => (
                      <div
                        key={channel.channelId}
                        className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-hover)] transition-colors"
                      >
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">{channel.name}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingChannel(channel)}
                            className="p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                            title="Edit channel"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeletingChannel(channel)}
                            className="p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-colors"
                            title="Delete channel"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showCreateModal} title="Create Channel" onClose={() => setShowCreateModal(false)}>
        <ChannelForm onClose={() => setShowCreateModal(false)} onSubmit={handleCreate} isLoading={createMutation.isPending} />
      </Modal>

      <Modal isOpen={!!editingChannel} title="Edit Channel" onClose={() => setEditingChannel(null)}>
        {editingChannel && (
          <ChannelForm
            channel={editingChannel}
            onClose={() => setEditingChannel(null)}
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      <Modal isOpen={!!deletingChannel} title="Delete Channel" onClose={() => setDeletingChannel(null)}>
        {deletingChannel && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Are you sure you want to delete the channel <strong>{deletingChannel.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="danger" onClick={handleDelete} isLoading={deleteMutation.isPending} className="flex-1">
                Delete
              </Button>
              <Button variant="secondary" onClick={() => setDeletingChannel(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
