import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useCustomerStore } from '../store/customerStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { track, setCustomerIdentity } from '../lib/tracker';
import { loginCustomer } from '../lib/api';
import type { ShippingAddress, PaymentInfo } from '../types';
import toast from 'react-hot-toast';

type Step = 'info' | 'shipping' | 'payment';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCartStore();
  const { customer, setCustomer } = useCustomerStore();

  const [step, setStep] = useState<Step>(customer ? 'shipping' : 'info');
  const [loading, setLoading] = useState(false);

  // Customer info
  const [name, setName] = useState(customer?.name || '');
  const [email, setEmail] = useState(customer?.email || '');

  // Shipping
  const [shipping, setShipping] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  // Payment
  const [payment, setPayment] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Your cart is empty</h2>
        <p className="text-zinc-500 mb-6">Add some items before checking out.</p>
        <Link to="/products">
          <Button>Shop Products</Button>
        </Link>
      </div>
    );
  }

  const handleCustomerInfo = async (e: React.FormEvent) => {
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
        action: 'checkout_customer_info',
        customerId: response.customerId,
        newCustomer: response.newCustomer,
      });
      setStep('shipping');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.firstName || !shipping.lastName || !shipping.address || !shipping.city || !shipping.state || !shipping.zipCode) {
      toast.error('Please fill in all shipping fields');
      return;
    }
    track('FORM_SUBMIT', { action: 'checkout_shipping', city: shipping.city, state: shipping.state });
    setStep('payment');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payment.cardNumber || !payment.expiryDate || !payment.cvv || !payment.nameOnCard) {
      toast.error('Please fill in all payment fields');
      return;
    }

    setLoading(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const orderTotal = subtotal();
    const itemCount = items.length;

    track('PURCHASE', {
      action: 'order_completed',
      orderValue: orderTotal,
      itemCount,
      items: items.map((i) => ({ id: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity })),
    });

    clearCart();
    setLoading(false);
    navigate('/order-confirmation', { state: { orderTotal, itemCount } });
  };

  const steps: { key: Step; label: string; number: number }[] = [
    { key: 'info', label: 'Your Info', number: 1 },
    { key: 'shipping', label: 'Shipping', number: 2 },
    { key: 'payment', label: 'Payment', number: 3 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold gradient-text mb-10 animate-slide-up">Checkout</h1>

      {/* Progress */}
      <div className="flex items-center mb-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold transition-all duration-500 z-10 ${
                  i <= currentStepIndex
                    ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg scale-110'
                    : 'bg-zinc-200 text-zinc-400'
                }`}
              >
                {i < currentStepIndex ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.number
                )}
              </div>
              <span
                className={`text-xs mt-2 font-semibold transition-colors ${
                  i <= currentStepIndex ? 'text-zinc-900' : 'text-zinc-400'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 rounded-full bg-zinc-200 relative -mt-6">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    i < currentStepIndex ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]' : 'w-0'
                  }`}
                  style={{ width: i < currentStepIndex ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 'info' && (
            <form onSubmit={handleCustomerInfo} className="space-y-5 animate-slide-in-left">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Customer Information</h2>
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
              <Button variant="gradient" type="submit" size="lg" loading={loading}>
                Continue to Shipping
              </Button>
            </form>
          )}

          {step === 'shipping' && (
            <form onSubmit={handleShipping} className="space-y-5 animate-slide-in-left">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={shipping.firstName}
                  onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                  required
                />
                <Input
                  label="Last Name"
                  value={shipping.lastName}
                  onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Street Address"
                value={shipping.address}
                onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                placeholder="123 Main Street"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  required
                />
                <Input
                  label="State"
                  value={shipping.state}
                  onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="ZIP Code"
                  value={shipping.zipCode}
                  onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                  required
                />
                <Input
                  label="Country"
                  value={shipping.country}
                  onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep('info')}>
                  Back
                </Button>
                <Button variant="gradient" type="submit" size="lg">
                  Continue to Payment
                </Button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handlePayment} className="space-y-5 animate-slide-in-left">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Payment Details</h2>
              <Input
                label="Name on Card"
                value={payment.nameOnCard}
                onChange={(e) => setPayment({ ...payment, nameOnCard: e.target.value })}
                placeholder="John Doe"
                required
              />
              <Input
                label="Card Number"
                value={payment.cardNumber}
                onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                placeholder="4242 4242 4242 4242"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Date"
                  value={payment.expiryDate}
                  onChange={(e) => setPayment({ ...payment, expiryDate: e.target.value })}
                  placeholder="MM/YY"
                  required
                />
                <Input
                  label="CVV"
                  value={payment.cvv}
                  onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                  placeholder="123"
                  required
                />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-amber-800">
                  This is a demo store. No real payment will be processed. Use any values.
                </p>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep('shipping')}>
                  Back
                </Button>
                <Button variant="gradient" type="submit" size="lg" loading={loading}>
                  {`Pay $${subtotal().toFixed(2)}`}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-6 border-2 border-zinc-200 sticky top-24 shadow-lg animate-slide-in-right">
            <h3 className="text-lg font-bold text-zinc-900 mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-zinc-700 truncate mr-2 font-medium">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="text-zinc-900 font-bold shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-zinc-200 pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-700 font-medium">Subtotal</span>
                <span className="text-zinc-900 font-semibold">${subtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-700 font-medium">Shipping</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-zinc-200">
                <span className="text-lg font-bold text-zinc-900">Total</span>
                <span className="text-2xl font-bold gradient-text">${subtotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
