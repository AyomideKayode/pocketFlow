import express from 'express';
import type { Request, Response } from 'express';
import * as BillService from '../services/bill.service.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyAuth);

router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;
    const period = req.query.period as string | undefined;
    const bills = await BillService.getBills(userId, period);
    res.status(200).json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).send(error);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;
    const { name, amount, dueDay, isRecurring } = req.body;

    // Basic validation
    if (!name || amount === undefined || !dueDay) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const bill = await BillService.createBill({
      ...req.body,
      userId,
    });
    res.status(201).json(bill);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error creating bill:', error);
    res.status(500).send(error);
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: 'ID is required' });

    const updated = await BillService.updateBill(id, userId, req.body);
    if (!updated) return res.status(404).json({ message: 'Bill not found' });
    res.status(200).json(updated);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error updating bill:', error);
    res.status(500).send(error);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: 'ID is required' });

    const deleted = await BillService.deleteBill(id, userId);
    if (!deleted) return res.status(404).json({ message: 'Bill not found' });
    res.status(200).json({ message: 'Bill deleted' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).send(error);
  }
});

export default router;
