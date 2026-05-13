'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { Lock, Mail, Phone, User, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

/* ==============================================
  ANIMATED BACKGROUND COMPONENT (High-End Mesh)
  ==============================================
*/
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#0a0a0a]">
      {/* Dynamic Mesh Grid Animation */}
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="meshPattern" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#meshPattern)" />
      </svg>

      {/* Subtle Floating Elements (T-shirts & Geometrics) */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute opacity-10"
          style={{
            left: `${Math.random() * 110 - 5}%`,
            top: `${Math.random() * 110 - 5}%`,
            filter: 'blur(2px)',
          }}
          animate={{
            y: [0, -50 * Math.random(), 0],
            x: [0, 30 * Math.random(), 0],
            rotate: [0, 180 * Math.random(), 360 * Math.random()],
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Streetwear Aesthetic Elements */}
          {i % 3 === 0 ? (
            // Minimalist T-shirt Icon Shape
            <svg width="40" height="40" viewBox="0 0 100 100" fill="white">
              <path d="M 20 10 L 80 10 L 85 40 L 70 40 L 70 90 L 30 90 L 30 40 L 15 40 Z" opacity="0.6"/>
            </svg>
          ) : (
            // Abstract Geometric Cross/Plus
            <div className="w-8 h-8 flex items-center justify-center">
              <div className="absolute w-px h-8 bg-white opacity-60" />
              <div className="absolute w-8 h-px bg-white opacity-60" />
            </div>
          )}
        </motion.div>
      ))}

      {/* Abstract Gradients for Depth */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-[#222] rounded-full blur-[150px] opacity-40" />
        <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-[#333] rounded-full blur-[150px] opacity-30" />
      </div>
    </div>
  );
};

/* ==============================================
  LOGIN PAGE COMPONENT
  ==============================================
*/
export default function LoginPage() {
  const router = useRouter();
  const { setAuth, user, initAuth, authInitialized } = useAuthStore();
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    phone: '',
    email: '',
    password: '',
  });

  const isLogin = mode === 'login';

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!authInitialized) return;
    if (user) {
      router.replace('/profile');
    }
  }, [authInitialized, user, router]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? { identifier: formData.identifier, password: formData.password }
        : { 
            name: formData.name, 
            phone: formData.phone, 
            email: formData.email || undefined, 
            password: formData.password 
          };

      const res = await api.post(endpoint, payload);
      setAuth(res.data, res.data.token);
      toast.success(isLogin ? 'Welcome back.' : 'Account created.');
      router.push('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 selection:bg-black selection:text-white font-sans antialiased overflow-hidden">
      
      {/* 3D Animated Mesh Background */}
      <AnimatedBackground />

      {/* Content Wrapper (Z-index ensures it's above background) */}
      <div className="relative z-10 w-full max-w-[1000px] my-auto">
        <div className="grid lg:grid-cols-2 bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-[0_32px_80px_-15px_rgba(0,0,0,0.5)] border border-neutral-100/50">
          
          {/* Left Side: Brand Identity (Black Panel) */}
          <div className="hidden lg:flex flex-col justify-between p-12 bg-black text-white relative overflow-hidden">
            {/* Dark background pattern */}
            <div className="absolute inset-0 z-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="darkMesh" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#darkMesh)" />
              </svg>
            </div>

            <div className="relative z-10">
              <h1 className="text-3xl font-bold tracking-tighter italic">ABSENCE</h1>
              <div className="mt-24">
                <h2 className="text-5xl font-light leading-[1.1] tracking-tight">
                  The art of <br />
                  <span className="font-bold">being away.</span>
                </h2>
                <p className="mt-6 text-neutral-400 text-sm max-w-xs leading-relaxed">
                  Join our collective for early access to drops, exclusive archives, and seamless street-ready logistics.
                </p>
              </div>
            </div>

            <div className="space-y-4 relative z-10 pt-16">
              {['Fast Global Shipping', 'Secure Encrypted Auth', 'Curated Collections'].map((text) => (
                <div key={text} className="flex items-center gap-3 text-xs font-medium tracking-widest uppercase opacity-70">
                  <div className="h-px w-4 bg-white" /> {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Auth Form (White Panel) */}
          <div className="p-8 sm:p-14">
            <div className="flex flex-col h-full">
              {/* Toggle Switch */}
              <div className="flex bg-neutral-100 p-1 rounded-full mb-10 relative">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 relative z-10 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isLogin ? 'text-black' : 'text-neutral-500'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 relative z-10 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${!isLogin ? 'text-black' : 'text-neutral-500'}`}
                >
                  Signup
                </button>
                <motion.div
                  className="absolute inset-y-1 bg-white rounded-full shadow-sm"
                  initial={false}
                  animate={{ 
                    x: isLogin ? '4px' : 'calc(100% - 4px)',
                    left: isLogin ? '0%' : '-50%',
                    width: 'calc(50% - 4px)'
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              </div>

              <div className="mb-8">
                <AnimatePresence mode="wait">
                  <motion.h3 
                    key={isLogin ? 'welcome' : 'join'}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl font-bold tracking-tight text-black"
                  >
                    {isLogin ? 'Welcome Back' : 'Join the Collective'}
                  </motion.h3>
                </AnimatePresence>
                <p className="text-neutral-500 text-sm mt-1">
                  {isLogin ? 'Enter your credentials to access your profile.' : 'Create an account to start your journey.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {!isLogin && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="relative"
                    >
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        required
                        placeholder="FULL NAME"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-neutral-400 placeholder:text-xs placeholder:font-bold placeholder:uppercase"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  {isLogin ? (
                    <>
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        required
                        placeholder="EMAIL OR PHONE"
                        value={formData.identifier}
                        onChange={(e) => handleChange('identifier', e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-neutral-400 placeholder:text-xs placeholder:font-bold placeholder:uppercase"
                      />
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="tel"
                          required
                          placeholder="PHONE NUMBER"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-neutral-400 placeholder:text-xs placeholder:font-bold placeholder:uppercase"
                        />
                      </div>
                      <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="email"
                          placeholder="EMAIL (OPTIONAL)"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-neutral-400 placeholder:text-xs placeholder:font-bold placeholder:uppercase"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Password Input with Toggle */}
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="PASSWORD"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl pl-12 pr-12 py-4 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-neutral-400 placeholder:text-xs placeholder:font-bold placeholder:uppercase"
                  />
                  {/* Eye Icon Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-black transition-colors rounded-lg"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={showPassword ? 'eyeOff' : 'eyeOn'}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </motion.div>
                    </AnimatePresence>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full bg-black text-white rounded-2xl py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed overflow-hidden active:scale-[0.98]"
                >
                  <span className={`flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 size={20} className="animate-spin text-white" />
                    </div>
                  )}
                </button>
              </form>
              
              <p className="mt-auto pt-10 text-center text-[10px] text-neutral-400 uppercase tracking-widest">
                © {new Date().getFullYear()} Absence Studio. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
