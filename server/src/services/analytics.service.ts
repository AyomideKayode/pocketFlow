import mongoose from 'mongoose';
import ImportJobModel, { type ImportJob } from '../schema/import-job.js';
import FinancialRecordModel from '../schema/financial-records.js';
import BudgetModel from '../schema/budget.js';

export const recordImportJob = async (data: Partial<ImportJob>) => {
  const job = new ImportJobModel(data);
  return await job.save();
};

export const getBudgetCycleAnalysis = async (userId: string) => {
  // Aggregate expenses by period and category
  // We start from FinancialRecords to get actual spending
  const pipeline: any[] = [
    {
      $match: {
        userId,
        type: 'expense',
      },
    },
    {
      $addFields: {
        // Create YYYY-MM period string from date
        period: { $dateToString: { format: '%Y-%m', date: '$date' } },
      },
    },
    {
      $group: {
        _id: {
          period: '$period',
          category: '$category',
        },
        totalSpent: { $sum: '$amount' },
      },
    },
    // Lookup the budget for this specific user/period/category
    {
      $lookup: {
        from: 'budgets',
        let: {
          period: '$_id.period',
          category: '$_id.category',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', userId] },
                  { $eq: ['$period', '$$period'] },
                  { $eq: ['$category', '$$category'] },
                ],
              },
            },
          },
        ],
        as: 'budgetDoc',
      },
    },
    {
      $unwind: {
        path: '$budgetDoc',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        period: '$_id.period',
        category: '$_id.category',
        spent: '$totalSpent',
        hasBudget: { $cond: [{ $ifNull: ['$budgetDoc', false] }, true, false] },
        budget: '$budgetDoc.amount',
      },
    },
    {
      $addFields: {
        variance: { $subtract: ['$spent', '$budget'] },
        utilization: {
          $cond: [
            { $gt: ['$budget', 0] },
            { $multiply: [{ $divide: ['$spent', '$budget'] }, 100] },
            0,
          ],
        },
        isOverBudget: {
          $cond: [
            { $gt: ['$budget', 0] },
            { $gt: ['$spent', '$budget'] },
            false,
          ],
        },

      },
    },
    {
      $sort: { period: -1, category: 1 },
    },
  ];

  return await FinancialRecordModel.aggregate(pipeline);
};

export const getHistoricalOverBudgetUsers = async () => {
  // Find budgets that were exceeded
  // Optimized to use date range lookup instead of string matching
  return await BudgetModel.aggregate([
    {
      $addFields: {
        // Convert period (YYYY-MM) to date range
        periodStart: {
          $dateFromString: {
            dateString: { $concat: ['$period', '-01'] },
          },
        },
      },
    },
    {
      $addFields: {
        periodEnd: {
          $dateAdd: {
            startDate: '$periodStart',
            unit: 'month',
            amount: 1,
          },
        },
      },
    },
    {
      $lookup: {
        from: 'financialrecords',
        let: {
          uid: '$userId',
          cat: '$category',
          start: '$periodStart',
          end: '$periodEnd',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', '$$uid'] },
                  { $eq: ['$category', '$$cat'] },
                  { $gte: ['$date', '$$start'] },
                  { $lt: ['$date', '$$end'] },
                  { $eq: ['$type', 'expense'] },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
            },
          },
        ],
        as: 'expenses',
      },
    },
    {
      $unwind: {
        path: '$expenses',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        spent: { $ifNull: ['$expenses.total', 0] },
      },
    },
    {
      $match: {
        $expr: { $gt: ['$spent', '$amount'] },
      },
    },
    {
      $project: {
        _id: 0,
        userId: 1,
        period: 1,
        category: 1,
        budget: '$amount',
        spent: 1,
        overage: { $subtract: ['$spent', '$amount'] },
      },
    },
    {
      $sort: { userId: 1, period: -1 },
    },
  ]);
};
