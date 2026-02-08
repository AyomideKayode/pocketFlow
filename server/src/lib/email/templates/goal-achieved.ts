import { renderBaseLayout } from './base-layout.js';

interface GoalAchievedPayload {
  goalName: string;
  currentAmount: string; // Formatted currency
  targetAmount: string; // Formatted currency
}

export const renderGoalAchieved = (payload: GoalAchievedPayload) => {
  const { goalName, currentAmount, targetAmount } = payload;
  const subject = `🎉 Goal Achieved: ${goalName}`;

  const content = `
    <h2 style="color: #10b981; margin-bottom: 20px;">Goal Achieved!</h2>
    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
      Congratulations! You've successfully reached your savings goal: <strong>${goalName}</strong>.
    </p>

    <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
      <p style="margin: 0; font-weight: bold; color: #065f46;">
        Saved: ${currentAmount}
        <span style="font-weight: normal; color: #064e3b;"> / Target: ${targetAmount}</span>
      </p>
    </div>

    <p style="margin-bottom: 30px;">
      Great job staying on track with your financial goals!
    </p>

    <div style="text-align: center;">
      <a href="${process.env.VITE_APP_URL || '#'}/goals" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
        View Goals
      </a>
    </div>
  `;

  return {
    subject,
    html: renderBaseLayout(content, subject),
    text: `Congratulations! You've reached your goal: ${goalName}. Saved: ${currentAmount} / Target: ${targetAmount}.`,
  };
};
