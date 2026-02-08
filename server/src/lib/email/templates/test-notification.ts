import { renderBaseLayout } from './base-layout.js';

export interface TestNotificationPayload {
  name: string;
  message: string;
}

export function renderTestNotification(payload: TestNotificationPayload) {
  const htmlContent = `
    <h1>Hello ${payload.name},</h1>
    <p>${payload.message}</p>
    <p>This is a test notification to verify the email infrastructure.</p>
    <a href="${process.env.APP_URL || '#'}" class="btn">Go to Dashboard</a>
  `;

  const textContent = `
Hello ${payload.name},

${payload.message}

This is a test notification to verify the email infrastructure.
Go to Dashboard: ${process.env.APP_URL || '#'}
  `;

  return {
    subject: 'Test Notification',
    html: renderBaseLayout(htmlContent, 'Test Notification'),
    text: textContent,
  };
}
