'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '',
    maxDiscount: '',
    usageLimit: '',
    validFrom: '',
    validUntil: ''
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = () => {
    api.get('/coupons')
      .then((res) => setCoupons(res.data))
      .catch((err) => console.error(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/coupons', formData);
      toast.success('Coupon created!');
      setShowModal(false);
      loadCoupons();
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderValue: '',
        maxDiscount: '',
        usageLimit: '',
        validFrom: '',
        validUntil: ''
      });
    } catch (error) {
      toast.error('Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this coupon?')) {
      try {
        await api.delete(`/coupons/${id}`);
        toast.success('Coupon deleted!');
        loadCoupons();
      } catch (error) {
        toast.error('Failed to delete coupon');
      }
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          <Plus size={20} />
          Add Coupon
        </button>
      </div>

      <div className="overflow-x-auto overflow-y-hidden rounded-lg border bg-white">
        <table className="w-full min-w-[920px]">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Code</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Discount</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Min Order</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Usage</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Valid Until</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id} className="border-b hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 font-medium">{coupon.code}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {coupon.discountType === 'percentage'
                    ? `${coupon.discountValue}%`
                    : `Rs. ${coupon.discountValue}`}
                </td>
                <td className="whitespace-nowrap px-6 py-4">Rs. {coupon.minOrderValue}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {coupon.usedCount} / {coupon.usageLimit || '8'}
                </td>
                <td className="whitespace-nowrap px-6 py-4">{new Date(coupon.validUntil).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs ${
                      coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="rounded p-2 text-red-500 hover:bg-gray-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold">Create Coupon</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Coupon Code (e.g., SAVE20)"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full rounded-lg border px-4 py-2"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border px-4 py-2"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="rounded-lg border px-4 py-2"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
                <input
                  type="number"
                  placeholder="Discount Value"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  className="rounded-lg border px-4 py-2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Min Order Value"
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                  className="rounded-lg border px-4 py-2"
                />
                <input
                  type="number"
                  placeholder="Max Discount (optional)"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  className="rounded-lg border px-4 py-2"
                />
              </div>
              <input
                type="number"
                placeholder="Usage Limit (optional)"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="w-full rounded-lg border px-4 py-2"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm">Valid From</label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full rounded-lg border px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm">Valid Until</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full rounded-lg border px-4 py-2"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border px-4 py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
