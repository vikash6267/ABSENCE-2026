import { RotateCcw, CheckCircle, XCircle, Clock, Package, RefreshCw } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RefreshCw className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-black mb-4">Exchange Policy</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Easy exchange within 7 days of delivery - No refunds, only exchanges
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Important Notice */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-2xl p-6 mb-12">
          <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center gap-2">
            <XCircle className="w-6 h-6" />
            Important: No Refunds Policy
          </h3>
          <p className="text-gray-800 font-semibold mb-2">
            We do NOT offer refunds or money back. Only product exchanges are available.
          </p>
          <p className="text-gray-700">
            If you're not satisfied with your purchase, you can exchange it for a different size or product within 7 days of delivery.
          </p>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
            <Clock className="w-10 h-10 mx-auto mb-3 text-blue-600" />
            <h3 className="font-bold mb-2">7 Days Exchange</h3>
            <p className="text-sm text-gray-700">From delivery date</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
            <Package className="w-10 h-10 mx-auto mb-3 text-green-600" />
            <h3 className="font-bold mb-2">Free Pickup</h3>
            <p className="text-sm text-gray-700">We'll collect from you</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
            <RefreshCw className="w-10 h-10 mx-auto mb-3 text-purple-600" />
            <h3 className="font-bold mb-2">Product Exchange</h3>
            <p className="text-sm text-gray-700">Different size or product</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Exchange Eligibility */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-600" />
              Exchange Eligibility
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="mb-4 font-semibold">
                You can exchange products within 7 days of delivery if:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Product is unused, unwashed, and in original condition</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>All original tags and labels are intact</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Product is in original packaging</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>You have the original invoice/receipt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Product has manufacturing defects or quality issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Wrong product or size was delivered</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Product is damaged during transit</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Non-Exchangeable Items */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <XCircle className="text-red-600" />
              Non-Exchangeable Items
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="mb-4 font-semibold text-red-800">
                The following items cannot be exchanged:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>Products that have been worn, washed, or altered</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>Products with removed or damaged tags</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>Products with stains, odors, or signs of use</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>Sale or clearance items (unless defective)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>Customized or personalized products</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>Products returned after 7 days of delivery</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Exchange Process */}
          <section>
            <h2 className="text-2xl font-bold mb-4">How to Exchange</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <ol className="space-y-6">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">1</span>
                  <div>
                    <h3 className="font-semibold mb-2">Initiate Exchange Request</h3>
                    <p className="text-gray-600 mb-2">Login to your account and go to "My Orders"</p>
                    <p className="text-gray-600">Click on "Exchange" button next to the product you want to exchange</p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">2</span>
                  <div>
                    <h3 className="font-semibold mb-2">Select Exchange Reason & Product</h3>
                    <p className="text-gray-600 mb-2">Choose the reason for exchange (wrong size, defect, etc.)</p>
                    <p className="text-gray-600">Select the new size or product you want</p>
                    <p className="text-gray-600">Add photos if the product is damaged or defective</p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">3</span>
                  <div>
                    <h3 className="font-semibold mb-2">Schedule Pickup</h3>
                    <p className="text-gray-600 mb-2">Our team will contact you within 24 hours</p>
                    <p className="text-gray-600">Schedule a convenient pickup time</p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">4</span>
                  <div>
                    <h3 className="font-semibold mb-2">Pack the Product</h3>
                    <p className="text-gray-600 mb-2">Pack the product in original packaging with all tags</p>
                    <p className="text-gray-600">Include the invoice/receipt in the package</p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">5</span>
                  <div>
                    <h3 className="font-semibold mb-2">Handover to Courier</h3>
                    <p className="text-gray-600 mb-2">Our courier partner will collect the package</p>
                    <p className="text-gray-600">Get the pickup receipt for your records</p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">6</span>
                  <div>
                    <h3 className="font-semibold mb-2">Quality Check & New Product Dispatch</h3>
                    <p className="text-gray-600 mb-2">We'll inspect the returned product within 2-3 days</p>
                    <p className="text-gray-600">Once approved, your new product will be dispatched immediately</p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* No Refund Policy */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <XCircle className="text-red-600" />
              No Refund Policy
            </h2>
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border-l-4 border-red-600">
                  <h3 className="font-bold text-red-800 mb-2">⚠️ Important: No Money Back</h3>
                  <p className="text-gray-700 mb-3">
                    We do NOT offer refunds or money back under any circumstances. All sales are final in terms of monetary refunds.
                  </p>
                  <p className="text-gray-700">
                    However, we do offer product exchanges if you're not satisfied with your purchase or if there's a defect.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">What This Means:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span>No cash refunds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span>No bank account refunds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span>No wallet credits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span>No payment reversals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>Only product exchanges allowed</strong></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Exchange Policy */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <RefreshCw className="text-green-600" />
              Exchange Options
            </h2>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
              <p className="mb-4 font-semibold text-gray-800">
                You can exchange your product for:
              </p>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <h4 className="font-bold text-green-800 mb-2">1. Different Size</h4>
                  <p className="text-gray-700">
                    Exchange for the same product in a different size (S, M, L, XL, XXL)
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <h4 className="font-bold text-blue-800 mb-2">2. Different Product</h4>
                  <p className="text-gray-700 mb-2">
                    Exchange for any other product of equal or higher value
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> If the new product costs more, you'll need to pay the difference. If it costs less, no refund will be given.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                  <h4 className="font-bold text-purple-800 mb-2">3. Defective Product</h4>
                  <p className="text-gray-700">
                    If the product has manufacturing defects, we'll replace it with a new one at no extra cost
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold mb-2 text-yellow-800">📝 Exchange Process:</h4>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">1.</span>
                    <span>Request exchange through your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">2.</span>
                    <span>Select the new product/size you want</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">3.</span>
                    <span>We'll pick up the old product</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">4.</span>
                    <span>After quality check, new product will be dispatched</span>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Important Notes</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">⚠</span>
                  <span>Exchange window starts from the date of delivery, not order date</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">⚠</span>
                  <span>Products must be returned in the same condition as received</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">⚠</span>
                  <span><strong>No refunds will be given under any circumstances</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">⚠</span>
                  <span>If exchanging for a higher-priced product, pay the difference</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">⚠</span>
                  <span>If exchanging for a lower-priced product, no money will be refunded</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">⚠</span>
                  <span>Shipping charges are non-refundable (unless product is defective)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">⚠</span>
                  <span>We reserve the right to reject exchanges that don't meet our criteria</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">⚠</span>
                  <span>Exchange is subject to product availability</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Need Help with Exchange?</h2>
            <p className="mb-6 text-gray-300">
              Our customer support team is ready to assist you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Contact Support
              </a>
              <a
                href="/profile/orders"
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition"
              >
                My Orders
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
