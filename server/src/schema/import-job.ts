import mongoose from 'mongoose';

export interface ImportError {
  code: string;
  count: number;
  sample?: string;
}

export interface ImportJob {
  userId: string;
  timestamp: Date;
  status: 'success' | 'failed';
  totalRows: number;
  validCount: number;
  invalidCount: number;
  importErrors: ImportError[];
  metadata?: Record<string, any>;
}

const importJobSchema = new mongoose.Schema<ImportJob>(
  {
    userId: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['success', 'failed'], required: true },
    totalRows: { type: Number, required: true },
    validCount: { type: Number, required: true },
    invalidCount: { type: Number, required: true },
    importErrors: [
      {
        code: { type: String, required: true },
        count: { type: Number, required: true },
        sample: { type: String },
      },
    ],
    metadata: { type: Map, of: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
  },
);

// Index for querying by user and time
importJobSchema.index({ userId: 1, timestamp: -1 });

const ImportJobModel = mongoose.model<ImportJob>('ImportJob', importJobSchema);

export default ImportJobModel;
