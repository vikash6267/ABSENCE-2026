'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { ArrowUpDown, Filter, ShoppingBag, SlidersHorizontal, X } from 'lucide-react';

const categories = ['oversized', 'regular', 'printed', 'plain', 'graphic', 'minimal'];
const genders = ['men', 'women', 'unisex'];
const fits = ['oversized', 'regular', 'slim', 'relaxed'];

export default function Shop() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    gender: searchParams.get('gender') || '',
    fit: searchParams.get('fit') || '',
    minPrice: '',
    maxPrice: '',
    sort: searchParams.get('sort') || '-createdAt',
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params.append(key, filters[key]);
    });

    api
      .get(`/products?${params.toString()}`)
      .then((res) => {
        setProducts(res.data.products || res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () => {
    setFilters({
      category: '',
      gender: '',
      fit: '',
      minPrice: '',
      maxPrice: '',
      sort: '-createdAt',
    });
  };

  const toggleCategory = (category) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === category ? '' : category,
    }));
  };

  const activeFilters = [
    filters.category && { label: `Category: ${filters.category}`, key: 'category' },
    filters.gender && { label: `Gender: ${filters.gender}`, key: 'gender' },
    filters.fit && { label: `Fit: ${filters.fit}`, key: 'fit' },
    filters.minPrice && { label: `Min: ${filters.minPrice}`, key: 'minPrice' },
    filters.maxPrice && { label: `Max: ${filters.maxPrice}`, key: 'maxPrice' },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card/50 p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent">Absence Store</p>
              <h1 className="mt-2 text-3xl font-black md:text-4xl">Shop Collection</h1>
              <p className="mt-1 text-sm text-muted">{products.length} products found</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium hover:border-accent"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
              <div className="relative">
                <ArrowUpDown size={15} className="pointer-events-none absolute left-3 top-3.5 text-muted" />
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="rounded-xl border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-accent"
                >
                  <option value="-createdAt">Newest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-totalSold">Best Selling</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                filters.category === cat
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-white text-muted hover:border-accent hover:text-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => updateFilter(filter.key, '')}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs text-muted hover:border-accent"
              >
                {filter.label}
                <X size={12} />
              </button>
            ))}
            <button onClick={clearFilters} className="text-xs font-semibold text-accent hover:underline">
              Clear all
            </button>
          </div>
        )}

        <div className="mt-8 flex gap-8">
          <aside className={`${showFilters ? 'block' : 'hidden'} fixed inset-0 z-40 bg-black/30 p-4 lg:static lg:block lg:w-72 lg:bg-transparent lg:p-0`}>
            <div className="ml-auto h-full w-full max-w-sm overflow-y-auto rounded-2xl border border-border bg-white p-5 lg:ml-0 lg:h-auto lg:max-w-none lg:overflow-visible lg:sticky lg:top-24">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold">
                  <Filter size={16} />
                  Filters
                </h2>
                <div className="flex items-center gap-3">
                  <button onClick={clearFilters} className="text-xs font-semibold text-accent hover:underline">
                    Clear All
                  </button>
                  <button onClick={() => setShowFilters(false)} className="rounded-md border border-border p-1 lg:hidden">
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-sm font-semibold">Category</p>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat} className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                        <input
                          type="radio"
                          name="category"
                          checked={filters.category === cat}
                          onChange={() => updateFilter('category', cat)}
                          className="accent-accent"
                        />
                        <span className="capitalize">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold">Gender</p>
                  <div className="space-y-2">
                    {genders.map((gender) => (
                      <label key={gender} className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                        <input
                          type="radio"
                          name="gender"
                          checked={filters.gender === gender}
                          onChange={() => updateFilter('gender', gender)}
                          className="accent-accent"
                        />
                        <span className="capitalize">{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold">Fit</p>
                  <div className="space-y-2">
                    {fits.map((fit) => (
                      <label key={fit} className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                        <input
                          type="radio"
                          name="fit"
                          checked={filters.fit === fit}
                          onChange={() => updateFilter('fit', fit)}
                          className="accent-accent"
                        />
                        <span className="capitalize">{fit}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold">Price Range</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => updateFilter('minPrice', e.target.value)}
                      className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter('maxPrice', e.target.value)}
                      className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="rounded-2xl border border-border bg-white p-16 text-center text-muted">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white p-16 text-center">
                <p className="text-lg font-semibold">No products found</p>
                <p className="mt-1 text-sm text-muted">Try changing filters or clear all filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <Link key={product._id} href={`/product/${product.slug}`} className="group rounded-2xl border border-border bg-white p-3 transition hover:shadow-lg">
                    <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-xl bg-card">
                      <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/600x750'}
                        alt={product.name}
                        className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                          product.images?.[1]?.url ? 'group-hover:scale-105 group-hover:opacity-0' : 'group-hover:scale-105'
                        }`}
                      />
                      {product.images?.[1]?.url && (
                        <img
                          src={product.images[1].url}
                          alt={`${product.name} alt`}
                          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100"
                        />
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/70 p-2 text-white">
                        <ShoppingBag size={15} />
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.category && (
                        <span className="rounded-full bg-card px-2 py-1 text-[11px] capitalize text-muted">{product.category}</span>
                      )}
                      {product.discount?.percentage && (
                        <span className="rounded-full bg-accent px-2 py-1 text-[11px] font-semibold text-white">
                          {product.discount.percentage}% OFF
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 truncate font-semibold group-hover:text-accent">{product.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-bold text-accent">Rs. {product.price}</span>
                      {product.comparePrice && <span className="text-sm text-muted line-through">Rs. {product.comparePrice}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
