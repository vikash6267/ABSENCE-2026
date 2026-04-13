'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Download } from 'lucide-react';

export default function AdminAnalytics() {
  const [salesData, setSalesData] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadSalesData();
  }, [dateRange]);

  const loadSalesData = () => {
    api.get('/analytics/sales', { params: dateRange })
      .then((res) => setSalesData(res.data))
      .catch((err) => console.error(err));
  };

  if (!salesData) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sales Analytics</h1>
        <button className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800">
          <Download size={20} />
          Export Report
        </button>
      </div>

      <div className="mb-6 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Date Range</h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="mb-1 block text-sm">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="rounded-lg border px-4 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="rounded-lg border px-4 py-2"
            />
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-2 text-gray-600">Total Sales</h3>
          <p className="text-3xl font-bold">Rs. {salesData.totalSales.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-2 text-gray-600">Total Orders</h3>
          <p className="text-3xl font-bold">{salesData.count}</p>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-2 text-gray-600">Average Order Value</h3>
          <p className="text-3xl font-bold">
            Rs. {salesData.count > 0 ? Math.round(salesData.totalSales / salesData.count) : 0}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-hidden rounded-lg border bg-white">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">Sales Details</h2>
        </div>
        <table className="w-full min-w-[760px]">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Order #</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Customer</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {salesData.sales.map((sale) => (
              <tr key={sale._id} className="border-b hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 font-medium">{sale.orderNumber}</td>
                <td className="px-6 py-4">{sale.user?.name}</td>
                <td className="whitespace-nowrap px-6 py-4">Rs. {sale.total}</td>
                <td className="whitespace-nowrap px-6 py-4">{new Date(sale.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
