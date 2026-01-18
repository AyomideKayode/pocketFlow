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
      getValue: () => ({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
        label: 'Last 7 Days',
      }),
    },
    {
      label: 'Last 30 Days',
      getValue: () => ({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
        label: 'Last 30 Days',
      }),
    },
    {
      label: 'This Year',
      getValue: () => ({
        startDate: new Date(new Date().getFullYear(), 0, 1),
        endDate: new Date(),
        label: 'This Year',
      }),
    },
    {
      label: 'All Time',
      getValue: () => ({
        startDate: new Date(2020, 0, 1),
        endDate: new Date(),
        label: 'All Time',
      }),
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
      const startDate = new Date(customStart);
      const endDate = new Date(customEnd);

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
      <div className='flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 p-1'>
        {presetRanges.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(preset)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              selectedRange.label === preset.label
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`relative flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
            showCustom || selectedRange.label === 'Custom Range'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
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
            className='rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
            required
          />
          <span className='text-slate-500'>-</span>
          <input
            type='date'
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className='rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
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
