import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { FinancialRecordForm } from './financialRecordForm';
import { FinancialRecordList } from './financialRecordList';
import { useFinancialRecords } from '../../contexts/financial-record-context';
import { EmptyState } from '../../components/EmptyState';
import { IncomeExpenseChart } from '../../components/charts/IncomeExpenseChart';
import { CategoryBreakdownChart } from '../../components/charts/CategoryBreakdownChart';
import { DateRangeFilter } from '../../components/DateRangeFilter';
import { TrendLineChart } from '../../components/charts/TrendLineChart';
import { exportRecordsToCSV } from '../../utils/exportUtils';
import {
   filterRecordsByDateRange,
   getDefaultDateRange,
} from '../../utils/chartDataTransforms';
import {
   TrendingUp,
   TrendingDown,
   DollarSign,
   Download,
   Plus,
} from 'lucide-react';

export const Dashboard = () => {
   const { user } = useAuth();
   const { records } = useFinancialRecords();
   const [dateRange, setDateRange] = useState(getDefaultDateRange());
   const [showAddForm, setShowAddForm] = useState(false);

   const filteredRecords = useMemo(() => {
      return filterRecordsByDateRange(records, dateRange);
   }, [records, dateRange]);

   const totalIncome = filteredRecords
      .filter((record) => record.type === 'income')
      .reduce((acc, record) => acc + Math.abs(record.amount), 0);

   const totalExpenses = filteredRecords
      .filter((record) => record.type === 'expense')
      .reduce((acc, record) => acc + record.amount, 0);

   const totalMonthlyBalance = totalIncome - totalExpenses;

   // Initial Empty State for new users
   if (records.length === 0) {
      return (
         <div className='flex min-h-[calc(100vh-4rem)] items-center justify-center'>
            <EmptyState
               variant='welcome'
               icon='💰'
               title={`Welcome to PocketFlow, ${user?.displayName || user?.email?.split('@')[0]}!`}
               description='Start tracking your finances by adding your first financial record. You can log income, expenses, and monitor your spending patterns all in one place.'
               actionText='Add Your First Record'
               onAction={() => setShowAddForm(true)}
            />
            {showAddForm && (
               <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'>
                  <div className='w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl'>
                     <div className='mb-4 flex items-center justify-between'>
                        <h2 className='text-xl font-bold text-white'>Add New Record</h2>
                        <button
                           onClick={() => setShowAddForm(false)}
                           className='text-slate-400 hover:text-white'
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
   }

   return (
      <div className='space-y-8 animate-in fade-in duration-500'>
         {/* Header Section */}
         <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div>
               <h1 className='text-2xl font-bold tracking-tight text-white'>
                  Dashboard
               </h1>
               <p className='text-slate-400'>Overview of your financial health</p>
            </div>

            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
               <DateRangeFilter
                  selectedRange={dateRange}
                  onDateRangeChange={setDateRange}
               />
               <button
                  onClick={() => exportRecordsToCSV(filteredRecords)}
                  className='flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white'
               >
                  <Download className='h-4 w-4' />
                  Export
               </button>
            </div>
         </div>

         {/* Stats Grid */}
         <div className='grid gap-4 md:grid-cols-3'>
            <div className='rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm backdrop-blur-sm'>
               <div className='flex items-center gap-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10'>
                     <TrendingUp className='h-6 w-6 text-emerald-500' />
                  </div>
                  <div>
                     <p className='text-sm font-medium text-slate-400'>Total Income</p>
                     <p className='text-2xl font-bold text-emerald-500'>
                        ${totalIncome.toFixed(2)}
                     </p>
                  </div>
               </div>
            </div>

            <div className='rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm backdrop-blur-sm'>
               <div className='flex items-center gap-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10'>
                     <TrendingDown className='h-6 w-6 text-rose-500' />
                  </div>
                  <div>
                     <p className='text-sm font-medium text-slate-400'>
                        Total Expenses
                     </p>
                     <p className='text-2xl font-bold text-rose-500'>
                        ${totalExpenses.toFixed(2)}
                     </p>
                  </div>
               </div>
            </div>

            <div className='rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm backdrop-blur-sm'>
               <div className='flex items-center gap-4'>
                  <div
                     className={`flex h-12 w-12 items-center justify-center rounded-full ${totalMonthlyBalance >= 0 ? 'bg-indigo-500/10' : 'bg-orange-500/10'}`}
                  >
                     <DollarSign
                        className={`h-6 w-6 ${totalMonthlyBalance >= 0 ? 'text-indigo-500' : 'text-orange-500'}`}
                     />
                  </div>
                  <div>
                     <p className='text-sm font-medium text-slate-400'>Net Balance</p>
                     <p
                        className={`text-2xl font-bold ${totalMonthlyBalance >= 0 ? 'text-indigo-500' : 'text-orange-500'}`}
                     >
                        ${totalMonthlyBalance.toFixed(2)}
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Charts Section */}
         <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7 h-auto'>
            <div className='lg:col-span-4 h-full'>
               <TrendLineChart records={filteredRecords} />
            </div>
            <div className='lg:col-span-3 h-full'>
               <IncomeExpenseChart records={filteredRecords} />
            </div>
         </div>

         <div className='grid gap-4 md:grid-cols-1'>
            <CategoryBreakdownChart records={filteredRecords} />
         </div>

         {/* Transactions Section */}
         <div className='space-y-4 pt-4'>
            <div className='flex items-center justify-between'>
               <h2 className='text-xl font-semibold text-white'>
                  Recent Transactions
               </h2>
               <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className='flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20'
               >
                  <Plus className='h-4 w-4' />
                  Add Transaction
               </button>
            </div>

            {showAddForm && (
               <div className='rounded-xl border border-slate-800 bg-slate-900/50 p-6 animate-in slide-in-from-top-4 backdrop-blur-sm'>
                  <div className='mb-4 flex items-center justify-between'>
                     <h3 className='text-lg font-medium text-white'>Add New Record</h3>
                     <button
                        onClick={() => setShowAddForm(false)}
                        className='text-slate-400 hover:text-white'
                     >
                        Close
                     </button>
                  </div>
                  <FinancialRecordForm onSuccess={() => setShowAddForm(false)} />
               </div>
            )}

            <FinancialRecordList />
         </div>
      </div>
   );
};
