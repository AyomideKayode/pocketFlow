import express from 'express';
import type { Request, Response } from 'express';
import FinancialRecordModel from '../schema/financial-records.js';
import GoalModel from '../schema/goal.js';
import { checkAndNotifyBudgetExceeded } from '../services/budget.service.js';
import { checkAndNotifyGoalAchieved } from '../services/goal.service.js';

const router = express.Router();

const checkGoalsForCategory = async (userId: string, category: string) => {
  try {
    const goals = await GoalModel.find({ userId, linkedCategory: category });
    for (const goal of goals) {
      checkAndNotifyGoalAchieved(userId, goal._id.toString()).catch((err) =>
        console.error(`[GOAL] Error checking goal ${goal._id}:`, err),
      );
    }
  } catch (error) {
    console.error(
      `[GOAL] Error finding goals for category ${category}:`,
      error,
    );
  }
};

router.get('/getAllByUserId/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Extract query parameters
    const {
      page,
      limit,
      category,
      type,
      paymentMethod,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    } = req.query;

    const query: any = { userId };

    // Apply filters
    if (category) {
      query.category = category;
    }
    if (type) {
      query.type = type;
    }
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    // Pagination
    const pageNum = page ? parseInt(page as string) : 1;
    const limitNum = limit ? parseInt(limit as string) : 0; // 0 means no limit (all)

    // Sorting
    const sortField = (sortBy as string) || 'date';
    const sortDir = sortOrder === 'asc' ? 1 : -1;
    const sort: any = { [sortField]: sortDir };

    // If default sort is by date, we might want to also sort by _id for stability if dates are equal?
    // Mongoose sorts by insertion order if keys are equal, usually fine.

    // If no pagination/filters provided, preserve legacy behavior (return all, 404 if empty)
    // Legacy check: Only userId is provided?
    const hasFilters =
      category ||
      type ||
      paymentMethod ||
      startDate ||
      endDate ||
      page ||
      limit ||
      sortBy;

    if (!hasFilters) {
      const records = await FinancialRecordModel.find({ userId });
      if (records.length === 0) {
        return res
          .status(404)
          .json({ message: 'No records found for this user.' });
      }
      return res.status(200).json(records);
    }

    // New behavior with filters/pagination
    let queryBuilder = FinancialRecordModel.find(query).sort(sort);

    if (limitNum > 0) {
      queryBuilder = queryBuilder.skip((pageNum - 1) * limitNum).limit(limitNum);
    }

    const records = await queryBuilder.exec();
    const totalCount = await FinancialRecordModel.countDocuments(query);

    // Return extended response if pagination is requested
    if (page || limit) {
      return res.status(200).json({
        data: records,
        pagination: {
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          pages: limitNum > 0 ? Math.ceil(totalCount / limitNum) : 1,
        },
      });
    }

    // If only filters provided but no pagination params, return array (compatible with simple filter use cases)
    // But filters might return empty array. In legacy, empty -> 404.
    // In search mode, empty -> 200 [].
    // Since "hasFilters" is true, we are in "Search Mode".
    // We should return [] if empty, not 404.

    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).send(error);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, date, description, amount, type, category, paymentMethod } =
      req.body;

    // Validate required fields
    if (!type || !['income', 'expense'].includes(type)) {
      return res
        .status(400)
        .json({ error: 'Valid type (income/expense) is required' });
    }

    const newRecord = new FinancialRecordModel({
      userId,
      date: date || new Date(),
      description,
      amount: Math.abs(amount), // Always store positive amounts
      type, // Make sure this is included
      category,
      paymentMethod,
    });

    const savedRecord = await newRecord.save();

    // Check budget if it's an expense
    if (type === 'expense') {
      // Run asynchronously to not block response
      checkAndNotifyBudgetExceeded(userId, category, savedRecord.date).catch(
        (err) => console.error('Error checking budget:', err),
      );
    }

    // Check goals (regardless of type, usually linked to category)
    checkGoalsForCategory(userId, category);

    res.status(201).json(savedRecord);
  } catch (error) {
    console.error('Error saving record:', error);
    res.status(500).json({ error: 'Failed to create record' });
  }
});

