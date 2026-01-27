import BudgetModel from '../schema/budget.js';
import FinancialRecordModel from '../schema/financial-records.js';

export const getBudgetsWithProgress = async (
  userId: string,
  period: string,
) => {
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

  // OPTIMIZATION: Single aggregation query for all categories
  const expenseAggregation = await FinancialRecordModel.aggregate([
    {
      $match: {
        userId,
        date: { $gte: startDate, $lte: endDate },
        type: 'expense', // Budgets usually track expenses
      },
    },
    {
      $group: {
        _id: '$category',
        totalSpent: { $sum: '$amount' },
      },
    },
  ]);

  // Create a map for O(1) lookup: category -> totalSpent
  const expenseMap = new Map<string, number>();
  expenseAggregation.forEach((item) => {
    if (item._id) {
      expenseMap.set(item._id, item.totalSpent);
    }
  });

  const results = budgets.map((budget) => {
    const spent = expenseMap.get(budget.category) || 0;
    return {
      ...budget.toObject(),
      spent,
      remaining: budget.amount - spent,
      percent: (spent / budget.amount) * 100,
    };
  });

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

export const checkAndNotifyBudgetExceeded = async (
  userId: string,
  category: string,
  date: Date | string,
) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  // Ensure valid date
  if (isNaN(dateObj.getTime())) {
    console.error(`[BUDGET] Invalid date passed to check: ${date}`);
    return;
  }

  const period = dateObj.toISOString().slice(0, 7); // YYYY-MM
  const budgets = await getBudgetsWithProgress(userId, period);
  const budget = budgets.find((b) => b.category === category);

  if (!budget) return;

  if (budget.spent > budget.amount) {
    if (!budget.notified) {
      console.log(
        `[BUDGET] ALERT: Budget Exceeded for User ${userId}: ${category} (${budget.spent.toFixed(2)}/${budget.amount.toFixed(2)})`,
      );

      await BudgetModel.findByIdAndUpdate(budget._id, {
        notified: true,
      });
      // Mock Email Notification || Future: email / push / webhook
      console.log(`[BUDGET] [EMAIL SERVICE] Sending alert to user... (Simulated)`);
    }
  } else {
    // RESET LOGIC: If spending is back under limit (e.g. after deleting a record), reset notified flag
    if (budget.notified) {
      console.log(
        `[BUDGET] INFO: Spending back within limits for User ${userId}: ${category} (${budget.spent.toFixed(2)}/${budget.amount.toFixed(2)})`,
      );

      await BudgetModel.findByIdAndUpdate(budget._id, {
        notified: false,
      });
    }
  }
};
