'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Menu, X, Search, ChevronDown, LogOut, Settings, Gift } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore, useCartStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showReferralInfo, setShowReferralInfo] = useState(false);
  const { user, logout, initAuth } = useAuthStore();
  const { items, initCart } = useCartStore();

  useEffect(() => {
    initAuth();
    initCart();
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [initAuth, initCart]);

  return (
    <nav className={`sticky top-0 z-[100] transition-all duration-300 ${
      isScrolled 
      ? 'bg-white/95 backdrop-blur-xl border-b border-border py-2 shadow-sm' 
      : 'bg-transparent py-4'
    }`}>
      <div className="border-b border-border/70 bg-accent/10">
        <button
          onClick={() => setShowReferralInfo(true)}
          className="group w-full overflow-hidden py-2.5 text-text hover:text-accent transition"
          aria-label="Open referral earning information"
        >
          <motion.div
            className="flex w-max items-center gap-8"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 16, ease: 'linear', repeat: Infinity }}
          >
            {[...Array(2)].map((_, rowIndex) => (
              <div key={rowIndex} className="flex items-center gap-8 pr-8">
                {[...Array(6)].map((_, itemIndex) => (
                  <span
                    key={`${rowIndex}-${itemIndex}`}
                    className="inline-flex items-center gap-2 whitespace-nowrap text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em]"
                  >
                    <Gift size={13} className="opacity-90" />
                    Share And Earn 5% Of Order Amount
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden">
               <Image 
                src="/logo.png" 
                alt="Absence Logo" 
                fill 
                className="object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-[0.2em] text-text">
              ABSENCE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {['Shop', 'Oversized', 'Printed'].map((item) => (
              <Link 
                key={item}
                href={item === 'Shop' ? '/shop' : `/shop?category=${item.toLowerCase()}`} 
                className="text-sm uppercase tracking-widest font-medium text-muted hover:text-accent transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 md:space-x-5">
            <button className="p-2 text-muted hover:text-text transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>
            
            <Link href="/cart" className="p-2 relative group text-muted hover:text-text transition-colors">
              <ShoppingCart size={20} strokeWidth={1.5} />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-bg text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {items.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-1 p-2 text-muted hover:text-text transition-colors">
                  <User size={20} strokeWidth={1.5} />
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-2xl z-50">
                  <div className="px-4 py-2 border-b border-border mb-2">
                    <p className="text-[10px] text-muted uppercase tracking-tighter">Logged in as</p>
                    <p className="text-sm font-bold truncate">{user.email || user.phone || 'User'}</p>
                  </div>
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-muted hover:bg-hover hover:text-text transition">
                    <User size={16} /> Profile
                  </Link>
                  <Link href="/orders" className="flex items-center gap-3 px-4 py-2 text-sm text-muted hover:bg-hover hover:text-text transition">
                    <ShoppingCart size={16} /> My Orders
                  </Link>
                  {(user.role === 'admin' || user.role === 'superadmin') && (
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-accent hover:bg-hover transition">
                      <Settings size={16} /> Admin Panel
                    </Link>
                  )}
                  <button onClick={logout} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition mt-2">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:block px-6 py-2 bg-text text-bg text-xs font-black uppercase tracking-widest rounded-full hover:bg-accent transition-colors active:scale-95">
                Login
              </Link>
            )}

            {/* Mobile Toggle */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-text">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              {['Shop', 'Oversized', 'Printed'].map((item) => (
                <Link 
                  key={item}
                  onClick={() => setIsOpen(false)}
                  href={item === 'Shop' ? '/shop' : `/shop?category=${item.toLowerCase()}`} 
                  className="block text-2xl font-bold text-text hover:text-accent transition"
                >
                  {item}
                </Link>
              ))}
              {!user && (
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-4 bg-accent text-bg text-center font-black rounded-xl"
                >
                  LOGIN
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReferralInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] bg-black/60 p-4 flex items-center justify-center"
          >
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              className="w-full max-w-xl rounded-2xl bg-white border border-border p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Referral Program</p>
                  <h3 className="mt-1 text-xl font-black text-text">Share Product Link, Earn 5%</h3>
                </div>
                <button
                  onClick={() => setShowReferralInfo(false)}
                  className="p-2 rounded-lg hover:bg-hover text-muted hover:text-text transition"
                  aria-label="Close referral information"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-muted">
                <p>
                  Aap kisi product ka referral link share karte ho. Agar koi customer us link se order place karta hai,
                  to order amount ka 5% aapke wallet me commission ke form me credit hota hai.
                </p>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text mb-2">Example</p>
                  <p>
                    Agar order amount `Rs. 2,000` hai, to aapko `5% = Rs. 100` milega.
                  </p>
                  <p className="mt-1">
                    3 successful orders (2000, 1500, 3000) par total earning `Rs. 325` hogi.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <Link
                  href="/profile/wallet"
                  onClick={() => setShowReferralInfo(false)}
                  className="px-5 py-2.5 rounded-lg bg-accent text-bg font-bold text-sm hover:brightness-95 transition"
                >
                  Open Wallet
                </Link>
                <button
                  onClick={() => setShowReferralInfo(false)}
                  className="px-5 py-2.5 rounded-lg border border-border text-sm font-semibold text-text hover:bg-hover transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
