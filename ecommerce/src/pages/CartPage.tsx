import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/Button';
import { track } from '../lib/tracker';

export function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="animate-bounce-in">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center mx-auto mb-8">
            <svg className="w-16 h-16 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-3">Your cart is empty</h2>
          <p className="text-zinc-600 mb-10 max-w-md mx-auto">Looks like you have not added anything to your cart yet. Start shopping to fill it up!</p>
          <Link to="/products">
            <Button variant="gradient" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold gradient-text mb-10 animate-slide-up">Shopping Cart</h1>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.product.id}
            className="flex gap-5 p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Link to={`/product/${item.product.id}`} className="shrink-0 group">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-28 h-28 rounded-xl object-cover bg-zinc-100 group-hover:scale-110 transition-transform duration-300 shadow-md"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/product/${item.product.id}`} className="text-base font-bold text-zinc-900 hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                {item.product.name}
              </Link>
              <p className="text-sm text-zinc-500 mt-1 font-medium">{item.product.category}</p>
              <p className="text-lg font-bold gradient-text mt-2">${item.product.price.toFixed(2)}</p>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="w-10 h-10 rounded-xl border-2 border-zinc-200 flex items-center justify-center text-zinc-600 font-bold hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all hover:scale-110"
                >
                  -
                </button>
                <span className="text-base font-bold text-zinc-900 w-10 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="w-10 h-10 rounded-xl border-2 border-zinc-200 flex items-center justify-center text-zinc-600 font-bold hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all hover:scale-110"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="ml-4 px-4 py-2 text-sm font-semibold text-zinc-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-zinc-900">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 p-8 rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-zinc-200 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-base">
            <span className="text-zinc-700 font-medium">Subtotal</span>
            <span className="text-zinc-900 font-semibold">${subtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-base">
            <span className="text-zinc-700 font-medium">Shipping</span>
            <span className="text-green-600 font-semibold">Free</span>
          </div>
          <div className="pt-3 border-t-2 border-zinc-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-zinc-900">Total</span>
              <span className="text-3xl font-bold gradient-text">${subtotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-zinc-600 mb-6">Shipping and taxes calculated at checkout.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/checkout" className="flex-1">
            <Button
              variant="gradient"
              fullWidth
              size="lg"
              onClick={() => track('CLICK', { action: 'proceed_to_checkout', cartValue: subtotal(), itemCount: items.length })}
            >
              Proceed to Checkout
            </Button>
          </Link>
          <Link to="/products" className="flex-1">
            <Button variant="outline" fullWidth size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
