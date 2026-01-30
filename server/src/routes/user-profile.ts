import express from 'express';
import type { Request, Response } from 'express';
import UserProfileModel from '../schema/user-profile.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:userId', verifyAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const authenticatedUserId = (req as any).user.uid;

    if (userId !== authenticatedUserId) {
      return res
        .status(403)
        .json({ message: 'Forbidden access to user profile' });
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
      return res
        .status(403)
        .json({ message: 'Forbidden access to user profile' });
    }

    // Only allow specific fields to be updated
    const { displayName, currency, photoURL, lastTrackedMonth } = req.body;

    const updatedProfile = await UserProfileModel.findOneAndUpdate(
      { userId },
      {
        userId, // Ensure userId is set on create
        displayName,
        currency,
        photoURL,
        lastTrackedMonth,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
