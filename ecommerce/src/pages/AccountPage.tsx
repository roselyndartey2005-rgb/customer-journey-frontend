import { useNavigate } from 'react-router-dom';
import { useCustomerStore } from '../store/customerStore';
import { Button } from '../components/Button';

export function AccountPage() {
  const navigate = useNavigate();
  const { customer, clearCustomer } = useCustomerStore();

  if (!customer) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    clearCustomer();
    localStorage.removeItem('ecommerce_customer_id');
    localStorage.removeItem('ecommerce_customer_email');
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-10 animate-slide-up">
        <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl">
          <span className="text-3xl font-bold text-white">{customer.name.charAt(0).toUpperCase()}</span>
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2">My Account</h1>
        <p className="text-zinc-600">Manage your account settings and preferences</p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-8 mb-6 border-2 border-zinc-200 shadow-lg animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="space-y-5">
          <div>
            <label className="text-xs text-zinc-600 uppercase tracking-wider font-bold mb-2 block">Name</label>
            <p className="text-zinc-900 font-bold text-lg">{customer.name}</p>
          </div>
          <div className="pt-3 border-t-2 border-zinc-200">
            <label className="text-xs text-zinc-600 uppercase tracking-wider font-bold mb-2 block">Email</label>
            <p className="text-zinc-900 font-bold text-lg">{customer.email}</p>
          </div>
          {customer.customerId && (
            <div className="pt-3 border-t-2 border-zinc-200">
              <label className="text-xs text-zinc-600 uppercase tracking-wider font-bold mb-2 block">Customer ID</label>
              <p className="text-zinc-900 font-bold text-lg">#{customer.customerId}</p>
            </div>
          )}
        </div>
      </div>

      <Button variant="outline" fullWidth size="lg" onClick={handleLogout} className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        Sign Out
      </Button>
    </div>
  );
}
