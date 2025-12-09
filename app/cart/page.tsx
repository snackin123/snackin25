'use client';

import { useCart } from '@/lib/cart-context';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Gift, X, Snowflake } from 'lucide-react';
import { useCartCalculations } from '@/hooks/useCartCalculations';
import { useCoupon } from '@/hooks/useCoupon';
import { CartItem } from './component/CartItem';
import { PriceSummary } from './component/PriceSummary';
import { CheckoutModal } from './component/CheckoutModal';
import { SpecialOfferBanner } from './component/SpecialOfferBanner';
import { products as allProducts } from '@/lib/data/products';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartCount } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'contact' | 'address' | 'summary' | 'payment'>('cart');
  const [selectedFreeItems, setSelectedFreeItems] = useState<string[]>([]);
  const [showFreeItemNotification, setShowFreeItemNotification] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [triggerFreeItemSelector, setTriggerFreeItemSelector] = useState(0);
  const [christmasDiscount, setChristmasDiscount] = useState<number>(0);

  const handleFreeItemsSelected = useCallback((selectedItems: string[]) => {
    setSelectedFreeItems(selectedItems);
    // If free items are cleared (empty array), hide any notification
    if (selectedItems.length === 0) {
      setShowFreeItemNotification(false);
    }
  }, []);

  const {
    deduplicatedCart,
    subtotal,
    discount,
    shipping,
    comboDiscount,
    finalTotal,
  } = useCartCalculations(cart, cartCount);
  const couponState = useCoupon(subtotal);

  // Apply Christmas Special: 25% OFF on ₹250+ orders
  useEffect(() => {
    if (subtotal >= 250) {
      const christmasDiscountAmount = subtotal * 0.25;
      setChristmasDiscount(christmasDiscountAmount);
    } else {
      setChristmasDiscount(0);
    }
  }, [subtotal]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCheckout = () => {
    // Proceed with checkout
    if (checkoutStep === 'cart') {
      setShowModal(true);
      setCheckoutStep('contact');
    } else if (orderPlaced && orderDetails) {
      window.location.href = `/order-tracking?order_id=${orderDetails.razorpay_order_id}&email=${encodeURIComponent(orderDetails.customerEmail)}`;
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] pt-[64px] px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="h-10 w-64 bg-gray-200 rounded mb-8 mx-auto"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-32 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] pt-[64px] flex flex-col items-center justify-center p-6 sm:p-8 text-center">
        <ShoppingCart className="w-24 h-24 text-gray-400 mb-6" />
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">Your cart is empty</h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link
          href="/products"
          className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-5 sm:px-6 rounded-full transition-all duration-200 text-sm sm:text-base transform hover:scale-105"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Christmas Special Banner */}
        {subtotal >= 250 && (
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-gradient-to-b from-[#0d1117] via-[#14212e] to-[#0d1117] text-white py-8 sm:py-10 px-6 sm:px-10 mb-6">
            {/* GLOW */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_70%)]"></div>

            {/* LABEL */}
            <div className="text-blue-200/90 uppercase tracking-widest text-xs sm:text-sm mb-4 text-center relative z-10">
              <div className="flex justify-center items-center gap-2">
                <Snowflake className="w-4 h-4" />
                Christmas Special
                <Snowflake className="w-4 h-4" />
              </div>
            </div>

            {/* TITLE */}
            <h3 className="text-center text-2xl sm:text-3xl font-bold mb-2 relative z-10">
              <span>🎄 Enjoy Christmas Savings</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200">
                25% OFF on ₹250+
              </span>
            </h3>

            <p className="text-center text-white/85 max-w-xl mx-auto text-sm sm:text-base relative z-10">
              A little Christmas gift from us to you — save big this festive season!
            </p>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-10 text-center text-red-900 mt-6">Your Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {deduplicatedCart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            ))}
            <div className="flex justify-end pt-2">
              <button
                onClick={clearCart}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-full transition-all duration-150 group"
              >
                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Clear Cart</span>
              </button>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-4 sticky top-28">
            <SpecialOfferBanner
              itemCount={cartCount}
              minPacketsForDiscount={2}
              onFreeItemsSelected={handleFreeItemsSelected}
            />
            <div className="lg:col-span-1">
              <PriceSummary
                subtotal={subtotal}
                shipping={shipping}
                discount={discount + christmasDiscount}
                comboDiscount={comboDiscount}
                finalTotal={finalTotal - christmasDiscount}
                cartCount={cartCount}
                orderPlaced={orderPlaced}
                orderDetails={orderDetails}
                handleCheckout={handleCheckout}
                cartItems={deduplicatedCart}
                freeItems={selectedFreeItems}
                christmasDiscount={christmasDiscount}
              />
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <CheckoutModal
          showModal={showModal}
          setShowModal={setShowModal}
          checkoutStep={checkoutStep}
          setCheckoutStep={setCheckoutStep}
          cartItems={deduplicatedCart}
          subtotal={subtotal}
          discount={discount + christmasDiscount}
          shipping={shipping}
          finalTotal={finalTotal - christmasDiscount}
          couponState={couponState}
          setOrderPlaced={setOrderPlaced}
          setOrderDetails={setOrderDetails}
          clearCart={clearCart}
          freeItems={selectedFreeItems}
        />
      )}

      {/* Christmas Special Notification */}
      {subtotal >= 250 && subtotal < 500 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-sm bg-gradient-to-r from-red-600 to-green-600 text-white rounded-lg shadow-2xl p-4 z-50 border border-red-500/30"
        >
          <div className="flex items-start gap-3">
            <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-yellow-300 mb-1 text-sm sm:text-base">🎄 Christmas Special Applied!</h4>
              <p className="text-xs sm:text-sm text-red-100 mb-3">
                You're enjoying 25% OFF (₹{Math.round(christmasDiscount)}) on your order!
              </p>

              <button
                onClick={() => setShowFreeItemNotification(false)}
                className="text-xs text-red-200 hover:text-white transition-colors underline"
              >
                Got it, thanks!
              </button>
            </div>
            <button
              onClick={() => setShowFreeItemNotification(false)}
              className="text-red-300 hover:text-white transition-colors flex-shrink-0 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
