interface CartItem {
  offerPrice?: number;
  price: number;
  qty: number;
  [key: string]: any; // For any additional properties
}

interface Coupon {
  discount: number;
  [key: string]: any; // For any additional properties
}

interface ShippingInfo {
  name?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  [key: string]: any; // For any additional properties
}

interface CalculateTotalReturn {
  subtotal: number;
  discount?: number;
  total: number;
}

export function calculateTotal(cartItems: CartItem[], coupon?: Coupon | null): CalculateTotalReturn {
  const subtotal = cartItems.reduce(
    (sum: number, item: CartItem) => sum + (item.offerPrice || item.price) * item.qty,
    0
  );

  if (!coupon) return { subtotal, total: subtotal };

  const discount = subtotal * (coupon.discount / 100);
  const total = subtotal - discount;

  return {
    subtotal,
    discount,
    total,
  };
}

export function validateShippingInfo(data: ShippingInfo): Record<string, string> {
  const errors: Record<string, string> = {};
  
  if (!data.name?.trim()) errors.name = 'Name is required';
  if (!data.address?.trim()) errors.address = 'Address is required';
  if (!data.city?.trim()) errors.city = 'City is required';
  if (!data.postalCode?.trim()) errors.postalCode = 'Postal code is required';
  if (!data.phone?.trim()) errors.phone = 'Phone number is required';
  
  return errors;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}