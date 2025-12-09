'use client';

import { useCallback, useRef } from 'react';
import type { CartItem } from '@/lib/cart-context';
import { products as allProducts } from '@/lib/data/products';

interface ContactDetails {
  name: string;
  email: string;
  mobile: string;
}

interface AddressDetails {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  theme: { color: string; backdropColor: string };
  modal: { ondismiss: () => void; escape: boolean; backdropclose: boolean };
  config: { display: { blocks: any; sequence: string[]; preferences: { show_default_blocks: boolean } } };
  checkout: { method: { [key: string]: string } };
  prefill: { name: string; email: string; contact: string };
  notes: { [key: string]: string };
  retry: { enabled: boolean; max_count: number };
  timeout: number;
  remember_customer: boolean;
}

declare const Razorpay: {
  new(options: RazorpayOptions): {
    open: () => void;
    on: (event: string, callback: (response: any) => void) => void;
    close: () => void;
  };
};

interface UseRazorpayCheckoutProps {
  razorpayKey: string;
  finalTotal: number;
  contactDetails: ContactDetails;
  addressDetails: AddressDetails;
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  freeItems?: string[];
  setOrderPlaced: (placed: boolean) => void;
  setOrderDetails: (details: any) => void;
  clearCart: () => void;
  setErrorMessage: (message: string) => void;
  setCheckoutStep: (step: 'cart' | 'contact' | 'address' | 'summary' | 'payment') => void;
  setShowModal: (show: boolean) => void;
}

