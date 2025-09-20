import { NextResponse } from 'next/server';
import { emailService, isEmailEnabled } from '@/lib/services/email.service';

export async function POST(request: Request) {
  try {
    const { order, customerEmail, orderId } = await request.json();

    if (!isEmailEnabled) {
      return NextResponse.json(
        { success: true, message: 'Email functionality is disabled' },
        { status: 200 }
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order data is required' },
        { status: 400 }
      );
    }

    // Helper function to convert price to paise (1 INR = 100 paise)
    const toPaise = (rupees: number): number => Math.round(rupees * 100);

    // Map the order data to the expected format for the email service
    const result = await emailService.sendOrderConfirmation({
      to: customerEmail,
      orderId: orderId || `ORD-${Date.now()}`,
      customerName: order.shippingAddress?.name || order.contactDetails?.name || 'Customer',
      orderDetails: {
        items: order.items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: toPaise(parseFloat(item.price) || 0), // Convert to paise
          variant: item.variant || item.weight || ''
        })),
        subtotal: toPaise(order.subtotal || order.orderDetails?.subtotal || 0),
        discount: toPaise(order.discount || order.orderDetails?.discount || 0),
        shipping: toPaise(order.shipping || order.orderDetails?.shipping || 0),
        total: toPaise(order.total || order.orderDetails?.total || 0)
      },
      shippingAddress: {
        name: order.shippingAddress?.name || order.contactDetails?.name || '',
        address: order.shippingAddress?.address || order.shippingAddress?.street || '',
        city: order.shippingAddress?.city || '',
        state: order.shippingAddress?.state || '',
        postalCode: order.shippingAddress?.pincode || order.shippingAddress?.postalCode || '',
        phone: order.shippingAddress?.phone || order.contactDetails?.mobile || '',
        country: order.shippingAddress?.country || 'India'
      },
      paymentMethod: order.paymentMethod || 'Paid Online',
      orderDate: order.orderDate || new Date().toISOString()
    });

    if (!result.success) {
      console.error('Failed to send order confirmation:', result.error);
      return NextResponse.json(
        { error: 'Failed to send order confirmation email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Order confirmation email sent successfully',
      data: result.data 
    });
    
  } catch (error) {
    console.error('Error in send-order-confirmation:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred while sending the confirmation email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
