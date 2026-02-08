import { renderTestNotification } from './test-notification.js';
import { renderBudgetAlert } from './budget-alert.js';
import { renderGoalAchieved } from './goal-achieved.js';
import { renderWeeklySummary } from './weekly-summary.js';

// Registry of templates
const templates: Record<
  string,
  (payload: any) => { subject: string; html: string; text: string }
> = {
  'test-notification': renderTestNotification,
  'budget-alert': renderBudgetAlert,
  'goal-achieved': renderGoalAchieved,
  'weekly-summary': renderWeeklySummary,
};

export function renderTemplate(templateId: string, payload: any) {
  const renderer = templates[templateId];
  if (!renderer) {
    throw new Error(`Template not found: ${templateId}`);
  }
  return renderer(payload);
}
