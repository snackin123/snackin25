// cart-context.tsx
'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CART } from './constants';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weight?: string;
  description?: string;
  originalPrice?: number;
  isFree?: boolean;
  [key: string]: any;
}

export function isCartItem(item: any): item is CartItem {
  return item && 
         typeof item === 'object' && 
         'id' in item && 
         'name' in item && 
         'price' in item && 
         'quantity' in item &&
         'image' in item;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string | number) => number;
  cartValues: {
    subtotal: number;
    shipping: number;
    discount: number;
    comboDiscount: number;
    finalTotal: number;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'snackin_cart';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        return savedCart ? JSON.parse(savedCart) : [];
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
        return [];
      }
    }
    return [];
  });
  
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true when component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartValues = useMemo(() => {
    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      return sum + (price * item.quantity);
    }, 0);

    // Shipping is now free for all orders
    const shipping = 0;
    
    // Discount offer is currently disabled
    const discount = 0;
    
    // Calculate combo discount (₹100 off for 4+ items)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const comboDiscount = CART.COMBO_OFFER.ACTIVE && totalItems >= CART.COMBO_OFFER.MIN_ITEMS 
      ? CART.COMBO_OFFER.DISCOUNT_AMOUNT 
      : 0;
    
    // Calculate final total after applying shipping and discounts
    const finalTotal = Math.max(0, subtotal + shipping - discount - comboDiscount);

    return {
      subtotal,
      shipping,
      discount,
      comboDiscount,
      finalTotal
    };
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error('Failed to save cart to localStorage', error);
      }
    }
  }, [cart, isMounted]);

  const addToCart = useCallback((item: CartItem) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(cartItem => 
        String(cartItem.id) === String(item.id)
      );

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + (item.quantity || 1),
        };
        return updatedCart;
      } else {
        // Item doesn't exist, add new item with quantity 1 if not specified
        return [...prevCart, { ...item, quantity: item.quantity || 1 }];
      }
    });
  }, []);

  const removeFromCart = useCallback((id: string | number) => {
    setCart(prevCart => prevCart.filter(item => String(item.id) !== String(id)));
  }, []);

  const updateQuantity = useCallback((id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        String(item.id) === String(id) ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const getItemQuantity = useCallback((id: string | number) => {
    const item = cart.find(item => String(item.id) === String(id));
    return item ? item.quantity : 0;
  }, [cart]);

  const value = useMemo(() => ({
    cart,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    cartValues,
  }), [
    cart, 
    cartCount, 
    cartValues, 
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Helper hook to get cart count for the badge
export const useCartCount = () => {
  try {
    const context = useContext(CartContext);
    return context ? context.cartCount : 0;
  } catch (error) {
    // Return 0 if CartProvider is not available
    return 0;
  }
};
