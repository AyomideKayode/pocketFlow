import mongoose from 'mongoose';
import { isValidPeriod } from '../utils/date.js';

export interface Bill {
  userId: string;
  name: string;
  amount: number;
  dueDay: number; // 1-31
  isRecurring: boolean;
  lastPaidPeriod: string | null; // Format: YYYY-MM
  createdAt?: Date;
  updatedAt?: Date;
}

const billSchema = new mongoose.Schema<Bill>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDay: { type: Number, required: true, min: 1, max: 31 },
    isRecurring: { type: Boolean, default: false },
    lastPaidPeriod: {
      type: String,
      default: null,
      validate: {
        validator: function (v: string | null) {
          if (v === null) return true;
          return isValidPeriod(v);
        },
        message: (props: any) =>
          `${props.value} is not a valid period format (YYYY-MM)!`,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient querying by user
billSchema.index({ userId: 1 });

const BillModel = mongoose.model<Bill>('Bill', billSchema);

export default BillModel;
