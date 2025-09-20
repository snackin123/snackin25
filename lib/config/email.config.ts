import dotenv from 'dotenv';

dotenv.config();

// Check if Resend API key is available
const resendApiKey = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY;
export const isEmailEnabled = !!resendApiKey;

export const emailConfig = {
  // Whether email functionality is enabled
  enabled: isEmailEnabled,
  
  // Sender email address
  from: 'The Snackin Company <orders@snackinofficial.com>',
  
  // Email service configuration
  resend: {
    apiKey: resendApiKey || '',
  },
  
  // Base URL for links in emails
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://snackinofficial.com',
  
  // Default values
  defaults: {
    paymentMethod: 'Paid Online',
    country: 'India',
  },
} as const;

// Log email configuration status
if (isEmailEnabled) {
  console.log('Email functionality is enabled with Resend');
} else {
  console.warn('Email functionality is disabled. Set RESEND_API_KEY to enable email notifications.');
}
