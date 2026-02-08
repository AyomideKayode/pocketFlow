import mongoose from 'mongoose';

export interface EmailPreferences {
  global: boolean;
  categories: {
    alerts: boolean;
    summaries: boolean;
    achievements: boolean;
  };
}

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
  // Email Preferences
  emailPreferences: EmailPreferences;
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
    emailPreferences: {
      global: { type: Boolean, default: true },
      categories: {
        alerts: { type: Boolean, default: true },
        summaries: { type: Boolean, default: true },
        achievements: { type: Boolean, default: true },
      },
    },
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
