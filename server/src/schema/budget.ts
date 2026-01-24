import mongoose from 'mongoose';

export interface Budget {
  userId: string;
  category: string;
  amount: number;
  period: string; // Format: YYYY-MM
  notified?: boolean;
}

const budgetSchema = new mongoose.Schema<Budget>(
  {
    userId: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    period: { type: String, required: true },
    notified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index to ensure one budget per category per period for a user
budgetSchema.index({ userId: 1, category: 1, period: 1 }, { unique: true });

// Index for efficient querying of all budgets for a user in a specific period
budgetSchema.index({ userId: 1, period: 1 });

const BudgetModel = mongoose.model<Budget>('Budget', budgetSchema);

export default BudgetModel;
