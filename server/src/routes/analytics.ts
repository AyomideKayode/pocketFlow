import express from 'express';
import type { Request, Response } from 'express';
import { verifyAuth } from '../middleware/auth.js';
import {
  recordImportJob,
  getBudgetCycleAnalysis,
  getHistoricalOverBudgetUsers,
} from '../services/analytics.service.js';

const router = express.Router();

// Middleware to protect analytics routes
router.use(verifyAuth);

// Telemetry endpoint for client to report import jobs
router.post('/import-events', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      status,
      totalRows,
      validCount,
      invalidCount,
      errors,
      metadata,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Ensure the authenticated user matches the reported userId
    if ((req as any).user?.uid !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const job = await recordImportJob({
      userId,
      status,
      totalRows,
      validCount,
      invalidCount,
      importErrors: errors,
      metadata,
      timestamp: new Date(),
    });

    res.status(201).json(job);
  } catch (error) {
    console.error('Error recording import job:', error);
    res.status(500).json({ message: 'Failed to record import job' });
  }
});

// Endpoint to retrieve budget cycle analysis for a user
router.get('/budget-analysis/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if ((req as any).user?.uid !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const analysis = await getBudgetCycleAnalysis(userId);
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error fetching budget analysis:', error);
    res.status(500).json({ message: 'Failed to fetch budget analysis' });
  }
});

// Admin/Debug endpoint for historical over-budget detection
router.get('/historical-over-budget', async (req: Request, res: Response) => {
  try {
    const ADMIN_UID = process.env.ADMIN_UID;

    if (!ADMIN_UID) {
      return res.status(500).json({ message: 'Admin UID not configured' });
    }

    if ((req as any).user?.uid !== ADMIN_UID) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const results = await getHistoricalOverBudgetUsers();
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching historical over-budget data:', error);
    res.status(500).json({ message: 'Failed to fetch historical data' });
  }
});

export default router;
