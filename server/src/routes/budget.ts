import express from 'express';
import type { Request, Response } from 'express';
import * as BudgetService from '../services/budget.service.js';

const router = express.Router();

router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const period = (req.query.period as string) || new Date().toISOString().slice(0, 7); // Default to current YYYY-MM

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const budgets = await BudgetService.getBudgetsWithProgress(userId, period);
    res.status(200).json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).send(error);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const budget = await BudgetService.createBudget(req.body);
    res.status(201).json(budget);
  } catch (error: any) {
    if (error.code === 11000) {
        return res.status(409).json({ message: 'Budget for this category and period already exists.' });
    }
    console.error('Error creating budget:', error);
    res.status(500).send(error);
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: 'ID is required' });
    const updated = await BudgetService.updateBudget(id, req.body);
    if (!updated) return res.status(404).json({ message: 'Budget not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: 'ID is required' });
    const deleted = await BudgetService.deleteBudget(id);
    if (!deleted) return res.status(404).json({ message: 'Budget not found' });
    res.status(200).json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
