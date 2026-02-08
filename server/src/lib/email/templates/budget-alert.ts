import { renderBaseLayout } from './base-layout.js';

interface BudgetAlertPayload {
  category: string;
  spent: string; // Pre-formatted currency string
  limit: string; // Pre-formatted currency string
  period: string;
}

export const renderBudgetAlert = (payload: BudgetAlertPayload) => {
  const { category, spent, limit, period } = payload;
  const subject = `🚨 Budget Alert: ${category} Exceeded`;

  const content = `
    <h2 style="color: #ef4444; margin-bottom: 20px;">Budget Exceeded</h2>
    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
      You've exceeded your budget for <strong>${category}</strong>.
    </p>

    <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
      <p style="margin: 0; font-weight: bold; color: #b91c1c;">
        Spent: ${spent}
        <span style="font-weight: normal; color: #7f1d1d;"> / Limit: ${limit}</span>
      </p>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #7f1d1d;">
        Period: ${period}
      </p>
    </div>

    <p style="margin-bottom: 30px;">
      This notification is sent when your spending reaches 100% of your budget limit.
    </p>

    <div style="text-align: center;">
      <a href="${process.env.VITE_APP_URL || '#'}/budgets" style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Adjust Budget
      </a>
    </div>
  `;

  return {
    subject,
    html: renderBaseLayout(content, subject),
    text: `Budget Alert: You've exceeded your budget for ${category}. Spent: ${spent} / Limit: ${limit}.`,
  };
};
