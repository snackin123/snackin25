import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { couponCode, cart } = await request.json();

    console.log('Received coupon code:', couponCode);
    console.log('Received cart:', cart);

    // Calculate subtotal from cart items
    let newSubtotal = cart.reduce((sum: number, item: any) => sum + (parseFloat(item.price) * item.quantity), 0);
    let newDiscount = 0;
    let shippingFee = 79; // Standard shipping fee

    if (couponCode === 'TSNC79') {
      // Apply free shipping (₹79 off)
      newDiscount = 79;
      shippingFee = 0; // Set shipping fee to 0 since it's free shipping
    } else if (couponCode) {
      // Handle invalid coupon
      return NextResponse.json(
        { message: 'Invalid or expired coupon code.' },
        { status: 400 }
      );
    }

    let newFinalTotal = newSubtotal - newDiscount + shippingFee;
    if (newFinalTotal < 0) newFinalTotal = 0; // Ensure total doesn't go negative

    return NextResponse.json({
      newSubtotal: newSubtotal.toFixed(2),
      newDiscount: newDiscount.toFixed(2),
      newFinalTotal: newFinalTotal.toFixed(2),
      message: couponCode ? `Coupon '${couponCode}' applied successfully!` : 'No coupon applied.',
    });

  } catch (error: any) {
    console.error('Error applying coupon:', error);
    return NextResponse.json(
      { message: 'An error occurred while applying the coupon.', error: error.message },
      { status: 500 }
    );
  }
} 