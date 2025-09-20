'use client';

import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/lib/cart-context';
import { CART } from '@/lib/constants';
import { useState } from 'react';
import { SpecialOfferBanner } from './SpecialOfferBanner';

interface PriceSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  finalTotal: number;
  cartCount: number;
  orderPlaced: boolean;
  orderDetails: any;
  handleCheckout: () => void;
  setDiscount?: (value: number) => void;
  setShipping?: (value: number) => void;
  cartItems: CartItem[];
}

export const PriceSummary = ({
  subtotal,
  shipping,
  discount,
  finalTotal,
  cartCount,
  orderPlaced,
  orderDetails,
  handleCheckout,
  setDiscount = () => {},
  setShipping = () => {},
  cartItems,
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
        <div className="flex justify-between text-gray-800">
          <span>Shipping</span>
          <span>{formatPrice(shipping)}</span>
        </div>
        {CART.COMBO_OFFER.ACTIVE && totalItems >= CART.COMBO_OFFER.MIN_ITEMS && (
          <div className="space-y-2">
            <div className="flex justify-between text-green-600 font-medium">
              <span>Combo Discount ({CART.COMBO_OFFER.MIN_ITEMS}+ items)</span>
              <span>-{formatPrice(CART.COMBO_OFFER.DISCOUNT_AMOUNT)}</span>
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