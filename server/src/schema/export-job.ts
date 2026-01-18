import mongoose from 'mongoose';

export interface ExportJob {
  _id?: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  error?: string;
  data?: string; // CSV content
  query?: {
    start?: Date;
    end?: Date;
  };
}

const exportJobSchema = new mongoose.Schema<ExportJob>({
  userId: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  error: { type: String },
  data: { type: String },
  query: {
    start: Date,
    end: Date
  }
});

const ExportJobModel = mongoose.model<ExportJob>('ExportJob', exportJobSchema);
export default ExportJobModel;
