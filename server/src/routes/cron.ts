import express from 'express';
import { processWeeklySummaries } from '../services/summary.service.js';

const router = express.Router();

router.post('/weekly-summary', async (req, res) => {
  try {
    console.log('[CRON] Weekly summary job triggered via HTTP');

    await processWeeklySummaries();

    res.status(200).json({ message: 'Weekly summary processing completed' });
  } catch (error) {
    console.error('[CRON] Weekly summary job failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
