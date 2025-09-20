import { Resend } from 'resend';
import { emailConfig, isEmailEnabled } from '../config/email.config';
import { SendOrderConfirmationParams, EmailSendResult } from '../types/email.types';
import { generateOrderConfirmationEmail } from '../templates/order-confirmation';

// Initialize Resend only if email is enabled
const resend = isEmailEnabled && emailConfig.resend.apiKey 
  ? new Resend(emailConfig.resend.apiKey) 
  : null;

/**
 * Email service for sending transactional emails
 */
class EmailService {
  /**
   * Send an order confirmation email
   * @param params Order confirmation parameters
   * @returns Promise with send result
   */
  async sendOrderConfirmation(params: SendOrderConfirmationParams): Promise<EmailSendResult> {
    // If email is not enabled, log and return success to not block the order flow
    if (!isEmailEnabled) {
      console.log('Email functionality is disabled. Order confirmation email not sent.');
      return { success: true, data: { id: 'email-disabled' } };
    }

    try {
      const { orderDetails, ...restParams } = params;
      
      // Generate email content using template
      const emailContent = generateOrderConfirmationEmail({
        ...restParams,
        ...orderDetails,
        baseUrl: emailConfig.baseUrl,
        orderDate: params.orderDate || new Date().toISOString(),
        paymentMethod: params.paymentMethod || emailConfig.defaults.paymentMethod,
        shippingAddress: {
          ...params.shippingAddress,
          country: params.shippingAddress.country || emailConfig.defaults.country,
        },
      });

      // Send email using Resend
      const { data, error } = await resend!.emails.send({
        from: emailConfig.from,
        to: [params.to],
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      if (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in sendOrderConfirmation:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to send order confirmation email'),
      };
    }
  }
}

// Export a singleton instance
export const emailService = new EmailService();

export { isEmailEnabled } from '../config/email.config';

// Re-export types for convenience
export * from '../types/email.types';
