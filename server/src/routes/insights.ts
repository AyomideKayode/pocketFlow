import { Router } from 'express';
import { verifyAuth } from '../middleware/auth.js';
import { getInsights } from '../services/insight.service.js';

const router = Router();

// Get insights for the authenticated user
router.get('/', verifyAuth, async (req: any, res) => {
  try {
    const userId = req.user.uid;
    const insights = await getInsights(userId);
    res.json(insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
