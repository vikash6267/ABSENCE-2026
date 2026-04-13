'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function OrdersPage() {
  const router = useRouter();
  const { user, initAuth } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    api
      .get('/orders')
      .then((res) => {
        setOrders(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Please login to view your orders</h1>
        <button
          onClick={() => router.push('/login')}
          className="mt-4 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="px-4 py-16 text-center text-muted">Loading orders...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-black">My Orders</h1>
      <p className="mt-1 text-sm text-muted">Track your order status with order number.</p>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border bg-white p-10 text-center text-muted">No orders yet.</div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="block rounded-2xl border border-border bg-white p-4 transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-accent">Order Number</p>
                  <p className="text-lg font-black">{order.orderNumber}</p>
                  <p className="text-sm text-muted">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted">Status</p>
                  <p className="font-semibold capitalize">{order.orderStatus}</p>
                  <p className="mt-1 font-bold text-accent">Rs. {order.total}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
