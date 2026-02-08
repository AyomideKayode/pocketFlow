import GoalModel from '../schema/goal.js';
import FinancialRecordModel from '../schema/financial-records.js';
import UserProfileModel from '../schema/user-profile.js';
import { emailService } from './email.service.js';
import { formatCurrency } from '../utils/currency.js';
import admin from '../lib/firebaseAdmin.js';

const calculateGoalProgress = async (userId: string, goal: any) => {
  let currentAmount = goal.currentAmount;

  if (goal.linkedCategory) {
    const result = await FinancialRecordModel.aggregate([
      {
        $match: {
          userId,
          category: goal.linkedCategory,
        },
      },
      {
        $group: {
          _id: null,
          totalSaved: { $sum: '$amount' },
        },
      },
    ]);
    currentAmount = result[0]?.totalSaved || 0;
  }

  return currentAmount;
};

export const getGoalsWithProgress = async (userId: string) => {
  const goals = await GoalModel.find({ userId });

  const results = await Promise.all(
    goals.map(async (goal) => {
      const currentAmount = await calculateGoalProgress(userId, goal);

      return {
        ...goal.toObject(),
        currentAmount,
        percent:
          goal.targetAmount > 0
            ? Math.min((currentAmount / goal.targetAmount) * 100, 100)
            : 0,
      };
    }),
  );

  return results;
};

export const checkAndNotifyGoalAchieved = async (
  userId: string,
  goalId: string,
  options: { suppressEmail?: boolean } = {},
) => {
  const goal = await GoalModel.findById(goalId);
  if (!goal) return;

  const currentAmount = await calculateGoalProgress(userId, goal);
  const isAchieved = currentAmount >= goal.targetAmount;

  if (isAchieved) {
    if (!goal.achievedNotified) {
      // 1. Mark as notified immediately
      await GoalModel.findByIdAndUpdate(goal._id, {
        achievedNotified: true,
      });

      console.log(
        JSON.stringify({
          event: 'goal_achieved',
          userId,
          goalId: goal._id,
          name: goal.name,
          current: currentAmount,
          target: goal.targetAmount,
          suppressed: !!options.suppressEmail,
        }),
      );

      // 2. Send Email
      if (!options.suppressEmail) {
        try {
          // Fetch user details
          const userRecord = await admin.auth().getUser(userId);
          const email = userRecord.email;
          const displayName = userRecord.displayName || 'User';

          if (email) {
            // Fetch profile for currency
            const userProfile = await UserProfileModel.findOne({ userId });
            const currency = userProfile?.currency || 'USD';

            const payload = {
              goalName: goal.name,
              currentAmount: formatCurrency(currentAmount, currency),
              targetAmount: formatCurrency(goal.targetAmount, currency),
            };

            await emailService.sendTransactionEmail(
              { userId, email, displayName },
              'goal-achieved',
              payload,
              'achievements',
            );
          } else {
            console.warn(`[GOAL] No email found for user ${userId}`);
          }
        } catch (error) {
          console.error(`[GOAL] Error sending notification:`, error);
        }
      }
    }
  } else {
    // Reset if no longer achieved
    if (goal.achievedNotified) {
      console.log(
        JSON.stringify({
          event: 'goal_reset',
          userId,
          goalId: goal._id,
          name: goal.name,
          current: currentAmount,
          target: goal.targetAmount,
        }),
      );

      await GoalModel.findByIdAndUpdate(goal._id, {
        achievedNotified: false,
      });
    }
  }
};

export const createGoal = async (data: any) => {
  const goal = new GoalModel(data);
  const savedGoal = await goal.save();

  // Check immediately
  checkAndNotifyGoalAchieved(savedGoal.userId, savedGoal._id.toString()).catch(
    (err) => console.error('[GOAL] Error checking goal on create:', err),
  );

  return savedGoal;
};

export const updateGoal = async (id: string, data: any) => {
  const updatedGoal = await GoalModel.findByIdAndUpdate(id, data, { new: true });

  if (updatedGoal) {
    checkAndNotifyGoalAchieved(updatedGoal.userId, updatedGoal._id.toString()).catch(
      (err) => console.error('[GOAL] Error checking goal on update:', err),
    );
  }

  return updatedGoal;
};

export const deleteGoal = async (id: string) => {
  return await GoalModel.findByIdAndDelete(id);
};
