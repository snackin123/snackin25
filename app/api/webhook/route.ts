import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { promises as fs, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { sendOrderConfirmationEmail, type OrderItem, type OrderDetails } from '@/lib/email';

// Logging function that writes to a file
async function logToFile(message: string, data?: any) {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logDir, 'webhook.log');
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] ${message}\n`;
    
    if (data) {
      logMessage += JSON.stringify(data, null, 2) + '\n\n';
    } else {
      logMessage += '\n';
    }
    
    try {
      // Check if directory exists, create if it doesn't
      try {
        await fs.access(logDir);
      } catch {
        await fs.mkdir(logDir, { recursive: true });
      }
      
      // Append to log file
      await fs.appendFile(logFile, logMessage, 'utf-8');
    } catch (error) {
      console.error('Error in logToFile file operations:', error);
    }
  } catch (error) {
    console.error('Error in logToFile:', error);
  }
}

// Read environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
let RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

// Initialize configuration
async function initializeConfig() {
  // Try to read from .env.local if not set in process.env
  if (!RAZORPAY_WEBHOOK_SECRET && existsSync(envPath)) {
    const envContent = await fs.readFile(envPath, 'utf8');
    const match = envContent.match(/RAZORPAY_WEBHOOK_SECRET=([^\s]+)/);
    if (match && match[1]) {
      RAZORPAY_WEBHOOK_SECRET = match[1].trim();
      await logToFile('Loaded RAZORPAY_WEBHOOK_SECRET from .env.local');
    } else {
      await logToFile('WARNING: RAZORPAY_WEBHOOK_SECRET not found in .env.local');
    }
  } else if (RAZORPAY_WEBHOOK_SECRET) {
    await logToFile('Using RAZORPAY_WEBHOOK_SECRET from environment variables');
  }

  // Log configuration
  await logToFile('Webhook Configuration', {
    hasWebhookSecret: !!RAZORPAY_WEBHOOK_SECRET,
    nodeEnv: process.env.NODE_ENV,
    envPath
  });

  if (!RAZORPAY_WEBHOOK_SECRET) {
    await logToFile('ERROR: RAZORPAY_WEBHOOK_SECRET is not set');
  }
}

// Initialize configuration when the module loads
const configPromise = initializeConfig();

// Helper function for consistent logging
function logWebhookEvent(event: string, data: any) {
  console.log('=== WEBHOOK EVENT ===');
  console.log(`Event: ${event}`);
  console.log('Data:', JSON.stringify(data, null, 2));
  console.log('====================');
}

export async function POST(request: Request) {
  // Wait for configuration to be initialized
  await configPromise;
  
  const requestId = Math.random().toString(36).substring(2, 8);
  
  try {
    await logToFile(`[${requestId}] Webhook request received`, {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries())
    });
    
    const text = await request.text();
    await logToFile(`[${requestId}] Raw request body`, { length: text.length });
    
    const signature = request.headers.get('x-razorpay-signature');
    await logToFile(`[${requestId}] Received signature`, { 
      signature,
      hasWebhookSecret: !!RAZORPAY_WEBHOOK_SECRET 
    });
    
    let webhookBody;
    try {
      webhookBody = JSON.parse(text);
      await logToFile(`[${requestId}] Parsed webhook body`, { 
        event: webhookBody.event,
        payloadKeys: Object.keys(webhookBody.payload || {})
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await logToFile(`[${requestId}] JSON parse error`, { 
        error: errorMessage,
        rawText: text.substring(0, 200) + (text.length > 200 ? '...' : '')
      });
      throw new Error('Invalid JSON format');
    }
    
    // Log signature verification details
    await logToFile(`[${requestId}] Verifying signature`, {
      secretLength: RAZORPAY_WEBHOOK_SECRET?.length || 0,
      requestBodyLength: text.length
    });
    
    // Generate the expected signature
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET.trim())
      .update(text)
      .digest('hex');
    
    const signatureMatch = signature === expectedSignature;
    
    await logToFile(`[${requestId}] Signature verification`, {
      receivedSignature: signature,
      expectedSignature,
      signatureMatch,
      secretPreview: RAZORPAY_WEBHOOK_SECRET 
        ? `${RAZORPAY_WEBHOOK_SECRET.substring(0, 2)}...${RAZORPAY_WEBHOOK_SECRET.substring(RAZORPAY_WEBHOOK_SECRET.length - 2)}`
        : 'NOT SET'
    });
    
    // Verify the signature (enabled for production)
    if (!signatureMatch) {
      await logToFile(`[${requestId}] ⚠️ Signature verification failed`, {
        receivedSignature: signature,
        expectedSignature,
        requestBody: webhookBody
      });
      return NextResponse.json(
        { error: 'Invalid signature' }, 
        { status: 400 }
      );
    }

    const event = webhookBody.event;
    const payload = webhookBody.payload.payment?.entity || webhookBody.payload;

    // Log the incoming webhook
    await logToFile(`[${requestId}] Processing webhook event: ${event}`, {
      webhookId: webhookBody.id,
      event,
      payloadKeys: Object.keys(payload || {})
    });

    // Handle different webhook events
    try {
      switch (event) {
        case 'payment.captured':
          await handleSuccessfulPayment(payload);
          await logToFile(`[${requestId}] Successfully processed payment.captured`, {
            paymentId: payload?.id,
            orderId: payload?.order_id
          });
          break;
          
        case 'payment.failed':
          await handleFailedPayment(payload);
          await logToFile(`[${requestId}] Processed payment.failed`, {
            paymentId: payload?.id,
            error: payload?.error
          });
          break;
          
        case 'order.paid':
          await handleOrderPaid(payload);
          await logToFile(`[${requestId}] Processed order.paid`, {
            orderId: payload?.id,
            amount: payload?.amount
          });
          break;
          
        default:
          await logToFile(`[${requestId}] Unhandled event type: ${event}`, webhookBody);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await logToFile(`[${requestId}] Error processing webhook`, {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error; // Re-throw to trigger the 500 error response
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Webhook handler failed', details: errorMessage },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(payment: any) {
  try {
    const orderId = payment.order_id || payment.notes?.orderId;
    const customerEmail = payment.email || payment.notes?.email;
    const customerName = payment.contact?.name || 'Valued Customer';
    const amount = payment.amount / 100; // Convert from paise to INR

    // Log the payment details
    console.log(`Processing successful payment ${payment.id} for order ${orderId}`);
    
    // Prepare order items for email
    const orderItems: OrderItem[] = [{
      name: 'Your Snackin Order',
      quantity: 1,
      price: payment.amount
    }];

    // Send confirmation email
    if (customerEmail) {
      try {
        const emailResponse = await sendOrderConfirmationEmail({
          to: customerEmail,
          orderId,
          customerName,
          orderDetails: {
            items: orderItems,
            subtotal: payment.amount,
            discount: 0,
            shipping: 0,
            total: payment.amount
          },
          shippingAddress: {
            // Add the required shipping address fields
            name: customerName || '',
            address: '',
            city: '',
            state: '',
            postalCode: '',
            phone: ''
          }
        });

        if (!emailResponse.success) {
          console.error('Failed to send confirmation email:', emailResponse.error);
        } else {
          console.log('Confirmation email sent to:', customerEmail);
        }
      } catch (error) {
        console.error('Error sending confirmation email:', error);
      }
    } else {
      console.warn('No customer email found for payment:', payment.id);
    }

    // TODO: Update order status in database
    // TODO: Update inventory

    return { success: true, orderId };
  } catch (error) {
    console.error('Error in handleSuccessfulPayment:', error);
    return { success: false, error: 'Failed to process payment' };
  }
}

async function handleFailedPayment(payment: any) {
  console.log('Payment failed:', payment.id);
  // TODO: Update order status to failed
  // Example: await prisma.order.update({ where: { paymentId: payment.id }, data: { status: 'FAILED' } });
}

async function handleOrderPaid(order: any) {
  console.log('Order paid:', order.id);
  // TODO: Trigger order fulfillment process
  // Example: await sendOrderConfirmationEmail(order);
}
