'use client';

import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/lib/cart-context';
import { Gift } from 'lucide-react';
import { products as allProducts, type Product } from '@/lib/data/products';
import { useRouter } from 'next/navigation';

interface OrderDetails {
  razorpay_order_id: string;
  customerEmail: string;
}

interface PriceSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  comboDiscount: number;
  // main Christmas discount amount already calculated in parent
  christmasDiscount: number;
  finalTotal: number;
  cartCount: number;
  cartItems: CartItem[];
  orderPlaced: boolean;
  orderDetails?: OrderDetails | null;
  handleCheckout: () => void;
  freeItems?: string[];
}

export const PriceSummary = ({
  subtotal,
  shipping,
  discount,
  comboDiscount,
  christmasDiscount,
  finalTotal,
  cartCount,
  cartItems,
  orderPlaced,
  orderDetails,
  handleCheckout,
  freeItems = [],
}: PriceSummaryProps) => {
  const router = useRouter();
  const hasFreeItems = freeItems.length > 0 && cartCount >= 2;

  const onTrackOrder = () => {
    if (!orderDetails?.razorpay_order_id || !orderDetails?.customerEmail) {
      return;
    }

    const params = new URLSearchParams({
      order_id: orderDetails.razorpay_order_id,
      email: orderDetails.customerEmail,
    });

    router.push(`/order-tracking?${params.toString()}`);
  };

  const formatOriginalPrice = (price: Product['originalPrice']) => {
    if (price == null) return '';
    const numeric =
      typeof price === 'number' ? price : Number.parseFloat(price as string);
    if (Number.isNaN(numeric)) return '';
    return formatPrice(numeric);
  };

  return (
    <section
      aria-labelledby="price-summary-heading"
      className="bg-white p-6 rounded-xl shadow-md border border-amber-100"
    >
      <h2
        id="price-summary-heading"
        className="text-xl font-bold mb-4 text-amber-900"
      >
        {orderPlaced ? 'Order Placed Successfully!' : 'Price Summary'}
      </h2>

      {orderPlaced && orderDetails && (
        <div
          className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
          role="status"
          aria-live="polite"
        >
          <p className="text-green-700 font-medium">
            Order ID: {orderDetails.razorpay_order_id}
          </p>
          <p className="text-sm text-green-600 mt-1">
            We&apos;ve sent the details to {orderDetails.customerEmail}
          </p>
          <button
            type="button"
            onClick={onTrackOrder}
            className="mt-2 text-sm text-amber-600 hover:text-amber-700 transition-colors"
          >
            Track your order
          </button>
        </div>
      )}

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-baseline">
          <div>
            <span className="font-medium text-amber-900">Subtotal</span>
            <span className="ml-1 text-xs text-gray-500">
              ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </span>
          </div>
          <span className="font-semibold text-amber-900">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-gray-800">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>

        {/* Single active offer: Christmas 25% OFF on ₹250+ */}
        {christmasDiscount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>🎄 Enjoy Christmas Savings (25%)</span>
            <span>-{formatPrice(christmasDiscount)}</span>
          </div>
        )}

        {hasFreeItems && (
          <div className="flex justify-between text-green-600 font-medium">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4" aria-hidden="true" />
              <span>Free Items ({freeItems.length})</span>
            </div>
            <span className="text-green-600 font-semibold">FREE</span>
          </div>
        )}

        {hasFreeItems && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs font-medium text-green-800 mb-2">
              Your FREE items:
            </p>
            <ul className="space-y-1">
              {freeItems.map((itemId, index) => {
                const product = (allProducts as Product[]).find(
                  (p) => p.id === itemId
                );
                if (!product) return null;

                return (
                  <li
                    key={itemId}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="text-green-700">
                      {index + 1}. {product.name}
                    </span>
                    <span className="text-green-600 font-semibold line-through">
                      {formatOriginalPrice(product.originalPrice)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="flex justify-between font-bold text-base mt-3 text-amber-600">
          <span>Total</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>
      </div>

      {!orderPlaced && (
        <button
          type="button"
          onClick={handleCheckout}
          className={`w-full mt-6 ${
            cartCount === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700'
          } text-white font-medium py-3 px-6 rounded-lg transition-all text-base flex items-center justify-center active:scale-[0.98]`}
          disabled={cartCount === 0}
          aria-disabled={cartCount === 0}
        >
          Proceed to Checkout
        </button>
      )}

      <p className="text-xs text-gray-600 mt-4 text-center">
        By placing your order, you agree to our{' '}
        <a href="/terms-conditions" className="text-amber-600 hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy-policy" className="text-amber-600 hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </section>
  );
};
