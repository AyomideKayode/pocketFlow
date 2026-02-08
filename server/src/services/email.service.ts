import type {
    EmailProvider,
    EmailMessage,
    EmailResult,
    EmailCategory,
} from '../lib/email/types.js';
import { ConsoleEmailProvider } from '../lib/email/providers/console-provider.js';
import { ResendEmailProvider } from '../lib/email/providers/resend-provider.js';
import UserProfileModel from '../schema/user-profile.js';
import { renderTemplate } from '../lib/email/templates/index.js';

export class EmailService {
    private provider: EmailProvider;

    constructor() {
        const providerName = process.env.EMAIL_PROVIDER || 'console';

        if (providerName === 'resend') {
            const apiKey = process.env.RESEND_API_KEY || '';
            const from = process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev';
            this.provider = new ResendEmailProvider(apiKey, from);
            console.log('Email Service: Using Resend Provider');
        } else {
            this.provider = new ConsoleEmailProvider();
            console.log('Email Service: Using Console Provider');
        }
    }

    async sendTransactionEmail(
        recipient: { userId: string; email: string; displayName?: string },
        template: string,
        payload: any,
        category: EmailCategory = 'alerts', // default category
    ): Promise<boolean> {
        // 1. Check Preferences
        const shouldSend = await this.checkPreferences(recipient.userId, category);
        if (!shouldSend) {
            console.log(
                JSON.stringify({
                    event: 'email_skipped',
                    userId: recipient.userId,
                    reason: 'preferences',
                    category,
                }),
            );
            return false;
        }

        // 2. Render Template
        let content;
        try {
            content = renderTemplate(template, payload);
        } catch (error) {
            console.error('Template rendering failed:', error);
            return false;
        }

        const message: EmailMessage = {
            to: recipient.email,
            subject: content.subject,
            html: content.html,
            text: content.text,
            // from: payload?.from,
        };

        // 3. Send
        try {
            const result = await this.provider.send(message);
            this.logResult(recipient.userId, template, result);
            return result.success;
        } catch (error) {
            console.error('Failed to send email:', error);
            // We catch here to ensure "no crashes or blocked flows"
            return false;
        }
    }

    private async checkPreferences(
        userId: string,
        category: EmailCategory,
    ): Promise<boolean> {
        try {
            const profile = await UserProfileModel.findOne({ userId });

            // If no profile or preferences not set, assume default opt-in (true)
            if (!profile || !profile.emailPreferences) return true;

            const prefs = profile.emailPreferences;

            // Check global
            if (prefs.global === false) return false;

            // Check category
            if (prefs.categories && prefs.categories[category] === false)
                return false;

            return true;
        } catch (error) {
            console.error('Error checking preferences:', error);
            // Fail open (send email) on preference check failure to ensure critical transactional emails aren't lost due to DB blips
            return true;
        }
    }

    private logResult(userId: string, template: string, result: EmailResult) {
        console.log(
            JSON.stringify({
                event: 'email_attempt',
                userId,
                template,
                provider: result.provider,
                success: result.success,
                id: result.id,
                timestamp: result.timestamp,
            }),
        );
    }
}

export const emailService = new EmailService();
