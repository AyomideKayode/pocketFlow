import React from 'react';
import type { Bill } from '../../types/bill';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import { getBillDueDate, getDaysOverdue } from '../../utils/bill';
import type { BillVisualState } from '../../utils/bill';
import { Loader2, Calendar, CheckCircle2, Pencil, Trash2 } from 'lucide-react';

interface BillCardProps {
  bill: Bill;
  visualState: BillVisualState;
  currentPeriod: string;
  onMarkPaid: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export const BillCard: React.FC<BillCardProps> = ({
  bill,
  visualState,
  currentPeriod,
  onMarkPaid,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const { format } = useCurrencyFormatter();

  // Visual props
  const isPaid = visualState === 'paid';
  const isOverdue = visualState === 'overdue';

  // Due Date Display
  // "Due Feb 11" or similar
  const dueDate = getBillDueDate(bill, currentPeriod);
  const dueDateDisplay = dueDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  // Overdue microcopy
  const daysLate = isOverdue ? getDaysOverdue(bill, currentPeriod) : 0;

  return (
    <div
      className={`
      flex items-center justify-between p-4 rounded-lg transition-all group border
      ${
        isOverdue
          ? 'bg-red-950/20 border-red-500/50 hover:border-red-400/70'
          : isPaid
            ? 'bg-slate-900 border-slate-800 opacity-75 hover:opacity-100'
            : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
      }
    `}
    >
      <div className='flex items-center gap-4'>
        <button
          onClick={onMarkPaid}
          disabled={isLoading}
          className={`h-6 w-6 rounded-full border flex items-center justify-center transition-colors
            ${
              isPaid
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-slate-600 hover:border-emerald-500 text-transparent hover:text-emerald-500/50'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isPaid ? 'Mark as unpaid' : 'Mark as paid'}
        >
          {isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <CheckCircle2 className='h-4 w-4' />
          )}
        </button>
        <div>
          <h3
            className={`font-medium ${isPaid ? 'text-slate-400 line-through' : 'text-slate-200'}`}
          >
            {bill.name}
          </h3>
          <div className='flex items-center gap-2 text-sm'>
            <span
              className={`flex items-center gap-1 ${isOverdue ? 'text-red-400 font-medium' : 'text-slate-500'}`}
            >
              <Calendar className='h-3 w-3' />
              {isOverdue
                ? `Due ${dueDateDisplay} • ${daysLate} day${daysLate !== 1 ? 's' : ''} late`
                : dueDateDisplay}
            </span>
            {isOverdue && (
              <span className='bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full border border-red-500/20'>
                Overdue
              </span>
            )}
            {bill.isRecurring && !isOverdue && (
              <span className='bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full'>
                Recurring
              </span>
            )}
          </div>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <span
          className={`font-semibold ${isPaid ? 'text-slate-500' : isOverdue ? 'text-red-400' : 'text-emerald-400'}`}
        >
          {format(bill.amount)}
        </span>
        <div className='flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 transition-opacity'>
          <button
            onClick={onEdit}
            disabled={isLoading}
            className='p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded disabled:opacity-50 disabled:cursor-not-allowed'
            title='Edit'
          >
            <Pencil className='h-4 w-4' />
          </button>
          <button
            onClick={onDelete}
            disabled={isLoading}
            className='p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded disabled:opacity-50 disabled:cursor-not-allowed'
            title='Delete'
          >
            <Trash2 className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
};
