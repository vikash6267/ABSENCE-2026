'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Download, X } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    api
      .get('/orders')
      .then((res) => setOrders(res.data || []))
      .catch((err) => console.error(err));
  };

  const updateStatus = async (orderId, status, note = '') => {
    try {
      await api.put(`/orders/${orderId}/status`, { status, note });
      toast.success('Order status updated');
      loadOrders();
      setSelectedOrder(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatMoney = (value) => {
    const num = Number(value || 0);
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const downloadInvoice = async (order) => {
    if (!order) return;
    try {
      const res = await api.get(`/orders/invoice/${order._id}`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${order.orderNumber || 'invoice'}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Orders</h1>

      <div className="overflow-x-auto overflow-y-hidden rounded-lg border bg-white">
        <table className="w-full min-w-[920px]">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Order #</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Customer</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Total</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Payment</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Date</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 font-medium">{order.orderNumber}</td>
                <td className="px-6 py-4">{order.user?.name}</td>
                <td className="whitespace-nowrap px-6 py-4">Rs. {order.total}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <button onClick={() => setSelectedOrder(order)} className="whitespace-nowrap text-blue-600 hover:underline">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[300] flex items-start justify-center bg-black/60 p-4 pt-16">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white/95 px-6 py-4 backdrop-blur">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent">Order Detail</p>
                <h2 className="text-3xl font-black">Order {selectedOrder.orderNumber}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadInvoice(selectedOrder)}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:border-accent"
                >
                  <Download size={16} />
                  Download Invoice
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg border border-border p-2 hover:bg-card"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-4 p-6">

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-lg border bg-gray-50 p-3 text-sm">
                  <p className="text-gray-500">Payment Status</p>
                  <p className="font-semibold capitalize">{selectedOrder.paymentStatus || '-'}</p>
                </div>
                <div className="rounded-lg border bg-gray-50 p-3 text-sm">
                  <p className="text-gray-500">Order Status</p>
                  <p className="font-semibold capitalize">{selectedOrder.orderStatus || '-'}</p>
                </div>
                <div className="rounded-lg border bg-gray-50 p-3 text-sm">
                  <p className="text-gray-500">Created At</p>
                  <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-gray-50 p-3 text-sm">
                  <p className="text-gray-500">Tracking Number</p>
                  <p className="font-semibold">{selectedOrder.trackingNumber || '-'}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Items</h3>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 border-b py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || 'https://via.placeholder.com/80x80?text=IMG'}
                        alt={item.name}
                        className="h-12 w-12 rounded-lg border object-cover"
                      />
                      <div>
                        <p>{item.name}</p>
                        <p className="text-gray-500">
                          Size: {item.size} | Qty: {item.quantity} | Unit: Rs. {formatMoney(item.price)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold">Rs. {formatMoney(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Pricing Details</h3>
                <div className="space-y-2 rounded-lg border p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>Rs. {formatMoney(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-700">- Rs. {formatMoney(selectedOrder.discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Rs. {formatMoney(selectedOrder.shippingCost)}</span>
                  </div>
                  {selectedOrder.couponUsed?.code && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coupon</span>
                      <span className="font-semibold">
                        {selectedOrder.couponUsed.code} (- Rs. {formatMoney(selectedOrder.couponUsed.discount)})
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 text-base font-bold">
                    <span>Total</span>
                    <span>Rs. {formatMoney(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Shipping Address</h3>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shippingAddress?.name}
                  <br />
                  {selectedOrder.shippingAddress?.addressLine1}
                  <br />
                  {selectedOrder.shippingAddress?.addressLine2 && (
                    <>
                      {selectedOrder.shippingAddress.addressLine2}
                      <br />
                    </>
                  )}
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} -{' '}
                  {selectedOrder.shippingAddress?.pincode}
                  <br />
                  Phone: {selectedOrder.shippingAddress?.phone}
                </p>
              </div>

              {(selectedOrder.razorpayOrderId || selectedOrder.razorpayPaymentId) && (
                <div>
                  <h3 className="mb-2 font-semibold">Payment Gateway IDs</h3>
                  <div className="space-y-1 break-all rounded-lg border p-3 text-xs">
                    {selectedOrder.razorpayOrderId && (
                      <p>
                        <span className="text-gray-500">Razorpay Order ID:</span> {selectedOrder.razorpayOrderId}
                      </p>
                    )}
                    {selectedOrder.razorpayPaymentId && (
                      <p>
                        <span className="text-gray-500">Razorpay Payment ID:</span> {selectedOrder.razorpayPaymentId}
                      </p>
                    )}
                    {selectedOrder.razorpaySignature && (
                      <p>
                        <span className="text-gray-500">Signature:</span> {selectedOrder.razorpaySignature}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {Array.isArray(selectedOrder.statusHistory) && selectedOrder.statusHistory.length > 0 && (
                <div>
                  <h3 className="mb-2 font-semibold">Status History</h3>
                  <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border p-3">
                    {selectedOrder.statusHistory.map((entry, idx) => (
                      <div key={`${entry.status}-${idx}`} className="border-b pb-1 text-sm last:border-b-0">
                        <p className="font-medium capitalize">{entry.status}</p>
                        <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                        {entry.note && <p className="text-xs text-gray-600">{entry.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-2 font-semibold">Update Status</h3>
                <div className="mb-3 flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Current Status:</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(selectedOrder.orderStatus)}`}>
                    {selectedOrder.orderStatus || 'pending'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selectedOrder._id, status)}
                      disabled={selectedOrder.orderStatus === status}
                      className={`rounded-lg px-4 py-2 capitalize transition ${
                        selectedOrder.orderStatus === status
                          ? 'bg-black text-white cursor-not-allowed'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                      {selectedOrder.orderStatus === status ? ' (Current)' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
