import { useState } from 'react';
import { useBudgets, Budget } from '../../contexts/budget-context';
import { Plus, Trash2, Edit2, AlertTriangle, X, DollarSign, PieChart } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const EXPENSE_CATEGORIES = [
  'Rent / Mortgage', 'Utilities', 'Maintenance',
  'Groceries', 'Dining Out', 'Coffee & Snacks',
  'Fuel', 'Public Transport', 'Ride Hailing', 'Car Maintenance',
  'Medical', 'Pharmacy', 'Fitness',
  'Debt Repayment', 'Bank Fees', 'Insurance',
  'Entertainment', 'Subscriptions', 'Shopping', 'Personal Care',
  'Education', 'Books & Courses',
  'Flights', 'Accommodation',
  'Gifts & Donations', 'Miscellaneous',
];

export const Budgets = () => {
  const { budgets, addBudget, updateBudget, deleteBudget } = useBudgets();
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // Form State
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const openAddModal = () => {
    setEditingBudget(null);
    setCategory('');
    setAmount('');
    setShowModal(true);
  };

  const openEditModal = (budget: Budget) => {
    setEditingBudget(budget);
    setCategory(budget.category);
    setAmount(budget.amount.toString());
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    const period = new Date().toISOString().slice(0, 7); // Current Month YYYY-MM

    if (editingBudget && editingBudget._id) {
      await updateBudget(editingBudget._id, { category, amount: val });
    } else {
      await addBudget({
          userId: '', // Context will overwrite this with actual user ID
          category,
          amount: val,
          period
      });
    }
    setShowModal(false);
  };

  // Helper to format currency
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className='space-y-6 animate-in fade-in duration-500'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-white'>Monthly Budgets</h1>
          <p className='text-slate-400'>Set spending limits for categories.</p>
        </div>
        <button
          onClick={openAddModal}
          className='flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20'
        >
          <Plus className='h-4 w-4' />
          Set Budget
        </button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {budgets.map((budget) => {
          const percent = budget.percent || 0;
          const isOver = percent > 100;

          return (
            <div key={budget._id} className='rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm'>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <div className='p-2 rounded-lg bg-slate-800 text-emerald-500'>
                    <PieChart className='h-4 w-4' />
                  </div>
                  <h3 className='font-medium text-white'>{budget.category}</h3>
                </div>
                <div className='flex gap-1'>
                  <button onClick={() => openEditModal(budget)} className='p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors'>
                    <Edit2 className='h-4 w-4' />
                  </button>
                  <button onClick={() => budget._id && deleteBudget(budget._id)} className='p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-950/30 rounded-md transition-colors'>
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>

              <div className='mb-2 flex items-baseline justify-between'>
                <span className={cn('text-2xl font-bold', isOver ? 'text-rose-500' : 'text-white')}>
                  {formatCurrency(budget.spent || 0)}
                </span>
                <span className='text-sm text-slate-500'>of {formatCurrency(budget.amount)}</span>
              </div>

              <div className='relative h-2 w-full overflow-hidden rounded-full bg-slate-800'>
                <div
                  className={cn('h-full transition-all duration-500', isOver ? 'bg-rose-500' : 'bg-emerald-500')}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>

              <div className='mt-2 flex items-center justify-between text-xs'>
                <span className={cn('font-medium', isOver ? 'text-rose-400' : 'text-emerald-400')}>
                  {percent.toFixed(1)}% Used
                </span>
                {isOver && (
                   <span className='flex items-center gap-1 text-rose-500 font-medium'>
                     <AlertTriangle className='h-3 w-3' /> Over Budget
                   </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/50 py-12 text-center'>
            <div className='p-3 rounded-full bg-slate-800/50 mb-3'>
                <DollarSign className='h-6 w-6 text-slate-500' />
            </div>
            <h3 className='text-lg font-medium text-slate-200'>No Budgets Set</h3>
            <p className='text-slate-500 max-w-sm mt-1'>Create a budget for a category to start tracking your spending limits.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200'>
           <div className='w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl'>
             <div className='flex items-center justify-between mb-4'>
               <h2 className='text-xl font-bold text-white'>{editingBudget ? 'Edit Budget' : 'Set New Budget'}</h2>
               <button onClick={() => setShowModal(false)} className='text-slate-400 hover:text-white'>
                 <X className='h-5 w-5' />
               </button>
             </div>

             <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='space-y-2'>
                    <label className='text-xs font-medium text-slate-400'>Category</label>
                    <select
                        required
                        className='w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={!!editingBudget} // Maybe prevent changing category on edit? Or allow it.
                    >
                        <option value='' disabled>Select Category</option>
                        {EXPENSE_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className='space-y-2'>
                    <label className='text-xs font-medium text-slate-400'>Monthly Limit</label>
                    <div className='relative'>
                        <DollarSign className='absolute left-3 top-2.5 h-4 w-4 text-slate-500' />
                        <input
                            type='number'
                            required
                            min="1"
                            className='w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder='500.00'
                        />
                    </div>
                </div>

                <button
                    type='submit'
                    className='w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20'
                >
                    {editingBudget ? 'Update Budget' : 'Set Budget'}
                </button>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};
