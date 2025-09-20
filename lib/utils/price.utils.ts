/**
 * Price conversion utilities
 * All prices are stored in paise (1 INR = 100 paise) for precision
 */

/**
 * Convert rupees to paise
 * @param rupees Amount in rupees
 * @returns Amount in paise
 */
export function toPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Convert paise to rupees
 * @param paise Amount in paise
 * @returns Amount in rupees
 */
export function toRupees(paise: number): number {
  return paise / 100;
}

/**
 * Format price for display
 * @param paise Amount in paise
 * @returns Formatted price string (e.g., "₹199.00")
 */
export function formatPrice(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toRupees(paise));
}

/**
 * Format price without currency symbol
 * @param paise Amount in paise
 * @returns Formatted price string without currency symbol (e.g., "199.00")
 */
export function formatPriceWithoutSymbol(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toRupees(paise));
}

/**
 * Calculate the total price of items including quantity
 * @param items Array of items with price and quantity
 * @returns Total price in paise
 */
export function calculateItemsTotal(
  items: Array<{ price: number; quantity: number }>
): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Calculate order totals
 * @param params Order details
 * @returns Object with calculated totals
 */
export function calculateOrderTotals(params: {
  items: Array<{ price: number; quantity: number }>;
  discount?: number;
  shipping: number;
  taxRate?: number;
}) {
  const subtotal = calculateItemsTotal(params.items);
  const discount = params.discount || 0;
  const shipping = params.shipping || 0;
  const taxRate = params.taxRate || 0;
  
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * (taxRate / 100));
  const total = taxableAmount + shipping + tax;
  
  return {
    subtotal,
    discount,
    shipping,
    tax,
    total,
  };
}
