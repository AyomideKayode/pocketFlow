import mongoose from 'mongoose';

interface UserProfile {
  userId: string;
  displayName?: string;
  currency: string;
  photoURL?: string;
}

const userProfileSchema = new mongoose.Schema<UserProfile>(
  {
    userId: { type: String, required: true, unique: true },
    displayName: { type: String },
    currency: { type: String, required: true, default: 'USD' },
    photoURL: { type: String },
  },
  {
    timestamps: true,
  },
);

const UserProfileModel = mongoose.model<UserProfile>(
  'UserProfile',
  userProfileSchema,
);

export default UserProfileModel;
