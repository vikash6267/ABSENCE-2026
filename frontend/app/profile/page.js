'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { 
  User, MapPin, Package, Wallet, Settings, LogOut, 
  Edit, Trash2, Plus, Check, X, Copy, Share2, Gift 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, initAuth, authInitialized } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!authInitialized) return;

    if (!user) {
      router.replace('/login');
      return;
    }
    loadProfileData();
  }, [authInitialized, user]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const [profileRes, ordersRes, walletRes, codeRes] = await Promise.all([
        api.get('/users/profile'),
        api.get('/orders'),
        api.get('/wallet'),
        api.get('/wallet/referral-code')
      ]);
      
      setProfile(profileRes.data);
      setOrders(ordersRes.data || []);
      setWallet(walletRes.data);
      setReferralCode(codeRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await api.put(`/users/addresses/${editingAddress._id}`, addressForm);
        toast.success('Address updated successfully');
      } else {
        await api.post('/users/addresses', addressForm);
        toast.success('Address added successfully');
      }
      
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressForm({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
      loadProfileData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      await api.delete(`/users/addresses/${addressId}`);
      toast.success('Address deleted successfully');
      loadProfileData();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const editAddress = (address) => {
    setEditingAddress(address);
    setAddressForm(address);
    setShowAddressForm(true);
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode?.referralCode || '');
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!authInitialized || loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-muted">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
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
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border overflow-hidden sticky top-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-6 py-4 transition ${
                  activeTab === 'overview'
                    ? 'bg-accent text-bg'
                    : 'text-text hover:bg-hover'
                }`}
              >
                <User size={20} />
                <span className="font-semibold">Overview</span>
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-6 py-4 transition ${
                  activeTab === 'orders'
                    ? 'bg-accent text-bg'
                    : 'text-text hover:bg-hover'
                }`}
              >
                <Package size={20} />
                <span className="font-semibold">My Orders</span>
                {orders.length > 0 && (
                  <span className="ml-auto bg-bg text-text px-2 py-1 rounded-full text-xs">
                    {orders.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-6 py-4 transition ${
                  activeTab === 'addresses'
                    ? 'bg-accent text-bg'
                    : 'text-text hover:bg-hover'
                }`}
              >
                <MapPin size={20} />
                <span className="font-semibold">Addresses</span>
              </button>
              
              <Link
                href="/profile/wallet"
                className="w-full flex items-center gap-3 px-6 py-4 text-text hover:bg-hover transition"
              >
                <Wallet size={20} />
                <span className="font-semibold">Wallet & Referrals</span>
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Package className="text-blue-500" size={24} />
                      <span className="text-xs text-muted">Total Orders</span>
                    </div>
                    <p className="text-3xl font-bold text-text">{orders.length}</p>
                  </div>

                  <div className="bg-card rounded-2xl border border-border p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Wallet className="text-green-500" size={24} />
                      <span className="text-xs text-muted">Wallet Balance</span>
                    </div>
                    <p className="text-3xl font-bold text-text">₹{wallet?.balance?.toFixed(2) || '0.00'}</p>
                  </div>

                  <div className="bg-card rounded-2xl border border-border p-6">
                    <div className="flex items-center justify-between mb-2">
                      <MapPin className="text-purple-500" size={24} />
                      <span className="text-xs text-muted">Saved Addresses</span>
                    </div>
                    <p className="text-3xl font-bold text-text">{profile?.addresses?.length || 0}</p>
                  </div>
                </div>

                {/* Referral Card */}
                <div className="bg-gradient-to-br from-accent to-yellow-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Gift size={24} />
                    <h2 className="text-xl font-bold">Refer & Earn</h2>
                  </div>
                  <p className="text-white/90 mb-4">Share products and earn 5% commission on every purchase!</p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-white/80 text-sm mb-2">Your Referral Code</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white/30 rounded-lg px-4 py-2 font-mono text-xl font-bold">
                        {referralCode?.referralCode || 'Loading...'}
                      </div>
                      <button
                        onClick={copyReferralCode}
                        className="px-4 py-2 bg-white text-accent font-bold rounded-lg hover:scale-105 transition-transform"
                      >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>
                  <Link
                    href="/profile/wallet"
                    className="mt-4 inline-block px-6 py-2 bg-white text-accent font-bold rounded-lg hover:scale-105 transition-transform"
                  >
                    View Wallet →
                  </Link>
                </div>

                {/* Recent Orders */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-text">Recent Orders</h2>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-accent hover:underline text-sm font-semibold"
                    >
                      View All
                    </button>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package size={48} className="mx-auto text-muted mb-4" />
                      <p className="text-muted">No orders yet</p>
                      <Link
                        href="/shop"
                        className="mt-4 inline-block px-6 py-2 bg-accent text-bg font-bold rounded-lg hover:scale-105 transition-transform"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order._id} className="bg-hover rounded-xl p-4 border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-mono font-semibold text-text">{order.orderNumber}</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                          </div>
                          <p className="text-sm text-muted">
                            {order.items?.length} items • ₹{order.total}
                          </p>
                          <p className="text-xs text-muted mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="text-2xl font-bold text-text mb-6">My Orders</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={64} className="mx-auto text-muted mb-4" />
                    <p className="text-muted text-lg mb-2">No orders yet</p>
                    <p className="text-sm text-muted mb-6">Start shopping to see your orders here</p>
                    <Link
                      href="/shop"
                      className="inline-block px-8 py-3 bg-accent text-bg font-bold rounded-xl hover:scale-105 transition-transform"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-hover rounded-xl p-6 border border-border">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-mono text-lg font-bold text-text">{order.orderNumber}</p>
                            <p className="text-sm text-muted mt-1">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </div>

                        <div className="space-y-3 mb-4">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                              {item.image && (
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-lg border border-border"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-semibold text-text">{item.name}</p>
                                <p className="text-sm text-muted">Size: {item.size} • Qty: {item.quantity}</p>
                              </div>
                              <p className="font-bold text-text">₹{item.price}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div>
                            <p className="text-sm text-muted">Total Amount</p>
                            <p className="text-2xl font-bold text-accent">₹{order.total}</p>
                          </div>
                          <Link
                            href={`/orders/${order.orderNumber}`}
                            className="px-6 py-2 bg-bg border border-border text-text font-semibold rounded-lg hover:bg-hover transition"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-text">Saved Addresses</h2>
                  <button
                    onClick={() => {
                      setShowAddressForm(true);
                      setEditingAddress(null);
                      setAddressForm({
                        name: '',
                        phone: '',
                        addressLine1: '',
                        addressLine2: '',
                        city: '',
                        state: '',
                        pincode: '',
                        isDefault: false
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-bg font-bold rounded-lg hover:scale-105 transition-transform"
                  >
                    <Plus size={20} />
                    Add Address
                  </button>
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddressSubmit} className="bg-hover rounded-xl p-6 border border-border mb-6">
                    <h3 className="text-lg font-bold text-text mb-4">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-text mb-2">Full Name *</label>
                        <input
                          type="text"
                          value={addressForm.name}
                          onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                          className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-text mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-text mb-2">Address Line 1 *</label>
                        <input
                          type="text"
                          value={addressForm.addressLine1}
                          onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                          className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                          placeholder="House No., Building Name"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-text mb-2">Address Line 2</label>
                        <input
                          type="text"
                          value={addressForm.addressLine2}
                          onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                          className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                          placeholder="Road Name, Area, Colony"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-text mb-2">City *</label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-text mb-2">State *</label>
                        <input
                          type="text"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-text mb-2">Pincode *</label>
                        <input
                          type="text"
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                            className="w-5 h-5 accent-accent"
                          />
                          <span className="text-text font-semibold">Set as default address</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddress(null);
                        }}
                        className="flex-1 px-6 py-3 border border-border rounded-lg hover:bg-hover text-text font-semibold transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-accent text-bg font-bold rounded-lg hover:scale-105 transition-transform"
                      >
                        {editingAddress ? 'Update Address' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                )}

                {profile?.addresses?.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin size={64} className="mx-auto text-muted mb-4" />
                    <p className="text-muted text-lg">No addresses saved yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile?.addresses?.map((address) => (
                      <div key={address._id} className="bg-hover rounded-xl p-6 border border-border relative">
                        {address.isDefault && (
                          <span className="absolute top-4 right-4 px-3 py-1 bg-accent text-bg text-xs font-bold rounded-full">
                            Default
                          </span>
                        )}
                        
                        <p className="font-bold text-text text-lg mb-2">{address.name}</p>
                        <p className="text-sm text-muted mb-1">{address.phone}</p>
                        <p className="text-sm text-text">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </p>
                        <p className="text-sm text-text">
                          {address.city}, {address.state} - {address.pincode}
                        </p>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => editAddress(address)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-bg border border-border text-text font-semibold rounded-lg hover:bg-card transition"
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address._id)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
