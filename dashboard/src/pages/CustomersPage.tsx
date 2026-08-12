import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, ExternalLink } from 'lucide-react';
import { useCustomers, useUpdateCustomer } from '../hooks/useCustomers';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton, TableSkeleton } from '../components/ui/Skeleton';
import type { CustomerResponse, CustomerUpdateRequest } from '../types';

interface CustomerFormProps {
  customer: CustomerResponse;
  onClose: () => void;
  onSubmit: (data: CustomerUpdateRequest) => void;
  isLoading: boolean;
}

function CustomerForm({ customer, onClose, onSubmit, isLoading }: CustomerFormProps) {
  const [segment, setSegment] = useState(customer.segment || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ segment: segment || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Customer Email</label>
        <input
          type="text"
          value={customer.email}
          disabled
          className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] text-sm cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Segment</label>
        <input
          type="text"
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
          className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] placeholder:text-[var(--color-text-tertiary)] transition-colors"
          placeholder="VIP, New, Enterprise, etc."
        />
      </div>
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} className="flex-1">
          Update Customer
        </Button>
      </div>
    </form>
  );
}

export function CustomersPage() {
  const { data: customers, isLoading } = useCustomers();
  const updateMutation = useUpdateCustomer();
  const navigate = useNavigate();

  const [editingCustomer, setEditingCustomer] = useState<CustomerResponse | null>(null);

  const handleUpdate = async (data: CustomerUpdateRequest) => {
    if (!editingCustomer) return;
    try {
      await updateMutation.mutateAsync({ customerId: editingCustomer.customerId, payload: data });
      setEditingCustomer(null);
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <TableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">Customers</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">View and manage customer information</p>
      </div>

      <Card>
        <CardHeader title="All Customers" description={`${customers?.length || 0} total customers`} />
        {!customers || customers.length === 0 ? (
          <EmptyState title="No customers yet" description="Customers will appear here once they start their journeys." />
        ) : (
          <>
            {/* Desktop table view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">ID</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Segment</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">First Seen</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Last Seen</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.customerId} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-hover)] transition-colors">
                      <td className="px-6 py-3.5 text-[var(--color-text-secondary)] font-mono text-xs">{customer.customerId}</td>
                      <td className="px-6 py-3.5 text-[var(--color-text-primary)] font-medium">{customer.email}</td>
                      <td className="px-6 py-3.5">
                        {customer.segment ? (
                          <Badge variant="accent">{customer.segment}</Badge>
                        ) : (
                          <span className="text-[var(--color-text-tertiary)] text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-[var(--color-text-secondary)]">{new Date(customer.firstSeenAt).toLocaleDateString()}</td>
                      <td className="px-6 py-3.5 text-[var(--color-text-secondary)]">{new Date(customer.lastSeenAt).toLocaleDateString()}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/customer/${customer.customerId}`)}
                            className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                            aria-label="View journeys"
                          >
                            <ExternalLink size={16} />
                          </button>
                          <button
                            onClick={() => setEditingCustomer(customer)}
                            className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                            aria-label="Edit segment"
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="md:hidden p-4 space-y-3">
              {customers.map((customer) => (
                <div
                  key={customer.customerId}
                  className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--color-text-primary)] text-sm truncate">{customer.email}</p>
                      <p className="text-xs text-[var(--color-text-tertiary)] font-mono mt-0.5">ID: {customer.customerId}</p>
                    </div>
                    {customer.segment && <Badge variant="accent">{customer.segment}</Badge>}
                  </div>
                  <div className="space-y-2 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-tertiary)]">First Seen</span>
                      <span className="text-[var(--color-text-secondary)]">{new Date(customer.firstSeenAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-tertiary)]">Last Seen</span>
                      <span className="text-[var(--color-text-secondary)]">{new Date(customer.lastSeenAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-[var(--color-border)]">
                    <button
                      onClick={() => navigate(`/customer/${customer.customerId}`)}
                      className="flex-1 flex items-center justify-center gap-2 h-9 px-3 rounded-lg text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors"
                    >
                      <ExternalLink size={14} />
                      View Journeys
                    </button>
                    <button
                      onClick={() => setEditingCustomer(customer)}
                      className="flex-1 flex items-center justify-center gap-2 h-9 px-3 rounded-lg text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      <Modal isOpen={!!editingCustomer} title="Edit Customer" onClose={() => setEditingCustomer(null)}>
        {editingCustomer && (
          <CustomerForm customer={editingCustomer} onClose={() => setEditingCustomer(null)} onSubmit={handleUpdate} isLoading={updateMutation.isPending} />
        )}
      </Modal>
    </div>
  );
}
