import mongoose from 'mongoose';

interface FinancialRecord {
  userId: string;
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod: string;
}

const financialRecordSchema = new mongoose.Schema<FinancialRecord>(
  {
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    paymentMethod: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const FinancialRecordModel = mongoose.model<FinancialRecord>(
  'FinancialRecord',
  financialRecordSchema,
);

export default FinancialRecordModel;
