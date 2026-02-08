import UserProfileModel from '../schema/user-profile.js';
import FinancialRecordModel from '../schema/financial-records.js';
import { emailService } from './email.service.js';
import { formatCurrency } from '../utils/currency.js';
import admin from '../lib/firebaseAdmin.js';

export const processWeeklySummaries = async () => {
  const now = new Date();
  // Calculate previous week's Monday and Sunday
  // If today is Monday (1), previous Sunday is today - 1 day.
  // If today is Sunday (0), previous Sunday is today - 7 days.
  // "Complete Week" = Monday -> Sunday.

  // Logic: Go to the most recent completed Sunday.
  const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
  const daysSinceSunday = dayOfWeek === 0 ? 7 : dayOfWeek;

  const lastSunday = new Date(now);
  lastSunday.setDate(now.getDate() - daysSinceSunday);
  lastSunday.setHours(23, 59, 59, 999);

  const lastMonday = new Date(lastSunday);
  lastMonday.setDate(lastSunday.getDate() - 6);
  lastMonday.setHours(0, 0, 0, 0);

  const weekIdentifier = lastSunday.toISOString().split('T')[0]; // YYYY-MM-DD
  const weekRangeLabel = `${lastMonday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${lastSunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  console.log(
    `[SUMMARY] Processing weekly summaries for week ending ${weekIdentifier} (${weekRangeLabel})`,
  );

  // Find users who need a summary
  const users = await UserProfileModel.find({
    'emailPreferences.global': { $ne: false },
    'emailPreferences.categories.summaries': { $ne: false },
    $or: [
      { lastWeeklySummaryWeekEnd: { $ne: weekIdentifier } },
      { lastWeeklySummaryWeekEnd: { $exists: false } },
    ],
  });

  console.log(`[SUMMARY] Found ${users.length} users eligible for summary.`);

  for (const user of users) {
    try {
      // Fetch user email from Auth
      const userRecord = await admin.auth().getUser(user.userId);
      const email = userRecord.email;
      const displayName = userRecord.displayName || 'User';

      if (!email) {
        console.warn(
          `[SUMMARY] No email found for user ${user.userId}, skipping.`,
        );
        continue;
      }

      // Aggregate Data
      const aggregation = await FinancialRecordModel.aggregate([
        {
          $match: {
            userId: user.userId,
            date: { $gte: lastMonday, $lte: lastSunday },
          },
        },
        {
          $group: {
            _id: null,
            totalIncome: {
              $sum: {
                $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
              },
            },
            totalExpense: {
              $sum: {
                $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
              },
            },
          },
        },
      ]);

      const stats = aggregation[0] || { totalIncome: 0, totalExpense: 0 };
      const net = stats.totalIncome - stats.totalExpense;

      // Get Top Category (Expenses)
      const categoryAggregation = await FinancialRecordModel.aggregate([
        {
          $match: {
            userId: user.userId,
            date: { $gte: lastMonday, $lte: lastSunday },
            type: 'expense',
          },
        },
        {
          $group: {
            _id: '$category',
            total: { $sum: '$amount' },
          },
        },
        { $sort: { total: -1 } },
        { $limit: 1 },
      ]);

      const topCategory = categoryAggregation[0]
        ? {
            name: categoryAggregation[0]._id,
            amount: categoryAggregation[0].total,
          }
        : { name: 'None', amount: 0 };

      // Determine if there's a valid top category (service-level business logic)
      const hasTopCategory = topCategory.amount > 0;

      // Prepare Payload
      const currency = user.currency || 'USD';
      const payload = {
        weekRange: weekRangeLabel,
        income: formatCurrency(stats.totalIncome, currency),
        expenses: formatCurrency(stats.totalExpense, currency),
        net: formatCurrency(net, currency),
        topCategory: {
          name: topCategory.name,
          amount: formatCurrency(topCategory.amount, currency),
        },
        hasTopCategory,
      };

      // Send Email
      const success = await emailService.sendTransactionEmail(
        { userId: user.userId, email, displayName },
        'weekly-summary',
        payload,
        'summaries',
      );

      if (success) {
        // Update User Profile
        await UserProfileModel.findByIdAndUpdate(user._id, {
          lastWeeklySummaryWeekEnd: weekIdentifier,
        });

        console.log(
          JSON.stringify({
            event: 'weekly_summary_sent',
            userId: user.userId,
            weekEnding: weekIdentifier,
            stats: {
              income: stats.totalIncome,
              expense: stats.totalExpense,
              net,
            },
          }),
        );
      } else {
        console.warn(`[SUMMARY] Failed to send email to ${user.userId}`);
      }
    } catch (error) {
      console.error(`[SUMMARY] Error processing user ${user.userId}:`, error);
    }
  }

  console.log(`[SUMMARY] Finished processing.`);
};
