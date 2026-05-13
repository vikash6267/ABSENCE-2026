import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border text-text mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-black mb-4 text-accent">ABSENCE</h3>
            <p className="text-muted">Premium streetwear for those who speak through silence.</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-muted">
              <li><Link href="/shop" className="hover:text-text transition">All Products</Link></li>
              <li><Link href="/shop?category=oversized" className="hover:text-text transition">Oversized</Link></li>
              <li><Link href="/shop?category=printed" className="hover:text-text transition">Printed</Link></li>
              <li><Link href="/shop?gender=men" className="hover:text-text transition">Men</Link></li>
              <li><Link href="/shop?gender=women" className="hover:text-text transition">Women</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-muted">
              <li><Link href="/contact" className="hover:text-text transition">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-text transition">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-text transition">Exchange Policy</Link></li>
              <li><Link href="/faq" className="hover:text-text transition">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-muted">
              <li><Link href="/terms" className="hover:text-text transition">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-text transition">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="mb-4">
              <a 
                href="https://www.instagram.com/wearabsence_/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} />
                <span className="font-semibold">Follow on Instagram</span>
              </a>
            </div>
            <p className="text-sm text-muted">absence.clothiers@gmail.com</p>
            <p className="text-xs text-muted mt-2">Follow us for latest drops & exclusive offers</p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted">
          <p>&copy; 2024 ABSENCE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
