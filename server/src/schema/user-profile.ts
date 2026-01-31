import mongoose from 'mongoose';

interface UserProfile {
  userId: string;
  displayName?: string;
  currency: string;
  photoURL?: string;
  lastTrackedMonth?: string;
  // Adoption milestones
  hasCreatedFirstTransaction: boolean;
  hasCreatedFirstBudget: boolean;
  hasCreatedFirstGoal: boolean;
}

const userProfileSchema = new mongoose.Schema<UserProfile>(
  {
    userId: { type: String, required: true, unique: true },
    displayName: { type: String },
    currency: { type: String, required: true, default: 'USD' },
    photoURL: { type: String },
    lastTrackedMonth: { type: String }, // Format: YYYY-MM
    hasCreatedFirstTransaction: { type: Boolean, default: false },
    hasCreatedFirstBudget: { type: Boolean, default: false },
    hasCreatedFirstGoal: { type: Boolean, default: false },
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
