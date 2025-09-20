import { EmailContent } from '../types/email.types';

// Brand colors
const brandColors = {
  primary: '#7F1D1D',
  secondary: '#FECACA',
  lightBg: '#FFF5F5',
  border: '#E5E7EB',
  text: '#1F2937',
  textLight: '#6B7280',
  white: '#FFFFFF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  variant?: string;
}

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  country?: string;
}

interface OrderConfirmationParams {
  orderId: string;
  customerName: string;
  orderDate: string;
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod?: string;
  baseUrl: string;
  estimatedDeliveryDays?: string;
}

interface AddressData {
  name: string;
  addressLines: string[];
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface OrderSummary {
  items: Array<{ name: string; quantity: number; price: string; variant?: string }>;
  subtotal: string;
  discount?: string;
  shipping: string;
  total: string;
}

const formatPrice = (priceInPaise: number): string => {
  const priceInRupees = priceInPaise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceInRupees);
};

const prepareAddressData = (address: ShippingAddress): AddressData => ({
  name: address.name,
  addressLines: address.address.split(',').map(line => line.trim()),
  city: address.city,
  state: address.state,
  postalCode: address.postalCode,
  country: address.country || 'India',
  phone: address.phone,
});

const prepareOrderSummary = (params: OrderConfirmationParams): OrderSummary => ({
  items: params.items.map(item => ({
    name: item.name,
    quantity: item.quantity,
    price: formatPrice(item.price * item.quantity),
    variant: item.variant,
  })),
  subtotal: formatPrice(params.subtotal),
  discount: params.discount && params.discount > 0 ? formatPrice(params.discount) : undefined,
  shipping: formatPrice(params.shipping),
  total: formatPrice(params.total),
});

export const generateOrderConfirmationEmail = (params: OrderConfirmationParams): EmailContent => {
  const {
    orderId,
    customerName,
    orderDate: rawOrderDate,
    items,
    subtotal,
    discount = 0,
    shipping,
    total,
    shippingAddress,
    paymentMethod = 'Online Payment',
    baseUrl,
    estimatedDeliveryDays,
  } = params;

  const orderDateObj = new Date(rawOrderDate || new Date());
  const formattedDate = orderDateObj.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const textContent = generateTextContent({
    orderId,
    customerName,
    orderDate: formattedDate,
    items,
    subtotal,
    discount,
    shipping,
    total,
    shippingAddress,
    paymentMethod,
    baseUrl,
    estimatedDeliveryDays,
  });

  const htmlContent = generateHtmlContent({
    orderId,
    customerName,
    orderDate: formattedDate,
    items,
    subtotal,
    discount,
    shipping,
    total,
    shippingAddress,
    paymentMethod,
    baseUrl,
    estimatedDeliveryDays,
  });

  return {
    subject: `🎉 Your Order #${orderId} is Confirmed! - The Snackin Company™`,
    html: htmlContent,
    text: textContent,
  };
};

const formatAddress = (address: ShippingAddress, showPhone: boolean = true): string => {
  const data = prepareAddressData(address);
  return `
    <div class="address-content">
      <div class="address-row">
        <span class="icon">👤</span>
        <span>${data.name}</span>
      </div>
      <div class="address-row">
        <span class="icon">🏠</span>
        <span>
          ${data.addressLines.join('<br>')}<br>
          ${data.city}, ${data.state} ${data.postalCode}<br>
          ${data.country}
        </span>
      </div>
      ${showPhone && data.phone ? `
      <div class="address-row">
        <span class="icon">📞</span>
        <span>${data.phone}</span>
      </div>` : ''}
    </div>
  `;
};

