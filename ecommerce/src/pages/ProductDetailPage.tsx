import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { useCartStore } from '../store/cartStore';
import { track } from '../lib/tracker';
import toast from 'react-hot-toast';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Product Not Found</h2>
        <p className="text-zinc-500 mb-6">The product you are looking for does not exist.</p>
        <Link to="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity);
    track('CLICK', {
      action: 'add_to_cart',
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
        <Link to="/" className="hover:text-zinc-900">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-zinc-900">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-zinc-900">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-zinc-900">{product.name}</span>
      </nav>

      {/* Product */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="animate-fade-in">
          <div className="aspect-square rounded-3xl bg-gradient-to-br from-zinc-100 to-zinc-200 overflow-hidden relative shadow-2xl group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {/* Hover overlay for zoom effect indication */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center animate-slide-up space-y-6">
          <div>
            <Badge>{product.category}</Badge>
            <h1 className="text-4xl font-bold text-zinc-900 mt-4 leading-tight">{product.name}</h1>
            <div className="mt-5 inline-flex items-center gap-3">
              <p className="text-3xl font-bold gradient-text">${product.price.toFixed(2)}</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
                <span className="text-sm text-zinc-600 ml-2">(4.9)</span>
              </div>
            </div>
          </div>

          <p className="text-base text-zinc-600 leading-relaxed">{product.description}</p>

          {/* Quantity */}
          <div>
            <label className="text-sm font-bold text-zinc-900 mb-3 block">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-xl border-2 border-zinc-300 flex items-center justify-center text-zinc-700 font-bold hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all hover:scale-110 active:scale-95"
              >
                -
              </button>
              <span className="w-12 text-center font-bold text-xl text-zinc-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 rounded-xl border-2 border-zinc-300 flex items-center justify-center text-zinc-700 font-bold hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all hover:scale-110 active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="gradient"
              size="lg"
              onClick={handleAddToCart}
              className="flex-1"
              icon={
                addedToCart ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                )
              }
            >
              {addedToCart ? 'Added!' : 'Add to Cart'}
            </Button>
          </div>

          {/* Meta */}
          <div className="pt-6 border-t border-zinc-200 space-y-3">
            <div className="flex items-center gap-3 text-sm text-zinc-600">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Free shipping on orders over $75</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-600">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span>30-day hassle-free returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-24">
          <h2 className="text-3xl font-bold text-zinc-900 mb-10">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p, index) => (
              <div key={p.id} className="opacity-0 animate-slide-up" style={{ animationDelay: `${index * 75}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
