import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <span className="text-lg font-bold tracking-tight text-zinc-900">ARDENT</span>
            <p className="mt-3 text-sm text-zinc-500 max-w-md">
              Thoughtfully curated products for people who value quality, simplicity, and intentional living.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 mb-3">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/products?category=Electronics" className="text-sm text-zinc-500 hover:text-zinc-900">Electronics</Link></li>
              <li><Link to="/products?category=Clothing" className="text-sm text-zinc-500 hover:text-zinc-900">Clothing</Link></li>
              <li><Link to="/products?category=Home+%26+Living" className="text-sm text-zinc-500 hover:text-zinc-900">Home & Living</Link></li>
              <li><Link to="/products?category=Accessories" className="text-sm text-zinc-500 hover:text-zinc-900">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 mb-3">Company</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-zinc-500">About</span></li>
              <li><span className="text-sm text-zinc-500">Contact</span></li>
              <li><span className="text-sm text-zinc-500">Shipping</span></li>
              <li><span className="text-sm text-zinc-500">Returns</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-zinc-200">
          <p className="text-xs text-zinc-400 text-center">
            &copy; 2026 Ardent. All rights reserved. This is a demo storefront.
          </p>
        </div>
      </div>
    </footer>
  );
}
