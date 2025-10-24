'use client';

import { useCart } from '@/lib/cart-context';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCartCalculations } from '@/hooks/useCartCalculations';
import { useCoupon } from '@/hooks/useCoupon';
import { CartItem } from './component/CartItem';
import { PriceSummary } from './component/PriceSummary';
import { CheckoutModal } from './component/CheckoutModal';
// import { SpecialOfferBanner } from './component/SpecialOfferBanner';


export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartCount } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'contact' | 'address' | 'summary' | 'payment'>('cart');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

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
    // Simplified; move detailed logic to CheckoutModal or a separate hook
    if (checkoutStep === 'cart') {
      setShowModal(true);
      setCheckoutStep('contact');
    } else if (orderPlaced && orderDetails) {
      window.location.href = `/order-tracking?order_id=${orderDetails.razorpay_order_id}&email=${encodeURIComponent(orderDetails.customerEmail)}`;
    }
    // Further steps handled in CheckoutModal
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
            {/* <SpecialOfferBanner itemCount={cartCount} minPacketsForDiscount={4} /> */}
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
          couponState={couponState}  // Add this line
          setOrderPlaced={setOrderPlaced}
          setOrderDetails={setOrderDetails}
          clearCart={clearCart}
        />
      )}
    </div>
  );
}
