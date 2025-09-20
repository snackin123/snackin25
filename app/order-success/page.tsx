'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

type Order = {
  customerEmail?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    weight?: string;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
  };
};

// Main component that handles the order success logic
function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id');
  const router = useRouter();

  const [isSendingEmail, setIsSendingEmail] = useState(true);
  const [emailStatus, setEmailStatus] = useState('Sending order confirmation...');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load order data from localStorage on component mount
  useEffect(() => {
    try {
      const orderData = localStorage.getItem('currentOrder');
      const searchParams = new URLSearchParams(window.location.search);
      const orderId = searchParams.get('order_id');
      const paymentId = searchParams.get('payment_id');
      
      if (orderData) {
        const parsedOrder = JSON.parse(orderData);
        // Ensure we have the latest order_id and payment_id from URL
        parsedOrder.razorpay_order_id = orderId || parsedOrder.razorpay_order_id;
        parsedOrder.razorpay_payment_id = paymentId || parsedOrder.razorpay_payment_id;
        
        setOrder(parsedOrder);
        
        // Clear the current order from localStorage after loading it
        setTimeout(() => {
          localStorage.removeItem('currentOrder');
        }, 5000); // Keep it for a few seconds in case of page reload
      } else if (orderId && paymentId) {
        // Try to find the order in order history if not in currentOrder
        const orderHistory = JSON.parse(localStorage.getItem('snackin_orders') || '[]');
        const foundOrder = orderHistory.find((o: any) => o.id === orderId);
        
        if (foundOrder) {
          foundOrder.razorpay_order_id = orderId;
          foundOrder.razorpay_payment_id = paymentId;
          setOrder(foundOrder);
        } else {
          throw new Error('Order not found in history');
        }
      } else {
        throw new Error('No order data available');
      }
    } catch (err) {
      console.error('Error loading order data:', err);
      setError('No order data found. The confirmation email cannot be sent.');
      setIsSendingEmail(false);
    }
  }, []);

  // Handle sending the confirmation email
  useEffect(() => {
    const sendOrderConfirmation = async () => {
      if (!orderId || !paymentId || !order) {
        return;
      }

      try {
        const customerEmail = order.customerEmail;
        if (!customerEmail) {
          throw new Error('Customer email not found in order data');
        }

        // Send confirmation email
        const response = await fetch('/api/send-order-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order,
            customerEmail,
            orderId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send confirmation email');
        }

        setEmailStatus('Confirmation email sent!');
      } catch (err) {
        console.error('Error sending confirmation email:', err);
        setError(
          'Failed to send confirmation email. Please contact support with your order details.'
        );
      } finally {
        setIsSendingEmail(false);
      }
    };

    if (order) {
      sendOrderConfirmation();
    }
  }, [orderId, paymentId, order]);

  // Clean up localStorage when component unmounts
  useEffect(() => {
    return () => {
      // Only remove if email was sent successfully
      if (emailStatus === 'Confirmation email sent!') {
        localStorage.removeItem('currentOrder');
      }
    };
  }, [emailStatus]);

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Processing Issue</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
            >
              Try Again
            </button>
            <Link 
              href="/contact" 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase.</p>
        
        <div className="mb-6 text-center">
          {isSendingEmail ? (
            <div className="flex items-center justify-center text-amber-600">
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              <span>{emailStatus}</span>
            </div>
          ) : emailStatus.includes('Failed') ? (
            <div className="text-red-600">
              <p className="flex items-center justify-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {emailStatus}
              </p>
              <p className="text-sm mt-2">
                Don't worry, we've saved your order details.
              </p>
            </div>
          ) : (
            <p className="text-green-600">
              {emailStatus}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <Link 
            href="/products" 
            className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

// Page component that wraps the content in a Suspense boundary
export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
