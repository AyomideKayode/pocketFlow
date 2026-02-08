import { renderTestNotification } from './test-notification.js';

// Registry of templates
const templates: Record<string, (payload: any) => { subject: string; html: string; text: string }> = {
  'test-notification': renderTestNotification,
  // Future templates will be added here
};

export function renderTemplate(templateId: string, payload: any) {
  const renderer = templates[templateId];
  if (!renderer) {
    throw new Error(`Template not found: ${templateId}`);
  }
  return renderer(payload);
}
