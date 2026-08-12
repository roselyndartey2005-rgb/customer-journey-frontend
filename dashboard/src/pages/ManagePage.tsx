import { useState } from 'react';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import {
  useJourneys,
  useJourneyStages,
  useCreateJourney,
  useUpdateJourney,
  useDeleteJourney,
  useCreateTouchpoint,
} from '../hooks/useJourneys';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { StatusBadge } from '../components/ui/Badge';
import { TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import type { JourneyResponse, TouchpointType } from '../types';

type ModalType = 'create' | 'edit' | 'delete' | 'touchpoint' | null;

export function ManagePage() {
  const { data: journeys, isLoading } = useJourneys();
  const { data: stages } = useJourneyStages();
  const createJourney = useCreateJourney();
  const updateJourney = useUpdateJourney();
  const deleteJourney = useDeleteJourney();
  const createTouchpoint = useCreateTouchpoint();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedJourney, setSelectedJourney] = useState<JourneyResponse | null>(null);

  // Create form
  const [createCustomerId, setCreateCustomerId] = useState('');
  const [createStageId, setCreateStageId] = useState('');
  const [createStatus, setCreateStatus] = useState<'ACTIVE' | 'COMPLETED' | 'ABANDONED'>('ACTIVE');

  // Edit form
  const [editStageId, setEditStageId] = useState('');
  const [editStatus, setEditStatus] = useState<'ACTIVE' | 'COMPLETED' | 'ABANDONED'>('ACTIVE');

  // Touchpoint form
  const [tpCustomerId, setTpCustomerId] = useState('');
  const [tpChannelId, setTpChannelId] = useState('');
  const [tpCampaignId, setTpCampaignId] = useState('');
  const [tpStageId, setTpStageId] = useState('');
  const [tpType, setTpType] = useState<TouchpointType>('PAGE_VIEW');
  const [tpDevice, setTpDevice] = useState('');
  const [tpCountry, setTpCountry] = useState('');
  const [tpDuration, setTpDuration] = useState('');
  const [tpOccurredAt, setTpOccurredAt] = useState('');

  const touchpointTypes: TouchpointType[] = [
    'PAGE_VIEW', 'CLICK', 'FORM_SUBMIT', 'PURCHASE', 'EMAIL_OPEN',
    'AD_IMPRESSION', 'SUPPORT_CHAT', 'BOUNCE', 'UNKNOWN'
  ];

  const openEdit = (j: JourneyResponse) => {
    setSelectedJourney(j);
    setEditStageId(String(j.currentStageId));
    setEditStatus(j.status);
    setModalType('edit');
  };

  const openDelete = (j: JourneyResponse) => {
    setSelectedJourney(j);
    setModalType('delete');
  };

  const openTouchpoint = (j: JourneyResponse) => {
    setSelectedJourney(j);
    setTpCustomerId(String(j.customerId));
    setTpStageId(String(j.currentStageId));
    setTpOccurredAt(new Date().toISOString().slice(0, 16));
    setModalType('touchpoint');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createJourney.mutateAsync({
      customerId: Number(createCustomerId),
      currentStageId: Number(createStageId),
      status: createStatus,
    });
    setModalType(null);
    setCreateCustomerId('');
    setCreateStageId('');
    setCreateStatus('ACTIVE');
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJourney) return;
    await updateJourney.mutateAsync({
      journeyId: selectedJourney.journeyId,
      payload: {
        currentStageId: Number(editStageId),
        status: editStatus,
      },
    });
    setModalType(null);
  };

  const handleDelete = async () => {
    if (!selectedJourney) return;
    await deleteJourney.mutateAsync(selectedJourney.journeyId);
    setModalType(null);
  };

  const handleCreateTouchpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJourney) return;
    await createTouchpoint.mutateAsync({
      journeyId: selectedJourney.journeyId,
      payload: {
        customerId: Number(tpCustomerId),
        channelId: Number(tpChannelId),
        campaignId: Number(tpCampaignId),
        stageId: Number(tpStageId),
        touchpointType: tpType,
        device: tpDevice,
        country: tpCountry,
        durationSeconds: tpDuration ? Number(tpDuration) : undefined,
        occurredAt: new Date(tpOccurredAt).toISOString(),
      },
    });
    setModalType(null);
    setTpChannelId('');
    setTpCampaignId('');
    setTpDevice('');
    setTpCountry('');
    setTpDuration('');
  };

  if (isLoading) return <TableSkeleton rows={8} />;

  const inputClass = "w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]";
  const labelClass = "block text-sm font-medium text-[var(--color-text-primary)] mb-1";

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setModalType('create')}>
          <Plus size={16} /> Create Journey
        </Button>
      </div>

      <Card>
        <CardHeader title="All Journeys" description="Create, edit, and delete journeys" />
        {!journeys || journeys.length === 0 ? (
          <EmptyState title="No journeys" description="Create your first journey to get started." action={<Button onClick={() => setModalType('create')}><Plus size={14} /> Create Journey</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase">ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Stage</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {journeys.map((j) => (
                  <tr key={j.journeyId} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-hover)] transition-colors">
                    <td className="px-6 py-3 text-[var(--color-text-primary)] font-mono text-xs">#{j.journeyId}</td>
                    <td className="px-6 py-3 text-[var(--color-text-primary)]">{j.customerEmail}</td>
                    <td className="px-6 py-3 text-[var(--color-text-secondary)]">{j.currentStageName}</td>
                    <td className="px-6 py-3"><StatusBadge status={j.status} /></td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openTouchpoint(j)} className="p-1.5 rounded-md hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]" title="Add touchpoint">
                          <MapPin size={14} />
                        </button>
                        <button onClick={() => openEdit(j)} className="p-1.5 rounded-md hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => openDelete(j)} className="p-1.5 rounded-md hover:bg-[var(--color-danger-light)] text-[var(--color-danger)]" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      <Modal isOpen={modalType === 'create'} onClose={() => setModalType(null)} title="Create Journey">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className={labelClass}>Customer ID</label>
            <input type="number" value={createCustomerId} onChange={(e) => setCreateCustomerId(e.target.value)} required className={inputClass} placeholder="e.g. 1" />
          </div>
          <div>
            <label className={labelClass}>Stage</label>
            <select value={createStageId} onChange={(e) => setCreateStageId(e.target.value)} required className={inputClass}>
              <option value="">Select stage</option>
              {stages?.map((s) => <option key={s.stageId} value={s.stageId}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={createStatus} onChange={(e) => setCreateStatus(e.target.value as typeof createStatus)} className={inputClass}>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ABANDONED">Abandoned</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalType(null)}>Cancel</Button>
            <Button type="submit" isLoading={createJourney.isPending}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={modalType === 'edit'} onClose={() => setModalType(null)} title="Edit Journey">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className={labelClass}>Stage</label>
            <select value={editStageId} onChange={(e) => setEditStageId(e.target.value)} required className={inputClass}>
              <option value="">Select stage</option>
              {stages?.map((s) => <option key={s.stageId} value={s.stageId}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as typeof editStatus)} className={inputClass}>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ABANDONED">Abandoned</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalType(null)}>Cancel</Button>
            <Button type="submit" isLoading={updateJourney.isPending}>Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={modalType === 'delete'} onClose={() => setModalType(null)} title="Delete Journey">
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          Are you sure you want to delete journey <span className="font-medium text-[var(--color-text-primary)]">#{selectedJourney?.journeyId}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setModalType(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} isLoading={deleteJourney.isPending}>Delete</Button>
        </div>
      </Modal>

      {/* Touchpoint Modal */}
      <Modal isOpen={modalType === 'touchpoint'} onClose={() => setModalType(null)} title="Add Touchpoint">
        <form onSubmit={handleCreateTouchpoint} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Customer ID</label>
              <input type="number" value={tpCustomerId} onChange={(e) => setTpCustomerId(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Channel ID</label>
              <input type="number" value={tpChannelId} onChange={(e) => setTpChannelId(e.target.value)} required className={inputClass} placeholder="e.g. 1" />
            </div>
            <div>
              <label className={labelClass}>Campaign ID</label>
              <input type="number" value={tpCampaignId} onChange={(e) => setTpCampaignId(e.target.value)} required className={inputClass} placeholder="e.g. 1" />
            </div>
            <div>
              <label className={labelClass}>Stage</label>
              <select value={tpStageId} onChange={(e) => setTpStageId(e.target.value)} required className={inputClass}>
                <option value="">Select</option>
                {stages?.map((s) => <option key={s.stageId} value={s.stageId}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <select value={tpType} onChange={(e) => setTpType(e.target.value as TouchpointType)} className={inputClass}>
              {touchpointTypes.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Device</label>
              <input type="text" value={tpDevice} onChange={(e) => setTpDevice(e.target.value)} required className={inputClass} placeholder="e.g. Desktop" />
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <input type="text" value={tpCountry} onChange={(e) => setTpCountry(e.target.value)} required className={inputClass} placeholder="e.g. US" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Duration (s)</label>
              <input type="number" value={tpDuration} onChange={(e) => setTpDuration(e.target.value)} className={inputClass} placeholder="Optional" />
            </div>
            <div>
              <label className={labelClass}>Occurred At</label>
              <input type="datetime-local" value={tpOccurredAt} onChange={(e) => setTpOccurredAt(e.target.value)} required className={inputClass} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalType(null)}>Cancel</Button>
            <Button type="submit" isLoading={createTouchpoint.isPending}>Add Touchpoint</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
