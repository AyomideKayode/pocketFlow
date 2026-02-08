import { renderBaseLayout } from './base-layout.js';

interface WeeklySummaryPayload {
  weekRange: string; // e.g., "Jan 1 - Jan 7"
  income: string; // Formatted currency
  expenses: string; // Formatted currency
  net: string; // Formatted currency
  topCategory: {
    name: string;
    amount: string; // Formatted currency
  };
  hasTopCategory: boolean; // Determined by service logic
}

export const renderWeeklySummary = (payload: WeeklySummaryPayload) => {
  const { weekRange, income, expenses, net, topCategory, hasTopCategory } = payload;
  const subject = `📊 Weekly Summary: ${weekRange}`;

  const content = `
    <h2 style="color: #6366f1; margin-bottom: 20px;">Your Weekly Summary</h2>
    <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
      Here's a snapshot of your finances for <strong>${weekRange}</strong>.
    </p>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
        <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase;">Income</p>
        <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #10b981;">+${income}</p>
      </div>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
        <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase;">Expenses</p>
        <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #ef4444;">-${expenses}</p>
      </div>
      <div style="background-color: #e0e7ff; padding: 15px; border-radius: 8px; grid-column: span 2;">
        <p style="margin: 0; font-size: 12px; color: #4338ca; text-transform: uppercase;">Net</p>
        <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #3730a3;">${net}</p>
      </div>
    </div>

    ${
      hasTopCategory
        ? `
      <div style="margin-bottom: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #374151;">
          Top Spending Category
        </p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 16px; color: #1f2937;">${topCategory.name}</span>
          <span style="font-weight: bold; color: #ef4444;">-${topCategory.amount}</span>
        </div>
      </div>
      `
        : ''
    }

    <div style="text-align: center;">
      <a href="${process.env.APP_BASE_URL || '#'}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Open Dashboard
      </a>
    </div>
  `;

  return {
    subject,
    html: renderBaseLayout(content, subject),
    text: `Weekly Summary (${weekRange}). Income: ${income}, Expenses: ${expenses}, Net: ${net}. Top Category: ${topCategory.name} (${topCategory.amount}).`,
  };
};
