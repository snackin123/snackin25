'use client';

import { useState } from 'react';
import type { CartItem } from '@/lib/cart-context';
import { CART } from '@/lib/constants';

interface CouponState {
  couponCode: string;
  setCouponCode: (code: string) => void;
  isCouponApplied: boolean;
  showCouponInput: boolean;
  setShowCouponInput: (show: boolean) => void;
  isApplyingCoupon: boolean;
  couponError: string;
  setCouponError: (error: string) => void;
  successMessage: string;
  setSuccessMessage: (message: string) => void;
  discount: number;
  setDiscount: (value: number) => void;
  shipping: number;
  setShipping: (value: number) => void;
  handleApplyCoupon: () => Promise<void>;
  handleRemoveCoupon: () => void;
}

export const useCoupon = (subtotal: number): CouponState => {
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(CART.SHIPPING_FEE);

  const handleApplyCoupon = async () => {
    setIsApplyingCoupon(true);
    setCouponError('');
    setSuccessMessage('');
    try {
      if (couponCode.trim() === 'TSNC79') {
        localStorage.setItem('couponCode', 'TSNC79');
        setShipping(0); // Free shipping
        setSuccessMessage('Free shipping applied!');
        setIsCouponApplied(true);
      } else if (couponCode.trim() === '15OFF') {
        localStorage.setItem('couponCode', '15OFF');
        setDiscount(Math.round(subtotal * 0.15)); // 15% off
        setSuccessMessage('15% discount applied!');
        setIsCouponApplied(true);
      } else {
        throw new Error('Invalid coupon code');
      }
    } catch (error: any) {
      setCouponError(error.message || 'Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    const couponCode = localStorage.getItem('couponCode');
    localStorage.removeItem('couponCode');
    setCouponCode('');
    setIsCouponApplied(false);
    setShowCouponInput(false);
    setCouponError('');
    setSuccessMessage('');
    setDiscount(0);
    setShipping(CART.SHIPPING_FEE);
  };

  return {
    couponCode,
    setCouponCode,
    isCouponApplied,
    showCouponInput,
    setShowCouponInput,
    isApplyingCoupon,
    couponError,
    setCouponError,
    successMessage,
    setSuccessMessage,
    discount,
    setDiscount,
    shipping,
    setShipping,
    handleApplyCoupon,
    handleRemoveCoupon,
  };
};