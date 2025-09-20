// Import types from the types file
import type { 
  OrderItem, 
  ShippingAddress, 
  EmailContent 
} from './types/email.types';

// For backward compatibility
export interface OrderConfirmationEmailProps {
  orderId: string;
  customerName: string;
  orderDate: string;
  items?: OrderItem[];
  subtotal?: number;
  discount?: number;
  shipping?: number;
  total?: number;
  shippingAddress: ShippingAddress & { country?: string };
  paymentMethod?: string;
}

const formatPrice = (priceInPaise: number): string => {
  // Convert paise to rupees for display
  const priceInRupees = priceInPaise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(priceInRupees);
};

export const getOrderConfirmationEmail = ({
  orderId,
  customerName,
  orderDate,
  items = [],
  subtotal = 0,
  discount = 0,
  shipping = 0,
  total = 0,
  shippingAddress,
  paymentMethod = 'Paid Online',
}: OrderConfirmationEmailProps): EmailContent => {
  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">
          ${item.quantity} × ${item.name}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">
          ${formatPrice(item.price)}
        </td>
      </tr>`
    )
    .join('');

  const orderSummary = items
    .map((item) => `${item.quantity} × ${item.name} - ${formatPrice(item.price)}`)
    .join('\n      ');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - SnackIn</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background: #fff;
        }
        .header { 
          text-align: center; 
          padding: 20px 0; 
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 20px;
        }
        .logo { 
          max-width: 180px; 
          margin-bottom: 10px;
        }
        .greeting { 
          font-size: 24px; 
          color: #2d3748; 
          margin: 20px 0;
          text-align: center;
        }
        .message { 
          margin: 20px 0; 
          line-height: 1.6; 
          color: #4a5568;
          text-align: center;
        }
        .button {
          display: inline-block;
          background: #f0c14b;
          color: #111 !important;
          padding: 12px 25px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          margin: 5px;
        }
        .section-title {
          font-weight: bold;
          margin: 25px 0 10px 0;
          font-size: 16px;
          color: #2d3748;
        }
        .order-summary { 
          margin: 20px 0; 
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 15px;
        }
        .order-item { 
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #edf2f7;
        }
        .item-details { 
          flex: 2;
        }
        .item-price { 
          text-align: right;
          font-weight: 500;
        }
        .total-row { 
          display: flex; 
          justify-content: space-between; 
          padding: 8px 0;
          border-bottom: 1px solid #edf2f7;
        }
        .total-amount { 
          font-weight: bold; 
          font-size: 18px; 
          color: #B12704;
        }
        .savings { 
          color: #067D62; 
          margin: 10px 0; 
          text-align: right;
          font-size: 14px;
        }
        .footer { 
          margin-top: 40px; 
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #4a5568;
          font-size: 14px;
          line-height: 1.6;
        }
        @media only screen and (max-width: 600px) {
          .button {
            display: block;
            margin: 10px 0;
          }
          .section-title {
            font-size: 18px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="https://snackinofficial.com/Images/WhiteLogo.webp" alt="SnackIn" class="logo">
        <p style="color: #666; margin: 5px 0 0 0;">Delicious snacks delivered to your doorstep</p>
      </div>
      
      <div class="greeting">Thank you for your order!</div>
      
      <div class="message">
        Hi ${customerName}, your order is getting ready to be shipped. 
        We will notify you as soon as your order is dispatched.
        <br><br>
        You will receive your order in the next 3-5 business days.
      </div>

      <div style="margin: 30px 0; text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://snackinofficial.com'}/order-tracking?orderId=${orderId}" class="button">View Your Order</a>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://snackinofficial.com'}" class="button" style="background: #f1f1f1; color: #111 !important;">Visit Our Store</a>
      </div>

      <div class="section-title">Order summary</div>
      <div class="order-summary">
        ${itemRows}
        
        <div style="margin-top: 20px;">
          <div class="total-row">
            <span>Subtotal</span>
            <span>${formatPrice(subtotal)}</span>
          </div>
          ${discount > 0 ? `
            <div class="total-row">
              <span>Order discount</span>
              <span>-${formatPrice(discount)}</span>
            </div>
          ` : ''}
          <div class="total-row">
            <span>Shipping</span>
            <span>${shipping > 0 ? formatPrice(shipping) : 'FREE'}</span>
          </div>
          <div class="total-row">
            <span>Taxes</span>
            <span>₹0.00</span>
          </div>
          <div class="total-row" style="border-bottom: none; padding-bottom: 0;">
            <span>Total</span>
            <span class="total-amount">${formatPrice(total)}</span>
          </div>
          ${discount > 0 ? `
            <div class="savings">
              You saved ${formatPrice(discount)}
            </div>
          ` : ''}
        </div>
      </div>

      <div class="section-title">Customer information</div>
      <div style="display: flex; gap: 30px; margin-bottom: 30px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 250px;">
          <div style="font-weight: bold; margin-bottom: 10px;">Shipping address</div>
          <div style="line-height: 1.6;">
            ${shippingAddress.name}<br>
            ${shippingAddress.address}<br>
            ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
            India
          </div>
        </div>
        <div style="flex: 1; min-width: 250px;">
          <div style="font-weight: bold; margin-bottom: 10px;">Billing address</div>
          <div style="line-height: 1.6;">
            ${shippingAddress.name}<br>
            ${shippingAddress.address}<br>
            ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
            India
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 30px; margin-bottom: 20px; flex-wrap: wrap;">
        <div>
          <div style="font-weight: bold; margin-bottom: 5px;">Payment</div>
          <div>${paymentMethod || 'Paid Online'}</div>
        </div>
        <div>
          <div style="font-weight: bold; margin-bottom: 5px;">Shipping method</div>
          <div>${shipping > 0 ? 'Standard Shipping' : 'Free Shipping'}</div>
        </div>
      </div>

      <div class="footer">
        <p>We are committed to providing you with the best quality snacks made from natural ingredients. We're sure you'll love our products and enjoy the authentic taste of traditional Indian snacks.</p>
        <p>
          If you have any questions, reply to this email or contact us at 
          <a href="mailto:hello@snackinofficial.com" style="color: #0066c0; text-decoration: none;">hello@snackinofficial.com</a>
        </p>
      </div>
    </body>
    </html>
  `;

  const formattedOrderDate = new Date(orderDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const emailContent: EmailContent = {
    subject: `🎉 Your SnackIn Order #${orderId} is Confirmed!`,
    text: `
🌟 Thank you for your order, ${customerName}!

========================================
           ORDER CONFIRMATION          
========================================

🛒 ORDER #${orderId}
📅 ${formattedOrderDate}

📦 ORDER SUMMARY
${'='.repeat(40)}
${orderSummary}
${'='.repeat(40)}

💳 ORDER TOTAL
${'='.repeat(40)}
Subtotal: ${formatPrice(subtotal)}
Discount: -${formatPrice(discount)}
Shipping: N/A
${'-'.repeat(40)}
TOTAL: ${formatPrice(total)}

🏠 SHIPPING ADDRESS
${'='.repeat(40)}
${shippingAddress.name}
${shippingAddress.address}
${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}
📞 ${shippingAddress.phone}

🚚 WHAT'S NEXT?
${'='.repeat(40)}
We're preparing your order with care. You'll receive a shipping confirmation email with tracking details once your package is on its way.

💌 NEED HELP?
${'='.repeat(40)}
If you have any questions about your order, please reply to this email or contact our hello team at hello@snackinofficial.com

Thank you for choosing SnackIn! We're thrilled to have you as our customer.

Happy Snacking! 🎉

The SnackIn Team
    `,
    html: htmlContent,
  };

  return emailContent;
};