export const useRazorpayCheckout = ({
  razorpayKey,
  finalTotal,
  contactDetails,
  addressDetails,
  cartItems,
  subtotal,
  discount,
  shipping,
  freeItems = [],
  setOrderPlaced,
  setOrderDetails,
  clearCart,
  setErrorMessage,
  setCheckoutStep,
  setShowModal,
}: UseRazorpayCheckoutProps) => {
  const razorpayScriptLoaded = useRef(false);

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.id = 'razorpay-checkout-script';
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.body.appendChild(script);
    });
  }, []);

  const checkRazorpayHealth = (): boolean => {
    try {
      if (typeof window === 'undefined' || !(window as any).Razorpay) return false;
      return !!razorpayKey;
    } catch {
      return false;
    }
  };

  const getFreeItemNames = (freeItemIds: string[]): string => {
    return freeItemIds.map(id => {
      const product = allProducts.find(p => p.id === id);
      return product ? product.name : 'Free Item';
    }).join(', ');
  };

  const generateOrderDescription = (items: CartItem[]): string => {
    if (items.length === 0) return 'Order Payment';
    const itemsSummary = items.reduce<Record<string, number>>((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + item.quantity;
      return acc;
    }, {});
    const description = Object.entries(itemsSummary)
      .map(([name, quantity]) => `${quantity}x ${name}`)
      .join(', ');
    return description.length > 100 ? description.substring(0, 97) + '...' : description;
  };

  const handlePayment = async () => {
    setErrorMessage('');
    try {
      if (!razorpayKey) throw new Error('Payment gateway is not configured');
      if (cartItems.length === 0) throw new Error('Your cart is empty');

      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          currency: 'INR',
          contactDetails,
          addressDetails,
          cartItems,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }

      const order = await response.json();
      await loadRazorpayScript();

      if (!(window as any).Razorpay) {
        throw new Error('Payment gateway not available');
      }

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: Math.round(finalTotal * 100),
        currency: 'INR',
        name: 'The Snackin Company',
        description: generateOrderDescription(cartItems),
        order_id: order.id,
        handler: (response: any) => {
          const orderData = {
            id: order.id,
            date: new Date().toISOString(),
            total: finalTotal,
            customerEmail: contactDetails.email,
            customerName: contactDetails.name,
            customerPhone: contactDetails.mobile,
            shippingAddress: addressDetails,
            paymentStatus: 'paid',
            status: 'confirmed',
            items: cartItems.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
              weight: item.weight,
            })),
            subtotal,
            shipping,
            discount,
          };

          setOrderPlaced(true);
          setOrderDetails({ ...orderData, razorpay_order_id: order.id, razorpay_payment_id: response.razorpay_payment_id });

          // Safe localStorage handling
          try {
            localStorage.setItem('currentOrder', JSON.stringify({
              ...orderData,
              razorpay_order_id: order.id,
              razorpay_payment_id: response.razorpay_payment_id,
              customerEmail: contactDetails.email,
              items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                weight: item.weight,
              })),
              subtotal,
              shipping,
              total: finalTotal,
              shippingAddress: addressDetails,
              contactDetails,
            }));

            const orderHistory = JSON.parse(localStorage.getItem('snackin_orders') || '[]');
            orderHistory.push(orderData);
            localStorage.setItem('snackin_orders', JSON.stringify(orderHistory));
          } catch (storageError) {
            console.error('Failed to save order to localStorage:', storageError);
          }

          clearCart();
          setShowModal(false);
          window.location.href = `/order-success?order_id=${order.id}&payment_id=${response.razorpay_payment_id}`;
        },
        theme: { color: '#F59E0B', backdropColor: '#FFFBEB' },
        modal: { ondismiss: () => {}, escape: false, backdropclose: false },
        config: {
          display: {
            blocks: {
              upi: { name: 'UPI', instruments: [{ method: 'upi', flows: ['collect', 'intent', 'qr'] }] },
              netbanking: { name: 'Net Banking', instruments: [{ method: 'netbanking' }] },
              card: { name: 'Credit/Debit Card', instruments: [{ method: 'card' }] },
              wallet: { name: 'Wallets', instruments: [{ method: 'wallet' }] },
              paylater: { name: 'Pay Later', instruments: [{ method: 'paylater' }] },
            },
            sequence: ['block.upi', 'block.card', 'block.netbanking', 'block.wallet', 'block.paylater'],
            preferences: { show_default_blocks: true },
          },
        },
        checkout: { method: { netbanking: '1', card: '1', upi: '1', wallet: '1' } },
        prefill: {
          name: contactDetails.name || contactDetails.mobile,
          email: contactDetails.email,
          contact: contactDetails.mobile.replace(/\s/g, ''),
        },
        notes: {
          source: 'snackin_web_checkout',
          customer_email: contactDetails.email,
          customer_name: contactDetails.name,
          customer_phone: contactDetails.mobile,
          order_total: `₹${finalTotal}`,
          cart_items: cartItems.map(item => `${item.quantity}x ${item.name} - ₹${item.price * item.quantity}`).join(', '),
          cart_summary: `${cartItems.length} item(s) - ₹${subtotal}`,
          shipping_address: `${addressDetails.line1}, ${addressDetails.city}, ${addressDetails.state} - ${addressDetails.pincode}`,
          free_items_count: freeItems.length.toString(),
          free_items_value: freeItems.length > 0 ? `₹${freeItems.length * 129}` : '₹0',
          free_items_names: getFreeItemNames(freeItems),
          created_at: new Date().toISOString()
        },
        retry: { enabled: true, max_count: 4 },
        timeout: 900,
        remember_customer: true,
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        const error = response.error || {};
        let userMessage = 'Payment failed. ';
        if (error.code === 'PAYMENT_CANCELLED') {
          userMessage = 'Payment was cancelled. Please try again.';
        } else if (error.code === 'NETWORK_ISSUE') {
          userMessage = 'Network issue occurred. Please check your internet connection.';
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
          userMessage = 'Insufficient funds. Please try a different payment method.';
        } else if (error.code === 'INVALID_CARD_DETAILS') {
          userMessage = 'Invalid card details. Please check and try again.';
        } else if (error.description) {
          userMessage += error.description;
        } else {
          userMessage += 'Please try again or use a different payment method.';
        }
        setErrorMessage(userMessage);
      });
      rzp.open();
    } catch (error: any) {
      setErrorMessage(`Payment Error: ${error.message || 'Failed to process payment'}. Please try again.`);
    }
  };

  return {
    handlePayment,
    checkRazorpayHealth,
    loadRazorpayScript,
  };
};
