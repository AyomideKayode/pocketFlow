import React, { useState } from 'react';
import type { Bill } from '../../types/bill';
import { Loader2 } from 'lucide-react';

interface BillFormProps {
  initialData?: Partial<Bill>;
  onSave: (data: Partial<Bill>) => Promise<void>;
  onCancel: () => void;
}

export const BillForm: React.FC<BillFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [dueDay, setDueDay] = useState(initialData?.dueDay?.toString() || '');
  const [isRecurring, setIsRecurring] = useState(
    initialData?.isRecurring || false,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    const parsedDueDay = parseInt(dueDay, 10);

    if (!name || isNaN(parsedAmount) || isNaN(parsedDueDay)) {
      setError('Please fill all required fields correctly.');
      return;
    }

    if (parsedAmount <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    if (parsedDueDay < 1 || parsedDueDay > 31) {
      setError('Due day must be between 1 and 31.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        name,
        amount: parsedAmount,
        dueDay: parsedDueDay,
        isRecurring,
        // Preserve other fields if editing
        ...(initialData?._id ? { _id: initialData._id } : {}),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to save bill.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4 bg-white dark:bg-slate-900 p-6 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-none'
    >
      <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
        {initialData?._id ? 'Edit Bill' : 'New Bill'}
      </h2>

      {error && (
        <div className='text-red-600 dark:text-red-500 text-sm bg-red-50 dark:bg-red-500/10 p-2 rounded border border-red-200 dark:border-red-500/20'>
          {error}
        </div>
      )}

      <div>
        <label className='block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1'>
          Name
        </label>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-sm dark:shadow-none'
          placeholder='e.g. Rent'
          required
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1'>
            Amount
          </label>
          <input
            type='number'
            min='0.01'
            step='0.01'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className='w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-sm dark:shadow-none'
            placeholder='0.00'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1'>
            Due Day (1-31)
          </label>
          <input
            type='number'
            min='1'
            max='31'
            value={dueDay}
            onChange={(e) => setDueDay(e.target.value)}
            className='w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-sm dark:shadow-none'
            placeholder='15'
            required
          />
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <input
          type='checkbox'
          id='isRecurring'
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className='w-4 h-4 rounded border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-500 focus:ring-emerald-500 shadow-sm dark:shadow-none'
        />
        <label
          htmlFor='isRecurring'
          className='text-sm font-medium text-gray-700 dark:text-slate-300'
        >
          Recurring (Monthly)
        </label>
      </div>

      <div className='flex justify-end gap-3 pt-4'>
        <button
          type='button'
          onClick={onCancel}
          className='px-4 py-2 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors'
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={loading}
          className='flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm shadow-sm dark:shadow-none'
        >
          {loading && <Loader2 className='h-4 w-4 animate-spin' />}
          Save Bill
        </button>
      </div>
    </form>
  );
};
