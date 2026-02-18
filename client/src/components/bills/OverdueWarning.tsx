import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OverdueWarningProps {
  count: number;
}

export const OverdueWarning: React.FC<OverdueWarningProps> = ({ count }) => {
  if (count === 0) return null;

  return (
    <div className='rounded-lg border border-red-500/20 bg-red-500/10 p-4 mb-6 flex items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2'>
      <div className='flex gap-3'>
        <div className='mt-0.5 sm:mt-0 text-red-500'>
          <AlertCircle className='h-5 w-5' />
        </div>
        <div>
          <h3 className='text-sm font-semibold text-red-200'>
            Action Required: {count} overdue bill{count !== 1 ? 's' : ''}
          </h3>
          <p className='text-xs text-red-200/70 mt-0.5'>
            Please review your pending payments to stay on track.
          </p>
        </div>
      </div>
      <Link
        to='/bills'
        className='whitespace-nowrap flex items-center gap-1 text-sm font-medium text-red-400 hover:text-red-300 transition-colors bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-full border border-red-500/20'
      >
        Review
        <ArrowRight className='h-3 w-3' />
      </Link>
    </div>
  );
};
