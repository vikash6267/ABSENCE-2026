import { FileText, Shield, CreditCard, Package, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-black mb-4">Terms & Conditions</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Please read these terms carefully before using our services
          </p>
          <p className="text-sm text-gray-400 mt-4">Last Updated: January 2024</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <div className="bg-gray-50 rounded-xl p-6 text-gray-700">
              <p className="mb-4">
                Welcome to ABSENCE ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your access to and use of our website, mobile application, and services (collectively, the "Services").
              </p>
              <p className="mb-4">
                By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.
              </p>
              <p>
                We reserve the right to modify these Terms at any time. Your continued use of the Services after any changes constitutes acceptance of the new Terms.
              </p>
            </div>
          </section>

          {/* Account Registration */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Shield className="text-black" />
              2. Account Registration
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold mb-3">2.1 Account Creation</h3>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li>• You must be at least 18 years old to create an account</li>
                <li>• You must provide accurate and complete information</li>
                <li>• You are responsible for maintaining the confidentiality of your account</li>
                <li>• You are responsible for all activities under your account</li>
                <li>• You must notify us immediately of any unauthorized use</li>
              </ul>

              <h3 className="font-semibold mb-3">2.2 Account Termination</h3>
              <p className="text-gray-700">
                We reserve the right to suspend or terminate your account at any time for violation of these Terms, fraudulent activity, or any other reason we deem necessary.
              </p>
            </div>
          </section>

          {/* Orders and Payments */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="text-black" />
              3. Orders and Payments
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold mb-3">3.1 Placing Orders</h3>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li>• All orders are subject to acceptance and availability</li>
                <li>• We reserve the right to refuse or cancel any order</li>
                <li>• Prices are subject to change without notice</li>
                <li>• Product images are for illustration purposes only</li>
              </ul>

              <h3 className="font-semibold mb-3">3.2 Payment</h3>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li>• Payment must be made at the time of order placement</li>
                <li>• We accept credit/debit cards, UPI, net banking, and COD</li>
                <li>• All payments are processed securely through Razorpay</li>
                <li>• COD orders may have additional charges</li>
              </ul>

              <h3 className="font-semibold mb-3">3.3 Pricing</h3>
              <p className="text-gray-700">
                All prices are in Indian Rupees (INR) and include applicable taxes unless otherwise stated. We strive to display accurate pricing, but errors may occur. In case of a pricing error, we will contact you before processing your order.
              </p>
            </div>
          </section>

          {/* Shipping and Delivery */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Package className="text-black" />
              4. Shipping and Delivery
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <ul className="space-y-2 text-gray-700">
                <li>• Delivery times are estimates and not guaranteed</li>
                <li>• We are not responsible for delays caused by courier services</li>
                <li>• Risk of loss passes to you upon delivery</li>
                <li>• You must inspect packages upon delivery</li>
                <li>• Shipping charges are non-refundable unless product is defective</li>
              </ul>
            </div>
          </section>

          {/* Returns and Refunds */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">5. Returns and Refunds</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                Please refer to our <a href="/returns" className="text-blue-600 hover:underline">Returns & Refund Policy</a> for detailed information about returns, exchanges, and refunds.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Returns must be initiated within 7 days of delivery</li>
                <li>• Products must be unused and in original condition</li>
                <li>• Refunds are processed within 5-7 business days</li>
                <li>• Sale items may not be eligible for return</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                All content on our Services, including text, graphics, logos, images, and software, is the property of ABSENCE or its licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <h3 className="font-semibold mb-3">You may not:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Copy, modify, or distribute our content without permission</li>
                <li>• Use our trademarks or logos without authorization</li>
                <li>• Reverse engineer or decompile our software</li>
                <li>• Create derivative works from our content</li>
              </ul>
            </div>
          </section>

          {/* User Conduct */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">7. User Conduct</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold mb-3">You agree not to:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Violate any applicable laws or regulations</li>
                <li>• Infringe on the rights of others</li>
                <li>• Post false, misleading, or fraudulent content</li>
                <li>• Transmit viruses or malicious code</li>
                <li>• Interfere with the operation of our Services</li>
                <li>• Attempt to gain unauthorized access to our systems</li>
                <li>• Use automated systems to access our Services</li>
                <li>• Harass, abuse, or harm other users</li>
              </ul>
            </div>
          </section>

          {/* Referral Program */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">8. Referral Program</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                Our referral program allows you to earn commission by referring products to others.
              </p>
              <h3 className="font-semibold mb-3">Terms:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Commission is 5% of the product price</li>
                <li>• Commission is credited only for completed orders</li>
                <li>• We reserve the right to modify or terminate the program</li>
                <li>• Fraudulent referrals will result in account termination</li>
                <li>• Commission cannot be withdrawn as cash (wallet use only)</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="text-red-600" />
              9. Limitation of Liability
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, ABSENCE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
              </p>
              <p className="text-gray-700">
                Our total liability shall not exceed the amount you paid for the product or service that gave rise to the claim.
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">10. Disclaimer</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
              </p>
              <p className="text-gray-700">
                We do not warrant that our Services will be uninterrupted, error-free, or secure. We do not guarantee the accuracy or completeness of any content.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">11. Indemnification</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700">
                You agree to indemnify and hold harmless ABSENCE, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of our Services or violation of these Terms.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
              <p className="text-gray-700">
                Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">13. Changes to Terms</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the new Terms on our website. Your continued use of our Services after such changes constitutes acceptance of the new Terms.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">14. Contact Us</h2>
            <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-xl p-6">
              <p className="mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="space-y-2">
                <p>📧 Email: absence.clothiers@gmail.com</p>
                <p>📞 Phone: +91 99999 99999</p>
                <p>📍 Address: ABSENCE Streetwear Pvt. Ltd., 123 Fashion Street, New Delhi - 110001, India</p>
              </div>
            </div>
          </section>

          {/* Acceptance */}
          <section>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-gray-700 font-semibold">
                By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
