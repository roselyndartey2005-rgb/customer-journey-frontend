import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { useCustomerStore } from '../store/customerStore';

export function OrderConfirmationPage() {
  const location = useLocation();
  const customer = useCustomerStore((s) => s.customer);
  const state = location.state as { orderTotal?: number; itemCount?: number } | null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      {/* Success Animation */}
      <div className="animate-bounce-in mb-8">
        <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse-soft">
          <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Confetti decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      <h1 className="text-5xl font-bold gradient-text mb-4 animate-slide-up">Order Confirmed!</h1>
      <p className="text-xl text-zinc-700 mb-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
        Thank you{customer?.name ? `, ${customer.name.split(' ')[0]}` : ''}! Your order has been placed.
      </p>
      <p className="text-base text-zinc-600 mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
        A confirmation email will be sent to <span className="font-semibold text-[var(--color-primary)]">{customer?.email || 'your email address'}</span>.
      </p>

      {state && (
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-8 mb-10 inline-block border-2 border-zinc-200 shadow-lg animate-slide-up" style={{ animationDelay: '300ms' }}>
          <h3 className="text-lg font-bold text-zinc-900 mb-5">Order Details</h3>
          <div className="space-y-3 text-base">
            <div className="flex justify-between gap-12">
              <span className="text-zinc-600 font-medium">Order Total</span>
              <span className="font-bold gradient-text">${state.orderTotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-12">
              <span className="text-zinc-600 font-medium">Items</span>
              <span className="font-bold text-zinc-900">{state.itemCount}</span>
            </div>
            <div className="flex justify-between gap-12">
              <span className="text-zinc-600 font-medium">Shipping</span>
              <span className="font-bold text-green-600">Free</span>
            </div>
            <div className="flex justify-between gap-12">
              <span className="text-zinc-600 font-medium">Estimated Delivery</span>
              <span className="font-bold text-zinc-900">3-5 business days</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '400ms' }}>
        <Link to="/products">
          <Button variant="gradient" size="lg">Continue Shopping</Button>
        </Link>
        <Link to="/">
          <Button variant="outline" size="lg">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
