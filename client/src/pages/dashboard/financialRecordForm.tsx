import { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { useFinancialRecords } from '../../contexts/financial-record-context';
import { DollarSign, Tag, CreditCard, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface FinancialRecordFormProps {
  onSuccess?: () => void;
}

export const FinancialRecordForm: React.FC<FinancialRecordFormProps> = ({
  onSuccess,
}) => {
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const { addRecord } = useFinancialRecords();
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }

    const newRecord = {
      userId: user?.uid ?? '',
      date: new Date(),
      description: description,
      amount: amountValue,
      type: type,
      category: category,
      paymentMethod: paymentMethod,
    };

    addRecord(newRecord);
    setDescription('');
    setAmount('');
    setCategory('');
    setPaymentMethod('');
    setType('expense');
    if (onSuccess) onSuccess();
  };

  const inputClasses =
    'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all';

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* Type Toggle */}
      <div className='flex rounded-lg bg-slate-800/50 p-1'>
        <button
          type='button'
          onClick={() => setType('income')}
          className={cn(
            'flex-1 rounded-md py-2 text-sm font-medium transition-all',
            type === 'income'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50',
          )}
        >
          Income
        </button>
        <button
          type='button'
          onClick={() => setType('expense')}
          className={cn(
            'flex-1 rounded-md py-2 text-sm font-medium transition-all',
            type === 'expense'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50',
          )}
        >
          Expense
        </button>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {/* Amount */}
        <div className='space-y-2'>
          <label className='text-xs font-medium text-slate-400'>Amount</label>
          <div className='relative'>
            <DollarSign className='absolute left-3 top-2.5 h-4 w-4 text-slate-500' />
            <input
              type='number'
              step='0.01'
              required
              className={cn(inputClasses, 'pl-9')}
              value={amount}
              placeholder='0.00'
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        {/* Category */}
        <div className='space-y-2'>
          <label className='text-xs font-medium text-slate-400'>Category</label>
          <div className='relative'>
            <Tag className='absolute left-3 top-2.5 h-4 w-4 text-slate-500' />
            <select
              required
              className={cn(inputClasses, 'pl-9 appearance-none')}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value='' disabled>
                Select Category
              </option>
              <option value='Food'>Food</option>
              <option value='Rent'>Rent</option>
              <option value='Salary'>Salary</option>
              <option value='Utilities'>Utilities</option>
              <option value='Transportation'>Transportation</option>
              <option value='Entertainment'>Entertainment</option>
              <option value='Other'>Other</option>
            </select>
          </div>
        </div>

        {/* Payment Method */}
        <div className='space-y-2'>
          <label className='text-xs font-medium text-slate-400'>
            Payment Method
          </label>
          <div className='relative'>
            <CreditCard className='absolute left-3 top-2.5 h-4 w-4 text-slate-500' />
            <select
              required
              className={cn(inputClasses, 'pl-9 appearance-none')}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value='' disabled>
                Select Method
              </option>
              <option value='Credit Card'>Credit Card</option>
              <option value='Cash'>Cash</option>
              <option value='Bank Transfer'>Bank Transfer</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className='space-y-2'>
          <label className='text-xs font-medium text-slate-400'>
            Description
          </label>
          <div className='relative'>
            <FileText className='absolute left-3 top-2.5 h-4 w-4 text-slate-500' />
            <input
              type='text'
              required
              className={cn(inputClasses, 'pl-9')}
              value={description}
              placeholder='What was this for?'
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button
        type='submit'
        className={cn(
          'w-full rounded-lg px-4 py-2 text-sm font-medium text-white transition-all shadow-lg',
          type === 'income'
            ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20'
            : 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20',
        )}
      >
        Add Record
      </button>
    </form>
  );
};
