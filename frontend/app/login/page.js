'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { Lock, Mail, Phone, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    phone: '',
    email: '',
    password: '',
  });

  const isLogin = mode === 'login';

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? {
            identifier: formData.identifier,
            password: formData.password,
          }
        : {
            name: formData.name,
            phone: formData.phone,
            email: formData.email || undefined,
            password: formData.password,
          };

      const res = await api.post(endpoint, payload);
      setAuth(res.data, res.data.token);
      toast.success(isLogin ? 'Login successful' : 'Account created successfully');
      router.push('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-4 py-10">
      <div className="pointer-events-none absolute -left-16 top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-12 h-72 w-72 rounded-full bg-black/5 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <div className="grid overflow-hidden rounded-3xl border border-border bg-white shadow-xl lg:grid-cols-2">
          <div className="hidden border-r border-border bg-card/60 p-10 lg:block">
            <p className="text-xs uppercase tracking-[0.25em] text-accent">Absence Auth</p>
            <h1 className="mt-4 text-4xl font-black leading-tight">Streetwear starts with your account.</h1>
            <p className="mt-4 text-sm text-muted">
              Login with email or phone. Signup flow has mandatory phone and optional email as requested.
            </p>
            <div className="mt-8 space-y-3 text-sm">
              <div className="rounded-xl border border-border bg-white p-3">Fast checkout with saved profile</div>
              <div className="rounded-xl border border-border bg-white p-3">Track your orders easily</div>
              <div className="rounded-xl border border-border bg-white p-3">Verified reviews after purchase</div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mb-8 flex rounded-xl border border-border bg-card p-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`w-1/2 rounded-lg py-2 text-sm font-semibold transition ${
                  isLogin ? 'bg-white shadow-sm' : 'text-muted'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`w-1/2 rounded-lg py-2 text-sm font-semibold transition ${
                  !isLogin ? 'bg-white shadow-sm' : 'text-muted'
                }`}
              >
                Signup
              </button>
            </div>

            <h2 className="text-2xl font-black">{isLogin ? 'Welcome Back' : 'Create Your Account'}</h2>
            <p className="mt-1 text-sm text-muted">
              {isLogin ? 'Use phone or email with password' : 'Phone is compulsory, email is optional'}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-3 top-3.5 text-muted" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full rounded-xl border border-border px-10 py-3 outline-none transition focus:border-accent"
                  />
                </div>
              )}

              {isLogin ? (
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-3 top-3.5 text-muted" />
                  <input
                    type="text"
                    required
                    placeholder="Email or Phone Number"
                    value={formData.identifier}
                    onChange={(e) => handleChange('identifier', e.target.value)}
                    className="w-full rounded-xl border border-border px-10 py-3 outline-none transition focus:border-accent"
                  />
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Phone size={16} className="pointer-events-none absolute left-3 top-3.5 text-muted" />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number (Required)"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full rounded-xl border border-border px-10 py-3 outline-none transition focus:border-accent"
                    />
                  </div>
                  <div className="relative">
                    <Mail size={16} className="pointer-events-none absolute left-3 top-3.5 text-muted" />
                    <input
                      type="email"
                      placeholder="Email Address (Optional)"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full rounded-xl border border-border px-10 py-3 outline-none transition focus:border-accent"
                    />
                  </div>
                </>
              )}

              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3 top-3.5 text-muted" />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full rounded-xl border border-border px-10 py-3 outline-none transition focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-gray-800 disabled:bg-gray-400"
              >
                {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
