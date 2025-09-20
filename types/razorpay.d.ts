declare global {
  interface Window {
    Razorpay: typeof Razorpay;
  }
}

export class Razorpay {
  constructor(options: RazorpayOptions);
  open(): void;
  on(event: string, callback: (response: any) => void): void;
  close(): void;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
    method?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
    backdrop_color?: string;
    hide_topbar?: boolean;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
  };
  handler?: (response: RazorpayPaymentSuccess) => void;
  config?: {
    display?: {
      blocks?: Record<string, any>;
      preferences?: {
        show_default_blocks?: boolean;
      };
    };
  };
}

export interface RazorpayPaymentSuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayError {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: any;
  };
}

export { };

