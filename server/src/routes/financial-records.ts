import express from 'express';
import type { Request, Response } from 'express';
import FinancialRecordModel from '../schema/financial-records.js';

const router = express.Router();

router.get('/getAllByUserId/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }
    const records = await FinancialRecordModel.find({ userId });
    if (records.length === 0) {
      return res.status(404).json({ message: 'No records found for this user.' });
    }
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).send(error);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, date, description, amount, type, category, paymentMethod } = req.body;
    
    // Validate required fields
    if (!type || !['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Valid type (income/expense) is required' });
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
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error('Error saving record:', error);
    res.status(500).json({ error: 'Failed to create record' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const recordId = req.params.id;
    const updateBody = req.body;
    const updatedRecord = await FinancialRecordModel.findByIdAndUpdate(recordId, updateBody, { new: true });
    if (!updatedRecord) {
      return res.status(404).json({ message: 'Record not found.' });
    }
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const recordId = req.params.id;
    const deletedRecord = await FinancialRecordModel.findByIdAndDelete(recordId);
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Record not found.' });
    }
    res.status(200).json({ message: 'Record deleted successfully.' });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
