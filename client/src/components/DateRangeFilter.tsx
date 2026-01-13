import React, { useState } from 'react';

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
      label: 'Last 3 Months',
      getValue: () => ({
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
        label: 'Last 3 Months',
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
        startDate: new Date(2020, 0, 1), // Reasonable start date
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
      } else {
        alert('Start date must be before end date');
      }
    }
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className='date-range-filter'>
      <h3>Filter by Date Range</h3>

      <div className='preset-buttons'>
        {presetRanges.map((preset) => (
          <button
            key={preset.label}
            className={`preset-btn ${selectedRange.label === preset.label ? 'active' : ''
              }`}
            onClick={() => handlePresetClick(preset)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className='custom-range-section'>
        <button
          className={`preset-btn custom-btn ${showCustom ? 'active' : ''}`}
          onClick={() => setShowCustom(!showCustom)}
        >
          Custom Range
        </button>

        {showCustom && (
          <form className='custom-date-form' onSubmit={handleCustomSubmit}>
            <div className='date-inputs'>
              <div className='form-field'>
                <label htmlFor='start-date'>Start Date:</label>
                <input
                  id='start-date'
                  type='date'
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  max={formatDateForInput(new Date())}
                  required
                />
              </div>
              <div className='form-field'>
                <label htmlFor='end-date'>End Date:</label>
                <input
                  id='end-date'
                  type='date'
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  max={formatDateForInput(new Date())}
                  min={customStart}
                  required
                />
              </div>
            </div>
            <button type='submit' className='apply-custom-btn'>
              Apply Custom Range
            </button>
          </form>
        )}
      </div>

      <div className='current-range'>
        <span className='range-label'>Current Range: </span>
        <span className='range-value'>{selectedRange.label}</span>
        {selectedRange.label === 'Custom Range' && (
          <span className='range-dates'>
            ({selectedRange.startDate.toLocaleDateString()} -{' '}
            {selectedRange.endDate.toLocaleDateString()})
          </span>
        )}
      </div>
    </div>
  );
};
