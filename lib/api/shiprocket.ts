import { CreateShipmentPayload } from '@/types/shiprocket';

const API_BASE_URL = '/api/shipments';

export const createShipment = async (orderData: CreateShipmentPayload) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create shipment');
  }

  return response.json();
};

export const trackShipment = async (awbNumber: string) => {
  const response = await fetch(`${API_BASE_URL}/track?awb=${awbNumber}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to track shipment');
  }

  return response.json();
};
