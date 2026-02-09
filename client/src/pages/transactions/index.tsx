import { useState, useEffect, useMemo } from 'react';
import { FinancialRecordList } from '../dashboard/financialRecordList';
import {
  FinancialRecordForm,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from '../dashboard/financialRecordForm';
import {
  Plus,
  Upload,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { CsvImportModal } from '../../components/CsvImportModal';
import {
  useFinancialRecords,
  type FilterState,
} from '../../contexts/financial-record-context';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for classes
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const Transactions = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const { fetchRecords, records, pagination, loading } = useFinancialRecords();

  // Local filter state
  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    limit: 20,
    sortBy: 'date',
    sortOrder: 'desc',
    type: '',
    category: '',
    paymentMethod: '',
    startDate: '',
    endDate: '',
  });

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchRecords(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.page,
    filters.limit,
    filters.sortBy,
    filters.sortOrder,
    filters.type,
    filters.category,
    filters.paymentMethod,
    filters.startDate,
    filters.endDate,
    // Intentionally excluding fetchRecords to avoid loops, though it should be stable
  ]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => {
      const updates: any = { [key]: value, page: 1 };

      // If changing type, clear the category as options will change
      if (key === 'type') {
        updates.category = '';
      }

      return { ...prev, ...updates };
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      sortBy: 'date',
      sortOrder: 'desc',
      type: '',
      category: '',
      paymentMethod: '',
      startDate: '',
      endDate: '',
    });
  };

  const refreshList = () => {
    fetchRecords(filters);
  };

  // Derived categories based on selected type
  const availableCategories = useMemo(() => {
    if (filters.type === 'income') return INCOME_CATEGORIES;
    if (filters.type === 'expense') return EXPENSE_CATEGORIES;
    return Array.from(
      new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]),
    ).sort();
  }, [filters.type]);

  const selectClass =
    'h-9 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500';

  return (
    <div className='space-y-6 animate-in fade-in duration-500 pb-20'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-white'>
            Transactions
          </h1>
          <p className='text-slate-400'>
            Manage and search your financial history.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setShowImportModal(true)}
            className='flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white'
          >
            <Upload className='h-4 w-4' />
            Import CSV
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className='flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20'
          >
            <Plus className='h-4 w-4' />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className='rounded-xl border border-slate-800 bg-slate-900/50 p-4'>
        <div className='flex items-center gap-2 mb-4 text-sm font-medium text-slate-400'>
          <Filter className='h-4 w-4' />
          Filters & Sort
          {(filters.type ||
            filters.category ||
            filters.paymentMethod ||
            filters.startDate ||
            filters.endDate) && (
            <button
              onClick={clearFilters}
              className='ml-auto text-xs text-emerald-500 hover:text-emerald-400 flex items-center gap-1'
            >
              <X className='h-3 w-3' />
              Clear All
            </button>
          )}
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
          {/* Type */}
          <div className='space-y-1'>
            <label className='text-xs text-slate-500'>Type</label>
            <select
              className={selectClass}
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value=''>All Types</option>
              <option value='income'>Income</option>
              <option value='expense'>Expense</option>
            </select>
          </div>

          {/* Category */}
          <div className='space-y-1'>
            <label className='text-xs text-slate-500'>Category</label>
            <select
              className={selectClass}
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              disabled={!availableCategories.length}
            >
              <option value=''>All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div className='space-y-1'>
            <label className='text-xs text-slate-500'>Payment Method</label>
            <select
              className={selectClass}
              value={filters.paymentMethod}
              onChange={(e) =>
                handleFilterChange('paymentMethod', e.target.value)
              }
            >
              <option value=''>All Methods</option>
              <option value='Credit Card'>Credit Card</option>
              <option value='Cash'>Cash</option>
              <option value='Bank Transfer'>Bank Transfer</option>
              <option value='CSV Import'>CSV Import</option>
            </select>
          </div>

          {/* Date Range (Simplified as inputs for now, reusing DateRangeFilter logic might require context refactor) */}
          <div className='space-y-1'>
            <label className='text-xs text-slate-500'>Start Date</label>
            <input
              type='date'
              className={selectClass}
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          <div className='space-y-1'>
            <label className='text-xs text-slate-500'>End Date</label>
            <input
              type='date'
              className={selectClass}
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
        </div>

        <div className='mt-4 pt-4 border-t border-slate-800 flex items-center justify-end gap-4'>
          <div className='flex items-center gap-2'>
            <label className='text-xs text-slate-500'>Sort By:</label>
            <select
              className={cn(selectClass, 'w-32')}
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value='date'>Date</option>
              <option value='amount'>Amount</option>
            </select>
            <button
              onClick={() =>
                handleFilterChange(
                  'sortOrder',
                  filters.sortOrder === 'asc' ? 'desc' : 'asc',
                )
              }
              className='p-2 rounded-md border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300'
              title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              <ArrowUpDown className='h-4 w-4' />
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className='relative min-h-[200px]'>
        {loading && (
          <div className='absolute inset-0 z-10 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm rounded-xl'>
            <div className='animate-pulse text-emerald-500'>Loading...</div>
          </div>
        )}
        <FinancialRecordList data={records} /> {/* Explicitly pass records */}
        {!loading && records.length === 0 && (
          <div className='text-center py-12 text-slate-500'>
            No transactions found matching your filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className='flex items-center justify-between border-t border-slate-800 pt-4'>
          <div className='text-sm text-slate-400'>
            Showing{' '}
            <span className='font-medium text-white'>
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{' '}
            to{' '}
            <span className='font-medium text-white'>
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of{' '}
            <span className='font-medium text-white'>{pagination.total}</span>{' '}
            results
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className='flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <ChevronLeft className='h-4 w-4' />
              Previous
            </button>
            <div className='text-sm text-slate-400'>
              Page {pagination.page} of {pagination.pages}
            </div>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className='flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Next
              <ChevronRight className='h-4 w-4' />
            </button>
          </div>
        </div>
      )}

      <CsvImportModal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          refreshList();
        }}
      />

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
            <FinancialRecordForm
              onSuccess={() => {
                setShowAddForm(false);
                refreshList();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
