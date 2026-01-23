import BudgetModel from '../schema/budget.js';
import FinancialRecordModel from '../schema/financial-records.js';

export const getBudgetsWithProgress = async (userId: string, period: string) => {
  const budgets = await BudgetModel.find({ userId, period });

  // Calculate start and end of period (YYYY-MM)
  // month is 1-based in string, 0-based in Date constructor
  const parts = period.split('-').map(Number);
  const year = parts[0];
  const month = parts[1];

  if (year === undefined || month === undefined) {
      throw new Error('Invalid period format. Expected YYYY-MM');
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const results = await Promise.all(
    budgets.map(async (budget) => {
      const result = await FinancialRecordModel.aggregate([
        {
          $match: {
            userId,
            category: budget.category,
            date: { $gte: startDate, $lte: endDate },
            type: 'expense', // Budgets usually track expenses
          },
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: '$amount' },
          },
        },
      ]);

      const spent = result[0]?.totalSpent || 0;
      return {
        ...budget.toObject(),
        spent,
        remaining: budget.amount - spent,
        percent: (spent / budget.amount) * 100,
      };
    }),
  );

  return results;
};

export const createBudget = async (data: any) => {
  const budget = new BudgetModel(data);
  return await budget.save();
};

export const updateBudget = async (id: string, data: any) => {
  return await BudgetModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteBudget = async (id: string) => {
  return await BudgetModel.findByIdAndDelete(id);
};

export const checkAndNotifyBudgetExceeded = async (userId: string, category: string, date: Date) => {
    const period = date.toISOString().slice(0, 7);
    const budgets = await getBudgetsWithProgress(userId, period);
    const budget = budgets.find(b => b.category === category);

    if (budget && budget.spent > budget.amount) {
        // Mock Email Notification
        console.log(`[ALERT] Budget Exceeded for User ${userId}: ${category} (${budget.spent}/${budget.amount})`);
        console.log(`[EMAIL SERVICE] Sending email to user... (Simulated)`);
    }
};
