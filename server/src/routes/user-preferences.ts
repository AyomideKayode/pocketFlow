import express from 'express';
import { verifyAuth } from '../middleware/auth.js';
import UserProfileModel from '../schema/user-profile.js';

const router = express.Router();

// Helper to get user ID
const getUserId = (req: any) => req.user?.uid;

// GET /preferences
router.get('/preferences', verifyAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const profile = await UserProfileModel.findOne({ userId });

    const defaults = {
      global: true,
      categories: {
        alerts: true,
        summaries: true,
        achievements: true,
      }
    };

    if (!profile) {
        return res.status(200).json(defaults);
    }

    // Safely merge
    const prefs = {
        global: profile.emailPreferences?.global ?? defaults.global,
        categories: {
            alerts: profile.emailPreferences?.categories?.alerts ?? defaults.categories.alerts,
            summaries: profile.emailPreferences?.categories?.summaries ?? defaults.categories.summaries,
            achievements: profile.emailPreferences?.categories?.achievements ?? defaults.categories.achievements,
        }
    };

    return res.status(200).json(prefs);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT /preferences
router.put('/preferences', verifyAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { global, categories } = req.body;

    // Construct update query
    const update: any = {};
    if (global !== undefined) {
        update['emailPreferences.global'] = global;
    }

    if (categories) {
        if (categories.alerts !== undefined) update['emailPreferences.categories.alerts'] = categories.alerts;
        if (categories.summaries !== undefined) update['emailPreferences.categories.summaries'] = categories.summaries;
        if (categories.achievements !== undefined) update['emailPreferences.categories.achievements'] = categories.achievements;
    }

    if (Object.keys(update).length === 0) {
        return res.status(400).json({ message: 'No valid fields provided' });
    }

    const profile = await UserProfileModel.findOneAndUpdate(
        { userId },
        { $set: update },
        { new: true, upsert: true }
    );

    return res.status(200).json(profile.emailPreferences);
  } catch (error) {
    console.error('Error updating preferences:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
