'use client';
import { useAuthStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Menu,
  X,
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Mail, 
  BarChart3,
  PhoneCall
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user, initAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    initAuth();
    const t = setTimeout(() => setAuthChecked(true), 0);
    return () => clearTimeout(t);
  }, [initAuth]);

  useEffect(() => {
    if (!authChecked) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin' && user.role !== 'superadmin') {
      router.push('/');
    }
  }, [authChecked, user, router]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (!authChecked) {
    return <div className="p-8 text-sm text-muted">Checking admin access...</div>;
  }

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return null;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Tag, label: 'Coupons', href: '/admin/coupons' },
    { icon: PhoneCall, label: 'Payment Prospects', href: '/admin/payment-prospects' },
    { icon: Mail, label: 'Email Marketing', href: '/admin/email' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  ];

  const linkClass = (href) => {
    const isActive = href === '/admin' ? pathname === '/admin' : pathname?.startsWith(href);
    return `flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
      isActive
        ? 'bg-black text-white'
        : 'text-muted hover:bg-hover hover:text-text'
    }`;
  };

  const handleMenuClose = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-40 border-b border-border bg-white">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-lg font-black tracking-wide text-black">ABSENCE Admin</h2>
            <p className="text-xs text-muted">{user?.name || 'Admin'}</p>
          </div>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-black lg:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className="flex w-full">
        {menuOpen && (
          <button
            onClick={handleMenuClose}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            aria-label="Close menu overlay"
          />
        )}

        <aside className={`fixed left-0 top-16 z-50 h-[calc(100vh-64px)] w-72 border-r border-border bg-white transition-transform duration-200 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Management</p>
          </div>
          <nav className="space-y-1 px-3 pb-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleMenuClose}
                className={linkClass(item.href)}
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="w-full min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
