'use client';

import { CreditCard } from 'lucide-react';
import { BackButton } from '../BackButton';
import { formatPrice } from '@/lib/utils';

interface PaymentStepProps {
  finalTotal: number;
  onPay: () => void;
  onBack: () => void;
}

export const PaymentStep = ({
  finalTotal,
  onPay,
  onBack,
}: PaymentStepProps) => {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <BackButton onClick={onBack} label="Back to Preview" />
      <CreditCard className="w-12 h-12 text-amber-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Secure Payment</h2>
      <p className="text-gray-700 text-base mb-6">Your payment is securely processed by Razorpay.</p>
      <button
        onClick={onPay}
        className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg mt-6 hover:bg-amber-600 transition-all duration-200 transform hover:scale-105 text-base font-medium"
        aria-label="Pay securely"
      >
        Pay {formatPrice(finalTotal)}
      </button>
      <p className="text-xs text-gray-500 mt-4">By clicking 'Pay', you agree to Razorpay's terms and conditions.</p>
    </div>
  );
};
