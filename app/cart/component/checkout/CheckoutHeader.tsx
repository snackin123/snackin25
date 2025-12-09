'use client';

import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

export const CheckoutHeader = () => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Image
        src="/Images/favicon-32x32.png"
        alt="The Snackin Company"
        width={32}
        height={32}
        className="rounded"
      />
      <span className="font-bold text-lg text-amber-950">The Snackin Company</span>
    </div>
  );
};

export const CheckoutSecurityInfo = () => {
  return (
    <div className="mt-6 flex items-center">
      <ShieldCheck className="w-5 h-5 text-amber-900" />
      <span className="ml-2 text-xs text-amber-900">Secured & Encrypted Checkout</span>
    </div>
  );
};
