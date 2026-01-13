import type { FinancialRecord } from '../contexts/financial-record-context';

export const exportRecordsToCSV = (
  records: FinancialRecord[],
  filename = 'pocketflow_records.csv'
) => {
  if (!records || records.length === 0) return;

  const headers = [
    'date',
    'description',
    'amount',
    'type',
    'category',
    'paymentMethod',
    'userId',
  ];
  const rows = records.map((r) => [
    new Date(r.date).toISOString(),
    (r.description || '').replace(/\n/g, ' '),
    r.amount.toString(),
    r.type,
    r.category || '',
    r.paymentMethod || '',
    r.userId || '',
  ]);

  const csvContent = [headers, ...rows]
    .map((r) =>
      r.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
