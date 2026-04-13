'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { ArrowRight, RefreshCw, Shield, ShoppingBag, Sparkles, Truck } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroBanners = {
    main: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1600&auto=format&fit=crop',
    sideTop: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop',
    sideBottom: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop',
  };

  useEffect(() => {
    api
      .get('/products?sort=-createdAt&limit=8')
      .then((res) => {
        setProducts((res.data.products || res.data || []).slice(0, 8));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-bg text-text">
      <section className="relative overflow-hidden border-b border-border bg-white">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -right-16 top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-6 lg:col-span-5">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted">
              <Sparkles size={14} className="text-accent" />
              New Drop Live
            </span>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              Absence Streetwear for Everyday Flex
            </h1>
            <p className="mt-5 text-base text-muted md:text-lg">
              Stylish oversized tees, minimal fits and daily wear essentials. Hero me banner blocks ready hain jahan
              aap apni campaign images laga sakte ho.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-text px-6 py-3 font-semibold text-bg transition hover:bg-accent"
              >
                Shop Now
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/shop?sort=-totalSold"
                className="rounded-full border border-border bg-card px-6 py-3 font-semibold transition hover:border-accent"
              >
                Best Sellers
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {['oversized', 'minimal', 'graphic', 'printed'].map((category) => (
                <Link
                  key={category}
                  href={`/shop?category=${category}`}
                  className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted transition hover:border-accent hover:text-accent"
                >
                  {category}
                </Link>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-border bg-card/60 p-3">
                <p className="text-lg font-bold text-accent">24h</p>
                <p className="text-xs text-muted">Dispatch</p>
              </div>
              <div className="rounded-xl border border-border bg-card/60 p-3">
                <p className="text-lg font-bold text-accent">7 Days</p>
                <p className="text-xs text-muted">Return</p>
              </div>
              <div className="rounded-xl border border-border bg-card/60 p-3">
                <p className="text-lg font-bold text-accent">Premium</p>
                <p className="text-xs text-muted">Fabric</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 lg:col-span-7">
            <div className="grid gap-4 md:grid-cols-5">
              <Link
                href="/shop"
                className="group relative overflow-hidden rounded-3xl border border-border md:col-span-3 md:min-h-[450px]"
              >
                <img
                  src={heroBanners.main}
                  alt="Main banner"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-accent">Main Campaign</p>
                  <p className="mt-1 text-xl font-bold">Drop 2026</p>
                </div>
              </Link>

              <div className="grid gap-4 md:col-span-2">
                <Link href="/shop?category=oversized" className="group relative overflow-hidden rounded-3xl border border-border">
                  <img
                    src={heroBanners.sideTop}
                    alt="Oversized banner"
                    className="h-52 w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-accent">Category</p>
                    <p className="font-semibold">Oversized Fit</p>
                  </div>
                </Link>

                <Link href="/shop?category=minimal" className="group relative overflow-hidden rounded-3xl border border-border">
                  <img
                    src={heroBanners.sideBottom}
                    alt="Minimal banner"
                    className="h-52 w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-accent">Category</p>
                    <p className="font-semibold">Minimal Series</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/shop?category=oversized" className="group rounded-2xl border border-border bg-white p-5 transition hover:shadow-md">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Most Loved</p>
            <h3 className="mt-2 text-xl font-bold">Oversized Drop</h3>
            <p className="mt-1 text-sm text-muted">Relaxed fit + premium cotton collection.</p>
          </Link>
          <Link href="/shop?category=minimal" className="group rounded-2xl border border-border bg-white p-5 transition hover:shadow-md">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Clean Look</p>
            <h3 className="mt-2 text-xl font-bold">Minimal Series</h3>
            <p className="mt-1 text-sm text-muted">Simple branding with modern palette.</p>
          </Link>
          <Link href="/shop?category=graphic" className="group rounded-2xl border border-border bg-white p-5 transition hover:shadow-md">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Trending</p>
            <h3 className="mt-2 text-xl font-bold">Graphic Tees</h3>
            <p className="mt-1 text-sm text-muted">Statement prints for bold outfits.</p>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl bg-white px-4 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Featured Products</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Home Collection</h2>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-accent">
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted">
            No products available right now.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link key={product._id} href={`/product/${product.slug}`} className="group">
                <div className="overflow-hidden rounded-2xl border border-border bg-white transition hover:shadow-lg">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/420x520'}
                      alt={product.name}
                      className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                        product.images?.[1]?.url ? 'group-hover:scale-105 group-hover:opacity-0' : 'group-hover:scale-105'
                      }`}
                    />
                    {product.images?.[1]?.url && (
                      <img
                        src={product.images[1].url}
                        alt={`${product.name} alternate`}
                        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100"
                      />
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/70 p-2 text-white">
                      <ShoppingBag size={16} />
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted">{product.category || 'premium tee'}</p>
                    <h3 className="truncate font-semibold group-hover:text-accent">{product.name}</h3>
                    <p className="mt-1 text-sm font-bold text-accent">Rs. {product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-border bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-10 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
            <Truck className="text-accent" />
            <div>
              <p className="font-semibold">Fast Shipping</p>
              <p className="text-xs text-muted">3-5 days dispatch</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
            <Shield className="text-accent" />
            <div>
              <p className="font-semibold">Secure Payments</p>
              <p className="text-xs text-muted">Encrypted checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
            <RefreshCw className="text-accent" />
            <div>
              <p className="font-semibold">Easy Return</p>
              <p className="text-xs text-muted">Simple replacement support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
