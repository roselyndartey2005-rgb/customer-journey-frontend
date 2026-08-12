import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useUsers, useUpdateUser, useDeleteUser } from '../hooks/useUsers';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton, TableSkeleton } from '../components/ui/Skeleton';
import type { UserResponse, UserUpdateRequest } from '../types';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'accent';

function getRoleColor(role: string): BadgeVariant {
  switch (role) {
    case 'ADMIN': return 'danger';
    case 'ANALYST': return 'warning';
    case 'VIEWER': return 'neutral';
    default: return 'neutral';
  }
}

interface UserFormProps {
  user: UserResponse;
  onClose: () => void;
  onSubmit: (data: UserUpdateRequest) => void;
  isLoading: boolean;
}

function UserForm({ user, onClose, onSubmit, isLoading }: UserFormProps) {
  const [role, setRole] = useState<'ADMIN' | 'ANALYST' | 'VIEWER'>(user.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ role });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Username</label>
        <input
          type="text"
          value={user.username}
          disabled
          className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Email</label>
        <input
          type="text"
          value={user.email}
          disabled
          className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'ADMIN' | 'ANALYST' | 'VIEWER')}
          required
          className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        >
          <option value="VIEWER">Viewer</option>
          <option value="ANALYST">Analyst</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          Update
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserResponse | null>(null);

  const handleUpdate = async (data: UserUpdateRequest) => {
    if (!editingUser) return;
    try {
      await updateMutation.mutateAsync({ userId: editingUser.userId, payload: data });
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      await deleteMutation.mutateAsync(deletingUser.userId);
      setDeletingUser(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">User Management</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage user access and roles</p>
        </div>
      </div>

      <Card>
        <CardHeader title="All Users" description={`${users?.length || 0} total users`} />
        {!users || users.length === 0 ? (
          <EmptyState title="No users yet" description="Users will appear here once they register." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Username</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Last Login</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Created</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userId} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-hover)] transition-colors">
                    <td className="px-6 py-3 text-[var(--color-text-secondary)] font-mono">{user.userId}</td>
                    <td className="px-6 py-3 text-[var(--color-text-primary)] font-medium">{user.username}</td>
                    <td className="px-6 py-3 text-[var(--color-text-secondary)]">{user.email}</td>
                    <td className="px-6 py-3">
                      <Badge variant={getRoleColor(user.role)}>{user.role}</Badge>
                    </td>
                    <td className="px-6 py-3 text-[var(--color-text-secondary)]">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-3 text-[var(--color-text-secondary)]">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeletingUser(user)}
                          className="p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-colors"
                        >
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

      <Modal isOpen={!!editingUser} title="Edit User Role" onClose={() => setEditingUser(null)}>
        {editingUser && (
          <UserForm user={editingUser} onClose={() => setEditingUser(null)} onSubmit={handleUpdate} isLoading={updateMutation.isPending} />
        )}
      </Modal>

      <Modal isOpen={!!deletingUser} title="Delete User" onClose={() => setDeletingUser(null)}>
        {deletingUser && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Are you sure you want to delete user <strong>{deletingUser.username}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="danger" onClick={handleDelete} isLoading={deleteMutation.isPending} className="flex-1">
                Delete
              </Button>
              <Button variant="secondary" onClick={() => setDeletingUser(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
