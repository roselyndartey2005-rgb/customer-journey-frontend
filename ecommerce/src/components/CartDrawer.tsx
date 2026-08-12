import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Button } from './Button';
import { track } from '../lib/tracker';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const [removingItem, setRemovingItem] = useState<number | null>(null);

  const handleRemove = (productId: number) => {
    setRemovingItem(productId);
    setTimeout(() => {
      removeItem(productId);
      setRemovingItem(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md glass-card z-50 shadow-2xl flex flex-col animate-slide-in-right border-l border-zinc-200/50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200/50">
          <h2 className="text-xl font-bold text-zinc-900">
            Your Cart
            <span className="ml-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white text-xs font-bold">
              {items.length}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-bounce-in">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Your cart is empty</h3>
              <p className="text-sm text-zinc-500 mb-6">Add some products to get started</p>
              <Button variant="gradient" onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.product.id}
                  className={`flex gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-zinc-200/50 hover:shadow-lg transition-all duration-300 ${
                    removingItem === item.product.id ? 'animate-slide-out-right' : 'animate-slide-in-right'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link to={`/product/${item.product.id}`} onClick={onClose}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover bg-zinc-100 hover:scale-105 transition-transform"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product.id}`}
                      onClick={onClose}
                      className="text-sm font-semibold text-zinc-900 hover:text-[var(--color-primary)] transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm font-bold text-[var(--color-primary)] mt-1">
                      ${item.product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border-2 border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold text-zinc-900 w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border-2 border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemove(item.product.id)}
                        className="ml-auto p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-200/50 px-6 py-6 space-y-4 bg-white/80 backdrop-blur-sm">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-600">Subtotal</span>
                <span className="font-semibold text-zinc-900">${subtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-600">Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="pt-2 border-t border-zinc-200">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-zinc-900">Total</span>
                  <span className="text-2xl font-bold gradient-text">
                    ${subtotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <Link to="/checkout" onClick={() => {
              onClose();
              track('CLICK', { action: 'proceed_to_checkout', cartValue: subtotal(), itemCount: items.length });
            }}>
              <Button variant="gradient" fullWidth size="lg">
                Proceed to Checkout
              </Button>
            </Link>
            <button
              onClick={onClose}
              className="w-full text-center text-sm text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
}
