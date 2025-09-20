import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

let razorpay: Razorpay | null = null;

if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  console.log(
    'Razorpay Mode:',
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.startsWith('rzp_live_') ? 'LIVE' : 'TEST'
  );

  razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn('Razorpay credentials are not fully configured');
}

export async function POST(request: Request) {
  if (!razorpay) {
    return NextResponse.json({ error: 'Payment service is not configured' }, { status: 500 });
  }

  try {
    const {
      amount,
      currency = 'INR',
      receipt,
      contactDetails,
      addressDetails,
      cartItems,
    } = await request.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const amountInPaise = Math.round(Number(amount) * 100);
    if (isNaN(amountInPaise) || amountInPaise < 100) {
      return NextResponse.json({ error: 'Amount must be at least ₹1.00' }, { status: 400 });
    }

    const formatAddress = (addr: any) => {
      if (!addr) return '';
      return [
        addr.line1,
        addr.line2,
        addr.landmark,
        `${addr.city}, ${addr.state} - ${addr.pincode}`,
      ].filter(Boolean).join(', ');
    };

    const cartNoteEntries: Record<string, string> = {};
    cartItems?.slice(0, 10).forEach((item: any, index: number) => {
      cartNoteEntries[`Item ${index + 1}`] = `${item.quantity} x ${item.name} - ₹${item.price} each`;
    });

    const customerName = contactDetails?.name || 'Customer';
    const customerEmail = contactDetails?.email || '';
    const customerContact = contactDetails?.mobile?.replace(/\D/g, '') || '';

    const notes = {
      source: 'snackin_web_checkout',
      created_at: new Date().toISOString(),
      'Customer Name': customerName,
      'Customer Email': customerEmail,
      'Customer Phone': customerContact,
      'Shipping Address': formatAddress(addressDetails),
      address: JSON.stringify(addressDetails),
      cart_items: JSON.stringify(cartItems),
      ...cartNoteEntries,
    };

    const options = {
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: receipt || `order_rcpt_${Date.now()}`,
      payment_capture: 1,
      notes,
    };

    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      created_at: order.created_at,
      notes,
      customer: {
        name: customerName,
        email: customerEmail,
        contact: customerContact,
      }
    });
  } catch (error: any) {
    console.error('Razorpay order creation error:', {
      message: error.message,
      statusCode: error.statusCode,
      error: error.error,
    });

    return NextResponse.json(
      {
        error: 'Failed to create order',
        message: error.error?.description || error.message || 'Unknown error',
        code: error.statusCode || 500,
      },
      { status: error.statusCode || 500 }
    );
  }
}