const generateHtmlContent = (params: {
  orderId: string;
  customerName: string;
  orderDate: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  baseUrl: string;
  estimatedDeliveryDays?: string;
}) => {
  const orderSummaryData = prepareOrderSummary(params);

  const orderItemsHtml = orderSummaryData.items.map(item => `
    <tr>
      <td class="product-item">
        <div class="product-details">
          <div class="product-name">${item.name}</div>
          ${item.variant ? `<div class="variant">${item.variant}</div>` : ''}
          <div class="quantity">Qty: ${item.quantity}</div>
        </div>
        <div class="product-price">
          <div class="total-price">${item.price}</div>
          <div class="unit-price">${formatPrice(params.items.find(i => i.name === item.name)!.price)} each</div>
        </div>
      </td>
    </tr>
  `).join('');

  const orderSummaryHtml = `
    <tr>
      <td class="summary-row">
        <span>Subtotal</span>
        <span>${orderSummaryData.subtotal}</span>
      </td>
    </tr>
    ${orderSummaryData.discount ? `
    <tr>
      <td class="summary-row discount">
        <span>Order Discount</span>
        <span>-${orderSummaryData.discount}</span>
      </td>
    </tr>` : ''}
    <tr>
      <td class="summary-row">
        <span>Shipping</span>
        <span>${orderSummaryData.shipping}</span>
      </td>
    </tr>
    <tr>
      <td class="summary-row total">
        <span>Total</span>
        <span>${orderSummaryData.total}</span>
      </td>
    </tr>`;

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Order Confirmation - The Snackin Company&trade;</title>
      <style type="text/css">
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: ${brandColors.text};
          margin: 0;
          padding: 0;
          background-color: ${brandColors.lightBg};
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        td { padding: 0; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        a { text-decoration: none; }
        .container {
          max-width: 600px;
          width: 100%;
          margin: 20px auto;
          background: ${brandColors.lightBg};
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          border: 1px solid ${brandColors.border};
        }
        .header {
          padding: 40px 24px 32px;
          text-align: center;
          background: ${brandColors.primary};
          border-bottom: 1px solid ${brandColors.border};
        }
        .content { padding: 32px 24px 24px; }
        .box {
          background: rgba(255, 255, 255, 0.05);
          padding: 24px;
          border-radius: 8px;
          border: 1px solid ${brandColors.border};
          box-sizing: border-box;
        }
        .order-details { margin: 24px 0; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08); }
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, ${brandColors.border}, transparent);
          margin: 30px 0;
          border: none;
        }
        .order-number { font-size: 18px; font-weight: 600; color: ${brandColors.primary}; }
        .order-date { color: ${brandColors.textLight}; font-size: 14px; }
        .section-title {
          font-size: 15px;
          font-weight: 600;
          color: ${brandColors.primary};
          margin: 0 0 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid ${brandColors.border};
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .product-list { width: 100%; margin: 10px 0; }
        .product-item { padding: 12px 0; border-bottom: 1px solid ${brandColors.border}; }
        .product-details { flex: 1; padding-right: 16px; }
        .product-name { font-weight: 500; margin-bottom: 4px; line-height: 1.4; color: ${brandColors.text}; }
        .variant, .quantity { color: ${brandColors.textLight}; font-size: 14px; margin-bottom: 4px; }
        .product-price { text-align: right; min-width: 100px; }
        .total-price { font-weight: 600; color: ${brandColors.primary}; margin-bottom: 2px; }
        .unit-price { color: #9CA3AF; font-size: 13px; }
        .summary-row { padding: 12px 0; border-bottom: 1px solid ${brandColors.border}; display: flex; justify-content: space-between; }
        .summary-row.total { padding: 16px 0 0; font-weight: 600; font-size: 18px; }
        .summary-row.total span:last-child { color: ${brandColors.primary}; }
        .summary-row.discount { color: ${brandColors.success}; }
        .address-content { display: flex; flex-direction: column; gap: 12px; }
        .address-row { display: flex; align-items: flex-start; }
        .icon { display: inline-block; width: 24px; }
        .footer { text-align: center; padding: 40px 20px; background: #f9f9f9; border-top: 1px solid ${brandColors.border}; font-size: 14px; color: ${brandColors.textLight}; }
        @media screen and (max-width: 600px) {
          .container { width: 100% !important; margin: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
          .content, .header, .footer { padding-left: 15px !important; padding-right: 15px !important; }
          .order-number, .section-title { font-size: 16px !important; }
          .product-name, .total-price { font-size: 14px !important; }
          .box { min-width: unset !important; margin-bottom: 20px !important; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div style="color:${brandColors.white};font-size:24px;font-weight:bold;text-align:center;margin-bottom:20px;">The Snackin Company&trade;</div>
          <div style="background: rgba(255, 255, 255, 0.15); display: inline-block; padding: 8px 20px; border-radius: 50px; margin-bottom: 20px;">
            <span style="color: ${brandColors.white}; font-weight: 600; font-size: 14px; letter-spacing: 0.5px;">ORDER CONFIRMED</span>
          </div>
          <h1 style="margin: 15px 0 10px; font-size: 28px; color: ${brandColors.white}; font-weight: 700;">Thank you for your order!</h1>
          <p style="color: ${brandColors.white}; margin: 0 0 15px; font-size: 16px; line-height: 1.6;">
            Hi ${params.customerName}, your order is getting ready to be shipped. We will notify you as soon as your order is dispatched.
          </p>
          <div class="header-spacer"></div>
        </div>
        <div class="content">
          <div class="order-details box">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <div>
                <div class="order-number">Order #${params.orderId}</div>
                <div class="order-date">Placed on ${params.orderDate}</div>
              </div>
              <div style="background: rgba(255, 255, 255, 0.1); padding: 8px 16px; border-radius: 50px; font-size: 14px; font-weight: 500;">
                ${params.items.length} ${params.items.length === 1 ? 'item' : 'items'}
              </div>
            </div>
            <h2 class="section-title">Order Summary</h2>
            <table class="product-list" cellspacing="0" cellpadding="0">
              <tbody>
                ${orderItemsHtml}
              </tbody>
            </table>
            <div style="margin: 20px 0;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                  ${orderSummaryHtml}
                </tbody>
              </table>
            </div>
            ${orderSummaryData.discount ? `
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px dashed rgba(16, 185, 129, 0.3); border-radius: 6px; padding: 12px; text-align: center;">
              <span style="color: ${brandColors.success}; font-weight: 500;">🎉 You saved ${orderSummaryData.discount} on this order!</span>
            </div>` : ''}
          </div>
          <div class="section-divider"></div>
          <div style="display: flex; flex-wrap: wrap; gap: 24px; margin: 32px 24px;">
            <div class="box address-box">
              <h3 class="section-title">SHIPPING ADDRESS</h3>
              ${formatAddress(params.shippingAddress)}
            </div>
            <div class="box address-box">
              <h3 class="section-title">BILLING ADDRESS</h3>
              <div style="color: ${brandColors.textLight}; font-size: 14px;">
                Same as shipping address
              </div>
            </div>
          </div>
          <div class="section-divider"></div>
          <div style="display: flex; flex-wrap: wrap; gap: 24px; margin: 32px 24px;">
            <div class="box payment-shipping-box">
              <h3 class="section-title">Payment Method</h3>
              <div style="color: ${brandColors.primary}; font-size: 15px; line-height: 1.5; padding-left: 24px;">
                ${params.paymentMethod}
              </div>
            </div>
            <div class="box payment-shipping-box">
              <h3 class="section-title">Shipping Method</h3>
              <div style="color: ${brandColors.primary}; font-size: 15px; line-height: 1.5; margin-top: 4px; padding-left: 24px;">
                Standard Shipping (5-6 business days)
                ${params.estimatedDeliveryDays ? `<br><span style="color: ${brandColors.textLight};">Estimated Delivery: ${params.estimatedDeliveryDays}</span>` : ''}
              </div>
            </div>
          </div>
          <div style="text-align: center; margin: 40px 0 30px;">
            <h3 style="font-size: 20px; color: ${brandColors.primary}; margin: 0 0 20px;">Loved Your Order?</h3>
            <p style="margin: 0 0 20px; color: ${brandColors.textLight};">Discover more delicious snacks for your next order!</p>
            <a href="${params.baseUrl}/products" 
               style="display: inline-block; background: ${brandColors.primary}; color: ${brandColors.lightBg}; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; margin: 0 10px 15px; font-size: 16px; border: 2px solid ${brandColors.primary}; transition: all 0.3s ease;">
              Shop More Snacks
            </a>
            <div style="margin-top: 20px; font-size: 14px; color: ${brandColors.textLight};">
              <p style="margin: 0 0 12px;">Need help with your order?</p>
              <p style="margin: 0 0 16px;">Email us at <a href="mailto:hello@snackinofficial.com" style="color: ${brandColors.primary}; text-decoration: none; font-weight: 500;">hello@snackinofficial.com</a></p>
              <p style="margin: 0;">
                <a href="${params.baseUrl}" style="color: ${brandColors.primary}; text-decoration: none; font-weight: 500;">
                  Happy Snackin'! 🎉
                </a>
              </p>
            </div>
          </div>
        </div>
        <div class="footer">
          <p style="margin: 0 0 15px; font-size: 13px;">
            <!-- Removed privacy policy and terms links as per request -->
          </p>
          <p style="margin: 0;">
            &copy; ${new Date().getFullYear()} The Snackin Company&trade;. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

function formatTextAddress(address: ShippingAddress, showPhone: boolean = true) {
  const data = prepareAddressData(address);
  const maxLineLength = 45;
  const formatLine = (text: string) => {
    const padding = Math.max(0, Math.floor((maxLineLength - text.length) / 2));
    return ' '.repeat(padding) + text;
  };

  const lines = [
    formatLine(`👤 ${data.name}`),
    formatLine('🏠'),
    ...data.addressLines.map(line => formatLine(line)),
    formatLine(`${data.city}, ${data.state} ${data.postalCode}`),
    formatLine(data.country),
  ];

  if (showPhone && data.phone) {
    lines.push(formatLine(`📞 ${data.phone}`));
  }

  return '\n' + lines.join('\n') + '\n';
}

const alignText = (label: string, value: string, isBold: boolean = false) => {
  const labelWidth = 20;
  const padding = ' '.repeat(Math.max(0, labelWidth - label.length));
  const boldMark = isBold ? '\u001b[1m' : '';
  const resetMark = isBold ? '\u001b[0m' : '';
  return `  ${label}${padding}  ${boldMark}${value}${resetMark}\n`;
};

const generateTextContent = (params: {
  orderId: string;
  customerName: string;
  orderDate: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  baseUrl: string;
  estimatedDeliveryDays?: string;
}) => {
  const orderSummaryData = prepareOrderSummary(params);
  const orderItems = orderSummaryData.items
    .map((item) => `  ${item.name}${item.variant ? ` (${item.variant})` : ''} x ${item.quantity}\n    ${item.price}`)
    .join('\n\n');

  const savingsLine = orderSummaryData.discount ? `  You saved ${orderSummaryData.discount}\n\n` : '';

  const emailChunks = [
    `ORDER CONFIRMATION #${params.orderId}`,
    '',
    `Hi ${params.customerName},`,
    '',
    'Thank you for shopping with The Snackin Company™! Your order is getting ready to be shipped. We will notify you when it has been sent.',
    '',
    'ORDER DETAILS',
    '',
    `ORDER NUMBER\n  #${params.orderId}`,
    '',
    `ORDER DATE\n  ${params.orderDate}`,
    '',
    `ITEMS ORDERED\n${orderItems}`,
    '',
    'ORDER SUMMARY',
    '',
    alignText('SUBTOTAL:', orderSummaryData.subtotal),
    orderSummaryData.discount ? alignText('ORDER DISCOUNT:', `-${orderSummaryData.discount}`) : '',
    alignText('SHIPPING:', orderSummaryData.shipping),
    alignText('TOTAL:', orderSummaryData.total, true),
    '',
    'SHIPPING ADDRESS',
    formatTextAddress(params.shippingAddress),
    '',
    'BILLING ADDRESS',
    '  ℹ️  Same as shipping address',
    '',
    'PAYMENT INFORMATION',
    '',
    `PAYMENT METHOD\n  ${params.paymentMethod}`,
    '',
    'SHIPPING INFORMATION',
    'Standard Shipping (5-6 business days)',
    `  ${params.estimatedDeliveryDays ? `Estimated delivery: ${params.estimatedDeliveryDays}` : ''}`,
    '',
    'ORDER STATUS\n  Confirmed - Preparing for shipment',
    '',
    'Thank you for shopping with us!',
    '',
    `Track your order: ${params.baseUrl}/order-tracking?orderId=${params.orderId}`,
    `Contact us: hello@snackinofficial.com`,
    '',
    `${savingsLine}`,
    '',
    `&copy; ${new Date().getFullYear()} The Snackin Company™. All rights reserved.`
  ];

  return emailChunks.filter(chunk => chunk !== '').join('\n');
};