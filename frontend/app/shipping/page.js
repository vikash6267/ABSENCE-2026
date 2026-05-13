import { Truck, Package, Clock, MapPin, Shield, CreditCard } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Truck className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-black mb-4">Shipping Policy</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Fast, reliable, and secure delivery across India
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
            <Clock className="w-10 h-10 mx-auto mb-3 text-green-600" />
            <h3 className="font-bold mb-2">Delivery Time</h3>
            <p className="text-sm text-gray-700">5-7 Business Days</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
            <Package className="w-10 h-10 mx-auto mb-3 text-blue-600" />
            <h3 className="font-bold mb-2">Free Shipping</h3>
            <p className="text-sm text-gray-700">On Orders Above ₹999</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
            <Shield className="w-10 h-10 mx-auto mb-3 text-purple-600" />
            <h3 className="font-bold mb-2">Secure Packaging</h3>
            <p className="text-sm text-gray-700">Safe & Protected</p>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="text-black" />
              Shipping Locations
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="mb-4">
                We currently ship to all locations across India. International shipping is not available at the moment.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>All major cities and metro areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Tier 2 and Tier 3 cities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Remote and rural areas (may take additional 2-3 days)</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Clock className="text-black" />
              Delivery Timeline
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <div>
                    <h3 className="font-semibold">Metro Cities</h3>
                    <p className="text-sm text-gray-600">Delhi, Mumbai, Bangalore, etc.</p>
                  </div>
                  <span className="font-bold text-green-600">3-5 Days</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b">
                  <div>
                    <h3 className="font-semibold">Other Cities</h3>
                    <p className="text-sm text-gray-600">Tier 2 & 3 cities</p>
                  </div>
                  <span className="font-bold text-blue-600">5-7 Days</span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Remote Areas</h3>
                    <p className="text-sm text-gray-600">Rural and remote locations</p>
                  </div>
                  <span className="font-bold text-orange-600">7-10 Days</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Delivery times are estimates and may vary during peak seasons, festivals, or due to unforeseen circumstances.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="text-black" />
              Shipping Charges
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <div>
                    <h3 className="font-semibold">Orders Above ₹999</h3>
                    <p className="text-sm text-gray-600">Free shipping across India</p>
                  </div>
                  <span className="font-bold text-green-600 text-xl">FREE</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <div>
                    <h3 className="font-semibold">Orders Below ₹999</h3>
                    <p className="text-sm text-gray-600">Standard shipping charges apply</p>
                  </div>
                  <span className="font-bold text-gray-700 text-xl">₹50</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>💡 Pro Tip:</strong> Add items worth ₹999 or more to your cart to enjoy FREE shipping!
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Package className="text-black" />
              Order Processing
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <div>
                    <h3 className="font-semibold mb-1">Order Confirmation</h3>
                    <p className="text-gray-600">You'll receive an email confirmation immediately after placing your order.</p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <div>
                    <h3 className="font-semibold mb-1">Processing Time</h3>
                    <p className="text-gray-600">Orders are processed within 24-48 hours (excluding weekends and holidays).</p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <div>
                    <h3 className="font-semibold mb-1">Dispatch Notification</h3>
                    <p className="text-gray-600">You'll receive a tracking number once your order is dispatched.</p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">4</span>
                  <div>
                    <h3 className="font-semibold mb-1">Delivery</h3>
                    <p className="text-gray-600">Track your order in real-time and receive it at your doorstep.</p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Shield className="text-black" />
              Packaging & Safety
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="mb-4">
                We take extra care to ensure your products reach you in perfect condition:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>Quality Packaging:</strong> Products are packed in sturdy, branded boxes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>Protective Wrapping:</strong> Each item is individually wrapped for protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>Tamper-Proof Sealing:</strong> All packages are sealed to prevent tampering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>Weather Protection:</strong> Waterproof packaging for monsoon season</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="mb-4">
                Track your order easily through multiple channels:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">→</span>
                  <span>Check your email for tracking link</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">→</span>
                  <span>Login to your account and visit "My Orders"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">→</span>
                  <span>Use the tracking number on courier website</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">→</span>
                  <span>Contact our support team for assistance</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Important Notes</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">⚠</span>
                  <span>Please ensure your shipping address is correct before placing the order</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">⚠</span>
                  <span>We are not responsible for delays caused by incorrect addresses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">⚠</span>
                  <span>Orders cannot be redirected once dispatched</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">⚠</span>
                  <span>Please inspect the package before accepting delivery</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Need Help with Shipping?</h2>
            <p className="mb-6 text-gray-300">
              Our customer support team is here to assist you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Contact Support
              </a>
              <a
                href="/faq"
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition"
              >
                View FAQ
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