router.post('/bulk', async (req: Request, res: Response) => {
  try {
    const { userId, records } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'No records provided' });
    }

    // Prepare records
    const validRecords = records.map((r: any) => {
      if (!r.type || !['income', 'expense'].includes(r.type)) {
        throw new Error('Invalid record type');
      }
      return {
        userId,
        date: r.date ? new Date(r.date) : new Date(),
        description: r.description,
        amount: Math.abs(r.amount),
        type: r.type,
        category: r.category,
        paymentMethod: r.paymentMethod,
      };
    });

    // Insert
    const inserted = await FinancialRecordModel.insertMany(validRecords);

    // Budget checks (Async)
    (async () => {
      try {
        // Group by category+period to minimize calls
        const checksMap = new Map<string, Date>();
        inserted.forEach((r) => {
          if (r.type === 'expense') {
            // const period = r.date.toISOString().slice(0, 7);
            // Use local month to avoid early/late budget reset
            const year = r.date.getFullYear();
            const month = String(r.date.getMonth() + 1).padStart(2, '0');
            const period = `${year}-${month}`;
            const key = `${r.category}|${period}`;
            if (!checksMap.has(key)) {
              checksMap.set(key, r.date);
            }
          }
        });

        for (const [key, date] of checksMap) {
          const [category] = key.split('|');
          if (category) {
            await checkAndNotifyBudgetExceeded(userId, category, date, {
              suppressEmail: true,
            });
          }
        }
      } catch (err) {
        console.error('Bulk budget check error', err);
      }
    })();

    // Goal Checks (Async) - suppress email for bulk?
    // Usually bulk imports should suppress emails for goals too?
    // "Retroactive storms after imports" -> "If detection of historical context is uncertain -> suppress."
    // For bulk import, we should suppress emails.
    (async () => {
      try {
        const categories = new Set<string>();
        inserted.forEach((r) => categories.add(r.category));

        for (const category of categories) {
          const goals = await GoalModel.find({
            userId,
            linkedCategory: category,
          });
          for (const goal of goals) {
            checkAndNotifyGoalAchieved(userId, goal._id.toString(), {
              suppressEmail: true,
            }).catch((err) =>
              console.error(`[GOAL] Error checking goal ${goal._id}:`, err),
            );
          }
        }
      } catch (err) {
        console.error('Bulk goal check error', err);
      }
    })();

    res.status(201).json(inserted);
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ message: 'Failed to import records' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const recordId = req.params.id;
    const updateBody = req.body;

    // Find the original record first to handle category/date changes
    const originalRecord = await FinancialRecordModel.findById(recordId);
    if (!originalRecord) {
      return res.status(404).json({ message: 'Record not found.' });
    }

    const updatedRecord = await FinancialRecordModel.findByIdAndUpdate(
      recordId,
      updateBody,
      { new: true },
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: 'Record not found.' });
    }

    res.status(200).json(updatedRecord);

    // Budget Checks (Async)
    (async () => {
      try {
        // 1. Check the new state (if expense)
        if (updatedRecord.type === 'expense') {
          await checkAndNotifyBudgetExceeded(
            updatedRecord.userId,
            updatedRecord.category,
            updatedRecord.date,
          );
        }

        // 2. If category or date changed, check the old state too (to potentially reset notifications)
        // If it was an expense and (category changed OR date changed OR type changed to income)
        const categoryChanged =
          originalRecord.category !== updatedRecord.category;
        const dateChanged =
          originalRecord.date.toISOString().slice(0, 7) !==
          updatedRecord.date.toISOString().slice(0, 7); // Only period change matters for budget
        const typeChanged = originalRecord.type !== updatedRecord.type;

        if (
          originalRecord.type === 'expense' &&
          (categoryChanged || dateChanged || typeChanged)
        ) {
          await checkAndNotifyBudgetExceeded(
            originalRecord.userId,
            originalRecord.category,
            originalRecord.date,
          );
        }

        // Goal Checks
        // Check new category
        await checkGoalsForCategory(
          updatedRecord.userId,
          updatedRecord.category,
        );

        // If category changed, check old category too (might dip below goal?)
        if (categoryChanged) {
          await checkGoalsForCategory(
            originalRecord.userId,
            originalRecord.category,
          );
        }
      } catch (err) {
        console.error('[BUDGET/GOAL] Error checking updates:', err);
      }
    })();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const recordId = req.params.id;
    const deletedRecord =
      await FinancialRecordModel.findByIdAndDelete(recordId);
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Record not found.' });
    }
    res.status(200).json({ message: 'Record deleted successfully.' });

    // Budget Check (Async)
    if (deletedRecord.type === 'expense') {
      checkAndNotifyBudgetExceeded(
        deletedRecord.userId,
        deletedRecord.category,
        deletedRecord.date,
      ).catch((err) =>
        console.error('[BUDGET] Error checking budget on delete:', err),
      );
    }

    // Goal Check (Async)
    checkGoalsForCategory(deletedRecord.userId, deletedRecord.category);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
