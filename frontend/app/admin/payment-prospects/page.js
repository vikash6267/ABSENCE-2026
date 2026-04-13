'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ChevronDown, ChevronUp } from 'lucide-react';

const statusColors = {
  clicked: 'bg-yellow-100 text-yellow-800',
  gateway_order_created: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

export default function PaymentProspectsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [segment, setSegment] = useState('follow_up');
  const [openId, setOpenId] = useState('');
  const [summary, setSummary] = useState({ total: 0, converted: 0, followUp: 0 });

  useEffect(() => {
    setLoading(true);
    api
      .get(`/payments/payment-prospects?segment=${segment}`)
      .then((res) => {
        setRecords(res.data?.records || []);
        setSummary(res.data?.summary || { total: 0, converted: 0, followUp: 0 });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [segment]);

  if (loading) {
    return <div className="text-muted">Loading payment prospects...</div>;
  }

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Payment Prospects</h1>
      <p className="mb-4 text-sm text-muted">
        Pay-click records with complete breakdown. Converted users are separated to avoid duplicate follow-up calls.
      </p>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setSegment('follow_up')}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            segment === 'follow_up' ? 'bg-black text-white' : 'bg-white border border-border'
          }`}
        >
          Follow-up ({summary.followUp})
        </button>
        <button
          onClick={() => setSegment('converted')}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            segment === 'converted' ? 'bg-black text-white' : 'bg-white border border-border'
          }`}
        >
          Converted ({summary.converted})
        </button>
        <button
          onClick={() => setSegment('all')}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            segment === 'all' ? 'bg-black text-white' : 'bg-white border border-border'
          }`}
        >
          All ({summary.total})
        </button>
      </div>

      <div className="space-y-3">
        {records.map((record) => {
          const isOpen = openId === record._id;
          return (
            <div key={record._id} className="overflow-hidden rounded-2xl border bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-xs text-muted">{new Date(record.createdAt).toLocaleString()}</p>
                  <p className="font-semibold">{record.customer?.name || record.user?.name || '-'}</p>
                  <p className="text-sm text-muted">
                    {record.customer?.phone || record.user?.phone || '-'} | {record.customer?.email || record.user?.email || '-'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent">Rs. {record.total || record.amount}</p>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColors[record.status] || 'bg-gray-100 text-gray-800'}`}>
                    {record.status.replaceAll('_', ' ')}
                  </span>
                </div>
                <button
                  onClick={() => setOpenId(isOpen ? '' : record._id)}
                  className="rounded-lg border border-border px-3 py-2 text-sm"
                >
                  {isOpen ? (
                    <span className="inline-flex items-center gap-1">
                      Hide <ChevronUp size={14} />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      Details <ChevronDown size={14} />
                    </span>
                  )}
                </button>
              </div>

              {isOpen && (
                <div className="border-t bg-card/40 p-4 text-sm">
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="rounded-lg border bg-white p-3">
                      <p className="mb-1 font-semibold">Address</p>
                      <p>{record.shippingAddress?.name || '-'}</p>
                      <p>{record.shippingAddress?.phone || '-'}</p>
                      <p>{record.shippingAddress?.addressLine1 || '-'}</p>
                      {record.shippingAddress?.addressLine2 && <p>{record.shippingAddress.addressLine2}</p>}
                      <p>
                        {record.shippingAddress?.city || '-'}, {record.shippingAddress?.state || '-'} -{' '}
                        {record.shippingAddress?.pincode || '-'}
                      </p>
                    </div>

                    <div className="rounded-lg border bg-white p-3">
                      <p className="mb-1 font-semibold">Amount Breakdown</p>
                      <div className="flex justify-between">
                        <span className="text-muted">Subtotal</span>
                        <span>Rs. {record.subtotal ?? '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Discount</span>
                        <span>- Rs. {record.discount ?? 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Shipping</span>
                        <span>Rs. {record.shippingCost ?? 0}</span>
                      </div>
                      {record.couponUsed?.code && (
                        <div className="flex justify-between">
                          <span className="text-muted">Coupon</span>
                          <span>{record.couponUsed.code}</span>
                        </div>
                      )}
                      <div className="mt-1 flex justify-between border-t pt-1 font-bold">
                        <span>Total</span>
                        <span>Rs. {record.total ?? record.amount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg border bg-white p-3">
                    <p className="mb-2 font-semibold">Items</p>
                    {(record.items || []).length === 0 ? (
                      <p className="text-muted">No items found.</p>
                    ) : (
                      <div className="space-y-2">
                        {record.items.map((item, idx) => (
                          <div key={`${item.name}-${idx}`} className="flex items-center justify-between border-b pb-2">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted">
                                Size: {item.size} | Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold">Rs. {(item.price || 0) * (item.quantity || 0)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-white p-3">
                    <p>
                      Linked Order:{' '}
                      {record.order?.orderNumber ? (
                        <span className="font-semibold text-green-700">{record.order.orderNumber}</span>
                      ) : (
                        <span className="text-muted">Not created</span>
                      )}
                    </p>
                    {record.failureReason && <p className="text-red-600">Reason: {record.failureReason}</p>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
