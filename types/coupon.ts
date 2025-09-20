import type { CartItem } from '@/lib/cart-context';

export interface CouponState {
  couponCode: string;
  setCouponCode: (code: string) => void;
  isCouponApplied: boolean;
  showCouponInput: boolean;
  setShowCouponInput: (show: boolean) => void;
  isApplyingCoupon: boolean;
  couponError: string;
  setCouponError: (error: string) => void;
  successMessage: string;
  discount: number;
  setDiscount: (value: number) => void;
  setShipping: (value: number) => void;
  handleApplyCoupon: () => Promise<void>;
  handleRemoveCoupon: (setDiscount: (value: number) => void, setShipping: (value: number) => void, cart: CartItem[]) => void;
}
