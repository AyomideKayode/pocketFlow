import { Resend } from 'resend';
import type { EmailProvider, EmailMessage, EmailResult } from '../types.js';

export class ResendEmailProvider implements EmailProvider {
  private client: Resend;
  private defaultFrom: string;

  constructor(apiKey: string, defaultFrom: string) {
    if (!apiKey) {
      throw new Error('Resend API key is required');
    }
    this.client = new Resend(apiKey);
    this.defaultFrom = defaultFrom || 'onboarding@resend.dev';
  }

  async send(message: EmailMessage): Promise<EmailResult> {
    const timestamp = new Date();
    try {
      const { data, error } = await this.client.emails.send({
        from: message.from || this.defaultFrom,
        to: message.to,
        subject: message.subject,
        html: message.html,
        ...(message.text ? { text: message.text } : {}),
      });

      if (error) {
        console.error('Resend API returned error:', error);
        return {
            id: `failed-${timestamp.getTime()}`,
            success: false,
            provider: 'resend',
            timestamp,
            error: error
        }
      }

      return {
        id: data?.id || `resend-${timestamp.getTime()}`,
        success: true,
        provider: 'resend',
        timestamp,
      };
    } catch (error) {
      console.error('Resend email failed:', error);
      return {
        id: `failed-${timestamp.getTime()}`,
        success: false,
        provider: 'resend',
        timestamp,
        error,
      };
    }
  }
}
