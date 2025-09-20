// Core exports
export { emailService } from './services/email.service';

// Configuration
export { emailConfig } from './config/email.config';

// Utilities
export { 
  toPaise, 
  toRupees, 
  formatPrice, 
  calculateItemsTotal, 
  calculateOrderTotals 
} from './utils/price.utils';

// Types
export type { 
  OrderItem, 
  ShippingAddress, 
  OrderDetails, 
  EmailContent, 
  EmailService, 
  EmailSendResult, 
  SendOrderConfirmationParams 
} from './types/email.types';

// Templates
export { generateOrderConfirmationEmail } from './templates/order-confirmation';

// Deprecated exports (for backward compatibility)
export { sendOrderConfirmationEmail } from './email';
