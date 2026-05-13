'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import {
  User,
  MapPin,
  Package,
  Wallet,
  TrendingUp,
  Share2,
  Copy,
  Check,
  Gift,
  Clock,
  LogOut,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserWallet() {
  const router = useRouter();
  const { user, logout, initAuth, authInitialized } = useAuthStore();
  const [wallet, setWallet] = useState(null);
  const [referralStats, setReferralStats] = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!authInitialized) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    loadWalletData();
  }, [authInitialized, user]);

  const loadWalletData = async () => {
    setLoading(true);
    try {
      const [walletRes, referralRes, codeRes] = await Promise.all([
        api.get('/wallet'),
        api.get('/wallet/referrals'),
        api.get('/wallet/referral-code'),
      ]);

      setWallet(walletRes.data);
      setReferralStats(referralRes.data);
      setReferralCode(codeRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode?.referralCode || '');
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferralLink = async (productSlug = 'skull-butterfly-oversized-unisex-tshirt-red') => {
    const link = `${window.location.origin}/product/${productSlug}?ref=${user._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out ABSENCE Streetwear!',
          text: "Use my referral link to shop premium streetwear. I'll earn 5% commission!",
          url: link,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(link);
      toast.success('Referral link copied!');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'credited':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!authInitialized || loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-muted">Loading wallet...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl border border-border p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-bg text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text">{user?.name}</h1>
                <p className="text-muted">{user?.email}</p>
                {user?.phone && <p className="text-sm text-muted">{user.phone}</p>}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border overflow-hidden sticky top-4">
              <Link href="/profile" className="w-full flex items-center gap-3 px-6 py-4 text-text hover:bg-hover transition">
                <User size={20} />
                <span className="font-semibold">Overview</span>
              </Link>
              <Link href="/profile" className="w-full flex items-center gap-3 px-6 py-4 text-text hover:bg-hover transition">
                <Package size={20} />
                <span className="font-semibold">My Orders</span>
              </Link>
              <Link href="/profile" className="w-full flex items-center gap-3 px-6 py-4 text-text hover:bg-hover transition">
                <MapPin size={20} />
                <span className="font-semibold">Addresses</span>
              </Link>
              <div className="w-full flex items-center gap-3 px-6 py-4 bg-accent text-bg">
                <Wallet size={20} />
                <span className="font-semibold">Wallet & Referrals</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-text mb-2">My Wallet</h2>
              <p className="text-muted">Manage your earnings and referrals</p>
            </div>

            <div className="bg-gradient-to-br from-accent to-yellow-600 rounded-2xl p-8 text-white mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/80 text-sm mb-1">Available Balance</p>
                  <p className="text-5xl font-black">Rs. {wallet?.balance?.toFixed(2) || '0.00'}</p>
                </div>
                <Wallet size={48} className="text-white/30" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white/80 text-xs mb-1">Total Earned</p>
                  <p className="text-2xl font-bold">Rs. {wallet?.totalEarned?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white/80 text-xs mb-1">Total Spent</p>
                  <p className="text-2xl font-bold">Rs. {wallet?.totalSpent?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="text-accent" size={24} />
                <h2 className="text-xl font-bold text-text">Your Referral Code</h2>
              </div>

              <div className="bg-hover rounded-xl p-4 mb-4">
                <p className="text-sm text-muted mb-2">Share this code and earn 5% commission on every purchase!</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-bg border border-border rounded-lg px-4 py-3 font-mono text-2xl font-bold text-accent">
                    {referralCode?.referralCode || 'Loading...'}
                  </div>
                  <button
                    onClick={copyReferralCode}
                    className="px-6 py-3 bg-accent text-bg font-bold rounded-lg hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => shareReferralLink()}
                className="w-full px-6 py-3 bg-bg border border-border text-text font-semibold rounded-lg hover:bg-hover transition flex items-center justify-center gap-2"
              >
                <Share2 size={20} />
                Share Product Link
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="text-blue-500" size={24} />
                  <span className="text-xs text-muted">Total Referrals</span>
                </div>
                <p className="text-3xl font-bold text-text">{referralStats?.totalReferrals || 0}</p>
                <p className="text-sm text-muted mt-1">Products referred</p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="text-yellow-500" size={24} />
                  <span className="text-xs text-muted">Pending</span>
                </div>
                <p className="text-3xl font-bold text-text">Rs. {referralStats?.pendingCommission?.toFixed(2) || '0.00'}</p>
                <p className="text-sm text-muted mt-1">Awaiting delivery</p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <Check className="text-green-500" size={24} />
                  <span className="text-xs text-muted">Earned</span>
                </div>
                <p className="text-3xl font-bold text-text">Rs. {referralStats?.totalEarned?.toFixed(2) || '0.00'}</p>
                <p className="text-sm text-muted mt-1">Total credited</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="border-b border-border flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 font-semibold transition ${
                    activeTab === 'overview' ? 'text-accent border-b-2 border-accent' : 'text-muted hover:text-text'
                  }`}
                >
                  Transactions
                </button>
                <button
                  onClick={() => setActiveTab('referrals')}
                  className={`px-6 py-4 font-semibold transition ${
                    activeTab === 'referrals' ? 'text-accent border-b-2 border-accent' : 'text-muted hover:text-text'
                  }`}
                >
                  My Referrals
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-3">
                    {wallet?.transactions?.length === 0 ? (
                      <div className="text-center py-12">
                        <Wallet size={48} className="mx-auto text-muted mb-4" />
                        <p className="text-muted">No transactions yet</p>
                        <p className="text-sm text-muted mt-2">Start referring products to earn commission!</p>
                      </div>
                    ) : (
                      wallet?.transactions?.slice().reverse().map((txn, idx) => (
                        <div key={idx} className="bg-hover rounded-xl p-4 border border-border">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-text">{txn.description}</p>
                              <p className="text-xs text-muted mt-1">{new Date(txn.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className={`text-xl font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                {txn.type === 'credit' ? '+' : '-'}Rs. {txn.amount?.toFixed(2)}
                              </p>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  txn.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {txn.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'referrals' && (
                  <div className="space-y-3">
                    {referralStats?.referrals?.length === 0 ? (
                      <div className="text-center py-12">
                        <Share2 size={48} className="mx-auto text-muted mb-4" />
                        <p className="text-muted">No referrals yet</p>
                        <p className="text-sm text-muted mt-2">Share product links to start earning!</p>
                      </div>
                    ) : (
                      referralStats?.referrals?.map((referral) => (
                        <div key={referral._id} className="bg-hover rounded-xl p-4 border border-border">
                          <div className="flex items-start gap-4">
                            {referral.product?.images?.[0]?.url && (
                              <img
                                src={referral.product.images[0].url}
                                alt=""
                                className="w-16 h-16 object-cover rounded-lg border border-border"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-semibold text-text">{referral.product?.name || 'Product'}</p>
                              <p className="text-sm text-muted mt-1">
                                Order: {referral.order?.orderNumber} | {referral.order?.paymentMethod}
                              </p>
                              <p className="text-xs text-muted mt-1">{new Date(referral.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">+Rs. {referral.commissionAmount?.toFixed(2)}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(referral.status)}`}>
                                {referral.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
