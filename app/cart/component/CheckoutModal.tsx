'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useRazorpayCheckout } from './checkout/hooks/useRazorpayCheckout';
import { CheckoutHeader, CheckoutSecurityInfo } from './checkout/CheckoutHeader';
import { CheckoutProgress } from './checkout/CheckoutProgress';
import { CheckoutSidebar } from './checkout/CheckoutSidebar';
import { ContactStep } from './checkout/steps/ContactStep';
import { AddressStep } from './checkout/steps/AddressStep';
import { SummaryStep } from './checkout/steps/SummaryStep';
import { PaymentStep } from './checkout/steps/PaymentStep';
import { useCheckoutState } from '@/hooks/useCheckoutState';
import { useCoupon } from '@/hooks/useCoupon';
import type { CartItem } from '@/lib/cart-context';

interface CheckoutModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  checkoutStep: 'cart' | 'contact' | 'address' | 'summary' | 'payment';
  setCheckoutStep: (step: 'cart' | 'contact' | 'address' | 'summary' | 'payment') => void;
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  christmasDiscount: number;
  finalTotal: number;
  couponState: ReturnType<typeof useCoupon>;
  setOrderPlaced: (placed: boolean) => void;
  setOrderDetails: (details: any) => void;
  clearCart: () => void;
  freeItems?: string[];
}

export const CheckoutModal = ({
  showModal,
  setShowModal,
  checkoutStep,
  setCheckoutStep,
  cartItems,
  subtotal,
  discount,
  shipping,
  christmasDiscount,
  finalTotal,
  couponState,
  setOrderPlaced,
  setOrderDetails,
  clearCart,
  freeItems = [],
}: CheckoutModalProps) => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const { checkoutStep: currentStep, contactDetails, setContactDetails, addressDetails, setAddressDetails, validateContact, validateAddress, nameError, mobileError, emailError, line1Error, cityError, stateError, pincodeError } = useCheckoutState();
  const { couponCode, setCouponCode, isCouponApplied, showCouponInput, setShowCouponInput, isApplyingCoupon, couponError, setCouponError, successMessage: couponSuccessMessage, handleApplyCoupon, handleRemoveCoupon, setDiscount, setShipping } = couponState;

  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

  const { handlePayment } = useRazorpayCheckout({
    razorpayKey,
    finalTotal,
    contactDetails,
    addressDetails,
    cartItems,
    subtotal,
    discount,
    shipping,
    freeItems,
    setOrderPlaced,
    setOrderDetails,
    clearCart,
    setErrorMessage,
    setCheckoutStep,
    setShowModal,
  });

  const handleCheckout = async () => {
    if (checkoutStep === 'contact') {
      if (validateContact()) {
        setCheckoutStep('address');
      }
    } else if (checkoutStep === 'address') {
      if (validateAddress()) {
        setCheckoutStep('summary');
      }
    } else if (checkoutStep === 'payment') {
      await handlePayment();
    }
  };

  const renderStepContent = () => {
    switch (checkoutStep) {
      case 'contact':
        return (
          <ContactStep
            contactDetails={contactDetails}
            setContactDetails={setContactDetails}
            nameError={nameError}
            mobileError={mobileError}
            emailError={emailError}
            onContinue={handleCheckout}
            onBack={() => {
              setShowModal(false);
              setCheckoutStep('cart');
            }}
          />
        );
      case 'address':
        return (
          <AddressStep
            addressDetails={addressDetails}
            setAddressDetails={setAddressDetails}
            line1Error={line1Error}
            cityError={cityError}
            stateError={stateError}
            pincodeError={pincodeError}
            onContinue={handleCheckout}
            onBack={() => setCheckoutStep('contact')}
          />
        );
      case 'summary':
        return (
          <SummaryStep
            contactDetails={contactDetails}
            addressDetails={addressDetails}
            onContinue={() => setCheckoutStep('payment')}
            onBack={() => setCheckoutStep('address')}
          />
        );
      case 'payment':
        return (
          <PaymentStep
            finalTotal={finalTotal}
            onPay={handleCheckout}
            onBack={() => setCheckoutStep('summary')}
          />
        );
      default:
        return null;
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4 py-8 overflow-y-auto">
      <div className="relative flex flex-col md:flex-row rounded-2xl shadow-2xl max-w-4xl w-full mx-auto border-4 border-amber-500 bg-white overflow-hidden animate-fadeIn max-h-[90vh] my-8">
        <div className={`bg-amber-50 ${checkoutStep === 'summary' ? 'md:w-2/5' : 'md:w-1/2'} w-full p-6 flex flex-col justify-between overflow-y-auto`}>
          <div>
            <CheckoutHeader />
            <div className="text-xs text-green-700 mb-4">Shipped more than 100 orders last month</div>
            <CheckoutSidebar
              cartItems={cartItems}
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              christmasDiscount={christmasDiscount}
              finalTotal={finalTotal}
              couponState={couponState}
              freeItems={freeItems}
            />
          </div>
          <CheckoutSecurityInfo />
        </div>
        <div className={`bg-white ${checkoutStep === 'summary' ? 'md:w-3/5' : 'md:w-1/2'} w-full p-6 flex flex-col overflow-y-auto relative`}>
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
            onClick={() => {
              setShowModal(false);
              setCheckoutStep('cart');
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <CheckoutProgress checkoutStep={checkoutStep} />
          {renderStepContent()}
          {errorMessage && (
            <div className="mt-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {errorMessage}</span>
              </div>
            </div>
          )}
          {successMessage && (
            <div className="mt-4">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline"> {successMessage}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
