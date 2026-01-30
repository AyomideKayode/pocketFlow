import type { Request, Response, NextFunction } from 'express';
import { verifyIdToken } from '../lib/firebaseAdmin.js';

export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
