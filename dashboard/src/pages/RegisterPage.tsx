import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Route } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'ANALYST' | 'VIEWER'>('VIEWER');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register({ username, email, password, role });
      navigate('/');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)] px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)] flex items-center justify-center">
            <Route size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-[var(--color-text-primary)]">Journey Analytics</span>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">Create an account</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">Get started with Journey Analytics</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[var(--color-danger-light)] text-[var(--color-danger)] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent placeholder:text-[var(--color-text-tertiary)]"
                placeholder="johndoe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent placeholder:text-[var(--color-text-tertiary)]"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent placeholder:text-[var(--color-text-tertiary)]"
                placeholder="Min 6 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'ADMIN' | 'ANALYST' | 'VIEWER')}
                required
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              >
                <option value="VIEWER">Viewer</option>
                <option value="ANALYST">Analyst</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <Button type="submit" isLoading={isLoading} className="w-full">
              Create account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-accent)] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
