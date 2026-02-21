import { useState } from 'react';
import { useGoals, type Goal } from '../../contexts/goal-context';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import { Plus, Trash2, Edit2, Target, X, Calendar } from 'lucide-react';

const SAVINGS_CATEGORIES = [
  'Savings',
  'Investments',
  'Emergency Fund',
];

export const Goals = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals();
  const { format, currencySymbol } = useCurrencyFormatter();
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [linkedCategory, setLinkedCategory] = useState('');
  const [deadline, setDeadline] = useState('');

  const openAddModal = () => {
    setEditingGoal(null);
    setName('');
    setTargetAmount('');
    setLinkedCategory('');
    setDeadline('');
    setShowModal(true);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setName(goal.name);
    setTargetAmount(goal.targetAmount.toString());
    setLinkedCategory(goal.linkedCategory || '');
    setDeadline(
      goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
    );
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetAmount);
    if (isNaN(val) || val <= 0) return;

    const goalData = {
      userId: '', // Context fix needed here too
      name,
      targetAmount: val,
      linkedCategory: linkedCategory || undefined,
      deadline: deadline || undefined,
      currentAmount: 0, // Only relevant for new manual goals, server handles linked ones
    };

    if (editingGoal && editingGoal._id) {
      await updateGoal(editingGoal._id, goalData);
    } else {
      await addGoal({ ...goalData, userId: '' });
    }
    setShowModal(false);
  };

  return (
    <div className='space-y-6 animate-in fade-in duration-500'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Financial Goals
          </h1>
          <p className='text-gray-500 dark:text-slate-400'>
            Track savings and financial targets.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className='flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors shadow-sm dark:shadow-lg dark:shadow-emerald-900/20'
        >
          <Plus className='h-4 w-4' />
          Add Goal
        </button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {goals.map((goal) => {
          const percent = goal.percent || 0;
          const isComplete = percent >= 100;

          return (
            <div
              key={goal._id}
              className='rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm dark:shadow-none relative overflow-hidden'
            >
              {isComplete && (
                <div className='absolute top-0 right-0 p-1 bg-emerald-500 rounded-bl-lg'>
                  <Target className='h-4 w-4 text-white' />
                </div>
              )}

              <div className='flex items-center justify-between mb-4'>
                <h3 className='font-bold text-gray-900 dark:text-white text-lg truncate pr-6'>
                  {goal.name}
                </h3>
                <div className='flex gap-1'>
                  <button
                    onClick={() => openEditModal(goal)}
                    className='p-1.5 text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors'
                  >
                    <Edit2 className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => goal._id && deleteGoal(goal._id)}
                    className='p-1.5 text-gray-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='flex items-end justify-between'>
                  <div>
                    <p className='text-xs text-gray-500 dark:text-slate-400 mb-1'>
                      Saved
                    </p>
                    <p className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
                      {format(Math.max(0, goal.currentAmount))}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-xs text-gray-500 dark:text-slate-400 mb-1'>
                      Target
                    </p>
                    <p className='text-lg font-medium text-gray-900 dark:text-white'>
                      {format(goal.targetAmount)}
                    </p>
                  </div>
                </div>

                <div className='relative h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800'>
                  <div
                    className='h-full bg-emerald-500 transition-all duration-700 ease-out'
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>

                <div className='flex items-center justify-between text-xs text-gray-500 dark:text-slate-400'>
                  <span>{percent.toFixed(1)}% Achieved</span>
                  {goal.deadline && (
                    <span className='flex items-center gap-1'>
                      <Calendar className='h-3 w-3' />
                      {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {goal.linkedCategory && (
                  <div className='mt-2 inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-slate-800 px-2 py-1 text-xs text-gray-700 dark:text-slate-300'>
                    <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                    Auto-tracks: {goal.linkedCategory}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 py-12 text-center'>
          <div className='p-3 rounded-full bg-gray-200 dark:bg-slate-800/50 mb-3'>
            <Target className='h-6 w-6 text-gray-400 dark:text-slate-500' />
          </div>
          <h3 className='text-lg font-medium text-gray-900 dark:text-slate-200'>
            No Goals Yet
          </h3>
          <p className='text-gray-500 dark:text-slate-500 max-w-sm mt-1'>
            Create a savings target to track your progress.
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200'>
          <div className='w-full max-w-md rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                {editingGoal ? 'Edit Goal' : 'New Goal'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className='text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-xs font-medium text-gray-500 dark:text-slate-400'>
                  Goal Name
                </label>
                <input
                  type='text'
                  required
                  className='w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm dark:shadow-none'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='e.g. New Car, Vacation'
                />
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-medium text-gray-500 dark:text-slate-400'>
                  Target Amount
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-2 inline-flex items-center text-sm font-bold text-gray-400 dark:text-slate-500 px-1'>
                    {currencySymbol}
                  </span>
                  <input
                    type='number'
                    required
                    min='1'
                    className='w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-12 pr-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm dark:shadow-none'
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder='1000.00'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-medium text-gray-500 dark:text-slate-400'>
                  Deadline (Optional)
                </label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-slate-500' />
                  <input
                    type='date'
                    className='w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 [color-scheme:light] dark:[color-scheme:dark] shadow-sm dark:shadow-none'
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-medium text-gray-500 dark:text-slate-400'>
                  Auto-track Category (Optional)
                </label>
                <select
                  className='w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm dark:shadow-none'
                  value={linkedCategory}
                  onChange={(e) => setLinkedCategory(e.target.value)}
                >
                  <option value=''>None (Manual Updates)</option>
                  <optgroup label='Savings Categories'>
                    {SAVINGS_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <p className='text-[10px] text-gray-500 dark:text-slate-500'>
                  Link to a savings category to auto-track your balance.
                  Progress updates when you add or withdraw from this category.
                </p>
              </div>

              <button
                type='submit'
                className='w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors shadow-sm dark:shadow-lg dark:shadow-emerald-900/20'
              >
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
