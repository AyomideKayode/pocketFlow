import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/sign-profile-upload', verifyAuth, (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'PocketFlow/profile_photos';
    const public_id = `user_${userId}`;

    const paramsToSign = {
      folder,
      public_id,
      timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );

    res.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      public_id,
      folder,
    });
  } catch (error) {
    console.error('Error signing Cloudinary upload:', error);
    res.status(500).json({ message: 'Failed to sign upload request' });
  }
});

export default router;
