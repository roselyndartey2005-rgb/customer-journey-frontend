import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, categories } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Input } from '../components/Input';
import { Carousel } from '../components/Slider';
import { track } from '../lib/tracker';

type SortOption = 'default' | 'price-asc' | 'price-desc';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('default');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [categoryFilter, search, sort]);

  const handleCategoryClick = (cat: string) => {
    if (cat === categoryFilter) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
    track('CLICK', { action: 'category_filter', category: cat });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-10 animate-slide-up">
        <h1 className="text-4xl font-bold gradient-text mb-3">
          {categoryFilter || 'All Products'}
        </h1>
        <p className="text-base text-zinc-600">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </p>
      </div>

     {/* Category Carousel */}
<div
  className="mb-10 animate-slide-up"
  style={{ animationDelay: "100ms" }}
>
  <h3 className="text-sm font-semibold text-zinc-600 mb-6 uppercase tracking-wider">
    Browse by Category
  </h3>

  <Carousel itemWidth={200} gap={20} speed={40} pauseOnHover>
    {[
      {
        name: "All Products",
        filter: "",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=800&fit=crop&q=80",
      },

      ...categories.map((cat) => ({
        name: cat.name,
        filter: cat.name,
        image: cat.image,
      })),
    ].map((item) => (
      <button
        key={item.filter}
        onClick={() => handleCategoryClick(item.filter)}
        className={`relative group h-36 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg ${
          (item.filter === "" && !categoryFilter) ||
          categoryFilter === item.filter
            ? "ring-4 ring-purple-600 ring-offset-4 scale-105 shadow-2xl"
            : "hover:scale-105 hover:shadow-xl"
        }`}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{
            backgroundImage: `url(${item.image})`,
          }}
        />

        {/* Dark overlay */}
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            (item.filter === "" && !categoryFilter) ||
            categoryFilter === item.filter
              ? "bg-black/40"
              : "bg-black/30 group-hover:bg-black/40"
          }`}
        />

        {/* Category name */}
        <div className="relative h-full flex items-end justify-center p-4">
          <div
            className={`text-sm font-bold text-center transition-colors ${
              (item.filter === "" && !categoryFilter) ||
              categoryFilter === item.filter
                ? "text-white"
                : "text-white"
            }`}
          >
            {item.name}
          </div>
        </div>
      </button>
    ))}
  </Carousel>
</div>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="px-4 py-2 border-2 border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
        >
          <option value="default">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 animate-bounce-in">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">No products found</h3>
          <p className="text-sm text-zinc-500 mb-6">Try adjusting your search or filter criteria.</p>
          <button
            onClick={() => {
              setSearch('');
              handleCategoryClick('');
            }}
            className="px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div key={product.id} className="opacity-0 animate-slide-up" style={{ animationDelay: `${index * 30}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
