import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - The snackin Company',
  description: 'Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/5 rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>
        <p className="text-gray-300 mb-6">Last Updated: June 11, 2025</p>
        
        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Information We Collect</h2>
            <p className="mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Contact information (name, email, phone number)</li>
              <li>Shipping and billing addresses</li>
              <li>Payment information (processed securely by our payment processor)</li>
              <li>Order history and preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and account</li>
              <li>Improve our products and services</li>
              <li>Send you marketing communications (you can opt-out anytime)</li>
              <li>Prevent fraud and enhance security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your personal information. 
              All payment transactions are encrypted using SSL technology.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Access your personal information</li>
              <li>Request correction of your information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mb-2">Email: <a href="mailto:privacy@snackinofficial.com" className="text-orange-400 hover:underline">privacy@snackinofficial.com</a></p>
            <p>Phone: +91 90286-54048</p>
          </section>
        </div>
      </div>
    </div>
  );
}
