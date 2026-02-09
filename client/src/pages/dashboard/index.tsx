import { useState, useMemo, lazy, Suspense, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { FinancialRecordList } from './financialRecordList';
import { useFinancialRecords } from '../../contexts/financial-record-context';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import { useAnalytics } from '../../hooks/useAnalytics';
import { EmptyState } from '../../components/EmptyState';
import { DashboardSkeleton } from '../../components/skeletons/DashboardSkeleton';
import { DateRangeFilter } from '../../components/DateRangeFilter';
import {
  requestServerExport,
  checkExportStatus,
  downloadExport,
} from '../../utils/exportUtils';
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
  Loader2,
  Upload,
} from 'lucide-react';
import { useToast } from '../../contexts/toast-context';
import { CsvImportModal } from '../../components/CsvImportModal';

// Lazy load chart components for performance
const TrendLineChart = lazy(() =>
  import('../../components/charts/TrendLineChart').then((module) => ({
    default: module.TrendLineChart,
  })),
);
const IncomeExpenseChart = lazy(() =>
  import('../../components/charts/IncomeExpenseChart').then((module) => ({
    default: module.IncomeExpenseChart,
  })),
);
const CategoryBreakdownChart = lazy(() =>
  import('../../components/charts/CategoryBreakdownChart').then((module) => ({
    default: module.CategoryBreakdownChart,
  })),
);

export const Dashboard = () => {
  const { user } = useAuth();
  const { records, recentRecords, loading, fetchRecords } = useFinancialRecords();
  const { format } = useCurrencyFormatter();
  const { trackEvent } = useAnalytics();
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [isExporting, setIsExporting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Ensure we have all records for charts
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

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

  const handleExport = async () => {
    try {
      setIsExporting(true);
      addToast('Starting export...', 'info');

      const { jobId } = await requestServerExport(
        dateRange.startDate,
        dateRange.endDate,
      );

      // Poll
      let status = 'pending';
      let jobData: any = null;

      while (status === 'pending' || status === 'processing') {
        await new Promise((r) => setTimeout(r, 2000)); // wait 2s
        const job = await checkExportStatus(jobId);
        jobData = job;
        status = job.status;
        if (status === 'failed') throw new Error(job.error || 'Export failed');
      }

      if (status === 'completed') {
        addToast('Export completed! Downloading...', 'success');
        await downloadExport(jobId);

        // Track export completion
        trackEvent('csv_export_completed', {
          record_count: jobData?.recordCount || 0,
          format: 'csv',
        });
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to export';
      addToast(errorMessage, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading && records.length === 0) {
    return <DashboardSkeleton />;
  }

  // Initial Empty State for new users
  // Use recentRecords or records length? If records is empty, empty state.
  if (!loading && records.length === 0) {
    return (
      <div className='flex min-h-[calc(100vh-4rem)] items-center justify-center'>
        <div className='space-y-4'>
          <EmptyState
            variant='welcome'
            icon='💰'
            title={`Welcome to PocketFlow, ${user?.displayName || user?.email?.split('@')[0]}!`}
            description='Start tracking your finances by adding your first financial record. You can log income, expenses, and monitor your spending patterns all in one place.'
            actionText='Add Your First Record'
            onAction={() => navigate('/transactions')}
          />
          <button
            onClick={() => setShowImportModal(true)}
            className='flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white'
          >
            <Upload className='h-4 w-4' />
            Import CSV
          </button>
        </div>
        <CsvImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
        />
      </div>
    );
  }

  const ChartLoading = () => (
    <div className='flex h-full min-h-[300px] w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm'>
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='h-8 w-8 animate-spin text-slate-500' />
        <span className='text-sm text-slate-500'>Loading chart...</span>
      </div>
    </div>
  );

  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      {/* Header Section */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-white'>
            Dashboard
          </h1>
          <p className='text-slate-400'>Welcome back!</p>
          <p className='text-slate-400'>
            Here's an overview of your financial health.
          </p>
        </div>

        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <DateRangeFilter
            selectedRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <button
            onClick={() => setShowImportModal(true)}
            className='flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white'
          >
            <Upload className='h-4 w-4' />
            Import
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className='flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isExporting ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Download className='h-4 w-4' />
            )}
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>

      <CsvImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

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
                {format(totalIncome)}
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
                {format(totalExpenses)}
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
                {format(totalMonthlyBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7 h-auto'>
        <div className='lg:col-span-4 h-full'>
          <Suspense fallback={<ChartLoading />}>
            <TrendLineChart records={filteredRecords} />
          </Suspense>
        </div>
        <div className='lg:col-span-3 h-full'>
          <Suspense fallback={<ChartLoading />}>
            <IncomeExpenseChart records={filteredRecords} />
          </Suspense>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-1'>
        <Suspense fallback={<ChartLoading />}>
          <CategoryBreakdownChart records={filteredRecords} />
        </Suspense>
      </div>

      {/* Transactions Section */}
      <div className='space-y-4 pt-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-white'>
            Recent Transactions
          </h2>
          <button
            onClick={() => navigate('/transactions')}
            className='flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20'
          >
            <Plus className='h-4 w-4' />
            Add Transaction
          </button>
        </div>

        {/* Use recentRecords (top 5) for dashboard list */}
        <FinancialRecordList limit={5} data={recentRecords} />
      </div>
    </div>
  );
};
