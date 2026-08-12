import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { track } from '../lib/tracker';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlist, setIsWishlist] = useState(false);

  const handleClick = () => {
    track('CLICK', {
      action: 'product_card_click',
      productId: product.id,
      productName: product.name,
      productCategory: product.category,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlist(!isWishlist);
  };

  return (
    <div className="group relative">
      <Link
        to={`/product/${product.id}`}
        onClick={handleClick}
        className="block"
      >
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 mb-4 shadow-sm group-hover:shadow-2xl transition-all duration-500">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover animate-fade-in group-hover:scale-110 transition-transform duration-700"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick View Button */}
          <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <div className="glass-card px-4 py-2.5 rounded-xl text-center text-sm font-semibold text-zinc-900 shadow-lg">
              Quick View
            </div>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <svg
              className={`w-5 h-5 transition-colors ${
                isWishlist ? 'fill-red-500 text-red-500' : 'fill-none text-zinc-600'
              }`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Price Badge */}
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white text-xs font-bold shadow-lg">
            ${product.price.toFixed(2)}
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">{product.category}</p>
          <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 leading-relaxed">
            {product.name}
          </h3>
        </div>
      </Link>
    </div>
  );
}
