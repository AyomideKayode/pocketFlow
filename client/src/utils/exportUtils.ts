import type { FinancialRecord } from '../contexts/financial-record-context';
import { getIdToken } from '../lib/firebase';

export const exportRecordsToCSV = (
  records: FinancialRecord[],
  filename = 'pocketflow_records.csv',
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
      r.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(','),
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

export const requestServerExport = async (startDate: Date, endDate: Date) => {
  const token = await getIdToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/reports/export`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      }),
    },
  );

  if (!response.ok) throw new Error('Export request failed');
  return response.json(); // { jobId, status }
};

export const checkExportStatus = async (jobId: string) => {
  const token = await getIdToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/reports/export/${jobId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) throw new Error('Status check failed');
  return response.json(); // { status, ... }
};

export const downloadExport = async (jobId: string) => {
  const token = await getIdToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/reports/export/${jobId}/download`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) throw new Error('Download failed');

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;

  const disposition = response.headers.get('Content-Disposition');
  let filename = 'export.csv';
  if (disposition && disposition.indexOf('attachment') !== -1) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }

  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};
