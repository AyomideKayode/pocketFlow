import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dashboard } from './index';
import { BrowserRouter } from 'react-router-dom';

// Mocks
vi.mock('../../contexts/auth-context', () => ({
  useAuth: () => ({
    user: { uid: 'user-123', displayName: 'Test User' },
  }),
}));

const mockRecords = [
  { _id: '1', amount: 100, type: 'income', date: new Date().toISOString() },
  { _id: '2', amount: 50, type: 'expense', date: new Date().toISOString() },
  { _id: '3', amount: 20, type: 'expense', date: new Date().toISOString() },
];

vi.mock('../../contexts/financial-record-context', () => ({
  useFinancialRecords: () => ({
    records: mockRecords,
    recentRecords: mockRecords,
    loading: false,
    fetchRecords: vi.fn(),
  }),
}));

vi.mock('../../hooks/useCurrencyFormatter', () => ({
  useCurrencyFormatter: () => ({
    format: (amount: number) => `$${amount}`,
  }),
}));

vi.mock('../../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: vi.fn(),
  }),
}));

vi.mock('../../contexts/toast-context', () => ({
  useToast: () => ({
    addToast: vi.fn(),
  }),
}));

vi.mock('../../hooks/useBills', () => ({
  useBills: () => ({
    overdue: [],
    loading: false,
  }),
}));

// Mock chart components since they are lazy loaded and complex
vi.mock('../../components/charts/TrendLineChart', () => ({
  TrendLineChart: () => <div>TrendLineChart</div>,
}));
vi.mock('../../components/charts/IncomeExpenseChart', () => ({
  IncomeExpenseChart: () => <div>IncomeExpenseChart</div>,
}));
vi.mock('../../components/charts/CategoryBreakdownChart', () => ({
  CategoryBreakdownChart: () => <div>CategoryBreakdownChart</div>,
}));
vi.mock('./financialRecordList', () => ({
  FinancialRecordList: () => <div>FinancialRecordList</div>,
}));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate total income correctly', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Income is 100
    // "Total Income" text is in label, amount is in value.
    // The value should be $100
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('should calculate total expenses correctly', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Expenses = 50 + 20 = 70
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('$70')).toBeInTheDocument();
  });

  it('should calculate net balance (income - expenses)', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Balance = 100 - 70 = 30
    expect(screen.getByText('Net Balance')).toBeInTheDocument();
    expect(screen.getByText('$30')).toBeInTheDocument();
  });
});
