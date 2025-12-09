'use client';

import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/lib/cart-context';
import { CART } from '@/lib/constants';
import { useState } from 'react'; 
import { Gift } from 'lucide-react';
import { products as allProducts } from '@/lib/data/products';

interface PriceSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  comboDiscount: number;
  finalTotal: number;
  cartCount: number;
  orderPlaced: boolean;
  orderDetails: any;
  handleCheckout: () => void;
  cartItems: CartItem[];
  freeItems?: string[];
  christmasDiscount?: number;
}

export const PriceSummary = ({
  subtotal,
  shipping,
  discount,
  comboDiscount,
  finalTotal,
  cartCount,
  orderPlaced,
  orderDetails,
  handleCheckout,
  cartItems,
  freeItems = [],
  christmasDiscount = 0,
}: PriceSummaryProps) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
      <h2 className="text-xl font-bold mb-4 text-amber-900">
        {orderPlaced ? 'Order Placed Successfully!' : 'Price Summary'}
      </h2>
      {orderPlaced && orderDetails && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-medium">Order ID: {orderDetails.razorpay_order_id}</p>
          <p className="text-sm text-green-600 mt-1">We've sent the details to {orderDetails.customerEmail}</p>
          <button
            onClick={() =>
              (window.location.href = `/order-tracking?order_id=${orderDetails.razorpay_order_id}&email=${encodeURIComponent(
                orderDetails.customerEmail
              )}`)
            }
            className="mt-2 text-sm text-amber-600 hover:text-amber-700 transition-colors"
          >
            Track your order →
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
          <span className="font-semibold text-amber-900">{formatPrice(subtotal)}</span>
        </div>
        {/* Shipping */}
        <div className="flex justify-between text-gray-800">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>
        
        {/* Discounts */}
        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Discount (Orders over ₹299)</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        
        {/* Christmas Special Discount */}
        {christmasDiscount && christmasDiscount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>🎄 Christmas Special (25% OFF)</span>
            <span>-{formatPrice(christmasDiscount)}</span>
          </div>
        )}

        {/* Black Friday Combo Discount */}
        {comboDiscount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Black Friday Deal (Buy 2 Get 2 FREE)</span>
            <span>-{formatPrice(comboDiscount)}</span>
          </div>
        )}
        
        {/* Free Items Display */}
        {freeItems.length > 0 && cartCount >= 2 && (
          <div className="flex justify-between text-green-600 font-medium">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              <span>Free Items ({freeItems.length})</span>
            </div>
            <span className="text-green-600 font-semibold">FREE</span>
          </div>
        )}
        
        {/* Free Items List */}
        {freeItems.length > 0 && cartCount >= 2 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs font-medium text-green-800 mb-2">Your FREE items:</p>
            <div className="space-y-1">
              {freeItems.map((itemId, index) => {
                const product = allProducts.find((p: any) => p.id === itemId);
                return product ? (
                  <div key={itemId} className="flex justify-between items-center text-xs">
                    <span className="text-green-700">{index + 1}. {product.name}</span>
                    <span className="text-green-600 font-semibold line-through">{product.originalPrice}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
        <div className="flex justify-between font-bold text-base mt-3 text-amber-600">
          <span>Total</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>
      </div>
      {!orderPlaced && (
        <button
          onClick={handleCheckout}
          className={`w-full mt-6 ${
            cartCount === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700'
          } text-white font-medium py-3 px-6 rounded-lg transition-all text-base flex items-center justify-center active:scale-[0.98]`}
          disabled={cartCount === 0}
        >
          Proceed to Checkout
        </button>
      )}
      <p className="text-xs text-gray-600 mt-4 text-center">
        By placing your order, you agree to our{' '}
        <a href="/terms" className="text-amber-600 hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-amber-600 hover:underline">
          Privacy Policy
        </a>.
      </p>
    </div>
  );
};
