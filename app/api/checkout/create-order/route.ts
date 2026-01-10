import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export const dynamic = 'force-dynamic';

// Initialize Razorpay only if environment variables are available
let razorpay: Razorpay | null = null;

if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export async function POST(request: Request) {
  // Return early if Razorpay is not initialized
  if (!razorpay) {
    return NextResponse.json(
      { error: 'Payment service is not configured' },
      { status: 500 }
    );
  }
  try {
    const { amount, currency = 'INR', receipt } = await request.json();

    if (!amount || !receipt) {
      return NextResponse.json(
        { error: 'Amount and receipt are required' },
        { status: 400 }
      );
    }

    const options = {
      amount: amount, // amount in smallest currency unit (paise for INR)
      currency,
      receipt,
      payment_capture: 1, // auto capture payment
    };

    try {
      const order = await razorpay.orders.create(options);

      return NextResponse.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
      });
    } catch (error) {
      console.error('Razorpay API Error:', error);
      return NextResponse.json(
        { error: 'Failed to create order with payment provider' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
