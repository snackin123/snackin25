import { createShipment } from '@/lib/api/shiprocket';
import { CreateShipmentPayload } from '@/types/shiprocket';

export const createOrderShipment = async (order: any) => {
  try {
    // Map your order data to Shiprocket's format
    const shipmentData: CreateShipmentPayload = {
      order_id: order.id,
      order_date: new Date(order.createdAt).toISOString().split('T')[0],
      pickup_location: 'Primary', // Your pickup location name in Shiprocket
      billing_customer_name: order.shippingAddress.name,
      billing_address: order.shippingAddress.addressLine1,
      billing_address_2: order.shippingAddress.addressLine2 || '',
      billing_city: order.shippingAddress.city,
      billing_pincode: order.shippingAddress.postalCode,
      billing_state: order.shippingAddress.state,
      billing_country: order.shippingAddress.country || 'India',
      billing_email: order.customerEmail,
      billing_phone: order.shippingAddress.phone,
      shipping_is_billing: true,
      order_items: order.items.map((item: any) => ({
        name: item.name,
        sku: item.sku || `ITEM_${item.id}`,
        units: item.quantity,
        selling_price: item.price,
      })),
      payment_method: order.paymentMethod || 'Prepaid',
      sub_total: order.subtotal,
      shipping_charges: order.shippingFee || 0,
      total_discount: order.discount || 0,
    };

    const result = await createShipment(shipmentData);
    return { success: true, data: result };
    
  } catch (error) {
    console.error('Failed to create shipment:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create shipment' 
    };
  }
};
