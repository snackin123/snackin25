/**
 * ShipRocket Configuration
 * 
 * This file contains configuration for the ShipRocket shipping service.
 * All sensitive values should be provided via environment variables.
 */

/**
 * Default package dimensions (in cm)
 * These are fallback values and should be overridden per product when possible
 */
export const DEFAULT_PACKAGE_DIMENSIONS = {
  length: 20,
  width: 15,
  height: 5,
  weight: 0.5, // in kg
};

/**
 * Default shipping charges (in INR)
 * These values can be overridden based on your shipping rules
 */
export const DEFAULT_SHIPPING_CHARGES = {
  standard: 50,
  express: 100,
  cod: 30, // Additional charges for Cash on Delivery
};

/**
 * Default pickup location details
 * These should be configured in your ShipRocket dashboard
 */
export const PICKUP_LOCATION = {
  name: 'Primary',
  email: process.env.SHIPROCKET_PICKUP_EMAIL || '',
  phone: process.env.SHIPROCKET_PICKUP_PHONE || '',
  address: process.env.SHIPROCKET_PICKUP_ADDRESS || '',
  city: process.env.SHIPROCKET_PICKUP_CITY || '',
  state: process.env.SHIPROCKET_PICKUP_STATE || '',
  country: 'India',
  pincode: process.env.SHIPROCKET_PICKUP_PINCODE || '',
};

/**
 * Shipping service types and their codes
 */
export const SHIPPING_SERVICES = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  // Add more service types as needed
} as const;

/**
 * Courier codes for different shipping services
 */
export const COURIER_CODES = {
  STANDARD: 'STANDARD',
  SURFACE: 'SURFACE',
  AIR: 'AIR',
  // Add more courier codes as needed
} as const;

/**
 * Default shipping preferences
 */
export const SHIPPING_PREFERENCES = {
  preferred_courier_company: '', // Leave empty for best rate
  // Set to specific courier ID if you have a preferred courier
  // e.g., '1' for Delhivery, '3' for Ecom Express, etc.
};

/**
 * Get the base URL for ShipRocket API
 * @returns {string} The base URL for ShipRocket API
 */
export const getApiBaseUrl = (): string => {
  return process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';
};

/**
 * Validate if all required ShipRocket environment variables are set
 * @throws {Error} If any required environment variables are missing
 */
export const validateEnvironment = (): void => {
  const requiredVars = [
    'SHIPROCKET_EMAIL',
    'SHIPROCKET_PASSWORD',
    'SHIPROCKET_BASE_URL',
    'SHIPROCKET_PICKUP_EMAIL',
    'SHIPROCKET_PICKUP_PHONE',
    'SHIPROCKET_PICKUP_ADDRESS',
    'SHIPROCKET_PICKUP_CITY',
    'SHIPROCKET_PICKUP_STATE',
    'SHIPROCKET_PICKUP_PINCODE',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required ShipRocket environment variables: ${missingVars.join(', ')}`);
  }
};

/**
 * Get the default headers for ShipRocket API requests
 * @param token - The authentication token (optional)
 * @returns {Record<string, string>} The headers object
 */
export const getDefaultHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};
