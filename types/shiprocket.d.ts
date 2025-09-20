// types/shiprocket.d.ts

/** Base response from ShipRocket API */
interface ShiprocketBaseResponse {
  status: number;
  message: string;
  [key: string]: any;
}

/** Authentication response */
export interface ShiprocketAuthResponse extends ShiprocketBaseResponse {
  token: string;
  token_type: string;
  expires_in: number;
}

/** Shipment tracking status */
export interface ShipmentTrackingStatus {
  status: string;
  status_code: number;
  status_date: string;
  status_location: string;
  status_type: 'INFO' | 'DELIVERED' | 'RTO' | 'LOST' | 'PICKUP' | 'SHIPPED';
  status_body: string;
}

/** Shipment tracking response */
export interface ShipmentTrackingResponse extends ShiprocketBaseResponse {
  tracking_data: {
    order_tracking: {
      awb_code: string;
      courier_company_id: string;
      courier_name: string;
      status: string;
      status_code: string;
      status_date: string;
      current_status: string;
      current_status_code: string;
      current_status_description: string;
      current_timestamp: string;
      shipment_track: ShipmentTrackingStatus[];
      ship_track: Array<{
        id: string;
        awb_code: string;
        courier_company_id: string;
        courier_name: string;
        tracking_data: ShipmentTrackingStatus[];
        etd: string;
      }>;
      track_url: string;
    };
  };
}

/** ShipRocket order item */
export interface ShiprocketOrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
  discount?: number;
  tax?: number;
  hsn?: number;
}

export interface ShiprocketAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  address_2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

/** Create shipment request payload */
export interface CreateShipmentPayload {
  /** Unique order ID from your system */
  order_id: string;
  
  /** Order date in YYYY-MM-DD format */
  order_date: string;
  
  /** Pickup location name as configured in ShipRocket */
  pickup_location: string;
  
  /** Channel ID if using multi-channel selling */
  channel_id?: string;
  
  /** Additional order comments */
  comment?: string;
  
  // Billing information
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  
  // Shipping information (if different from billing)
  shipping_is_billing?: boolean;
  shipping_customer_name?: string;
  shipping_last_name?: string;
  shipping_address?: string;
  shipping_address_2?: string;
  shipping_city?: string;
  shipping_pincode?: string;
  shipping_state?: string;
  shipping_country?: string;
  shipping_phone?: string;
  /** Order items */
  order_items: ShiprocketOrderItem[];
  
  /** Payment method (e.g., 'Prepaid', 'COD') */
  payment_method?: string;
  
  /** Shipping charges */
  shipping_charges?: number;
  
  /** Gift wrap charges */
  giftwrap_charges?: number;
  
  /** Transaction charges */
  transaction_charges?: number;
  
  /** Total discount applied */
  total_discount?: number;
  
  /** Subtotal amount */
  sub_total: number;
  
  /** Package dimensions (in cm) */
  length?: number;
  breadth?: number;
  height?: number;
  
  /** Package weight (in kg) */
  weight?: number;
  
  /** Additional options */
  [key: string]: any;
}

/** Create shipment response */
export interface CreateShipmentResponse extends ShiprocketBaseResponse {
  order_id: number;
  shipment_id: number;
  status: string;
  status_code: number;
  onboarding_completed_now: number;
  awb_code: string;
  courier_company_id: string;
  courier_name: string;
}

/** Error response from ShipRocket API */
export interface ShiprocketErrorResponse {
  message: string;
  errors?: {
    [key: string]: string[];
  };
  status_code: number;
  status: string;
}

/** Webhook event types */
export type ShiprocketWebhookEvent = 
  | 'order_status_update'
  | 'tracking_update'
  | 'rto_initiated'
  | 'rto_delivered'
  | 'ndr_raised'
  | 'ndr_delivered';

/** Webhook payload */
export interface ShiprocketWebhookPayload<T = any> {
  event: ShiprocketWebhookEvent;
  data: T;
  created_at: string;
  webhook_id: string;
}
