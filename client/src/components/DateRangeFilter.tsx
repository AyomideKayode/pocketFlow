import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

export interface DateRange {
  startDate: Date;
  endDate: Date;
  label: string;
}

interface DateRangeFilterProps {
  onDateRangeChange: (range: DateRange) => void;
  selectedRange: DateRange;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onDateRangeChange,
  selectedRange,
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const presetRanges = [
    {
      label: 'Last 7 Days',
      getValue: () => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date();
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        return { startDate: start, endDate: end, label: 'Last 7 Days' };
      },
    },
    {
      label: 'Last 30 Days',
      getValue: () => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date();
        start.setDate(start.getDate() - 30);
        start.setHours(0, 0, 0, 0);
        return { startDate: start, endDate: end, label: 'Last 30 Days' };
      },
    },
    {
      label: 'This Year',
      getValue: () => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date(new Date().getFullYear(), 0, 1);
        start.setHours(0, 0, 0, 0);
        return { startDate: start, endDate: end, label: 'This Year' };
      },
    },
    {
      label: 'All Time',
      getValue: () => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date(2020, 0, 1);
        return { startDate: start, endDate: end, label: 'All Time' };
      },
    },
  ];

  const handlePresetClick = (preset: (typeof presetRanges)[0]) => {
    const range = preset.getValue();
    onDateRangeChange(range);
    setShowCustom(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStart && customEnd) {
      // Use local time for start/end of selected days
      const startDate = new Date(`${customStart}T00:00:00`);
      const endDate = new Date(`${customEnd}T23:59:59.999`);

      if (startDate <= endDate) {
        onDateRangeChange({
          startDate,
          endDate,
          label: 'Custom Range',
        });
        setShowCustom(false);
      }
    }
  };

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <div className='flex items-center gap-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-1 shadow-sm dark:shadow-none'>
        {presetRanges.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(preset)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              selectedRange.label === preset.label
                ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`relative flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
            showCustom || selectedRange.label === 'Custom Range'
              ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
          }`}
        >
          <Calendar className='h-4 w-4' />
          <span>Custom</span>
        </button>
      </div>

      {showCustom && (
        <form
          onSubmit={handleCustomSubmit}
          className='flex items-center gap-2 animate-in fade-in slide-in-from-left-4'
        >
          <input
            type='date'
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className='rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm dark:shadow-none'
            required
          />
          <span className='text-gray-400 dark:text-slate-500'>-</span>
          <input
            type='date'
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className='rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm dark:shadow-none'
            required
          />
          <button
            type='submit'
            className='rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500'
          >
            Apply
          </button>
        </form>
      )}
    </div>
  );
};
