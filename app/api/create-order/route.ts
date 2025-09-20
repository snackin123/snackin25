import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

// Ensure this route is not statically generated
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Ensure it runs on Node.js runtime

// Initialize Razorpay with environment variable validation
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const razorpay = getRazorpayInstance();
    const { items } = await request.json() as { items: CartItem[] };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      );
    }

    // Calculate total amount in paise (Razorpay's smallest currency unit)
    const amount = items.reduce((total, item) => {
      return total + (item.price * 100 * item.quantity);
    }, 0);

    const orderData = {
      amount: Math.round(amount), // Ensure it's an integer
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      payment_capture: true, // Auto-capture payment
      notes: {
        items: JSON.stringify(items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })))
      },
    };

    const order = await razorpay.orders.create(orderData);

    // Create a response object with the data we want to return
    const responseData = {
      id: order.id,
      entity: order.entity,
      amount: amount / 100, // Convert back to rupees for the frontend
      amount_paid: 0,
      amount_due: amount / 100,
      currency: order.currency,
      receipt: order.receipt,
      offer_id: order.offer_id || null,
      status: order.status,
      attempts: order.attempts,
      notes: order.notes,
      created_at: order.created_at,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Order creation error:', error);
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('credentials')) {
        console.error('Razorpay credentials are missing or invalid');
        return NextResponse.json(
          { error: 'Payment service configuration error' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
}

export function GET() {
  return new NextResponse(
    JSON.stringify({ 
      message: 'Method not allowed',
      allowedMethods: ['POST']
    }), 
    { 
      status: 405, 
      headers: { 
        'Content-Type': 'application/json',
        'Allow': 'POST'
      } 
    }
  );
}