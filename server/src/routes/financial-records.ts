import express from 'express';
import type { Request, Response } from 'express';
import FinancialRecordModel from '../schema/financial-records.js';
import { checkAndNotifyBudgetExceeded } from '../services/budget.service.js';

const router = express.Router();

router.get('/getAllByUserId/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }
    const records = await FinancialRecordModel.find({ userId });
    if (records.length === 0) {
      return res
        .status(404)
        .json({ message: 'No records found for this user.' });
    }
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
    const validRecords = records.map((r: any) => ({
      userId,
      date: r.date ? new Date(r.date) : new Date(),
      description: r.description,
      amount: Math.abs(r.amount),
      type: r.type,
      category: r.category,
      paymentMethod: r.paymentMethod,
    }));

    // Insert
    const inserted = await FinancialRecordModel.insertMany(validRecords);

    // Budget checks (Async)
    // We want to check unique categories affected
    // Use a Set to store "category|YYYY-MM" strings to deduplicate checks
    const checks = new Set<string>();
    inserted.forEach((r) => {
      if (r.type === 'expense') {
        const period = r.date.toISOString().slice(0, 7);
        // We append the full ISO string to pass a valid date object later,
        // but we key by category+period to avoid redundant checks for same month
        // Actually, checkAndNotifyBudgetExceeded takes a date, so we need a representative date.
        // Let's store the key as "category|period" and value as the date.
        checks.add(`${r.category}|${period}`);
      }
    });

    (async () => {
      try {
        // Group by category+period to minimize calls
        // Since Set only stores strings, we iterate the inserted records again or use a Map
        const checksMap = new Map<string, Date>();
        inserted.forEach((r) => {
          if (r.type === 'expense') {
            const period = r.date.toISOString().slice(0, 7);
            const key = `${r.category}|${period}`;
            if (!checksMap.has(key)) {
              checksMap.set(key, r.date);
            }
          }
        });

        for (const [key, date] of checksMap) {
          const [category] = key.split('|');
          await checkAndNotifyBudgetExceeded(userId, category, date);
        }
      } catch (err) {
        console.error('Bulk budget check error', err);
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
      } catch (err) {
        console.error('[BUDGET] Error checking budget on update:', err);
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
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
