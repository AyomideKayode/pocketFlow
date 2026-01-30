import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Papa from 'papaparse';
import { Upload, X, Check, AlertCircle, FileText, Loader2 } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useFinancialRecords, type FinancialRecord } from '../contexts/financial-record-context';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedRow {
  date: string;
  amount: string;
  category: string;
  description: string;
}

interface ValidatedRow {
  original: ParsedRow;
  isValid: boolean;
  errors: string[];
  payload?: Partial<FinancialRecord>;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'importing'>('upload');
  const [rows, setRows] = useState<ValidatedRow[]>([]);
  const [stats, setStats] = useState({ valid: 0, invalid: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { trackEvent } = useAnalytics();
  const { addBulkRecords } = useFinancialRecords();

  if (!isOpen) return null;

  const reset = () => {
    setStep('upload');
    setRows([]);
    setStats({ valid: 0, invalid: 0 });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const validateRow = (row: any): ValidatedRow => {
    const errors: string[] = [];
    const dateStr = row.date || row.Date;
    const amountStr = row.amount || row.Amount;
    const category = row.category || row.Category;
    const description = row.description || row.Description || '';

    // Validate Date
    const date = new Date(dateStr);
    if (!dateStr || isNaN(date.getTime())) {
      errors.push('Invalid Date');
    }

    // Validate Amount
    const amountNum = parseFloat(amountStr);
    if (amountStr === undefined || isNaN(amountNum) || amountNum <= 0) {
      errors.push('Amount must be positive');
    }

    // Validate Category
    if (!category || typeof category !== 'string' || category.trim() === '') {
      errors.push('Missing Category');
    }

    const isValid = errors.length === 0;
    let payload: Partial<FinancialRecord> | undefined;

    if (isValid) {
      const isIncome = amountNum >= 0;
      payload = {
        date: date,
        amount: Math.abs(amountNum),
        type: isIncome ? 'income' : 'expense',
        category: category.trim(),
        description: description.trim(),
        paymentMethod: 'CSV Import',
      };
    }

    return {
      original: {
        date: dateStr,
        amount: amountStr,
        category: category,
        description: description,
      },
      isValid,
      errors,
      payload,
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    trackEvent('csv_import_started');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          trackEvent('csv_import_failed', { reason: 'parse_error', details: results.errors[0].message });
        }

        const validatedRows = results.data.map((row: any) => validateRow(row));
        const validCount = validatedRows.filter((r) => r.isValid).length;
        const invalidCount = validatedRows.length - validCount;

        setRows(validatedRows);
        setStats({ valid: validCount, invalid: invalidCount });
        setStep('preview');

        trackEvent('csv_import_validated', {
            total_rows: validatedRows.length,
            valid_rows: validCount,
            invalid_rows: invalidCount
        });
      },
      error: (error) => {
        trackEvent('csv_import_failed', { reason: 'parse_error', details: error.message });
      }
    });
  };

  const handleImport = async () => {
    const validRecords = rows.filter((r) => r.isValid).map((r) => r.payload!);
    if (validRecords.length === 0) return;

    setStep('importing');
    try {
      await addBulkRecords(validRecords as FinancialRecord[]);
      trackEvent('csv_import_completed', { record_count: validRecords.length });
      handleClose();
    } catch (error) {
      console.error(error);
      trackEvent('csv_import_failed', { reason: 'api_error' });
      setStep('preview'); // Go back to preview on failure
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-500" />
            Import Transactions from CSV
          </h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {step === 'upload' && (
            <div
              className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              role="button"
              tabIndex={0}
              aria-label="Upload CSV file"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
              />
              <Upload className="h-12 w-12 text-slate-500 mb-4" />
              <p className="text-lg font-medium text-slate-300">Click to upload CSV</p>
              <p className="text-sm text-slate-500 mt-2">Required columns: date, amount, category</p>
            </div>
          )}

          {(step === 'preview' || step === 'importing') && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-emerald-500 font-medium mb-1">
                    <Check className="h-4 w-4" />
                    Valid Records
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">{stats.valid}</div>
                </div>
                <div className="flex-1 bg-rose-500/10 border border-rose-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-rose-500 font-medium mb-1">
                    <AlertCircle className="h-4 w-4" />
                    Invalid Rows (Skipped)
                  </div>
                  <div className="text-2xl font-bold text-rose-400">{stats.invalid}</div>
                </div>
              </div>

              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-800/50 text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium text-right">Amount</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {rows.slice(0, 100).map((row, index) => (
                      <tr key={index} className={row.isValid ? 'hover:bg-slate-800/30' : 'bg-rose-500/5 hover:bg-rose-500/10'}>
                        <td className="px-4 py-3">
                            {row.isValid ? (
                                <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                                <div className="group relative">
                                    <AlertCircle className="h-4 w-4 text-rose-500 cursor-help" />
                                    <div className="absolute left-6 top-0 z-10 hidden w-48 rounded bg-slate-950 p-2 text-xs text-white shadow-xl ring-1 ring-slate-800 group-hover:block">
                                        {row.errors.join(', ')}
                                    </div>
                                </div>
                            )}
                        </td>
                        <td className="px-4 py-3 text-slate-300">{row.original.date}</td>
                        <td className="px-4 py-3 text-slate-300 max-w-[200px] truncate">{row.original.description}</td>
                        <td className="px-4 py-3 text-right text-slate-300">{row.original.amount}</td>
                        <td className="px-4 py-3 text-slate-300">{row.original.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > 100 && (
                    <div className="bg-slate-800/50 p-3 text-center text-xs text-slate-500">
                        Showing first 100 of {rows.length} rows
                    </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          {step === 'preview' && (
            <button
              onClick={handleImport}
              disabled={stats.valid === 0}
              className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Import {stats.valid} Records
            </button>
          )}
          {step === 'importing' && (
             <button disabled className="px-4 py-2 text-sm font-medium bg-emerald-600/50 text-white rounded-lg cursor-not-allowed flex items-center gap-2">
                 <Loader2 className="h-4 w-4 animate-spin" />
                 Importing...
             </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
