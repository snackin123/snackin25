'use client';

import Image from 'next/image';
import { Gift } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/lib/cart-context';
import { products as allProducts } from '@/lib/data/products';
import { CART } from '@/lib/constants';
import { useCoupon } from '@/hooks/useCoupon';

interface CheckoutSidebarProps {
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  finalTotal: number;
  couponState: ReturnType<typeof useCoupon>;
  freeItems?: string[];
}

export const CheckoutSidebar = ({
  cartItems,
  subtotal,
  discount,
  shipping,
  finalTotal,
  couponState,
  freeItems = [],
}: CheckoutSidebarProps) => {
  const { couponCode, setCouponCode, isCouponApplied, showCouponInput, setShowCouponInput, isApplyingCoupon, couponError, setCouponError, successMessage, handleApplyCoupon, handleRemoveCoupon } = couponState;

  return (
    <div className="bg-white rounded-lg p-4 shadow mb-4">
      <h2 className="text-base font-semibold mb-2 text-red-900">Your Order</h2>
      {cartItems.map((item: CartItem) => (
        <div key={item.id} className="flex items-center gap-3 mb-2">
          <div className="relative w-10 h-10 bg-gray-100 rounded overflow-hidden">
            <Image
              src={item.image || '/placeholder.jpg'}
              alt={item.name}
              fill
              className="object-cover"
              sizes="40px"
              priority={false}
            />
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm text-gray-900">{item.name}</div>
            <div className="text-xs text-gray-700">Qty. {item.quantity}</div>
          </div>
          <div className="font-bold text-sm text-gray-900">{formatPrice((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity)}</div>
        </div>
      ))}

      {/* Free Items Display */}
      {freeItems.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-2 pt-2">
            <Gift className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-sm text-green-600">
              Free Items ({freeItems.length}): FREE
            </span>
          </div>
          {freeItems.map((itemId: string, index: number) => {
            const product = allProducts.find((p: any) => p.id === itemId);
            return product ? (
              <div key={itemId} className="flex items-center gap-3 mb-2 ml-6">
                <div className="relative w-10 h-10 bg-green-50 rounded overflow-hidden border border-green-200">
                  <Image
                    src={
                      product?.image?.startsWith('http')
                        ? product.image
                        : product?.image
                        ? product.image.startsWith('/')
                          ? product.image
                          : `/${product.image}`
                        : '/placeholder.jpg'
                    }
                    alt={product?.name || 'Product image'}
                    fill
                    className="object-cover"
                    sizes="40px"
                    priority={false}
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-green-700">{product.name}</div>
                  <div className="text-xs text-green-600 line-through">{product.originalPrice}</div>
                </div>
                <div className="font-bold text-sm text-green-600">FREE</div>
              </div>
            ) : null;
          })}
        </>
      )}

      <hr className="my-2" />
      <div className="flex justify-between text-xs mb-1 text-gray-800">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-green-700 text-sm">
          <span>Discount</span>
          <span>-{formatPrice(discount)}</span>
        </div>
      )}
      <div className="flex justify-between text-xs text-gray-800">
        <span>Shipping</span>
        <span className={shipping === 0 ? 'text-green-600' : ''}>
          {shipping === 0 ? 'FREE' : formatPrice(shipping)}
        </span>
      </div>
      <div className="flex justify-between font-bold text-base mt-2 text-amber-600">
        <span>Total</span>
        <span>{formatPrice(finalTotal)}</span>
      </div>
    </div>
  );
};
