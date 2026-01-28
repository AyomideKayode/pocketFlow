import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import UserProfileModel from '../schema/user-profile.js';
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

router.get('/:userId', verifyAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const authenticatedUserId = (req as any).user.uid;

    if (userId !== authenticatedUserId) {
      return res.status(403).json({ message: 'Forbidden access to user profile' });
    }

    const profile = await UserProfileModel.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:userId', verifyAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const authenticatedUserId = (req as any).user.uid;

    if (userId !== authenticatedUserId) {
      return res.status(403).json({ message: 'Forbidden access to user profile' });
    }

    // Only allow specific fields to be updated
    const { displayName, currency, photoURL } = req.body;

    const updatedProfile = await UserProfileModel.findOneAndUpdate(
      { userId },
      {
        userId, // Ensure userId is set on create
        displayName,
        currency,
        photoURL
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
