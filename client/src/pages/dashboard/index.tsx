import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { useToast } from '../../contexts/toast-context';
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
import './financial-record.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const { records } = useFinancialRecords();

  // Date range state for filtering
  const [dateRange, setDateRange] = useState(getDefaultDateRange());

  // Filter records based on selected date range
  const filteredRecords = useMemo(() => {
    return filterRecordsByDateRange(records, dateRange);
  }, [records, dateRange]);

  // Calculate totals using filtered records
  const totalIncome = filteredRecords
    .filter((record) => record.type === 'income')
    .reduce((acc, record) => acc + Math.abs(record.amount), 0);

  const totalExpenses = filteredRecords
    .filter((record) => record.type === 'expense')
    .reduce((acc, record) => acc + record.amount, 0);

  const totalMonthlyBalance = totalIncome - totalExpenses;

  const scrollToForm = () => {
    const formElement = document.querySelector('.form-container');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Show welcome empty state for new users
  if (records.length === 0) {
    return (
      <div className='dashboard-container fade-in'>
        <EmptyState
          variant='welcome'
          icon='💰'
          title={`Welcome to PocketFlow, ${user?.displayName || user?.email?.split('@')[0]
            }!`}
          description='Start tracking your finances by adding your first financial record. You can log income, expenses, and monitor your spending patterns all in one place.'
          actionText='Add Your First Record'
          onAction={scrollToForm}
        />
        <div className='form-container'>
          <h2>Add New Record</h2>
          <FinancialRecordForm />
        </div>
      </div>
    );
  }

  return (
    <div className='dashboard-container fade-in'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>
          Welcome to PocketFlow, {user?.displayName || user?.email?.split('@')[0]}! 💰
        </h1>
        <div>
          {user && (
            <button
              className='preset-btn'
              onClick={async () => {
                try {
                  const { linkGoogleAccount } = await import('../../lib/firebase');
                  await linkGoogleAccount();
                  // show toast
                  const { useToast: _u } = await import('../../contexts/toast-context');
                } catch (err) {
                  console.error('Link Google failed', err);
                  alert('Link Google failed: ' + (err as any)?.message || err);
                }
              }}
            >
              Link Google Account
            </button>
          )}
        </div>
      </div>
      <p
        style={{
          textAlign: 'center',
          color: '#b0b0b0',
          fontSize: '1.1rem',
          marginBottom: '2rem',
        }}
      >
        Manage your finances with ease
      </p>
      <div className='form-container'>
        <h2>Add New Record</h2>
        <FinancialRecordForm />
      </div>
      <div className='balance-container'>
        <div className='balance-summary'>
          <div className='balance-item income'>
            <span className='balance-label'>💰 Total Income:</span>
            <span className='balance-value income'>
              ${totalIncome.toFixed(2)}
            </span>
          </div>
          <div className='balance-item expense'>
            <span className='balance-label'>💸 Total Expenses:</span>
            <span className='balance-value expense'>
              ${totalExpenses.toFixed(2)}
            </span>
          </div>
          <div className='balance-item total'>
            <span className='balance-title'>Net Balance:</span>
            <span
              className={`balance-amount ${totalMonthlyBalance >= 0 ? 'positive' : 'negative'
                }`}
            >
              ${totalMonthlyBalance.toFixed(2)}
            </span>
          </div>
        </div>
        <p
          style={{
            textAlign: 'center',
            color: '#b0b0b0',
            fontSize: '0.9rem',
            marginTop: '0.5rem',
          }}
        >
          *Based on selected time period
        </p>
      </div>

      {/* Charts Section */}
      <div className='charts-container'>
        <h2>Financial Analytics</h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <DateRangeFilter
            selectedRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <div
            style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
          >
            <button
              className='preset-btn'
              onClick={() => exportRecordsToCSV(filteredRecords)}
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className='charts-grid'>
          <IncomeExpenseChart records={filteredRecords} />
          <CategoryBreakdownChart records={filteredRecords} />
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <TrendLineChart records={filteredRecords} />
        </div>
      </div>

      <div className='list-container'>
        <h2>Your Financial Records</h2>
        <FinancialRecordList />
      </div>
    </div>
  );
};
