import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Rate limiting configuration
const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000, // 1 minute
  MAX_REQUESTS: 5, // Max requests per window
};

const requestCounts = new Map<string, { count: number; resetTime: number }>();

interface PaymentVerificationRequest {
  orderId: string;
  paymentId: string;
  signature: string;
  orderInfo?: any;
}

const checkRateLimit = (ip: string): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const clientData = requestCounts.get(ip) || { count: 0, resetTime: now + RATE_LIMIT.WINDOW_MS };

  if (now > clientData.resetTime) {
    clientData.count = 0;
    clientData.resetTime = now + RATE_LIMIT.WINDOW_MS;
  }

  clientData.count += 1;
  requestCounts.set(ip, clientData);

  return {
    allowed: clientData.count <= RATE_LIMIT.MAX_REQUESTS,
    remaining: Math.max(0, RATE_LIMIT.MAX_REQUESTS - clientData.count),
  };
};

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = checkRateLimit(ip);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Too many requests',
          message: 'Please try again later',
          retryAfter: Math.ceil((rateLimit.remaining * RATE_LIMIT.WINDOW_MS) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil(RATE_LIMIT.WINDOW_MS / 1000).toString(),
            'X-RateLimit-Limit': RATE_LIMIT.MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': (Date.now() + RATE_LIMIT.WINDOW_MS).toString()
          }
        }
      );
    }

    // Validate environment variables
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay credentials not configured');
      return NextResponse.json(
        { 
          success: false,
          error: 'Payment gateway configuration error',
          code: 'CONFIGURATION_ERROR'
        },
        { status: 500 }
      );
    }

    // Parse and validate request body
    let requestBody: PaymentVerificationRequest;
    try {
      requestBody = await request.json();
      
      // Validate required parameters
      const missingParams = [];
      if (!requestBody.orderId) missingParams.push('orderId');
      if (!requestBody.paymentId) missingParams.push('paymentId');
      if (!requestBody.signature) missingParams.push('signature');
      
      if (missingParams.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required parameters: ${missingParams.join(', ')}`,
            code: 'MISSING_PARAMETERS'
          },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid request body',
          code: 'INVALID_REQUEST_BODY'
        },
        { status: 400 }
      );
    }
    
    const { orderId, paymentId, signature } = requestBody;
    
    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });
    
    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
      
    const isSignatureValid = generatedSignature === signature;
    
    if (!isSignatureValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid payment signature',
          code: 'INVALID_SIGNATURE'
        },
        { status: 400 }
      );
    }
    
    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);
    
    // Verify that the payment is for the correct order
    if (payment.order_id !== orderId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order ID does not match payment order ID',
          code: 'ORDER_ID_MISMATCH'
        },
        { status: 400 }
      );
    }
    
    // Verify that the payment is captured and the amount matches
    if (payment.status !== 'captured') {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment not captured',
          code: 'PAYMENT_NOT_CAPTURED',
          paymentStatus: payment.status
        },
        { status: 400 }
      );
    }
    
    // Here you would typically update your database with the payment status
    // For example:
    // await updateOrderStatus(orderId, {
    //   status: 'completed',
    //   paymentId,
    //   paymentStatus: payment.status,
    //   paymentMethod: payment.method,
    //   amountPaid: payment.amount / 100, // Convert back to rupees
    //   paidAt: new Date(payment.created_at * 1000), // Convert from seconds to milliseconds
    // });
    
    // Return success response
    return NextResponse.json({
      success: true,
      orderId,
      paymentId,
      paymentStatus: payment.status,
      amount: Number(payment.amount) / 100, // Convert from paise to rupees
      currency: payment.currency,
      method: payment.method,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('No such payment')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Payment not found',
            code: 'PAYMENT_NOT_FOUND'
          },
          { status: 404 }
        );
      }
      
      if (error.message.includes('Invalid key_id')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid Razorpay credentials',
            code: 'INVALID_CREDENTIALS'
          },
          { status: 500 }
        );
      }
    }
    
    // Generic error response
    return NextResponse.json(
      { 
        success: false, 
        error: 'An error occurred while verifying the payment',
        code: 'VERIFICATION_ERROR'
      },
      { status: 500 }
    );
  }
}

// GET method not allowed
export async function GET() {
  return new NextResponse(
    JSON.stringify({ 
      success: false, 
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    }),
    { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
