import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import ExportJobModel from '../schema/export-job.js';
import { verifyIdToken } from '../lib/firebaseAdmin.js';

const router = express.Router();

// Middleware to verify auth
const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }
    const idToken = authHeader.split(' ')[1] || '';
    const decoded = await verifyIdToken(idToken);
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Invalid ID token' });
  }
};

router.post('/export', verifyAuth, async (req: Request, res: Response) => {
  try {
    const uid = (req as any).user.uid;
    const { start, end } = req.body;

    const job = new ExportJobModel({
      userId: uid,
      status: 'pending',
      query: {
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
      },
    });

    await job.save();
    res.json({ jobId: job._id, status: job.status });
  } catch (error) {
    console.error('Create export job error:', error);
    res.status(500).json({ message: 'Failed to create export job' });
  }
});

router.get('/export/:id', verifyAuth, async (req: Request, res: Response) => {
  try {
    const uid = (req as any).user.uid;
    const job = await ExportJobModel.findOne({ _id: req.params.id, userId: uid });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({
      id: job._id,
      status: job.status,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      error: job.error
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job' });
  }
});

router.get('/export/:id/download', async (req: Request, res: Response) => {
  try {
    let idToken = '';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      idToken = authHeader.split(' ')[1] || '';
    } else if (req.query.token) {
        idToken = (req.query.token as string) || '';
    }

    if (!idToken) return res.status(401).json({ message: 'Token required' });

    const decoded = await verifyIdToken(idToken);
    const uid = decoded.uid;

    const job = await ExportJobModel.findOne({ _id: req.params.id, userId: uid });
    if (!job || job.status !== 'completed' || !job.data) {
       return res.status(404).json({ message: 'File not found or not ready' });
    }

    const filename = `pocketflow_export_${job.completedAt?.toISOString().split('T')[0] ?? 'data'}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(job.data);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Download failed' });
  }
});

export default router;
