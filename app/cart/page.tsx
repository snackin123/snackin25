'use client';

import { useCart } from '@/lib/cart-context';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, X } from 'lucide-react';
import { useCartCalculations } from '@/hooks/useCartCalculations';
import { useCoupon } from '@/hooks/useCoupon';
import { CartItem } from './component/CartItem';
import { PriceSummary } from './component/PriceSummary';
import { CheckoutModal } from './component/CheckoutModal';
import { SpecialOfferBanner } from './component/SpecialOfferBanner';


export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartCount } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'contact' | 'address' | 'summary' | 'payment'>('cart');
  const [selectedFreeItems, setSelectedFreeItems] = useState<string[]>([]);
  const [showFreeItemNotification, setShowFreeItemNotification] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  const handleFreeItemsSelected = (freeItems: string[]) => {
    setSelectedFreeItems(freeItems);
  };

  const {
    deduplicatedCart,
    subtotal,
    discount,
    shipping,
    comboDiscount,
    finalTotal,
  } = useCartCalculations(cart, cartCount);
  const couponState = useCoupon(subtotal);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCheckout = () => {
    // Check if user is eligible for free items but hasn't selected them
    const isEligibleForFreeItems = cartCount >= 2;
    const hasSelectedFreeItems = selectedFreeItems.length === 2;
    
    if (isEligibleForFreeItems && !hasSelectedFreeItems) {
      // Show notification and trigger free item selector
      setShowFreeItemNotification(true);
      // Auto-hide notification after 4 seconds
      setTimeout(() => setShowFreeItemNotification(false), 4000);
      return;
    }
    
    // Proceed with normal checkout
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
        {/* Black Friday Banner */}

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
                discount={discount}
                comboDiscount={comboDiscount}
                finalTotal={finalTotal}
                cartCount={cartCount}
                orderPlaced={orderPlaced}
                orderDetails={orderDetails}
                handleCheckout={handleCheckout}
                cartItems={deduplicatedCart}
                freeItems={selectedFreeItems}
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
          discount={discount}
          shipping={shipping}
          finalTotal={finalTotal}
          couponState={couponState}
          setOrderPlaced={setOrderPlaced}
          setOrderDetails={setOrderDetails}
          clearCart={clearCart}
          freeItems={selectedFreeItems}
        />
      )}
      
      {/* Free Item Notification */}
      {showFreeItemNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-sm bg-gradient-to-r from-red-600 to-black text-white rounded-lg shadow-2xl p-4 z-50 border border-red-500/30"
        >
          <div className="flex items-start gap-3">
            <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-yellow-300 mb-1 text-sm sm:text-base">🎁 Don't Miss Your FREE Items!</h4>
              <p className="text-xs sm:text-sm text-red-100">
                You're eligible for 2 free items worth ₹258! Select them above before checkout.
              </p>
              <button
                onClick={() => setShowFreeItemNotification(false)}
                className="mt-2 text-xs text-red-200 hover:text-white transition-colors underline"
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
