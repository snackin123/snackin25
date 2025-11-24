// Cart related constants
const CART = {
  // Shipping fees - flat ₹99 for all orders
  SHIPPING_FEE: 99, // Flat ₹99 shipping fee for all orders
  
  // Combo offer (Black Friday Mega Sale - Buy 2 Get 2 Free, mandatory 2 items)
  COMBO_OFFER: {
    ACTIVE: true,
    MIN_ITEMS: 2, // Mandatory minimum 2 items to activate Buy 2 Get 2 Free
    DISCOUNT_AMOUNT: 0, // Free items instead of discount
    FREE_ITEMS: 0, // Calculated as min(2, floor(totalItems/2))
    DESCRIPTION: 'Buy 2 Get 2 Free - Must buy 2 items to activate!'
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
