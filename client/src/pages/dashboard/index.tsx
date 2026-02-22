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
  CreditCard,
  Download,
  Plus,
  Loader2,
  Upload,
  Target,
  Calendar,
  Trophy,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import { useToast } from '../../contexts/toast-context';
import { CsvImportModal } from '../../components/CsvImportModal';
import { useBills } from '../../hooks/useBills';
import { OverdueWarning } from '../../components/bills/OverdueWarning';
import { DailyTip } from '../../components/DailyTip';

// Lazy load chart components for performance
const TrendLineChart = lazy(() =>
  import('../../components/charts/TrendLineChart').then((module) => ({
    default: module.TrendLineChart,
  })),
);
const CategoryBreakdownChart = lazy(() =>
  import('../../components/charts/CategoryBreakdownChart').then((module) => ({
    default: module.CategoryBreakdownChart,
  })),
);
const EnhancedIncomeExpenseChart = lazy(() =>
  import('../../components/charts/EnhancedIncomeExpenseChart').then((module) => ({
    default: module.EnhancedIncomeExpenseChart,
  })),
);

export const Dashboard = () => {
  const { user } = useAuth();
  const { records, recentRecords, loading, fetchRecords } =
    useFinancialRecords();
  const { format } = useCurrencyFormatter();
  const { trackEvent } = useAnalytics();
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [isExporting, setIsExporting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  const { overdue, loading: billsLoading } = useBills();

  const firstName = useMemo(() => {
    if (!user?.displayName) return '';
    const trimmed = user.displayName.trim();
    if (!trimmed) return '';
    return trimmed.split(' ')[0];
  }, [user?.displayName]);

  // Ensure we have all records for charts
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Fetch insights
  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchInsights = async () => {
      try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/insights`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal,
        });

        if (response.ok) {
          const data = await response.json();
          // Transform server data to client expected format
          const transformedInsights = data.map((item: any) => {
            let action = null;
            if (item.id === 'upcoming-bills') {
              action = { route: '/bills', label: 'View Bills' };
            } else if (item.id === 'subscription-check') {
              action = { route: '/bills', label: 'Review Subscriptions' };
            }
            return {
              ...item,
              type: item.id,
              action,
            };
          });

          if (!signal.aborted) {
            setInsights(transformedInsights);
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('Error fetching insights:', error);
      }
    };

    fetchInsights();

    return () => {
      controller.abort();
    };
  }, [user?.uid]);

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

  // Calculate top spending categories for enhanced donut
  const topSpendingData = useMemo(() => {
    const expenses = filteredRecords.filter(r => r.type === 'expense');

    // Group expenses by category
    const categoryTotals = expenses.reduce((acc, record) => {
      const cat = record.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + record.amount;
      return acc;
    }, {} as Record<string, number>);

    // Sort and get top 5
    const sorted = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Calculate other expenses
    const topTotal = sorted.reduce((sum, [, amount]) => sum + amount, 0);
    const otherTotal = totalExpenses - topTotal;

    // Build data array
    const data = [];

    // Add income
    data.push({
      name: 'Income',
      value: totalIncome,
      color: '#10b981', // Emerald
    });

    // Add top 5 expense categories with graduated colors
    const expenseColors = [
      '#ef4444', // Red
      '#f97316', // Orange
      '#f59e0b', // Amber
      '#fb923c', // Light orange
      '#fca5a5', // Light red
    ];

    sorted.forEach(([category, amount], index) => {
      data.push({
        name: category,
        value: amount,
        color: expenseColors[index],
      });
    });

    // Add "Other Expenses" if significant
    if (otherTotal > 0) {
      data.push({
        name: 'Other Expenses',
        value: otherTotal,
        color: '#6b7280', // Gray
      });
    }

    return data;
  }, [filteredRecords, totalIncome, totalExpenses]);

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
    <div className='flex h-full min-h-[300px] w-full items-center justify-center rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm shadow-sm dark:shadow-none'>
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='h-8 w-8 animate-spin text-gray-400 dark:text-slate-500' />
        <span className='text-sm text-gray-500 dark:text-slate-500'>
          Loading chart...
        </span>
      </div>
    </div>
  );

  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      {/* Header Section */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Welcome back{firstName ? `, ${firstName}` : ''}!
          </h1>
          <p className='text-gray-500 dark:text-slate-400'>
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
            className='flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white shadow-sm dark:shadow-none'
          >
            <Upload className='h-4 w-4' />
            Import
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className='flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm dark:shadow-none'
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

      {!billsLoading && overdue.length > 0 && (
        <OverdueWarning count={overdue.length} />
      )}

      {/* Quick Actions */}
      <div className='space-y-2'>
        <h2 className='text-sm font-medium text-gray-500 dark:text-slate-400'>
          Quick Actions
        </h2>
        <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
          {/* Budget Action */}
          <button
            onClick={() => navigate('/budgets')}
            aria-label='Set a new budget'
            className='group relative overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left transition-all hover:border-emerald-500/50 hover:shadow-lg dark:hover:shadow-emerald-900/20 hover:-translate-y-0.5'
          >
            <div className='flex items-start gap-3'>
              <div className='rounded-lg bg-emerald-500/10 p-2.5 group-hover:bg-emerald-500/20 transition-colors'>
                <Target className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-0.5'>
                  Set Budget
                </h3>
                <p className='text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 line-clamp-1'>
                  Control spending by category
                </p>
              </div>
            </div>
          </button>

          {/* Bill Action */}
          <button
            onClick={() => navigate('/bills')}
            aria-label='Add a new bill'
            className='group relative overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left transition-all hover:border-emerald-500/50 hover:shadow-lg dark:hover:shadow-emerald-900/20 hover:-translate-y-0.5'
          >
            <div className='flex items-start gap-3'>
              <div className='rounded-lg bg-emerald-500/10 p-2.5 group-hover:bg-emerald-500/20 transition-colors'>
                <Calendar className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-0.5'>
                  Add Bill
                </h3>
                <p className='text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 line-clamp-1'>
                  Track recurring payments
                </p>
              </div>
            </div>
          </button>

          {/* Goal Action */}
          <button
            onClick={() => navigate('/goals')}
            aria-label='Set a new goal'
            className='group relative overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left transition-all hover:border-emerald-500/50 hover:shadow-lg dark:hover:shadow-emerald-900/20 hover:-translate-y-0.5'
          >
            <div className='flex items-start gap-3'>
              <div className='rounded-lg bg-emerald-500/10 p-2.5 group-hover:bg-emerald-500/20 transition-colors'>
                <Trophy className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-0.5'>
                  Set Goal
                </h3>
                <p className='text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 line-clamp-1'>
                  Save for something special
                </p>
              </div>
            </div>
          </button>

          {/* Learn Action */}
          <button
            onClick={() => navigate('/learn')}
            aria-label='Go to learn page'
            className='group relative overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left transition-all hover:border-emerald-500/50 hover:shadow-lg dark:hover:shadow-emerald-900/20 hover:-translate-y-0.5'
          >
            <div className='flex items-start gap-3'>
              <div className='rounded-lg bg-emerald-500/10 p-2.5 group-hover:bg-emerald-500/20 transition-colors'>
                <BookOpen className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-0.5'>
                  Learn
                </h3>
                <p className='text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 line-clamp-1'>
                  Financial tips & insights
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Insights from Activity */}
      {insights.length > 0 && (
        <div className='space-y-3'>
          {insights.map((insight, index) => (
            <div
              key={index}
              className='flex items-start gap-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 animate-in fade-in duration-300'
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className='flex-shrink-0 rounded-lg bg-amber-500/10 p-2'>
                <Lightbulb className='h-5 w-5 text-amber-500' />
              </div>
              <div className='flex-1 min-w-0'>
                <h4 className='text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1'>
                  {insight.type === 'upcoming-bills' && 'Upcoming Bills'}
                  {insight.type === 'subscription-check' && 'Subscription Check'}
                  {!insight.type && 'Insight'}
                </h4>
                <p className='text-sm text-gray-700 dark:text-slate-300'>
                  {insight.message}
                </p>
              </div>
              {insight.action && (
                <button
                  onClick={() => navigate(insight.action.route)}
                  className='flex-shrink-0 text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors'
                >
                  {insight.action.label} →
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm dark:shadow-none backdrop-blur-sm'>
          <div className='flex items-center gap-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10'>
              <TrendingUp className='h-6 w-6 text-emerald-600 dark:text-emerald-500' />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500 dark:text-slate-400'>
                Total Income
              </p>
              <p className='text-2xl font-bold text-emerald-600 dark:text-emerald-500'>
                {format(totalIncome)}
              </p>
            </div>
          </div>
        </div>

        <div className='rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm dark:shadow-none backdrop-blur-sm'>
          <div className='flex items-center gap-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/10'>
              <TrendingDown className='h-6 w-6 text-rose-600 dark:text-rose-500' />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500 dark:text-slate-400'>
                Total Expenses
              </p>
              <p className='text-2xl font-bold text-rose-600 dark:text-rose-500'>
                {format(totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        <div className='rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm dark:shadow-none backdrop-blur-sm'>
          <div className='flex items-center gap-4'>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${totalMonthlyBalance >= 0 ? 'bg-indigo-100 dark:bg-indigo-500/10' : 'bg-orange-100 dark:bg-orange-500/10'}`}
            >
              <CreditCard
                className={`h-6 w-6 ${totalMonthlyBalance >= 0 ? 'text-indigo-600 dark:text-indigo-500' : 'text-orange-600 dark:text-orange-500'}`}
              />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500 dark:text-slate-400'>
                Net Balance
              </p>
              <p
                className={`text-2xl font-bold ${totalMonthlyBalance >= 0 ? 'text-indigo-600 dark:text-indigo-500' : 'text-orange-600 dark:text-orange-500'}`}
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
        <div className='lg:col-span-3 h-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-none'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Financial Overview
          </h2>
          <div className="h-[300px]">
            <Suspense fallback={<ChartLoading />}>
              <EnhancedIncomeExpenseChart data={topSpendingData} />
            </Suspense>
          </div>
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
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Recent Transactions
          </h2>
          <button
            onClick={() => navigate('/transactions')}
            className='flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors shadow-sm dark:shadow-lg dark:shadow-emerald-900/20'
          >
            <Plus className='h-4 w-4' />
            Add Transaction
          </button>
        </div>

        {/* Use recentRecords (top 5) for dashboard list */}
        <FinancialRecordList limit={5} data={recentRecords} />
      </div>

      {/* Daily Financial Tip */}
      <DailyTip />
    </div>
  );
};
