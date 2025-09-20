import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - The snackin Company',
  description: 'Terms and conditions governing the use of our website and services.',
};

export default function TermsConditions() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/5 rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-white">Terms & Conditions</h1>
        <p className="text-gray-300 mb-6">Last Updated: June 11, 2025</p>
        
        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using thesnackin.com ("Website"), you agree to be bound by these Terms and Conditions 
              and our Privacy Policy. If you do not agree with any part of these terms, you must not use our Website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Products and Orders</h2>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>All products are subject to availability</li>
              <li>Prices are subject to change without notice</li>
              <li>We reserve the right to refuse service to anyone for any reason at any time</li>
              <li>We may limit or cancel quantities purchased per person, per household</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Payment and Billing</h2>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>We accept various payment methods including credit/debit cards and net banking</li>
              <li>Payment is processed at the time of order confirmation</li>
              <li>All prices are in Indian Rupees (INR) and inclusive of all taxes</li>
              <li>You agree to provide current and accurate payment information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Shipping and Delivery</h2>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>We ship throughout India</li>
              <li>Estimated delivery time is 5-7 business days</li>
              <li>Delivery times are estimates and not guaranteed</li>
              <li>Shipping charges are non-refundable</li>
              <li>Risk of loss passes to you upon delivery to the carrier</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Returns and Refunds</h2>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>We accept returns within 7 days of delivery</li>
              <li>Products must be unopened and in original condition</li>
              <li>Refunds will be processed within 7-10 business days</li>
              <li>Shipping charges are non-refundable</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Intellectual Property</h2>
            <p className="mb-4">
              All content on this Website, including text, graphics, logos, and images, is the property of The snackin Company 
              and is protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Limitation of Liability</h2>
            <p className="mb-4">
              The snackin Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
              resulting from your use of or inability to use the Website or our products.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Governing Law</h2>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject 
              to the exclusive jurisdiction of the courts in [Your City], India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Contact Information</h2>
            <p className="mb-2">For any questions about these Terms, please contact us at:</p>
            <p className="mb-2">Email: <a href="mailto:hello@snackinofficial.com" className="text-orange-400 hover:underline">legal@snackinofficial.com</a></p>
            <p>Phone: +91 90286-54048</p>
          </section>
        </div>
      </div>
    </div>
  );
}
