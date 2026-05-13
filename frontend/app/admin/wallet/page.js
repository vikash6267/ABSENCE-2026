'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Wallet, TrendingUp, Users, DollarSign, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminWallet() {
  const [walletStats, setWalletStats] = useState(null);
  const [referralStats, setReferralStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('wallets');
  const [selectedWallet, setSelectedWallet] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [walletsRes, referralsRes] = await Promise.all([
        api.get('/wallet/admin/all-wallets'),
        api.get('/wallet/admin/all-referrals')
      ]);
      
      setWalletStats(walletsRes.data);
      setReferralStats(referralsRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'credited': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted">Loading wallet data...</div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Wallet & Referral Management</h1>
        <p className="text-muted">Monitor user wallets and referral earnings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <Wallet className="text-accent" size={24} />
            <span className="text-xs text-muted">Total Wallets</span>
          </div>
          <p className="text-2xl font-bold text-text">{walletStats?.totalWallets || 0}</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="text-green-500" size={24} />
            <span className="text-xs text-muted">Total Balance</span>
          </div>
          <p className="text-2xl font-bold text-text">₹{walletStats?.totalBalance?.toFixed(2) || 0}</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-blue-500" size={24} />
            <span className="text-xs text-muted">Total Earned</span>
          </div>
          <p className="text-2xl font-bold text-text">₹{walletStats?.totalEarned?.toFixed(2) || 0}</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="text-purple-500" size={24} />
            <span className="text-xs text-muted">Total Referrals</span>
          </div>
          <p className="text-2xl font-bold text-text">{referralStats?.totalReferrals || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="border-b border-border flex">
          <button
            onClick={() => setActiveTab('wallets')}
            className={`px-6 py-4 font-semibold transition ${
              activeTab === 'wallets'
                ? 'text-accent border-b-2 border-accent'
                : 'text-muted hover:text-text'
            }`}
          >
            User Wallets ({walletStats?.totalWallets || 0})
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-6 py-4 font-semibold transition ${
              activeTab === 'referrals'
                ? 'text-accent border-b-2 border-accent'
                : 'text-muted hover:text-text'
            }`}
          >
            All Referrals ({referralStats?.totalReferrals || 0})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'wallets' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-hover border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text">User</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text">Referral Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text">Balance</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text">Total Earned</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text">Total Spent</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text">Transactions</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {walletStats?.wallets?.map((wallet) => (
                    <tr key={wallet._id} className="border-b border-border hover:bg-hover transition">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-text">{wallet.user?.name}</p>
                          <p className="text-xs text-muted">{wallet.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-mono font-bold">
                          {wallet.user?.referralCode || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-green-600 font-bold">₹{wallet.balance?.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-blue-600 font-semibold">₹{wallet.totalEarned?.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-red-600 font-semibold">₹{wallet.totalSpent?.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted">{wallet.transactions?.length || 0}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedWallet(wallet)}
                          className="p-2 hover:bg-card rounded-lg text-accent transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'referrals' && (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <p className="text-sm text-yellow-700 mb-1">Pending Commission</p>
                  <p className="text-2xl font-bold text-yellow-800">
                    ₹{referralStats?.pendingCommission?.toFixed(2) || 0}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-sm text-green-700 mb-1">Credited Commission</p>
                  <p className="text-2xl font-bold text-green-800">
                    ₹{referralStats?.creditedCommission?.toFixed(2) || 0}
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <p className="text-sm text-red-700 mb-1">Cancelled Commission</p>
                  <p className="text-2xl font-bold text-red-800">
                    ₹{referralStats?.cancelledCommission?.toFixed(2) || 0}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-hover border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text">Referrer</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text">Product</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text">Order</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text">Commission</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralStats?.referrals?.map((referral) => (
                      <tr key={referral._id} className="border-b border-border hover:bg-hover transition">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-semibold text-text">{referral.referrer?.name}</p>
                            <p className="text-xs text-muted">{referral.referrer?.email}</p>
                            <span className="text-xs font-mono text-accent">{referral.referrer?.referralCode}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {referral.product?.images?.[0]?.url && (
                              <img 
                                src={referral.product.images[0].url} 
                                alt="" 
                                className="w-10 h-10 object-cover rounded border border-border"
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium text-text line-clamp-1">
                                {referral.product?.name || 'N/A'}
                              </p>
                              <p className="text-xs text-muted">₹{referral.product?.price}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-mono text-sm text-text">{referral.order?.orderNumber || 'N/A'}</p>
                            <p className="text-xs text-muted">{referral.order?.paymentMethod}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-green-600 font-bold">
                            ₹{referral.commissionAmount?.toFixed(2)} ({referral.commissionPercentage}%)
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(referral.status)}`}>
                            {referral.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-muted">
                            {new Date(referral.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Details Modal */}
      {selectedWallet && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text">{selectedWallet.user?.name}'s Wallet</h2>
                <p className="text-sm text-muted">{selectedWallet.user?.email}</p>
              </div>
              <button
                onClick={() => setSelectedWallet(null)}
                className="p-2 hover:bg-hover rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-sm text-green-700 mb-1">Current Balance</p>
                  <p className="text-2xl font-bold text-green-800">₹{selectedWallet.balance?.toFixed(2)}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-blue-700 mb-1">Total Earned</p>
                  <p className="text-2xl font-bold text-blue-800">₹{selectedWallet.totalEarned?.toFixed(2)}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <p className="text-sm text-red-700 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-red-800">₹{selectedWallet.totalSpent?.toFixed(2)}</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-text mb-4">Transaction History</h3>
              <div className="space-y-3">
                {selectedWallet.transactions?.length === 0 ? (
                  <p className="text-center text-muted py-8">No transactions yet</p>
                ) : (
                  selectedWallet.transactions?.slice().reverse().map((txn, idx) => (
                    <div key={idx} className="bg-hover rounded-xl p-4 border border-border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-text">{txn.description}</p>
                          <p className="text-xs text-muted mt-1">
                            {new Date(txn.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {txn.type === 'credit' ? '+' : '-'}₹{txn.amount?.toFixed(2)}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            txn.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {txn.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
