import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useCustomerStore } from '../store/customerStore';
import { CartDrawer } from './CartDrawer';
import Logo from "../assets/Ardent Logo.png";

export function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevItemCount, setPrevItemCount] = useState(0);
  const [cartBounce, setCartBounce] = useState(false);

  const totalItems = useCartStore((s) => s.totalItems());
  const customer = useCustomerStore((s) => s.customer);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (totalItems > prevItemCount) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 500);
    }
    setPrevItemCount(totalItems);
  }, [totalItems, prevItemCount]);

  return (
    <>
      <header
        className={`sticky top-0 z-30 glass-card border-b transition-all duration-300 ${
          scrolled
            ? 'border-zinc-200/50 shadow-xl'
            : 'border-transparent shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-img w-20 h-20">
                <img src={Logo} />
              </div>
              
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/products"
                className="text-sm font-medium text-zinc-600 hover:text-[var(--color-primary)] transition-colors relative group"
              >
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/products?category=Electronics"
                className="text-sm font-medium text-zinc-600 hover:text-[var(--color-primary)] transition-colors relative group"
              >
                Electronics
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/products?category=Clothing"
                className="text-sm font-medium text-zinc-600 hover:text-[var(--color-primary)] transition-colors relative group"
              >
                Clothing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/products?category=Home+%26+Living"
                className="text-sm font-medium text-zinc-600 hover:text-[var(--color-primary)] transition-colors relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/products?category=Accessories"
                className="text-sm font-medium text-zinc-600 hover:text-[var(--color-primary)] transition-colors relative group"
              >
                Accessories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {customer ? (
                <Link
                  to="/account"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 hover:text-[var(--color-primary)] hover:bg-zinc-100 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {customer.name.split(' ')[0]}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-zinc-600 hover:text-[var(--color-primary)] hover:bg-zinc-100 rounded-lg transition-all"
                >
                  Sign In
                </Link>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className={`relative p-2 text-zinc-600 hover:text-[var(--color-primary)] transition-all hover:bg-zinc-100 rounded-lg ${
                  cartBounce ? 'animate-bounce-in' : ''
                }`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce-in">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
