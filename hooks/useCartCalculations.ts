'use client';

import { useMemo, useEffect } from 'react';
import { CART } from '@/lib/constants';
import type { CartItem } from '@/lib/cart-context';

interface CartCalculations {
  deduplicatedCart: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  finalTotal: number;
}

export const useCartCalculations = (cart: CartItem[], cartCount: number): CartCalculations => {
  // Calculate subtotal
  const subtotal = useMemo(() => {
    const deduplicatedCart = cart.reduce<CartItem[]>((acc, item) => {
      const existingItem = acc.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
        return acc;
      }
      return [...acc, item];
    }, []);

    return deduplicatedCart.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }, [cart]);

  // No discounts applied
  const discount = 0;

  // Flat shipping fee
  const shipping = CART.SHIPPING_FEE;

  // Calculate final total
  const finalTotal = subtotal + shipping;

  // Update document title
  useEffect(() => {
    // Only run in the browser
    if (typeof window === 'undefined') return;
    
    document.title = cartCount > 0
      ? `(${cartCount}) Cart - The Snackin Company`
      : 'Cart - The Snackin Company';
  }, [cartCount]);

  return {
    deduplicatedCart: cart.reduce<CartItem[]>((acc, item) => {
      const existingItem = acc.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
        return acc;
      }
      return [...acc, item];
    }, []),
    subtotal,
    discount,
    shipping,
    finalTotal,
  };
};