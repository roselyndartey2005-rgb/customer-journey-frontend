import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useJourneyStages, useCreateStage, useUpdateStage, useDeleteStage } from '../hooks/useJourneys';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import type { JourneyStageResponse, JourneyStageCreateRequest, JourneyStageUpdateRequest } from '../types';

const STAGE_COLORS = [
  '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#14b8a6', '#f97316', '#64748b'
];

interface StageFormProps {
  stage?: JourneyStageResponse;
  onClose: () => void;
  onSubmit: (data: JourneyStageCreateRequest) => void;
  isLoading: boolean;
}

function StageForm({ stage, onClose, onSubmit, isLoading }: StageFormProps) {
  const [name, setName] = useState(stage?.name || '');
  const [sortOrder, setSortOrder] = useState(stage?.sortOrder?.toString() || '1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, sortOrder: parseInt(sortOrder, 10) });
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
          placeholder="e.g., Awareness"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Sort Order</label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          required
          min="1"
          className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          placeholder="1"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {stage ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function StagesPage() {
  const { data: stages, isLoading } = useJourneyStages();
  const createMutation = useCreateStage();
  const updateMutation = useUpdateStage();
  const deleteMutation = useDeleteStage();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingStage, setEditingStage] = useState<JourneyStageResponse | null>(null);
  const [deletingStage, setDeletingStage] = useState<JourneyStageResponse | null>(null);

  const handleCreate = async (data: JourneyStageCreateRequest) => {
    try {
      await createMutation.mutateAsync(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create stage:', error);
    }
  };

  const handleUpdate = async (data: JourneyStageUpdateRequest) => {
    if (!editingStage) return;
    try {
      await updateMutation.mutateAsync({ stageId: editingStage.stageId, payload: data });
      setEditingStage(null);
    } catch (error) {
      console.error('Failed to update stage:', error);
    }
  };

  const handleDelete = async () => {
    if (!deletingStage) return;
    try {
      await deleteMutation.mutateAsync(deletingStage.stageId);
      setDeletingStage(null);
    } catch (error) {
      console.error('Failed to delete stage:', error);
    }
  };

  if (isLoading) {
    return <TableSkeleton rows={6} />;
  }

  const sorted = stages ? [...stages].sort((a, b) => a.sortOrder - b.sortOrder) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Journey Stages</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Manage stages in the customer journey funnel
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus size={16} />
          New Stage
        </Button>
      </div>

      {!stages || stages.length === 0 ? (
        <Card>
          <EmptyState title="No stages defined" description="Journey stages have not been configured yet." />
        </Card>
      ) : (
        <Card>
          <CardContent>
            <div className="space-y-3">
              {sorted.map((stage, idx) => (
                <div
                  key={stage.stageId}
                  className="flex items-center gap-4 p-4 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: STAGE_COLORS[idx % STAGE_COLORS.length] }}
                  >
                    {stage.sortOrder}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{stage.name}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">Stage ID: {stage.stageId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingStage(stage)}
                      className="p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                      title="Edit stage"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeletingStage(stage)}
                      className="p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-colors"
                      title="Delete stage"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 ml-1"
                      style={{ backgroundColor: STAGE_COLORS[idx % STAGE_COLORS.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Modal isOpen={showCreateModal} title="Create Journey Stage" onClose={() => setShowCreateModal(false)}>
        <StageForm onClose={() => setShowCreateModal(false)} onSubmit={handleCreate} isLoading={createMutation.isPending} />
      </Modal>

      <Modal isOpen={!!editingStage} title="Edit Journey Stage" onClose={() => setEditingStage(null)}>
        {editingStage && (
          <StageForm
            stage={editingStage}
            onClose={() => setEditingStage(null)}
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      <Modal isOpen={!!deletingStage} title="Delete Journey Stage" onClose={() => setDeletingStage(null)}>
        {deletingStage && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Are you sure you want to delete the stage <strong>{deletingStage.name}</strong>? This action cannot be
              undone and may affect existing journeys.
            </p>
            <div className="flex gap-3">
              <Button variant="danger" onClick={handleDelete} isLoading={deleteMutation.isPending} className="flex-1">
                Delete
              </Button>
              <Button variant="secondary" onClick={() => setDeletingStage(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
