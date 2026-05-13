import { Shield, Eye, Lock, Database, Mail, Cookie, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-black mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your data.
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
                ABSENCE ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services.
              </p>
              <p>
                By using our Services, you consent to the data practices described in this policy. If you do not agree with this policy, please do not use our Services.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Database className="text-black" />
              2. Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold mb-3">2.1 Personal Information</h3>
                <p className="text-gray-700 mb-3">We collect information that you provide directly to us:</p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Name and contact information (email, phone number)</li>
                  <li>• Shipping and billing addresses</li>
                  <li>• Payment information (processed securely by Razorpay)</li>
                  <li>• Account credentials (username, password)</li>
                  <li>• Profile information and preferences</li>
                  <li>• Order history and purchase information</li>
                  <li>• Product reviews and ratings</li>
                  <li>• Communication preferences</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold mb-3">2.2 Automatically Collected Information</h3>
                <p className="text-gray-700 mb-3">When you use our Services, we automatically collect:</p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Device information (IP address, browser type, operating system)</li>
                  <li>• Usage data (pages visited, time spent, clicks)</li>
                  <li>• Location data (approximate location based on IP)</li>
                  <li>• Cookies and similar tracking technologies</li>
                  <li>• Log files and analytics data</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold mb-3">2.3 Information from Third Parties</h3>
                <p className="text-gray-700 mb-3">We may receive information from:</p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Payment processors (Razorpay)</li>
                  <li>• Social media platforms (if you connect your account)</li>
                  <li>• Analytics providers</li>
                  <li>• Marketing partners</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Eye className="text-black" />
              3. How We Use Your Information
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 mb-4">We use your information for the following purposes:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">3.1 Order Processing</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Process and fulfill your orders</li>
                    <li>• Send order confirmations and updates</li>
                    <li>• Handle returns and refunds</li>
                    <li>• Provide customer support</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3.2 Account Management</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Create and manage your account</li>
                    <li>• Authenticate your identity</li>
                    <li>• Manage your preferences</li>
                    <li>• Process referral commissions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3.3 Communication</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Send transactional emails (order updates, receipts)</li>
                    <li>• Respond to your inquiries</li>
                    <li>• Send marketing communications (with your consent)</li>
                    <li>• Notify you about promotions and offers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3.4 Improvement and Analytics</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Analyze usage patterns and trends</li>
                    <li>• Improve our products and services</li>
                    <li>• Personalize your experience</li>
                    <li>• Conduct research and development</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3.5 Security and Fraud Prevention</h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Detect and prevent fraud</li>
                    <li>• Protect against security threats</li>
                    <li>• Enforce our terms and policies</li>
                    <li>• Comply with legal obligations</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Cookie className="text-black" />
              4. Cookies and Tracking Technologies
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to enhance your experience:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Essential Cookies</h3>
                  <p className="text-gray-700 text-sm">Required for the website to function properly (authentication, cart, security)</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Analytics Cookies</h3>
                  <p className="text-gray-700 text-sm">Help us understand how visitors use our website</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Marketing Cookies</h3>
                  <p className="text-gray-700 text-sm">Used to deliver relevant advertisements and track campaign performance</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Preference Cookies</h3>
                  <p className="text-gray-700 text-sm">Remember your settings and preferences</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our Services.
                </p>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">5. How We Share Your Information</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 mb-4">We may share your information with:</p>
              
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>Service Providers:</strong> Payment processors, shipping companies, email services, analytics providers
                </li>
                <li>
                  <strong>Business Partners:</strong> Marketing partners, referral program participants
                </li>
                <li>
                  <strong>Legal Requirements:</strong> Law enforcement, regulatory authorities, courts (when required by law)
                </li>
                <li>
                  <strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets
                </li>
                <li>
                  <strong>With Your Consent:</strong> Any other third parties with your explicit permission
                </li>
              </ul>

              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>We do not sell your personal information to third parties.</strong>
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lock className="text-black" />
              6. Data Security
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your information:
              </p>
              
              <ul className="space-y-2 text-gray-700">
                <li>• SSL/TLS encryption for data transmission</li>
                <li>• Secure payment processing through PCI DSS compliant providers</li>
                <li>• Regular security audits and updates</li>
                <li>• Access controls and authentication</li>
                <li>• Employee training on data protection</li>
                <li>• Incident response procedures</li>
              </ul>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  While we strive to protect your information, no method of transmission over the internet is 100% secure. Use our Services at your own risk.
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <UserCheck className="text-black" />
              7. Your Rights and Choices
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold mb-1">Access</h3>
                  <p className="text-gray-700 text-sm">Request a copy of your personal information</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Correction</h3>
                  <p className="text-gray-700 text-sm">Update or correct inaccurate information</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Deletion</h3>
                  <p className="text-gray-700 text-sm">Request deletion of your personal information</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Opt-Out</h3>
                  <p className="text-gray-700 text-sm">Unsubscribe from marketing communications</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Data Portability</h3>
                  <p className="text-gray-700 text-sm">Receive your data in a structured, machine-readable format</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Object</h3>
                  <p className="text-gray-700 text-sm">Object to certain processing of your information</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  To exercise these rights, contact us at absence.clothiers@gmail.com
                </p>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">8. Data Retention</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                We retain your personal information for as long as necessary to:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Provide our Services</li>
                <li>• Comply with legal obligations</li>
                <li>• Resolve disputes</li>
                <li>• Enforce our agreements</li>
              </ul>
              <p className="text-gray-700 mt-4">
                When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-gray-700">
                Our Services are not intended for children under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </div>
          </section>

          {/* International Transfers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">10. International Data Transfers</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700">
                Your information may be transferred to and processed in countries other than India. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </div>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">11. Changes to This Privacy Policy</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date. Your continued use of our Services after such changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>

          {/* Contact Us */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Mail className="text-black" />
              12. Contact Us
            </h2>
            <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-xl p-6">
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2">
                <p>📧 Email: absence.clothiers@gmail.com</p>
                <p>📞 Phone: +91 99999 99999</p>
                <p>📍 Address: ABSENCE Streetwear Pvt. Ltd., 123 Fashion Street, New Delhi - 110001, India</p>
              </div>
            </div>
          </section>

          {/* Consent */}
          <section>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-gray-700 font-semibold">
                By using our Services, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your information as described herein.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
