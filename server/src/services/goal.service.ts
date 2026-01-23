import GoalModel from '../schema/goal.js';
import FinancialRecordModel from '../schema/financial-records.js';

export const getGoalsWithProgress = async (userId: string) => {
  const goals = await GoalModel.find({ userId });

  const results = await Promise.all(
    goals.map(async (goal) => {
      let currentAmount = goal.currentAmount;

      if (goal.linkedCategory) {
        const result = await FinancialRecordModel.aggregate([
          {
            $match: {
              userId,
              category: goal.linkedCategory,
              // We assume records in this category (regardless of type income/expense) contribute?
              // Or specifically expenses? Usually savings are transfers out (expense).
              // Or income (if tracking earnings).
              // Let's assume ANY record with this category contributes.
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

export const createGoal = async (data: any) => {
  const goal = new GoalModel(data);
  return await goal.save();
};

export const updateGoal = async (id: string, data: any) => {
  return await GoalModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteGoal = async (id: string) => {
  return await GoalModel.findByIdAndDelete(id);
};
