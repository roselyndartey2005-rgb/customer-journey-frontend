import { Link } from 'react-router-dom';
import { products, categories } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { Slider, Carousel } from '../components/Slider';
import { track } from '../lib/tracker';

export function HomePage() {
  const featured = products.slice(0, 12);
  const newArrivals = products.slice(0, 8);
  const bestSellers = [...products].sort(() => Math.random() - 0.5).slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-block animate-slide-in-left mb-4">
              <span className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm text-sm font-semibold text-[var(--color-primary)] shadow-lg border border-purple-100">
                Premium Collection 2026
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight animate-slide-up">
              <span className="gradient-text">Less but better.</span>
            </h1>
            <p className="mt-6 text-xl text-zinc-700 leading-relaxed animate-slide-up max-w-2xl" style={{ animationDelay: '100ms' }}>
              Carefully selected products that bring simplicity and quality to your everyday life. No clutter, no compromise.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to="/products">
                <Button variant="gradient" size="lg">
                  Shop All Products
                </Button>
              </Link>
              <Link to="/products?category=Electronics">
                <Button variant="outline" size="lg">
                  New Arrivals
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div>
                <div className="text-3xl font-bold gradient-text">500+</div>
                <div className="text-sm text-zinc-600 mt-1">Premium Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text">50k+</div>
                <div className="text-sm text-zinc-600 mt-1">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text">4.9</div>
                <div className="text-sm text-zinc-600 mt-1">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
  <h2 className="text-3xl font-bold text-zinc-900 mb-10">
    Shop by Category
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
    {categories.map((category, index) => (
      <Link
        key={category.name}
        to={`/products?category=${encodeURIComponent(category.name)}`}
        onClick={() =>
          track("CLICK", {
            action: "category_nav",
            category: category.name,
          })
        }
        className="group relative aspect-[4/3] rounded-2xl overflow-hidden flex items-end p-6 hover-glow animate-slide-up"
        style={{
          animationDelay: `${index * 50}ms`,
          backgroundImage: `url(${category.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/70 via-zinc-900/20 to-transparent group-hover:from-zinc-900/80 transition-all duration-300" />

        {/* Hover color overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category name */}
        <span className="relative text-white font-bold text-base group-hover:scale-110 transition-transform duration-300 inline-block">
          {category.name}
        </span>

        {/* Arrow */}
        <svg
          className="absolute top-5 right-5 w-6 h-6 text-white/60 group-hover:text-white group-hover:scale-110 transition-all duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    ))}
  </div>
</section>
      {/* Featured Products Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="relative">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-zinc-900">Featured Products</h2>
            <Link
              to="/products"
              className="group flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
            >
              View all
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Desktop: Show 4 items per view */}
          <div className="hidden lg:block">
            <Slider
              autoPlay
              autoPlayInterval={5000}
              showArrows
              showDots
              itemsPerView={4}
              gap={24}
              arrowPosition="outside"
            >
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Slider>
          </div>

          {/* Tablet: Show 3 items per view */}
          <div className="hidden md:block lg:hidden">
            <Slider
              autoPlay
              autoPlayInterval={5000}
              showArrows
              showDots
              itemsPerView={3}
              gap={20}
              arrowPosition="inside"
            >
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Slider>
          </div>

          {/* Mobile: Show 2 items per view */}
          <div className="md:hidden">
            <Slider
              autoPlay
              autoPlayInterval={5000}
              showArrows
              showDots
              itemsPerView={2}
              gap={16}
              arrowPosition="inside"
            >
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* New Arrivals Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900">New Arrivals</h2>
            <p className="text-zinc-600 mt-2">Fresh picks just for you</p>
          </div>
          <Link
            to="/products?category=Electronics"
            className="group flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
          >
            See all new
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Desktop: 4 items */}
        <div className="hidden lg:block">
          <Slider
            showArrows
            showDots
            itemsPerView={4}
            gap={24}
            arrowPosition="outside"
          >
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Slider>
        </div>

        {/* Tablet: 3 items */}
        <div className="hidden md:block lg:hidden">
          <Slider
            showArrows
            showDots
            itemsPerView={3}
            gap={20}
            arrowPosition="inside"
          >
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Slider>
        </div>

        {/* Mobile: 2 items */}
        <div className="md:hidden">
          <Slider
            showArrows
            showDots
            itemsPerView={2}
            gap={16}
            arrowPosition="inside"
          >
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Slider>
        </div>
      </section>

      {/* Best Sellers Carousel (Continuous Scroll) */}
      <section className="py-20 bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-blue-50/50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">Best Sellers</h2>
            <p className="text-lg text-zinc-600">Customer favorites that keep selling out</p>
          </div>
        </div>

        <div className="relative">
          <Carousel itemWidth={320} gap={24} speed={35} pauseOnHover>
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Carousel>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="border-t border-zinc-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900">What Our Customers Say</h2>
            <p className="text-zinc-600 mt-2">Don't just take our word for it</p>
          </div>

          <Slider
            autoPlay
            autoPlayInterval={6000}
            showArrows
            showDots
            itemsPerView={1}
            arrowPosition="inside"
          >
            {[
              {
                name: 'Sarah Johnson',
                role: 'Interior Designer',
                text: 'The quality is absolutely outstanding. Every piece I\'ve purchased has exceeded my expectations. The attention to detail is remarkable.',
                rating: 5,
              },
              {
                name: 'Michael Chen',
                role: 'Tech Enthusiast',
                text: 'Finally found a store that understands minimalism without compromising on functionality. The curation is spot on.',
                rating: 5,
              },
              {
                name: 'Emily Rodriguez',
                role: 'Creative Director',
                text: 'These products have genuinely improved my daily life. Simple, elegant, and built to last. Highly recommend!',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-10 md:p-12 text-center">
                <div className="flex justify-center mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-6 h-6 text-yellow-400 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xl md:text-2xl text-zinc-800 font-medium leading-relaxed mb-8 max-w-3xl mx-auto">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-zinc-900">{testimonial.name}</div>
                    <div className="text-sm text-zinc-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Quality Guaranteed</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">Every product is tested and hand-selected for lasting quality.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Free Shipping</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">Complimentary shipping on all orders over $75.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Easy Returns</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">30-day hassle-free returns on all purchases.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Stay in the Loop</h2>
          <p className="text-lg text-zinc-600 mb-8">Get exclusive access to new products, special offers, and more.</p>
          <form className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-xl border-2 border-zinc-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
            />
            <Button variant="gradient" size="lg">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-zinc-500 mt-4">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
