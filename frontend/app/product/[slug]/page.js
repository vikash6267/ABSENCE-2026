'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore, useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { Check, ChevronLeft, ChevronRight, Shield, Star, Truck, Upload, X, Share2 } from 'lucide-react';

const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const toMediaObject = (item) => {
  if (!item) return null;
  if (typeof item === 'string') return { type: 'image', url: item };
  return { type: 'image', url: item.url };
};

const extractSizeOptions = (product) => {
  const stockMap = new Map();

  (product.variants || []).forEach((variant) => {
    (variant.sizes || []).forEach((sizeItem) => {
      const key = sizeItem.size;
      const current = stockMap.get(key) || 0;
      stockMap.set(key, current + Number(sizeItem.stock || 0));
    });
  });

  (product.sizes || []).forEach((sizeItem) => {
    const key = sizeItem.size;
    const current = stockMap.get(key) || 0;
    stockMap.set(key, current + Number(sizeItem.stock || 0));
  });

  const orderedKeys = sizeOrder.filter((size) => stockMap.has(size));
  const missingFromOrder = Array.from(stockMap.keys()).filter((size) => !orderedKeys.includes(size));
  const keys = orderedKeys.concat(missingFromOrder);

  return keys.map((size) => ({
    size,
    stock: stockMap.get(size) || 0,
    inStock: (stockMap.get(size) || 0) > 0,
  }));
};

