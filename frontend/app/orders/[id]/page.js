'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { CheckCircle2, Circle, Download, Truck } from 'lucide-react';

const flow = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, initAuth, authInitialized } = useAuthStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!authInitialized) return;

    if (!user || !params?.id) {
      setLoading(false);
      return;
    }

    api
      .get(`/orders/${params.id}`)
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [authInitialized, params?.id, user]);

  if (!authInitialized || loading) {
    return <div className="px-4 py-16 text-center text-muted">Loading order...</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Please login to view order details</h1>
        <button onClick={() => router.push('/login')} className="mt-4 rounded-lg bg-black px-5 py-2.5 text-white">
          Go to Login
        </button>
      </div>
    );
  }

  if (!order) {
    return <div className="px-4 py-16 text-center text-muted">Order not found.</div>;
  }

  const currentStep = flow.indexOf(order.orderStatus);

  const downloadInvoice = async () => {
    if (!order?._id) return;
    setDownloadingInvoice(true);
    try {
      const res = await api.get(`/orders/invoice/${order._id}`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${order.orderNumber || 'invoice'}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloadingInvoice(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Order Number</p>
            <h1 className="text-2xl font-black">{order.orderNumber}</h1>
            <p className="text-sm text-muted">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted">Payment</p>
            <p className="font-semibold capitalize">{order.paymentStatus}</p>
            <p className="mt-1 text-xl font-black text-accent">Rs. {order.total}</p>
            <button
              onClick={downloadInvoice}
              disabled={downloadingInvoice}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:border-accent disabled:opacity-60"
            >
              <Download size={14} />
              {downloadingInvoice ? 'Downloading...' : 'Download Invoice'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-white p-5">
        <h2 className="text-xl font-bold">Order Tracking</h2>
        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-5">
          {flow.map((step, idx) => {
            const done = idx <= currentStep;
            return (
              <div key={step} className={`rounded-xl border p-3 ${done ? 'border-green-300 bg-green-50' : 'border-border bg-card/50'}`}>
                <div className="mb-1 flex items-center gap-2">
                  {done ? <CheckCircle2 size={16} className="text-green-600" /> : <Circle size={16} className="text-muted" />}
                  <p className="text-sm font-semibold capitalize">{step}</p>
                </div>
                {step === 'shipped' && order.trackingNumber && (
                  <p className="text-xs text-muted">Tracking: {order.trackingNumber}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-white p-5">
          <h2 className="text-xl font-bold">Items</h2>
          <div className="mt-4 space-y-3">
            {order.items.map((item, idx) => (
              <div key={`${item.product}-${idx}`} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                <div className="flex items-center gap-3">
                  <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted">
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-bold">Rs. {item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="text-xl font-bold">Shipping</h2>
          <div className="mt-4 text-sm text-muted">
            <p className="font-semibold text-text">{order.shippingAddress?.name}</p>
            <p>{order.shippingAddress?.phone}</p>
            <p>{order.shippingAddress?.addressLine1}</p>
            {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </p>
          </div>

          <div className="mt-5 border-t border-border pt-4 text-sm">
            <div className="mb-1 flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>Rs. {order.subtotal}</span>
            </div>
            <div className="mb-1 flex justify-between">
              <span className="text-muted">Discount</span>
              <span>-Rs. {order.discount || 0}</span>
            </div>
            <div className="mb-1 flex justify-between">
              <span className="text-muted">Shipping</span>
              <span>Rs. {order.shippingCost || 0}</span>
            </div>
            {Number(order.walletUsed || 0) > 0 && (
              <div className="mb-1 flex justify-between text-blue-600">
                <span>Wallet Used</span>
                <span>-Rs. {Number(order.walletUsed || 0).toFixed(2)}</span>
              </div>
            )}
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-bold">
              <span>Total</span>
              <span>Rs. {order.total}</span>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="mt-4 rounded-lg border border-border bg-card p-3 text-sm">
              <div className="flex items-center gap-2 font-semibold">
                <Truck size={14} />
                Tracking Number
              </div>
              <p className="mt-1">{order.trackingNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
