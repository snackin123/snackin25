export interface OrderItem {
  name: string;
  quantity: number;
  price: number; // in paise
  variant?: string;
}

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  country?: string;
}

export interface OrderDetails {
  items: OrderItem[];
  subtotal: number; // in paise
  discount?: number; // in paise
  shipping: number; // in paise
  total: number; // in paise
  tax?: number; // in paise
}

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

export interface EmailService {
  sendOrderConfirmation(params: SendOrderConfirmationParams): Promise<EmailSendResult>;
}

export interface EmailSendResult {
  success: boolean;
  data?: unknown;
  error?: Error;
}

export interface SendOrderConfirmationParams {
  to: string;
  orderId: string;
  customerName: string;
  orderDetails: OrderDetails;
  shippingAddress: ShippingAddress;
  paymentMethod?: string;
  orderDate?: string;
}
