import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string) {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(isNaN(numPrice) ? 0 : numPrice);
}

export function formatQuantity(quantity: number, itemName: string) {
  return `${quantity} ${itemName}${quantity !== 1 ? 's' : ''}`;
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateMobile(mobile: string): boolean {
  const re = /^[0-9]{10}$/;
  return re.test(mobile);
}
