import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerStore } from '../store/customerStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { track, setCustomerIdentity } from '../lib/tracker';
import { loginCustomer } from '../lib/api';
import toast from 'react-hot-toast';

export function LoginPage() {
  const navigate = useNavigate();
  const setCustomer = useCustomerStore((s) => s.setCustomer);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await loginCustomer({ name: name.trim(), email: email.trim() });
      setCustomer({
        customerId: response.customerId,
        name: response.name,
        email: response.email,
      });
      setCustomerIdentity(response.customerId, response.email);
      track('FORM_SUBMIT', {
        action: 'login',
        customerId: response.customerId,
        newCustomer: response.newCustomer,
      });
      toast.success(response.newCustomer ? 'Account created!' : 'Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-10 animate-slide-up">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-3">Welcome</h1>
          <p className="text-zinc-600 text-lg">Sign in or create an account to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border-2 border-zinc-200 shadow-xl animate-slide-up" style={{ animationDelay: '100ms' }}>
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            required
          />
          <Button variant="gradient" type="submit" fullWidth size="lg" loading={loading}>
            Continue
          </Button>
        </form>

        <p className="text-xs text-zinc-500 text-center mt-6">
          We use your name and email to identify you. No password required for this demo.
        </p>
      </div>
    </div>
  );
}
