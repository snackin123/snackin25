// This file is deprecated. Please use the new email service instead.
// Import and use the emailService from './services/email.service'

import { emailService } from './services/email.service';

export * from './types/email.types';

/**
 * @deprecated Use emailService.sendOrderConfirmation() instead
 */
export async function sendOrderConfirmationEmail(params: {
  to: string;
  orderId: string;
  customerName: string;
  orderDetails: {
    items: Array<{
      name: string;
      quantity: number;
      price: number; // price in paise
      variant?: string;
    }>;
    subtotal: number; // in paise
    discount: number; // in paise
    shipping: number; // in paise (required)
    total: number; // in paise
  };
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
    country?: string;
  };
  paymentMethod?: string;
}) {
  console.warn('sendOrderConfirmationEmail is deprecated. Use emailService.sendOrderConfirmation() instead');
  
  return emailService.sendOrderConfirmation({
    ...params,
    orderDate: new Date().toISOString(),
    shippingAddress: {
      ...params.shippingAddress,
      country: params.shippingAddress.country || 'India'
    },
    paymentMethod: params.paymentMethod || 'Paid Online'
  });
}
