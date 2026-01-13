import express from 'express';
import type { Request, Response } from 'express';
import FinancialRecordModel from '../schema/financial-records.js';
import { verifyIdToken } from '../lib/firebaseAdmin.js';

const router = express.Router();

// GET /reports/export?start=ISO&end=ISO&format=csv
router.get('/export', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    const idToken = authHeader.split(' ')[1] as string;
    let decoded: any;
    try {
      decoded = await verifyIdToken(idToken);
    } catch (err) {
      console.error('Invalid ID token:', err);
      return res.status(401).json({ message: 'Invalid ID token' });
    }

    const uid = decoded?.uid as string;
    if (!uid) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }

    const { start, end, format } = req.query as {
      start?: string;
      end?: string;
      format?: string;
    };

    const query: any = { userId: uid };
    if (start || end) {
      query.date = {} as any;
      if (start) query.date.$gte = new Date(String(start));
      if (end) query.date.$lte = new Date(String(end));
    }

    // Only CSV supported for now
    const outFormat = (format || 'csv').toLowerCase();
    if (outFormat !== 'csv') {
      return res
        .status(400)
        .json({ message: 'Only csv format is supported at this time' });
    }

    const filename = `pocketflow_${uid}_${start || 'all'}_${end || 'all'}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // CSV header
    const headers = [
      'date',
      'description',
      'amount',
      'type',
      'category',
      'paymentMethod',
      'userId',
    ];
    res.write(headers.join(',') + '\n');

    // Use cursor to stream results
    const cursor = FinancialRecordModel.find(query).sort({ date: 1 }).cursor();

    for await (const doc of cursor) {
      const fields = [
        new Date(doc.date).toISOString(),
        (doc.description || '').replace(/\n/g, ' ').replace(/"/g, '""'),
        String(doc.amount),
        doc.type,
        doc.category || '',
        doc.paymentMethod || '',
        doc.userId || '',
      ];

      const line = fields.map((f) => `"${f}"`).join(',') + '\n';
      // If client disconnected, stop
      if (!res.writableEnded) {
        const ok = res.write(line);
        if (!ok) {
          // backpressure - wait for drain
          await new Promise((resolve) => res.once('drain', resolve));
        }
      } else break;
    }

    res.end();
  } catch (error) {
    console.error('Error exporting records:', error);
    if (!res.headersSent)
      res.status(500).json({ error: 'Failed to export records' });
  }
});

export default router;
