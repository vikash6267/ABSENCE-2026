'use client';
import { useState } from 'react';
import { ChevronDown, Search, Package, CreditCard, Truck, RotateCcw, Shield, HelpCircle } from 'lucide-react';

const faqCategories = [
  {
    id: 'orders',
    name: 'Orders & Payment',
    icon: Package,
    faqs: [
      {
        question: 'How do I place an order?',
        answer: 'Browse our products, select your size, add to cart, and proceed to checkout. Fill in your shipping address and complete the payment to place your order.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit/debit cards, UPI, net banking, and Cash on Delivery (COD) for orders across India.'
      },
      {
        question: 'Is Cash on Delivery (COD) available?',
        answer: 'Yes, COD is available for all orders across India. A nominal COD charge may apply for orders below ₹999.'
      },
      {
        question: 'Can I modify or cancel my order?',
        answer: 'You can cancel your order within 24 hours of placing it. Contact our support team immediately. Once the order is dispatched, it cannot be cancelled.'
      },
      {
        question: 'Do you provide invoices?',
        answer: 'Yes, a tax invoice is included with every order. You can also download it from your order history in your account.'
      }
    ]
  },
  {
    id: 'shipping',
    name: 'Shipping & Delivery',
    icon: Truck,
    faqs: [
      {
        question: 'How long does delivery take?',
        answer: 'Delivery typically takes 5-7 business days for most locations. Metro cities receive orders in 3-5 days, while remote areas may take 7-10 days.'
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Currently, we only ship within India. International shipping will be available soon.'
      },
      {
        question: 'What are the shipping charges?',
        answer: 'Shipping is FREE for orders above ₹999. For orders below ₹999, a flat shipping charge of ₹50 applies.'
      },
      {
        question: 'How can I track my order?',
        answer: 'Once your order is dispatched, you\'ll receive a tracking number via email and SMS. You can also track your order from "My Orders" section in your account.'
      },
      {
        question: 'What if I\'m not available during delivery?',
        answer: 'The courier will attempt delivery 2-3 times. If unsuccessful, the package will be returned. Please ensure someone is available at the delivery address.'
      }
    ]
  },
  {
    id: 'returns',
    name: 'Exchange Policy',
    icon: RotateCcw,
    faqs: [
      {
        question: 'What is your exchange policy?',
        answer: 'We offer a 7-day exchange policy from the date of delivery. Products must be unused, unwashed, with original tags intact. Note: We do NOT offer refunds, only product exchanges.'
      },
      {
        question: 'Do you offer refunds?',
        answer: 'No, we do NOT offer refunds or money back under any circumstances. All sales are final in terms of monetary refunds. However, you can exchange products for a different size or product within 7 days of delivery.'
      },
      {
        question: 'How do I exchange a product?',
        answer: 'Login to your account, go to "My Orders", select the product you want to exchange, and click "Exchange". Choose your new size/product and our team will schedule a free pickup.'
      },
      {
        question: 'Can I exchange for a different product?',
        answer: 'Yes! You can exchange for any other product. If the new product costs more, you pay the difference. If it costs less, no money will be refunded - only product exchange is allowed.'
      },
      {
        question: 'What items cannot be exchanged?',
        answer: 'Worn, washed, or altered products, items with removed tags, products with stains or odors, and products returned after 7 days cannot be exchanged.'
      }
    ]
  },
  {
    id: 'products',
    name: 'Products & Sizing',
    icon: Shield,
    faqs: [
      {
        question: 'How do I choose the right size?',
        answer: 'Refer to our size guide available on each product page. We provide detailed measurements for chest, length, and shoulder width.'
      },
      {
        question: 'Are your products true to size?',
        answer: 'Yes, our products are true to size. However, oversized fits are intentionally larger. Check the product description and size guide for details.'
      },
      {
        question: 'What is the quality of your t-shirts?',
        answer: 'We use premium 100% cotton fabric with 180-220 GSM. Our prints are high-quality DTG (Direct to Garment) that last long without fading.'
      },
      {
        question: 'How do I care for my ABSENCE products?',
        answer: 'Machine wash cold, inside out. Do not bleach. Tumble dry low or hang dry. Iron inside out on low heat. This helps maintain print quality.'
      },
      {
        question: 'Do you restock sold-out items?',
        answer: 'Yes, popular items are restocked regularly. Sign up for restock notifications on the product page to get notified.'
      }
    ]
  },
  {
    id: 'account',
    name: 'Account & Wallet',
    icon: CreditCard,
    faqs: [
      {
        question: 'How do I create an account?',
        answer: 'Click on "Login" in the top right corner, then select "Sign Up". Fill in your details to create an account.'
      },
      {
        question: 'What is the ABSENCE Wallet?',
        answer: 'ABSENCE Wallet is your digital wallet where you can store referral earnings. Use it for instant checkout on future purchases. Note: We do not offer refunds, so wallet is only for referral commissions.'
      },
      {
        question: 'How does the referral program work?',
        answer: 'Share product links with your unique referral code. When someone purchases through your link, you earn 5% commission in your wallet.'
      },
      {
        question: 'Can I use my wallet balance for purchases?',
        answer: 'Yes, you can use your wallet balance during checkout. The amount will be deducted from your total order value.'
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click on "Forgot Password" on the login page. Enter your email, and we\'ll send you a password reset link.'
      }
    ]
  },
  {
    id: 'other',
    name: 'Other Questions',
    icon: HelpCircle,
    faqs: [
      {
        question: 'Do you have a physical store?',
        answer: 'Currently, we are an online-only brand. This helps us offer premium quality at competitive prices.'
      },
      {
        question: 'How can I contact customer support?',
        answer: 'You can reach us via email at absence.clothiers@gmail.com, call us at +91 99999 99999, or use the contact form on our website.'
      },
      {
        question: 'Do you offer bulk/wholesale orders?',
        answer: 'Yes, we offer special pricing for bulk orders. Contact us at absence.clothiers@gmail.com with your requirements.'
      },
      {
        question: 'Are there any ongoing offers?',
        answer: 'Check our homepage and product pages for current offers. Subscribe to our newsletter to get notified about sales and exclusive deals.'
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, all payments are processed through Razorpay, a PCI DSS compliant payment gateway. We don\'t store your card details.'
      }
    ]
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFAQ, setOpenFAQ] = useState(null);

  const filteredFAQs = faqCategories
    .filter(cat => selectedCategory === 'all' || cat.id === selectedCategory)
    .map(cat => ({
      ...cat,
      faqs: cat.faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(cat => cat.faqs.length > 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-black mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Find answers to common questions about orders, shipping, returns, and more
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`p-4 rounded-xl border-2 transition ${
                selectedCategory === 'all'
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <HelpCircle className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-semibold">All</span>
              </div>
            </button>

            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl border-2 transition ${
                    selectedCategory === category.id
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-xs font-semibold">{category.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No FAQs found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredFAQs.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                  </div>

                  <div className="space-y-3">
                    {category.faqs.map((faq, index) => {
                      const faqId = `${category.id}-${index}`;
                      const isOpen = openFAQ === faqId;

                      return (
                        <div
                          key={faqId}
                          className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition"
                        >
                          <button
                            onClick={() => setOpenFAQ(isOpen ? null : faqId)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                          >
                            <span className="font-semibold pr-4">{faq.question}</span>
                            <ChevronDown
                              className={`flex-shrink-0 transition-transform ${
                                isOpen ? 'transform rotate-180' : ''
                              }`}
                              size={20}
                            />
                          </button>

                          {isOpen && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Still Have Questions */}
        <div className="mt-16 bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Still Have Questions?</h2>
          <p className="mb-6 text-gray-300">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Contact Support
            </a>
            <a
              href="mailto:absence.clothiers@gmail.com"
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
