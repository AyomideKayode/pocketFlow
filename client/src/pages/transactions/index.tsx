import { useState } from 'react';
import { FinancialRecordList } from '../dashboard/financialRecordList';
import { FinancialRecordForm } from '../dashboard/financialRecordForm';
import { Plus } from 'lucide-react';

export const Transactions = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className='space-y-6 animate-in fade-in duration-500'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-white'>
            Transactions
          </h1>
          <p className='text-slate-400'>
            Manage your financial records. Track income and expenses easily.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className='flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20'
        >
          <Plus className='h-4 w-4' />
          Add Transaction
        </button>
      </div>

      <FinancialRecordList />

      {showAddForm && (
        <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'>
          <div className='w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-200'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-bold text-white'>Add New Record</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className='text-slate-400 hover:text-white transition-colors'
              >
                ✕
              </button>
            </div>
            <FinancialRecordForm onSuccess={() => setShowAddForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
