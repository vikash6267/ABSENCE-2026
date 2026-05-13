'use client';
import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after 1 second
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-2xl p-6 md:flex md:items-center md:justify-between">
          {/* Icon & Content */}
          <div className="flex items-start gap-4 mb-4 md:mb-0 md:flex-1">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                <Cookie size={24} />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">We use cookies 🍪</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                By clicking "Accept All", you consent to our use of cookies.{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline font-semibold">
                  Learn more
                </Link>
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:ml-6">
            <button
              onClick={declineCookies}
              className="px-6 py-2.5 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Decline
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Accept All
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={declineCookies}
            className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
