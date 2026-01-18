import ExportJobModel from '../schema/export-job.js';
import FinancialRecordModel from '../schema/financial-records.js';

export const processExportJob = async (jobId: string) => {
  const job = await ExportJobModel.findById(jobId);
  if (!job) return;

  try {
    job.status = 'processing';
    await job.save();

    const query: any = { userId: job.userId };
    if (job.query?.start || job.query?.end) {
      query.date = {};
      if (job.query.start) query.date.$gte = job.query.start;
      if (job.query.end) query.date.$lte = job.query.end;
    }

    const records = await FinancialRecordModel.find(query).sort({ date: 1 });

    const headers = [
      'date',
      'description',
      'amount',
      'type',
      'category',
      'paymentMethod',
      'userId',
    ];

    let csv = headers.join(',') + '\n';

    for (const doc of records) {
      const fields = [
        new Date(doc.date).toISOString(),
        (doc.description || '').replace(/\n/g, ' ').replace(/"/g, '""'),
        String(doc.amount),
        doc.type,
        doc.category || '',
        doc.paymentMethod || '',
        doc.userId || '',
      ];
      csv += fields.map((f) => `"${f}"`).join(',') + '\n';
    }

    job.data = csv;
    job.status = 'completed';
    job.completedAt = new Date();
    await job.save();

  } catch (error: any) {
    console.error(`Export job ${jobId} failed:`, error);
    job.status = 'failed';
    job.error = error.message;
    await job.save();
  }
};

export const startExportWorker = () => {
  console.log('Starting export worker...');
  setInterval(async () => {
    try {
      const job = await ExportJobModel.findOne({ status: 'pending' }).sort({ createdAt: 1 });
      if (job && job._id) {
        await processExportJob(job._id.toString());
      }
    } catch (err) {
      console.error('Export worker error:', err);
    }
  }, 2000); // Check every 2 seconds for responsiveness
};
