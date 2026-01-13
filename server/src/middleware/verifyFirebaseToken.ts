import type { Request, Response, NextFunction } from 'express';
import { verifyIdToken } from '../lib/firebaseAdmin.js';

export interface AuthedRequest extends Request {
  auth?: any;
}

export const verifyFirebaseTokenMiddleware = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader =
      req.header('authorization') || req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }
    const idToken = authHeader.split(' ')[1];
    const decoded = await verifyIdToken(idToken);
    req.auth = decoded;
    next();
  } catch (err: any) {
    console.error('Invalid ID token:', err);
    return res.status(401).json({ error: 'Invalid ID token' });
  }
};

export default verifyFirebaseTokenMiddleware;
