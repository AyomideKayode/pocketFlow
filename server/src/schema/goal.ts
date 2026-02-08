import mongoose from 'mongoose';

export interface Goal {
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  linkedCategory?: string;
  achievedNotified?: boolean;
}

const goalSchema = new mongoose.Schema<Goal>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    deadline: { type: Date },
    linkedCategory: { type: String },
    achievedNotified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const GoalModel = mongoose.model<Goal>('Goal', goalSchema);

export default GoalModel;
