'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Checkout() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, initAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [walletMode, setWalletMode] = useState('full');
  const [walletInput, setWalletInput] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!user) return;

    api
      .get('/auth/me')
      .then((res) => {
        const profile = res.data || {};
        const addresses = profile.addresses || [];
        const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0];

        setFormData((prev) => ({
          ...prev,
          name: defaultAddress?.name || profile.name || prev.name,
          phone: defaultAddress?.phone || profile.phone || prev.phone,
          addressLine1: defaultAddress?.addressLine1 || prev.addressLine1,
          addressLine2: defaultAddress?.addressLine2 || prev.addressLine2,
          city: defaultAddress?.city || prev.city,
          state: defaultAddress?.state || prev.state,
          pincode: defaultAddress?.pincode || prev.pincode,
        }));
      })
      .catch(() => {});

    api
      .get('/wallet')
      .then((res) => setWalletBalance(Number(res.data?.balance || 0)))
      .catch(() => setWalletBalance(0));
  }, [user]);

  const subtotal = getTotal();
  const shipping = subtotal >= 999 ? 0 : 50;
  const baseTotal = Math.max(0, Number((subtotal + shipping - discount).toFixed(2)));
  const maxWalletUsable = Math.min(walletBalance, baseTotal);
  const parsedWalletInput = Number(walletInput || 0);
  const customWalletAmount = Number.isFinite(parsedWalletInput) ? parsedWalletInput : 0;
  const selectedWalletAmount = walletMode === 'full' ? maxWalletUsable : customWalletAmount;
  const walletUsed = useWallet
    ? Math.max(0, Math.min(Number(selectedWalletAmount.toFixed(2)), maxWalletUsable))
    : 0;
  const total = Math.max(0, Number((baseTotal - walletUsed).toFixed(2)));

  const applyCoupon = async () => {
    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode,
        orderValue: subtotal,
      });
      setDiscount(Number(res.data.discount || 0));
      toast.success('Coupon applied!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to continue');
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const referralProducts = items
        .filter((item) => item.referralInfo && item.referralInfo.referrerId)
        .map((item) => ({
          product: item.product._id,
          referrer: item.referralInfo.referrerId,
          commissionAmount: (item.product.price * item.quantity * 5) / 100,
        }));

      const orderData = {
        items: items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images[0]?.url,
          size: item.size,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: formData,
        subtotal,
        discount,
        shippingCost: shipping,
        walletUsed,
        total,
        couponUsed: couponCode ? { code: couponCode, discount } : null,
        referralProducts: referralProducts.length > 0 ? referralProducts : [],
      };

      if (total === 0) {
        const walletCheckoutRes = await api.post('/payments/wallet-checkout', { orderData });
        clearCart();
        toast.success('Order placed using wallet balance!');
        router.push(`/orders/${walletCheckoutRes.data.order._id}`);
        return;
      }

      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded || !window.Razorpay) {
        toast.error('Payment SDK failed to load. Please refresh and try again.');
        return;
      }

      const paymentRes = await api.post('/payments/create-order', {
        amount: total,
        lead: {
          name: formData.name,
          phone: formData.phone,
          email: user?.email,
          shippingAddress: formData,
          items: orderData.items,
          subtotal: orderData.subtotal,
          discount: orderData.discount,
          shippingCost: orderData.shippingCost,
          walletUsed: orderData.walletUsed,
          total: orderData.total,
          couponUsed: orderData.couponUsed,
        },
      });

      const razorpayKey = paymentRes.data?.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        toast.error('Payment key missing. Please check Razorpay configuration.');
        return;
      }

      const options = {
        key: razorpayKey,
        amount: paymentRes.data.amount,
        currency: paymentRes.data.currency,
        order_id: paymentRes.data.orderId,
        name: 'ABSENCE',
        description: 'T-Shirt Purchase',
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/payments/verify', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              paymentIntentId: paymentRes.data.paymentIntentId,
              orderData,
            });

            clearCart();
            toast.success('Order placed successfully!');
            router.push(`/orders/${verifyRes.data.order._id}`);
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phone,
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: async () => {
            try {
              await api.post('/payments/intent-status', {
                paymentIntentId: paymentRes.data.paymentIntentId,
                status: 'failed',
                failureReason: 'Checkout popup dismissed by user',
              });
            } catch (e) {}
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', async function (response) {
        try {
          await api.post('/payments/intent-status', {
            paymentIntentId: paymentRes.data.paymentIntentId,
            status: 'failed',
            failureReason: response.error?.description || 'Payment failed',
          });
        } catch (e) {}
        toast.error(response.error?.description || 'Payment failed');
      });
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <input
                type="text"
                placeholder="Address Line 1"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                className="md:col-span-2 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <input
                type="text"
                placeholder="Address Line 2"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                className="md:col-span-2 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <input
                type="text"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={`${item.product._id}-${item.size}`} className="flex justify-between text-sm gap-3">
                    <span>{item.product.name} ({item.size}) x {item.quantity}</span>
                    <span>Rs. {item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Apply
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-Rs. {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `Rs. ${shipping.toFixed(2)}`}</span>
                </div>

                {walletBalance > 0 && (
                  <div className="rounded-lg border border-border bg-white p-3 mt-2 space-y-3">
                    <label className="flex items-center justify-between text-sm">
                      <span className="font-semibold">Use Wallet Balance</span>
                      <input
                        type="checkbox"
                        checked={useWallet}
                        onChange={(e) => setUseWallet(e.target.checked)}
                        className="h-4 w-4 accent-black"
                      />
                    </label>

                    <div className="text-xs text-muted">Available: Rs. {walletBalance.toFixed(2)}</div>

                    {useWallet && (
                      <>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setWalletMode('full')}
                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                              walletMode === 'full' ? 'bg-black text-white border-black' : 'bg-white border-border'
                            }`}
                          >
                            Use Full
                          </button>
                          <button
                            type="button"
                            onClick={() => setWalletMode('custom')}
                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                              walletMode === 'custom' ? 'bg-black text-white border-black' : 'bg-white border-border'
                            }`}
                          >
                            Custom Amount
                          </button>
                        </div>

                        {walletMode === 'custom' && (
                          <input
                            type="number"
                            min="0"
                            max={maxWalletUsable}
                            step="0.01"
                            value={walletInput}
                            onChange={(e) => setWalletInput(e.target.value)}
                            placeholder={`Max Rs. ${maxWalletUsable.toFixed(2)}`}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        )}
                      </>
                    )}
                  </div>
                )}

                {walletUsed > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Wallet Used</span>
                    <span>-Rs. {walletUsed.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : total === 0 ? 'Place Order (Wallet)' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
