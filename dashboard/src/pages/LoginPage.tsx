import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Route } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Invalid credentials. Please try again.');
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
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">Welcome back</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">Sign in to your account</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[var(--color-danger-light)] text-[var(--color-danger)] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent placeholder:text-[var(--color-text-tertiary)]"
                placeholder="Enter your password"
              />
            </div>
            <Button type="submit" isLoading={isLoading} className="w-full">
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--color-accent)] hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
