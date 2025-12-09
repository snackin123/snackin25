'use client';

interface CheckoutProgressProps {
  checkoutStep: 'cart' | 'contact' | 'address' | 'summary' | 'payment';
}

export const CheckoutProgress = ({ checkoutStep }: CheckoutProgressProps) => {
  return (
    <div className="flex items-center justify-center mb-8 pt-2">
      <div className="flex gap-2 sm:gap-4 text-center justify-center flex-wrap">
        <span className={`text-sm sm:text-base font-semibold ${checkoutStep === 'contact' ? 'text-amber-600' : 'text-gray-600'}`}>Contact</span>
        <span className="text-gray-300">|</span>
        <span className={`text-sm sm:text-base font-semibold ${checkoutStep === 'address' ? 'text-amber-600' : 'text-gray-600'}`}>Address</span>
        <span className="text-gray-300">|</span>
        <span className={`text-sm sm:text-base font-semibold ${checkoutStep === 'summary' ? 'text-amber-600' : 'text-gray-600'}`}>Summary</span>
        <span className="text-gray-300">|</span>
        <span className={`text-sm sm:text-base font-semibold ${checkoutStep === 'payment' ? 'text-amber-600' : 'text-gray-600'}`}>Payment</span>
      </div>
    </div>
  );
};
