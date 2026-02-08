import BudgetModel from '../schema/budget.js';
import FinancialRecordModel from '../schema/financial-records.js';
import UserProfileModel from '../schema/user-profile.js';
import { emailService } from './email.service.js';
import { formatCurrency } from '../utils/currency.js';
import admin from '../lib/firebaseAdmin.js';

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
  options: { suppressEmail?: boolean } = {},
) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  // Ensure valid date
  if (isNaN(dateObj.getTime())) {
    console.error(`[BUDGET] Invalid date passed to check: ${date}`);
    return;
  }

  const period = dateObj.toISOString().slice(0, 7); // YYYY-MM
  const currentPeriod = new Date().toISOString().slice(0, 7);

  // Determine if we should send notifications (only for current/future periods)
  // And respect manual suppression
  const isHistorical = period < currentPeriod;
  const shouldNotify = !options.suppressEmail && !isHistorical;

  const budgets = await getBudgetsWithProgress(userId, period);
  const budget = budgets.find((b) => b.category === category);

  if (!budget) return;

  if (budget.spent >= budget.amount) {
    if (!budget.notified) {
      // 1. Mark as notified immediately (Idempotency)
      await BudgetModel.findByIdAndUpdate(budget._id, {
        notified: true,
      });

      console.log(
        JSON.stringify({
          event: 'budget_exceeded',
          userId,
          category,
          spent: budget.spent,
          limit: budget.amount,
          period,
          historical: isHistorical,
          suppressed: !shouldNotify,
        }),
      );

      // 2. Send Email if applicable
      if (shouldNotify) {
        try {
          // Fetch user details from Firebase Admin
          const userRecord = await admin.auth().getUser(userId);
          const email = userRecord.email;
          const displayName = userRecord.displayName || 'User';

          if (email) {
            // Fetch profile for currency preference
            const userProfile = await UserProfileModel.findOne({ userId });
            const currency = userProfile?.currency || 'USD';

            const payload = {
              category,
              spent: formatCurrency(budget.spent, currency),
              limit: formatCurrency(budget.amount, currency),
              period,
            };

            await emailService.sendTransactionEmail(
              { userId, email, displayName },
              'budget-alert',
              payload,
              'alerts',
            );
          } else {
            console.warn(`[BUDGET] No email found for user ${userId}`);
          }
        } catch (error) {
          console.error(`[BUDGET] Error sending notification:`, error);
        }
      }
    }
  } else {
    // RESET LOGIC: If spending is back under limit
    if (budget.notified) {
      console.log(
        JSON.stringify({
          event: 'budget_reset',
          userId,
          category,
          spent: budget.spent,
          limit: budget.amount,
        }),
      );

      await BudgetModel.findByIdAndUpdate(budget._id, {
        notified: false,
      });
    }
  }
};
