import type { EmailProvider, EmailMessage, EmailResult } from '../types.js';

export class ConsoleEmailProvider implements EmailProvider {
  async send(message: EmailMessage): Promise<EmailResult> {
    const timestamp = new Date();

    console.log('--- EMAIL SIMULATION START ---');
    console.log(`Timestamp: ${timestamp.toISOString()}`);
    console.log(`To: ${message.to}`);
    console.log(`From: ${message.from || 'default'}`);
    console.log(`Subject: ${message.subject}`);
    console.log('--- HTML CONTENT ---');
    console.log(message.html);
    if (message.text) {
        console.log('--- TEXT CONTENT ---');
        console.log(message.text);
    }
    console.log('--- EMAIL SIMULATION END ---');

    return {
      id: `console-${timestamp.getTime()}`,
      success: true,
      provider: 'console',
      timestamp,
    };
  }
}
