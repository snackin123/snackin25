// Cart related constants
const CART = {
  // Shipping fees - flat ₹79 for all orders
  SHIPPING_FEE: 79, // Flat ₹79 shipping fee for all orders
  
  // Combo offer
  COMBO_OFFER: {
    ACTIVE: true,
    MIN_ITEMS: 4, // Minimum 4 items required for the offer
    DISCOUNT_AMOUNT: 100, // ₹100 off for 4+ items
    DESCRIPTION: '₹100 off on 4+ items'
  },
  
  // Other cart settings
  MIN_ORDER_AMOUNT_FOR_DISCOUNT: 0, // No minimum order amount required for combo offer
  COUPON_FEATURE_ENABLED: false, // Coupons disabled
};

// Validation patterns
const VALIDATION = {
  MOBILE: /^[6-9]\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Currency
const CURRENCY = '₹';

// Payment related
const PAYMENT = {
  CURRENCY: 'INR',
  MAX_RETRIES: 3,
  TIMEOUT: 30000, // 30 seconds
};

// Order statuses
const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Export all constants
export {
  CART,
  VALIDATION,
  CURRENCY,
  PAYMENT,
  ORDER_STATUS
};