const titleize = (value) => {
  if (!value) return '-';
  return String(value)
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
};

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewer, setViewer] = useState({ open: false, items: [], index: 0 });
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    media: [],
  });
  const [referralInfo, setReferralInfo] = useState(null);

  const addItem = useCartStore((state) => state.addItem);
  const user = useAuthStore((state) => state.user);

  const productImages = useMemo(() => {
    return (product?.images || []).map(toMediaObject).filter(Boolean);
  }, [product]);

  const sizeOptions = useMemo(() => {
    if (!product) return [];
    return extractSizeOptions(product);
  }, [product]);

  const displaySizes = useMemo(() => {
    const known = new Set(sizeOrder);
    const extras = sizeOptions.map((item) => item.size).filter((size) => !known.has(size));
    return [...sizeOrder, ...extras];
  }, [sizeOptions]);

  const selectedSizeInfo = useMemo(() => {
    return sizeOptions.find((item) => item.size === selectedSize);
  }, [sizeOptions, selectedSize]);

  const variantColors = useMemo(() => {
    return (product?.variants || [])
      .map((variant) => ({
        name: variant.color,
        code: variant.colorCode,
        images: variant.images || [],
      }))
      .filter((color) => color.name);
  }, [product]);

  const detailedAttributes = useMemo(() => {
    if (!product) return [];
    const attrs = product.attributes || {};
    const rows = [
      { label: 'Brand', value: product.brand },
      { label: 'Gender', value: product.gender },
      { label: 'Material', value: attrs.material },
      { label: 'Fit', value: attrs.fit },
      { label: 'GSM', value: attrs.gsm },
      { label: 'Neck Type', value: attrs.neckType },
      { label: 'Sleeve Type', value: attrs.sleeveType },
    ];

    return rows
      .filter((item) => item.value !== undefined && item.value !== null && String(item.value).trim() !== '')
      .map((item) => ({ label: item.label, value: titleize(item.value) }));
  }, [product]);

  const quickSpecs = useMemo(() => {
    if (!product) return [];
    const rows = [
      {
        label: 'Category',
        value: Array.isArray(product.category) ? product.category.join(', ') : product.category,
      },
      { label: 'Fit', value: product.attributes?.fit },
      { label: 'Material', value: product.attributes?.material },
      { label: 'Delivery', value: product.shipping?.deliveryTime },
    ];

    return rows
      .filter((item) => item.value !== undefined && item.value !== null && String(item.value).trim() !== '')
      .map((item) => ({ ...item, value: titleize(item.value) }));
  }, [product]);

  const openViewer = (items, index = 0) => {
    if (!items.length) return;
    setViewer({ open: true, items, index });
  };

  const closeViewer = () => setViewer({ open: false, items: [], index: 0 });

  const showPrev = () => {
    setViewer((prev) => ({
      ...prev,
      index: (prev.index - 1 + prev.items.length) % prev.items.length,
    }));
  };

  const showNext = () => {
    setViewer((prev) => ({
      ...prev,
      index: (prev.index + 1) % prev.items.length,
    }));
  };

  useEffect(() => {
    let isMounted = true;

    const loadPageData = async () => {
      setLoading(true);
      try {
        const productRes = await api.get(`/products/${params.slug}`);
        if (!isMounted) return;
        const fetchedProduct = productRes.data;
        setProduct(fetchedProduct);

        const availableSize = extractSizeOptions(fetchedProduct).find((size) => size.inStock);
        setSelectedSize(availableSize?.size || '');

        // Check for referral code in URL
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref');
        
        if (refCode) {
          try {
            // Validate referral code and get referrer info
            const refRes = await api.get(`/wallet/validate/${refCode}`);
            if (refRes.data.valid) {
              // Store referral info for this product only
              const productReferralInfo = {
                referrerId: refRes.data.referrerId,
                referralCode: refRes.data.referralCode,
                productId: fetchedProduct._id
              };
              setReferralInfo(productReferralInfo);
              toast.success(`🎉 ${refRes.data.message}`, { duration: 4000 });
            }
          } catch (error) {
            console.log('Invalid referral code');
          }
        }

        const primaryCategory = Array.isArray(fetchedProduct.category) ? fetchedProduct.category[0] : fetchedProduct.category;
        if (primaryCategory) {
          const relatedRes = await api.get(`/products?category=${encodeURIComponent(primaryCategory)}&limit=8&sort=-createdAt`);
          if (!isMounted) return;
          const related = (relatedRes.data.products || relatedRes.data || [])
            .filter((item) => item.slug !== fetchedProduct.slug)
            .slice(0, 4);
          setRelatedProducts(related);
        }

        if (user) {
          const alreadyReviewed = (fetchedProduct.reviews || []).some((review) => {
            const reviewUserId = review?.user?._id || review?.user;
            return String(reviewUserId) === String(user._id);
          });
          setHasReviewed(alreadyReviewed);

          if (!alreadyReviewed) {
            try {
              const orderRes = await api.get('/orders');
              if (!isMounted) return;
              const hasPurchased = (orderRes.data || []).some(
                (order) =>
                  order.orderStatus !== 'cancelled' &&
                  (order.items || []).some((item) => String(item.product) === String(fetchedProduct._id))
              );
              setCanReview(hasPurchased);
            } catch (error) {
              setCanReview(false);
            }
          } else {
            setCanReview(false);
          }
        } else {
          setCanReview(false);
          setHasReviewed(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPageData();
    return () => {
      isMounted = false;
    };
  }, [params.slug, user]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    if (selectedSizeInfo?.stock && quantity > selectedSizeInfo.stock) {
      toast.error('Selected quantity is more than stock');
      return;
    }

    // Add item with referral info if available
    addItem(product, selectedSize, quantity, referralInfo);
    
    if (referralInfo) {
      toast.success('Added to cart with referral bonus! 🎉');
    } else {
      toast.success('Added to cart');
    }
  };

  const handleReviewMediaChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    if (files.length > 6) {
      toast.error('Max 6 files allowed');
      return;
    }
    setReviewForm((prev) => ({ ...prev, media: files }));
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!product) return;
    if (!canReview) {
      toast.error('Only purchased users can review');
      return;
    }

    setReviewSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('rating', String(reviewForm.rating));
      formData.append('comment', reviewForm.comment);
      reviewForm.media.forEach((file) => formData.append('media', file));

      const res = await api.post(`/products/${product._id}/reviews`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProduct((prev) => ({
        ...prev,
        reviews: res.data.reviews,
        rating: res.data.rating,
        reviewCount: res.data.reviewCount,
      }));
      setReviewForm({ rating: 5, comment: '', media: [] });
      setCanReview(false);
      setHasReviewed(true);
      toast.success('Review submitted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-white px-4 py-20 text-center text-muted">Loading product...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-white px-4 py-20 text-center text-muted">Product not found.</div>;
  }

  const currentMedia = viewer.items[viewer.index];

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <div>
            <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl border border-border bg-card">
              {productImages[selectedImage] ? (
                <img
                  src={productImages[selectedImage].url}
                  alt={product.name}
                  className="h-full w-full cursor-zoom-in object-cover"
                  onClick={() => openViewer(productImages, selectedImage)}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted">No image</div>
              )}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {productImages.map((media, idx) => (
                <button
                  key={`${media.url}-${idx}`}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square overflow-hidden rounded-xl border bg-card ${
                    selectedImage === idx ? 'border-accent' : 'border-border'
                  }`}
                >
                  <img src={media.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-accent">ABSENCE</p>
            <h1 className="text-3xl font-black md:text-4xl">{product.name}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-3xl font-black text-accent">Rs. {product.price}</span>
              {product.comparePrice && (
                <span className="text-lg text-muted line-through">Rs. {product.comparePrice}</span>
              )}
              {product.comparePrice && (
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                  Save Rs. {Math.max(product.comparePrice - product.price, 0)}
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm">
              <div className="flex items-center text-amber-500">
                <Star size={14} className="fill-current" />
              </div>
              <span className="font-semibold">{product.rating || 0}</span>
              <span className="text-muted">({product.reviewCount || 0} reviews)</span>
            </div>

            <p className="mt-5 text-sm leading-6 text-muted md:text-base">{product.description}</p>

            {product.shortDescription && (
              <div className="mt-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted">
                {product.shortDescription}
              </div>
            )}

            {quickSpecs.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-3 text-sm md:grid-cols-4">
                {quickSpecs.map((item) => (
                  <div key={item.label} className="rounded-lg border border-border bg-white px-2 py-2">
                    <p className="text-xs uppercase text-muted">{item.label}</p>
                    <p className="font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            )}

            {variantColors.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 font-semibold">Available Colors</p>
                <div className="flex flex-wrap gap-2">
                  {variantColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-sm"
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.code || '#e5e7eb' }}
                      />
                      <span className="capitalize">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold">Select Size</p>
                {selectedSizeInfo?.inStock && selectedSizeInfo.stock <= 3 && (
                  <p className="text-xs font-semibold text-red-600">Hurry, only {selectedSizeInfo.stock} left</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {displaySizes.map((size) => {
                  const info = sizeOptions.find((item) => item.size === size);
                  const inStock = Boolean(info?.inStock);
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={size}
                      onClick={() => inStock && setSelectedSize(size)}
                      disabled={!inStock}
                    className={`relative min-w-[52px] rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                        isSelected
                          ? 'border-accent bg-accent text-white'
                          : inStock
                          ? 'border-border bg-white hover:border-accent'
                          : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through'
                      }`}
                    >
                      {size}
                      {!inStock && <span className="ml-1 text-[10px] font-medium">out</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 font-semibold">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="h-10 w-10 rounded-lg border border-border hover:bg-card"
                >
                  -
                </button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((prev) => {
                      const maxStock = selectedSizeInfo?.stock || 10;
                      return Math.min(maxStock, prev + 1);
                    })
                  }
                  className="h-10 w-10 rounded-lg border border-border hover:bg-card"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedSizeInfo?.inStock}
              className="mt-6 w-full rounded-xl bg-black py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {selectedSizeInfo?.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {/* Share & Earn Button */}
            <button
              onClick={async () => {
                if (user) {
                  try {
                    // Get user's referral code
                    const codeRes = await api.get('/wallet/referral-code');
                    const referralCode = codeRes.data.referralCode;
                    
                    // Logged in user - share with referral code
                    const referralLink = `${window.location.origin}/product/${product.slug}?ref=${referralCode}`;
                    
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: `Check out ${product.name} on ABSENCE! Use my code ${referralCode} and I'll earn 5% commission 🎉`,
                        url: referralLink
                      }).catch(() => {
                        navigator.clipboard.writeText(referralLink);
                        toast.success('Referral link copied! Share to earn 5% commission');
                      });
                    } else {
                      navigator.clipboard.writeText(referralLink);
                      toast.success('Referral link copied! Share to earn 5% commission');
                    }
                  } catch (error) {
                    toast.error('Failed to generate referral link');
                  }
                } else {
                  // Not logged in - simple share
                  const productLink = `${window.location.origin}/product/${product.slug}`;
                  
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      text: `Check out ${product.name} on ABSENCE Streetwear!`,
                      url: productLink
                    }).catch(() => {
                      navigator.clipboard.writeText(productLink);
                      toast.success('Product link copied!');
                    });
                  } else {
                    navigator.clipboard.writeText(productLink);
                    toast.success('Product link copied!');
                  }
                }
              }}
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-accent to-yellow-600 py-3.5 font-semibold text-white transition hover:scale-105 flex items-center justify-center gap-2"
            >
              <Share2 size={20} />
              {user ? 'Share & Earn 5% Commission' : 'Share This Product'}
            </button>

            {user && (
              <p className="text-center text-xs text-muted mt-2">
                💰 Earn ₹{((product.price * 5) / 100).toFixed(0)} commission when someone buys through your link!
              </p>
            )}

            <div className="mt-5 grid grid-cols-1 gap-2 border-t border-border pt-4 text-sm md:grid-cols-3">
              <div className="flex items-center gap-3">
                <Check size={16} className="text-green-600" />
                <span>Premium quality fabric with lasting print</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck size={16} className="text-green-600" />
                <span>Fast shipping and secure packing</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-green-600" />
                <span>7-day return available</span>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 rounded-2xl border border-border bg-card/40 p-5">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <p className="mt-1 text-sm text-muted">
            {product.reviewCount || 0} reviews | Avg Rating: {product.rating || 0}
          </p>

          {canReview && (
            <form onSubmit={handleReviewSubmit} className="mt-5 rounded-xl border border-border bg-white p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold">Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-border px-3 py-2"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value} Star
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold">Photos / Videos</label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted hover:border-accent">
                    <Upload size={14} />
                    Upload media
                    <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleReviewMediaChange} />
                  </label>
                  {reviewForm.media.length > 0 && (
                    <p className="mt-1 text-xs text-muted">{reviewForm.media.length} file(s) selected</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1 block text-sm font-semibold">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="w-full rounded-lg border border-border px-3 py-2"
                  placeholder="Share your fit, quality and experience..."
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="mt-4 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {!user && (
            <p className="mt-4 text-sm text-muted">Login and purchase this product to post a review.</p>
          )}
          {user && !canReview && !hasReviewed && (
            <p className="mt-4 text-sm text-muted">Only users who purchased this product can review.</p>
          )}
          {hasReviewed && <p className="mt-4 text-sm text-green-700">You have already reviewed this product.</p>}

          <div className="mt-6 space-y-4">
            {(product.reviews || []).length === 0 && <p className="text-sm text-muted">No reviews yet.</p>}
            {(product.reviews || [])
              .slice()
              .reverse()
              .map((review, reviewIndex) => {
                const reviewMedia = [
                  ...(review.images || []).map((url) => ({ type: 'image', url })),
                  ...(review.videos || []).map((url) => ({ type: 'video', url })),
                ];

                return (
                  <div key={`${review.createdAt}-${reviewIndex}`} className="rounded-xl border border-border bg-white p-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{review.user?.name || 'Verified Customer'}</p>
                        <div className="mt-1 flex items-center gap-1 text-amber-500">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} size={14} className={idx < review.rating ? 'fill-current' : ''} />
                          ))}
                        </div>
                      </div>
                      {review.verified && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-[11px] font-semibold text-green-700">
                          Verified Purchase
                        </span>
                      )}
                    </div>

                    {review.comment && <p className="mt-2 text-sm text-muted">{review.comment}</p>}

                    {reviewMedia.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
                        {reviewMedia.map((media, idx) => (
                          <button
                            key={`${media.url}-${idx}`}
                            onClick={() => openViewer(reviewMedia, idx)}
                            className="relative aspect-square overflow-hidden rounded-lg border border-border"
                          >
                            {media.type === 'video' ? (
                              <video src={media.url} className="h-full w-full object-cover" />
                            ) : (
                              <img src={media.url} alt="Review media" className="h-full w-full object-cover" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </section>

        {(detailedAttributes.length > 0 || (Array.isArray(product.faq) && product.faq.length > 0)) && (
          <section className="mt-10 rounded-2xl border border-border bg-white p-5">
            <h2 className="text-2xl font-bold">Complete Product Details</h2>
            {detailedAttributes.length > 0 && (
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {detailedAttributes.map((item) => (
                  <div key={item.label} className="rounded-xl border border-border bg-card/50 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted">{item.label}</p>
                    <p className="mt-1 font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            )}

            {Array.isArray(product.faq) && product.faq.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 font-semibold">FAQs</p>
                <div className="space-y-1.5">
                  {product.faq.map((item, idx) => (
                    <details key={`${item.question}-${idx}`} className="rounded-lg border border-border bg-card/30 p-3">
                      <summary className="cursor-pointer font-medium">{item.question}</summary>
                      <p className="mt-2 text-sm text-muted">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <section className="mt-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">You May Also Like</h2>
            <Link href="/shop" className="text-sm font-semibold text-accent hover:underline">
              View all products
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link
                key={item._id}
                href={`/product/${item.slug}`}
                className="group overflow-hidden rounded-2xl border border-border bg-white p-2 transition hover:shadow-lg"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-xl bg-card">
                  <img
                    src={item.images?.[0]?.url || 'https://via.placeholder.com/400x500'}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 truncate text-sm font-semibold">{item.name}</p>
                <p className="mt-1 text-sm font-bold text-accent">Rs. {item.price}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {viewer.open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4">
          <button onClick={closeViewer} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white">
            <X size={20} />
          </button>
          {viewer.items.length > 1 && (
            <>
              <button onClick={showPrev} className="absolute left-4 rounded-full bg-white/10 p-2 text-white">
                <ChevronLeft size={22} />
              </button>
              <button onClick={showNext} className="absolute right-16 rounded-full bg-white/10 p-2 text-white">
                <ChevronRight size={22} />
              </button>
            </>
          )}
          <div className="max-h-[90vh] w-full max-w-5xl">
            {currentMedia?.type === 'video' ? (
              <video src={currentMedia.url} controls autoPlay className="max-h-[90vh] w-full rounded-xl object-contain" />
            ) : (
              <img src={currentMedia?.url} alt="Preview" className="max-h-[90vh] w-full rounded-xl object-contain" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
