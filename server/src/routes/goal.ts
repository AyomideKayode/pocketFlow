import express from 'express';
import type { Request, Response } from 'express';
import * as GoalService from '../services/goal.service.js';

const router = express.Router();

router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const goals = await GoalService.getGoalsWithProgress(userId);
    res.status(200).json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).send(error);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const goal = await GoalService.createGoal(req.body);
    res.status(201).json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).send(error);
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: 'ID is required' });
    const updated = await GoalService.updateGoal(id, req.body);
    if (!updated) return res.status(404).json({ message: 'Goal not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: 'ID is required' });
    const deleted = await GoalService.deleteGoal(id);
    if (!deleted) return res.status(404).json({ message: 'Goal not found' });
    res.status(200).json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
